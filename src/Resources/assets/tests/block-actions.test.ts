import { afterEach, describe, expect, it, vi } from 'vitest';
import { editorViewCtx } from '@milkdown/kit/core';
import { NodeSelection, TextSelection } from '@milkdown/kit/prose/state';
import { editor, keydown } from './helpers';
import type { MilkdownEditorHandle } from '../src/editor';
import { currentColors, openColorMenu, setBlockColor, setInlineColor } from '../src/commands/colors';
import { colorOf, markColor } from '../src/dialect/directives';
import { topLevelPos, type BlockActionsView } from '../src/plugins/block-actions';
import { parseOptions } from '../src/options';
import { COLOR_ICON } from '../src/features';
import { runtimeCtx } from '../src/runtime';

let handle: MilkdownEditorHandle | null = null;
afterEach(async () => {
  await handle?.destroy();
  handle = null;
  document.body.replaceChildren();
});

const view = (h: MilkdownEditorHandle) => h.builder.editor.action((ctx) => ctx.get(editorViewCtx));
const caret = (h: MilkdownEditorHandle, pos: number) => {
  const v = view(h);
  v.dispatch(v.state.tr.setSelection(TextSelection.create(v.state.doc, pos)));
};
const select = (h: MilkdownEditorHandle, from: number, to: number) => {
  const v = view(h);
  v.dispatch(v.state.tr.setSelection(TextSelection.create(v.state.doc, from, to)));
};
const handleButton = (h: MilkdownEditorHandle) => h.root.querySelector<HTMLButtonElement>('.nowo-milkdown-block-handle')!;
const openMenu = (h: MilkdownEditorHandle) => [...h.root.querySelectorAll<HTMLElement>('.nowo-milkdown-menu')].find((m) => !m.hidden)!;
const item = (menu: HTMLElement, id: string) => menu.querySelector<HTMLButtonElement>(`[data-id="${id}"]`)!;
const sub = (menu: HTMLElement, id: string) => {
  item(menu, id).click();
  return document.getElementById(item(menu, id).getAttribute('aria-controls')!)!;
};

