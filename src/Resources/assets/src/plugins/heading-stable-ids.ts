/**
 * 1.18 `stable_heading_ids` (a lazy chunk): heading ids that stay when the text changes (contract §1 Q2).
 *
 * An id is frozen (written into the heading's `id` attribute) only by the peer that caused it, in a local transaction
 * that joins the history step of the change that caused it (a blur or a caret move writes outside the history):
 *
 * - **On parse** (load, seed, Markdown paste): every heading gets its explicit or implicit id (`nodes/heading.ts`).
 * - **On leave**: when the local caret leaves a heading this peer edited and whose id is still empty (a new heading), or
 *   the editor loses the focus there, it gets its slug, made unique. The id comes from the finished text.
 * - **Normaliser**: after a local change (split, paste, drop), a heading that the change touched and whose id repeats
 *   another heading's gets a fresh id; the heading that existed before keeps its id (found through the mapping; on a
 *   split the left part keeps it), and a touched heading without an id gets one. Headings the change did not touch are
 *   never renamed: no peer rewrites another peer's ids. Duplicates that only a merge produced stay in the document and
 *   are removed at render time (the DOM decorations and the PHP renderer give later ones the next free `-N`).
 *
 * Transactions from the Yjs binding (remote changes, the binding's own re-renders) are never acted on. Attribute values
 * that come from peers are checked whenever they are read ({@link normaliseId}).
 */
import { Plugin, PluginKey, type EditorState, type Transaction } from '@milkdown/kit/prose/state';
import type { Node as PmNode } from '@milkdown/kit/prose/model';
import { Mapping } from '@milkdown/kit/prose/transform';
import type { EditorView } from '@milkdown/kit/prose/view';
import { $prose } from '@milkdown/kit/utils';
import { ySyncPluginKey } from 'y-prosemirror';
import { freeId, normaliseId } from './heading-slug';

export const stableIdsKey = new PluginKey<StableState>('nowo-milkdown-heading-stable-ids');

/** Meta of the transaction the editor's blur dispatches. */
export const BLUR = 'blur';

/** Whether the local caret's heading was edited by this peer since the caret entered it. */
export type StableState = { dirty: boolean };

type Found = { pos: number; node: PmNode };

/** The heading that contains a position, if any. */
export function headingAt(doc: PmNode, pos: number): Found | null {
  const $pos = doc.resolve(Math.max(0, Math.min(pos, doc.content.size)));
  for (let d = $pos.depth; d > 0; d--) {
    const node = $pos.node(d);
    if (node.type.name === 'heading') return { pos: $pos.before(d), node };
  }
  return null;
}

/** Every heading of a document, in order. */
export function headings(doc: PmNode): Found[] {
  const out: Found[] = [];
  doc.descendants((node, pos) => {
    if (node.type.name === 'heading') {
      out.push({ pos, node });
      return false;
    }
    return node.isBlock;
  });
  return out;
}

/** A transaction from the Yjs binding (a peer's change, or the binding re-rendering), or from this plugin. */
const foreign = (tr: Transaction): boolean => tr.getMeta(ySyncPluginKey) !== undefined || tr.getMeta(stableIdsKey) === 'own';

/** Ranges of the final document that the transactions changed. */
function changedRanges(trs: readonly Transaction[]): [number, number][] {
  let ranges: [number, number][] = [];
  for (const tr of trs) {
    for (const step of tr.steps) {
      const map = step.getMap();
      ranges = ranges.map(([from, to]) => [map.map(from, -1), map.map(to, 1)]);
      map.forEach((_oldStart, _oldEnd, newStart, newEnd) => {
        ranges.push([newStart, newEnd]);
      });
    }
  }
  return ranges;
}

const touches = (ranges: [number, number][], found: Found): boolean => {
  const end = found.pos + found.node.nodeSize;
  return ranges.some(([from, to]) => from <= end && to >= found.pos);
};

/**
 * The ids a local change must write: [position, id] pairs (normaliser, then the heading the caret left).
 *
 * @param trs - The transactions of one dispatch
 * @param oldState - The state before them
 * @param newState - The state after them
 * @returns The new ids by position (empty: nothing to do)
 */
