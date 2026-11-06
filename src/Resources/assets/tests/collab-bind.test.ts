import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import * as Y from 'yjs';
import { prosemirrorToYDoc } from 'y-prosemirror';
import { editorViewCtx } from '@milkdown/kit/core';
import { createEditor, type MilkdownEditorHandle } from '../src/editor';
import { fromBase64, toBase64 } from '../src/collab/mercure-provider';
import { DEFAULT_CONNECT_TIMEOUT, MAX_CONNECT_TIMEOUT, isBlank, page as collabPage, startCollaboration, waitPlugin } from '../src/collab/index';
import { editor, tick, widget } from './helpers';

/**
 * 1.9.1: nothing is lost around the bind. A small host: a Yjs log, one seed claim, a hub that relays what is posted and
 * that the test opens by hand. The states are `waiting`, `bound` and `standalone`.
 */
type Answer = { status?: number; body?: string; json?: unknown };

class Host {
  log: string[] = [];
  seedClaim: string | null = null;
  /** `all`: answers `seed: true` to every client (a host without a claim); `none`: never seeds. */
  seedPolicy: 'claim' | 'all' | 'none' = 'claim';
  token: Answer = {};
  state: Answer | null = null;
  autoOpen = true;
  hubs: FakeHub[] = [];
  posts: { kind: string; c: number }[] = [];
  requests: string[] = [];

  broadcast(message: unknown): void {
    this.hubs.forEach((hub) => hub.onmessage?.({ data: JSON.stringify(message) } as MessageEvent<string>));
  }

  fetch = async (url: string, init?: RequestInit): Promise<Response> => {
    const kind = url.split('/').pop() as string;
    this.requests.push(kind);
    const client = String((init?.headers as Record<string, string> | undefined)?.['X-Nowo-Collab-Client'] ?? '');
    if (kind === 'token') {
      if (this.token.status) return new Response(this.token.body ?? '', { status: this.token.status });
      if (!this.log.length) this.seedClaim ??= client;
      return new Response(null, { status: 204 });
    }
    if (kind === 'state') {
      if (this.state) return new Response(this.state.body ?? JSON.stringify(this.state.json), { status: this.state.status ?? 200 });
      const seed = this.log.length === 0 && (this.seedPolicy === 'all' || (this.seedPolicy === 'claim' && this.seedClaim === client));
      return new Response(JSON.stringify({ state: 'AAA=', updates: this.log, seq: this.log.length, seed }));
    }
    if (kind === 'update' || kind === 'awareness') {
      const body = JSON.parse(String(init?.body)) as { c: number; d: string };
      this.posts.push({ kind, c: body.c });
      if (kind === 'update') {
        this.log.push(body.d);
        this.broadcast({ t: 'u', c: body.c, d: body.d });
      }
    }
    return new Response(null, { status: 204 });
  };

  /** Stores a document, as if another client had seeded it. */
  store(text: string): void {
    const doc = new Y.Doc();
    const paragraph = new Y.XmlElement('paragraph');
    paragraph.insert(0, [new Y.XmlText(text)]);
    doc.getXmlFragment('prosemirror').insert(0, [paragraph]);
    this.log.push(toBase64(Y.encodeStateAsUpdate(doc)));
    doc.destroy();
  }
}

let host: Host;

class FakeHub {
  onopen: (() => void) | null = null;
  onerror: (() => void) | null = null;
  onmessage: ((e: MessageEvent<string>) => void) | null = null;
  closed = false;
  constructor() {
    host.hubs.push(this);
    if (host.autoOpen) setTimeout(() => this.open(), 0);
  }
  open(): void {
    if (!this.closed) this.onopen?.();
  }
  close(): void {
    this.closed = true;
  }
}

const COLLAB = { url: '/c', hubUrl: '/hub', topic: 't', user: { name: 'Ada', color: '#123456' } };
const collab = (extra: Record<string, unknown> = {}): Record<string, unknown> => ({ collaboration: { ...COLLAB, ...extra } });

