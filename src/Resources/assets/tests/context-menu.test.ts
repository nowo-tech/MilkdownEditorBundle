import { afterEach, describe, expect, it, vi } from 'vitest';
import { editorViewCtx } from '@milkdown/kit/core';
import { EditorState, NodeSelection, TextSelection } from '@milkdown/kit/prose/state';
import { editor, keydown, tick } from './helpers';
import type { MilkdownEditorHandle } from '../src/editor';
import { registerContextMenuItem } from '../src/context-menu-registry';
import { markRange } from '../src/plugins/context-menu';
import { currentBlock, deleteBlock, duplicateBlock, insertPlainText, moveBlock, selectionRunner, turnInto } from '../src/commands/blocks';
import { Menu, shortcutLabel } from '../src/ui/menu';

let handle: MilkdownEditorHandle | null = null;
afterEach(async () => {
  await handle?.destroy();
  handle = null;
  vi.unstubAllGlobals();
  document.body.replaceChildren();
});

const view = (h: MilkdownEditorHandle) => h.builder.editor.action((ctx) => ctx.get(editorViewCtx));
const menu = (h: MilkdownEditorHandle) => h.root.querySelector<HTMLDivElement>('.nowo-milkdown-menu[role="menu"]');
const items = (el: HTMLElement) => [...el.querySelectorAll<HTMLButtonElement>(':scope > [role="menuitem"]')];
const ids = (el: HTMLElement) => items(el).map((b) => b.dataset.id);
const caret = (h: MilkdownEditorHandle, pos: number) => {
  const v = view(h);
  v.dispatch(v.state.tr.setSelection(TextSelection.create(v.state.doc, pos)));
};
const rightClick = (h: MilkdownEditorHandle, init: MouseEventInit = {}) => {
  const event = new MouseEvent('contextmenu', { bubbles: true, cancelable: true, clientX: 20, clientY: 30, ...init });
  view(h).dom.dispatchEvent(event);
  return event;
};
const at = (el: HTMLElement, key: string, init: KeyboardEventInit = {}) => keydown(document.activeElement ?? el, key, init);

