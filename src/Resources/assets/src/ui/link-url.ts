/**
 * 1.18: the check of a link target typed into the link picker (the PHP `Markdown\LinkUrl::check()` runs the same rules;
 * the renderer's `safeUrl()` and the host's sanitizer stay the final gates).
 *
 * Accepted: a relative path (`/x`, `./x`, `../x`), a `?query` or a `#fragment`; an absolute URL whose scheme is allowed
 * (`http`, `https`, `mailto` by default; the field's `link_schemes` may only narrow it). A bare host (`example.com/x`)
 * becomes `https://example.com/x`. Refused: any other scheme (`javascript:`, `data:`, `vbscript:`, `file:`…),
 * protocol-relative forms (`//`, `/\`, `\\`), control, bidi and white-space characters, user info (`user:pass@host`, a
 * phishing vector), an http(s) URL without a host, `mailto:` with a `?` header part, more than 2048 bytes.
 */

export const LINK_SCHEMES = ['http', 'https', 'mailto'] as const;
export type LinkScheme = (typeof LINK_SCHEMES)[number];
export const MAX_URL = 2048;

/** Characters never allowed in a target: C0/C1 controls, white space, bidi and zero-width marks. */
// eslint-disable-next-line no-control-regex
const FORBIDDEN = /[\u{0}-\u{20}\u{7f}-\u{9f}\u{a0}\u{1680}\u{2000}-\u{200f}\u{2028}-\u{202f}\u{205f}-\u{206f}\u{3000}\u{feff}]/u;

export type CheckedUrl = { href: string; host: string };

/** The schemes of a field: the known ones it lists (empty or invalid: the defaults). */
export function linkSchemes(value: unknown): LinkScheme[] {
  const list = Array.isArray(value) ? LINK_SCHEMES.filter((s) => value.includes(s)) : [];
  return list.length ? list : [...LINK_SCHEMES];
}

/** `//host[:port]…` with a host and no user info (browsers end the authority at `/`, `\`, `?` or `#`). */
function cleanAuthority(rest: string): boolean {
  const m = /^\/\/([^/\\?#]*)/.exec(rest);
  if (!m || m[1] === '') return false;
  return !m[1]!.includes('@') && /^[^:]+(?::\d{1,5})?$/.test(m[1]!);
}

/** The host a person sees before following the link (punycode for an internationalised name). */
function hostOf(href: string): string {
  if (/^mailto:/i.test(href)) return href.slice(href.indexOf(':') + 1);
  try {
    return new URL(href).host;
  } catch {
    return '';
  }
}

/**
 * Checks a target.
 *
 * @param input - What the person typed or pasted
 * @param schemes - The allowed schemes
 * @returns The target to write and its host (empty for relative targets), or null when refused
 */
export function checkLinkUrl(input: string, schemes: readonly string[] = LINK_SCHEMES): CheckedUrl | null {
  // As the URL parser: leading / trailing C0 controls and spaces go, tabs and newlines inside go.
  // eslint-disable-next-line no-control-regex
  const url = input.replace(/[\t\n\r]/g, '').replace(/^[\u0000-\u0020\u007f]+|[\u0000-\u0020\u007f]+$/g, '');
  if (url === '' || new TextEncoder().encode(url).length > MAX_URL || FORBIDDEN.test(url) || /^[\\/][\\/]/.test(url)) return null;
  if (/^(?:\/|\.\/|\.\.\/|\?|#)/.test(url)) return { href: url, host: '' };
  const allowed = (s: string): boolean => schemes.includes(s) && (LINK_SCHEMES as readonly string[]).includes(s);
  const scheme = /^([a-z][a-z0-9+.-]*):([\s\S]*)$/i.exec(url);
  if (scheme) {
    const name = scheme[1]!.toLowerCase();
    const rest = scheme[2]!;
    if (!allowed(name)) return null;
    if (name === 'mailto') return !rest.includes('?') && /^[^@/\\]+@[^@/\\]+$/.test(rest) ? { href: url, host: hostOf(url) } : null;
    return cleanAuthority(rest) ? { href: url, host: hostOf(url) } : null;
  }
  if (/^[^/\\?#:@]+\.[^/\\?#:@]+(?:[/?#][\s\S]*)?$/.test(url) && allowed('https') && cleanAuthority(`//${url}`)) {
    const href = `https://${url}`;
    return { href, host: hostOf(href) };
  }
  return null;
}
