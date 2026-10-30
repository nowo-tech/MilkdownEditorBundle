import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import * as Y from 'yjs';
import { MercureProvider, fromBase64, toBase64 } from '../src/collab/mercure-provider';
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
let serverState = Y.encodeStateAsUpdate(new Y.Doc());
let tokenStatus = 200;
let postStatus = 200;

beforeEach(() => {
  posts = [];
  tokenStatus = 200;
  postStatus = 200;
  FakeEventSource.fail = false;
  const seed = new Y.Doc();
  seed.getText('t').insert(0, 'server');
  serverState = Y.encodeStateAsUpdate(seed);
  vi.stubGlobal('EventSource', FakeEventSource);
  vi.stubGlobal('fetch', vi.fn(async (url: string, init?: RequestInit) => {
    if (url.endsWith('/token')) return new Response('', { status: tokenStatus });
    if (url.endsWith('/state')) return new Response(JSON.stringify({ state: toBase64(serverState), seed: true }));
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
});
