import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import * as Y from 'yjs';
import { createEditor, type MilkdownEditorHandle } from '../src/editor';
import { CONNECT_STEP_TIMEOUT, MercureProvider, toBase64 } from '../src/collab/mercure-provider';
import { tick, widget } from './helpers';

/**
 * 1.11: the sequence number a session save's text includes, and bounded connection steps. A host's numbers grow with gaps
 * (WikiBundle uses a shared auto-increment), so an update counts only once the one before it does.
 */
const FAST = { updateDelay: 0, awarenessDelay: 0 };
const FIELD = '_nowo_milkdown_collab_seq';

const peerUpdate = (text: string): string => {
  const doc = new Y.Doc();
  const paragraph = new Y.XmlElement('paragraph');
  paragraph.insert(0, [new Y.XmlText(text)]);
  doc.getXmlFragment('prosemirror').insert(0, [paragraph]);
  return toBase64(Y.encodeStateAsUpdate(doc));
};

class FakeHub {
  static all: FakeHub[] = [];
  static autoOpen = true;
  onopen: (() => void) | null = null;
  onerror: (() => void) | null = null;
  onmessage: ((e: MessageEvent<string>) => void) | null = null;
  closed = false;
  constructor() {
    FakeHub.all.push(this);
    if (FakeHub.autoOpen) setTimeout(() => this.onopen?.(), 0);
  }
  close(): void {
    this.closed = true;
  }
  send(message: unknown): void {
    this.onmessage?.({ data: JSON.stringify(message) } as MessageEvent<string>);
  }
}

let state: Record<string, unknown>;
let answerUpdate: () => Response;
const hub = (): FakeHub => FakeHub.all.at(-1)!;
const handles: MilkdownEditorHandle[] = [];

