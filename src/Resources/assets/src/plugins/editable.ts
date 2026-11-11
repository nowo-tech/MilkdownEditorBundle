/**
 * 1.17: node views that draw differently when the editor is read-only (the callout header, the task checkbox) are told
 * when the editor's `editable` prop changes. Crepe's `setReadonly()` only calls `view.setProps()`, which does not
 * redraw node views whose node is unchanged; plugin views are updated on every `setProps()`.
 */
import { Plugin, PluginKey } from '@milkdown/kit/prose/state';
import type { EditorView } from '@milkdown/kit/prose/view';
import { $prose } from '@milkdown/kit/utils';

const watchers = new WeakMap<EditorView, Set<() => void>>();

/** Calls `repaint` after every change of `view.editable`; the returned function stops it (node view `destroy`). */
export function onEditableChange(view: EditorView, repaint: () => void): () => void {
  let set = watchers.get(view);
  if (!set) {
    set = new Set();
    watchers.set(view, set);
  }
  set.add(repaint);
  return () => set.delete(repaint);
}

export const editableWatchPlugin = $prose(
  () =>
    new Plugin({
      key: new PluginKey('nowo-editable-watch'),
      view: (initial) => {
        let editable = initial.editable;
        return {
          update: (view) => {
            if (view.editable === editable) return;
            editable = view.editable;
            for (const repaint of [...(watchers.get(view) ?? [])]) repaint();
          },
        };
      },
    }),
);
