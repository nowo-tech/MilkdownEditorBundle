/**
 * Host items of the context menu (`window.NowoMilkdownEditor.contextMenu.register`). Kept out of the lazy context
 * menu chunk so hosts can register items before any editor loads it.
 */

/** What a host item sees: a narrow view of the editor, never the ProseMirror view itself. */
export type ContextMenuContext = {
  /** The widget root (`.nowo-milkdown`). */
  root: HTMLElement;
  selection: { from: number; to: number; empty: boolean };
  /** Plain text of the selection ('' when empty). */
  text: string;
  /** Node type name of the current block (`paragraph`, `heading`, `list_item`, `table`, …). */
  blockType: string;
  readonly: boolean;
  /** Replaces the selection with plain text. */
  insertText: (text: string) => void;
};

export type HostContextMenuItem = {
  id: string;
  label: string;
  shortcut?: string;
  /** Shown only when this returns true (default: always). */
  when?: (context: ContextMenuContext) => boolean;
  run: (context: ContextMenuContext) => void;
};

export const hostItems = new Map<string, HostContextMenuItem>();

/**
 * Adds (or replaces, by id) a host item shown in a last group of every context menu.
 *
 * @param item - The item
 * @returns A function that removes it
 */
export function registerContextMenuItem(item: HostContextMenuItem): () => void {
  hostItems.set(item.id, item);
  return () => {
    if (hostItems.get(item.id) === item) hostItems.delete(item.id);
  };
}

