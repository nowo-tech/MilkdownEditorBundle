/**
 * `heading_ids` (1.6): DOM ids on headings, the same slugs as the PHP renderer (`markdown.heading_ids`,
 * `HeadingIds`), prefixed with `nowo-h-` so a heading never clobbers a host element id or a global. Node
 * decorations only: nothing is stored in the Markdown.
 */
import { Plugin, PluginKey, type EditorState } from '@milkdown/kit/prose/state';
import { Decoration, DecorationSet } from '@milkdown/kit/prose/view';
import { $prose } from '@milkdown/kit/utils';

export const HEADING_PREFIX = 'nowo-h-';
export const MAX_SLUG = 80;

/**
 * The slug of a heading text (contract section 13).
 *
 * @param text - The heading's text
 * @returns The slug (`section` when nothing is left)
 */
export function slug(text: string): string {
  const base = text.toLowerCase().replace(/[^\p{L}\p{M}\p{N}]+/gu, '-').replace(/^-+|-+$/g, '');
  const cut = [...base].slice(0, MAX_SLUG).join('').replace(/^-+|-+$/g, '');
  return cut === '' ? 'section' : cut;
}

/**
 * Unique slugs in document order (`-2`, `-3`, … for duplicates).
 *
 * @param texts - Heading texts
 * @returns The slugs
 */
export function slugs(texts: string[]): string[] {
  const used = new Set<string>();
  return texts.map((text) => {
    const base = slug(text);
    let candidate = base;
    for (let n = 2; used.has(candidate); n++) candidate = `${base}-${n}`;
    used.add(candidate);
    return candidate;
  });
}

/**
 * Heading ids of a document, by position.
 *
 * @param state - The editor state
 * @returns Position → id
 */
export function headingIds(state: EditorState): Map<number, string> {
  const found: { pos: number; text: string }[] = [];
  state.doc.descendants((node, pos) => {
    if (node.type.name === 'heading') found.push({ pos, text: node.textContent });
    return node.isBlock;
  });
  const ids = slugs(found.map((h) => h.text));
  return new Map(found.map((h, i) => [h.pos, HEADING_PREFIX + ids[i]!]));
}

export const headingIdsKey = new PluginKey<DecorationSet>('nowo-milkdown-heading-ids');

const build = (state: EditorState): DecorationSet =>
  DecorationSet.create(
    state.doc,
    [...headingIds(state)].map(([pos, id]) => Decoration.node(pos, pos + state.doc.nodeAt(pos)!.nodeSize, { id })),
  );

export const headingIdsPlugin = $prose(
  () =>
    new Plugin<DecorationSet>({
      key: headingIdsKey,
      state: {
        init: (_config, state) => build(state),
        apply: (tr, prev, _old, state) => (tr.docChanged ? build(state) : prev),
      },
      props: { decorations: (state) => headingIdsKey.getState(state) },
    }),
);
