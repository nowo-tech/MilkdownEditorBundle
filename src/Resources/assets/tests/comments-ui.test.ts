import { afterEach, describe, expect, it, vi } from 'vitest';
import { editorViewCtx } from '@milkdown/kit/core';
import { TextSelection } from '@milkdown/kit/prose/state';
import { editor, tick, widget } from './helpers';
import { createEditor } from '../src/editor';
import type { MilkdownEditorHandle } from '../src/editor';
import { CanonicalText } from '../src/comments/anchor';
import { CommentsClient, parseComment, parseThreadDetail } from '../src/comments/client';
import { sanitizeBody, MAX_NODES } from '../src/comments/sanitize';
import { formatDate, mountThreadPanel, ThreadPanel } from '../src/comments/thread-ui';
import { defaultRuntime } from '../src/runtime';

let handle: MilkdownEditorHandle | null = null;
afterEach(async () => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  await handle?.destroy();
  handle = null;
  document.body.replaceChildren();
});

const view = (h: MilkdownEditorHandle) => h.builder.editor.action((ctx) => ctx.get(editorViewCtx));
const select = (h: MilkdownEditorHandle, text: string) => {
  const v = view(h);
  const c = new CanonicalText(v.state.doc);
  const at = c.text.indexOf(text);
  v.dispatch(v.state.tr.setSelection(TextSelection.create(v.state.doc, c.posAt(at), c.posAt(at + text.length, true))));
};

type Call = { method: string; url: string; body: unknown; headers: Record<string, string> };
const json = (status: number, value: unknown) => new Response(status === 204 ? null : JSON.stringify(value), { status, headers: { 'Content-Type': 'application/json' } });

/** A fake host: routes → answers; records every call. */
function host(routes: Record<string, (call: Call) => Response>) {
  const calls: Call[] = [];
  const fetcher = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    const call: Call = { method: init?.method ?? 'GET', url: String(input), body: init?.body ? JSON.parse(String(init.body)) : undefined, headers: (init?.headers ?? {}) as Record<string, string> };
    calls.push(call);
    const key = `${call.method} ${call.url.replace(/^\/c/, '')}`;
    const route = routes[key];
    return route ? route(call) : json(404, {});
  });
  vi.stubGlobal('fetch', fetcher);
  return calls;
}

const ANCHOR = { v: 1, quote: { exact: 'brown fox', prefix: 'The quick ', suffix: ' jumps.' }, position: { start: 10, end: 19 }, block: { index: 0, heading: null }, yjs: null };
const comment = (id: string, extra: Record<string, unknown> = {}) => ({
  id,
  author: { name: 'Ana', color: '#336699' },
  html: '<p>Hi <strong>there</strong></p>',
  createdAt: '2026-11-03T10:00:00Z',
  reactions: [{ emoji: '👍', count: 2, mine: true }],
  can: { edit: true, delete: true },
  ...extra,
});
const thread = (id: string, extra: Record<string, unknown> = {}) => ({
  id,
  anchor: ANCHOR,
  resolved: false,
  count: 1,
  updatedAt: '2026-11-03T10:00:00Z',
  comments: [comment('c1')],
  can: { reply: true, resolve: true, react: true },
  ...extra,
});
const OPTIONS = { features: ['comments'], comments: { url: '/c', panel: 'sidebar', csrfToken: 'tok' } };

describe('comment bodies are copied through an allow-list', () => {
  it('keeps safe markup and drops everything else', () => {
    const f = sanitizeBody(
      '<p class="nowo-md-x evil">a <a href="javascript:alert(1)" onclick="x()">x</a> <a href="/p">ok</a><img src=x onerror=alert(1)><script>alert(1)</script><style>*{}</style><span style="color:red" title="t">s</span><custom>kept text</custom><svg><text>no</text></svg></p>',
    );
    const div = document.createElement('div');
    div.append(f);
    expect(div.innerHTML).toBe('<p class="nowo-md-x">a <a rel="noopener noreferrer nofollow">x</a> <a href="/p" rel="noopener noreferrer nofollow">ok</a><span title="t">s</span>kept text</p>');
    const big = sanitizeBody('<b>x</b>'.repeat(MAX_NODES + 10));
    expect(big.childNodes.length).toBeLessThanOrEqual(MAX_NODES);
    expect(sanitizeBody('<!-- c -->t').textContent).toBe('t');
  });
});