beforeEach(() => {
  FakeHub.all = [];
  FakeHub.autoOpen = true;
  state = { state: 'AAA=', updates: [peerUpdate('Shared')], seq: 7, seed: false };
  answerUpdate = () => new Response(null, { status: 204 });
  vi.stubGlobal('EventSource', FakeHub);
  vi.stubGlobal('fetch', vi.fn(async (url: string) => {
    if (url.endsWith('/state')) return new Response(JSON.stringify(state));
    if (url.endsWith('/update')) return answerUpdate();
    return new Response(null, { status: 204 });
  }));
});
afterEach(async () => {
  for (const handle of handles.splice(0)) await handle.destroy();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

async function connected(): Promise<MercureProvider> {
  const provider = new MercureProvider(new Y.Doc(), '/c', '/hub', 't', FAST);
  await provider.connect();
  return provider;
}

describe('the sequence number the text includes', () => {
  it('starts from the state', async () => {
    const provider = await connected();
    expect(provider.includedSeq).toBe(7);
    provider.disconnect();
  });

  it('is unknown with a host whose state has no number', async () => {
    delete state.seq;
    const provider = await connected();
    expect(provider.includedSeq).toBeNull();
    hub().send({ t: 'u', c: 9, d: peerUpdate('x'), s: 3, p: 0 });
    expect(provider.includedSeq).toBeNull();
    provider.disconnect();
  });

  it('follows the updates it applies, across gaps in the numbers', async () => {
    const provider = await connected();
    hub().send({ t: 'u', c: 9, d: peerUpdate('a'), s: 12, p: 7 });
    expect(provider.includedSeq).toBe(12);
    hub().send({ t: 'u', c: 9, d: peerUpdate('b'), s: 40, p: 12 });
    expect(provider.includedSeq).toBe(40);
    provider.disconnect();
  });

  it('never claims an update it has not got: one out of order waits for the one before it', async () => {
    const provider = await connected();
    hub().send({ t: 'u', c: 9, d: peerUpdate('later'), s: 40, p: 12 });
    expect(provider.includedSeq).toBe(7);
    hub().send({ t: 'u', c: 9, d: peerUpdate('earlier'), s: 12, p: 7 });
    expect(provider.includedSeq).toBe(40);
    provider.disconnect();
  });

  it('a message missed for good holds it back until the next state', async () => {
    const provider = await connected();
    hub().send({ t: 'u', c: 9, d: peerUpdate('b'), s: 40, p: 12 });
    expect(provider.includedSeq).toBe(7);
    state = { ...state, seq: 12 };
    hub().onerror?.();
    await tick(600);
    expect(provider.status).toBe('online');
    expect(provider.includedSeq).toBe(40);
    provider.disconnect();
  });

  it('an update without numbers counts for nothing (a host that does not send them)', async () => {
    const provider = await connected();
    hub().send({ t: 'u', c: 9, d: peerUpdate('a') });
    expect(provider.includedSeq).toBe(7);
    provider.disconnect();
  });

  it.each([
    ['text', { s: '12', p: 7 }],
    ['no previous', { s: 12 }],
    ['not growing', { s: 7, p: 7 }],
    ['negative', { s: 3, p: -1 }],
    ['a fraction', { s: 8.5, p: 7 }],
  ])('malformed numbers are ignored: %s', async (_name, numbers) => {
    const provider = await connected();
    hub().send({ t: 'u', c: 9, d: peerUpdate('a'), ...numbers });
    expect(provider.includedSeq).toBe(7);
    provider.disconnect();
  });

  it('an update it cannot apply does not count', async () => {
    const provider = await connected();
    hub().send({ t: 'u', c: 9, d: 'bm90IHlqcw==', s: 12, p: 7 });
    expect(provider.includedSeq).toBe(7);
    provider.disconnect();
  });

  it('its own update counts from the answer to the POST', async () => {
    answerUpdate = () => new Response(JSON.stringify({ s: 12, p: 7 }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    const provider = await connected();
    provider.doc.getText('t').insert(0, 'typed');
    await tick(5);
    expect(provider.includedSeq).toBe(12);
    provider.disconnect();
  });

  it('or from its echo on the hub, with a host that answers 204', async () => {
    const provider = await connected();
    provider.doc.getText('t').insert(0, 'typed');
    await tick(5);
    expect(provider.includedSeq).toBe(7);
    hub().send({ t: 'u', c: provider.doc.clientID, d: '', s: 12, p: 7 });
    expect(provider.includedSeq).toBe(12);
    provider.disconnect();
  });

  it('a broken answer to the POST changes nothing and is still a success', async () => {
    answerUpdate = () => new Response('{', { status: 200, headers: { 'Content-Type': 'application/json' } });
    const provider = await connected();
    provider.doc.getText('t').insert(0, 'typed');
    await tick(5);
    expect(provider.status).toBe('online');
    expect(provider.includedSeq).toBe(7);
    provider.disconnect();
  });
});

describe('the session save carries it', () => {
  const COLLAB = { collaboration: { url: '/c', hubUrl: '/hub', topic: 't', user: { name: 'Ada', color: '#123456' }, updateDelay: 0, connectTimeout: 2000 } };
  const open = async (): Promise<MilkdownEditorHandle> => {
    const handle = await createEditor(widget('Shared', COLLAB));
    handles.push(handle);
    return handle;
  };
  const save = (handle: MilkdownEditorHandle): HTMLFormElement => {
    const form = handle.textarea.form!;
    form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    return form;
  };
  const value = (form: HTMLFormElement, name = FIELD): string | null => form.querySelector<HTMLInputElement>(`input[name="${name}"]`)?.value ?? null;

  it('next to the session field, once', async () => {
    const form = save(await open());
    expect(value(form, '_nowo_milkdown_collab')).toBe('t');
    expect(value(form)).toBe('7');
    form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    expect(form.querySelectorAll(`input[name="${FIELD}"]`)).toHaveLength(1);
  });

  it('the number and the text agree: a peer update applied before the save is in both', async () => {
    const handle = await open();
    hub().send({ t: 'u', c: 9, d: peerUpdate('From a peer'), s: 12, p: 7 });
    const form = save(handle);
    expect(value(form)).toBe('12');
    expect(handle.textarea.value).toContain('From a peer');
  });

  it('a peer update that has not arrived is in neither', async () => {
    const handle = await open();
    const form = save(handle);
    expect(value(form)).toBe('7');
    expect(handle.textarea.value).not.toContain('Later');
  });

  it('is not sent while offline', async () => {
    const handle = await open();
    const form = save(handle);
    window.dispatchEvent(new Event('offline'));
    save(handle);
    expect(value(form)).toBeNull();
    expect(value(form, '_nowo_milkdown_collab')).toBeNull();
  });

  it('is not sent to a host whose state has no number; the session field still is', async () => {
    delete state.seq;
    const form = save(await open());
    expect(value(form, '_nowo_milkdown_collab')).toBe('t');
    expect(value(form)).toBeNull();
  });

  it('is not sent while standalone', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response(null, { status: 403 })));
    const form = save(await open());
    expect(form.querySelector(`input[name="${FIELD}"]`)).toBeNull();
  });
});

describe('every step of a connection is bounded (HO-I6)', () => {
  const never = new Promise<Response>(() => undefined);
  const hangOnce = (endpoint: string): void => {
    let hung = false;
    vi.stubGlobal('fetch', vi.fn(async (url: string) => {
      if (url.endsWith(endpoint) && !hung) {
        hung = true;
        return never;
      }
      if (url.endsWith('/state')) return new Response(JSON.stringify(state));
      return new Response(null, { status: 204 });
    }));
  };

  it.each([['the token', '/token'], ['the state', '/state']])('%s never answers: it gives up, retries and connects', async (_name, endpoint) => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    hangOnce(endpoint);
    const provider = new MercureProvider(new Y.Doc(), '/c', '/hub', 't', FAST);
    void provider.connect().catch(() => undefined);
    await vi.advanceTimersByTimeAsync(CONNECT_STEP_TIMEOUT - 1);
    expect(provider.status).toBe('connecting');
    await vi.advanceTimersByTimeAsync(2000);
    expect(provider.status).toBe('online');
    provider.disconnect();
  });

  it('the body of the state never ends: same', async () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    let hung = false;
    vi.stubGlobal('fetch', vi.fn(async (url: string) => {
      if (url.endsWith('/state') && !hung) {
        hung = true;
        const stalled = new Response(new ReadableStream({ start: () => undefined }));
        return stalled;
      }
      if (url.endsWith('/state')) return new Response(JSON.stringify(state));
      return new Response(null, { status: 204 });
    }));
    const provider = new MercureProvider(new Y.Doc(), '/c', '/hub', 't', FAST);
    void provider.connect().catch(() => undefined);
    await vi.advanceTimersByTimeAsync(CONNECT_STEP_TIMEOUT + 2000);
    expect(provider.status).toBe('online');
    expect(provider.failed).toBe(false);
    provider.disconnect();
  });

  it('the hub never opens: it closes that one, retries and connects', async () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    FakeHub.autoOpen = false;
    const provider = new MercureProvider(new Y.Doc(), '/c', '/hub', 't', FAST);
    void provider.connect().catch(() => undefined);
    await vi.advanceTimersByTimeAsync(CONNECT_STEP_TIMEOUT - 1);
    expect(FakeHub.all).toHaveLength(1);
    expect(FakeHub.all[0]!.closed).toBe(false);
    FakeHub.autoOpen = true;
    await vi.advanceTimersByTimeAsync(2000);
    expect(FakeHub.all[0]!.closed).toBe(true);
    expect(FakeHub.all).toHaveLength(2);
    expect(provider.status).toBe('online');
    provider.disconnect();
  });

  it('after a first connection too: it does not stay on connecting', async () => {
    const provider = await connected();
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    hangOnce('/token');
    hub().onerror?.();
    await vi.advanceTimersByTimeAsync(1000);
    expect(provider.status).toBe('connecting');
    await vi.advanceTimersByTimeAsync(CONNECT_STEP_TIMEOUT + 2000);
    expect(provider.status).toBe('online');
    provider.disconnect();
  });

  it('the request is aborted when it gives up', async () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    const signals: AbortSignal[] = [];
    vi.stubGlobal('fetch', vi.fn((_url: string, init?: RequestInit) => {
      signals.push(init!.signal!);
      return never;
    }));
    const provider = new MercureProvider(new Y.Doc(), '/c', '/hub', 't', FAST);
    void provider.connect().catch(() => undefined);
    await vi.advanceTimersByTimeAsync(CONNECT_STEP_TIMEOUT);
    expect(signals[0]!.aborted).toBe(true);
    provider.disconnect();
  });

  it('a refusal is still at once, not after the time-out', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response(null, { status: 403 })));
    const provider = new MercureProvider(new Y.Doc(), '/c', '/hub', 't', FAST);
    await expect(provider.connect()).rejects.toThrow('token 403');
    expect(provider.failed).toBe(true);
    provider.disconnect();
  });
});
