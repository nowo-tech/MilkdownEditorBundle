/**
 * Heading slugs (1.6, contract section 13), shared by the `heading_ids` plugin and the editor's default heading ids:
 * the same algorithm as the PHP `HeadingIds`. Every editor heading id is prefixed with `nowo-h-`, so a heading never
 * clobbers a host element id (for example a comments drawer) or a global (audit DW-M2).
 */

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

