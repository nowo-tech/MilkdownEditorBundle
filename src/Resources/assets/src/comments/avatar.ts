/**
 * Comment avatars (1.6, avatar contract v1.1 §3.1 and §10.3): the URL policy and the bubble markup.
 *
 * The bubble always holds the initial; a picture that passes the policy is laid over it and removed again when it
 * fails to load (the URL is then remembered for the page lifetime and not requested again). No inline handlers and
 * no inline styles: listeners are attached with `addEventListener`, and the colour of the initial is set through the
 * CSSOM from a validated `#rrggbb`.
 */

/** Longest avatar URL accepted, in UTF-8 bytes. */
export const MAX_AVATAR_URL_BYTES = 2048;
/** Rendered size of the bubble (CSS px), also the `width` / `height` of the picture. */
export const AVATAR_SIZE = 24;

/** URLs that failed to load on this page (not retried until the page reloads). */
const failed = new Set<string>();

/**
 * Avatar URL policy. Accepts only `https://` URLs with a host and without userinfo, or a same-origin path starting
 * with exactly one `/`. Rejects every other scheme (`http:`, `javascript:`, `data:` including images, `blob:`, …),
 * protocol-relative `//` URLs, relative paths, backslashes, quotes, `<`, `>`, backticks, ASCII controls and spaces
 * (a trailing line feed included), IPv6 literals, invalid ports, and more than 2048 UTF-8 bytes.
 * `safeUrl()` stays the policy for links.
 *
 * @param input - Untrusted value from a host answer
 * @returns The URL unchanged, or null when rejected
 */
export function safeAvatarUrl(input: unknown): string | null {
  if (typeof input !== 'string' || input === '') return null;
  if (new TextEncoder().encode(input).length > MAX_AVATAR_URL_BYTES) return null;
  // Controls, spaces, backslashes, quotes, angle brackets and backticks (a valid URL has them percent-encoded).
  // eslint-disable-next-line no-control-regex -- controls and spaces are exactly what is rejected here
  if (/[\x00-\x20\x7f\\"'<>`]/.test(input)) return null;
  if (input.startsWith('/')) return input.startsWith('//') ? null : input;
  // A non-empty authority without userinfo, read from the raw string (the URL parser would repair `https:///x`):
  // a host name or IPv4 address (no IPv6 literal) and an optional port of 1–5 digits.
  const authority = /^https:\/\/([^/?#]+)/i.exec(input)?.[1];
  if (!authority || !/^[^@[\]:]+(?::\d{1,5})?$/.test(authority)) return null;
  let url: URL;
  try {
    url = new URL(input);
  } catch {
    return null;
  }
  return url.protocol === 'https:' && url.hostname !== '' && url.username === '' && url.password === '' ? input : null;
}

/**
 * Whether a URL already failed on this page.
 *
 * @param url - The avatar URL
 */
export const avatarFailed = (url: string): boolean => failed.has(url);

/**
 * A decorative avatar bubble (the author's name is printed beside it): the initial, with the picture over it when
 * the URL passes the policy and has not failed before on this page.
 *
 * @param name - Display name (its first character is the initial)
 * @param color - Validated `#rrggbb` background of the initial, or null for the theme accent
 * @param url - Avatar URL from the host, or null
 * @returns The `span.nowo-milkdown-avatar` element
 */
export function avatarElement(name: string, color: string | null, url: string | null): HTMLSpanElement {
  const bubble = document.createElement('span');
  bubble.className = 'nowo-milkdown-avatar';
  bubble.setAttribute('aria-hidden', 'true');
  bubble.textContent = Array.from(name)[0]?.toUpperCase() ?? '?';
  if (color && /^#[0-9a-f]{6}$/i.test(color)) bubble.style.backgroundColor = color;
  const src = safeAvatarUrl(url);
  if (!src || failed.has(src)) return bubble;
  const img = document.createElement('img');
  img.className = 'nowo-milkdown-avatar__image';
  img.setAttribute('alt', '');
  img.setAttribute('width', String(AVATAR_SIZE));
  img.setAttribute('height', String(AVATAR_SIZE));
  img.setAttribute('loading', 'lazy');
  img.setAttribute('decoding', 'async');
  img.setAttribute('referrerpolicy', 'same-origin');
  img.addEventListener('load', () => bubble.classList.add('is-loaded'), { once: true });
  img.addEventListener(
    'error',
    () => {
      failed.add(src);
      img.remove();
      bubble.classList.remove('has-image', 'is-loaded');
    },
    { once: true },
  );
  img.setAttribute('src', src);
  bubble.classList.add('has-image');
  bubble.append(img);
  return bubble;
}
