import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import * as Y from 'yjs';
import { createEditor, type MilkdownEditorHandle } from '../src/editor';
import { MercureProvider, POST_TIMEOUT, toBase64 } from '../src/collab/mercure-provider';
import { page as collabPage } from '../src/collab/index';
import { tick, widget } from './helpers';

/** 1.12: which log a document belongs to (audit HV-M1), and time limits on POST update and compact (HV-L3). */
const FAST = { updateDelay: 0, awarenessDelay: 0 };
const FIELD = '_nowo_milkdown_collab_epoch';

const shared = (text: string): string => {
  const doc = new Y.Doc();
  const paragraph = new Y.XmlElement('paragraph');
  paragraph.insert(0, [new Y.XmlText(text)]);
  doc.getXmlFragment('prosemirror').insert(0, [paragraph]);
  return toBase64(Y.encodeStateAsUpdate(doc));
};

class FakeHub {
  static all: FakeHub[] = [];
  onopen: (() => void) | null = null;
  onerror: (() => void) | null = null;
  onmessage: ((e: MessageEvent<string>) => void) | null = null;
  closed = false;
  constructor() {
    FakeHub.all.push(this);
    setTimeout(() => this.onopen?.(), 0);
  }
  close(): void {
    this.closed = true;
  }
  send(message: unknown): void {
    this.onmessage?.({ data: JSON.stringify(message) } as MessageEvent<string>);
  }
}

let state: Record<string, unknown>;
let posted: { kind: string; body: Record<string, unknown>; signal?: AbortSignal | null }[];
let answerUpdate: () => Response | Promise<Response>;
const hub = (): FakeHub => FakeHub.all.at(-1)!;
const handles: MilkdownEditorHandle[] = [];
const updates = (): unknown[] => posted.filter((p) => p.kind === 'update');

beforeEach(() => {
  FakeHub.all = [];
  posted = [];
  state = { state: 'AAA=', updates: [shared('Shared')], seq: 7, seed: false, epoch: 'one' };
  answerUpdate = () => new Response(null, { status: 204 });
  vi.stubGlobal('EventSource', FakeHub);
  vi.stubGlobal('fetch', vi.fn(async (url: string, init?: RequestInit) => {
    const kind = url.split('/').pop() as string;
    if (kind === 'state') return new Response(JSON.stringify(state));
    if (kind === 'token') return new Response(null, { status: 204 });
    posted.push({ kind, body: JSON.parse(String(init?.body)), signal: init?.signal });
    return kind === 'update' ? answerUpdate() : new Response(null, { status: 204 });
  }));
});
afterEach(async () => {
  for (const handle of handles.splice(0)) await handle.destroy();
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  window.sessionStorage.clear();
});

async function connected(): Promise<MercureProvider> {
  const provider = new MercureProvider(new Y.Doc(), '/c', '/hub', 't', FAST);
  await provider.connect();
  return provider;
}

