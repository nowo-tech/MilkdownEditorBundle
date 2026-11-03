/**
 * Yjs provider over Mercure (FR-076).
 *
 * - Down: an EventSource on the hub (private topic per document; the subscriber JWT is the `mercureAuthorization`
 *   cookie the host sets in `POST <url>/token` after checking edit rights).
 * - Up: `POST <url>/update` and `<url>/awareness` (JSON `{c: clientId, d: base64}`); the host applies the update to
 *   its stored state and publishes it (the browser never holds a publisher JWT).
 * - (Re)connect: open the EventSource, `GET <url>/state` (`{state: base64, seed: bool}`), apply it and post our
 *   diff against the server's state vector: offline edits merge, missed events are covered by the state.
 * - 1.2: a host that cannot merge Yjs updates (e.g. PHP) answers the state as a log —
 *   `{state, updates: [base64…], seq: n, compact: bool}`: the client applies `state` then every update in order (Yjs
 *   updates are idempotent and commutative). With `compact: true` it posts `POST <url>/compact`
 *   (`{c, d: base64 full state, s: seq}`) so the host can replace log entries up to `seq` with that snapshot.
 * - 1.5.1: local updates are coalesced with `Y.mergeUpdates` over `updateDelay` ms (one POST per window, one request in
 *   flight, so the order is kept) and flushed at once on blur, page hide and destroy (`keepalive`); awareness is
 *   throttled to one POST per `awarenessDelay` ms (trailing edge). A 429 is not an outage: the merged update is kept
 *   and retried after `Retry-After` (or an exponential backoff), and the status stays online.
 */
import * as Y from 'yjs';
import { Awareness, applyAwarenessUpdate, encodeAwarenessUpdate, removeAwarenessStates } from 'y-protocols/awareness';

export const toBase64 = (u: Uint8Array): string => {
  let s = '';
  for (let i = 0; i < u.length; i += 0x8000) s += String.fromCharCode(...u.subarray(i, i + 0x8000));
  return btoa(s);
};
export const fromBase64 = (s: string): Uint8Array => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));

export type Status = 'connecting' | 'online' | 'offline' | 'reset';

/** Send windows (1.5.1): coalescing of document updates and throttling of presence, in ms. */
export type CollabTiming = { updateDelay?: number; awarenessDelay?: number };
export const DEFAULT_UPDATE_DELAY = 200;
export const DEFAULT_AWARENESS_DELAY = 750;
/** Longest wait after a 429 (ms), also the cap of a `Retry-After` header. */
export const MAX_BACKOFF = 30_000;
/** `keepalive` bodies are limited to 64 KiB by browsers; larger flushes on page hide are sent normally. */
const KEEPALIVE_MAX = 60_000;

const clamp = (value: unknown, fallback: number, max: number): number =>
  typeof value === 'number' && Number.isFinite(value) ? Math.min(max, Math.max(0, Math.round(value))) : fallback;

/**
 * Delay of a 429 answer: `Retry-After` in seconds or as an HTTP date, otherwise 1 s doubled per attempt.
 *
 * @param header - The `Retry-After` header (or null)
 * @param attempt - 0 for the first 429 in a row
 * @param now - Current time (ms)
 * @returns The delay in ms, at most {@link MAX_BACKOFF}
 */
export function retryAfter(header: string | null, attempt: number, now: number = Date.now()): number {
  const fallback = Math.min(MAX_BACKOFF, 1000 * 2 ** attempt);
  if (!header) return fallback;
  const seconds = Number(header.trim());
  if (/^\d+(\.\d+)?$/.test(header.trim()) && Number.isFinite(seconds)) return Math.min(MAX_BACKOFF, Math.max(0, seconds * 1000));
  const date = Date.parse(header);
  return Number.isNaN(date) ? fallback : Math.min(MAX_BACKOFF, Math.max(0, date - now));
}
type Message = { t: 'u' | 'a' | 'r'; c: number; d: string };
/** `GET <url>/state` answer: `state` (1.0), plus the optional update log of 1.2. */
export type StateAnswer = { state: string; seed?: boolean; updates?: unknown; seq?: unknown; compact?: unknown };

