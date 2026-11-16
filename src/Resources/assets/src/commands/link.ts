/**
 * 1.18 `link_picker` (a lazy chunk): what the link button, `Mod-k`, `[[` and *Edit link* do with the picker.
 *
 * - Nothing to edit: a picked page becomes a `[[wiki:<uuid>#<id>]]` node at the selection; a picked URL links the
 *   selected text, or inserts the typed text (the URL when empty) as a link.
 * - A selected page link, or the caret in a link: the picker opens with its values and the pick replaces them.
 *
 * After a pick the widget emits `nowo-milkdown:link-picked` (`{kind: 'page' | 'url', pageId?, anchor?, href?}`, bubbles).
 */
import { NodeSelection, TextSelection, type EditorState } from '@milkdown/kit/prose/state';
import type { Mark, MarkType } from '@milkdown/kit/prose/model';
import type { EditorView } from '@milkdown/kit/prose/view';
import { isUuid } from '../dialect/patterns';
import { normaliseId } from '../plugins/heading-slug';
import type { Runtime } from '../runtime';
import { openLinkPickerUi, type FetchJson, type PickResult, type PickerInit } from '../ui/link-picker';

export const LINK_PICKED_EVENT = 'nowo-milkdown:link-picked';

/** What the picker needs from the field. */
export type LinkPickerSource = {
  root: HTMLElement;
  candidatesUrl: string | null;
  sectionsUrl: string | null;
  schemes: readonly string[];
  fetcher: FetchJson;
};

/** The whole link around `pos` in its textblock, or null. */
export function linkRange(state: EditorState, pos: number, type: MarkType): { from: number; to: number; mark: Mark } | null {
  const $pos = state.doc.resolve(pos);
  const ranges: { from: number; to: number; mark: Mark }[] = [];
  let at = $pos.start();
  $pos.parent.forEach((child) => {
    const mark = type.isInSet(child.marks);
    const last = ranges[ranges.length - 1];
    if (mark && last && last.to === at && last.mark.eq(mark)) last.to = at + child.nodeSize;
    else if (mark) ranges.push({ from: at, to: at + child.nodeSize, mark });
    at += child.nodeSize;
  });
  return ranges.find((r) => r.from <= pos && pos <= r.to) ?? null;
}

type Target =
  | { kind: 'ref'; pos: number; pageId: string; anchor: string }
  | { kind: 'link'; from: number; to: number; href: string }
  | { kind: 'new'; from: number; to: number };

/** What the picker edits at the current selection. */
export function editTarget(state: EditorState): Target {
  const sel = state.selection;
  if (sel instanceof NodeSelection && sel.node.type.name === 'wikiRef') {
    return { kind: 'ref', pos: sel.from, pageId: String(sel.node.attrs.pageId), anchor: normaliseId(sel.node.attrs.anchor) };
  }
  const type = state.schema.marks.link;
  const range = type && sel.empty ? linkRange(state, sel.head, type) : null;
  if (range) return { kind: 'link', from: range.from, to: range.to, href: String(range.mark.attrs.href ?? '') };
  return { kind: 'new', from: sel.from, to: sel.to };
}

/**
 * Writes a pick into the document.
 *
 * @param view - The editor
 * @param target - What was edited (from {@link editTarget}, mapped by the caller when needed)
 * @param result - The pick
 * @returns Whether the document changed
 */
export function applyPick(view: EditorView, target: Target, result: PickResult): boolean {
  const { state } = view;
  const { schema } = state;
  let tr = state.tr;
  if (result.kind === 'page') {
    const type = schema.nodes.wikiRef;
    if (!type || !isUuid(result.pageId)) return false;
    const attrs = { pageId: result.pageId, anchor: normaliseId(result.anchor) };
    if (target.kind === 'ref' && state.doc.nodeAt(target.pos)?.type === type) {
      tr = tr.setNodeMarkup(target.pos, undefined, attrs).setSelection(NodeSelection.create(tr.doc, target.pos));
    } else {
      const from = target.kind === 'link' ? target.from : target.kind === 'new' ? target.from : target.pos;
      const to = target.kind === 'link' ? target.to : target.kind === 'new' ? target.to : target.pos;
      tr = tr.replaceWith(from, to, type.create(attrs)).insertText(' ', from + 1);
      tr = tr.setSelection(TextSelection.create(tr.doc, from + 2));
    }
  } else {
    const type = schema.marks.link;
    if (!type) return false;
    const mark = type.create({ href: result.href, title: null });
    if (target.kind === 'link') {
      tr = tr.removeMark(target.from, target.to, type).addMark(target.from, target.to, mark);
    } else if (target.kind === 'new' && target.from !== target.to) {
      tr = tr.addMark(target.from, target.to, mark);
    } else {
      const at = target.kind === 'new' ? target.from : target.pos;
      const text = result.text !== '' ? result.text : result.href;
      tr = tr.insert(at, schema.text(text, [mark]));
      tr = tr.setSelection(TextSelection.create(tr.doc, at + text.length)).removeStoredMark(type);
    }
  }
  view.dispatch(tr.scrollIntoView());
  return true;
}

/**
 * Opens the picker at the selection.
 *
 * @param view - The editor
 * @param runtime - Its runtime
 * @param source - The field's endpoints and schemes
 * @param init - Initial values (the `[[` trigger opens on the page tab)
 * @param onCancel - Called when the picker closes without a pick
 */
export async function openLinkPicker(view: EditorView, runtime: Runtime, source: LinkPickerSource, init: PickerInit = {}, onCancel?: () => void): Promise<void> {
  if (view.isDestroyed || !view.editable) return;
  const target = editTarget(view.state);
  const start: PickerInit = { ...init };
  if (target.kind === 'ref') {
    const info = await runtime.resolvePage(target.pageId);
    if (view.isDestroyed) return;
    Object.assign(start, { tab: 'page', pageId: target.pageId, anchor: target.anchor, text: info.visible ? info.title : '' });
  } else if (target.kind === 'link') {
    Object.assign(start, { tab: 'url', href: target.href });
  }
  const host = (view.dom.closest('.nowo-milkdown') as HTMLElement | null) ?? document.body;
  const at = view.coordsAtPos(view.state.selection.from);
  const doc = view.state.doc;
  openLinkPickerUi({
    host,
    runtime,
    x: at.left,
    y: at.bottom + 4,
    candidatesUrl: source.candidatesUrl,
    sectionsUrl: source.sectionsUrl,
    schemes: source.schemes,
    withText: target.kind === 'new' && target.from === target.to,
    init: start,
    fetcher: source.fetcher,
    onPick: (result) => {
      view.focus();
      // The document may have changed meanwhile (a peer): only a still-valid target is edited.
      const still = view.state.doc.eq(doc) ? target : editTarget(view.state);
      if (!applyPick(view, still, result)) return;
      const detail = result.kind === 'page' ? { kind: 'page', pageId: result.pageId, anchor: result.anchor } : { kind: 'url', href: result.href };
      source.root.dispatchEvent(new CustomEvent(LINK_PICKED_EVENT, { bubbles: true, detail }));
    },
    onClose: (restore) => {
      if (restore) view.focus();
      onCancel?.();
    },
  });
}