describe('colour dialect (1.3)', () => {
  it('reads bg / text / legacy color and round trips inline and block colours', async () => {
    expect(markColor({})).toBe('yellow');
    expect(markColor({ color: 'green' })).toBe('green');
    expect(markColor({ bg: 'pink', color: 'green' })).toBe('pink');
    expect(markColor({ text: 'red' })).toBe('none');
    expect(markColor({ color: 'bogus' })).toBe('yellow');
    expect(colorOf('teal')).toBeNull();
    const md = ':mark[old]{color="green"} :mark[both]{bg="yellow" text="red"} :mark[ink]{text="blue"}\n\n::: {bg="orange" text="brown"}\nBlock.\n:::\n';
    handle = await editor(md);
    const first = handle.getMarkdown();
    handle.setMarkdown(first);
    expect(handle.getMarkdown()).toBe(first);
    expect(first).toContain(':mark[old]{color="green"}');
    expect(first).toContain('::: {bg="orange" text="brown"}');
    const dom = view(handle).dom;
    expect(dom.querySelector('mark.nowo-milkdown-mark--green')?.textContent).toBe('old');
    expect(dom.querySelector('mark.nowo-milkdown-mark--yellow.nowo-milkdown-color--red')?.textContent).toBe('both');
    expect(dom.querySelector('mark.nowo-milkdown-mark--none.nowo-milkdown-color--blue')?.textContent).toBe('ink');
    expect(dom.querySelector('.nowo-milkdown-directive--align.nowo-milkdown-bg--orange.nowo-milkdown-color--brown')).not.toBeNull();
  });

  it('inline commands set, change and clear colours; legacy color becomes bg', async () => {
    handle = await editor('Hello world');
    const v = view(handle);
    expect(setInlineColor('text', 'red')(v.state)).toBe(false); // empty selection
    select(handle, 1, 6);
    setInlineColor('text', 'red')(v.state, v.dispatch);
    expect(handle.getMarkdown()).toBe(':mark[Hello]{text="red"} world\n');
    expect(currentColors(view(handle).state, true)).toEqual({ text: 'red', bg: null });
    setInlineColor('bg', 'yellow')(view(handle).state, v.dispatch);
    expect(handle.getMarkdown()).toBe(':mark[Hello]{bg="yellow" text="red"} world\n');
    setInlineColor('text', null)(view(handle).state, v.dispatch);
    setInlineColor('bg', null)(view(handle).state, v.dispatch);
    expect(handle.getMarkdown()).toBe('Hello world\n');
    handle.setMarkdown(':mark[Hi]{color="green"}');
    select(handle, 1, 3);
    expect(currentColors(view(handle).state, true)).toEqual({ text: null, bg: 'green' });
    setInlineColor('bg', 'blue')(view(handle).state, v.dispatch);
    expect(handle.getMarkdown()).toBe(':mark[Hi]{bg="blue"}\n');
  });

  it('block commands wrap, update and unwrap the coloured container (alignment kept)', async () => {
    handle = await editor('One\n\nTwo');
    const v = view(handle);
    caret(handle, 2);
    expect(setBlockColor('bg', null)(v.state, v.dispatch)).toBe(true); // nothing to clear
    setBlockColor('bg', 'yellow')(view(handle).state, v.dispatch);
    expect(handle.getMarkdown()).toBe('::: {bg="yellow"}\nOne\n:::\n\nTwo\n');
    expect(currentColors(view(handle).state, false)).toEqual({ text: null, bg: 'yellow' });
    setBlockColor('text', 'red')(view(handle).state, v.dispatch);
    expect(handle.getMarkdown()).toBe('::: {bg="yellow" text="red"}\nOne\n:::\n\nTwo\n');
    setBlockColor('text', null)(view(handle).state, v.dispatch);
    setBlockColor('bg', null)(view(handle).state, v.dispatch);
    expect(handle.getMarkdown()).toBe('One\n\nTwo\n');
    handle.setMarkdown('::: {align="center"}\nMid\n:::');
    caret(handle, 3);
    setBlockColor('bg', 'blue')(view(handle).state, v.dispatch);
    setBlockColor('bg', null)(view(handle).state, v.dispatch);
    expect(handle.getMarkdown()).toBe('::: {align="center"}\nMid\n:::\n');
  });
});

