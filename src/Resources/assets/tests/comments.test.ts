import { afterEach, describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { editorViewCtx } from '@milkdown/kit/core';
import { TextSelection } from '@milkdown/kit/prose/state';
import { editor, keydown, tick } from './helpers';
import type { MilkdownEditorHandle } from '../src/editor';
import { anchorOf, CanonicalText, findQuote, LEAF, MAX_MATCHES, parseCommentAnchor, type CommentAnchor } from '../src/comments/anchor';
import { commentsView, parseThreads, resolveThread, MAX_THREADS, type YjsAnchors } from '../src/comments/plugin';
import { commentsOptions, parseOptions, sameOrigin } from '../src/options';

const vectors = JSON.parse(readFileSync(resolve(__dirname, '../../../../tests/Fixtures/comment-anchors.json'), 'utf8')) as {
  valid: { name: string; anchor: unknown; normalised: unknown }[];
  invalid: { name: string; anchor: unknown }[];
};

let handle: MilkdownEditorHandle | null = null;
afterEach(async () => {
  vi.useRealTimers();
  await handle?.destroy();
  handle = null;
  document.body.replaceChildren();
});

const view = (h: MilkdownEditorHandle) => h.builder.editor.action((ctx) => ctx.get(editorViewCtx));
const select = (h: MilkdownEditorHandle, from: number, to: number) => {
  const v = view(h);
  v.dispatch(v.state.tr.setSelection(TextSelection.create(v.state.doc, from, to)));
};
const OPTIONS = { features: ['comments'], comments: { canCreate: true } };
const open = (markdown: string, options: Record<string, unknown> = OPTIONS) => editor(markdown, options);
const find = (h: MilkdownEditorHandle, text: string): { from: number; to: number } => {
  const c = new CanonicalText(view(h).state.doc);
  const at = c.text.indexOf(text);
  return { from: c.posAt(at), to: c.posAt(at + text.length, true) };
};
const anchorFor = (h: MilkdownEditorHandle, text: string): CommentAnchor => {
  const { from, to } = find(h, text);
  select(h, from, to);
  return h.comments!.selectionAnchor()!;
};
const highlights = (h: MilkdownEditorHandle) => [...view(h).dom.querySelectorAll<HTMLElement>('[data-comment-id]')];

describe('anchor validation (contract v1, shared vectors with PHP)', () => {
  it.each(vectors.valid)('accepts $name', ({ anchor, normalised }) => {
    expect(parseCommentAnchor(anchor)).toEqual(normalised);
  });
  it.each(vectors.invalid)('rejects $name', ({ anchor }) => {
    expect(parseCommentAnchor(anchor)).toBeNull();
  });
  it('rejects anchors over 16 KiB', () => {
    const exact = '\u{1F600}'.repeat(2048);
    const a = { v: 1, quote: { exact, prefix: '', suffix: '' }, position: { start: 0, end: exact.length }, block: { index: 0, heading: '中'.repeat(200) }, yjs: null };
    expect(parseCommentAnchor(a)).not.toBeNull();
    // Control characters are escaped as \u00XX (6 bytes each) in JSON, as in PHP.
    const control = '\u0001'.repeat(4096);
    expect(parseCommentAnchor({ ...a, quote: { exact: control, prefix: '', suffix: '' }, position: { start: 0, end: 4096 } })).toBeNull();
  });
});

describe('canonical text', () => {
  it('separates blocks with one newline, maps leaves to U+FFFC and round trips positions', async () => {
    handle = await open('# Title\n\nHello [[wiki:0b6f4f0e-3c55-4d0a-9a43-1f7a2c9e8d10]] world\n\n- one\n- two\n');
    const c = new CanonicalText(view(handle).state.doc);
    expect(c.text.replace(/\n$/, '')).toBe(`Title\nHello ${LEAF} world\none\ntwo`);
    expect(c.blocks.slice(0, 3).map((b) => b.heading)).toEqual(['Title', 'Title', 'Title']);
    const at = c.text.indexOf('world');
    const pos = c.posAt(at);
    expect(view(handle).state.doc.textBetween(pos, c.posAt(at + 5, true))).toBe('world');
    expect(c.offsetAt(pos)).toBe(at);
    expect(c.offsetAt(c.posAt(c.text.indexOf(LEAF)) + 1)).toBe(c.text.indexOf(LEAF) + 1);
    expect(c.offsetAt(10_000)).toBe(c.text.length);
    expect(c.posAt(0)).toBe(c.posAt(0));
    expect(new CanonicalText(view(handle).state.schema.topNodeType.createAndFill()!).posAt(0)).toBe(1);
  });

  it('finds the quote by context, then by distance, and reports gone text', () => {
    const c = { text: 'a cat. the cat sat. a cat.', blocks: [{ offset: 0, heading: null }], blockAt: () => 0 } as unknown as CanonicalText;
    const base = anchorOf({ ...c, blockAt: () => 0 } as unknown as CanonicalText, 11, 14)!;
    expect(base.quote).toEqual({ exact: 'cat', prefix: 'a cat. the ', suffix: ' sat. a cat.' });
    expect(findQuote(c, base)).toEqual({ start: 11, end: 14 });
    expect(findQuote(c, { ...base, quote: { exact: 'cat', prefix: '', suffix: '' }, position: { start: 22, end: 25 } })).toEqual({ start: 22, end: 25 });
    expect(findQuote(c, { ...base, quote: { exact: 'dog', prefix: '', suffix: '' } })).toBeNull();
    expect(anchorOf(c, 3, 3)).toBeNull();
    expect(MAX_MATCHES).toBe(1000);
  });
});

describe('comments feature (1.6)', () => {
  it('is off by default: no API, no options', async () => {
    handle = await open('Text', { features: [] });
    expect(handle.comments).toBeUndefined();
    expect(handle.options.comments).toBeNull();
  });

  it('parses options: same-origin URL only, panel needs a URL', () => {
    expect(commentsOptions({ url: '/c', panel: 'margin', csrfToken: 't', topic: 'x', container: '#x' }, true)).toEqual({ url: '/c', csrfToken: 't', canCreate: true, panel: 'margin', container: null, topic: 'x' });
    expect(commentsOptions({ url: 'https://evil.example/c', panel: 'margin', topic: 'x' }, true)).toEqual({ url: null, csrfToken: null, canCreate: true, panel: 'none', container: null, topic: null });
    expect(commentsOptions({ url: '/c', panel: 'container', container: '#drawer' }, true)).toMatchObject({ panel: 'container', container: '#drawer' });
    expect(commentsOptions({ url: '/c', panel: 'container', container: 'x'.repeat(201) }, true)).toMatchObject({ panel: 'container', container: null });
    expect(commentsOptions({ canCreate: false }, true)?.canCreate).toBe(false);
    expect(commentsOptions({}, false)).toBeNull();
    expect(sameOrigin('//evil.example/x')).toBe(false);
    expect(sameOrigin('javascript:alert(1)')).toBe(false);
    expect(sameOrigin('http://[')).toBe(false);
    expect(parseOptions(JSON.stringify({ comments: { url: '/c' } })).comments).toBeNull();
  });

  it('creates an anchor from the selection and emits a cancelable comment-create', async () => {
    handle = await open('# Intro\n\nThe quick brown fox jumps over the lazy dog.\n');
    const events: CustomEvent[] = [];
    handle.root.addEventListener('nowo-milkdown:comment-create', (e) => events.push(e as CustomEvent));
    const anchor = anchorFor(handle, 'brown fox');
    expect(anchor).toMatchObject({ v: 1, quote: { exact: 'brown fox', prefix: 'Intro\nThe quick ', suffix: ' jumps over the lazy dog.' }, block: { index: 1, heading: 'Intro' }, yjs: null });
    expect(parseCommentAnchor(anchor)).toEqual(anchor);
    handle.comments!.start();
    expect(events).toHaveLength(1);
    expect(events[0]!.detail).toEqual({ anchor, text: 'brown fox' });
    expect(events[0]!.cancelable).toBe(true);
    // Shortcut and an empty selection (announced, no event).
    keydown(view(handle).dom, 'm', { ctrlKey: true, altKey: true });
    expect(events).toHaveLength(2);
    select(handle, 3, 3);
    expect(handle.comments!.selectionAnchor()).toBeNull();
    handle.comments!.start();
    expect(events).toHaveLength(2);
    expect(handle.root.querySelector('.nowo-milkdown__status')?.textContent).toBe('Select some text to comment on it');
  });

  it('never anchors inside code blocks and respects can_create', async () => {
    handle = await open('Text\n\n```js\nconst a = 1;\n```\n');
    const v = view(handle);
    const c = new CanonicalText(v.state.doc);
    const at = c.text.indexOf('const');
    select(handle, c.posAt(at), c.posAt(at + 5, true));
    expect(handle.comments!.selectionAnchor()).toBeNull();
    await handle.destroy();
    handle = await open('Text here', { features: ['comments', 'context_menu'], comments: { canCreate: false } });
    select(handle, 1, 5);
    expect(handle.comments!.selectionAnchor()).toBeNull();
    const events: Event[] = [];
    handle.root.addEventListener('nowo-milkdown:comment-create', (e) => events.push(e));
    handle.comments!.start();
    expect(events).toHaveLength(0);
  });

  it('draws highlights, hides resolved threads and reports orphans', async () => {
    handle = await open('Alpha beta gamma.\n\nDelta epsilon.\n');
    const a = anchorFor(handle, 'beta');
    const b = anchorFor(handle, 'epsilon');
    const orphaned: unknown[] = [];
    handle.root.addEventListener('nowo-milkdown:comment-orphaned', (e) => orphaned.push((e as CustomEvent).detail));
    handle.comments!.set([
      { id: 't1', anchor: a, resolved: false, count: 2, label: 'Ana: why?' },
      { id: 't2', anchor: b, resolved: true, count: 1 },
      { id: 'page', anchor: null, resolved: false, count: 1 },
      { id: 'bad id!', anchor: a, resolved: false, count: 1 },
    ] as never);
    await tick(5);
    expect(highlights(handle).map((h) => [h.dataset.commentId, h.textContent])).toEqual([['t1', 'beta']]);
    expect(handle.comments!.status('t1')).toBe('attached');
    expect(handle.comments!.status('page')).toBe('page');
    expect(handle.comments!.status('bad id!')).toBe('unknown');
    handle.comments!.showResolved(true);
    expect(highlights(handle).map((h) => h.dataset.commentId)).toEqual(['t1', 't2']);
    expect(highlights(handle)[1]!.classList.contains('nowo-milkdown-comment--resolved')).toBe(true);
    // Delete "beta": orphaned, never attached elsewhere.
    vi.useFakeTimers();
    const { from, to } = find(handle, 'beta');
    const v = view(handle);
    v.dispatch(v.state.tr.delete(from, to));
    vi.advanceTimersByTime(400);
    expect(handle.comments!.status('t1')).toBe('orphaned');
    expect(orphaned).toEqual([{ orphaned: ['t1'], attached: [] }]);
    v.dispatch(v.state.tr.insertText('beta', from));
    vi.advanceTimersByTime(400);
    expect(handle.comments!.status('t1')).toBe('attached');
    expect(orphaned[1]).toEqual({ orphaned: [], attached: ['t1'] });
    handle.comments!.remove('t1');
    handle.comments!.remove('nope');
    vi.advanceTimersByTime(10);
    expect(handle.comments!.status('t1')).toBe('unknown');
  });

  it('reports drifted anchors once, debounced, and snapshots current anchors', async () => {
    handle = await open('One two three.\n');
    const a = anchorFor(handle, 'two');
    handle.comments!.upsert({ id: 't1', anchor: a, resolved: false, count: 1 });
    handle.comments!.upsert({ id: 'x', anchor: 'nope' } as never);
    await tick(5);
    const changed: unknown[] = [];
    handle.root.addEventListener('nowo-milkdown:comment-anchors-changed', (e) => changed.push((e as CustomEvent).detail));
    vi.useFakeTimers();
    const v = view(handle);
    v.dispatch(v.state.tr.insertText('Zero ', 1));
    vi.advanceTimersByTime(400);
    expect(changed).toHaveLength(0);
    vi.advanceTimersByTime(2000);
    expect(changed).toHaveLength(1);
    const detail = changed[0] as { anchors: { id: string; anchor: CommentAnchor }[] };
    expect(detail.anchors[0]!.id).toBe('t1');
    expect(detail.anchors[0]!.anchor.position.start).toBe(a.position.start + 5);
    expect(detail.anchors[0]!.anchor.quote.prefix).toBe('Zero One ');
    vi.advanceTimersByTime(3000);
    expect(changed).toHaveLength(1);
    expect(handle.comments!.snapshot()).toEqual([{ id: 't1', anchor: detail.anchors[0]!.anchor }]);
  });

  it('moves between threads with the keyboard, announces them and opens one with Enter', async () => {
    handle = await open('First word. Second word. Third word.\n');
    const threads = ['First', 'Second', 'Third'].map((w, i) => ({ id: `t${i}`, anchor: anchorFor(handle!, w), resolved: false, count: 1, ...(i === 1 ? { label: 'Bo: ok' } : {}) }));
    handle.comments!.set(threads);
    await tick(5);
    select(handle, 1, 1);
    const opened: string[] = [];
    handle.root.addEventListener('nowo-milkdown:comment-open', (e) => opened.push((e as CustomEvent).detail.id));
    const dom = view(handle).dom;
    keydown(dom, 'PageDown', { ctrlKey: true, altKey: true });
    expect(handle.root.querySelector('.nowo-milkdown__status')?.textContent).toBe('Comment 1 of 3');
    expect(highlights(handle).find((h) => h.classList.contains('nowo-milkdown-comment--active'))?.textContent).toBe('First');
    expect(handle.comments!.next()).toBe(true);
    expect(handle.root.querySelector('.nowo-milkdown__status')?.textContent).toBe('Comment 2 of 3: Bo: ok');
    keydown(dom, 'PageUp', { ctrlKey: true, altKey: true });
    expect(handle.comments!.previous()).toBe(true);
    expect(handle.root.querySelector('.nowo-milkdown__status')?.textContent).toBe('Comment 3 of 3');
    const enter = keydown(dom, 'Enter');
    expect(enter.defaultPrevented).toBe(true);
    expect(opened).toEqual(['t2']);
    keydown(dom, 'Escape');
    expect(highlights(handle).some((h) => h.classList.contains('nowo-milkdown-comment--active'))).toBe(false);
    expect(handle.comments!.focus('missing')).toBe(false);
    // From the caret: previous goes to the last thread before it.
    select(handle, 20, 20);
    handle.comments!.previous();
    expect(handle.root.querySelector('.nowo-milkdown__status')?.textContent).toBe('Comment 2 of 3: Bo: ok');
    // Click on a highlight.
    highlights(handle)[0]!.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    handle.comments!.open('t0');
    await handle.comments!.refresh();
  });

  it('adds a Comment item to the context menu', async () => {
    handle = await open('Some words here', { features: ['comments', 'context_menu'], comments: {} });
    select(handle, 1, 5);
    const events: Event[] = [];
    handle.root.addEventListener('nowo-milkdown:comment-create', (e) => events.push(e));
    view(handle).dom.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true, clientX: 5, clientY: 5 }));
    const item = document.querySelector<HTMLButtonElement>('.nowo-milkdown-menu [data-id="comment"]');
    expect(item?.textContent).toContain('Comment');
    item!.click();
    expect(events).toHaveLength(1);
  });
});

