/**
 * `heading_ids` (1.6): DOM ids on headings, the same slugs as the PHP renderer (`markdown.heading_ids`,
 * `HeadingIds`), prefixed with `nowo-h-` so a heading never clobbers a host element id or a global. Node
 * decorations only: nothing is stored in the Markdown.
 */
import { Plugin, PluginKey, type EditorState } from '@milkdown/kit/prose/state';
import { Decoration, DecorationSet } from '@milkdown/kit/prose/view';
import { $prose } from '@milkdown/kit/utils';
import { HEADING_PREFIX, slugs } from './heading-slug';

export { HEADING_PREFIX, MAX_SLUG, slug, slugs } from './heading-slug';

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
