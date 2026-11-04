/**
 * Regression tests for the 1.6.0 audit (Appendix DW): container resolution (DW-M2, DW-I2), resolve cost (DW-L1),
 * open(id) and live batches (DW-I3, DW-I4) and the API after destroy (DW-I5).
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { editorViewCtx } from '@milkdown/kit/core';
import { editor, tick } from './helpers';
import { createEditor, type MilkdownEditorHandle } from '../src/editor';
import { CanonicalText, findQuote } from '../src/comments/anchor';
import { hostContainer, mountThreadPanel, usableContainer } from '../src/comments/thread-ui';
import { defaultRuntime } from '../src/runtime';

let handle: MilkdownEditorHandle | null = null;
afterEach(async () => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  await handle?.destroy();
  handle = null;
  document.body.replaceChildren();
});
const json = (status: number, value: unknown) => new Response(JSON.stringify(value), { status, headers: { 'Content-Type': 'application/json' } });
const MARKDOWN = 'Intro text\n\n# comments-drawer\n\nMore text\n';

/** The PoC page: a heading named like the host's drawer, the drawer after the form, optionally a decoy before it. */
async function drawerPage(readonly: boolean, decoy = false) {
  vi.stubGlobal('fetch', vi.fn(async () => json(200, { threads: [], page: [] })));
  document.body.replaceChildren();
  const planted = document.createElement('div');
  if (decoy) {
    // User content rendered by the host (a read view) that kept the drawer's id, earlier in the document.
    const article = document.createElement('article');
    article.className = 'nowo-md';
    planted.id = 'comments-drawer';
    article.append(planted);
    document.body.append(article);
  }
  const form = document.createElement('form');
  const root = document.createElement('div');
  root.dataset.nowoMilkdownOptions = JSON.stringify({ features: ['toolbar', 'comments'], readonly, comments: { url: '/c', panel: 'container', container: '#comments-drawer' } });
  const textarea = document.createElement('textarea');
  textarea.name = 'body';
  textarea.value = MARKDOWN;
  root.append(textarea);
  form.append(root);
  const drawer = document.createElement('aside');
  drawer.id = 'comments-drawer';
  document.body.append(form, drawer);
  handle = await createEditor(root);
  await tick(30);
  return { root, drawer, planted, panel: document.querySelector<HTMLElement>('.nowo-milkdown-comments--container') };
}

describe('comments.container never resolves inside an editor (audit DW-M2)', () => {
  it.each([
    ['editable', false],
    ['read-only', true],
  ])('%s: the panel lands in the drawer and the Markdown is unchanged', async (_label, readonly) => {
    const { root, drawer, panel } = await drawerPage(readonly);
    expect(root.querySelector('h1')!.id).toBe('nowo-h-comments-drawer');
    expect(panel).not.toBeNull();
    expect(drawer.contains(panel)).toBe(true);
    expect(root.contains(panel)).toBe(false);
    expect(handle!.getMarkdown().trim()).toBe(MARKDOWN.trim());
  });

  it('skips a decoy planted earlier in the document inside a read view', async () => {
    const { drawer, planted, panel } = await drawerPage(false, true);
    expect(planted.contains(panel)).toBe(false);
    expect(drawer.contains(panel)).toBe(true);
  });

  it('skips matches inside any editor, read view or contenteditable, and survives invalid selectors', () => {
    const root = document.createElement('div');
    const other = document.createElement('div');
    other.className = 'nowo-milkdown';
    const editable = document.createElement('div');
    editable.setAttribute('contenteditable', 'true');
    const inRoot = document.createElement('p');
    const inOther = document.createElement('p');
    const inEditable = document.createElement('p');
    const outside = document.createElement('section');
    for (const p of [inRoot, inOther, inEditable, outside]) p.className = 'target';
    root.append(inRoot);
    other.append(inOther);
    editable.append(inEditable);
    document.body.append(root, other, editable, outside);
    expect(hostContainer('.target', root)).toBe(outside);
    expect(usableContainer(inRoot, root)).toBe(false);
    expect(usableContainer(inOther, root)).toBe(false);
    expect(usableContainer(inEditable, root)).toBe(false);
    expect(usableContainer(document.createElement('div'), root)).toBe(false); // detached
    expect(hostContainer(':::bad(', root)).toBeNull();
    expect(hostContainer('.missing', root)).toBeNull();
  });

  it('comments.mount() refuses an element inside an editor and works for a real container', async () => {
    const { root, drawer, panel } = await drawerPage(false);
    const view = handle!.builder.editor.action((ctx) => ctx.get(editorViewCtx));
    expect(handle!.comments!.mount(view.dom.querySelector('h1')!)).toBe(false);
    expect(handle!.comments!.mount(root)).toBe(false);
    expect(drawer.contains(panel)).toBe(true);
    const other = document.createElement('div');
    document.body.append(other);
    expect(handle!.comments!.mount(other)).toBe(true);
    expect(other.contains(panel)).toBe(true);
    expect(handle!.getMarkdown().trim()).toBe(MARKDOWN.trim());
  });
});

