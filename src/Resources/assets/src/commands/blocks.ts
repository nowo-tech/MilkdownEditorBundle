/**
 * Block commands shared by the context menu and the block menu: the "current block" around the selection, turn
 * into, duplicate, delete and move up / down. Pure ProseMirror transactions (one per action, so undo and Yjs see
 * one step).
 */
import { lift, setBlockType, wrapIn } from '@milkdown/kit/prose/commands';
import { wrapInList } from '@milkdown/kit/prose/schema-list';
import { Fragment, Slice, type Node as ProseNode, type Schema } from '@milkdown/kit/prose/model';
import { NodeSelection, Selection, TextSelection, type EditorState, type Transaction } from '@milkdown/kit/prose/state';
import type { EditorView } from '@milkdown/kit/prose/view';

export type Dispatch = (tr: Transaction) => void;

/** The block the actions apply to: its position, node and depth. */
export type BlockRange = { pos: number; node: ProseNode; depth: number };

/**
 * The block around the selection: the innermost list item, otherwise the top-level child of the document
 * (a table, a callout, a code block or a paragraph). A node selection of a top-level node is that node.
 *
 * @param state - The editor state
 * @returns The block, or null for an empty document position (never for a valid selection)
 */
export function currentBlock(state: EditorState): BlockRange | null {
  const { selection } = state;
  if (selection instanceof NodeSelection && selection.$from.depth === 0) {
    return { pos: selection.from, node: selection.node, depth: 1 };
  }
  const $from = selection.$from;
  for (let d = $from.depth; d > 0; d--) {
    if ($from.node(d).type.name === 'list_item') return { pos: $from.before(d), node: $from.node(d), depth: d };
  }
  if ($from.depth < 1) return null;
  return { pos: $from.before(1), node: $from.node(1), depth: 1 };
}

/** Kinds of the *Turn into* submenu (the same ids as the `/` menu). */
export const TURN_INTO = ['text', 'h1', 'h2', 'h3', 'bullet_list', 'ordered_list', 'task_list', 'quote', 'code'] as const;
export type TurnInto = (typeof TURN_INTO)[number];

/**
 * Turns the selected block into another kind.
 *
 * @param kind - Target kind
 * @returns A ProseMirror command
 */
export function turnInto(kind: TurnInto) {
  return (state: EditorState, dispatch?: Dispatch): boolean => {
    const nodes = state.schema.nodes;
    switch (kind) {
      case 'text':
        if (setBlockType(nodes.paragraph!)(state, dispatch)) return true;
        return lift(state, dispatch);
      case 'h1':
      case 'h2':
      case 'h3':
        return setBlockType(nodes.heading!, { level: Number(kind.slice(1)) })(state, dispatch);
      case 'code':
        return setBlockType(nodes.code_block!, { language: '' })(state, dispatch);
      case 'quote':
        return wrapIn(nodes.blockquote!)(state, dispatch);
      case 'bullet_list':
        return wrapInList(nodes.bullet_list!)(state, dispatch);
      case 'ordered_list':
        return wrapInList(nodes.ordered_list!)(state, dispatch);
      case 'task_list':
        return wrapInList(nodes.bullet_list!)(state, (tr) => {
          // Mark the new list item as a task (GFM `* [ ]`).
          const $from = tr.selection.$from;
          for (let d = $from.depth; d > 0; d--) {
            const node = $from.node(d);
            if (node.type.name === 'list_item') {
              tr.setNodeMarkup($from.before(d), undefined, { ...node.attrs, checked: false });
              break;
            }
          }
          dispatch?.(tr);
        });
    }
  };
}

/** Places the cursor at the start of the block at `pos` (inside its first textblock when there is one). */
function cursorInto(tr: Transaction, pos: number): Transaction {
  const $pos = tr.doc.resolve(Math.min(pos + 1, tr.doc.content.size));
  return tr.setSelection(TextSelection.near($pos));
}

/** Duplicates the current block below itself; the cursor moves into the copy. */
export function duplicateBlock(state: EditorState, dispatch?: Dispatch): boolean {
  const block = currentBlock(state);
  if (!block) return false;
  if (dispatch) {
    const at = block.pos + block.node.nodeSize;
    const tr = state.tr.insert(at, block.node.copy(block.node.content));
    dispatch(cursorInto(tr, at).scrollIntoView());
  }
  return true;
}