describe('the provider', () => {
  it('takes the epoch from the state and sends it with updates, compaction and a corruption report', async () => {
    state.compact = true;
    const provider = await connected();
    expect(provider.epoch).toBe('one');
    provider.doc.getText('t').insert(0, 'typed');
    await tick(5);
    expect(posted.find((p) => p.kind === 'update')?.body.e).toBe('one');
    expect(posted.find((p) => p.kind === 'compact')?.body.e).toBe('one');
    expect(posted.find((p) => p.kind === 'awareness')?.body.e).toBeUndefined();
    provider.disconnect();
  });

  it('a host that names no logs: no epoch anywhere, and a reconnect posts as it always did', async () => {
    delete state.epoch;
    const provider = await connected();
    expect(provider.epoch).toBeNull();
    provider.doc.getText('t').insert(0, 'typed');
    await tick(5);
    expect(posted.find((p) => p.kind === 'update')?.body).not.toHaveProperty('e');
    posted = [];
    state = { state: 'AAA=', updates: [], seq: 0, seed: false };
    hub().onerror?.();
    await tick(600);
    expect(provider.status).toBe('online');
    expect(updates().length).toBeGreaterThan(0);
    provider.disconnect();
  });

  it.each([['the hub drops'], ['the browser was offline']])('%s, the log replaced: nothing applied, nothing posted, reset', async (how) => {
    const provider = await connected();
    const before = provider.doc.getXmlFragment('prosemirror').toString();
    posted = [];
    state = { state: 'AAA=', updates: [shared('New log')], seq: 0, seed: false, epoch: 'two' };
    if (how === 'the hub drops') hub().onerror?.();
    else {
      window.dispatchEvent(new Event('offline'));
      window.dispatchEvent(new Event('online'));
    }
    await tick(600);
    expect(provider.status).toBe('reset');
    expect(provider.doc.getXmlFragment('prosemirror').toString()).toBe(before);
    expect(posted).toEqual([]);
    const hubs = FakeHub.all.length;
    await tick(600);
    expect(FakeHub.all.length).toBe(hubs);
    provider.disconnect();
  });

  it('a client on a log says so when it asks: the first connection does not, a reconnect does', async () => {
    const fetchMock = vi.mocked(fetch);
    const provider = await connected();
    const header = (index: number): string | undefined => ((fetchMock.mock.calls[index]![1] as RequestInit).headers as Record<string, string>)['X-Nowo-Collab-Epoch'];
    expect(String(fetchMock.mock.calls[0]![0])).toContain('/token');
    expect(header(0)).toBeUndefined();
    fetchMock.mockClear();
    state = { ...state, epoch: 'two' };
    hub().onerror?.();
    await tick(600);
    expect(String(fetchMock.mock.calls[0]![0])).toContain('/token');
    expect(header(0)).toBe('one');
    provider.disconnect();
  });

  it('a host that names no logs never gets the header', async () => {
    delete state.epoch;
    const fetchMock = vi.mocked(fetch);
    const provider = await connected();
    fetchMock.mockClear();
    hub().onerror?.();
    await tick(600);
    const init = fetchMock.mock.calls.find((c) => String(c[0]).endsWith('/token'))![1] as RequestInit;
    expect(init.headers).not.toHaveProperty('X-Nowo-Collab-Epoch');
    provider.disconnect();
  });

  it('the same log after a reconnect: the offline edits go, with the epoch', async () => {
    const provider = await connected();
    window.dispatchEvent(new Event('offline'));
    provider.doc.getText('t').insert(0, 'offline');
    posted = [];
    window.dispatchEvent(new Event('online'));
    await tick(20);
    expect(provider.status).toBe('online');
    expect(posted.find((p) => p.kind === 'update')?.body.e).toBe('one');
    provider.disconnect();
  });

  it('a host that stops naming logs (rolled back): today\'s behaviour', async () => {
    const provider = await connected();
    delete state.epoch;
    hub().onerror?.();
    await tick(600);
    expect(provider.status).toBe('online');
    expect(provider.epoch).toBeNull();
    provider.disconnect();
  });

  it('a 409 log_epoch to an update: reset, and nothing more is sent', async () => {
    const provider = await connected();
    answerUpdate = () => new Response(JSON.stringify({ error: 'log_epoch' }), { status: 409, headers: { 'Content-Type': 'application/json' } });
    provider.doc.getText('t').insert(0, 'typed');
    await tick(5);
    expect(provider.status).toBe('reset');
    provider.doc.getText('t').insert(0, 'more');
    posted = [];
    await tick(5);
    expect(posted).toEqual([]);
    provider.disconnect();
  });

  it('any other 409 is what it was: offline', async () => {
    const provider = await connected();
    answerUpdate = () => new Response(JSON.stringify({ error: 'log_reset' }), { status: 409, headers: { 'Content-Type': 'application/json' } });
    provider.doc.getText('t').insert(0, 'typed');
    await tick(5);
    expect(provider.status).toBe('offline');
    provider.disconnect();
  });

  it('an update from another log is not applied; the state decides. A late one of the old log: nothing happens', async () => {
    const provider = await connected();
    const before = provider.doc.getXmlFragment('prosemirror').toString();
    hub().send({ t: 'u', c: 9, d: shared('From the old log'), s: 3, p: 2, e: 'zero' });
    expect(provider.doc.getXmlFragment('prosemirror').toString()).toBe(before);
    await tick(20);
    expect(provider.status).toBe('online');
    expect(provider.epoch).toBe('one');
    provider.disconnect();
  });

  it('an update from a new log, the reset missed: the state says so', async () => {
    const provider = await connected();
    state = { ...state, epoch: 'two', updates: [] };
    hub().send({ t: 'u', c: 9, d: shared('New log'), s: 3, p: 0, e: 'two' });
    await tick(20);
    expect(provider.status).toBe('reset');
    provider.disconnect();
  });

  it('a reset naming the log it already has is a late message; any other reset stops it', async () => {
    const provider = await connected();
    hub().send({ t: 'r', c: 0, d: '', e: 'one' });
    expect(provider.status).toBe('online');
    hub().send({ t: 'r', c: 0, d: '', e: 'two' });
    expect(provider.status).toBe('reset');
    provider.disconnect();
  });

  it('a reset without an epoch stops it, as always', async () => {
    const provider = await connected();
    hub().send({ t: 'r', c: 0, d: '' });
    expect(provider.status).toBe('reset');
    provider.disconnect();
  });
});