const handles: MilkdownEditorHandle[] = [];
const keep = (handle: MilkdownEditorHandle): MilkdownEditorHandle => {
  handles.push(handle);
  return handle;
};
const editable = (root: HTMLElement): string | null | undefined => root.querySelector('.ProseMirror')?.getAttribute('contenteditable');
const text = (root: HTMLElement): string => root.querySelector('.ProseMirror')?.textContent ?? '';
const alertOf = (root: HTMLElement): string => root.querySelector('.nowo-milkdown__alert')?.textContent ?? '';
const statusOf = (root: HTMLElement): string => root.querySelector('.nowo-milkdown__status')?.textContent ?? '';
const session = (form: HTMLFormElement): string | null => form.querySelector<HTMLInputElement>('input[name="_nowo_milkdown_collab"]')?.value ?? null;

async function until(check: () => boolean, ms = 2000): Promise<void> {
  const start = Date.now();
  while (!check()) {
    if (Date.now() - start > ms) throw new Error('condition not met in time');
    await tick(2);
  }
}

/** Mounts an editor and waits until it shows, without waiting for the handle (which waits for the document). */
async function mounted(markdown: string, extra: Record<string, unknown> = {}, more: Record<string, unknown> = {}): Promise<{ root: HTMLElement; form: HTMLFormElement; textarea: HTMLTextAreaElement; handle: Promise<MilkdownEditorHandle> }> {
  const root = widget(markdown, { ...collab(extra), ...more });
  const handle = createEditor(root).then(keep);
  await until(() => root.dataset.collab !== undefined);
  return { root, form: root.closest('form') as HTMLFormElement, textarea: root.querySelector('textarea') as HTMLTextAreaElement, handle };
}

/** What a browser does on Save: a cancelable submit, then the form data if nothing stopped it. */
function submit(form: HTMLFormElement, submitter?: HTMLElement): SubmitEvent {
  const event = new Event('submit', { cancelable: true, bubbles: true }) as SubmitEvent;
  if (submitter) Object.defineProperty(event, 'submitter', { value: submitter });
  form.dispatchEvent(event);
  return event;
}

beforeEach(() => {
  host = new Host();
  vi.stubGlobal('EventSource', FakeHub);
  vi.stubGlobal('fetch', vi.fn(host.fetch));
});
afterEach(async () => {
  for (const handle of handles.splice(0)) await handle.destroy();
  vi.useRealTimers();
  vi.unstubAllGlobals();
  window.sessionStorage.clear();
});

