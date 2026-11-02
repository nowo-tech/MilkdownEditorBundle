import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import * as Y from 'yjs';
import { MercureProvider, fromBase64, stateUpdates, toBase64 } from '../src/collab/mercure-provider';
import { RELOAD_CAP, RELOAD_WINDOW, allowReload } from '../src/collab/index';
import { tick } from './helpers';

class FakeEventSource {
  static last: FakeEventSource;
  onopen: (() => void) | null = null;
  onerror: (() => void) | null = null;
  onmessage: ((e: MessageEvent<string>) => void) | null = null;
  closed = false;
  constructor(readonly url: URL) {
    FakeEventSource.last = this;
    setTimeout(() => (FakeEventSource.fail ? this.onerror?.() : this.onopen?.()), 0);
  }
  static fail = false;
  close() {
    this.closed = true;
  }
}

let posts: { url: string; body: { c: number; d: string } }[] = [];
let headers: Record<string, string>[] = [];
let serverState = Y.encodeStateAsUpdate(new Y.Doc());
let tokenStatus = 200;
let postStatus = 200;
let stateExtra: Record<string, unknown> = {};
let compactFails = false;

beforeEach(() => {
  posts = [];
  headers = [];
  tokenStatus = 200;
  postStatus = 200;
  stateExtra = {};
  compactFails = false;
  FakeEventSource.fail = false;
  const seed = new Y.Doc();
  seed.getText('t').insert(0, 'server');
  serverState = Y.encodeStateAsUpdate(seed);
  vi.stubGlobal('EventSource', FakeEventSource);
  vi.stubGlobal('fetch', vi.fn(async (url: string, init?: RequestInit) => {
    if (url.endsWith('/token') || url.endsWith('/state')) headers.push((init?.headers ?? {}) as Record<string, string>);
    if (url.endsWith('/token')) return new Response('', { status: tokenStatus });
    if (url.endsWith('/state')) return new Response(JSON.stringify({ state: toBase64(serverState), seed: true, ...stateExtra }));
    if (url.endsWith('/compact') && compactFails) throw new TypeError('network');
    posts.push({ url, body: JSON.parse(String(init?.body)) });
    return new Response('', { status: postStatus });
  }));
});
afterEach(() => vi.unstubAllGlobals());

describe('remote carets', () => {
  it('validate peer colours and build DOM without style strings', async () => {
    const { cursorBuilder, safeColor, selectionBuilder } = await import('../src/collab/index');
    expect(safeColor('#a1B2c3')).toBe('#a1B2c3');
    expect(safeColor('red;position:fixed')).toBe('#6b7280');
    expect(safeColor(3)).toBe('#6b7280');
    const caret = cursorBuilder({ name: 'Ada'.repeat(30), color: 'red;inset:0' });
    expect(caret.getAttribute('style')).toContain('border-color');
    expect(caret.getAttribute('style')).not.toContain('inset');
    expect(caret.querySelector('div')?.textContent).toHaveLength(40);
    expect(cursorBuilder({}).querySelector('div')?.textContent).toBe('');
    expect(selectionBuilder({ color: '#123456' }).style).toBe('background-color: #12345670');
  });
});