/** Deletes the current block; an only top-level block becomes an empty paragraph. */
export function deleteBlock(state: EditorState, dispatch?: Dispatch): boolean {
  const block = currentBlock(state);
  if (!block) return false;
  if (dispatch) {
    const tr = state.tr;
    const parent = tr.doc.resolve(block.pos).parent;
    if (parent.childCount === 1 && block.depth === 1) {
      tr.replaceWith(block.pos, block.pos + block.node.nodeSize, state.schema.nodes.paragraph!.create());
    } else if (parent.childCount === 1) {
      // The only item of a list: remove the list.
      const $pos = tr.doc.resolve(block.pos);
      tr.delete($pos.before(), $pos.after());
    } else {
      tr.delete(block.pos, block.pos + block.node.nodeSize);
    }
    // Like Notion: the cursor goes to the end of the previous block (or the start of the next one).
    const $at = tr.doc.resolve(Math.min(block.pos, tr.doc.content.size));
    dispatch(tr.setSelection(Selection.near($at, -1)).scrollIntoView());
  }
  return true;
}

/**
 * Moves the current block one place up or down among its siblings (list items inside their list).
 *
 * @param direction - -1 up, 1 down
 * @returns A ProseMirror command (false at the edge)
 */
export function moveBlock(direction: -1 | 1) {
  return (state: EditorState, dispatch?: Dispatch): boolean => {
    const block = currentBlock(state);
    if (!block) return false;
    const $pos = state.doc.resolve(block.pos);
    const index = $pos.index();
    const parent = $pos.parent;
    const target = index + direction;
    if (target < 0 || target >= parent.childCount) return false;
    if (dispatch) {
      const sibling = parent.child(target);
      const offset = state.selection.from - block.pos;
      const start = direction === -1 ? block.pos - sibling.nodeSize : block.pos;
      const end = direction === -1 ? block.pos + block.node.nodeSize : block.pos + block.node.nodeSize + sibling.nodeSize;
      const pair = direction === -1 ? Fragment.from([block.node, sibling]) : Fragment.from([sibling, block.node]);
      const tr = state.tr.replaceWith(start, end, pair);
      const newPos = direction === -1 ? start : start + sibling.nodeSize;
      const $sel = tr.doc.resolve(Math.min(newPos + offset, tr.doc.content.size));
      dispatch(tr.setSelection(TextSelection.near($sel)).scrollIntoView());
    }
    return true;
  };
}

/**
 * Plain-text paste: one paragraph per line (no Markdown parsing), or inline text for a single line.
 *
 * @param text - Clipboard text
 * @param schema - The editor schema
 * @returns The transaction builder
 */
export function insertPlainText(text: string, schema: Schema) {
  return (state: EditorState, dispatch?: Dispatch): boolean => {
    const lines = text.replace(/\r\n?/g, '\n').split('\n');
    if (dispatch) {
      if (lines.length === 1) dispatch(state.tr.insertText(lines[0]!).scrollIntoView());
      else {
        // An open slice of paragraphs: the first and last lines join the paragraph around the cursor.
        const paragraphs = lines.map((line) => schema.nodes.paragraph!.create(null, line ? schema.text(line) : null));
        dispatch(state.tr.replaceSelection(new Slice(Fragment.from(paragraphs), 1, 1)).scrollIntoView());
      }
    }
    return true;
  };
}

/**
 * Runs a menu command on the selection the menu was opened for: while focus is in a menu, something else on the page
 * (an extension, a script measuring text) may move the editor's selection; the command must not land elsewhere. When
 * the document itself changed meanwhile (a collaborator, a script) the command is not run: the menus close on a
 * document change, and a stale item must not act on positions of another document (CZ-I9.2).
 *
 * @param view - The editor view
 * @returns A runner bound to the current selection
 */
export function selectionRunner(view: EditorView): (command: (state: EditorState, dispatch?: Dispatch) => boolean) => void {
  const opened = view.state;
  const bookmark = opened.selection.getBookmark();
  return (command) => {
    if (view.state.doc !== opened.doc) return;
    if (!view.state.selection.eq(opened.selection)) view.dispatch(view.state.tr.setSelection(bookmark.resolve(view.state.doc)));
    command(view.state, view.dispatch);
    view.focus();
  };
}
