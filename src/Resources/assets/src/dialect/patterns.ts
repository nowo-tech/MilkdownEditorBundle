/**
 * Inline tokens of the FR-075 Markdown dialect (shared by the remark plugin and the suggestion hook):
 *
 *   [[wiki:<uuid>]] / [[wiki:<uuid>#anchor]]   page link by id (title resolved per viewer)
 *   @handle                                    mention (needs start of text, whitespace or `(` before it: no e-mails)
 *   :tabler-<name>:                            Tabler icon from the committed sprite (allowlisted names only)
 *
 * The PHP renderer (`Nowo\MilkdownEditorBundle\Markdown`) uses the same expressions.
 */
export const UUID = '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}';
export const ANCHOR = '[a-z0-9][a-z0-9-]{0,80}';
export const HANDLE = '[a-zA-Z0-9_](?:[a-zA-Z0-9_.-]{0,38}[a-zA-Z0-9_])?';
export const ICON = '[a-z0-9]+(?:-[a-z0-9]+)*';

const TOKEN = new RegExp(`\\[\\[wiki:(${UUID})(?:#(${ANCHOR}))?\\]\\]|(^|[\\s(])@(${HANDLE})|:tabler-(${ICON}):`, 'g');
const UUID_ONLY = new RegExp(`^${UUID}$`);
const ANCHOR_ONLY = new RegExp(`^${ANCHOR}$`);
const HANDLE_ONLY = new RegExp(`^${HANDLE}$`);
const ICON_ONLY = new RegExp(`^${ICON}$`);

export const isUuid = (value: string): boolean => UUID_ONLY.test(value);
export const isAnchor = (value: string): boolean => value === '' || ANCHOR_ONLY.test(value);
export const isHandle = (value: string): boolean => HANDLE_ONLY.test(value);
export const isIconName = (value: string): boolean => ICON_ONLY.test(value);

export type WikiRefNode = { type: 'wikiRef'; pageId: string; anchor: string };
export type MentionNode = { type: 'mention'; handle: string };
export type TablerIconNode = { type: 'tablerIcon'; name: string };
export type TextNode = { type: 'text'; value: string };
export type InlineToken = WikiRefNode | MentionNode | TablerIconNode | TextNode;

/**
 * Splits one text value into text and dialect nodes (the core of the remark transformer).
 *
 * @param value - Text of one mdast text node
 * @returns Text and dialect nodes in source order
 */
export function splitText(value: string): InlineToken[] {
  const out: InlineToken[] = [];
  let last = 0;
  TOKEN.lastIndex = 0;
  for (let m = TOKEN.exec(value); m; m = TOKEN.exec(value)) {
    let start = m.index;
    let node: InlineToken;
    if (m[1]) {
      node = { type: 'wikiRef', pageId: m[1], anchor: m[2] ?? '' };
    } else if (m[4]) {
      start += m[3]!.length; // the whitespace or bracket before @ stays text
      node = { type: 'mention', handle: m[4] };
    } else {
      node = { type: 'tablerIcon', name: m[5]! };
    }
    if (start > last) out.push({ type: 'text', value: value.slice(last, start) });
    out.push(node);
    last = m.index + m[0].length;
  }
  if (last < value.length) out.push({ type: 'text', value: value.slice(last) });
  return out;
}

/** Markdown source of each dialect node (written verbatim, never escaped). */
export const serialise = {
  wikiRef: (n: { pageId: string; anchor?: string }): string => `[[wiki:${n.pageId}${n.anchor ? `#${n.anchor}` : ''}]]`,
  mention: (n: { handle: string }): string => `@${n.handle}`,
  tablerIcon: (n: { name: string }): string => `:tabler-${n.name}:`,
};
