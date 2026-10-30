import { afterEach, describe, expect, it, vi } from 'vitest';
import { editorViewCtx } from '@milkdown/kit/core';
import { ID, editor, keydown, tick } from './helpers';
import type { MilkdownEditorHandle } from '../src/editor';
import { DEBOUNCE_MS } from '../src/plugins/suggest';
import { candidates } from '../src/triggers';

let handle: MilkdownEditorHandle | null = null;
afterEach(async () => {
  await handle?.destroy();
  handle = null;
  vi.unstubAllGlobals();
});

const view = (h: MilkdownEditorHandle) => h.builder.editor.action((ctx) => ctx.get(editorViewCtx));
const type = (h: MilkdownEditorHandle, text: string) => {
  const v = view(h);
  v.dispatch(v.state.tr.insertText(text));
};
const settle = () => tick(DEBOUNCE_MS + 30);
const listbox = (h: MilkdownEditorHandle) => h.root.querySelector<HTMLUListElement>('[role="listbox"]')!;

function mockFetch(routes: Record<string, unknown>) {
  const fn = vi.fn(async (url: string) => {
    const key = Object.keys(routes).find((k) => url.startsWith(k));
    if (!key) return new Response('[]');
    const body = routes[key];
    if (body instanceof Error) throw body;
    if (body === 500) return new Response('x', { status: 500 });
    return new Response(JSON.stringify(body));
  });
  vi.stubGlobal('fetch', fn);
  return fn;
}

