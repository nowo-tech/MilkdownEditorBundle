/**
 * Yjs provider over Mercure (FR-076).
 *
 * - Down: an EventSource on the hub (private topic per document; the subscriber JWT is the `mercureAuthorization`
 *   cookie the host sets in `POST <url>/token` after checking edit rights).
 * - Up: `POST <url>/update` and `<url>/awareness` (JSON `{c: clientId, d: base64}`); the host applies the update to
 *   its stored state and publishes it (the browser never holds a publisher JWT).
 * - (Re)connect: open the EventSource, `GET <url>/state` (`{state: base64, seed: bool}`), apply it and post our
 *   diff against the server's state vector: offline edits merge, missed events are covered by the state.
 */
import * as Y from 'yjs';
import { Awareness, applyAwarenessUpdate, encodeAwarenessUpdate, removeAwarenessStates } from 'y-protocols/awareness';

export const toBase64 = (u: Uint8Array): string => {
  let s = '';
  for (let i = 0; i < u.length; i += 0x8000) s += String.fromCharCode(...u.subarray(i, i + 0x8000));
  return btoa(s);
};
export const fromBase64 = (s: string): Uint8Array => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));

export type Status = 'connecting' | 'online' | 'offline';
type Message = { t: 'u' | 'a'; c: number; d: string };

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
  private readonly listeners = new Set<(s: Status) => void>();
  private readonly onOnline = (): void => void this.connect().catch(() => undefined);
  private readonly onOffline = (): void => {
    this.es?.close();
    this.setStatus('offline');
  };
  private readonly onUnload = (): void => removeAwarenessStates(this.awareness, [this.doc.clientID], 'window unload');

  constructor(
    readonly doc: Y.Doc,
    private readonly base: string,
    private readonly hubUrl: string,
    private readonly topic: string,
  ) {
    this.awareness = new Awareness(doc);
    doc.on('update', this.onDocUpdate);
    this.awareness.on('update', this.onAwarenessUpdate);
    window.addEventListener('online', this.onOnline);
    window.addEventListener('offline', this.onOffline);
    window.addEventListener('beforeunload', this.onUnload);
  }

  onStatus(fn: (s: Status) => void): void {
    this.listeners.add(fn);
  }

  get hasPendingChanges(): boolean {
    return this.dirty;
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
    this.closed = true;
    this.es?.close();
    this.doc.off('update', this.onDocUpdate);
    this.awareness.off('update', this.onAwarenessUpdate);
    window.removeEventListener('online', this.onOnline);
    window.removeEventListener('offline', this.onOffline);
    window.removeEventListener('beforeunload', this.onUnload);
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
    const token = await fetch(`${this.base}/token`, { method: 'POST', credentials: 'same-origin' });
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
    es.onmessage = (ev: MessageEvent<string>) => this.onMessage(JSON.parse(ev.data) as Message);

    const res = await fetch(`${this.base}/state`, { credentials: 'same-origin' });
    const { state, seed } = (await res.json()) as { state: string; seed: boolean };
    this.seed = seed === true;
    const server = new Y.Doc();
    Y.applyUpdate(server, fromBase64(state));
    Y.applyUpdate(this.doc, fromBase64(state), this);
    const diff = Y.encodeStateAsUpdate(this.doc, Y.encodeStateVector(server));
    server.destroy();
    if (diff.length > 2) await this.post('update', diff);
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
    if (m.c === this.doc.clientID) return;
    if (m.t === 'u') Y.applyUpdate(this.doc, fromBase64(m.d), this);
    else {
      const known = this.awareness.getStates().has(m.c);
      applyAwarenessUpdate(this.awareness, fromBase64(m.d), this);
      if (!known) void this.post('awareness', encodeAwarenessUpdate(this.awareness, [this.doc.clientID]));
    }
  }

  private readonly onDocUpdate = (update: Uint8Array, origin: unknown): void => {
    if (origin === this) return;
    if (this.status !== 'online') {
      this.dirty = true;
      return;
    }
    void this.post('update', update);
  };

  private readonly onAwarenessUpdate = (
    { added, updated, removed }: { added: number[]; updated: number[]; removed: number[] },
    origin: unknown,
  ): void => {
    if (origin === this || this.status !== 'online') return;
    const mine = [...added, ...updated, ...removed].filter((id) => id === this.doc.clientID);
    if (mine.length) void this.post('awareness', encodeAwarenessUpdate(this.awareness, mine));
  };

  private async post(kind: 'update' | 'awareness', data: Uint8Array): Promise<void> {
    try {
      const r = await fetch(`${this.base}/${kind}`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ c: this.doc.clientID, d: toBase64(data) }),
      });
      if (!r.ok) throw new Error(String(r.status));
    } catch {
      if (kind === 'update') this.dirty = true;
      this.setStatus('offline');
    }
  }
}
