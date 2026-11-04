import { afterEach, describe, expect, it, vi } from 'vitest';
import { editorViewCtx } from '@milkdown/kit/core';
import { AllSelection, TextSelection } from '@milkdown/kit/prose/state';
import type { Ctx } from '@milkdown/kit/ctx';
import type { EditorView } from '@milkdown/kit/prose/view';
import { editor, keydown, tick } from './helpers';
import type { MilkdownEditorHandle } from '../src/editor';
import {
  copyMarkdown,
  insertMarkdown,
  isTextWrapper,
  looksLikeMarkdown,
  markdownIo,
  pasteMarkdown,
  selectionMarkdown,
  smartPaste,
  isSafePastedUrl,
  cleanPasted,
  type MarkdownIo,
} from '../src/commands/markdown-clipboard';
import { Slice } from '@milkdown/kit/prose/model';
import { INSERT_BLOCKS, insertItems, prepareInsertPoint } from '../src/commands/insert';
import { normaliseFeatures } from '../src/options';
import { bindCopyButtons, copySource } from '../src/index';

let handle: MilkdownEditorHandle | null = null;
afterEach(async () => {
  await handle?.destroy();
  handle = null;
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  document.body.replaceChildren();
});

const view = (h: MilkdownEditorHandle): EditorView => h.builder.editor.action((ctx) => ctx.get(editorViewCtx));
const io = (h: MilkdownEditorHandle): MarkdownIo => h.builder.editor.action((ctx) => markdownIo(ctx));
const select = (h: MilkdownEditorHandle, from: number, to = from) => {
  const v = view(h);
  v.dispatch(v.state.tr.setSelection(TextSelection.create(v.state.doc, from, to)));
};
const pasteEvent = (data: Record<string, string> | null) => {
  const event = new Event('paste', { bubbles: true, cancelable: true }) as ClipboardEvent;
  Object.defineProperty(event, 'clipboardData', { value: data === null ? null : { getData: (type: string) => data[type] ?? '', types: Object.keys(data), files: [] } });
  return event;
};
const stubClipboard = (clipboard: Partial<Clipboard>) => vi.stubGlobal('navigator', { ...navigator, clipboard });
const openMenu = (h: MilkdownEditorHandle) => {
  view(h).dom.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true, clientX: 5, clientY: 5 }));
  return [...h.root.querySelectorAll<HTMLElement>('.nowo-milkdown-menu')].find((m) => !m.hidden)!;
};
const ids = (menu: HTMLElement) => [...menu.querySelectorAll<HTMLElement>(':scope > [role="menuitem"]')].map((b) => b.dataset.id);
const sub = (menu: HTMLElement, id: string) => {
  const parent = menu.querySelector<HTMLElement>(`:scope > [data-id="${id}"]`)!;
  parent.click();
  return document.getElementById(parent.getAttribute('aria-controls')!)!;
};

describe('Markdown detection (1.5)', () => {
  it('tells a text wrapper from rich HTML', () => {
    expect(isTextWrapper('<meta charset="utf-8"><pre><code>a</code></pre>')).toBe(true);
    expect(isTextWrapper('<div style="color:red"><span>a</span><br><p>b</p></div>')).toBe(true);
    expect(isTextWrapper('<html><head><title>x</title><style>p{}</style></head><body><!--StartFragment-->a</body></html>')).toBe(true);
    expect(isTextWrapper('<p><strong>a</strong></p>')).toBe(false);
    expect(isTextWrapper('<a href="/x">a</a>')).toBe(false);
    expect(isTextWrapper('<ul><li>a</li></ul>')).toBe(false);
    expect(isTextWrapper('<h1>a</h1>')).toBe(false);
  });

  it('recognises Markdown syntax and leaves prose alone', () => {
    for (const text of ['# Title', 'x\n- item', '1. one', '- [ ] task', 'a **b** c', 'a __b__', 'see [x](https://e.test)', '```js\nx\n```', '~~~\nx\n~~~', '| a | b |\n| --- | --- |', '> quote']) {
      expect(looksLikeMarkdown(text), text).toBe(true);
    }
    for (const text of ['Hello world', 'a * b * c', 'price: 3 - 2', '#hashtag', 'C# rocks', '']) {
      expect(looksLikeMarkdown(text), text).toBe(false);
    }
  });
});

