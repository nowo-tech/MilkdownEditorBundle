/**
 * Directive helpers of the FR-075 dialect (`remark-directive` syntax):
 *
 *   :::callout{type=info|success|warning|danger}   container (rendered as a note)
 *   :::details{summary="…"}                        container (collapsible section)
 *   ::: {align=center}                             container without a name (alignment)
 *   :mark[text]{color=<token>}                     text directive (highlight)
 *   ::name{…}                                      leaf directive kept as an embedded block (e.g. live host blocks)
 */
export const CALLOUT_TYPES = ['info', 'success', 'warning', 'danger'] as const;
export type CalloutType = (typeof CALLOUT_TYPES)[number];
export const ALIGNMENTS = ['left', 'center', 'right'] as const;
export const MARK_COLORS = ['yellow', 'green', 'blue', 'red', 'purple', 'gray'] as const;

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

export const markColor = (attributes: Record<string, string>): string =>
  (MARK_COLORS as readonly string[]).includes(attributes.color ?? '') ? attributes.color! : 'yellow';

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
