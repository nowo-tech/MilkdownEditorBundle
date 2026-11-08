/**
 * Host references (1.9, ME-5): values such as `host-file:<id>` that a host stores instead of URLs, for the schemes
 * of `markdown.host_schemes` (sent as `hostSchemes`). The editor builds URLs from the same templates as the PHP
 * renderer's default resolver (`HostSchemes.php`): `image` for `<img src>`, `file` for links and file cards, `preview`
 * for previews. An id is 1–200 characters of `[A-Za-z0-9._~-]`, without a leading dot, URL-encoded into the template; a value of an
 * allow-listed scheme that is not a valid reference stays inert (no request, no link).
 *
 * 1.13: `markdown.host_url_patterns` (sent as `hostUrlPatterns`) make plain URLs host references too. A pattern with
 * `url: 'resolved'` shows the scheme's template URL, as for `scheme:` values; with `url: 'written'` (default) the editor
 * shows the author's URL as before (the renderer only uses the resolver to decide who sees it).
 */
import { safeUrl } from './link-titles';

export type HostTemplates = { image: string | null; file: string | null; preview: string | null };
export type HostSchemes = Record<string, HostTemplates>;
export type HostKind = keyof HostTemplates;
/** 1.13: one `host_url_patterns` entry, compiled. */
export type HostUrlPattern = { pattern: RegExp; scheme: string; url: 'written' | 'resolved' };

/** ASCII whitespace only, like PHP's `\s` without `/u` (audit GX-I6). */
const SCHEME = /^[ \t\n\v\f\r]*([a-z][a-z0-9+.-]{0,30}):/i;
/** Never a leading dot (`..` would walk up the template's path, `.env` is a hidden file). */
const REFERENCE = /^[ \t\n\v\f\r]*([a-z][a-z0-9+.-]{0,30}):([A-Za-z0-9_~-][A-Za-z0-9._~-]{0,199})[ \t\n\v\f\r]*$/i;
export const RESERVED = new Set(['http', 'https', 'javascript', 'vbscript', 'data', 'file', 'blob', 'about', 'mailto', 'tel', 'ftp', 'ws', 'wss', 'view-source', 'filesystem', 'jar']);