describe('the editor', () => {
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
  const replaced = async (): Promise<void> => {
    state = { state: 'AAA=', updates: [], seq: 0, seed: false, epoch: 'two' };
    hub().onerror?.();
    await tick(600);
  };

  it('a field the browser restored on reload is not used: the server\'s text is (Firefox)', async () => {
    state = { state: 'AAA=', updates: [], seq: 0, seed: true, epoch: 'one' };
    const root = widget('Old text from before the reload', COLLAB);
    root.querySelector('textarea')!.defaultValue = 'New text from the server';
    root.querySelector('textarea')!.value = 'Old text from before the reload';
    const handle = await createEditor(root);
    handles.push(handle);
    expect(handle.getMarkdown()).toContain('New text from the server');
    expect(handle.getMarkdown()).not.toContain('Old text');
  });

  it('without collaboration a restored field stays what it was', async () => {
    const root = widget('Typed before the reload');
    root.querySelector('textarea')!.defaultValue = 'From the server';
    root.querySelector('textarea')!.value = 'Typed before the reload';
    const handle = await createEditor(root);
    handles.push(handle);
    expect(handle.getMarkdown()).toContain('Typed before the reload');
  });

  it('a save carries the epoch, online or offline', async () => {
    const handle = await open();
    const form = save(handle);
    expect(value(form)).toBe('one');
    expect(value(form, '_nowo_milkdown_collab')).toBe('t');
    window.dispatchEvent(new Event('offline'));
    save(handle);
    expect(value(form)).toBe('one');
    expect(value(form, '_nowo_milkdown_collab')).toBeNull();
  });

  it('a host that names no logs gets no field', async () => {
    delete state.epoch;
    expect(value(save(await open()))).toBeNull();
  });

  it('a client that never bound sends none', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response(null, { status: 403 })));
    expect(value(save(await open()))).toBeNull();
  });

  it('nothing written here, the log replaced: it reloads onto the new text', async () => {
    const reload = vi.spyOn(collabPage, 'reload').mockImplementation(() => undefined);
    const handle = await open();
    await replaced();
    expect(handle.root.dataset.collab).toBe('reset');
    await tick(1600);
    expect(reload).toHaveBeenCalledTimes(1);
  });

  it('text written here, the log replaced: it stays, the person is told, no reload, and the save sends the old epoch', async () => {
    const reload = vi.spyOn(collabPage, 'reload').mockImplementation(() => undefined);
    const handle = await open();
    handle.setMarkdown('Written here');
    await tick(5);
    await replaced();
    expect(handle.root.dataset.collab).toBe('standalone');
    expect(handle.root.querySelector('.nowo-milkdown__notice')?.textContent).toContain('replaced while you were away');
    expect(handle.root.querySelector('.nowo-milkdown__surface')?.textContent).toContain('Written here');
    await tick(1600);
    expect(reload).not.toHaveBeenCalled();
    const form = save(handle);
    expect(handle.textarea.value).toContain('Written here');
    expect(value(form)).toBe('one');
    expect(value(form, '_nowo_milkdown_collab')).toBeNull();
    handle.root.querySelector<HTMLButtonElement>('.nowo-milkdown__reload')!.click();
    expect(reload).toHaveBeenCalledTimes(1);
  });

  it('typed during the notice: it stays too', async () => {
    const reload = vi.spyOn(collabPage, 'reload').mockImplementation(() => undefined);
    const handle = await open();
    await replaced();
    expect(handle.root.dataset.collab).toBe('reset');
    handle.setMarkdown('Typed in the window');
    await tick(1600);
    expect(reload).not.toHaveBeenCalled();
    expect(handle.root.dataset.collab).toBe('standalone');
    expect(handle.root.querySelector('.nowo-milkdown__notice')?.textContent).toContain('replaced while you were away');
  });

  it('another person\'s updates only: nothing of this person\'s to keep, so it reloads', async () => {
    const reload = vi.spyOn(collabPage, 'reload').mockImplementation(() => undefined);
    const handle = await open();
    hub().send({ t: 'u', c: 9, d: shared('From a peer'), s: 12, p: 7, e: 'one' });
    await replaced();
    await tick(1600);
    expect(handle.root.dataset.collab).toBe('reset');
    expect(reload).toHaveBeenCalledTimes(1);
  });

  it('a host that names no logs: a reset reloads as it always did, whatever was typed', async () => {
    delete state.epoch;
    const reload = vi.spyOn(collabPage, 'reload').mockImplementation(() => undefined);
    const handle = await open();
    handle.setMarkdown('Written here');
    await tick(5);
    hub().send({ t: 'r', c: 0, d: '' });
    await tick(1600);
    expect(reload).toHaveBeenCalledTimes(1);
  });
});