describe('resolve cost (audit DW-L1)', () => {
  it('one-letter quotes on a long page stay cheap (block index by binary search)', () => {
    const blocks = 2000;
    const lines = Array.from({ length: blocks }, (_, i) => `para ${i} ${'e '.repeat(20)}`);
    const text = lines.join('\n');
    const list: { offset: number; heading: string | null }[] = [];
    let offset = 0;
    for (const line of lines) {
      list.push({ offset, heading: null });
      offset += line.length + 1;
    }
    const canonical = Object.assign(Object.create(CanonicalText.prototype) as object, { text, blocks: list, segments: [] }) as unknown as CanonicalText;
    expect(canonical.blockAt(0)).toBe(0);
    expect(canonical.blockAt(list[1234]!.offset)).toBe(1234);
    expect(canonical.blockAt(list[1234]!.offset - 1)).toBe(1233);
    expect(canonical.blockAt(text.length + 10)).toBe(blocks - 1);
    const anchor = { v: 1 as const, quote: { exact: 'e', prefix: 'x', suffix: 'y' }, position: { start: 999_999, end: 1_000_000 }, block: { index: 99_999, heading: null }, yjs: null };
    const start = performance.now();
    for (let i = 0; i < 300; i++) findQuote(canonical, anchor);
    // Before the fix: ~0.8 ms per thread per 1 000 blocks (about 500 ms here).
    expect(performance.now() - start).toBeLessThan(200);
    // Ties on score and distance still prefer the stored block.
    const tie = Object.assign(Object.create(CanonicalText.prototype) as object, { text: 'ab\nxab', blocks: [{ offset: 0, heading: null }, { offset: 3, heading: null }], segments: [] }) as unknown as CanonicalText;
    const at = (index: number) => findQuote(tie, { ...anchor, quote: { exact: 'b', prefix: '', suffix: '' }, position: { start: 3, end: 4 }, block: { index, heading: null } });
    expect(at(1)).toEqual({ start: 5, end: 6 });
    expect(at(0)).toEqual({ start: 1, end: 2 });
  });
});

describe('thread component hardening (audit DW-I3, DW-I4)', () => {
  const mount = (calls: string[]) => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: RequestInfo | URL) => {
        calls.push(String(input));
        return String(input).endsWith('/threads') ? json(200, { threads: [], page: [] }) : json(404, {});
      }),
    );
    const root = document.createElement('div');
    const surface = document.createElement('div');
    root.append(surface);
    document.body.append(root);
    const listeners: ((e: MessageEvent) => void)[] = [];
    const panel = mountThreadPanel({
      root,
      surface,
      options: { url: '/c', csrfToken: null, canCreate: false, panel: 'sidebar', container: null, topic: 'wiki/p/1/comments' },
      runtime: defaultRuntime(),
      api: () => ({ set: vi.fn(), upsert: vi.fn(), remove: vi.fn(), status: () => 'attached', showResolved: vi.fn(), focus: vi.fn(), reveal: vi.fn() }) as never,
      announce: vi.fn(),
      tops: () => new Map(),
      hubUrl: '/.well-known/mercure',
      eventSource: () => ({ addEventListener: (_: string, l: (e: MessageEvent) => void) => listeners.push(l), close: vi.fn() }) as unknown as EventSource,
    });
    return { root, panel, listeners };
  };

  it('open(id) ignores ids that are not host ids', async () => {
    const calls: string[] = [];
    const { root, panel } = mount(calls);
    await tick(5);
    const requested: unknown[] = [];
    root.addEventListener('nowo-milkdown:comments-open-requested', (e) => requested.push((e as CustomEvent).detail));
    panel.open('x"] , [z="');
    await panel.refresh(['../threads', 'ok-1']);
    expect(requested).toEqual([]);
    expect(calls.filter((c) => c !== '/c/threads')).toEqual(['/c/threads/ok-1']);
    panel.destroy();
  });

  it('many live ids in one window refetch the list once instead of one GET per thread', async () => {
    const calls: string[] = [];
    const { panel, listeners } = mount(calls);
    await tick(5);
    calls.length = 0;
    for (let m = 0; m < 10; m++) listeners[0]!({ data: JSON.stringify({ threads: Array.from({ length: 100 }, (_, i) => `t${m}-${i}`) }) } as MessageEvent);
    await tick(700);
    expect(calls).toEqual(['/c/threads']);
    panel.destroy();
  });
});

describe('the API after destroy (audit DW-I5)', () => {
  it('is a no-op and never re-attaches the component', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => json(200, { threads: [], page: [] })));
    const drawer = document.createElement('div');
    drawer.id = 'drawer';
    document.body.append(drawer);
    handle = await editor('The quick brown fox jumps.\n', { features: ['comments'], comments: { url: '/c', panel: 'container', container: '#drawer' } });
    document.body.append(drawer);
    const api = handle.comments!;
    await tick(10);
    await handle.destroy();
    handle = null;
    expect(api.count()).toEqual({ open: 0, resolved: 0, orphaned: 0, page: 0, total: 0 });
    expect(api.status('t1')).toBe('unknown');
    expect(api.focus('t1')).toBe(false);
    expect(api.reveal('t1')).toBe(false);
    expect(api.next()).toBe(false);
    expect(api.selectionAnchor()).toBeNull();
    expect(api.snapshot()).toEqual([]);
    expect(() => {
      api.set([]);
      api.upsert({ id: 't1', anchor: null, resolved: false, count: 1 });
      api.remove('t1');
      api.start();
      api.showResolved(true);
      api.open('t1');
    }).not.toThrow();
    await expect(api.refresh()).resolves.toBeUndefined();
    const other = document.createElement('div');
    document.body.append(other);
    expect(api.mount(other)).toBe(false);
    expect(other.childElementCount).toBe(0);
    expect(drawer.childElementCount).toBe(0);
  });
});