describe('context menu', () => {
  it('is off unless the feature is enabled', async () => {
    handle = await editor('Hello');
    const event = rightClick(handle);
    expect(event.defaultPrevented).toBe(false);
    expect(menu(handle)).toBeNull();
  });

  it('right click opens an ARIA menu with clipboard and block groups; Escape returns focus', async () => {
    handle = await editor('Hello world\n\nSecond', { features: ['context_menu'] });
    caret(handle, 3);
    const event = rightClick(handle);
    expect(event.defaultPrevented).toBe(true);
    const m = menu(handle)!;
    expect(m.hidden).toBe(false);
    expect(m.getAttribute('aria-label')).toBe('Editor actions');
    expect(ids(m)).toEqual(['cut', 'copy', 'paste', 'paste_plain', 'turn_into', 'duplicate', 'move_up', 'move_down', 'delete']);
    expect(m.querySelectorAll('[role="separator"]')).toHaveLength(1);
    expect(document.activeElement?.getAttribute('data-id')).toBe('cut');
    const cut = items(m)[0]!;
    expect(cut.getAttribute('aria-disabled')).toBe('true');
    expect(cut.getAttribute('aria-keyshortcuts')).toBe('Control+X');
    expect(cut.querySelector('.nowo-milkdown-menu__shortcut')?.textContent).toBe('Ctrl+X');
    // No clipboard API in jsdom: paste items are disabled with a hint.
    expect(items(m)[2]!.querySelector('.nowo-milkdown-menu__hint')?.textContent).toBe('Use Ctrl+V');
    expect(items(m)[6]!.getAttribute('aria-disabled')).toBe('true'); // move up: first block
    at(m, 'Escape');
    expect(m.hidden).toBe(true);
    expect(document.activeElement).toBe(view(handle).dom);
  });

  it('keyboard: Shift+F10 and the ContextMenu key open it; arrows, Home / End, type-ahead, submenu, Tab', async () => {
    handle = await editor('Hello', { features: ['context_menu'] });
    caret(handle, 2);
    const ev = keydown(view(handle).dom, 'F10', { shiftKey: true });
    expect(ev.defaultPrevented).toBe(true);
    const m = menu(handle)!;
    expect(m.hidden).toBe(false);
    at(m, 'ArrowUp');
    expect(document.activeElement?.getAttribute('data-id')).toBe('delete');
    at(m, 'Home');
    expect(document.activeElement?.getAttribute('data-id')).toBe('cut');
    at(m, 'End');
    expect(document.activeElement?.getAttribute('data-id')).toBe('delete');
    at(m, 'ArrowDown');
    expect(document.activeElement?.getAttribute('data-id')).toBe('cut');
    const now = vi.spyOn(Date, 'now').mockReturnValue(1_000);
    at(m, 'd');
    expect(document.activeElement?.getAttribute('data-id')).toBe('duplicate');
    at(m, 'e');
    expect(document.activeElement?.getAttribute('data-id')).toBe('delete');
    now.mockReturnValue(5_000);
    at(m, 't');
    now.mockRestore();
    const turn = document.activeElement as HTMLButtonElement;
    expect(turn.dataset.id).toBe('turn_into');
    expect(turn.getAttribute('aria-haspopup')).toBe('menu');
    at(m, 'ArrowRight');
    expect(turn.getAttribute('aria-expanded')).toBe('true');
    const sub = document.getElementById(turn.getAttribute('aria-controls')!)!;
    expect(sub.getAttribute('role')).toBe('menu');
    expect(ids(sub)).toContain('turn_h2');
    expect(ids(sub)).not.toContain('turn_text');
    at(sub, 'ArrowLeft');
    expect(document.activeElement).toBe(turn);
    expect(turn.getAttribute('aria-expanded')).toBe('false');
    at(m, 'Enter');
    const sub2 = document.getElementById(turn.getAttribute('aria-controls')!)!;
    at(sub2, 'Escape');
    expect(document.activeElement).toBe(turn);
    at(m, 'Tab');
    expect(m.hidden).toBe(true);
    keydown(view(handle).dom, 'ContextMenu');
    expect(m.hidden).toBe(false);
    at(m, 'x', { ctrlKey: true });
    expect(m.hidden).toBe(false);
    document.body.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    expect(m.hidden).toBe(true);
  });

  it('turn into, duplicate, move and delete run as one transaction each', async () => {
    handle = await editor('One\n\nTwo', { features: ['context_menu'] });
    caret(handle, 2);
    rightClick(handle);
    let m = menu(handle)!;
    items(m).find((b) => b.dataset.id === 'turn_into')!.click();
    const sub = document.getElementById(items(m).find((b) => b.dataset.id === 'turn_into')!.getAttribute('aria-controls')!)!;
    items(sub).find((b) => b.dataset.id === 'turn_h2')!.click();
    expect(handle.getMarkdown()).toBe('## One\n\nTwo\n');
    rightClick(handle);
    m = menu(handle)!;
    items(m).find((b) => b.dataset.id === 'move_down')!.click();
    expect(handle.getMarkdown()).toBe('Two\n\n## One\n');
    rightClick(handle);
    items(menu(handle)!).find((b) => b.dataset.id === 'duplicate')!.click();
    expect(handle.getMarkdown()).toBe('Two\n\n## One\n\n## One\n');
    rightClick(handle);
    items(menu(handle)!).find((b) => b.dataset.id === 'delete')!.click();
    expect(handle.getMarkdown()).toBe('Two\n\n## One\n');
    rightClick(handle);
    items(menu(handle)!).find((b) => b.dataset.id === 'move_up')!.click();
    expect(handle.getMarkdown()).toBe('## One\n\nTwo\n');
  });

  it('commands run on the selection the menu was opened for, even if something moved it meanwhile', async () => {
    handle = await editor('One\n\nTwo', { features: ['context_menu'] });
    caret(handle, 7);
    keydown(view(handle).dom, 'F10', { shiftKey: true });
    const m = menu(handle)!;
    caret(handle, 1); // e.g. an extension or a measuring script moved the editor selection while the menu had focus
    const turn = items(m).find((b) => b.dataset.id === 'turn_into')!;
    turn.click();
    items(document.getElementById(turn.getAttribute('aria-controls')!)!).find((b) => b.dataset.id === 'turn_h2')!.click();
    expect(handle.getMarkdown()).toBe('One\n\n## Two\n');
    // A document change while the menu is open closes it (CZ-I9.2); a stale item does nothing.
    caret(handle, 2);
    keydown(view(handle).dom, 'F10', { shiftKey: true });
    const stale = items(menu(handle)!).find((b) => b.dataset.id === 'duplicate')!;
    view(handle).dispatch(view(handle).state.tr.insertText('!', 1));
    expect(menu(handle)!.hidden).toBe(true);
    stale.click();
    expect(handle.getMarkdown()).toBe('!One\n\n## Two\n');
    const runner = selectionRunner(view(handle));
    view(handle).dispatch(view(handle).state.tr.insertText('?', 1));
    runner(duplicateBlock);
    expect(handle.getMarkdown()).toBe('?!One\n\n## Two\n');
  });

  it('Remove link works on the current document, not on positions of the old one (CZ-I9.1)', async () => {
    handle = await editor('[Docs](https://example.com/d) end', { features: ['context_menu'] });
    caret(handle, 3);
    keydown(view(handle).dom, 'F10', { shiftKey: true });
    const remove = items(menu(handle)!).find((b) => b.dataset.id === 'link_remove')!;
    caret(handle, 9); // the selection moved off the link: the runner restores it, the range is computed again
    remove.click();
    expect(handle.getMarkdown()).toBe('Docs end\n');
    // No link at the restored caret: nothing happens.
    caret(handle, 7);
    keydown(view(handle).dom, 'F10', { shiftKey: true });
    expect(items(menu(handle)!).map((b) => b.dataset.id)).not.toContain('link_remove');
  });

  it('table and link groups; links open with noopener and can be removed', async () => {
    handle = await editor('[Docs](https://example.com/d) text\n\n| a | b |\n| - | - |\n| 1 | 2 |\n', { features: ['context_menu', 'table'] });
    caret(handle, 3);
    rightClick(handle);
    const m = menu(handle)!;
    expect(ids(m)).toEqual(expect.arrayContaining(['link_open', 'link_copy', 'link_remove']));
    const open = vi.fn();
    vi.stubGlobal('open', open);
    items(m).find((b) => b.dataset.id === 'link_open')!.click();
    expect(open).toHaveBeenCalledWith('https://example.com/d', '_blank', 'noopener,noreferrer');
    rightClick(handle);
    items(menu(handle)!).find((b) => b.dataset.id === 'link_remove')!.click();
    expect(handle.getMarkdown()).toMatch(/^Docs text/);
    const v = view(handle);
    let cellPos = 0;
    v.state.doc.descendants((node, pos) => {
      if (!cellPos && node.type.name === 'table_cell') cellPos = pos + 2;
    });
    caret(handle, cellPos);
    rightClick(handle);
    expect(ids(menu(handle)!)).toEqual(expect.arrayContaining(['row_above', 'row_below', 'column_left', 'column_right', 'delete_row', 'delete_column', 'delete_table']));
    items(menu(handle)!).find((b) => b.dataset.id === 'row_below')!.click();
    expect(handle.getMarkdown().split('\n').filter((l) => l.startsWith('|'))).toHaveLength(4);
    caret(handle, cellPos);
    rightClick(handle);
    items(menu(handle)!).find((b) => b.dataset.id === 'delete_table')!.click();
    expect(handle.getMarkdown()).not.toContain('|');
  });

  it('keeps the browser menu for Shift, touch, code blocks and fields', async () => {
    handle = await editor('Text', { features: ['context_menu'] });
    expect(rightClick(handle, { shiftKey: true }).defaultPrevented).toBe(false);
    const touch = new MouseEvent('contextmenu', { bubbles: true, cancelable: true });
    Object.defineProperty(touch, 'pointerType', { value: 'touch' });
    view(handle).dom.dispatchEvent(touch);
    expect(touch.defaultPrevented).toBe(false);
    const field = document.createElement('input');
    view(handle).dom.append(field);
    const ev = new MouseEvent('contextmenu', { bubbles: true, cancelable: true });
    field.dispatchEvent(ev);
    expect(ev.defaultPrevented).toBe(false);
    field.remove();
    const cm = document.createElement('div');
    cm.className = 'cm-editor';
    view(handle).dom.append(cm);
    const key = keydown(cm, 'ContextMenu');
    expect(key.defaultPrevented).toBe(false);
    cm.remove();
  });

  it('clipboard: cut / copy through execCommand with a fallback, paste and plain paste through the Clipboard API', async () => {
    const writeText = vi.fn(async () => undefined);
    const readText = vi.fn(async () => 'line 1\nline 2');
    const html = new Blob(['<p><strong>bold</strong></p>'], { type: 'text/html' });
    const read = vi.fn(async () => [{ types: ['text/html'], getType: async () => html }]);
    vi.stubGlobal('navigator', { ...navigator, clipboard: { writeText, readText, read } });
    // jsdom has no ClipboardEvent (ProseMirror's pasteHTML / pasteText create one).
    vi.stubGlobal('ClipboardEvent', class extends Event {
      readonly clipboardData = null;
    });
    handle = await editor('Hello world', { features: ['context_menu'] });
    const v = view(handle);
    v.dispatch(v.state.tr.setSelection(TextSelection.create(v.state.doc, 1, 7)));
    const exec = vi.fn(() => false);
    Object.defineProperty(document, 'execCommand', { value: exec, configurable: true });
    rightClick(handle);
    items(menu(handle)!).find((b) => b.dataset.id === 'copy')!.click();
    expect(exec).toHaveBeenCalledWith('copy');
    expect(writeText).toHaveBeenCalledWith('Hello ');
    rightClick(handle);
    items(menu(handle)!).find((b) => b.dataset.id === 'cut')!.click();
    expect(handle.getMarkdown()).toBe('world\n');
    exec.mockImplementation(() => {
      throw new Error('no');
    });
    v.dispatch(v.state.tr.setSelection(TextSelection.create(v.state.doc, 1, 3)));
    rightClick(handle);
    items(menu(handle)!).find((b) => b.dataset.id === 'copy')!.click();
    expect(writeText).toHaveBeenLastCalledWith('wo');
    exec.mockImplementation(() => true);
    rightClick(handle);
    items(menu(handle)!).find((b) => b.dataset.id === 'copy')!.click();
    expect(writeText).toHaveBeenCalledTimes(3);
    caret(handle, 1);
    rightClick(handle);
    items(menu(handle)!).find((b) => b.dataset.id === 'paste_plain')!.click();
    await tick();
    expect(handle.getMarkdown()).toBe('line 1\n\nline 2world\n');
    rightClick(handle);
    items(menu(handle)!).find((b) => b.dataset.id === 'paste')!.click();
    await vi.waitFor(() => expect(handle!.getMarkdown()).toContain('**bold**'));
    const text = new Blob(['*md*'], { type: 'text/plain' });
    read.mockImplementation(async () => [{ types: ['image/png'], getType: async () => text }, { types: ['text/plain'], getType: async () => text }]);
    rightClick(handle);
    items(menu(handle)!).find((b) => b.dataset.id === 'paste')!.click();
    await vi.waitFor(() => expect(handle!.getMarkdown()).toContain('md'));
    rightClick(handle);
    items(menu(handle)!).find((b) => b.dataset.id === 'link_copy')?.click();
    Reflect.deleteProperty(document, 'execCommand');
  });

  it('host items and the cancellable DOM event; readonly menus only copy', async () => {
    const run = vi.fn();
    const off = registerContextMenuItem({ id: 'ask', label: 'Ask the team', shortcut: 'Alt+A', when: (c) => c.blockType === 'paragraph', run });
    const hidden = registerContextMenuItem({ id: 'never', label: 'Never', when: () => false, run });
    handle = await editor('Hello', { features: ['context_menu'] });
    caret(handle, 2);
    rightClick(handle);
    const m = menu(handle)!;
    expect(ids(m)).toContain('host:ask');
    expect(ids(m)).not.toContain('host:never');
    items(m).find((b) => b.dataset.id === 'host:ask')!.click();
    expect(run).toHaveBeenCalledWith(expect.objectContaining({ blockType: 'paragraph', readonly: false, text: '' }));
    const context = run.mock.calls[0]![0] as { insertText: (t: string) => void; root: HTMLElement };
    context.insertText('!');
    expect(handle.getMarkdown()).toBe('H!ello\n');
    expect(context.root).toBe(handle.root);
    off();
    hidden();
    const cancel = (e: Event) => e.preventDefault();
    handle.root.addEventListener('nowo-milkdown:contextmenu', cancel);
    rightClick(handle);
    expect(menu(handle)!.hidden).toBe(true);
    handle.root.removeEventListener('nowo-milkdown:contextmenu', cancel);
    const extend = (e: Event) => (e as CustomEvent<{ groups: { id: string; label: string }[][] }>).detail.groups.push([{ id: 'extra', label: 'Extra' }]);
    handle.root.addEventListener('nowo-milkdown:contextmenu', extend);
    rightClick(handle);
    expect(ids(menu(handle)!)).toContain('extra');
    handle.root.removeEventListener('nowo-milkdown:contextmenu', extend);
    await handle.destroy();
    handle = await editor('Read only', { features: ['context_menu'], readonly: true });
    rightClick(handle);
    expect(ids(menu(handle)!)).toEqual(['copy']);
    const ctx = run.mock.calls[0]![0] as { insertText: (t: string) => void };
    expect(typeof ctx.insertText).toBe('function');
  });
});