describe('smart paste', () => {
  it('parses Markdown copied with a text-only HTML wrapper', async () => {
    handle = await editor('Start', { features: ['markdown_clipboard'] });
    select(handle, 6);
    const event = pasteEvent({ 'text/html': '<pre><code># Title\n\n- **a**\n- b</code></pre>', 'text/plain': '# Title\n\n- **a**\n- b' });
    view(handle).dom.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
    const md = handle.getMarkdown();
    expect(md).toContain('# Title');
    expect(md).toMatch(/[-*] \*\*a\*\*/);
  });

  it('keeps the HTML path for rich HTML, plain prose, code blocks, readonly views and missing data', async () => {
    handle = await editor('Start\n\n```\ncode\n```', { features: ['markdown_clipboard'] });
    const v = view(handle);
    const smart = smartPaste(io(handle));
    const md = { 'text/html': '<pre># T</pre>', 'text/plain': '# T' };
    expect(smart(v, pasteEvent({ 'text/html': '<h1>T</h1>', 'text/plain': '# T' }))).toBe(false);
    expect(smart(v, pasteEvent({ 'text/html': '<pre>Hello</pre>', 'text/plain': 'Hello' }))).toBe(false);
    expect(smart(v, pasteEvent({ 'text/plain': '' }))).toBe(false);
    expect(smart(v, pasteEvent(null))).toBe(false);
    select(handle, 9); // inside the code block
    expect(smart(v, pasteEvent(md))).toBe(false);
    select(handle, 2);
    v.setProps({ editable: () => false });
    expect(smart(v, pasteEvent(md))).toBe(false);
  });

  it('is off without the feature', async () => {
    handle = await editor('Start');
    const event = pasteEvent({ 'text/html': '<pre># Title</pre>', 'text/plain': '# Title' });
    view(handle).dom.dispatchEvent(event);
    expect(handle.getMarkdown()).not.toMatch(/^# Title$/m);
  });
});

describe('smart paste safety (audit DN-L1)', () => {
  const HOSTILE = [
    '# Title',
    '',
    '<img src=x onerror="pwned=1"> <script>pwned=2</script>',
    '',
    '[click](javascript:pwned=4) ![i](javascript:pwned=5) [d](data:text/html,<script>pwned=6</script>) [ok](https://e.test/a)',
    '',
    ':mark[m]{bg="red\\" onmouseover=\\"pwned=7" text=--x}',
  ].join('\n');

  it('judges pasted targets like the URL parser', () => {
    expect([undefined, '/a', '#x', 'page.md', 'https://e.test', 'MAILTO:a@b.c', 'tel:+1'].map(isSafePastedUrl)).toEqual([true, true, true, true, true, true, true]);
    expect(['javascript:x', ' java\tscript:x', 'data:text/html,x', 'vbscript:x'].map(isSafePastedUrl)).toEqual([false, false, false, false]);
  });

  it('cleans every pasted slice when the feature is on', () => {
    expect(cleanPasted(Slice.empty)).toEqual(Slice.empty);
  });

  it('stores the same safe Markdown as the plain-text paste', async () => {
    const stored: string[] = [];
    const paths: Record<string, string>[] = [
      { 'text/html': '<pre><code>' + HOSTILE.replace(/</g, '&lt;') + '</code></pre>', 'text/plain': HOSTILE },
      { 'text/plain': HOSTILE },
    ];
    for (const data of paths) {
      handle = await editor('', { features: ['markdown_clipboard', 'colors'] });
      view(handle).dom.dispatchEvent(pasteEvent(data));
      stored.push(handle.getMarkdown());
      await handle.destroy();
      handle = null;
    }
    expect(stored[0]).toBe(stored[1]);
    // No link or image keeps an unsafe target (raw HTML stays text, as when typed).
    expect(stored[0]).not.toMatch(/\]\(\s*(?:javascript|data):/i);
    expect(stored[0]).toContain('[click]()');
    expect(stored[0]).toContain('https://e.test/a');
  });
});

describe('Paste / Copy as Markdown', () => {
  it('inserts parsed Markdown, text in a code block, nothing for empty input', async () => {
    handle = await editor('A\n\n```\ncode\n```', { features: ['markdown_clipboard'] });
    const v = view(handle);
    const m = io(handle);
    expect(insertMarkdown(v, m, '')).toBe(false);
    expect(insertMarkdown(v, { parse: () => null, serialize: () => '' }, 'x')).toBe(false);
    expect(insertMarkdown(v, { parse: () => v.state.schema.topNodeType.create(), serialize: () => '' }, 'x')).toBe(false);
    select(handle, 2);
    expect(insertMarkdown(v, m, '## Two')).toBe(true);
    expect(handle.getMarkdown()).toContain('## Two');
    const code = v.state.doc.content.size - 3;
    select(handle, code);
    expect(insertMarkdown(v, m, '# raw')).toBe(true);
    expect(handle.getMarkdown()).toContain('# raw');
  });

  it('a parser that throws or returns no document gives null', () => {
    const throwing = { get: () => () => { throw new Error('parse'); } } as unknown as Ctx;
    const odd = { get: () => () => 'not a node' } as unknown as Ctx;
    expect(markdownIo(throwing).parse('# x')).toBeNull();
    expect(markdownIo(odd).parse('# x')).toBeNull();
  });

  it('copies the selection serialised to the dialect; refusals and empty selections give false', async () => {
    handle = await editor('Hello **world**\n\n- item', { features: ['markdown_clipboard'] });
    const m = io(handle);
    const v = view(handle);
    expect(selectionMarkdown(v.state, m)).toBe('');
    select(handle, 1, 12);
    expect(selectionMarkdown(v.state, m)).toBe('Hello **world**\n');
    v.dispatch(v.state.tr.setSelection(new AllSelection(v.state.doc)));
    const writeText = vi.fn().mockResolvedValue(undefined);
    expect(await copyMarkdown(v.state, m, { writeText })).toBe(true);
    expect(writeText.mock.calls[0]![0]).toMatch(/^[-*] item$/m);
    expect(await copyMarkdown(v.state, m, {})).toBe(false);
    expect(await copyMarkdown(v.state, m, { writeText: vi.fn().mockRejectedValue(new Error('denied')) })).toBe(false);
    select(handle, 2);
    expect(await copyMarkdown(v.state, m, { writeText })).toBe(false);
  });

  it('pastes the clipboard text as Markdown (never in a readonly view)', async () => {
    handle = await editor('A', { features: ['markdown_clipboard'] });
    const v = view(handle);
    select(handle, 2);
    expect(await pasteMarkdown(v, io(handle), { readText: vi.fn().mockResolvedValue('> quoted') })).toBe(true);
    expect(handle.getMarkdown()).toContain('> quoted');
    expect(await pasteMarkdown(v, io(handle), {})).toBe(false);
    v.setProps({ editable: () => false });
    expect(await pasteMarkdown(v, io(handle), { readText: vi.fn().mockResolvedValue('# x') })).toBe(false);
  });

  it('Ctrl+Alt+V and Ctrl+Alt+Shift+C (Ctrl+Alt+C stays the code block); the copy is announced', async () => {
    const readText = vi.fn().mockResolvedValue('## From keys');
    const writeText = vi.fn().mockResolvedValue(undefined);
    stubClipboard({ readText, writeText });
    handle = await editor('Text', { features: ['markdown_clipboard'] });
    const v = view(handle);
    select(handle, 5);
    expect(keydown(v.dom, 'v', { ctrlKey: true, altKey: true }).defaultPrevented).toBe(true);
    await tick();
    expect(handle.getMarkdown()).toContain('## From keys');
    select(handle, 2);
    expect(keydown(v.dom, 'C', { ctrlKey: true, altKey: true, shiftKey: true }).defaultPrevented).toBe(false); // empty selection
    select(handle, 1, 5);
    expect(keydown(v.dom, 'C', { ctrlKey: true, altKey: true, shiftKey: true }).defaultPrevented).toBe(true);
    await tick();
    expect(writeText).toHaveBeenCalledWith(expect.stringContaining('Text'));
    expect(handle.root.querySelector('.nowo-milkdown__status')?.textContent).toBe('Copied as Markdown');
    writeText.mockRejectedValueOnce(new Error('denied'));
    keydown(v.dom, 'C', { ctrlKey: true, altKey: true, shiftKey: true });
    await tick();
    expect(handle.root.querySelector('.nowo-milkdown__alert')?.textContent).toBe('Could not copy to the clipboard');
    v.setProps({ editable: () => false });
    expect(keydown(v.dom, 'v', { ctrlKey: true, altKey: true }).defaultPrevented).toBe(false);
  });

  it('the context menu offers both with their shortcuts', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    const readText = vi.fn().mockResolvedValue('**bold**');
    stubClipboard({ readText, writeText });
    handle = await editor('Hello world', { features: ['context_menu', 'markdown_clipboard'] });
    select(handle, 1, 6);
    const m = openMenu(handle);
    expect(ids(m)).toEqual(['cut', 'copy', 'paste', 'paste_plain', 'paste_markdown', 'copy_markdown', 'turn_into', 'duplicate', 'move_up', 'move_down', 'delete']);
    const copy = m.querySelector<HTMLElement>('[data-id="copy_markdown"]')!;
    expect(copy.getAttribute('aria-keyshortcuts')).toBe('Control+Alt+Shift+C');
    copy.click();
    await tick();
    expect(writeText).toHaveBeenCalledWith('Hello\n');
    expect(handle.root.querySelector('.nowo-milkdown__status')?.textContent).toBe('Copied as Markdown');
    writeText.mockRejectedValueOnce(new Error('denied'));
    openMenu(handle).querySelector<HTMLElement>('[data-id="copy_markdown"]')!.click();
    await tick();
    expect(handle.root.querySelector('.nowo-milkdown__status')?.textContent).toBe('Could not copy to the clipboard');
    select(handle, 12);
    const again = openMenu(handle);
    expect(again.querySelector('[data-id="copy_markdown"]')?.getAttribute('aria-disabled')).toBe('true');
    again.querySelector<HTMLElement>('[data-id="paste_markdown"]')!.click();
    await tick();
    expect(handle.getMarkdown()).toContain('**bold**');
  });

  it('readers get Copy as Markdown only; without the feature neither item exists', async () => {
    handle = await editor('Hello', { features: ['context_menu', 'markdown_clipboard'], readonly: true });
    expect(ids(openMenu(handle))).toEqual(['copy', 'copy_markdown']);
    await handle.destroy();
    handle = await editor('Hello', { features: ['context_menu'] });
    expect(ids(openMenu(handle))).not.toContain('copy_markdown');
  });
});

