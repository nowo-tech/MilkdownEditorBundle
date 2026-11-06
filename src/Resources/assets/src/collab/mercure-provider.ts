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

/**
 * Send windows (1.5.1): coalescing of document updates and throttling of presence (ms), and the largest merged
 * update the client sends in one POST (raw Yjs bytes; keep it at or below the host's limit, e.g. WikiBundle's
 * `max_update_bytes`).
 */
export type CollabTiming = { updateDelay?: number; awarenessDelay?: number; maxUpdateBytes?: number };
export const DEFAULT_UPDATE_DELAY = 200;
export const DEFAULT_AWARENESS_DELAY = 750;
export const DEFAULT_MAX_UPDATE_BYTES = 256 * 1024;
/** Longest exponential backoff after a 429 without a usable `Retry-After` (ms). */
export const MAX_BACKOFF = 30_000;
/** A `Retry-After` is honoured within [MIN_RETRY_AFTER, MAX_RETRY_AFTER] ms (audit DS-L1: 0 or a past date looped). */
export const MIN_RETRY_AFTER = 1000;
export const MAX_RETRY_AFTER = 60_000;
/** `keepalive` bodies are limited to 64 KiB by browsers; larger flushes on page hide are sent normally. */
const KEEPALIVE_MAX = 60_000;

const clamp = (value: unknown, fallback: number, max: number): number =>
  typeof value === 'number' && Number.isFinite(value) ? Math.min(max, Math.max(0, Math.round(value))) : fallback;

/**
 * Delay of a 429 answer: never shorter than the exponential backoff (1 s doubled per 429 in a row, at most
 * {@link MAX_BACKOFF}); a `Retry-After` (seconds or an HTTP date) may lengthen it, clamped to
 * [{@link MIN_RETRY_AFTER}, {@link MAX_RETRY_AFTER}] — so `0` or a past date cannot make a request loop (DS-L1).
 *
 * @param header - The `Retry-After` header (or null)
 * @param attempt - 0 for the first 429 in a row
 * @param now - Current time (ms)
 * @returns The delay in ms, between 1 s and {@link MAX_RETRY_AFTER}
 */
export function retryAfter(header: string | null, attempt: number, now: number = Date.now()): number {
  const backoff = Math.min(MAX_BACKOFF, 1000 * 2 ** attempt);
  if (!header) return backoff;
  const value = header.trim();
  let asked: number;
  if (/^\d+(\.\d+)?$/.test(value)) asked = Number(value) * 1000;
  else {
    const date = Date.parse(value);
    if (Number.isNaN(date)) return backoff;
    asked = date - now;
  }
  return Math.max(backoff, Math.min(MAX_RETRY_AFTER, Math.max(MIN_RETRY_AFTER, asked)));
}
type Message = { t: 'u' | 'a' | 'r'; c: number; d: string };
/** `GET <url>/state` answer: `state` (1.0), plus the optional update log of 1.2. */
export type StateAnswer = { state: string; seed?: boolean; updates?: unknown; seq?: unknown; compact?: unknown };

/**
 * The host answered, and the answer is no (401, 403, 404, or a 2xx without a usable state): not an outage, retrying the
 * first connection would not help (1.10). A 429, a 5xx or anything else is retried.
 */
export class CollabRefused extends Error {}

/** The base64 updates of a state answer, in order: `state`, then each string of `updates`; empty strings skipped. */
export const stateUpdates = (answer: StateAnswer): string[] =>
  [answer.state, ...(Array.isArray(answer.updates) ? answer.updates : [])].filter(
    (u): u is string => typeof u === 'string' && u !== '',
  );

/**
 * The body of a 2xx `GET <url>/state`. A login page or JSON without a state is refused: read as an answer, it would
 * be an empty document, and the editor would save that over the field (1.10).
 */
async function readState(res: Response): Promise<StateAnswer> {
  let answer: unknown;
  try {
    answer = await res.json();
  } catch {
    throw new CollabRefused('state: not JSON');
  }
  const { state, updates } = (answer ?? {}) as { state?: unknown; updates?: unknown };
  if (typeof state !== 'string' && !Array.isArray(updates)) throw new CollabRefused('state: no state');
  return answer as StateAnswer;
}