describe('waiting for the document', () => {
  it('is read-only on the field content, says it is loading, and the handle waits', async () => {
    host.autoOpen = false;
    const { root, textarea, handle } = await mounted('Original body', { connectTimeout: 60_000 });
    let resolved = false;
    void handle.then(() => (resolved = true));
    await tick(20);
    expect(root.dataset.collab).toBe('connecting');
    expect(root.getAttribute('aria-busy')).toBe('true');
    expect(editable(root)).toBe('false');
    expect(text(root)).toBe('Original body');
    expect(statusOf(root)).toBe('Connecting…');
    expect(textarea.value).toBe('Original body');
    expect(resolved).toBe(false);
    host.hubs[0]!.open();
    await handle;
    expect(root.getAttribute('aria-busy')).toBeNull();
    expect(editable(root)).toBe('true');
    expect(root.dataset.collab).toBe('online');
  });

  it('a save waits, keeps the field and goes on by itself once bound, with the same button', async () => {
    host.autoOpen = false;
    const { root, form, textarea, handle } = await mounted('Original body', { connectTimeout: 60_000 });
    const button = document.createElement('button');
    form.append(button);
    const passed: (HTMLElement | null)[] = [];
    form.addEventListener('submit', (e) => {
      passed.push((e as SubmitEvent).submitter);
      e.preventDefault();
    });
    const event = submit(form, button);
    expect(event.defaultPrevented).toBe(true);
    expect(passed).toEqual([]);
    expect(textarea.value).toBe('Original body');
    expect(session(form)).toBeNull();
    expect(statusOf(root)).toContain('Saving as soon as');
    // A script reading the form while waiting gets the original too.
    expect(new FormData(form).get('body')).toBe('Original body');
    host.hubs[0]!.open();
    await handle;
    await until(() => passed.length === 1);
    expect(passed).toEqual([button]);
    expect(session(form)).toBe('t');
    expect(textarea.value).toBe('Original body\n');
  });

  it('a save while the hub never opens goes on at the deadline with the original value and no session', async () => {
    host.autoOpen = false;
    const { form, textarea, handle } = await mounted('Original body', { connectTimeout: 30 });
    const values: (string | null)[] = [];
    form.addEventListener('submit', (e) => {
      values.push(textarea.value);
      values.push(session(form));
      e.preventDefault();
    });
    expect(submit(form).defaultPrevented).toBe(true);
    await handle;
    await until(() => values.length === 2);
    expect(values).toEqual(['Original body', null]);
  });

  it('a click while read-only gives the editor the focus after the wait; otherwise it never takes it', async () => {
    host.autoOpen = false;
    const focus = vi.spyOn(HTMLElement.prototype, 'focus');
    const clicked = await mounted('Body', { connectTimeout: 60_000 });
    clicked.root.querySelector('.nowo-milkdown__surface')!.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    host.hubs[0]!.open();
    await clicked.handle;
    expect(focus.mock.contexts).toContain(clicked.root.querySelector('.ProseMirror'));
    focus.mockClear();
    const quiet = await mounted('Body', { connectTimeout: 60_000 });
    host.hubs.at(-1)!.open();
    await quiet.handle;
    expect(focus.mock.contexts).not.toContain(quiet.root.querySelector('.ProseMirror'));
  });

  it('the action buttons wait too', async () => {
    host.autoOpen = false;
    const { root, handle } = await mounted('Body', { connectTimeout: 60_000 }, { upload: { url: '/up' } });
    const button = root.querySelector<HTMLButtonElement>('.nowo-milkdown__action')!;
    expect(button.disabled).toBe(true);
    host.hubs[0]!.open();
    await handle;
    expect(button.disabled).toBe(false);
  });

  it('refuses document changes, except binding and bookkeeping', () => {
    let locked = true;
    const filter = waitPlugin(() => locked).spec.filterTransaction as (tr: unknown) => boolean;
    const tr = (docChanged: boolean, metas: Record<string, unknown> = {}): unknown => ({
      docChanged,
      getMeta: (key: unknown) => metas[typeof key === 'string' ? key : (key as { key: string }).key],
    });
    expect(filter(tr(true))).toBe(false);
    expect(filter(tr(false))).toBe(true);
    expect(filter(tr(true, { addToHistory: false }))).toBe(true);
    expect(filter(tr(true, { 'y-sync$': { isChangeOrigin: true } }))).toBe(true);
    locked = false;
    expect(filter(tr(true))).toBe(true);
  });

  it('never reports online before the bind: a stuck presence post does not hold it', async () => {
    host.store('Shared');
    const hang = new Promise<Response>(() => undefined);
    vi.stubGlobal('fetch', vi.fn((url: string, init?: RequestInit) => (url.endsWith('/awareness') ? hang : host.fetch(url, init))));
    const handle = keep(await editor('Shared', collab()));
    expect(handle.root.dataset.collab).toBe('online');
    expect(editable(handle.root)).toBe('true');
    expect(text(handle.root)).toBe('Shared');
  });
});