/** A template the browser may request: a path with one leading `/`, or an http(s) URL, with `{id}` after the first `/` of the path (never in the authority). */
const isTemplate = (value: unknown): value is string =>
  typeof value === 'string' && value.length <= 500 && /^(?:\/(?![/\\])|https?:\/\/[^/?#{}\\]+\/).*\{id\}/is.test(value);

/** 1.13: the URL patterns and own hosts of a `hostSchemes` object (see {@link withUrlPatterns}). */
const URL_PATTERNS = new WeakMap<HostSchemes, { patterns: HostUrlPattern[]; hosts: string[] }>();

/** The longest pattern and URL the renderer accepts (`Configuration::MAX_HOST_URL_PATTERN_LENGTH`, `HostSchemes::MAX_PATTERN_URL_LENGTH`). */
const MAX_PATTERN_LENGTH = 300;
const MAX_URL_LENGTH = 2048;
const ID = /^[A-Za-z0-9_~-][A-Za-z0-9._~-]{0,199}$/;

/**
 * Whether a pattern is in the subset PCRE and RegExp read the same way (what the PHP configuration checked): printable
 * ASCII without `#`, at most 300 characters, anchored with `^` and `$`, one `(?<id>…)` group, no other `(?` group and
 * only the escapes `\d \w \s` (and upper case) and of punctuation; no `(*` verb, no `[:` class, no top-level `|`.
 */
export function isHostUrlPattern(pattern: unknown): pattern is string {
  if (typeof pattern !== 'string' || pattern.length > MAX_PATTERN_LENGTH || !/^[\x20-\x7e]+$/.test(pattern) || pattern.includes('#')) return false;
  for (const m of pattern.matchAll(/\\([\s\S]?)/g)) if (m[1] === '' || !'dDwWsS./-_~+?*()[]{}|^$\\'.includes(m[1]!)) return false;
  const bare = pattern.replace(/\\[\s\S]/g, '');
  if (!bare.startsWith('^') || !bare.endsWith('$') || bare.split('(?<id>').length !== 2 || /\(\?(?!:|<id>)/.test(bare)) return false;
  if (['(*', '[:', '[]', '[^]'].some((t) => bare.includes(t)) || topLevelAlternation(bare)) return false;
  try {
    new RegExp(pattern);
    return true;
  } catch {
    return false;
  }
}

/** Whether a pattern without escapes has a `|` outside every group and character class (audit IJ-I1). */
function topLevelAlternation(bare: string): boolean {
  let depth = 0;
  let inClass = false;
  for (let i = 0; i < bare.length; i++) {
    const char = bare[i];
    if (inClass) {
      inClass = char !== ']';
    } else if (char === '[') {
      inClass = true;
    } else if (char === '(') {
      depth++;
    } else if (char === ')') {
      depth--;
    } else if (char === '|' && depth === 0) {
      return true;
    }
  }
  return false;
}

/** The literal start of a pattern, after `^` (`HostSchemes::literalPrefix()`). */
export function literalPrefix(pattern: string): string {
  let prefix = '';
  for (let i = 1; i < pattern.length; i++) {
    let char = pattern[i]!;
    if (char === '\\' && i + 1 < pattern.length && './-_~'.includes(pattern[i + 1]!)) {
      char = pattern[++i]!;
    } else if (!/[A-Za-z0-9/:_~-]/.test(char)) {
      break;
    }
    const next = pattern[i + 1] ?? '';
    if (next !== '' && '?*{'.includes(next)) break;
    prefix += char;
    if (next === '+') break;
  }
  return prefix;
}

/**
 * The string patterns are matched against (`HostSchemes::candidate()`, audit IJ-I3): no query or fragment, the path
 * percent-decoded once, uuids in lower case, and an absolute or protocol-relative URL of one of `hosts` (or of the page's
 * own host) read as its path.
 */
export function urlCandidate(value: string, hosts: string[] = []): string {
  let url = value.trim();
  url = url.slice(0, url.search(/[?#]/) === -1 ? url.length : url.search(/[?#]/));
  const m = /^(?:https?:)?\/\/([^/\\]*)(.*)$/is.exec(url);
  if (m) {
    const authority = m[1]!.toLowerCase();
    const own = typeof location !== 'undefined' ? location.host.toLowerCase() : '';
    if (authority !== '' && !authority.includes('@') && (hosts.includes(authority) || authority === own)) url = m[2] || '/';
  }
  try {
    url = decodeURIComponent(url);
  } catch {
    // Not valid percent-encoding: kept as written, like PHP's rawurldecode() would mostly do.
  }
  return url.replace(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi, (u) => u.toLowerCase());
}

/**
 * 1.13: `schemes` with the `hostUrlPatterns` option; invalid entries and entries of unknown schemes are dropped.
 *
 * @returns A copy of `schemes` that carries the patterns (the same object when there are none)
 */
export function withUrlPatterns(schemes: HostSchemes, value: unknown, hosts: unknown = []): HostSchemes {
  const patterns: HostUrlPattern[] = [];
  for (const raw of Array.isArray(value) ? value : []) {
    const entry = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
    const scheme = typeof entry.scheme === 'string' ? entry.scheme.toLowerCase() : '';
    if (!isHostUrlPattern(entry.pattern) || !Object.prototype.hasOwnProperty.call(schemes, scheme)) continue;
    patterns.push({ pattern: new RegExp(entry.pattern), scheme, url: entry.url === 'resolved' ? 'resolved' : 'written' });
  }
  if (!patterns.length) return schemes;
  const copy = { ...schemes };
  const own = Array.isArray(hosts) ? hosts.filter((h): h is string => typeof h === 'string').map((h) => h.toLowerCase()) : [];
  URL_PATTERNS.set(copy, { patterns, hosts: own });
  return copy;
}

/**
 * 1.13: the URL pattern a plain URL matches: its `scheme:id` reference (null when the id is not valid) and its mode.
 */
export function matchHostUrl(value: unknown, schemes: HostSchemes): { reference: string | null; url: 'written' | 'resolved' } | null {
  const config = URL_PATTERNS.get(schemes);
  if (!config || typeof value !== 'string') return null;
  const url = urlCandidate(value, config.hosts);
  if (url === '') return null;
  for (const entry of config.patterns) {
    // Audit IJ-L1: a URL over the bound that starts like a pattern is refused, never a plain link.
    if (url.length > MAX_URL_LENGTH) {
      if (url.startsWith(literalPrefix(entry.pattern.source))) return { reference: null, url: entry.url };
      continue;
    }
    const m = entry.pattern.exec(url);
    if (!m) continue;
    const id = m.groups?.id ?? '';
    return { reference: ID.test(id) ? `${entry.scheme}:${id}` : null, url: entry.url };
  }
  return null;
}

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
  let reference: string | null;
  if (isHostUrl(value, schemes)) {
    reference = hostReference(value, schemes);
  } else {
    // 1.13: a plain URL of a `url: 'resolved'` pattern; `written` ones stay the author's URL.
    const match = matchHostUrl(value, schemes);
    if (!match || match.url === 'written') return undefined;
    reference = match.reference;
  }
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