export class MercureProvider {
  readonly awareness: Awareness;
  status: Status = 'connecting';
  /** True when the host asked this client to seed the empty document from the field's Markdown. */
  seed = false;
  /** 1.10: the host refused this client before it was ever online; it does not retry. */
  failed = false;
  /** 1.10: connected, not in the session yet: no presence and no compaction until {@link join}. */
  quiet = false;
  private skippedPresence = false;
  private retryHint = 0;
  private wasOnline = false;
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
  // DS-L2: a hidden tab may come back: a normal flush (throttle, one request in flight, re-queued on failure).
  private readonly onVisibility = (): void => {
    if (document.visibilityState === 'hidden') this.flush();
  };
  /** Local updates not sent yet (merged on send). */
  private pending: Uint8Array[] = [];
  private inFlight = false;
  private updateTimer: ReturnType<typeof setTimeout> | null = null;
  private awarenessTimer: ReturnType<typeof setTimeout> | null = null;
  private awarenessDue = false;
  /** 429s in a row per endpoint (backoff exponent); 0 after a success. */
  private throttled = { update: 0, awareness: 0 };
  private blockedUntil = { update: 0, awareness: 0 };
  /** The batch a keepalive flush sent while the page went away; kept until it is known to be stored (DS-L2). */
  private unconfirmed: Uint8Array | null = null;
  readonly updateDelay: number;
  readonly awarenessDelay: number;
  readonly maxUpdateBytes: number;

