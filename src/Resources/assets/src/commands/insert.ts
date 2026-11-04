/**
 * The *Insert* group of the context menu (1.5, `insert_menu`): image or file (with uploads), icon (with icons or the
 * `:` suggestions) and the blocks of the `/` menu — headings, lists, table, code, callout, divider, math, Mermaid —
 * each only when its feature is on. Hosts no longer fake clicks on toolbar buttons to offer them.
 */
import { TextSelection } from '@milkdown/kit/prose/state';
import type { EditorView } from '@milkdown/kit/prose/view';

/** One entry of the group: `run` acts on the view at the caret prepared by {@link prepareInsertPoint}. */
export type InsertItem = {
  id: string;
  label: string;
  run: (view: EditorView) => void;
  /** 1.7: inserted inline at the caret (the icon), without a new paragraph. */
  inline?: boolean;
};

/** Blocks of the `/` menu offered by *Insert*, in this order (the others turn the current block). */
export const INSERT_BLOCKS = ['h1', 'h2', 'h3', 'bullet_list', 'ordered_list', 'task_list', 'table', 'code', 'callout', 'divider', 'math', 'mermaid'] as const;

/**
 * Puts the caret where a new block goes: an empty top-level paragraph is reused, otherwise an empty paragraph is
 * added after the top-level block around the caret (the current block is never turned into something else).
 */
export function prepareInsertPoint(view: EditorView): void {
  const { $from } = view.state.selection;
  if ($from.depth === 1 && $from.parent.type.name === 'paragraph' && $from.parent.content.size === 0) return;
  const after = $from.depth >= 1 ? $from.after(1) : view.state.doc.content.size;
  const tr = view.state.tr.insert(after, view.state.schema.nodes.paragraph!.create());
  view.dispatch(tr.setSelection(TextSelection.create(tr.doc, after + 1)).scrollIntoView());
}

/**
 * The items of the group: the host actions first (file, icon), then the `/` blocks among {@link INSERT_BLOCKS}.
 *
 * @param blocks - The `/` menu entries of the field (already filtered by its features)
 * @param actions - File and icon entries (only those the field offers)
 */
export function insertItems(blocks: readonly { item: { id: string; label: string }; run: (view: EditorView) => void }[], actions: InsertItem[]): InsertItem[] {
  const byId = new Map(blocks.map((b) => [b.item.id, b]));
  const out: InsertItem[] = [...actions];
  for (const id of INSERT_BLOCKS) {
    const block = byId.get(id);
    if (block) out.push({ id, label: block.item.label, run: block.run });
  }
  return out;
}