describe('bound', () => {
  it('shows the shared document, not the field; the field follows; a save carries the session', async () => {
    host.store('Shared text');
    const handle = keep(await editor('Stale field', collab()));
    expect(text(handle.root)).toBe('Shared text');
    expect(handle.getMarkdown()).toBe('Shared text\n');
    const form = handle.textarea.form!;
    submit(form);
    expect(handle.textarea.value).toBe('Shared text\n');
    expect(session(form)).toBe('t');
  });

  it('a person emptying a bound document can save that: it was their choice', async () => {
    const handle = keep(await editor('Body', collab()));
    handle.setMarkdown('');
    await tick(5);
    submit(handle.textarea.form!);
    expect(handle.textarea.value.trim()).toBe('');
  });

  it('an empty field with an empty document binds at once', async () => {
    host.seedPolicy = 'none';
    const handle = keep(await editor('', collab({ connectTimeout: 60_000 })));
    expect(handle.root.dataset.collab).toBe('online');
  });

  it('the seeding client writes the field to the document, once', async () => {
    const handle = keep(await editor('# Seeded', collab({ updateDelay: 0 })));
    await until(() => host.log.length > 0);
    expect(handle.getMarkdown()).toBe('# Seeded\n');
    const doc = new Y.Doc();
    host.log.forEach((u) => Y.applyUpdate(doc, fromBase64(u)));
    expect(doc.getXmlFragment('prosemirror').length).toBe(1);
  });

  it('an order to seed does not touch a document that has content', async () => {
    host.store('Already here');
    host.seedPolicy = 'all';
    const handle = keep(await editor('Field', collab()));
    await tick(20);
    expect(text(handle.root)).toBe('Already here');
  });

  it('an order to seed does not replace a document without text (an image)', async () => {
    const seedDoc = new Y.Doc();
    seedDoc.getXmlFragment('prosemirror').insert(0, [new Y.XmlElement('hr')]);
    host.log.push(toBase64(Y.encodeStateAsUpdate(seedDoc)));
    host.seedPolicy = 'all';
    const handle = keep(await editor('Field', collab()));
    expect(text(handle.root)).not.toContain('Field');
  });

  it('isBlank: nothing or empty paragraphs only', () => {
    const fragment = new Y.Doc().getXmlFragment('prosemirror');
    expect(isBlank(fragment)).toBe(true);
    const paragraph = new Y.XmlElement('paragraph');
    fragment.insert(0, [paragraph]);
    expect(isBlank(fragment)).toBe(true);
    paragraph.insert(0, [new Y.XmlText('x')]);
    expect(isBlank(fragment)).toBe(false);
    const other = new Y.Doc().getXmlFragment('prosemirror');
    other.insert(0, [new Y.XmlElement('hr')]);
    expect(isBlank(other)).toBe(false);
  });
});

