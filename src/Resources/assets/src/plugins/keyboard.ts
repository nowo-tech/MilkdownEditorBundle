/**
 * Tab never traps keyboard users (FR-073, WCAG 2.1.2): inside a list item Tab / Shift+Tab nest and un-nest,
 * inside a table they move between cells, inside a code block CodeMirror keeps them (Escape then Tab leaves);
 * everywhere else the key goes to the browser and focus leaves the editor. The indent plugin of Crepe's
 * builder (Tab inserts spaces) never sees the key.
 */
import { $prose } from '@milkdown/kit/utils';
import { Plugin, PluginKey, type EditorState, type Transaction } from '@milkdown/kit/prose/state';
import { goToNextCell } from '@milkdown/kit/prose/tables';
import { liftListItem, sinkListItem } from '@milkdown/kit/prose/schema-list';
import type { EditorView } from '@milkdown/kit/prose/view';
import { isSuggestOpen } from './suggest';

export const keyboardKey = new PluginKey('nowo-milkdown-keyboard');

type Command = (state: EditorState, dispatch?: (tr: Transaction) => void) => boolean;

/** Where the cursor is, for Tab: inside a table cell, a list item, or neither. */
export function tabContext(state: EditorState): 'table' | 'list' | 'none' {
  const { $from } = state.selection;
  for (let d = $from.depth; d > 0; d--) {
    const name = $from.node(d).type.name;
    if (name === 'table_cell' || name === 'table_header') return 'table';
    if (name === 'list_item') return 'list';
  }
  return 'none';
}

/**
 * Reads a DOM selection the editor has not seen yet into its state (1.7). The browser moves the caret for arrows, End,
 * Home or a click and tells ProseMirror later, on `selectionchange`; a key pressed in between (Shift+F10, Enter, Tab)
 * would act on the old caret. ProseMirror's own `flush()` compares with the last DOM selection it saw, keeps node
 * and cell selections, and does nothing when nothing changed.
 */
export function flushSelection(view: EditorView): void {
  (view as unknown as { domObserver?: { flush?: () => void } }).domObserver?.flush?.();
}

/** Handles Tab; returns true when the editor used the key (the caller then prevents the default). */
export function handleTab(view: EditorView, event: KeyboardEvent): boolean {
  flushSelection(view);
  const { state } = view;
  const where = tabContext(state);
  let command: Command | null = null;
  if (where === 'table') command = goToNextCell(event.shiftKey ? -1 : 1);
  else if (where === 'list') {
    const item = state.schema.nodes.list_item!;
    command = event.shiftKey ? liftListItem(item) : sinkListItem(item);
  }
  return command !== null && command(state, view.dispatch);
}

export const keyboardPlugin = $prose(
  () =>
    new Plugin({
      key: keyboardKey,
      view: (view) => {
        const onKey = (event: KeyboardEvent): void => {
          // Before any key handler: the caret the browser moved is the one the key acts on (not during IME input).
          if (!event.isComposing && event.keyCode !== 229) flushSelection(view);
          if (event.key !== 'Tab' || event.ctrlKey || event.metaKey || event.altKey || event.defaultPrevented) return;
          if (isSuggestOpen(view)) return;
          if ((event.target as HTMLElement | null)?.closest?.('.cm-editor')) return;
          if (handleTab(view, event)) event.preventDefault();
          // Used or not, no later keymap (indent: Tab inserts spaces) may see the key.
          event.stopImmediatePropagation();
        };
        view.dom.addEventListener('keydown', onKey, true);
        return { destroy: () => view.dom.removeEventListener('keydown', onKey, true) };
      },
    }),
);