describe('host answers are validated', () => {
  it('parses comments and threads defensively', () => {
    expect(parseComment({ id: 'bad id' })).toBeNull();
    const c = parseComment({ id: 'c', author: { name: '', avatarUrl: 'javascript:x', color: 'red' }, html: 1, reactions: [{ emoji: 'abc', count: 1 }, { emoji: '<', count: 1 }, { emoji: '🎉', count: 0 }, { emoji: '🎉', count: 3 }, 'x'], createdAt: 'yesterday' })!;
    expect(c).toEqual({ id: 'c', author: { name: '?', avatarUrl: null, color: null }, html: '', createdAt: '', editedAt: null, reactions: [{ emoji: '🎉', count: 3, mine: false }], can: { edit: false, delete: false }, deleted: false });
    expect(parseComment({ id: 'c', deleted: true, html: '<p>x</p>', can: { edit: true }, reactions: [{ emoji: '🎉', count: 1 }] })).toMatchObject({ html: '', can: { edit: false, delete: false }, reactions: [] });
    expect(parseComment({ id: 'c', author: { avatarUrl: '/a.png' } })?.author.avatarUrl).toBe('/a.png');
    expect(parseThreadDetail({ id: 'x y' })).toBeNull();
    const t = parseThreadDetail({ ...thread('t'), count: 0, resolvedBy: { name: 'Bo' }, resolvedAt: '2026-11-03T11:00:00+01:00' })!;
    expect(t.count).toBe(1);
    expect(t.resolvedBy).toEqual({ name: 'Bo' });
    expect(t.resolvedAt).toBe('2026-11-03T11:00:00+01:00');
    expect(parseThreadDetail({ id: 't', anchor: null })).toMatchObject({ comments: [], resolvedBy: null, can: { reply: false } });
  });

  it('sends CSRF on writes only, maps statuses and network errors', async () => {
    const calls: Call[] = [];
    const fetcher = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      calls.push({ method: init?.method ?? 'GET', url: String(input), body: init?.body, headers: init?.headers as Record<string, string> });
      if (String(input).endsWith('/boom')) throw new Error('net');
      if (init?.method === 'DELETE') return json(204, null);
      if (String(input).includes('bad')) return json(200, { id: 'no pe' });
      return json(String(input).includes('/threads/t') ? 200 : 403, thread('t'));
    }) as unknown as typeof fetch;
    const client = new CommentsClient('/c/', 'tok', fetcher);
    expect((await client.get('t')).ok).toBe(true);
    expect(calls[0]!.headers['X-CSRF-Token']).toBeUndefined();
    expect(await client.list()).toEqual({ ok: false, status: 403 });
    expect(await client.remove('c1')).toEqual({ ok: true, value: null });
    expect(calls[2]!.headers['X-CSRF-Token']).toBe('tok');
    expect(calls[2]!.url).toBe('/c/comments/c1');
    expect(await client.get('bad')).toEqual({ ok: false, status: 0 });
    expect(await (client as unknown as { request: (m: string, p: string) => Promise<unknown> }).request('GET', '/boom')).toEqual({ ok: false, status: 0 });
    await client.react('c1', '👍', true);
    expect(calls.at(-1)!.url).toBe(`/c/comments/c1/reactions/${encodeURIComponent('👍')}`);
    expect(calls.at(-1)!.method).toBe('PUT');
    const plain = new CommentsClient('/c', null, fetcher);
    await plain.reply('t', 'x'.repeat(20_000));
    expect(calls.at(-1)!.headers['X-CSRF-Token']).toBeUndefined();
    expect(JSON.parse(String(calls.at(-1)!.body)).body).toHaveLength(10_000);
    expect(formatDate('nope')).toBe('nope');
    expect(formatDate('2026-11-03T10:00:00Z')).not.toBe('');
  });
});