/** The base64 updates of a state answer, in order: `state`, then each string of `updates`; empty strings skipped. */
export const stateUpdates = (answer: StateAnswer): string[] =>
  [answer.state, ...(Array.isArray(answer.updates) ? answer.updates : [])].filter(
    (u): u is string => typeof u === 'string' && u !== '',
  );

export class MercureProvider {
  readonly awareness: Awareness;
  status: Status = 'connecting';
  /** True when the host asked this client to seed the empty document from the field's Markdown. */
  seed = false;
  private es: EventSource | null = null;
  private dirty = false;
  private retry = 0;
  private closed = false;
  private connecting: Promise<void> | null = null;
  private seq = 0;
  private reported = false;
  private readonly listeners = new Set<(s: Status) => void>();
  private readonly onOnline = (): void => void this.connect().catch(() => undefined);
  private readonly onOffline = (): void => {
    this.es?.close();
    this.setStatus('offline');
  };
  private readonly onUnload = (): void => {
    this.flush(true);
    removeAwarenessStates(this.awareness, [this.doc.clientID], 'window unload');
  };
  private readonly onPageHide = (): void => this.flush(true);
  private readonly onVisibility = (): void => {
    if (document.visibilityState === 'hidden') this.flush(true);
  };
  /** Local updates not sent yet (merged on send). */
  private pending: Uint8Array[] = [];
  private inFlight = false;
  private updateTimer: ReturnType<typeof setTimeout> | null = null;
  private awarenessTimer: ReturnType<typeof setTimeout> | null = null;
  private awarenessDue = false;
  /** 429s in a row (backoff exponent); 0 after a success. */
  private throttled = 0;
  private blockedUntil = 0;
  readonly updateDelay: number;
  readonly awarenessDelay: number;

  constructor(
    readonly doc: Y.Doc,
    private readonly base: string,
    private readonly hubUrl: string,
    private readonly topic: string,
    timing: CollabTiming = {},
  ) {
    this.updateDelay = clamp(timing.updateDelay, DEFAULT_UPDATE_DELAY, 2000);
    this.awarenessDelay = clamp(timing.awarenessDelay, DEFAULT_AWARENESS_DELAY, 5000);
    this.awareness = new Awareness(doc);
    doc.on('update', this.onDocUpdate);
    this.awareness.on('update', this.onAwarenessUpdate);
    window.addEventListener('online', this.onOnline);
    window.addEventListener('offline', this.onOffline);
    window.addEventListener('beforeunload', this.onUnload);
    window.addEventListener('pagehide', this.onPageHide);
    document.addEventListener('visibilitychange', this.onVisibility);
  }

  onStatus(fn: (s: Status) => void): void {
    this.listeners.add(fn);
  }

  get hasPendingChanges(): boolean {
    return this.dirty || this.pending.length > 0 || this.inFlight;
  }

