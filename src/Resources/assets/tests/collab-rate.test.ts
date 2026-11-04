import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import * as Y from 'yjs';
import {
  DEFAULT_AWARENESS_DELAY,
  DEFAULT_MAX_UPDATE_BYTES,
  DEFAULT_UPDATE_DELAY,
  MAX_BACKOFF,
  MAX_RETRY_AFTER,
  MIN_RETRY_AFTER,
  MercureProvider,
  fromBase64,
  retryAfter,
  toBase64,
  type CollabTiming,
} from '../src/collab/mercure-provider';
import { parseOptions } from '../src/options';

class FakeEventSource {
  onopen: (() => void) | null = null;
  onerror: (() => void) | null = null;
  onmessage: ((e: MessageEvent<string>) => void) | null = null;
  constructor() {
    setTimeout(() => this.onopen?.(), 0);
  }
  close() {}
}

type Post = { kind: string; at: number; d: string; keepalive: boolean; status: number };
let posts: Post[] = [];
let answer: () => Response = () => new Response('');

beforeEach(() => {
  posts = [];
  answer = () => new Response('');
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'Date'] });
  vi.stubGlobal('EventSource', FakeEventSource);
  vi.stubGlobal('fetch', vi.fn(async (url: string, init?: RequestInit) => {
    if (url.endsWith('/token')) return new Response('');
    if (url.endsWith('/state')) return new Response(JSON.stringify({ state: toBase64(Y.encodeStateAsUpdate(new Y.Doc())) }));
    const body = JSON.parse(String(init?.body)) as { d: string };
    const r = url.endsWith('/update') ? answer() : new Response('');
    posts.push({ kind: url.slice(url.lastIndexOf('/') + 1), at: Date.now(), d: body.d, keepalive: init?.keepalive === true, status: r.status });
    return r;
  }));
});
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

async function connected(timing?: CollabTiming): Promise<{ doc: Y.Doc; provider: MercureProvider }> {
  const doc = new Y.Doc();
  const provider = new MercureProvider(doc, '/c', '/hub', 't', timing);
  const connecting = provider.connect();
  await vi.advanceTimersByTimeAsync(1);
  await connecting;
  posts = [];
  return { doc, provider };
}

/** Types `perSecond` characters per second for `seconds`, moving the caret (presence) with each one. */
async function type(doc: Y.Doc, provider: MercureProvider, perSecond: number, seconds: number): Promise<void> {
  const text = doc.getText('t');
  for (let i = 0; i < perSecond * seconds; i++) {
    text.insert(text.length, 'x');
    provider.awareness.setLocalStateField('cursor', { at: text.length });
    await vi.advanceTimersByTimeAsync(1000 / perSecond);
  }
}

/** The document the host rebuilds from every update it accepted (2xx). */
const serverText = (list: Post[]): string => {
  const server = new Y.Doc();
  for (const p of list.filter((x) => x.kind === 'update' && x.status < 300)) Y.applyUpdate(server, fromBase64(p.d));
  return server.getText('t').toString();
};

