/**
 * Text and background colours (1.3, `colors` feature): inline on a selection (`:mark[…]{text=… bg=…}`) and on a whole
 * top-level block (`::: {text=… bg=…}`, the nameless container that also carries alignment). Named colours only.
 */
import type { Mark, MarkType, Node as ProseNode } from '@milkdown/kit/prose/model';
import { Plugin, PluginKey, TextSelection, type EditorState, type Transaction } from '@milkdown/kit/prose/state';
import { $prose } from '@milkdown/kit/utils';
import { selectionRunner } from './blocks';
import { COLORS, colorOf, decodeAttributes, encodeAttributes, type Color } from '../dialect/directives';
import { t, type Runtime } from '../runtime';
import { Menu, type MenuItem } from '../ui/menu';
import type { EditorView } from '@milkdown/kit/prose/view';

export type ColorKind = 'text' | 'bg';
type Dispatch = (tr: Transaction) => void;

/** Attributes of the first `:mark` in the selection (its colours), or {}. */
function markAttributes(state: EditorState, type: MarkType): Record<string, string> {
  const { from, to } = state.selection;
  let found: Mark | null = null;
  state.doc.nodesBetween(from, to, (node) => {
    if (found) return false;
    const mark = node.marks.find((m) => m.type === type && m.attrs.name === 'mark');
    if (mark) found = mark;
    return true;
  });
  return found ? decodeAttributes((found as Mark).attrs.attributes) : {};
}

/** The top-level block around the selection and, when it is a coloured / aligned container, that container. */
function topBlock(state: EditorState): { pos: number; node: ProseNode; container: boolean } | null {
  const $from = state.selection.$from;
  if ($from.depth < 1) return null;
  const node = $from.node(1);
  const container = node.type.name === 'containerDirective' && node.attrs.name === 'align';
  return { pos: $from.before(1), node, container };
}

/** Current colours of the selection: inline (`:mark`) when it is not empty, otherwise of the block. */
export function currentColors(state: EditorState, inline: boolean): { text: Color | null; bg: Color | null } {
  const type = state.schema.marks.textDirective;
  const attributes = inline && type ? markAttributes(state, type) : (() => {
    const block = topBlock(state);
    return block?.container ? decodeAttributes(block.node.attrs.attributes) : {};
  })();
  return { text: colorOf(attributes.text), bg: colorOf(attributes.bg) ?? (inline ? colorOf(attributes.color) : null) };
}

/**
 * Sets (or with null clears) one colour of the selected text: the `:mark` keeps its other colour; a `:mark` left
 * without colours is removed. A legacy `color=` becomes `bg=` when the background is changed.
 */
export function setInlineColor(kind: ColorKind, color: Color | null) {
  return (state: EditorState, dispatch?: Dispatch): boolean => {
    const type = state.schema.marks.textDirective;
    const { from, to, empty } = state.selection;
    if (!type || empty) return false;
    if (dispatch) {
      const tr = state.tr;
      // Only :mark directives change (DB-I4). Text inside another text directive (:note[…], …) keeps it: one text
      // directive per character, so that text is left without colour. Each piece keeps its own other colour (DB-I8):
      // only the colour being changed is set or cleared.
      state.doc.nodesBetween(from, to, (node, pos) => {
        if (!node.isText) return true;
        const marks = node.marks.filter((m) => m.type === type);
        if (marks.some((m) => m.attrs.name !== 'mark')) return false;
        const start = Math.max(from, pos);
        const end = Math.min(to, pos + node.nodeSize);
        const attributes = marks.length ? decodeAttributes(marks[0]!.attrs.attributes) : {};
        if (kind === 'bg') delete attributes.color;
        if (color) attributes[kind] = color;
        else delete attributes[kind];
        for (const mark of marks) tr.removeMark(start, end, mark);
        if (Object.keys(attributes).some((k) => k === 'text' || k === 'bg' || k === 'color')) {
          tr.addMark(start, end, type.create({ name: 'mark', attributes: encodeAttributes(attributes) }));
        }
        return false;
      });
      dispatch(tr);
    }
    return true;
  };
}