describe('suggestion hook', () => {
  it('[[ lists pages (ARIA listbox on the textbox), arrows move, Enter inserts a page link', async () => {
    const fetchMock = mockFetch({
      '/pages': [
        { id: ID, label: 'Install', hint: 'Docs', url: '/wiki/install' },
        { id: 'not-a-uuid', label: 'Bad' },
        { id: 'c0ffee00-1234-4abc-8def-001122334455', label: 'Runbook' },
      ],
    });
    handle = await editor('', { suggestions: { '[[': '/pages?space=1' } });
    const dom = view(handle).dom;
    type(handle, '[[ins');
    await settle();
    expect(fetchMock).toHaveBeenCalledWith('/pages?space=1&q=ins', expect.anything());
    const list = listbox(handle);
    expect(list.hidden).toBe(false);
    expect(list.getAttribute('aria-label')).toBe('Pages');
    expect(list.querySelectorAll('[role="option"]')).toHaveLength(2);
    expect(dom.getAttribute('aria-controls')).toBe(list.id);
    expect(dom.getAttribute('aria-autocomplete')).toBe('list');
    expect(dom.getAttribute('aria-activedescendant')).toBe(`${list.id}-opt-0`);
    expect(handle.root.querySelector('[aria-live="polite"].nowo-milkdown-sr-only')?.textContent).toBe('2 results');
    expect(keydown(dom, 'ArrowDown').defaultPrevented).toBe(true);
    expect(dom.getAttribute('aria-activedescendant')).toBe(`${list.id}-opt-1`);
    keydown(dom, 'ArrowUp');
    expect(list.querySelector('[aria-selected="true"]')?.textContent).toContain('Install');
    expect(keydown(dom, 'Enter').defaultPrevented).toBe(true);
    expect(handle.getMarkdown().trimEnd()).toBe(`[[wiki:${ID}]]`);
    expect(list.hidden).toBe(true);
    expect(dom.hasAttribute('aria-controls')).toBe(false);
    await tick(10);
    expect(dom.querySelector('.nowo-milkdown-ref')?.textContent).toBe('Install');
  });

  it('@ mentions: Tab inserts, Escape closes and stays closed for that trigger', async () => {
    mockFetch({ '/users': [{ id: 'ada', label: 'Ada Lovelace' }, { id: 'bad handle', label: 'x' }] });
    handle = await editor('', { suggestions: { '@': '/users' } });
    const dom = view(handle).dom;
    type(handle, 'hi @a');
    await settle();
    expect(listbox(handle).querySelector('.nowo-milkdown-suggest__hint')?.textContent).toBe('@ada');
    expect(keydown(dom, 'Tab').defaultPrevented).toBe(true);
    expect(handle.getMarkdown().trimEnd()).toBe('hi @ada');
    type(handle, '@g');
    await settle();
    expect(listbox(handle).hidden).toBe(false);
    expect(keydown(dom, 'Escape').defaultPrevented).toBe(true);
    expect(listbox(handle).hidden).toBe(true);
    type(handle, 'r');
    await settle();
    expect(listbox(handle).hidden).toBe(true);
    expect(keydown(dom, 'ArrowDown').defaultPrevented).toBe(false);
  });

  it('mouse picks an option; empty and failed answers are announced', async () => {
    mockFetch({ '/users?q=a': [{ id: 'ada', label: 'Ada' }], '/users?q=zz': [], '/users?q=err': 500 });
    handle = await editor('', { suggestions: { '@': '/users' } });
    type(handle, '@a');
    await settle();
    const option = listbox(handle).querySelector('[role="option"]')!;
    option.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));
    expect(handle.getMarkdown().trimEnd()).toBe('@ada');
    listbox(handle).dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    type(handle, '@zz');
    await settle();
    expect(listbox(handle).textContent).toBe('No results');
    expect(keydown(view(handle).dom, 'ArrowDown').defaultPrevented).toBe(true);
    keydown(view(handle).dom, 'Escape');
    type(handle, ' @err');
    await settle();
    expect(listbox(handle).textContent).toBe('Suggestions are not available');
  });

  it(': offers allowlisted icons and emoji offline, inserting a Tabler node or the emoji text', async () => {
    handle = await editor('', { icons: ['bug', 'bulb'], iconSpriteUrl: '/s.svg' });
    type(handle, ':bu');
    await settle();
    const labels = [...listbox(handle).querySelectorAll('[role="option"]')].map((o) => o.textContent);
    expect(labels).toEqual(['bug', 'bulb', '🐛bug', '💡bulb']);
    keydown(view(handle).dom, 'Enter');
    expect(handle.getMarkdown().trimEnd()).toBe(':tabler-bug:');
    type(handle, ':rock');
    await settle();
    keydown(view(handle).dom, 'Enter');
    expect(handle.getMarkdown()).toContain('🚀');
  });

  it(': with a candidate URL keeps allowlisted icons and real emoji only', async () => {
    mockFetch({ '/icons': [{ id: 'tabler-bug', label: 'bug' }, { id: 'tabler-nope', label: 'nope' }, { id: '🎉', label: 'tada' }, { id: 'plain', label: 'x' }] });
    handle = await editor('', { icons: ['bug'], suggestions: { ':': '/icons' } });
    type(handle, ':t');
    await settle();
    expect([...listbox(handle).querySelectorAll('[role="option"]')].map((o) => o.textContent)).toEqual(['bug', '🎉tada']);
  });

  it('/ opens the block menu and runs the command', async () => {
    handle = await editor('', { features: ['slash_menu', 'code_mirror', 'mermaid', 'math'], suggestions: { '[[': '/p', '@': '/u' }, icons: ['bug'] }, { features: ['slash_menu', 'code_mirror', 'mermaid', 'math'] });
    const dom = view(handle).dom;
    const run = async (query: string): Promise<string> => {
      handle!.setMarkdown('');
      await tick(5);
      type(handle!, `/${query}`);
      await settle();
      keydown(dom, 'Enter');
      return handle!.getMarkdown();
    };
    expect(await run('h2')).toBe('##\n');
    type(handle, 'Title');
    expect(handle.getMarkdown()).toBe('## Title\n');
    handle.setMarkdown('');
    expect(await run('bullet')).toBe('*\n');
    expect(await run('ordered')).toBe('1.\n');
    expect(await run('task')).toBe('* [ ]\n');
    expect(await run('quote')).toBe('>\n');
    expect(await run('mermaid')).toMatch(/^```mermaid\n+```\n$/);
    expect(await run('math')).toMatch(/^\$\$\n+\$\$\n$/);
    expect(await run('divider')).toBe('***\n');
    expect(await run('callout')).toContain(':::callout{type="info"}');
    expect(await run('details')).toContain(':::details{summary="Summary"}');
    expect(await run('table')).toContain('|');
    expect(await run('code')).toMatch(/^```\n+```\n$/);
    expect(await run('h1')).toBe('#\n');
    expect(await run('h3')).toBe('###\n');
    expect(await run('text')).toBe('');
    expect(await run('page_link')).toBe('\\[\\[\n');
    expect(await run('mention')).toBe('@\n');
    expect(await run('icon')).toBe(':\n');
  });

  it('candidates drops invalid rows and non-arrays', async () => {
    const ctrl = new AbortController();
    expect(await candidates(async () => ({ a: 1 }), '/x', 'q', ctrl.signal)).toEqual([]);
    expect(await candidates(async () => [null, { id: 1, label: 'x' }, { id: 'a', label: 'A' }], '/x', 'q', ctrl.signal)).toEqual([{ id: 'a', label: 'A' }]);
  });
});