describe('collaboration request rate (1.5.1)', () => {
  it('15 keystrokes per second for 10 s: 300 requests before, about 63 after', async () => {
    // Before (1.0–1.5.0): one POST per Yjs update and one per presence change.
    const before = await connected({ updateDelay: 0, awarenessDelay: 0 });
    await type(before.doc, before.provider, 15, 10);
    const old = posts.length;
    expect(old).toBe(300); // 30 req/s: over a 600/min limiter in 20 s
    before.provider.disconnect();

    posts = [];
    const after = await connected();
    expect(after.provider.updateDelay).toBe(DEFAULT_UPDATE_DELAY);
    expect(after.provider.awarenessDelay).toBe(DEFAULT_AWARENESS_DELAY);
    await type(after.doc, after.provider, 15, 10);
    await vi.advanceTimersByTimeAsync(1000);
    const updates = posts.filter((p) => p.kind === 'update').length;
    const presence = posts.filter((p) => p.kind === 'awareness').length;
    // One update per 200 ms window and one presence per 750 ms: ~6.3 req/s (380/min) instead of 30.
    console.info(`collab rate: before ${old} requests / 10 s; after ${updates} updates + ${presence} presence = ${updates + presence}`);
    expect(updates).toBeGreaterThanOrEqual(37);
    expect(updates).toBeLessThanOrEqual(51);
    expect(presence).toBeGreaterThanOrEqual(10);
    expect(presence).toBeLessThanOrEqual(14);
    expect(updates + presence).toBeLessThan(old / 4);
    // Nothing is lost and the order is kept: the host rebuilds the same text.
    expect(serverText(posts)).toBe('x'.repeat(150));
    // No window ever sends twice within its delay.
    const at = posts.filter((p) => p.kind === 'update').map((p) => p.at);
    expect(at.slice(1).every((t, i) => t - at[i]! >= DEFAULT_UPDATE_DELAY)).toBe(true);
    after.provider.disconnect();
  });

  it('a 429 keeps the edits, waits for Retry-After, then sends them merged and stays online', async () => {
    const { doc, provider } = await connected();
    const statuses: string[] = [];
    provider.onStatus((s) => statuses.push(s));
    let throttle = 1;
    answer = () => (throttle-- > 0 ? new Response('', { status: 429, headers: { 'Retry-After': '2' } }) : new Response(''));
    doc.getText('t').insert(0, 'ab');
    await vi.advanceTimersByTimeAsync(DEFAULT_UPDATE_DELAY);
    expect(posts).toHaveLength(1);
    expect(provider.hasPendingChanges).toBe(true);
    doc.getText('t').insert(2, 'cd');
    await vi.advanceTimersByTimeAsync(1500);
    expect(posts).toHaveLength(1); // still backing off
    await vi.advanceTimersByTimeAsync(600);
    expect(posts).toHaveLength(2);
    expect(serverText(posts.slice(1))).toBe('abcd'); // one merged retry
    expect(provider.status).toBe('online');
    expect(statuses).toEqual([]);
    expect(provider.hasPendingChanges).toBe(false);
    provider.disconnect();
  });

  it('a 429 on presence retries once the backoff is over', async () => {
    const { provider } = await connected();
    let throttle = 1;
    const fetchMock = vi.mocked(fetch);
    const original = fetchMock.getMockImplementation()!;
    fetchMock.mockImplementation(async (url, init) => {
      const r = await original(url as string, init);
      return String(url).endsWith('/awareness') && throttle-- > 0 ? new Response('', { status: 429 }) : r;
    });
    provider.awareness.setLocalStateField('cursor', 1);
    await vi.advanceTimersByTimeAsync(DEFAULT_AWARENESS_DELAY);
    expect(posts.filter((p) => p.kind === 'awareness')).toHaveLength(1);
    await vi.advanceTimersByTimeAsync(1000);
    expect(posts.filter((p) => p.kind === 'awareness')).toHaveLength(2);
    expect(provider.status).toBe('online');
    provider.disconnect();
  });

  it('flushes at once on blur, page hide, hidden tab and destroy (keepalive only when leaving)', async () => {
    const { doc, provider } = await connected();
    doc.getText('t').insert(0, 'a');
    provider.flush();
    await vi.advanceTimersByTimeAsync(0);
    expect(posts.map((p) => [p.kind, p.keepalive])).toEqual([['update', false]]);
    doc.getText('t').insert(1, 'b');
    window.dispatchEvent(new Event('pagehide'));
    expect(posts.at(-1)).toMatchObject({ kind: 'update', keepalive: true });
    await vi.advanceTimersByTimeAsync(0);
    expect(provider.hasPendingChanges).toBe(false); // confirmed by a 2xx (page kept in the bfcache)
    doc.getText('t').insert(2, 'c');
    Object.defineProperty(document, 'visibilityState', { value: 'hidden', configurable: true });
    document.dispatchEvent(new Event('visibilitychange'));
    expect(posts.at(-1)).toMatchObject({ kind: 'update', keepalive: false }); // a hidden tab may come back
    Object.defineProperty(document, 'visibilityState', { value: 'visible', configurable: true });
    document.dispatchEvent(new Event('visibilitychange'));
    await vi.advanceTimersByTimeAsync(0);
    doc.getText('t').insert(3, 'd');
    provider.disconnect();
    expect(serverText(posts)).toBe('abcd');
    expect(posts.filter((p) => p.keepalive)).toHaveLength(2);
    // Nothing pending: flush is a no-op.
    const count = posts.length;
    provider.flush(true);
    expect(posts.length).toBe(count);
  });

  it('leaving announces the removed presence at once', async () => {
    const { provider } = await connected();
    window.dispatchEvent(new Event('beforeunload'));
    expect(posts.at(-1)).toMatchObject({ kind: 'awareness', keepalive: true });
    provider.disconnect();
  });

  it('an outage still goes offline and the reconnect diff carries the buffered edits', async () => {
    const { doc, provider } = await connected();
    answer = () => new Response('', { status: 500 });
    doc.getText('t').insert(0, 'z');
    await vi.advanceTimersByTimeAsync(DEFAULT_UPDATE_DELAY);
    expect(provider.status).toBe('offline');
    expect(provider.hasPendingChanges).toBe(true);
    doc.getText('t').insert(1, 'y'); // offline: buffered as dirty
    answer = () => new Response('');
    window.dispatchEvent(new Event('online'));
    await vi.advanceTimersByTimeAsync(10);
    expect(provider.status).toBe('online');
    expect(serverText(posts.slice(-2))).toContain('zy');
    provider.disconnect();
  });

  it('reads Retry-After in seconds or as a date and backs off exponentially without it', () => {
    expect(retryAfter('3', 0, 0)).toBe(3000);
    expect(retryAfter('0.5', 0, 0)).toBe(MIN_RETRY_AFTER);
    expect(retryAfter('0', 0, 0)).toBe(MIN_RETRY_AFTER);
    expect(retryAfter('0', 3, 0)).toBe(8000); // never below the exponential backoff
    expect(retryAfter('999', 0, 0)).toBe(MAX_RETRY_AFTER);
    expect(retryAfter(new Date(10_000).toUTCString(), 0, 4000)).toBe(6000);
    expect(retryAfter(new Date(0).toUTCString(), 0, 4000)).toBe(MIN_RETRY_AFTER);
    expect(retryAfter('soon', 2, 0)).toBe(4000);
    expect(retryAfter(null, 0, 0)).toBe(1000);
    expect(retryAfter(null, 10, 0)).toBe(MAX_BACKOFF);
  });

  it('takes the windows from the widget options, clamped', () => {
    const o = parseOptions(JSON.stringify({ collaboration: { url: '/c', hubUrl: '/h', topic: 't', updateDelay: 120, awarenessDelay: 'x' } }));
    expect(o.collaboration).toMatchObject({ updateDelay: 120 });
    expect(o.collaboration).not.toHaveProperty('awarenessDelay');
    const p = new MercureProvider(new Y.Doc(), '/c', '/h', 't', { updateDelay: 99_999, awarenessDelay: -5 });
    expect([p.updateDelay, p.awarenessDelay]).toEqual([2000, 0]);
    p.disconnect();
  });

  // Audit DS (1.5.1 #15): the PoCs, as regression tests.
  it('DS-L1: a 429 with Retry-After 0 or a past date waits at least 1 s and backs off (no request loop)', async () => {
    const { doc, provider } = await connected();
    answer = () => new Response('', { status: 429, headers: { 'Retry-After': '0' } });
    doc.getText('t').insert(0, 'x');
    await vi.advanceTimersByTimeAsync(DEFAULT_UPDATE_DELAY + 1000);
    expect(posts.filter((p) => p.kind === 'update').length).toBeLessThanOrEqual(2);
    answer = () => new Response('', { status: 429, headers: { 'Retry-After': 'Thu, 01 Jan 1970 00:00:00 GMT' } });
    posts = [];
    await vi.advanceTimersByTimeAsync(60_000);
    // 1 s, 2 s, 4 s, 8 s, 16 s, 30 s… at most a handful per minute.
    expect(posts.filter((p) => p.kind === 'update').length).toBeLessThanOrEqual(6);
    answer = () => new Response('');
    await vi.advanceTimersByTimeAsync(MAX_RETRY_AFTER);
    expect(serverText(posts)).toBe('x');
    expect(provider.hasPendingChanges).toBe(false);
    provider.disconnect();
  });

  it('DS-L1: presence without a window still backs off on 429', async () => {
    const { provider } = await connected({ awarenessDelay: 0 });
    const fetchMock = vi.mocked(fetch);
    const original = fetchMock.getMockImplementation()!;
    fetchMock.mockImplementation(async (url, init) => {
      const r = await original(url as string, init);
      return String(url).endsWith('/awareness') ? new Response('', { status: 429, headers: { 'Retry-After': '0' } }) : r;
    });
    provider.awareness.setLocalStateField('cursor', 1);
    await vi.advanceTimersByTimeAsync(1000);
    expect(posts.filter((p) => p.kind === 'awareness').length).toBeLessThanOrEqual(2);
    provider.disconnect();
  });

  it('DS-L2: a hidden tab while throttled loses nothing: the edits stay queued and reach the log', async () => {
    const { doc, provider } = await connected();
    doc.getText('t').insert(0, 'hello');
    await vi.advanceTimersByTimeAsync(300);
    answer = () => new Response('', { status: 429, headers: { 'Retry-After': '5' } });
    doc.getText('t').insert(5, ' world');
    await vi.advanceTimersByTimeAsync(DEFAULT_UPDATE_DELAY); // 429: backing off
    Object.defineProperty(document, 'visibilityState', { value: 'hidden', configurable: true });
    document.dispatchEvent(new Event('visibilitychange'));
    await vi.advanceTimersByTimeAsync(1);
    expect(posts.some((p) => p.keepalive)).toBe(false); // no fire-and-forget on a tab switch
    expect(provider.hasPendingChanges).toBe(true);
    answer = () => new Response('');
    Object.defineProperty(document, 'visibilityState', { value: 'visible', configurable: true });
    doc.getText('t').insert(11, '!');
    await vi.advanceTimersByTimeAsync(10_000);
    const peer = new Y.Doc();
    for (const p of posts.filter((x) => x.kind === 'update' && x.status < 300)) Y.applyUpdate(peer, fromBase64(p.d));
    expect(peer.getText('t').toString()).toBe('hello world!');
    expect(peer.store.pendingStructs).toBeNull();
    provider.disconnect();
  });

  it('DS-L2: a keepalive batch that is refused stays queued and dirty (the next connect diff covers it)', async () => {
    const { doc, provider } = await connected();
    answer = () => new Response('', { status: 429 });
    doc.getText('t').insert(0, 'bye');
    window.dispatchEvent(new Event('pagehide'));
    expect(posts.at(-1)).toMatchObject({ kind: 'update', keepalive: true });
    await vi.advanceTimersByTimeAsync(0);
    expect(provider.hasPendingChanges).toBe(true);
    // The page comes back from the bfcache: the copy is sent normally once the backoff allows it.
    answer = () => new Response('');
    provider.flush();
    await vi.advanceTimersByTimeAsync(MAX_BACKOFF);
    expect(provider.hasPendingChanges).toBe(false);
    const peer = new Y.Doc();
    for (const p of posts.filter((x) => x.kind === 'update' && x.status < 300)) Y.applyUpdate(peer, fromBase64(p.d));
    expect(peer.getText('t').toString()).toBe('bye');
    provider.disconnect();
  });

  it('DS-I1: a backlog larger than max update bytes is sent in capped batches, not as one refused POST', async () => {
    const { doc, provider } = await connected({ maxUpdateBytes: 2048 });
    expect(new MercureProvider(new Y.Doc(), '/c', '/h', 't').maxUpdateBytes).toBe(DEFAULT_MAX_UPDATE_BYTES);
    answer = () => new Response('', { status: 429, headers: { 'Retry-After': '2' } });
    const text = doc.getText('t');
    doc.getText('t').insert(0, 'a');
    await vi.advanceTimersByTimeAsync(DEFAULT_UPDATE_DELAY); // 429
    for (let i = 0; i < 100; i++) text.insert(text.length, `line ${i} ${'x'.repeat(40)}\n`);
    answer = () => new Response('');
    await vi.advanceTimersByTimeAsync(10_000);
    const sizes = posts.filter((p) => p.kind === 'update' && p.status < 300).map((p) => fromBase64(p.d).length);
    expect(sizes.length).toBeGreaterThan(1);
    expect(Math.max(...sizes)).toBeLessThanOrEqual(2048 + 200);
    expect(serverText(posts)).toBe(text.toString());
    expect(provider.status).toBe('online');
    provider.disconnect();
  });
});
