/**
 * Entry points of the icon picker (1.7): loads the picker (and, with `icon_catalog`, the catalog) as lazy chunks and
 * inserts the picked icon **inline at the caret** — from *Insert → Icon…*, `/icon`, the action bar, *Browse all
 * icons…* of the `:` list — never as a new block.
 */
import { TextSelection } from '@milkdown/kit/prose/state';
import type { EditorView } from '@milkdown/kit/prose/view';
import type { Runtime } from '../runtime';
import { prepareInsertPoint } from '../commands/insert';
import type { IconEntry } from './search';

export const lazyIcons = {
  picker: () => import('../ui/icon-picker'),
  catalog: () => import('./catalog'),
};

/** Catalog entries when the field has `icon_catalog`, otherwise none. */
export async function catalogEntries(runtime: Runtime): Promise<IconEntry[]> {
  return runtime.catalogUrl ? (await lazyIcons.catalog()).catalog() : [];
}

/**
 * Inserts a `:tabler-NAME:` node at the caret, followed by a space, in the caret's own paragraph. Only a caret where
 * inline nodes cannot go (code block, a selected block) first gets a paragraph after its block.
 *
 * @param view - The editor
 * @param name - Icon name
 */
export function insertIcon(view: EditorView, name: string): void {
  const type = view.state.schema.nodes.tablerIcon;
  if (!type) return;
  const { $from } = view.state.selection;
  if (!$from.parent.inlineContent || $from.parent.type.spec.code || !$from.parent.type.contentMatch.matchType(type)) prepareInsertPoint(view);
  view.dispatch(view.state.tr.replaceSelectionWith(type.create({ name }), false).insertText(' ').scrollIntoView());
}

/**
 * Opens the picker at the caret; the pick is inserted inline there. Focus returns to the editor afterwards.
 *
 * @param view - The editor
 * @param runtime - Its runtime
 * @param query - Initial search (e.g. what followed `:`)
 */
export async function openPickerAtCaret(view: EditorView, runtime: Runtime, query = ''): Promise<void> {
  const { open } = await lazyIcons.picker();
  if (view.isDestroyed) return;
  const host = (view.dom.closest('.nowo-milkdown') as HTMLElement | null) ?? document.body;
  const at = view.state.selection.from;
  const coords = view.coordsAtPos(at);
  open({
    host,
    runtime,
    x: coords.left,
    y: coords.bottom + 4,
    query,
    entries: () => catalogEntries(runtime),
    onPick: (value) => {
      view.focus();
      // The caret where the picker opened (still valid: the picker never edits the document).
      if (at <= view.state.doc.content.size && view.state.selection.from !== at) {
        view.dispatch(view.state.tr.setSelection(TextSelection.near(view.state.doc.resolve(at))));
      }
      if (value) insertIcon(view, value);
    },
    onClose: (restore) => {
      if (restore) view.focus();
    },
  });
}