describe('an empty state and no order to seed', () => {
  it('waits for the content: the seed of another client arrives, the field is never emptied', async () => {
    host.seedClaim = 'someone else';
    const { root, form, textarea, handle } = await mounted('Original body', { connectTimeout: 60_000 });
    await until(() => host.requests.includes('state'));
    await tick(10);
    expect(root.dataset.collab).toBe('connecting');
    expect(editable(root)).toBe('false');
    submit(form);
    expect(textarea.value).toBe('Original body');
    const peer = prosemirrorToYDoc((await handleSchemaDoc('Original body')) as never);
    host.broadcast({ t: 'u', c: 999, d: toBase64(Y.encodeStateAsUpdate(peer)) });
    await handle;
    expect(root.dataset.collab).toBe('online');
    expect(text(root)).toBe('Original body');
  });

  it('a log holding only an empty paragraph counts as empty', async () => {
    const doc = new Y.Doc();
    doc.getXmlFragment('prosemirror').insert(0, [new Y.XmlElement('paragraph')]);
    host.log.push(toBase64(Y.encodeStateAsUpdate(doc)));
    const { root, textarea, handle } = await mounted('Original body', { connectTimeout: 30 });
    const editorHandle = await handle;
    expect(root.dataset.collab).toBe('standalone');
    expect(editorHandle.getMarkdown()).toBe('Original body\n');
    expect(textarea.value).toBe('Original body');
  });

  it('nobody seeds: standalone at the deadline, content intact in the field and in getMarkdown()', async () => {
    host.seedPolicy = 'none';
    const handle = keep(await editor('Original body', collab({ connectTimeout: 30 })));
    expect(handle.root.dataset.collab).toBe('standalone');
    expect(handle.getMarkdown()).toBe('Original body\n');
    submit(handle.textarea.form!);
    expect(handle.textarea.value).toBe('Original body');
    expect(session(handle.textarea.form!)).toBeNull();
  });

  it('two clients at once: one seeds, the other joins it, both show the body once', async () => {
    const roots = [widget('Body text', collab({ updateDelay: 0 })), document.createElement('div')];
    const form = document.createElement('form');
    roots[1]!.dataset.nowoMilkdownOptions = roots[0]!.dataset.nowoMilkdownOptions!;
    const area = document.createElement('textarea');
    area.value = 'Body text';
    roots[1]!.append(area);
    form.append(roots[1]!);
    document.body.append(form);
    const [a, b] = await Promise.all(roots.map((root) => createEditor(root).then(keep)));
    await until(() => text(a!.root) === 'Body text' && text(b!.root) === 'Body text');
    expect(a!.root.dataset.collab).toBe('online');
    expect(b!.root.dataset.collab).toBe('online');
    expect(b!.textarea.value.trim()).toBe('Body text');
    expect(a!.textarea.value.trim()).toBe('Body text');
  });

  it('a host that seeds everybody can duplicate the body, never lose it', async () => {
    host.seedPolicy = 'all';
    const roots = [widget('Body text', collab({ updateDelay: 0 })), document.createElement('div')];
    const form = document.createElement('form');
    roots[1]!.dataset.nowoMilkdownOptions = roots[0]!.dataset.nowoMilkdownOptions!;
    const area = document.createElement('textarea');
    area.value = 'Body text';
    roots[1]!.append(area);
    form.append(roots[1]!);
    document.body.append(form);
    const [a, b] = await Promise.all(roots.map((root) => createEditor(root).then(keep)));
    await tick(30);
    expect(a!.getMarkdown()).toContain('Body text');
    expect(b!.getMarkdown()).toContain('Body text');
  });
});

/** A ProseMirror document for `text`, built by a throw-away editor. */
async function handleSchemaDoc(markdown: string): Promise<unknown> {
  const root = document.createElement('div');
  root.dataset.nowoMilkdownOptions = JSON.stringify({ features: [] });
  root.append(document.createElement('textarea'));
  root.querySelector('textarea')!.value = markdown;
  const handle = await createEditor(root);
  const doc = handle.builder.editor.action((ctx) => ctx.get(editorViewCtx).state.doc);
  await handle.destroy();
  return doc;
}