describe('block actions (1.3)', () => {
  it('is off by default; block_drag needs block_actions', async () => {
    expect(parseOptions('{"features":["block_drag"]}').features).toEqual([]);
    expect(parseOptions('{"features":["block_actions","block_drag","colors"]}').features).toEqual(['block_actions', 'block_drag', 'colors']);
    handle = await editor('Text');
    expect(handle.root.querySelector('.nowo-milkdown-block-handle')).toBeNull();
  });

  it('the handle is a named button outside the tab order; Ctrl+/ opens the block menu with colours', async () => {
    handle = await editor('One\n\nTwo', { features: ['block_actions', 'colors'] });
    const button = handleButton(handle);
    expect(button.getAttribute('aria-label')).toBe('Block actions');
    expect(button.tabIndex).toBe(-1);
    expect(button.getAttribute('aria-haspopup')).toBe('menu');
    expect(handle.root.classList.contains('nowo-milkdown--blocks')).toBe(true);
    caret(handle, 2);
    const ev = keydown(view(handle).dom, '/', { ctrlKey: true });
    expect(ev.defaultPrevented).toBe(true);
    const menu = openMenu(handle);
    expect(menu.getAttribute('aria-label')).toBe('Block actions');
    expect(button.getAttribute('aria-expanded')).toBe('true');
    expect([...menu.querySelectorAll('[data-id]')].map((b) => (b as HTMLElement).dataset.id)).toEqual(['turn_into', 'color', 'duplicate', 'move_up', 'move_down', 'delete']);
    const colors = sub(menu, 'color');
    expect(colors.querySelectorAll('[role="menuitemradio"]')).toHaveLength(20);
    expect(item(colors, 'text_default').getAttribute('aria-checked')).toBe('true');
    expect(item(colors, 'bg_red').textContent).toContain('Red background');
    expect(item(colors, 'bg_red').querySelector('.nowo-milkdown-menu__swatch.nowo-milkdown-bg--red')).not.toBeNull();
    expect(colors.querySelectorAll('[role="separator"]')).toHaveLength(1);
    item(colors, 'bg_green').click();
    expect(handle.getMarkdown()).toBe('::: {bg="green"}\nOne\n:::\n\nTwo\n');
    expect(button.getAttribute('aria-expanded')).toBe('false');
  });

  it('the block menu and the colour menu close when the document changes', async () => {
    handle = await editor('One\n\nTwo', { features: ['block_actions', 'colors', 'toolbar'] });
    const v = view(handle);
    caret(handle, 2);
    keydown(v.dom, '/', { ctrlKey: true });
    const blockMenu = openMenu(handle);
    v.dispatch(v.state.tr.insertText('!', 1));
    expect(blockMenu.hidden).toBe(true);
    select(handle, 1, 3);
    const colorMenu = openColorMenu(v, handle.builder.editor.action((ctx) => ctx.get(runtimeCtx.key)));
    v.dispatch(v.state.tr.setSelection(TextSelection.create(v.state.doc, 2)));
    expect(colorMenu.isOpen).toBe(true); // a selection change keeps it
    v.dispatch(v.state.tr.insertText('?', 1));
    expect(colorMenu.isOpen).toBe(false);
  });

  it('menu commands run on the selection the menu was opened for', async () => {
    handle = await editor('One\n\nTwo', { features: ['block_actions', 'colors'] });
    const v = view(handle);
    caret(handle, 7);
    keydown(v.dom, '/', { ctrlKey: true });
    const menu = openMenu(handle);
    caret(handle, 1); // something moved the editor selection while the menu had focus
    item(sub(menu, 'color'), 'bg_red').click();
    expect(handle.getMarkdown()).toBe('One\n\n::: {bg="red"}\nTwo\n:::\n');
  });

  it('Alt+Shift+arrows move the block and announce it; the menu moves, duplicates and deletes', async () => {
    handle = await editor('One\n\nTwo', { features: ['block_actions'] });
    caret(handle, 2);
    keydown(view(handle).dom, 'ArrowDown', { altKey: true, shiftKey: true });
    expect(handle.getMarkdown()).toBe('Two\n\nOne\n');
    const status = handle.root.querySelector('.nowo-milkdown__status')!;
    expect(status.textContent).toBe('Block moved down');
    keydown(view(handle).dom, 'ArrowDown', { altKey: true, shiftKey: true });
    expect(status.textContent).toBe('Already the last block');
    keydown(view(handle).dom, 'ArrowUp', { altKey: true, shiftKey: true });
    expect(status.textContent).toBe('Block moved up');
    keydown(view(handle).dom, 'ArrowUp', { altKey: true, shiftKey: true });
    expect(status.textContent).toBe('Already the first block');
    keydown(view(handle).dom, '/', { ctrlKey: true });
    let menu = openMenu(handle);
    expect([...menu.querySelectorAll('[data-id]')].map((b) => (b as HTMLElement).dataset.id)).not.toContain('color');
    item(menu, 'move_down').click();
    expect(handle.getMarkdown()).toBe('Two\n\nOne\n');
    keydown(view(handle).dom, '/', { ctrlKey: true });
    menu = openMenu(handle);
    item(menu, 'duplicate').click();
    keydown(view(handle).dom, '/', { ctrlKey: true });
    item(openMenu(handle), 'delete').click();
    keydown(view(handle).dom, '/', { ctrlKey: true });
    menu = openMenu(handle);
    sub(menu, 'turn_into');
    const turn = document.getElementById(item(menu, 'turn_into').getAttribute('aria-controls')!)!;
    item(turn, 'turn_h1').click();
    expect(handle.getMarkdown()).toMatch(/# One/);
    // Keys are ignored with other modifiers, inside code blocks and once handled.
    const other = keydown(view(handle).dom, '/', { ctrlKey: true, shiftKey: true });
    expect(other.defaultPrevented).toBe(false);
  });

  it('the handle follows the pointer and the caret; a click selects that block first', async () => {
    handle = await editor('One\n\nTwo', { features: ['block_actions'] });
    const v = view(handle);
    const actions = (v as unknown as { pluginViews: unknown[] }).pluginViews.find((p) => (p as BlockActionsView).button) as BlockActionsView;
    const secondPos = v.state.doc.child(0).nodeSize;
    actions.show(secondPos);
    expect(handleButton(handle).hidden).toBe(false);
    handleButton(handle).click();
    expect(v.state.selection.from).toBeGreaterThan(secondPos);
    expect(openMenu(handle)).toBeDefined();
    document.body.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    actions.show(null);
    expect(handleButton(handle).hidden).toBe(true);
    expect(topLevelPos(v.state, 2)).toBe(0);
    expect(topLevelPos(v.state, 0)).toBe(0);
    v.dom.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientX: 5, clientY: 5 })); // on the editable itself: ignored
    (v.dom.children[1] as HTMLElement).dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
    expect(handleButton(handle).hidden).toBe(false);
    const foreign = document.createElement('div');
    v.dom.append(foreign);
    foreign.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
    foreign.remove();
    const md = handleButton(handle).dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));
    expect(md).toBe(false);
  });

  it('block_drag: dragging the handle selects the block and hands ProseMirror a move', async () => {
    handle = await editor('One\n\nTwo', { features: ['block_actions', 'block_drag'] });
    const v = view(handle);
    const button = handleButton(handle);
    expect(button.draggable).toBe(true);
    const actions = (v as unknown as { pluginViews: unknown[] }).pluginViews.find((p) => (p as BlockActionsView).button) as BlockActionsView;
    actions.show(null);
    const none = new Event('dragstart', { cancelable: true }) as DragEvent;
    button.dispatchEvent(none);
    expect(none.defaultPrevented).toBe(true);
    actions.show(0);
    const data = { effectAllowed: '', setData: vi.fn(), setDragImage: vi.fn() };
    const drag = new Event('dragstart', { cancelable: true }) as DragEvent;
    Object.defineProperty(drag, 'dataTransfer', { value: data });
    button.dispatchEvent(drag);
    expect(v.state.selection).toBeInstanceOf(NodeSelection);
    expect(v.dragging?.move).toBe(true);
    expect(data.setData).toHaveBeenCalledWith('text/plain', 'One');
    expect(data.effectAllowed).toBe('move');
    button.dispatchEvent(new Event('dragend'));
    expect(v.dragging).toBeNull();
  });

  it('context menu shows Color for the selection (inline) or the block; toolbar colour menu', async () => {
    handle = await editor('Hello world', { features: ['context_menu', 'colors', 'toolbar'] });
    expect(COLOR_ICON).toContain('<svg');
    select(handle, 1, 6);
    keydown(view(handle).dom, 'F10', { shiftKey: true }); // keeps the selection (a right click may move it)
    const menu = openMenu(handle);
    const colors = sub(menu, 'color');
    item(colors, 'text_purple').click();
    expect(handle.getMarkdown()).toBe(':mark[Hello]{text="purple"} world\n');
    select(handle, 1, 6);
    const toolbarMenu = openColorMenu(view(handle), handle.builder.editor.action((ctx) => ctx.get(runtimeCtx.key)));
    expect(toolbarMenu.isOpen).toBe(true);
    item(toolbarMenu.element, 'text_default').click();
    expect(handle.getMarkdown()).toBe('Hello world\n');
  });
});