describe('Insert group (1.5, insert_menu)', () => {
  it('needs the context menu', () => {
    expect(normaliseFeatures(['insert_menu'])).toEqual([]);
    expect(normaliseFeatures(['context_menu', 'insert_menu', 'markdown_clipboard'])).toEqual(['context_menu', 'markdown_clipboard', 'insert_menu']);
  });

  it('offers file, icon and the field blocks; blocks go after the current one', async () => {
    const click = vi.spyOn(HTMLInputElement.prototype, 'click').mockImplementation(() => undefined);
    handle = await editor('First', { features: ['context_menu', 'insert_menu', 'code_mirror', 'math', 'slash_menu'], icons: ['bug'], upload: { url: '/up' } });
    select(handle, 3);
    const insert = sub(openMenu(handle), 'insert');
    expect(ids(insert)).toEqual(['insert_file', 'insert_icon', 'insert_h1', 'insert_h2', 'insert_h3', 'insert_bullet_list', 'insert_ordered_list', 'insert_task_list', 'insert_table', 'insert_code', 'insert_callout', 'insert_divider', 'insert_math']);
    insert.querySelector<HTMLElement>('[data-id="insert_h2"]')!.click();
    expect(handle.getMarkdown()).toBe('First\n\n##\n');
    // An empty top-level paragraph is reused.
    const v = view(handle);
    v.dispatch(v.state.tr.setBlockType(v.state.selection.from, v.state.selection.from, v.state.schema.nodes.paragraph!));
    sub(openMenu(handle), 'insert').querySelector<HTMLElement>('[data-id="insert_divider"]')!.click();
    expect(handle.getMarkdown()).toMatch(/^First\n\n(\*\*\*|---)/);
    select(handle, 2);
    // 1.7: the icon is inline (no new block): the picker opens at the caret.
    const blocks = view(handle).state.doc.childCount;
    sub(openMenu(handle), 'insert').querySelector<HTMLElement>('[data-id="insert_icon"]')!.click();
    for (let i = 0; i < 5; i++) await new Promise((r) => setTimeout(r, 20));
    expect(document.querySelector('.nowo-milkdown-picker[role="dialog"]')).not.toBeNull();
    expect(view(handle).state.doc.childCount).toBe(blocks);
    sub(openMenu(handle), 'insert').querySelector<HTMLElement>('[data-id="insert_file"]')!.click();
    expect(click).toHaveBeenCalled();
  });

  it('has no file or icon without uploads or icons, and nothing in a readonly view', async () => {
    handle = await editor('First', { features: ['context_menu', 'insert_menu'] });
    const insert = sub(openMenu(handle), 'insert');
    expect(ids(insert)).toEqual(['insert_h1', 'insert_h2', 'insert_h3', 'insert_bullet_list', 'insert_ordered_list', 'insert_task_list', 'insert_table', 'insert_code', 'insert_callout', 'insert_divider']);
    await handle.destroy();
    handle = await editor('First', { features: ['context_menu', 'insert_menu'], readonly: true });
    expect(ids(openMenu(handle))).toEqual(['copy']);
  });

  it('prepareInsertPoint at the end of the document and insertItems order', async () => {
    handle = await editor('');
    const v = view(handle);
    prepareInsertPoint(v);
    expect(v.state.doc.childCount).toBe(1);
    const run = vi.fn();
    const blocks = [...INSERT_BLOCKS].reverse().map((id) => ({ item: { id, label: id }, run }));
    expect(insertItems([...blocks, { item: { id: 'quote', label: 'q' }, run }], []).map((i) => i.id)).toEqual([...INSERT_BLOCKS]);
  });
});