describe('standalone', () => {
  it.each([
    ['the token is refused (403)', () => (host.token = { status: 403 })],
    ['the token is missing (404)', () => (host.token = { status: 404 })],
    ['the state is an error with a JSON body (429)', () => (host.state = { status: 429, json: { error: 'rate_limited' } })],
    ['the state is a server error', () => (host.state = { status: 500, body: '<html>' })],
    ['the state is a login page answered 200', () => (host.state = { body: '<html>login' })],
    ['the state has no state', () => (host.state = { json: { seed: false } })],
    ['the state is null', () => (host.state = { json: null })],
  ])('%s: at once, told clearly, content intact, nothing more requested', async (_name, prepare) => {
    prepare();
    const handle = keep(await editor('Original body', collab({ connectTimeout: 60_000 })));
    expect(handle.root.dataset.collab).toBe('standalone');
    expect(handle.root.getAttribute('aria-busy')).toBeNull();
    expect(editable(handle.root)).toBe('true');
    expect(alertOf(handle.root)).toContain('without live co-editing');
    expect(statusOf(handle.root)).toBe('');
    expect(handle.getMarkdown()).toBe('Original body\n');
    submit(handle.textarea.form!);
    expect(handle.textarea.value).toBe('Original body');
    const before = host.requests.length;
    await tick(300);
    expect(host.requests.length).toBe(before);
  });

  it('a corrupt log: standalone, reported once, and the host reset reloads an untouched editor', async () => {
    host.state = { json: { state: 'not-a-yjs-update!!', seq: 3 } };
    const reload = vi.spyOn(collabPage, 'reload').mockImplementation(() => undefined);
    const handle = keep(await editor('Original body', collab({ connectTimeout: 60_000 })));
    expect(handle.root.dataset.collab).toBe('standalone');
    expect(handle.getMarkdown()).toBe('Original body\n');
    await until(() => host.requests.includes('corrupt'));
    vi.useFakeTimers({ toFake: ['setTimeout'] });
    host.broadcast({ t: 'r', c: 0, d: '' });
    vi.advanceTimersByTime(1500);
    expect(reload).toHaveBeenCalledTimes(1);
  });

  it('a hub that keeps failing is retried until the deadline', async () => {
    host.autoOpen = false;
    const { root, handle } = await mounted('Body', { connectTimeout: 400 });
    host.hubs[0]!.onerror?.();
    await until(() => host.hubs.length > 1);
    expect(root.dataset.collab).toBe('connecting');
    host.hubs.at(-1)!.onerror?.();
    await handle;
    expect(root.dataset.collab).toBe('standalone');
  });

  it('an untouched save keeps the bytes of the field, not a re-serialisation', async () => {
    host.token = { status: 403 };
    const source = '* one\n* two\n\n\n';
    const handle = keep(await editor(source, collab()));
    submit(handle.textarea.form!);
    handle.textarea.form!.dispatchEvent(new Event('formdata'));
    expect(handle.textarea.value).toBe(source);
  });

  it('edited: the text is saved, without a session; undoing it restores the bytes', async () => {
    host.token = { status: 403 };
    const handle = keep(await editor('* one\n', collab()));
    const form = handle.textarea.form!;
    handle.setMarkdown('Typed offline');
    submit(form);
    expect(handle.textarea.value).toBe('Typed offline\n');
    expect(session(form)).toBeNull();
    handle.setMarkdown('* one\n');
    submit(form);
    expect(handle.textarea.value).toBe('* one\n');
  });

  it('the hub comes late after typing: the text stays, nothing is sent, the session ends', async () => {
    host.autoOpen = false;
    host.store('Shared by others');
    const { root, form, textarea, handle } = await mounted('Original body', { connectTimeout: 20 });
    const opened = await handle;
    expect(root.dataset.collab).toBe('standalone');
    opened.setMarkdown('Typed offline');
    host.hubs[0]!.open();
    await until(() => opened.provider?.status === 'offline');
    await tick(20);
    expect(root.dataset.collab).toBe('standalone');
    expect(text(root)).toBe('Typed offline');
    expect(alertOf(root)).toContain('without live co-editing');
    expect(host.posts.filter((p) => p.kind === 'update')).toEqual([]);
    expect(host.hubs[0]!.closed).toBe(true);
    submit(form);
    expect(textarea.value).toBe('Typed offline\n');
    expect(session(form)).toBeNull();
  });

  it('the hub comes late, nothing typed: joins the session and shows the shared document', async () => {
    host.autoOpen = false;
    host.store('Shared by others');
    const { root, form, handle } = await mounted('Original body', { connectTimeout: 20 });
    await handle;
    expect(root.dataset.collab).toBe('standalone');
    expect(text(root)).toBe('Original body');
    host.hubs[0]!.open();
    await until(() => root.dataset.collab === 'online');
    expect(text(root)).toBe('Shared by others');
    expect(alertOf(root)).toBe('');
    expect(editable(root)).toBe('true');
    submit(form);
    expect(session(form)).toBe('t');
  });

  it('typed before the seed of another client arrives late: the bind never replaces it', async () => {
    host.seedClaim = 'someone else';
    const opened = keep(await editor('Original body', collab({ connectTimeout: 20 })));
    expect(opened.root.dataset.collab).toBe('standalone');
    opened.setMarkdown('Typed offline');
    const peer = prosemirrorToYDoc((await handleSchemaDoc('From the seed')) as never);
    host.broadcast({ t: 'u', c: 999, d: toBase64(Y.encodeStateAsUpdate(peer)) });
    await tick(10);
    expect(text(opened.root)).toBe('Typed offline');
    expect(opened.provider?.status).toBe('offline');
  });

  it('a host reset does not reload away text typed offline; an untouched editor reloads', async () => {
    const reload = vi.spyOn(collabPage, 'reload').mockImplementation(() => undefined);
    host.seedClaim = 'someone else';
    const touched = keep(await editor('Original body', collab({ connectTimeout: 20 })));
    touched.setMarkdown('Typed offline');
    vi.useFakeTimers({ toFake: ['setTimeout'] });
    host.broadcast({ t: 'r', c: 0, d: '' });
    vi.advanceTimersByTime(3000);
    vi.useRealTimers();
    expect(reload).not.toHaveBeenCalled();
    expect(touched.root.dataset.collab).toBe('standalone');
    expect(text(touched.root)).toBe('Typed offline');
  });

  it('over the reload cap while waiting: the person gets the content and a manual reload', async () => {
    const reload = vi.spyOn(collabPage, 'reload').mockImplementation(() => undefined);
    window.sessionStorage.setItem('nowo-milkdown-reloads:t', JSON.stringify([Date.now(), Date.now(), Date.now()]));
    host.seedClaim = 'someone else';
    const { root, handle } = await mounted('Original body', { connectTimeout: 60_000 });
    await until(() => host.requests.includes('state'));
    await tick(5);
    host.broadcast({ t: 'r', c: 0, d: '' });
    await handle;
    expect(reload).not.toHaveBeenCalled();
    expect(editable(root)).toBe('true');
    expect(text(root)).toBe('Original body');
    expect(root.querySelector('.nowo-milkdown__reload')).not.toBeNull();
  });
});