describe('thread component (1.6)', () => {
  it('lists threads, creates one from the selection and opens it', async () => {
    const calls = host({
      'GET /threads': () => json(200, { threads: [thread('t1')], page: [{ id: 'p1', anchor: null, resolved: false, count: 1 }], truncated: true }),
      'POST /threads': (c) => json(201, thread('t2', { anchor: (c.body as { anchor: unknown }).anchor, comments: [comment('c2')] })),
      'GET /threads/t2': () => json(200, thread('t2', { comments: [comment('c2')] })),
    });
    handle = await editor('The quick brown fox jumps.\n', OPTIONS);
    await tick(10);
    const aside = handle.root.querySelector<HTMLElement>('aside.nowo-milkdown-comments')!;
    expect(aside.getAttribute('aria-label')).toBe('Comments');
    expect(aside.querySelector<HTMLElement>('.nowo-milkdown-comments__truncated')!.hidden).toBe(false);
    expect(aside.querySelectorAll('[data-thread-id]')).toHaveLength(2);
    expect(handle.comments!.status('t1')).toBe('attached');
    select(handle, 'quick');
    const created: unknown[] = [];
    handle.root.addEventListener('nowo-milkdown:comment-created', (e) => created.push((e as CustomEvent).detail));
    handle.comments!.start();
    const form = aside.querySelector<HTMLFormElement>('.nowo-milkdown-comments__form')!;
    expect(form.hidden).toBe(false);
    expect(form.querySelector('blockquote')!.textContent).toBe('quick');
    form.querySelector('textarea')!.value = '  ';
    form.requestSubmit();
    expect(calls.filter((c) => c.method === 'POST')).toHaveLength(0);
    form.querySelector('textarea')!.value = 'Why?';
    form.querySelector('textarea')!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', ctrlKey: true, bubbles: true }));
    await tick(20);
    const post = calls.find((c) => c.method === 'POST')!;
    expect(post.body).toMatchObject({ body: 'Why?', anchor: { quote: { exact: 'quick' } } });
    expect(post.headers['X-CSRF-Token']).toBe('tok');
    expect(created).toHaveLength(1);
    expect(form.hidden).toBe(true);
    const open = aside.querySelector('[data-thread-id="t2"] .nowo-milkdown-comments__thread')!;
    expect(open.querySelector('.nowo-milkdown-comments__body strong')?.textContent).toBe('there');
    expect(open.querySelector('time')?.getAttribute('datetime')).toBe('2026-11-03T10:00:00Z');
    expect(open.querySelector('.nowo-milkdown-comments__avatar')?.textContent).toBe('A');
  });

  it('replies, reacts, resolves, edits and deletes through the host', async () => {
    let current = thread('t1');
    const calls = host({
      'GET /threads': () => json(200, { threads: [current], page: [] }),
      'GET /threads/t1': () => json(200, current),
      'POST /threads/t1/comments': () => {
        current = thread('t1', { comments: [comment('c1'), comment('c2', { author: { name: 'Bo' }, editedAt: '2026-11-03T12:00:00Z' })], count: 2 });
        return json(201, current);
      },
      'PUT /comments/c1/reactions/%F0%9F%91%8D': () => json(200, current),
      'DELETE /comments/c1/reactions/%F0%9F%91%8D': () => json(200, current),
      'PUT /comments/c1/reactions/%E2%9D%A4%EF%B8%8F': () => json(200, current),
      'PATCH /threads/t1': (c) => {
        current = thread('t1', { resolved: (c.body as { resolved: boolean }).resolved, resolvedBy: { name: 'Cy' } });
        return json(200, current);
      },
      'PATCH /comments/c1': () => json(200, thread('t1', { comments: [comment('c1', { html: '<p>edited</p>' })] })),
      'DELETE /comments/c1': () => json(204, null),
    });
    handle = await editor('The quick brown fox jumps.\n', OPTIONS);
    await tick(10);
    const changed: string[] = [];
    handle.root.addEventListener('nowo-milkdown:comment-changed', (e) => changed.push((e as CustomEvent).detail.action));
    const aside = handle.root.querySelector<HTMLElement>('aside')!;
    aside.querySelector<HTMLButtonElement>('[data-thread-id="t1"] .nowo-milkdown-comments__card')!.click();
    await tick(10);
    const section = () => aside.querySelector<HTMLElement>('[data-thread-id="t1"] .nowo-milkdown-comments__thread')!;
    const reply = section().querySelector<HTMLFormElement>('form')!;
    reply.querySelector('textarea')!.value = 'Agreed';
    reply.requestSubmit();
    await tick(10);
    expect(section().querySelectorAll('.nowo-milkdown-comments__comment')).toHaveLength(2);
    expect(section().querySelector('.nowo-milkdown-comments__edited')).not.toBeNull();
    const like = section().querySelector<HTMLButtonElement>('.nowo-milkdown-comments__reaction')!;
    expect(like.getAttribute('aria-pressed')).toBe('true');
    expect(like.getAttribute('aria-label')).toBe('React with 👍 (2)');
    like.click();
    await tick(10);
    expect(calls.at(-1)!.method).toBe('DELETE');
    section().querySelectorAll<HTMLButtonElement>('.nowo-milkdown-comments__reaction')[1]!.click();
    await tick(10);
    [...section().querySelectorAll<HTMLButtonElement>('.nowo-milkdown-comments__actions button')][0]!.click();
    await tick(10);
    expect(calls.at(-1)!.body).toEqual({ resolved: true });
    // Resolved threads are hidden until "Show resolved".
    expect(aside.querySelector('[data-thread-id="t1"]')).toBeNull();
    const box = aside.querySelector<HTMLInputElement>('input[type="checkbox"]')!;
    box.checked = true;
    box.dispatchEvent(new Event('change'));
    aside.querySelector<HTMLButtonElement>('[data-thread-id="t1"] .nowo-milkdown-comments__card')!.click();
    await tick(10);
    expect(section().querySelector('.nowo-milkdown-comments__resolved')?.textContent).toBe('Resolved by Cy');
    const edit = [...section().querySelectorAll<HTMLButtonElement>('.nowo-milkdown-comments__own button')][0]!;
    edit.click();
    const editForm = section().querySelector<HTMLFormElement>('.nowo-milkdown-comments__comment form')!;
    editForm.querySelector('textarea')!.value = 'edited';
    editForm.requestSubmit();
    await tick(10);
    expect(section().querySelector('.nowo-milkdown-comments__body')?.textContent).toBe('edited');
    [...section().querySelectorAll<HTMLButtonElement>('.nowo-milkdown-comments__own button')][1]!.click();
    await tick(10);
    expect(aside.querySelector('[data-thread-id="t1"]')).toBeNull();
    expect(changed).toEqual(['reply', 'react', 'react', 'resolve', 'edit', 'delete']);
  });

  it('reports errors, removes vanished threads and shows deleted comments and orphans', async () => {
    host({
      'GET /threads': () => json(200, { threads: [thread('t1'), thread('gone', { anchor: { ...ANCHOR, quote: { exact: 'zebra', prefix: '', suffix: '' }, position: { start: 0, end: 5 } } })], page: [] }),
      'GET /threads/t1': () => json(200, thread('t1', { comments: [{ id: 'c0', deleted: true }, comment('c1', { can: {} })], can: {} })),
      'POST /threads/t1/comments': () => json(500, {}),
    });
    handle = await editor('The quick brown fox jumps.\n', OPTIONS);
    await tick(10);
    const errors: unknown[] = [];
    handle.root.addEventListener('nowo-milkdown:comment-error', (e) => errors.push((e as CustomEvent).detail));
    const aside = handle.root.querySelector<HTMLElement>('aside')!;
    expect(aside.querySelector('[data-thread-id="gone"] .nowo-milkdown-comments__orphaned')?.textContent).toBe('The commented text was removed');
    handle.comments!.open('t1');
    await tick(10);
    const section = aside.querySelector<HTMLElement>('[data-thread-id="t1"] .nowo-milkdown-comments__thread')!;
    expect(section.querySelector('.nowo-milkdown-comments__deleted')?.textContent).toBe('Comment deleted');
    expect(section.querySelector('form')).toBeNull();
    expect(section.querySelector<HTMLButtonElement>('.nowo-milkdown-comments__reaction')?.disabled).toBe(true);
    section.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(aside.querySelector('[data-thread-id="t1"] .nowo-milkdown-comments__thread')).toBeNull();
    await handle.comments!.refresh(['gone']);
    expect(aside.querySelector('[data-thread-id="gone"]')).toBeNull();
    expect(handle.comments!.status('gone')).toBe('unknown');
    await handle.comments!.refresh();
    expect(errors).toEqual([]);
    vi.stubGlobal('fetch', vi.fn(async () => json(500, {})));
    await handle.comments!.refresh();
    await handle.comments!.refresh(['t1']);
    expect(errors).toEqual([{ action: 'list', status: 500 }, { action: 'get', status: 500 }]);
    expect(handle.root.querySelector('.nowo-milkdown__alert')?.textContent).toBe('Comments could not be loaded');
  });

  it('PATCHes drifted anchors with the base and refetches on 409', async () => {
    let conflict = false;
    const calls = host({
      'GET /threads': () => json(200, { threads: [thread('t1')], page: [] }),
      'PATCH /threads/t1': () => (conflict ? json(409, {}) : json(200, thread('t1', { updatedAt: '2026-11-03T13:00:00Z' }))),
      'GET /threads/t1': () => json(200, thread('t1')),
    });
    handle = await editor('The quick brown fox jumps.\n', OPTIONS);
    await tick(10);
    const anchors = [{ id: 't1', anchor: { ...ANCHOR, position: { start: 12, end: 21 } } }];
    handle.root.dispatchEvent(new CustomEvent('nowo-milkdown:comment-anchors-changed', { detail: { anchors } }));
    await tick(10);
    expect(calls.at(-1)!.body).toMatchObject({ base: '2026-11-03T10:00:00Z', anchor: { position: { start: 12 } } });
    conflict = true;
    handle.root.dispatchEvent(new CustomEvent('nowo-milkdown:comment-anchors-changed', { detail: { anchors } }));
    await tick(10);
    expect(calls.at(-2)!.body).toMatchObject({ base: '2026-11-03T13:00:00Z' });
    expect(calls.at(-1)!.method).toBe('GET');
    vi.stubGlobal('fetch', vi.fn(async () => json(500, {})));
    const errors: unknown[] = [];
    handle.root.addEventListener('nowo-milkdown:comment-error', (e) => errors.push((e as CustomEvent).detail));
    handle.root.dispatchEvent(new CustomEvent('nowo-milkdown:comment-anchors-changed', { detail: { anchors } }));
    await tick(10);
    expect(errors).toEqual([{ action: 'anchor', status: 500 }]);
  });

  it('drops answers that arrive after destroy (the editor is gone)', async () => {
    let answer: (r: Response) => void = () => undefined;
    host({ 'GET /threads': () => new Promise<Response>((resolve) => (answer = resolve)) as unknown as Response });
    const root = document.createElement('div');
    const surface = document.createElement('div');
    root.append(surface);
    document.body.append(root);
    const api = { set: vi.fn(), upsert: vi.fn(), remove: vi.fn(), status: () => 'attached', showResolved: vi.fn(), focus: vi.fn() };
    const panel = mountThreadPanel({
      root,
      surface,
      options: { url: '/c', csrfToken: null, canCreate: false, panel: 'sidebar', container: null, topic: null },
      runtime: defaultRuntime(),
      api: () => api as never,
      announce: vi.fn(),
      tops: () => new Map(),
      hubUrl: null,
    });
    await tick(1);
    panel.destroy();
    answer(json(200, { threads: [thread('t1')], page: [] }));
    await tick(10);
    expect(api.set).not.toHaveBeenCalled();
    expect(root.querySelector('.nowo-milkdown-comments')).toBeNull();
  });

  it('refetches threads named by live updates (ids only, validated, debounced)', async () => {
    host({ 'GET /threads': () => json(200, { threads: [], page: [] }), 'GET /threads/t1': () => json(200, thread('t1')) });
    const listeners: ((e: MessageEvent) => void)[] = [];
    const sources: string[] = [];
    const fake = (url: string) => {
      sources.push(url);
      return { addEventListener: (_: string, l: (e: MessageEvent) => void) => listeners.push(l), close: vi.fn() } as unknown as EventSource;
    };
    const root = document.createElement('div');
    const surface = document.createElement('div');
    root.append(surface);
    document.body.append(root);
    const api = { set: vi.fn(), upsert: vi.fn(), remove: vi.fn(), status: () => 'attached', showResolved: vi.fn(), focus: vi.fn() };
    const panel = mountThreadPanel({
      root,
      surface,
      options: { url: '/c', csrfToken: null, canCreate: false, panel: 'margin', container: null, topic: 'wiki/p/1/comments' },
      runtime: defaultRuntime(),
      api: () => api as never,
      announce: vi.fn(),
      tops: () => new Map([['t1', 40]]),
      hubUrl: '/.well-known/mercure',
      eventSource: fake,
    });
    expect(panel).toBeInstanceOf(ThreadPanel);
    expect(sources[0]).toContain('topic=wiki%2Fp%2F1%2Fcomments');
    expect(root.querySelector('.nowo-milkdown-comments__add')).toBeNull();
    vi.useFakeTimers();
    listeners[0]!({ data: 'not json' } as MessageEvent);
    listeners[0]!({ data: '{"threads":"x"}' } as MessageEvent);
    listeners[0]!({ data: JSON.stringify({ threads: ['t1', 'bad id', 5, 't1'] }) } as MessageEvent);
    expect(api.upsert).not.toHaveBeenCalled();
    vi.advanceTimersByTime(600);
    vi.useRealTimers();
    await tick(10);
    expect(api.upsert).toHaveBeenCalledWith(expect.objectContaining({ id: 't1' }));
    expect(root.querySelector<HTMLElement>('[data-thread-id="t1"]')?.style.marginTop).toBe('40px');
    panel.destroy();
    expect(root.querySelector('aside')).toBeNull();
  });

  it('is not mounted without a panel or URL, and page comments use a null anchor', async () => {
    handle = await editor('Text', { features: ['comments'], comments: { url: '/c', panel: 'none' } });
    expect(handle.root.querySelector('aside')).toBeNull();
    await handle.destroy();
    const calls = host({
      'GET /threads': () => json(200, { threads: [], page: [] }),
      'POST /threads': () => json(201, { id: 'p1', anchor: null, resolved: false, count: 1, comments: [], can: {} }),
      'GET /threads/p1': () => json(200, { id: 'p1', anchor: null, resolved: false, count: 1, comments: [], can: {} }),
    });
    handle = await editor('Text', OPTIONS);
    await tick(10);
    const aside = handle.root.querySelector<HTMLElement>('aside')!;
    aside.querySelector<HTMLButtonElement>('.nowo-milkdown-comments__add')!.click();
    const form = aside.querySelector<HTMLFormElement>('.nowo-milkdown-comments__form')!;
    expect(form.querySelector('blockquote')!.hidden).toBe(true);
    form.querySelector('textarea')!.value = 'Page note';
    form.requestSubmit();
    await tick(20);
    expect(calls.find((c) => c.method === 'POST')!.body).toEqual({ anchor: null, body: 'Page note' });
    expect(aside.querySelector('.nowo-milkdown-comments__list--page [data-thread-id="p1"]')).not.toBeNull();
    // Escape in the composer cancels.
    aside.querySelector<HTMLButtonElement>('.nowo-milkdown-comments__add')!.click();
    form.querySelector('textarea')!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(form.hidden).toBe(true);
    vi.stubGlobal('fetch', vi.fn(async () => json(422, {})));
    aside.querySelector<HTMLButtonElement>('.nowo-milkdown-comments__add')!.click();
    form.querySelector('textarea')!.value = 'x';
    form.requestSubmit();
    await tick(10);
    expect(handle.root.querySelector('.nowo-milkdown__alert')?.textContent).toBe('The comment could not be saved');
  });

  it('host drawer mode: no chrome, host container, open requested first, reveal keeps focus, counts, Escape left to the host', async () => {
    host({
      'GET /threads': () => json(200, { threads: [thread('t1'), thread('t2', { resolved: true })], page: [{ id: 'p1', anchor: null, resolved: false, count: 1 }] }),
      'GET /threads/t1': () => json(200, thread('t1')),
    });
    document.body.replaceChildren();
    const drawer = document.createElement('div');
    drawer.id = 'drawer';
    const counted: unknown[] = [];
    document.addEventListener('nowo-milkdown:comments-count', (e) => counted.push((e as CustomEvent).detail));
    handle = await editor('The quick brown fox jumps.\n', { features: ['comments'], comments: { url: '/c', panel: 'container', container: '#late' } });
    await tick(20);
    // The container did not exist yet: the host mounts the component itself.
    expect(handle.root.querySelector('.nowo-milkdown-comments')).toBeNull();
    document.body.append(drawer);
    expect(handle.comments!.mount(drawer)).toBe(true);
    const panel = drawer.querySelector<HTMLElement>('.nowo-milkdown-comments--container')!;
    expect(panel.tagName).toBe('DIV');
    expect(panel.getAttribute('aria-label')).toBeNull();
    expect(panel.querySelector('h2')).toBeNull();
    expect(handle.root.classList.contains('nowo-milkdown--with-comments')).toBe(false);
    expect(handle.comments!.count()).toEqual({ open: 2, resolved: 1, orphaned: 0, page: 1, total: 3 });
    expect(counted.at(-1)).toEqual({ open: 2, resolved: 1, orphaned: 0, page: 1, total: 3 });

    const order: string[] = [];
    handle.root.addEventListener('nowo-milkdown:comments-open-requested', (e) => order.push(`requested:${(e as CustomEvent).detail.id}`));
    handle.root.addEventListener('nowo-milkdown:comment-open', () => order.push('open'));
    const outside = document.createElement('button');
    document.body.append(outside);
    outside.focus();
    // Panel → text: the card reveals the range (flash) and the panel keeps focus.
    panel.querySelector<HTMLButtonElement>('[data-thread-id="t1"] .nowo-milkdown-comments__card')!.click();
    expect(order).toEqual(['open', 'requested:t1']);
    const dom = handle.builder.editor.action((ctx) => ctx.get(editorViewCtx)).dom;
    expect(dom.querySelector('.nowo-milkdown-comment--flash')?.textContent).toBe('brown fox');
    expect(dom.contains(document.activeElement)).toBe(false);
    await tick(10);
    const section = panel.querySelector<HTMLElement>('[data-thread-id="t1"] .nowo-milkdown-comments__thread')!;
    expect(section.contains(document.activeElement)).toBe(true);
    // Escape is the host's (no preventDefault, the thread stays open).
    const esc = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true });
    section.dispatchEvent(esc);
    expect(esc.defaultPrevented).toBe(false);
    expect(panel.querySelector('[data-thread-id="t1"] .nowo-milkdown-comments__thread')).not.toBeNull();
    await tick(1600);
    expect(dom.querySelector('.nowo-milkdown-comment--flash')).toBeNull();
    expect(handle.comments!.reveal('missing')).toBe(false);
    // Text → panel: a new comment asks the host to open the drawer first.
    handle.comments!.start();
    expect(order.filter((o) => o === 'requested:null')).toHaveLength(0); // empty selection: nothing
    const v = handle.builder.editor.action((ctx) => ctx.get(editorViewCtx));
    v.dispatch(v.state.tr.setSelection(TextSelection.create(v.state.doc, 1, 4)));
    handle.comments!.start();
    expect(order.at(-1)).toBe('requested:null');
    const composer = panel.querySelector<HTMLFormElement>('.nowo-milkdown-comments__form')!;
    const escComposer = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true });
    composer.querySelector('textarea')!.dispatchEvent(escComposer);
    expect(escComposer.defaultPrevented).toBe(false);
    expect(composer.hidden).toBe(false);
  });

  it('host drawer mode renders into an existing container and the API reports no component otherwise', async () => {
    host({ 'GET /threads': () => json(200, { threads: [], page: [] }) });
    const root = widget('x', { features: ['comments'], comments: { url: '/c', panel: 'container', container: '#drawer2' } });
    const drawer = document.createElement('aside');
    drawer.id = 'drawer2';
    document.body.append(drawer);
    handle = await createEditor(root);
    expect(drawer.querySelector('.nowo-milkdown-comments--container')).not.toBeNull();
    await handle.destroy();
    handle = await editor('x', { features: ['comments'], comments: { url: '/c', panel: 'container', container: ':::not a selector' } });
    expect(document.querySelector('.nowo-milkdown-comments--container')).toBeNull();
    await handle.destroy();
    handle = await editor('x', { features: ['comments'], comments: {} });
    expect(handle.comments!.mount(document.createElement('div'))).toBe(false);
  });

  it('keeps a reply being typed (and its focus) across re-renders', async () => {
    host({ 'GET /threads': () => json(200, { threads: [thread('t1')], page: [] }), 'GET /threads/t1': () => json(200, thread('t1')) });
    handle = await editor('The quick brown fox jumps.\n', OPTIONS);
    await tick(10);
    handle.comments!.open('t1');
    await tick(10);
    const area = () => handle!.root.querySelector<HTMLTextAreaElement>('[data-thread-id="t1"] textarea[data-draft="t1"]')!;
    area().focus();
    area().value = 'Half a sentence';
    area().dispatchEvent(new Event('input'));
    await handle.comments!.refresh(['t1']);
    expect(area().value).toBe('Half a sentence');
    expect(document.activeElement).toBe(area());
  });
});