  constructor(
    readonly doc: Y.Doc,
    private readonly base: string,
    private readonly hubUrl: string,
    private readonly topic: string,
    timing: CollabTiming = {},
  ) {
    this.updateDelay = clamp(timing.updateDelay, DEFAULT_UPDATE_DELAY, 2000);
    this.awarenessDelay = clamp(timing.awarenessDelay, DEFAULT_AWARENESS_DELAY, 5000);
    this.maxUpdateBytes = Math.max(1024, clamp(timing.maxUpdateBytes, DEFAULT_MAX_UPDATE_BYTES, 64 * 1024 * 1024));
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

  /** 1.10: the host's log could not be applied (reported once; the host may publish a reset). */
  get corrupt(): boolean {
    return this.reported;
  }

  get hasPendingChanges(): boolean {
    return this.dirty || this.pending.length > 0 || this.inFlight || this.unconfirmed !== null;
  }

  /**
   * Sends the pending local updates now. Normally (editor blur, form submit, hidden tab) through the regular path:
   * the throttle, one request in flight and re-queueing on failure apply. With `keepalive` (pagehide, unload,
   * destroy) the page is going away: the batch is posted with `keepalive` even while throttled, but it is **kept**
   * and the provider marked dirty until a 2xx confirms it, so a page that comes back (bfcache) or the next connect's
   * state diff still delivers it (DS-L2).
   *
   * @param keepalive - Whether the page is going away
   */
  flush(keepalive = false): void {
    if (this.updateTimer) clearTimeout(this.updateTimer);
    this.updateTimer = null;
    if (!keepalive) {
      if (Date.now() < this.blockedUntil.update) this.scheduleUpdates(0);
      else void this.sendUpdates();
      return;
    }
    if (this.status !== 'online' || !this.pending.length) return;
    const merged = Y.mergeUpdates(this.pending);
    this.pending = [merged];
    this.unconfirmed = merged;
    this.dirty = true;
    const body = JSON.stringify({ c: this.doc.clientID, d: toBase64(merged) });
    void fetch(`${this.base}/update`, {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: body.length <= KEEPALIVE_MAX,
    })
      .then((r) => {
        if (!r.ok || this.unconfirmed !== merged) return;
        // Stored: the page is still here (bfcache), drop the copy unless more was typed meanwhile.
        this.unconfirmed = null;
        if (this.pending[0] === merged) this.pending.shift();
        this.dirty = false;
      })
      .catch(() => undefined);
  }

  /** Resolves once the stored state is applied (first connect): the caller then binds the editor. */
  connect(): Promise<void> {
    if (this.closed) return Promise.resolve();
    this.connecting ??= this.doConnect()
      .catch((error: unknown) => {
        this.es?.close();
        if (!this.closed) this.connectFailed(error);
        throw error;
      })
      .finally(() => {
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

  /** A live session retries, whatever went wrong (1.10: it stayed on `connecting` after a refused token). */
  private connectFailed(error: unknown): void {
    if (this.wasOnline) {
      this.setStatus('offline');
      this.scheduleReconnect();
    } else if (error instanceof CollabRefused) {
      this.failed = true;
      this.setStatus('offline');
    } else {
      this.scheduleReconnect();
    }
  }

  private async doConnect(): Promise<void> {
    this.setStatus('connecting');
    this.es?.close();
    const client = { 'X-Nowo-Collab-Client': String(this.doc.clientID) };
    const token = await fetch(`${this.base}/token`, { method: 'POST', credentials: 'same-origin', headers: client });
    if (!token.ok) throw this.httpError('token', token);
    const url = new URL(this.hubUrl, location.href);
    url.searchParams.append('topic', this.topic);
    const es = new EventSource(url, { withCredentials: true });
    this.es = es;
    await new Promise<void>((resolve, reject) => {
      es.onopen = () => resolve();
      es.onerror = () => reject(new Error('eventsource'));
    });
    if (this.closed) return;
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
    if (!res.ok) throw this.httpError('state', res);
    const answer = await readState(res);
    if (this.closed) return;
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
    // The diff covers every update buffered while offline (and an unconfirmed keepalive batch).
    this.pending = [];
    this.unconfirmed = null;
    if (diff.length > 2) await this.post('update', diff);
    this.dirty = false;
    this.retry = 0;
    this.wasOnline = true;
    this.setStatus('online');
    if (this.closed) return;
    if (this.quiet) {
      this.skippedPresence = true;
      return;
    }
    if (answer.compact === true && typeof answer.seq === 'number' && Number.isInteger(answer.seq)) {
      await this.compact(answer.seq);
    }
    await this.post('awareness', encodeAwarenessUpdate(this.awareness, [this.doc.clientID]));
  }

  /** The error of a refused request. A 429 also sets how long the next attempt waits. */
  private httpError(what: string, res: Response): Error {
    const message = `${what} ${res.status}`;
    if ([401, 403, 404].includes(res.status)) return new CollabRefused(message);
    if (res.status === 429) this.retryHint = retryAfter(res.headers.get('Retry-After'), 0);
    return new Error(message);
  }

  /** In the session now: presence starts, and what was skipped while quiet is sent. */
  join(): void {
    this.quiet = false;
    if (this.skippedPresence) this.scheduleAwareness();
    this.skippedPresence = false;
  }

  private scheduleReconnect(): void {
    if (this.closed) return;
    const delay = Math.max(this.retryHint, Math.min(5000, 250 * 2 ** this.retry++));
    this.retryHint = 0;
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
    const first = !this.reported;
    this.reported = true;
    this.setStatus('offline');
    if (!first) return;
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
    const wait = Math.max(delay, this.blockedUntil.update - Date.now());
    this.updateTimer = setTimeout(() => {
      this.updateTimer = null;
      void this.sendUpdates();
    }, wait);
  }

  /**
   * Merges and posts the pending updates; one request at a time keeps their order. A batch stays within
   * `maxUpdateBytes` (DS-I1): the rest waits for the next window instead of making one oversized POST.
   */
  private async sendUpdates(): Promise<void> {
    if (this.inFlight || !this.pending.length || this.status !== 'online') return;
    if (Date.now() < this.blockedUntil.update) {
      this.scheduleUpdates(0);
      return;
    }
    let count = 0;
    let bytes = 0;
    while (count < this.pending.length && (count === 0 || bytes + this.pending[count]!.length <= this.maxUpdateBytes)) {
      bytes += this.pending[count]!.length;
      count++;
    }
    const batch = this.pending.slice(0, count);
    this.pending = this.pending.slice(count);
    const merged = batch.length === 1 ? batch[0]! : Y.mergeUpdates(batch);
    this.inFlight = true;
    const result = await this.post('update', merged);
    this.inFlight = false;
    if (result === 'sent' && batch.includes(this.unconfirmed as Uint8Array)) {
      this.unconfirmed = null;
      this.dirty = false;
    }
    if (result === 'throttled') {
      // Keep the batch first: it is retried after the backoff, merged with what was typed meanwhile.
      this.pending.unshift(merged);
      if (batch.includes(this.unconfirmed as Uint8Array)) this.unconfirmed = merged;
      this.scheduleUpdates(0);
    } else if (this.pending.length) {
      this.scheduleUpdates(this.updateDelay);
    }
  }

  /** Trailing-edge throttle of presence: at most one POST per `awarenessDelay`. */
  private scheduleAwareness(): void {
    if (this.quiet) return;
    this.awarenessDue = true;
    if (this.awarenessTimer || this.closed) return;
    const wait = Math.max(this.awarenessDelay, this.blockedUntil.awareness - Date.now());
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
    if (origin === this || this.status !== 'online' || this.quiet) return;
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
        this.blockedUntil[kind] = Date.now() + retryAfter(r.headers.get('Retry-After'), this.throttled[kind]++);
        return 'throttled';
      }
      if (!r.ok) throw new Error(String(r.status));
      this.throttled[kind] = 0;
      return 'sent';
    } catch {
      if (kind === 'update') this.dirty = true;
      this.setStatus('offline');
      return 'failed';
    }
  }
}