export function idsToWrite(trs: readonly Transaction[], oldState: EditorState, newState: EditorState): Map<number, string> {
  const out = new Map<number, string>();
  if (trs.some(foreign)) return out;
  const blur = trs.some((tr) => tr.getMeta(stableIdsKey) === BLUR);
  const docChanged = trs.some((tr) => tr.docChanged);
  if (!docChanged && !blur && !trs.some((tr) => tr.selectionSet)) return out;
  const mapping = new Mapping();
  trs.forEach((tr) => mapping.appendMapping(tr.mapping));
  const now = headings(newState.doc);
  const ids = now.map((h) => normaliseId(h.node.attrs.id));
  const taken = new Set(ids.filter((id) => id !== ''));
  const caret = headingAt(newState.doc, newState.selection.head);

  if (docChanged) {
    const ranges = changedRanges(trs);
    // Headings that existed before, with their id, found through the mapping.
    const before = new Map<number, string>();
    for (const old of headings(oldState.doc)) {
      const id = normaliseId(old.node.attrs.id);
      const mapped = mapping.mapResult(old.pos, 1);
      if (id !== '' && !mapped.deleted) before.set(mapped.pos, id);
    }
    const groups = new Map<string, number[]>();
    ids.forEach((id, i) => {
      if (id !== '') groups.set(id, [...(groups.get(id) ?? []), i]);
    });
    for (const [id, members] of groups) {
      if (members.length < 2) continue;
      const existed = members.find((i) => before.get(now[i]!.pos) === id);
      const keeper = existed ?? members.find((i) => !touches(ranges, now[i]!)) ?? members[0]!;
      for (const i of members) {
        if (i === keeper || !touches(ranges, now[i]!)) continue;
        const fresh = freeId(now[i]!.node.textContent, taken);
        taken.add(fresh);
        out.set(now[i]!.pos, fresh);
      }
    }
    // Touched headings without an id (pasted or dropped HTML, a split's new part), except the one being typed.
    now.forEach((h, i) => {
      if (ids[i] !== '' || out.has(h.pos) || !touches(ranges, h) || h.node.textContent.trim() === '') return;
      if (caret && caret.pos === h.pos) return;
      const fresh = freeId(h.node.textContent, taken);
      taken.add(fresh);
      out.set(h.pos, fresh);
    });
  }

  // The heading this peer edited and the caret left (or the editor lost the focus in).
  const dirty = stableIdsKey.getState(oldState)?.dirty === true;
  let left: Found | null = null;
  if (blur) {
    left = caret;
  } else if (dirty) {
    const old = headingAt(oldState.doc, oldState.selection.head);
    const mapped = old ? mapping.mapResult(old.pos, 1) : null;
    if (mapped && !mapped.deleted && (!caret || caret.pos !== mapped.pos)) {
      const node = newState.doc.nodeAt(mapped.pos);
      left = node?.type.name === 'heading' ? { pos: mapped.pos, node } : null;
    }
  }
  if ((dirty || blur) && left && !out.has(left.pos) && normaliseId(left.node.attrs.id) === '' && left.node.textContent.trim() !== '') {
    out.set(left.pos, freeId(left.node.textContent, taken));
  }
  return out;
}

/**
 * The ProseMirror plugin (exported for tests that bind two Yjs documents without Milkdown's collab service).
 *
 * @returns The plugin
 */
export function createStableIdsPlugin(): Plugin<StableState> {
  return new Plugin<StableState>({
    key: stableIdsKey,
    state: {
      init: () => ({ dirty: false }),
      apply: (tr, prev, oldState, newState) => {
        if (tr.getMeta(ySyncPluginKey) !== undefined) return prev;
        if (tr.getMeta(stableIdsKey) === BLUR) return { dirty: false };
        const before = headingAt(oldState.doc, oldState.selection.head);
        const after = headingAt(newState.doc, newState.selection.head);
        const same = before !== null && after !== null && tr.mapping.map(before.pos, 1) === after.pos;
        let dirty = same ? prev.dirty : false;
        if (tr.docChanged && after && tr.getMeta(stableIdsKey) !== 'own' && touches(changedRanges([tr]), after)) dirty = true;
        return dirty === prev.dirty ? prev : { dirty };
      },
    },
    appendTransaction: (trs, oldState, newState) => {
      const write = idsToWrite(trs, oldState, newState);
      if (write.size === 0) return null;
      const tr = newState.tr;
      for (const [pos, id] of write) {
        const node = tr.doc.nodeAt(pos);
        if (node?.type.name === 'heading') tr.setNodeMarkup(pos, undefined, { ...node.attrs, id });
      }
      tr.setMeta(stableIdsKey, 'own');
      // RV-M1: after a local document change the ids join its history step (y-prosemirror puts `addToHistory` on the
      // whole Yjs transaction, so `false` would hide the person's own paste or Enter from undo). Only a blur or a
      // selection-only move writes outside the history.
      if (!trs.some((t) => t.docChanged && t.getMeta('addToHistory') !== false)) tr.setMeta('addToHistory', false);
      return tr;
    },
    view: (view: EditorView) => {
      const blur = (event: FocusEvent): void => {
        if (view.isDestroyed || (event.relatedTarget instanceof Node && view.dom.contains(event.relatedTarget))) return;
        if (stableIdsKey.getState(view.state)?.dirty !== true || !view.editable) return;
        view.dispatch(view.state.tr.setMeta(stableIdsKey, BLUR).setMeta('addToHistory', false));
      };
      view.dom.addEventListener('focusout', blur);
      return { destroy: () => view.dom.removeEventListener('focusout', blur) };
    },
  });
}

export const stableIdsPlugin = $prose(() => createStableIdsPlugin());