describe('time limits on posts (HV-L3)', () => {
  const never = new Promise<Response>(() => undefined);
  /** A signal this test fires, instead of waiting for the real time-out. */
  const controlled = (): { fire: () => void; lengths: number[] } => {
    const controllers: AbortController[] = [];
    const lengths: number[] = [];
    vi.spyOn(AbortSignal, 'timeout').mockImplementation((ms: number) => {
      lengths.push(ms);
      const controller = new AbortController();
      controllers.push(controller);
      return controller.signal;
    });
    return { fire: () => controllers.forEach((c) => c.abort(Object.assign(new Error('timed out'), { name: 'TimeoutError' }))), lengths };
  };

  it('a POST update that never answers gives up, frees the queue, and a reconnect sends the text', async () => {
    const timeouts = controlled();
    const provider = await connected();
    posted = [];
    vi.stubGlobal('fetch', vi.fn((url: string, init?: RequestInit) => {
      const kind = url.split('/').pop() as string;
      if (kind === 'state') return Promise.resolve(new Response(JSON.stringify(state)));
      if (kind === 'token') return Promise.resolve(new Response(null, { status: 204 }));
      if (kind === 'update') posted.push({ kind, body: JSON.parse(String(init?.body)), signal: init?.signal });
      if (kind === 'update' && posted.length === 1) {
        return new Promise<Response>((_resolve, reject) => {
          init!.signal!.addEventListener('abort', () => reject(init!.signal!.reason));
        });
      }
      return Promise.resolve(new Response(null, { status: 204 }));
    }));
    provider.doc.getText('t').insert(0, 'typed');
    await tick(5);
    expect(posted).toHaveLength(1);
    expect(timeouts.lengths).toContain(POST_TIMEOUT);
    provider.doc.getText('t').insert(0, 'more');
    await tick(5);
    expect(posted).toHaveLength(1);
    timeouts.fire();
    await tick(5);
    expect(provider.status).not.toBe('online');
    await tick(600);
    expect(provider.status).toBe('online');
    expect(posted.length).toBeGreaterThan(1);
    provider.disconnect();
    void never;
  });

  it('POST compact has the limit too, and a hung one does not hold the connection', async () => {
    const timeouts = controlled();
    state.compact = true;
    vi.stubGlobal('fetch', vi.fn((url: string, init?: RequestInit) => {
      const kind = url.split('/').pop() as string;
      if (kind === 'state') return Promise.resolve(new Response(JSON.stringify(state)));
      if (kind === 'compact') {
        return new Promise<Response>((_resolve, reject) => {
          init!.signal!.addEventListener('abort', () => reject(init!.signal!.reason));
        });
      }
      return Promise.resolve(new Response(null, { status: 204 }));
    }));
    const provider = new MercureProvider(new Y.Doc(), '/c', '/hub', 't', FAST);
    let done = false;
    void provider.connect().then(() => (done = true));
    await tick(10);
    expect(done).toBe(false);
    timeouts.fire();
    await tick(5);
    expect(done).toBe(true);
    provider.disconnect();
  });
});
