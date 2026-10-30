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

/** Handles Tab; returns true when the editor used the key (the caller then prevents the default). */
export function handleTab(view: EditorView, event: KeyboardEvent): boolean {
  // A click just before Tab may not have reached the editor state yet: ProseMirror flushes pending DOM changes and
  // selection the same way before running its own key handlers.
  (view as unknown as { domObserver?: { forceFlush?: () => void } }).domObserver?.forceFlush?.();
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