describe('read-view Copy as Markdown', () => {
  const button = (markdown = '# Source <b>') => {
    document.body.innerHTML = `<span data-nowo-milkdown-copy><button type="button" data-nowo-milkdown-copy-markdown data-copied="Copied" data-failed="Failed">Copy</button><template></template><span role="status"></span></span>`;
    document.querySelector('template')!.content.textContent = markdown;
    return document.querySelector<HTMLButtonElement>('button')!;
  };

  it('copies the template source and says so; a refusal says it failed', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    stubClipboard({ writeText });
    bindCopyButtons(document);
    bindCopyButtons(document);
    button().click();
    await tick();
    expect(writeText).toHaveBeenCalledTimes(1);
    expect(writeText).toHaveBeenCalledWith('# Source <b>');
    expect(document.querySelector('[role="status"]')?.textContent).toBe('Copied');
    writeText.mockRejectedValueOnce(new Error('denied'));
    expect(await copySource(button())).toBe(false);
    expect(document.querySelector('[role="status"]')?.textContent).toBe('Failed');
    document.body.append(document.createElement('p'));
    document.querySelector('p')!.click();
    expect(writeText).toHaveBeenCalledTimes(2);
  });

  it('works without status region, template or messages', async () => {
    stubClipboard({ writeText: vi.fn().mockResolvedValue(undefined) });
    document.body.innerHTML = '<button data-nowo-milkdown-copy-markdown>Copy</button>';
    expect(await copySource(document.querySelector('button')!)).toBe(true);
    document.body.innerHTML = '<span data-nowo-milkdown-copy><button data-nowo-milkdown-copy-markdown>Copy</button><span role="status"></span></span>';
    vi.stubGlobal('navigator', { ...navigator, clipboard: undefined });
    expect(await copySource(document.querySelector('button')!)).toBe(false);
    expect(document.querySelector('[role="status"]')?.textContent).toBe('');
  });
});
