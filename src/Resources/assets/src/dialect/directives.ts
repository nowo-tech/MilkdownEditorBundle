/**
 * Directive helpers of the FR-075 dialect (`remark-directive` syntax):
 *
 *   :::callout{type=info|success|warning|danger}   container (rendered as a note)
 *   :::details{summary="…"}                        container (collapsible section)
 *   ::: {align=center}                             container without a name (alignment)
 *   :mark[text]{bg=<colour> text=<colour>}         text directive (background / text colour; legacy color= is bg)
 *   ::: {bg=<colour> text=<colour>}                container without a name (block colour, 1.3; with align=)
 *   ::name{…}                                      leaf directive kept as an embedded block (e.g. live host blocks)
 */
export const CALLOUT_TYPES = ['info', 'success', 'warning', 'danger'] as const;
export type CalloutType = (typeof CALLOUT_TYPES)[number];
export const ALIGNMENTS = ['left', 'center', 'right'] as const;
/** Named colours of the dialect (1.3: Notion's set), each a text and a background token; never raw CSS. */
export const COLORS = ['gray', 'brown', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'red'] as const;
export type Color = (typeof COLORS)[number];


const NAME = /^[a-z][a-z0-9-]{0,40}$/;
const KEY = /^[a-z][a-z0-9_-]{0,40}$/;

export const isDirectiveName = (value: string): boolean => NAME.test(value);

/** Keeps only safe attribute keys and string values (at most 20 attributes, 500 characters each). */
export function cleanAttributes(input: unknown): Record<string, string> {
  const out: Record<string, string> = {};
  if (!input || typeof input !== 'object') return out;
  let count = 0;
  for (const [key, value] of Object.entries(input as Record<string, unknown>)) {
    if (count >= 20 || !KEY.test(key) || value === null || value === undefined) continue;
    out[key] = String(value).slice(0, 500);
    count++;
  }
  return out;
}

export const calloutType = (attributes: Record<string, string>): CalloutType =>
  (CALLOUT_TYPES as readonly string[]).includes(attributes.type ?? '') ? (attributes.type as CalloutType) : 'info';

/** A palette colour, or null for anything else. */
export const colorOf = (value: string | undefined): Color | null => ((COLORS as readonly string[]).includes(value ?? '') ? (value as Color) : null);

/**
 * Background of a `:mark`: `bg=`, else the legacy `color=`, else yellow for a plain highlight; `none` when only a text
 * colour is set.
 */
export const markColor = (attributes: Record<string, string>): string =>
  colorOf(attributes.bg) ?? colorOf(attributes.color) ?? (colorOf(attributes.text) ? 'none' : 'yellow');

/** Text colour of a `:mark` or a coloured block, or null. */
export const textColor = (attributes: Record<string, string>): Color | null => colorOf(attributes.text);

/** Background of a coloured block (`::: {bg=…}`), or null. */
export const blockBackground = (attributes: Record<string, string>): Color | null => colorOf(attributes.bg);

export const alignment = (attributes: Record<string, string>): string =>
  (ALIGNMENTS as readonly string[]).includes(attributes.align ?? '') ? attributes.align! : 'left';

/** Stable JSON for node attributes (ProseMirror compares attrs by value). */
export const encodeAttributes = (attributes: Record<string, string>): string =>
  JSON.stringify(Object.fromEntries(Object.entries(attributes).sort(([a], [b]) => a.localeCompare(b))));

export function decodeAttributes(json: unknown): Record<string, string> {
  if (typeof json !== 'string' || json === '') return {};
  try {
    return cleanAttributes(JSON.parse(json));
  } catch {
    return {};
  }
}