describe('resolution with Yjs relative positions', () => {
  it('prefers valid relative positions and falls back to the quote', async () => {
    handle = await open('Hello brave new world.\n');
    const anchor = { ...anchorFor(handle, 'brave'), yjs: { start: 'AAAA', end: 'BBBB' } };
    const state = view(handle).state;
    const c = new CanonicalText(state.doc);
    const thread = { id: 't', anchor, resolved: false, count: 1 };
    const yjs = (from: number | null, to: number | null): YjsAnchors => ({ encode: () => 'AAAA', decode: (v) => (v === 'AAAA' ? from : to) });
    expect(resolveThread(state, c, thread, yjs(2, 4))).toEqual({ from: 2, to: 4 });
    const quote = find(handle, 'brave');
    expect(resolveThread(state, c, thread, yjs(4, 2))).toEqual(quote);
    expect(resolveThread(state, c, thread, yjs(null, 4))).toEqual(quote);
    expect(resolveThread(state, c, thread, null)).toEqual(quote);
    expect(resolveThread(state, c, { ...thread, anchor: null }, null)).toBeNull();
  });

  it('caps and validates the thread list', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const many = Array.from({ length: MAX_THREADS + 1 }, (_, i) => ({ id: `t${i}`, anchor: null, resolved: false, count: -1 }));
    const parsed = parseThreads(many);
    expect(parsed.size).toBe(MAX_THREADS);
    expect(parsed.get('t0')?.count).toBe(0);
    expect(warn).toHaveBeenCalled();
    expect(parseThreads('x').size).toBe(0);
    expect(parseThreads([null, { id: 'a', anchor: null }, { id: 'a', anchor: null, resolved: true }]).get('a')?.resolved).toBe(false);
  });

  it('exposes the plugin view for the API', async () => {
    handle = await open('x');
    expect(commentsView(view(handle))?.status('none')).toBe('unknown');
  });
});