/**
 * Sets (or with null clears) one colour of the top-level block around the selection: the block is wrapped in a
 * `::: {…}` container, or the existing one is updated; a container left without colours and alignment is unwrapped.
 */
export function setBlockColor(kind: ColorKind, color: Color | null) {
  return (state: EditorState, dispatch?: Dispatch): boolean => {
    const block = topBlock(state);
    const type = state.schema.nodes.containerDirective;
    if (!block || !type) return false;
    if (!dispatch) return true;
    const { pos, node, container } = block;
    const offset = state.selection.from - pos;
    if (container) {
      const attributes = decodeAttributes(node.attrs.attributes);
      if (color) attributes[kind] = color;
      else delete attributes[kind];
      if (Object.keys(attributes).length) {
        dispatch(state.tr.setNodeMarkup(pos, undefined, { ...node.attrs, attributes: encodeAttributes(attributes) }));
        return true;
      }
      // No colour and no alignment left: unwrap, keeping the caret where it was.
      const tr = state.tr.replaceWith(pos, pos + node.nodeSize, node.content);
      dispatch(tr.setSelection(TextSelection.near(tr.doc.resolve(Math.max(pos + offset - 1, 0)))).scrollIntoView());
      return true;
    }
    if (!color) return true;
    const wrapper = type.create({ name: 'align', label: '', attributes: encodeAttributes({ [kind]: color }) }, node);
    const tr = state.tr.replaceWith(pos, pos + node.nodeSize, wrapper);
    dispatch(tr.setSelection(TextSelection.near(tr.doc.resolve(Math.min(pos + offset + 1, tr.doc.content.size)))).scrollIntoView());
    return true;
  };
}

/**
 * The *Color* submenu: default + nine text colours, then default + nine backgrounds, the current ones checked.
 *
 * @param inline - Colour the selected text (true) or the block (false)
 * @param run - Applies a command to the editor
 */
export function colorItems(state: EditorState, runtime: Runtime, inline: boolean, run: (command: (s: EditorState, d?: Dispatch) => boolean) => void): MenuItem[] {
  const current = currentColors(state, inline);
  const set = inline ? setInlineColor : setBlockColor;
  const items: MenuItem[] = [];
  for (const kind of ['text', 'bg'] as const) {
    const key = kind === 'text' ? 'text' : 'background';
    items.push({
      id: `${kind}_default`,
      label: t(runtime, `color.default_${key}`),
      checked: current[kind] === null,
      separatorBefore: kind === 'bg',
      run: () => run(set(kind, null)),
    });
    for (const color of COLORS.filter((name) => runtime.colors.length === 0 || runtime.colors.includes(name))) {
      items.push({
        id: `${kind}_${color}`,
        label: t(runtime, `color.${key}`, { color: t(runtime, `color.${color}`) }),
        swatch: kind === 'text' ? `nowo-milkdown-color--${color}` : `nowo-milkdown-bg--${color}`,
        checked: current[kind] === color,
        run: () => run(set(kind, color)),
      });
    }
  }
  return items;
}

const menus = new WeakMap<EditorView, Menu>();

/** Opens the *Color* menu for the selected text under the selection (the toolbar's colour button, 1.3). */
export function openColorMenu(view: EditorView, runtime: Runtime): Menu {
  let menu = menus.get(view);
  if (!menu) {
    const host = (view.dom.closest('.nowo-milkdown') as HTMLElement | null) ?? document.body;
    menu = new Menu(host, t(runtime, 'menu.color'), (restore) => {
      if (restore) view.focus();
    });
    menus.set(view, menu);
  }
  const run = selectionRunner(view);
  const coords = view.coordsAtPos(view.state.selection.to);
  menu.open([colorItems(view.state, runtime, !view.state.selection.empty, run)], coords.left, coords.bottom + 4);
  return menu;
}

/** Closes the toolbar's colour menu when the document changes while it is open (CZ-I9.2). */
export const colorMenuPlugin = $prose(
  () =>
    new Plugin({
      key: new PluginKey('nowo-milkdown-color-menu'),
      view: () => ({
        update: (view, previous) => {
          const menu = menus.get(view);
          if (menu?.isOpen && view.state.doc !== previous.doc) menu.closeAll(false);
        },
      }),
    }),
);
