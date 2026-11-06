/**
 * Image attributes of the dialect (1.9, `image_block`, roadmap D9): `![alt](src "caption"){width=50% align=center}`.
 * The title is the caption; the attribute block follows the image directly. Width: `25%`, `50%`, `75%`, `100%` or
 * `<n>px` (16–2000); align: `left`, `center`, `right`. Only a block of these keys with valid values counts: anything
 * else stays text, so nothing an author wrote is lost. The PHP renderer (`ImageAttributes.php`) reads the same rules;
 * other Markdown tools show a plain image and the braces as text.
 */
import type { MdNode } from './remark-dialect';

export const IMAGE_ALIGNMENTS = ['left', 'center', 'right'] as const;
export const IMAGE_PERCENTS = ['25%', '50%', '75%', '100%'] as const;
export type ImageAttributes = { width: string; align: string };

/** A valid width or ''. */
export function imageWidth(value: unknown): string {
  const v = typeof value === 'string' ? value : '';
  if ((IMAGE_PERCENTS as readonly string[]).includes(v)) return v;
  const m = /^([1-9]\d{1,3})px$/.exec(v);
  return m && Number(m[1]) >= 16 && Number(m[1]) <= 2000 ? v : '';
}

/** A valid alignment or ''. */
export const imageAlign = (value: unknown): string => ((IMAGE_ALIGNMENTS as readonly string[]).includes(value as string) ? (value as string) : '');

/** One `key=value` (values are short, so the pattern is bounded). */
const PAIR = '(width|align)=(?:"([^"{}\\n]{1,20})"|([^\\s"{}]{1,20}))';
const BLOCK = new RegExp(`^\\{\\s*${PAIR}(?:\\s+${PAIR})?\\s*\\}`);

/**
 * Reads a block at the start of a text (the text right after an image).
 *
 * @returns The values and the block's length, or null when `text` does not start with a valid block
 */
export function imageAttributesPrefix(text: string): (ImageAttributes & { length: number }) | null {
  const m = BLOCK.exec(text);
  if (!m) return null;
  const out = { width: '', align: '', length: m[0].length };
  for (const [key, value] of [
    [m[1], m[2] ?? m[3]],
    [m[4], m[5] ?? m[6]],
  ] as [string | undefined, string | undefined][]) {
    if (key === 'width') {
      out.width = imageWidth(value);
      if (!out.width) return null;
    } else if (key === 'align') {
      out.align = imageAlign(value);
      if (!out.align) return null;
    }
  }
  return out;
}

/** The `{…}` block of an image, or '' without attributes. */
export function serialiseImageAttributes(attributes: Partial<ImageAttributes>): string {
  const parts: string[] = [];
  const width = imageWidth(attributes.width);
  const align = imageAlign(attributes.align);
  if (width) parts.push(`width=${width}`);
  if (align) parts.push(`align=${align}`);
  return parts.length ? `{${parts.join(' ')}}` : '';
}

/**
 * Moves the attribute block after an image into `image.data.nowoImage` (mdast), so the editor keeps it as node
 * attributes; the image's serialiser writes it back at the same place.
 */
export function liftImageAttributes(node: MdNode): void {
  const children = node.children;
  if (!children) return;
  for (let i = children.length - 2; i >= 0; i--) {
    const image = children[i]!;
    const next = children[i + 1]!;
    if (image.type !== 'image' || next.type !== 'text') continue;
    const read = imageAttributesPrefix(next.value ?? '');
    if (!read) continue;
    image.data = { ...(image.data ?? {}), nowoImage: { width: read.width, align: read.align } };
    const rest = (next.value ?? '').slice(read.length);
    if (rest === '') children.splice(i + 1, 1);
    else next.value = rest;
  }
  for (const child of children) liftImageAttributes(child);
}
