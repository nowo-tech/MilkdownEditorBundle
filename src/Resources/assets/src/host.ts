/**
 * Host references (1.9, ME-5): values such as `host-file:<id>` that a host stores instead of URLs, for the schemes
 * of `markdown.host_schemes` (sent as `hostSchemes`). The editor builds URLs from the same templates as the PHP
 * renderer's default resolver (`HostSchemes.php`): `image` for `<img src>`, `file` for links and file cards, `preview`
 * for previews. An id is 1–200 characters of `[A-Za-z0-9._~-]`, without a leading dot, URL-encoded into the template; a value of an
 * allow-listed scheme that is not a valid reference stays inert (no request, no link).
 */
import { safeUrl } from './link-titles';

export type HostTemplates = { image: string | null; file: string | null; preview: string | null };
export type HostSchemes = Record<string, HostTemplates>;
export type HostKind = keyof HostTemplates;

/** ASCII whitespace only, like PHP's `\s` without `/u` (audit GX-I6). */
const SCHEME = /^[ \t\n\v\f\r]*([a-z][a-z0-9+.-]{0,30}):/i;
/** Never a leading dot (`..` would walk up the template's path, `.env` is a hidden file). */
const REFERENCE = /^[ \t\n\v\f\r]*([a-z][a-z0-9+.-]{0,30}):([A-Za-z0-9_~-][A-Za-z0-9._~-]{0,199})[ \t\n\v\f\r]*$/i;
export const RESERVED = new Set(['http', 'https', 'javascript', 'vbscript', 'data', 'file', 'blob', 'about', 'mailto', 'tel', 'ftp', 'ws', 'wss', 'view-source', 'filesystem', 'jar']);

/** A template the browser may request: a path with one leading `/`, or an http(s) URL, with `{id}` after the first `/` of the path (never in the authority). */
const isTemplate = (value: unknown): value is string =>
  typeof value === 'string' && value.length <= 500 && /^(?:\/(?![/\\])|https?:\/\/[^/?#{}\\]+\/).*\{id\}/is.test(value);

/** Validates the `hostSchemes` option (what the PHP configuration already checked). */
export function parseHostSchemes(value: unknown): HostSchemes {
  const out: HostSchemes = {};
  if (!value || typeof value !== 'object' || Array.isArray(value)) return out;
  for (const [scheme, raw] of Object.entries(value as Record<string, unknown>)) {
    if (!/^[a-z][a-z0-9+.-]{0,30}$/.test(scheme) || RESERVED.has(scheme) || !raw || typeof raw !== 'object') continue;
    const t = raw as Record<string, unknown>;
    out[scheme] = {
      image: isTemplate(t.image) ? t.image : null,
      file: isTemplate(t.file) ? t.file : null,
      preview: isTemplate(t.preview) ? t.preview : null,
    };
  }
  return out;
}

/** Whether a value uses an allow-listed scheme (valid reference or not). */
export function isHostUrl(value: unknown, schemes: HostSchemes): boolean {
  if (typeof value !== 'string') return false;
  const m = SCHEME.exec(value);
  return !!m && Object.prototype.hasOwnProperty.call(schemes, m[1]!.toLowerCase());
}

/** The `scheme:id` reference of a value, or null. */
export function hostReference(value: unknown, schemes: HostSchemes): string | null {
  if (typeof value !== 'string') return null;
  const m = REFERENCE.exec(value);
  if (!m) return null;
  const scheme = m[1]!.toLowerCase();
  return Object.prototype.hasOwnProperty.call(schemes, scheme) ? `${scheme}:${m[2]}` : null;
}

/**
 * The URL of a host reference for `kind` (`image` falls back to `file`).
 *
 * @returns The URL; null for a host value that cannot be resolved (inert); undefined when `value` is no host value
 */
export function hostUrl(value: unknown, kind: HostKind, schemes: HostSchemes): string | null | undefined {
  if (!isHostUrl(value, schemes)) return undefined;
  const reference = hostReference(value, schemes);
  if (!reference) return null;
  const [scheme, id] = reference.split(/:(.*)/s) as [string, string];
  const templates = schemes[scheme]!;
  const template = templates[kind] ?? (kind === 'image' ? templates.file : null);
  return template ? safeUrl(template.split('{id}').join(encodeURIComponent(id))) || null : null;
}

/**
 * A target the browser may open: a host value resolved through its template, else `safeUrl()`.
 *
 * @returns The URL, or '' (unsafe, or a host value without a template)
 */
export function targetUrl(value: unknown, kind: HostKind, schemes: HostSchemes): string {
  const host = hostUrl(value, kind, schemes);
  return host === undefined ? safeUrl(value) : (host ?? '');
}
