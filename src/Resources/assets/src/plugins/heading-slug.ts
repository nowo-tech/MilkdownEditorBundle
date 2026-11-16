/**
 * Heading slugs (1.6, contract section 13), shared by the `heading_ids` plugin and the editor's heading ids: the same
 * algorithm as the PHP `HeadingIds`. Every editor heading id is prefixed with `nowo-h-` in the DOM, so a heading never
 * clobbers a host element id (for example a comments drawer) or a global (audit DW-M2).
 *
 * 1.18: ids follow one grammar ({@link isHeadingId}, also the anchor of `[[wiki:<uuid>#<id>]]`); explicit ids (the
 * `{#id}` suffix, or a heading node's `id` attribute) are reserved first, then every other heading takes its slug or the
 * lowest free `-N` ({@link resolveIds}). The tests run the same vectors as PHPUnit (`tests/Fixtures/heading-ids.json`).
 */

export const HEADING_PREFIX = 'nowo-h-';
export const MAX_SLUG = 80;
/** 1.18: longest id, in characters. */
export const MAX_ID = 90;
/** 1.18: headings of one document that get an id. */
export const MAX_IDS = 1000;

/** 1.18: the canonical id grammar (with the `u` flag); the same as PHP `HeadingIds::ANCHOR`. */
export const ID_PATTERN = '[\\p{Ll}\\p{Lo}\\p{Lm}\\p{N}][\\p{Ll}\\p{Lo}\\p{Lm}\\p{M}\\p{N}]*(?:-[\\p{Ll}\\p{Lo}\\p{Lm}\\p{M}\\p{N}]+)*';
const ID_ONLY = new RegExp(`^(?:${ID_PATTERN})$`, 'u');

/**
 * The slug of a heading text (contract section 13; 1.18: NFC, and only characters the id grammar accepts).
 *
 * @param text - The heading's text
 * @returns The slug (`section` when nothing is left)
 */
export function slug(text: string): string {
  const base = text
    .normalize('NFC')
    .toLowerCase()
    .replace(/[^\p{Ll}\p{Lo}\p{Lm}\p{M}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/^[\p{M}-]+/u, '');
  const cut = [...base].slice(0, MAX_SLUG).join('').replace(/^-+|-+$/g, '');
  return cut === '' ? 'section' : cut;
}

/**
 * 1.18: whether a value is a valid bare id (1–90 characters of the grammar).
 *
 * @param value - A candidate id
 * @returns True when valid
 */
export function isHeadingId(value: unknown): value is string {
  return typeof value === 'string' && value !== '' && value.length <= MAX_ID * 2 && [...value].length <= MAX_ID && ID_ONLY.test(value);
}

/**
 * 1.18: the bare id of an untrusted value (a peer's node attribute, a token anchor, a pasted DOM id): a leading
 * `nowo-h-` is dropped and anything invalid gives `''`. A check when the value is read; nothing is written back.
 *
 * @param value - The value
 * @returns The bare id, or ''
 */
export function normaliseId(value: unknown): string {
  if (typeof value !== 'string') return '';
  const bare = value.startsWith(HEADING_PREFIX) ? value.slice(HEADING_PREFIX.length) : value;
  return isHeadingId(bare) ? bare : '';
}

/**
 * 1.18: unique ids in document order: valid explicit ids are reserved first (the first occurrence wins); every other
 * heading takes its slug (a repeated explicit id: its own value) or that value plus the lowest free `-N`. Linear.
 *
 * @param headings - Text and explicit id ('' for none) of each heading
 * @returns The ids
 */
export function resolveIds(headings: { text: string; explicit: string }[]): string[] {
  const used = new Set<string>();
  const explicit = new Map<number, string>();
  headings.forEach((h, i) => {
    const id = normaliseId(h.explicit);
    if (id !== '' && !used.has(id)) {
      used.add(id);
      explicit.set(i, id);
    }
  });
  const next = new Map<string, number>();
  return headings.map((h, i) => {
    const own = explicit.get(i);
    if (own !== undefined) return own;
    const id = normaliseId(h.explicit);
    const base = id !== '' ? id : slug(h.text);
    let candidate = base;
    while (used.has(candidate)) {
      const n = next.get(base) ?? 2;
      next.set(base, n + 1);
      candidate = `${base}-${n}`;
    }
    used.add(candidate);
    return candidate;
  });
}

/**
 * Unique slugs in document order (`-2`, `-3`, … for duplicates; no explicit ids).
 *
 * @param texts - Heading texts
 * @returns The slugs
 */
export function slugs(texts: string[]): string[] {
  return resolveIds(texts.map((text) => ({ text, explicit: '' })));
}

/**
 * 1.18: the first free id for a heading of `text` among `taken` ids (`slug`, then `slug-2`, …).
 *
 * @param text - The heading's text
 * @param taken - Ids already used in the document
 * @returns A free id
 */
export function freeId(text: string, taken: ReadonlySet<string>): string {
  const base = slug(text);
  let candidate = base;
  for (let n = 2; taken.has(candidate); n++) candidate = `${base}-${n}`;
  return candidate;
}
