import { afterEach, describe, expect, it, vi } from 'vitest';
import { editorViewCtx } from '@milkdown/kit/core';
import { NodeSelection, TextSelection } from '@milkdown/kit/prose/state';
import { editor, keydown } from './helpers';
import type { MilkdownEditorHandle } from '../src/editor';
import { currentColors, openColorMenu, setBlockColor, setInlineColor } from '../src/commands/colors';
import { COLORS, colorOf, markColor } from '../src/dialect/directives';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { topLevelPos, type BlockActionsView } from '../src/plugins/block-actions';
import { parseOptions } from '../src/options';
import { COLOR_ICON } from '../src/features';
import { runtimeCtx } from '../src/runtime';

let handle: MilkdownEditorHandle | null = null;
afterEach(async () => {
  vi.unstubAllGlobals();
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

describe('colour dialect (1.4)', () => {
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

  it('inline colours keep other text directives (DB-I4) and follow mark_colors (DB-I7)', async () => {
    handle = await editor(':note[x]{a="1"} plain', { features: ['colors', 'context_menu'], colors: ['red', 'blue'] });
    const v = view(handle);
    select(handle, 1, 9);
    setInlineColor('text', 'red')(v.state, v.dispatch);
    expect(handle.getMarkdown()).toContain(':note[');
    expect(handle.getMarkdown()).toContain('text="red"');
    keydown(v.dom, 'F10', { shiftKey: true });
    const colors = sub(openMenu(handle), 'color');
    expect([...colors.querySelectorAll('[data-id]')].map((b) => (b as HTMLElement).dataset.id)).toEqual(['text_default', 'text_blue', 'text_red', 'bg_default', 'bg_blue', 'bg_red']);
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
    // DB-I8: each mark keeps its own other colour; only the colour being changed is set.
    handle.setMarkdown(':mark[Ab]{bg="green"}:mark[Cd]{bg="blue"}');
    select(handle, 1, 5);
    setInlineColor('text', 'red')(view(handle).state, v.dispatch);
    expect(handle.getMarkdown()).toBe(':mark[Ab]{bg="green" text="red"}:mark[Cd]{bg="blue" text="red"}\n');
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

describe('colour contrast (DB-I3)', () => {
  const css = readFileSync(resolve(process.cwd(), 'src/Resources/assets/src/styles/milkdown-editor.css'), 'utf8');
  /** Token values of the first block defining `--nowo-milkdown-mark-text` (light), then of the next one (dark). */
  const themes = (() => {
    const blocks = css.split('}').filter((b) => b.includes('--nowo-milkdown-mark-text:'));
    return blocks.slice(0, 2).map((block) => Object.fromEntries([...block.matchAll(/--nowo-milkdown-([\w-]+):\s*(#[0-9a-f]{6})/gi)].map((m) => [m[1]!, m[2]!])));
  })();
  const lum = (hex: string) => {
    const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
    return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!;
  };
  const ratio = (a: string, b: string) => {
    const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
    return (hi! + 0.05) / (lo! + 0.05);
  };

  it('text-only marks have no background on either side; text inside a coloured block is paired (DB-L1, DB-I3)', () => {
    expect(css).toMatch(/\.nowo-milkdown-mark--none,\s*\.nowo-md-mark--none \{ background: transparent; color: inherit; \}/);
    expect(css).toMatch(/\[class\*='nowo-md-bg--'\] \[class\*='nowo-md-text--'\][^{]*\{[^}]*color: var\(--nowo-milkdown-mark-text\)/);
    expect(css).toMatch(/\[class\*='nowo-milkdown-bg--'\] \[class\*='nowo-milkdown-color--'\]/);
  });

  it('Crepe icons (outline) use a mid text tone with at least 3:1 on the toolbar and the page', () => {
    expect(css).toContain('--crepe-color-outline: var(--nowo-milkdown-muted);');
    for (const tokens of themes) {
      expect(ratio(tokens.muted!, tokens.surface!)).toBeGreaterThanOrEqual(3);
      expect(ratio(tokens.muted!, tokens.background!)).toBeGreaterThanOrEqual(3);
    }
  });

  it('every text colour on the page, every background with its text, and every text + background pair pass AA', () => {
    expect(themes).toHaveLength(2);
    expect(css).toMatch(/\[class\*='nowo-md-bg--'\]\[class\*='nowo-md-text--'\][^{]*\{\s*color: var\(--nowo-milkdown-mark-text\)/);
    for (const tokens of themes) {
      for (const text of COLORS) {
        expect(ratio(tokens[`color-${text}`]!, tokens.background!)).toBeGreaterThanOrEqual(4.5);
        expect(ratio(tokens[`color-${text}`]!, tokens.surface!)).toBeGreaterThanOrEqual(4.5);
        for (const bg of COLORS) {
          // With both set the text uses the background's paired text colour (the rule above): 81 pairs per theme.
          expect(ratio(tokens['mark-text']!, tokens[`mark-${bg}`]!)).toBeGreaterThanOrEqual(4.5);
        }
      }
    }
  });
});

describe('block actions (1.4)', () => {
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
    // DB-I5 residual: the block is resolved again at dragstart (a block inserted above since the hover).
    actions.show(0);
    v.dispatch(v.state.tr.insert(0, v.state.schema.nodes.paragraph!.create(null, v.state.schema.text('Zero'))));
    button.dispatchEvent(drag);
    expect(data.setData).toHaveBeenLastCalledWith('text/plain', 'One');
    button.dispatchEvent(new Event('dragend'));
    handle.setMarkdown('One\n\nTwo');
    // DB-I5: the document changes during a drag: the drag is cancelled and the drop swallowed.
    vi.stubGlobal('DragEvent', class extends Event {});
    actions.show(0);
    button.dispatchEvent(drag);
    v.dispatch(v.state.tr.insertText('!', 1));
    expect(v.dragging).toBeNull();
    expect(actions.dragCancelled).toBe(true);
    const before = handle.getMarkdown();
    const drop = new Event('drop', { bubbles: true, cancelable: true }) as DragEvent;
    Object.defineProperty(drop, 'dataTransfer', { value: { getData: () => 'One', files: [], types: ['text/plain'] } });
    Object.defineProperty(drop, 'clientX', { value: 1 });
    Object.defineProperty(drop, 'clientY', { value: 1 });
    v.dom.dispatchEvent(drop);
    expect(handle.getMarkdown()).toBe(before);
    expect(actions.dragCancelled).toBe(false);
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