describe('block commands', () => {
  it('current block, turn into, task list, lift, duplicate and delete of the only block, list items', async () => {
    handle = await editor('* a\n* b\n\n> q');
    const v = view(handle);
    caret(handle, 3);
    expect(currentBlock(v.state)?.node.type.name).toBe('list_item');
    expect(moveBlock(-1)(v.state)).toBe(false);
    moveBlock(1)(v.state, v.dispatch);
    expect(handle.getMarkdown()).toMatch(/^\* b\n\* a/);
    deleteBlock(v.state, v.dispatch);
    deleteBlock(view(handle).state, v.dispatch);
    expect(handle.getMarkdown()).toBe('> q\n');
    caret(handle, 2);
    turnInto('text')(v.state, v.dispatch);
    expect(handle.getMarkdown()).toBe('q\n');
    turnInto('task_list')(v.state, v.dispatch);
    expect(handle.getMarkdown()).toBe('* [ ] q\n');
    handle.setMarkdown('only');
    caret(handle, 1);
    for (const kind of ['code', 'quote', 'ordered_list'] as const) {
      expect(turnInto(kind)(view(handle).state)).toBe(true);
    }
    turnInto('bullet_list')(v.state, v.dispatch);
    expect(handle.getMarkdown()).toBe('* only\n');
    handle.setMarkdown('only');
    caret(handle, 1);
    duplicateBlock(v.state, v.dispatch);
    expect(handle.getMarkdown()).toBe('only\n\nonly\n');
    handle.setMarkdown('only');
    caret(handle, 1);
    deleteBlock(v.state, v.dispatch);
    expect(handle.getMarkdown()).toBe('');
    handle.setMarkdown('---\n\nafter');
    v.dispatch(v.state.tr.setSelection(NodeSelection.create(v.state.doc, 0)));
    expect(currentBlock(v.state)?.node.type.name).toBe('hr');
    insertPlainText('one line', v.state.schema)(view(handle).state, v.dispatch);
    expect(handle.getMarkdown()).toContain('one line');
    const empty = EditorState.create({ schema: v.state.schema });
    expect(currentBlock(empty)?.node.type.name).toBe('paragraph');
  });

  it('markRange and the menu helpers', async () => {
    handle = await editor('a [b *c*](https://x.example) d');
    const s = view(handle).state;
    const r = markRange(s, 4, s.schema.marks.link!);
    expect(r && s.doc.textBetween(r.from, r.to)).toBe('b c');
    expect(markRange(s, 1, s.schema.marks.link!)).toBeNull();
    expect(shortcutLabel('Control+Shift+ArrowUp')).toBe('Ctrl+Shift+↑');
    const host = document.createElement('div');
    document.body.append(host);
    const onClose = vi.fn();
    const empty = new Menu(host, 'Empty', onClose);
    empty.open([[], []], 10, 10);
    expect(document.activeElement).toBe(empty.element);
    empty.onKey(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
    empty.closeAll(false);
    empty.closeAll(false);
    expect(onClose).toHaveBeenCalledTimes(1);
    empty.element.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
    empty.destroy();
  });
});
