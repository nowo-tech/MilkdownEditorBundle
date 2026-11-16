/**
 * 1.18: the heading node with stable ids. Its `id` attribute holds the bare id (no `nowo-h-` prefix):
 *
 * - **Markdown**: the `{#id}` suffix is read into the attribute and written back only when the id differs from the
 *   heading's slug (owner decision O1); a literal `{#x}` at the end of the text is written `\{#x}`.
 * - **DOM**: `id="nowo-h-<id>"`, or `nowo-h-<slug>` while the heading has no valid id.
 * - **Untrusted values**: a peer can write any string into the attribute; every reader validates it
 *   ({@link normaliseId}) and treats anything else as empty. Nothing is written back here.
 *
 * Without `stable_heading_ids` a heading keeps only the id its Markdown gave it (so a document without suffixes reads and
 * writes exactly as before) and pasted HTML ids are dropped; with it, every heading gets its explicit or implicit id when
 * it is parsed ({@link import('../plugins/heading-stable-ids')} keeps them unique and frozen while editing).
 */
import type { Ctx } from '@milkdown/kit/ctx';
import { headingAttr } from '@milkdown/kit/preset/commonmark';
import type { Fragment, Node as PmNode } from '@milkdown/kit/prose/model';
import type { NodeSchema } from '@milkdown/kit/transformer';
import { HEADING_ID_LITERAL_NODE, HEADING_ID_NODE, escapeLiteralSuffix } from '../dialect/heading-id';
import { HEADING_PREFIX, normaliseId, slug } from '../plugins/heading-slug';
import { runtimeCtx } from '../runtime';

/** Feature that freezes heading ids (opt-in). */
export const STABLE_IDS_FEATURE = 'stable_heading_ids';

const LEVELS = [1, 2, 3, 4, 5, 6];

/**
 * The id a heading writes as its `{#id}` suffix ('' for none): a valid id that differs from the slug of its text.
 * Without stable ids, a `nowo-h-…` attribute is the generated id of an older editor, never an explicit one.
 *
 * @param node - A heading node
 * @param stable - Whether `stable_heading_ids` is on
 * @returns The id to write, or ''
 */
export function suffixId(node: PmNode, stable: boolean): string {
  const raw: unknown = node.attrs.id;
  if (!stable && typeof raw === 'string' && raw.startsWith(HEADING_PREFIX)) return '';
  const id = normaliseId(raw);
  return id !== '' && id !== slug(node.textContent) ? id : '';
}

/**
 * The DOM id of a heading node (always prefixed and valid).
 *
 * @param node - A heading node
 * @returns `nowo-h-<id>`
 */
export const domId = (node: PmNode): string => HEADING_PREFIX + (normaliseId(node.attrs.id) || slug(node.textContent));

/**
 * Extends the commonmark preset's heading schema (`ctx.update(headingSchema.key, extendHeading)`).
 *
 * @param prev - The preset's schema factory
 * @returns The extended factory
 */
export function extendHeading(prev: (ctx: Ctx) => NodeSchema): (ctx: Ctx) => NodeSchema {
  return (ctx) => {
    const base = prev(ctx);
    const stable = (): boolean => ctx.get(runtimeCtx.key).features.has(STABLE_IDS_FEATURE);
    return {
      ...base,
      parseDOM: LEVELS.map((level) => ({
        tag: `h${level}`,
        // Pasted HTML: a valid id survives only with stable ids (an invalid one becomes empty, then implicit).
        getAttrs: (dom: HTMLElement | string) => ({ level, id: stable() && typeof dom !== 'string' ? normaliseId(dom.id) : '' }),
      })),
      toDOM: (node: PmNode) => [`h${node.attrs.level}`, { ...ctx.get(headingAttr.key)(node), id: domId(node) }, 0],
      parseMarkdown: {
        match: ({ type }) => type === 'heading',
        runner: (state, node, type) => {
          const data = (node.data ?? {}) as Record<string, unknown>;
          state.openNode(type, { level: node.depth as number, id: normaliseId(stable() ? data.nowoResolvedId : data.nowoHeadingId) });
          state.next(node.children);
          state.closeNode();
        },
      },
      toMarkdown: {
        match: (node) => node.type.name === 'heading',
        runner: (state, node) => {
          state.openNode('heading', undefined, { depth: node.attrs.level });
          let content: Fragment = node.content;
          // As the preset: a trailing hard break is not written.
          if (content.lastChild?.type.name === 'hardbreak') content = content.cut(0, content.size - content.lastChild.nodeSize);
          const last = content.lastChild;
          const literal = last && last.isText && last.marks.length === 0 ? escapeLiteralSuffix(last.text ?? '') : null;
          if (last && literal) {
            state.next(content.cut(0, content.size - last.nodeSize));
            if (literal[0] !== '') state.addNode('text', undefined, literal[0]);
            state.addNode(HEADING_ID_LITERAL_NODE, undefined, literal[1]);
          } else {
            state.next(content);
          }
          const id = suffixId(node, stable());
          if (id !== '') state.addNode(HEADING_ID_NODE, undefined, undefined, { id });
          state.closeNode();
        },
      },
    };
  };
}