describe('MercureProvider', () => {
  it('base64 helpers round trip', () => {
    const data = Uint8Array.from({ length: 70000 }, (_, i) => i % 251);
    expect(fromBase64(toBase64(data))).toEqual(data);
  });

  it('connects: state applied, local diff and awareness posted, updates relayed both ways', async () => {
    const doc = new Y.Doc();
    doc.getText('t').insert(0, 'offline ');
    const provider = new MercureProvider(doc, '/c', '/hub', 'topic');
    const statuses: string[] = [];
    provider.onStatus((s) => statuses.push(s));
    await provider.connect();
    expect(FakeEventSource.last.url.searchParams.get('topic')).toBe('topic');
    expect(doc.getText('t').toString()).toContain('server');
    expect(provider.seed).toBe(true);
    expect(posts.map((p) => p.url)).toEqual(['/c/update', '/c/awareness']);
    expect(statuses).toEqual(['connecting', 'online']);

    doc.getText('t').insert(0, 'x');
    await tick(0);
    expect(posts.at(-1)!.url).toBe('/c/update');

    const remote = new Y.Doc();
    remote.getText('t').insert(0, 'R');
    FakeEventSource.last.onmessage!({ data: JSON.stringify({ t: 'u', c: 999, d: toBase64(Y.encodeStateAsUpdate(remote)) }) } as MessageEvent<string>);
    expect(doc.getText('t').toString()).toContain('R');
    FakeEventSource.last.onmessage!({ data: JSON.stringify({ t: 'u', c: doc.clientID, d: '' }) } as MessageEvent<string>);

    const other = new MercureProvider(new Y.Doc(), '/x', '/hub', 'x');
    other.awareness.setLocalStateField('user', { name: 'B' });
    const { encodeAwarenessUpdate } = await import('y-protocols/awareness');
    const before = posts.length;
    FakeEventSource.last.onmessage!({ data: JSON.stringify({ t: 'a', c: other.doc.clientID, d: toBase64(encodeAwarenessUpdate(other.awareness, [other.doc.clientID])) }) } as MessageEvent<string>);
    await tick(0);
    expect(posts.length).toBe(before + 1);
    provider.awareness.setLocalStateField('user', { name: 'A' });
    await tick(0);
    expect(posts.at(-1)!.url).toBe('/c/awareness');
    other.disconnect();
    provider.disconnect();
    expect(provider.status).toBe('offline');
    await provider.connect();
  });

  it('offline edits are buffered and failures reconnect', async () => {
    vi.useFakeTimers({ toFake: ['setTimeout'] });
    const doc = new Y.Doc();
    const provider = new MercureProvider(doc, '/c', '/hub', 't');
    const connecting = provider.connect();
    await vi.advanceTimersByTimeAsync(1);
    await connecting;
    window.dispatchEvent(new Event('offline'));
    expect(provider.status).toBe('offline');
    doc.getText('t').insert(0, 'typed offline');
    expect(provider.hasPendingChanges).toBe(true);
    window.dispatchEvent(new Event('online'));
    await vi.advanceTimersByTimeAsync(1);
    expect(provider.status).toBe('online');
    expect(provider.hasPendingChanges).toBe(false);

    postStatus = 500;
    doc.getText('t').insert(0, 'y');
    await vi.advanceTimersByTimeAsync(1);
    expect(provider.status).toBe('offline');
    expect(provider.hasPendingChanges).toBe(true);
    postStatus = 200;

    FakeEventSource.fail = true;
    const es = FakeEventSource.last;
    es.onerror!();
    expect(es.closed).toBe(true);
    await vi.advanceTimersByTimeAsync(300);
    FakeEventSource.fail = false;
    await vi.advanceTimersByTimeAsync(2000);
    expect(provider.status).toBe('online');
    window.dispatchEvent(new Event('beforeunload'));
    provider.disconnect();
    vi.useRealTimers();
  });

  it('a refused token rejects the connection', async () => {
    tokenStatus = 403;
    const provider = new MercureProvider(new Y.Doc(), '/c', '/hub', 't');
    await expect(provider.connect()).rejects.toThrow('token 403');
    provider.disconnect();
  });

  it('applies a state log (1.2) and compacts it when asked', async () => {
    const a = new Y.Doc();
    a.getText('t').insert(0, 'log1 ');
    const b = new Y.Doc();
    Y.applyUpdate(b, Y.encodeStateAsUpdate(a));
    b.getText('t').insert(5, 'log2');
    stateExtra = { updates: [toBase64(Y.encodeStateAsUpdate(a)), '', 7, toBase64(Y.encodeStateAsUpdate(b))], seq: 42, compact: true };

    const doc = new Y.Doc();
    const provider = new MercureProvider(doc, '/c', '/hub', 't');
    await provider.connect();
    expect(doc.getText('t').toString()).toContain('log1 log2');
    const compact = posts.find((p) => p.url === '/c/compact') as { body: { c: number; d: string; s: number } } | undefined;
    expect(compact?.body.s).toBe(42);
    const snapshot = new Y.Doc();
    Y.applyUpdate(snapshot, fromBase64(compact!.body.d));
    expect(snapshot.getText('t').toString()).toBe(doc.getText('t').toString());
    provider.disconnect();
  });

  it('does not compact without an integer seq and survives a failed compaction', async () => {
    stateExtra = { updates: 'nope', seq: 1.5, compact: true };
    const first = new MercureProvider(new Y.Doc(), '/c', '/hub', 't');
    await first.connect();
    expect(posts.some((p) => p.url === '/c/compact')).toBe(false);
    first.disconnect();

    stateExtra = { seq: 3, compact: true };
    compactFails = true;
    const second = new MercureProvider(new Y.Doc(), '/c', '/hub', 't');
    await second.connect();
    expect(second.status).toBe('online');
    second.disconnect();
  });

  it('a reset message stops the provider for good', async () => {
    const provider = new MercureProvider(new Y.Doc(), '/c', '/hub', 't');
    const statuses: string[] = [];
    provider.onStatus((s) => statuses.push(s));
    await provider.connect();
    const es = FakeEventSource.last;
    es.onmessage!({ data: JSON.stringify({ t: 'r', c: 0, d: '' }) } as MessageEvent<string>);
    expect(provider.status).toBe('reset');
    expect(es.closed).toBe(true);
    expect(statuses.at(-1)).toBe('reset');
    await provider.connect();
    expect(FakeEventSource.last).toBe(es);
    provider.disconnect();
  });

  it('sends the tab client id with the token and state requests', async () => {
    const doc = new Y.Doc();
    const provider = new MercureProvider(doc, '/c', '/hub', 't');
    await provider.connect();
    expect(headers).toEqual([{ 'X-Nowo-Collab-Client': String(doc.clientID) }, { 'X-Nowo-Collab-Client': String(doc.clientID) }]);
    provider.disconnect();
  });

  it('reports a state it cannot apply once and stays offline', async () => {
    stateExtra = { updates: ['%%%'], seq: 9 };
    const provider = new MercureProvider(new Y.Doc(), '/c', '/hub', 't');
    await provider.connect();
    expect(provider.status).toBe('offline');
    expect(posts.filter((p) => p.url === '/c/corrupt').map((p) => p.body)).toEqual([{ c: provider.doc.clientID, s: 9 }]);
    expect(posts.some((p) => p.url === '/c/update')).toBe(false);

    FakeEventSource.last.onmessage!({ data: JSON.stringify({ t: 'u', c: 1, d: '%%%' }) } as MessageEvent<string>);
    await tick(0);
    expect(posts.filter((p) => p.url === '/c/corrupt')).toHaveLength(1);

    FakeEventSource.last.onmessage!({ data: JSON.stringify({ t: 'r', c: 0, d: '' }) } as MessageEvent<string>);
    expect(provider.status).toBe('reset');
    provider.disconnect();
  });

  it('reports an update it cannot apply and survives a failed report', async () => {
    stateExtra = { seq: 'x' };
    const provider = new MercureProvider(new Y.Doc(), '/c', '/hub', 't');
    await provider.connect();
    expect(provider.status).toBe('online');
    vi.stubGlobal('fetch', vi.fn(async () => {
      throw new TypeError('network');
    }));
    FakeEventSource.last.onmessage!({ data: JSON.stringify({ t: 'u', c: 1, d: '%%%' }) } as MessageEvent<string>);
    await tick(0);
    expect(provider.status).toBe('offline');
    provider.disconnect();
  });

  it('ignores malformed messages and broken presence', async () => {
    const provider = new MercureProvider(new Y.Doc(), '/c', '/hub', 't');
    await provider.connect();
    expect(() => FakeEventSource.last.onmessage!({ data: '{not json' } as MessageEvent<string>)).not.toThrow();
    expect(() => FakeEventSource.last.onmessage!({ data: JSON.stringify({ t: 'a', c: 5, d: '%%%' }) } as MessageEvent<string>)).not.toThrow();
    expect(provider.status).toBe('online');
    provider.disconnect();
  });

  it('caps automatic reloads per topic in sessionStorage', () => {
    const storage = window.sessionStorage;
    storage.clear();
    for (let i = 0; i < RELOAD_CAP; i++) expect(allowReload('urn:a', storage, 1000 + i)).toBe(true);
    expect(allowReload('urn:a', storage, 2000)).toBe(false);
    expect(allowReload('urn:b', storage, 2000)).toBe(true);
    expect(allowReload('urn:a', storage, 1000 + RELOAD_WINDOW + 10)).toBe(true);
    storage.setItem('nowo-milkdown-reloads:urn:c', '{broken');
    expect(allowReload('urn:c', storage, 1)).toBe(true);
    storage.setItem('nowo-milkdown-reloads:urn:d', '"x"');
    expect(allowReload('urn:d', storage, 1)).toBe(true);
    expect(allowReload('urn:e', null, 1)).toBe(true);
    const full = { getItem: () => null, setItem: () => { throw new Error('quota'); } } as unknown as Storage;
    expect(allowReload('urn:f', full, 1)).toBe(true);
    expect(allowReload('urn:g')).toBe(true);
    storage.clear();
  });

  it('lists the updates of a state answer', () => {
    expect(stateUpdates({ state: 'AA==', updates: ['AQ==', '', null] })).toEqual(['AA==', 'AQ==']);
    expect(stateUpdates({ state: '' })).toEqual([]);
  });
});