  /**
   * Sends the pending local updates now (editor blur, page hide, destroy). With `keepalive` the request outlives the
   * page; it is fire-and-forget.
   *
   * @param keepalive - Whether the page is going away
   */
  flush(keepalive = false): void {
    if (this.updateTimer) clearTimeout(this.updateTimer);
    this.updateTimer = null;
    if (keepalive) {
      if (this.status !== 'online' || !this.pending.length) return;
      const merged = Y.mergeUpdates(this.pending);
      this.pending = [];
      const body = JSON.stringify({ c: this.doc.clientID, d: toBase64(merged) });
      void fetch(`${this.base}/update`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body,
        keepalive: body.length <= KEEPALIVE_MAX,
      }).catch(() => undefined);
      return;
    }
    void this.sendUpdates();
  }

  /** Resolves once the stored state is applied (first connect): the caller then binds the editor. */
  connect(): Promise<void> {
    if (this.closed) return Promise.resolve();
    this.connecting ??= this.doConnect().finally(() => {
      this.connecting = null;
    });
    return this.connecting;
  }

  disconnect(): void {
    this.flush(true);
    if (this.awarenessTimer) clearTimeout(this.awarenessTimer);
    this.closed = true;
    this.es?.close();
    this.doc.off('update', this.onDocUpdate);
    this.awareness.off('update', this.onAwarenessUpdate);
    window.removeEventListener('online', this.onOnline);
    window.removeEventListener('offline', this.onOffline);
    window.removeEventListener('beforeunload', this.onUnload);
    window.removeEventListener('pagehide', this.onPageHide);
    document.removeEventListener('visibilitychange', this.onVisibility);
    this.awareness.destroy();
    this.setStatus('offline');
  }

  private setStatus(s: Status): void {
    this.status = s;
    this.listeners.forEach((fn) => fn(s));
  }

  private async doConnect(): Promise<void> {
    this.setStatus('connecting');
    this.es?.close();
    const client = { 'X-Nowo-Collab-Client': String(this.doc.clientID) };
    const token = await fetch(`${this.base}/token`, { method: 'POST', credentials: 'same-origin', headers: client });
    if (!token.ok) throw new Error(`token ${token.status}`);
    const url = new URL(this.hubUrl, location.href);
    url.searchParams.append('topic', this.topic);
    const es = new EventSource(url, { withCredentials: true });
    this.es = es;
    try {
      await new Promise<void>((resolve, reject) => {
        es.onopen = () => resolve();
        es.onerror = () => reject(new Error('eventsource'));
      });
    } catch (e) {
      this.scheduleReconnect();
      throw e;
    }
    es.onerror = () => {
      this.setStatus('offline');
      es.close();
      this.scheduleReconnect();
    };
    es.onmessage = (ev: MessageEvent<string>) => {
      // CX-I1: a malformed message is ignored, never thrown out of the handler.
      try {
        this.onMessage(JSON.parse(ev.data) as Message);
      } catch {
        // ignored
      }
    };

    const res = await fetch(`${this.base}/state`, { credentials: 'same-origin', headers: client });
    const answer = (await res.json()) as StateAnswer;
    this.seed = answer.seed === true;
    this.seq = typeof answer.seq === 'number' && Number.isInteger(answer.seq) ? answer.seq : 0;
    const server = new Y.Doc();
    try {
      for (const update of stateUpdates(answer)) {
        Y.applyUpdate(server, fromBase64(update));
        Y.applyUpdate(this.doc, fromBase64(update), this);
      }
    } catch {
      server.destroy();
      await this.reportCorrupt();
      return;
    }
    const diff = Y.encodeStateAsUpdate(this.doc, Y.encodeStateVector(server));
    server.destroy();
    // The diff covers every update buffered while offline.
    this.pending = [];
    if (diff.length > 2) await this.post('update', diff);
    if (answer.compact === true && typeof answer.seq === 'number' && Number.isInteger(answer.seq)) {
      await this.compact(answer.seq);
    }
    this.dirty = false;
    this.retry = 0;
    this.setStatus('online');
    await this.post('awareness', encodeAwarenessUpdate(this.awareness, [this.doc.clientID]));
  }

  private scheduleReconnect(): void {
    if (this.closed) return;
    const delay = Math.min(5000, 250 * 2 ** this.retry++);
    window.setTimeout(() => void this.connect().catch(() => undefined), delay);
  }

  private onMessage(m: Message): void {
    if (m.t === 'r') {
      this.closed = true;
      this.es?.close();
      this.setStatus('reset');
      return;
    }
    if (m.c === this.doc.clientID) return;
    if (m.t === 'u') {
      try {
        Y.applyUpdate(this.doc, fromBase64(m.d), this);
      } catch {
        void this.reportCorrupt();
      }
      return;
    }
    const known = this.awareness.getStates().has(m.c);
    try {
      applyAwarenessUpdate(this.awareness, fromBase64(m.d), this);
    } catch {
      return; // CX-I1: a broken presence message is dropped
    }
    if (!known) this.scheduleAwareness();
  }

  /**
   * Reports, once per provider, that the host's log cannot be applied, then stays offline (no posts). The host drops
   * the log and publishes a reset — or refuses (capped) and nothing loops.
   */
  private async reportCorrupt(): Promise<void> {
    this.setStatus('offline');
    if (this.reported) return;
    this.reported = true;
    try {
      await fetch(`${this.base}/corrupt`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ c: this.doc.clientID, s: this.seq }),
      });
    } catch {
      // Nothing more to do: the editor stays offline until the page reloads.
    }
  }

  private readonly onDocUpdate = (update: Uint8Array, origin: unknown): void => {
    if (origin === this) return;
    if (this.status !== 'online') {
      this.dirty = true;
      return;
    }
    this.pending.push(update);
    this.scheduleUpdates(this.updateDelay);
  };

  /** Starts the send window (a running window or backoff is kept: one POST per window). */
  private scheduleUpdates(delay: number): void {
    if (this.updateTimer || this.closed) return;
    const wait = Math.max(delay, this.blockedUntil - Date.now());
    this.updateTimer = setTimeout(() => {
      this.updateTimer = null;
      void this.sendUpdates();
    }, wait);
  }

  /** Merges and posts the pending updates; one request at a time keeps their order. */
  private async sendUpdates(): Promise<void> {
    if (this.inFlight || !this.pending.length || this.status !== 'online') return;
    if (Date.now() < this.blockedUntil) {
      this.scheduleUpdates(0);
      return;
    }
    const merged = this.pending.length === 1 ? this.pending[0]! : Y.mergeUpdates(this.pending);
    this.pending = [];
    this.inFlight = true;
    const result = await this.post('update', merged);
    this.inFlight = false;
    if (result === 'throttled') {
      // Keep the merged update first: it is retried, merged with what was typed meanwhile.
      this.pending.unshift(merged);
      this.scheduleUpdates(0);
    } else if (this.pending.length) {
      this.scheduleUpdates(this.updateDelay);
    }
  }

  /** Trailing-edge throttle of presence: at most one POST per `awarenessDelay`. */
  private scheduleAwareness(): void {
    this.awarenessDue = true;
    if (this.awarenessTimer || this.closed) return;
    const wait = Math.max(this.awarenessDelay, this.blockedUntil - Date.now());
    this.awarenessTimer = setTimeout(() => {
      this.awarenessTimer = null;
      if (!this.awarenessDue || this.status !== 'online') return;
      this.awarenessDue = false;
      void this.post('awareness', encodeAwarenessUpdate(this.awareness, [this.doc.clientID])).then((r) => {
        if (r === 'throttled') this.scheduleAwareness();
      });
    }, wait);
  }

  private readonly onAwarenessUpdate = (
    { added, updated, removed }: { added: number[]; updated: number[]; removed: number[] },
    origin: unknown,
  ): void => {
    if (origin === this || this.status !== 'online') return;
    const mine = [...added, ...updated, ...removed].filter((id) => id === this.doc.clientID);
    if (!mine.length) return;
    if (removed.includes(this.doc.clientID)) {
      // Leaving (unload): tell the others now, it outlives the page.
      void fetch(`${this.base}/awareness`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ c: this.doc.clientID, d: toBase64(encodeAwarenessUpdate(this.awareness, mine)) }),
        keepalive: true,
      }).catch(() => undefined);
      return;
    }
    this.scheduleAwareness();
  };

  /** Sends the full state as a snapshot of the host's log up to `seq` (best effort: a failure changes nothing). */
  private async compact(seq: number): Promise<void> {
    try {
      await fetch(`${this.base}/compact`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ c: this.doc.clientID, d: toBase64(Y.encodeStateAsUpdate(this.doc)), s: seq }),
      });
    } catch {
      // The log stays as it is; the next connect may compact.
    }
  }

  /**
   * Posts one update or presence message.
   *
   * @returns `sent`, `throttled` (429: back off, stay online) or `failed` (offline; edits are sent after reconnect)
   */
  private async post(kind: 'update' | 'awareness', data: Uint8Array): Promise<'sent' | 'throttled' | 'failed'> {
    try {
      const r = await fetch(`${this.base}/${kind}`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ c: this.doc.clientID, d: toBase64(data) }),
      });
      if (r.status === 429) {
        this.blockedUntil = Date.now() + retryAfter(r.headers.get('Retry-After'), this.throttled++);
        return 'throttled';
      }
      if (!r.ok) throw new Error(String(r.status));
      this.throttled = 0;
      return 'sent';
    } catch {
      if (kind === 'update') this.dirty = true;
      this.setStatus('offline');
      return 'failed';
    }
  }
}