describe('the wait is bounded', () => {
  const fakeEditor = { action: vi.fn() } as never;
  const hooks = () => ({ onStatus: vi.fn(), onReloadPaused: vi.fn(), onReady: vi.fn(), isUntouched: () => true });

  it.each([
    [undefined, DEFAULT_CONNECT_TIMEOUT],
    [250, 250],
    [0, 0],
    [-5, 0],
    [999_999, MAX_CONNECT_TIMEOUT],
    [Number.NaN, DEFAULT_CONNECT_TIMEOUT],
  ])('connectTimeout %s waits %s ms', async (connectTimeout, wait) => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    host.autoOpen = false;
    const h = hooks();
    const session = startCollaboration(fakeEditor, { ...COLLAB, connectTimeout }, 'x', h);
    await vi.advanceTimersByTimeAsync(Math.max(0, wait - 1));
    if (wait > 0) expect(h.onReady).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(1);
    expect(h.onStatus).toHaveBeenCalledWith('standalone');
    expect(h.onReady).toHaveBeenCalledTimes(1);
    await session.ready;
    session.stop();
  });

  it('a bind that throws falls back instead of leaving the editor locked', async () => {
    const h = hooks();
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const broken = { action: () => { throw new Error('no view'); } } as never;
    host.store('Shared');
    const session = startCollaboration(broken, { ...COLLAB, connectTimeout: 60_000 }, 'x', h);
    await session.ready;
    expect(h.onStatus).toHaveBeenCalledWith('standalone');
    expect(session.bound()).toBe(false);
    session.stop();
  });

  it('stop before the end ends the wait', async () => {
    host.autoOpen = false;
    const session = startCollaboration(fakeEditor, { ...COLLAB, connectTimeout: 60_000 }, 'x', hooks());
    session.stop();
    await session.ready;
    expect(session.provider.status).toBe('offline');
  });
});

