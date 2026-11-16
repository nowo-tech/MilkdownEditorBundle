/**
 * 1.18: the explicit heading id suffix, `## Install guide {#setup}` (Pandoc, kramdown, PHP Markdown Extra, Docusaurus).
 *
 * Only this form counts: spaces, then `{#` + an id + `}` at the very end of an ATX or setext heading's text, outside any
 * mark. A literal `{#x}` at the end of a heading is written `\{#x}`; the parser reads the source of the last text node,
 * so the escaped form stays text (the PHP `HeadingIdSuffixParser` follows the same rule). No other attribute.
 *
 * Parsing (a step of the dialect's remark transformer, before tokens are split) moves the id to the mdast heading
 * (`data.nowoHeadingId`) and, once tokens are split, gives every heading its resolved id (`data.nowoResolvedId`: the
 * explicit id, or the slug / lowest free `-N`; the first {@link MAX_IDS} headings). Serialising writes the suffix
 * verbatim through its own mdast node ({@link HEADING_ID_NODE}), so the writer never escapes it.
 */
import { ID_PATTERN, MAX_IDS, normaliseId, resolveIds } from '../plugins/heading-slug';
import type { MdNode } from './remark-dialect';

/** mdast node type of a written suffix (` {#id}`). */
export const HEADING_ID_NODE = 'nowoHeadingId';
/** mdast node type of an escaped literal suffix at the end of heading text (` \{#x}`). */
export const HEADING_ID_LITERAL_NODE = 'nowoHeadingIdLiteral';

/** A suffix at the end of a text value (RV-I1: a match starts only at the first space of a run, so it is linear). */
export const SUFFIX = new RegExp(`(?<![ \\t])[ \\t]+\\{#(${ID_PATTERN})\\}$`, 'u');

type Position = { start?: { offset?: number }; end?: { offset?: number } };

/**
 * Takes the suffix off one heading's last text child, when the source really ends with it.
 *
 * @param heading - An mdast heading
 * @param source - The Markdown the tree was parsed from (null: trust the text value)
 */
function takeSuffix(heading: MdNode, source: string | null): void {
  const children = heading.children ?? [];
  const last = children[children.length - 1];
  if (!last || last.type !== 'text' || typeof last.value !== 'string') return;
  const m = SUFFIX.exec(last.value);
  if (!m) return;
  const position = last.position as Position | undefined;
  const start = position?.start?.offset;
  const end = position?.end?.offset;
  if (source !== null && typeof start === 'number' && typeof end === 'number') {
    // `\{#x}` reads as the text `{#x}`: the source decides.
    const raw = source.slice(start, end);
    const inSource = SUFFIX.exec(raw);
    if (!inSource || inSource[1] !== m[1]) return;
  }
  const id = normaliseId(m[1]);
  if (id === '') return;
  last.value = last.value.slice(0, m.index);
  if (last.value === '') children.pop();
  heading.data = { ...(heading.data ?? {}), nowoHeadingId: id };
}

/**
 * Walks the tree: every heading's suffix becomes `data.nowoHeadingId` (before the dialect splits text).
 *
 * @param tree - The mdast root
 * @param source - The parsed Markdown, when known
 */
export function takeSuffixes(tree: MdNode, source: string | null): void {
  const walk = (node: MdNode): void => {
    if (node.type === 'heading') {
      takeSuffix(node, source);
      return;
    }
    if (node.type === 'code' || node.type === 'html') return;
    node.children?.forEach(walk);
  };
  walk(tree);
}

/**
 * The text of an mdast heading as its id sees it: text and inline code only (no mentions, page links or icons).
 *
 * @param node - An mdast node
 * @returns The text
 */
export function mdText(node: MdNode): string {
  if (node.type === 'text' || node.type === 'inlineCode') return typeof node.value === 'string' ? node.value : '';
  return (node.children ?? []).map(mdText).join('');
}

/**
 * Gives every heading its resolved id (`data.nowoResolvedId`), after the dialect split text into tokens.
 *
 * @param tree - The mdast root
 */
export function resolveHeadings(tree: MdNode): void {
  const headings: MdNode[] = [];
  const walk = (node: MdNode): void => {
    if (headings.length >= MAX_IDS) return;
    if (node.type === 'heading') {
      headings.push(node);
      return;
    }
    if (node.type === 'code' || node.type === 'html') return;
    node.children?.forEach(walk);
  };
  walk(tree);
  const ids = resolveIds(headings.map((h) => ({ text: mdText(h), explicit: String(h.data?.nowoHeadingId ?? '') })));
  headings.forEach((h, i) => {
    h.data = { ...(h.data ?? {}), nowoResolvedId: ids[i] };
  });
}

/** mdast → Markdown handlers of the two suffix nodes (verbatim; the leading space is never escaped). */
export const headingIdHandlers = {
  [HEADING_ID_NODE]: Object.assign((n: { id?: unknown }): string => {
    const id = normaliseId(n.id);
    return id ? ` {#${id}}` : '';
  }, { peek: () => ' ' }),
  [HEADING_ID_LITERAL_NODE]: Object.assign((n: { value?: unknown }): string => (typeof n.value === 'string' ? n.value : ''), { peek: () => ' ' }),
};

/**
 * The text before a literal suffix and the suffix written escaped (` \{#x}`), or null when `text` does not end with one.
 *
 * @param text - The last text of a heading
 * @returns `[head, escaped tail]` or null
 */
export function escapeLiteralSuffix(text: string): [string, string] | null {
  const m = SUFFIX.exec(text);
  if (!m) return null;
  const tail = text.slice(m.index);
  return [text.slice(0, m.index), tail.replace('{#', '\\{#')];
}