describe('after the bind, the connection comes and goes', () => {
  const dropped = (): void => host.hubs.at(-1)!.onerror?.();

  it('a reconnect whose state is empty (the host lost its log) changes nothing and re-sends the document', async () => {
    host.store('Shared');
    const handle = keep(await editor('Shared', collab({ updateDelay: 0 })));
    host.log = [];
    host.seedClaim = null;
    dropped();
    await until(() => handle.root.dataset.collab === 'online' && host.hubs.length > 1);
    expect(text(handle.root)).toBe('Shared');
    submit(handle.textarea.form!);
    expect(handle.textarea.value).toBe('Shared\n');
    await until(() => host.log.length > 0);
  });

  it.each([
    ['a refused token', () => (host.token = { status: 401 }), () => (host.token = {})],
    ['a state error', () => (host.state = { status: 429, json: { error: 'rate_limited' } }), () => (host.state = null)],
    ['a state without state', () => (host.state = { json: {} }), () => (host.state = null)],
  ])('%s on reconnect: stays bound and offline, keeps the text, saves it, retries', async (_name, breakIt, repair) => {
    host.store('Shared');
    const handle = keep(await editor('Shared', collab({ updateDelay: 0 })));
    breakIt();
    const requests = host.requests.length;
    dropped();
    await until(() => host.requests.length > requests);
    await until(() => handle.root.dataset.collab === 'offline');
    expect(text(handle.root)).toBe('Shared');
    expect(editable(handle.root)).toBe('true');
    handle.setMarkdown('Typed while out');
    const form = handle.textarea.form!;
    submit(form);
    expect(handle.textarea.value).toBe('Typed while out\n');
    expect(session(form)).toBeNull();
    repair();
    await until(() => handle.root.dataset.collab === 'online', 8000);
    expect(text(handle.root)).toBe('Typed while out');
    expect(host.log.length).toBeGreaterThan(1);
  });

  it('getMarkdown() is the document in every state, never an empty unbound editor', async () => {
    host.autoOpen = false;
    const { root, handle } = await mounted('Original body', { connectTimeout: 20 });
    const opened = await handle;
    expect(root.dataset.collab).toBe('standalone');
    expect(opened.getMarkdown()).toBe('Original body\n');
    host.store('Shared');
    host.hubs[0]!.open();
    await until(() => root.dataset.collab === 'online');
    expect(opened.getMarkdown()).toBe('Shared\n');
    host.hubs[0]!.onerror?.();
    expect(opened.getMarkdown()).toBe('Shared\n');
  });
});

describe('without collaboration', () => {
  it('nothing changes: editable at once, no state attributes, the submit writes the editor', async () => {
    const handle = keep(await editor('* one\n'));
    expect(handle.root.dataset.collab).toBeUndefined();
    expect(handle.root.getAttribute('aria-busy')).toBeNull();
    expect(editable(handle.root)).toBe('true');
    expect(handle.provider).toBeNull();
    const event = submit(handle.textarea.form!);
    expect(event.defaultPrevented).toBe(false);
    expect(handle.textarea.value).toBe(handle.getMarkdown());
    expect(session(handle.textarea.form!)).toBeNull();
  });

  it('a read-only field stays read-only', async () => {
    const handle = keep(await editor('Body', { readonly: true }));
    expect(editable(handle.root)).toBe('false');
  });

  it('a read-only field with collaboration stays read-only after the bind', async () => {
    host.store('Shared');
    const handle = keep(await editor('Shared', { ...collab(), readonly: true }));
    expect(handle.root.dataset.collab).toBe('online');
    expect(editable(handle.root)).toBe('false');
  });
});
