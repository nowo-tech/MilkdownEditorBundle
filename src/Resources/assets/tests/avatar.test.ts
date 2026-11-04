import { describe, expect, it } from 'vitest';
import { AVATAR_SIZE, avatarElement, avatarFailed, MAX_AVATAR_URL_BYTES, safeAvatarUrl } from '../src/comments/avatar';
import { parseComment, parseThreadDetail } from '../src/comments/client';

// The avatar contract v1.1 §3.1 list (shared with the PHP policies of the other bundles).
const ACCEPTED: [string, string][] = [
  ['https URL', 'https://cdn.example.com/u/42.png'],
  ['https upper-case scheme', 'HTTPS://cdn.example.com/a.png'],
  ['https with port, query and fragment', 'https://cdn.example.com:8443/a.png?s=64#x'],
  ['same-origin path', '/files/0b5c/s64'],
  ['root path', '/'],
  ['path with a query', '/files/a?v=2'],
  ['exactly 2048 bytes', `/${'a'.repeat(MAX_AVATAR_URL_BYTES - 1)}`],
  ['exactly 2048 bytes with two-byte characters', `/${'é'.repeat(1023)}a`],
  ['IPv4 host', 'https://192.0.2.1/a.png'],
  ['five-digit port', 'https://cdn.example.com:65535/a.png'],
  ['percent-encoded quote', '/files/a%22b.png'],
];

const REJECTED: [string, unknown][] = [
  ['http', 'http://cdn.example.com/a.png'],
  ['javascript', 'javascript:alert(1)'],
  ['javascript, mixed case', 'JaVaScRiPt:alert(1)'],
  ['vbscript', 'vbscript:msgbox(1)'],
  ['data image', 'data:image/png;base64,iVBORw0KGgo='],
  ['data svg', 'data:image/svg+xml,<svg onload=alert(1)>'],
  ['blob', 'blob:https://example.com/0b5c'],
  ['file', 'file:///etc/passwd'],
  ['ftp', 'ftp://example.com/a.png'],
  ['protocol-relative', '//evil.example.com/a.png'],
  ['slash backslash', '/\\evil.example.com/a.png'],
  ['backslash anywhere', '/files\\a.png'],
  ['https with backslash', 'https:\\\\evil.example.com/a.png'],
  ['userinfo', 'https://good@evil.example.com/a.png'],
  ['user and password', 'https://u:p@evil.example.com/a.png'],
  ['empty userinfo', 'https://@evil.example.com/a.png'],
  ['https without authority', 'https://'],
  ['https with an invalid host', 'https://[bad/a.png'],
  ['https with only a path after the slashes', 'https://?a=1'],
  ['https without host', 'https:///a.png'],
  ['https without slashes', 'https:evil.example.com'],
  ['relative path', 'files/a.png'],
  ['dot relative path', './a.png'],
  ['parent relative path', '../a.png'],
  ['fragment only', '#a'],
  ['query only', '?a=1'],
  ['empty string', ''],
  ['leading space', ' https://cdn.example.com/a.png'],
  ['inner space', '/files/a b.png'],
  ['tab', '/files/a\t.png'],
  ['newline', 'https://cdn.example.com/a\n.png'],
  ['NUL', '/files/a\u0000.png'],
  ['DEL', '/files/a\u007f.png'],
  ['over 2048 bytes', `/${'a'.repeat(MAX_AVATAR_URL_BYTES)}`],
  ['over 2048 bytes in UTF-8 (multi-byte)', `/${'é'.repeat(1024)}`],
  ['null', null],
  ['number', 42],
  ['object', { href: '/a.png' }],
  // UiKit audit DZ-L1 / DZ-L2 / DZ-I1: the shared provider.
  ['trailing line feed (path)', '/files/a/s64\n'],
  ['trailing line feed (https)', 'https://cdn.example/a\n'],
  ['2048 bytes plus a line feed', `/${'a'.repeat(MAX_AVATAR_URL_BYTES - 1)}\n`],
  ['CRLF', '/a\r\n'],
  ['double quote', '/a"/onerror="alert(1)'],
  ['single quote', "/a'b"],
  ['less-than', '/a<b'],
  ['greater-than', '/a>b'],
  ['backtick', '/a`b'],
  ['IPv6 literal', 'https://[::1]/a.png'],
  ['IPv6 literal with port', 'https://[2001:db8::1]:8443/a.png'],
  ['non-numeric port', 'https://h:abc/a.png'],
  ['empty port', 'https://h:/a.png'],
  ['six-digit port', 'https://h:443443/a.png'],
  ['port out of range', 'https://h:99999/a.png'],
  ['userinfo with port', 'https://a:443@evil.example/a.png'],
];

describe('safeAvatarUrl (avatar contract §3.1)', () => {
  it.each(ACCEPTED)('accepts %s', (_label, url) => {
    expect(safeAvatarUrl(url)).toBe(url);
  });

  it.each(REJECTED)('rejects %s', (_label, url) => {
    expect(safeAvatarUrl(url)).toBeNull();
  });

  it('is applied to comment authors and resolvedBy in host answers', () => {
    expect(parseComment({ id: 'c', author: { name: 'Ana', avatarUrl: 'http://x.example/a.png' } })?.author.avatarUrl).toBeNull();
    expect(parseComment({ id: 'c', author: { name: 'Ana', avatarUrl: 'data:image/png;base64,AAAA' } })?.author.avatarUrl).toBeNull();
    expect(parseComment({ id: 'c', author: { name: 'Ana', avatarUrl: '/files/1/s64' } })?.author.avatarUrl).toBe('/files/1/s64');
    const t = parseThreadDetail({ id: 't', anchor: null, resolved: true, count: 1, comments: [], resolvedBy: { name: 'Bo', avatarUrl: 'https://cdn.example.com/b.png' } });
    expect(t?.resolvedBy).toEqual({ name: 'Bo', avatarUrl: 'https://cdn.example.com/b.png' });
    const bad = parseThreadDetail({ id: 't', anchor: null, resolved: true, count: 1, comments: [], resolvedBy: { name: 'Bo', avatarUrl: '//evil.example.com/b.png' } });
    expect(bad?.resolvedBy).toEqual({ name: 'Bo', avatarUrl: null });
  });
});

describe('avatar bubble', () => {
  it('renders only the initial without a URL (or with a rejected one)', () => {
    for (const url of [null, 'javascript:alert(1)', 'http://x.example/a.png']) {
      const bubble = avatarElement('ana', '#336699', url);
      expect(bubble.className).toBe('nowo-milkdown-avatar');
      expect(bubble.getAttribute('aria-hidden')).toBe('true');
      expect(bubble.textContent).toBe('A');
      expect(bubble.querySelector('img')).toBeNull();
      expect(bubble.style.backgroundColor).toBe('rgb(51, 102, 153)');
    }
    // A colour that is not #rrggbb is ignored (CSSOM only, never an inline style string).
    expect(avatarElement('Bo', 'red;background:url(x)', null).style.backgroundColor).toBe('');
    expect(avatarElement('', null, null).textContent).toBe('?');
    expect(avatarElement('😀x', null, null).textContent).toBe('😀');
  });

  it('lays a lazy, same-origin-referrer picture over the initial, hidden initial once loaded', () => {
    const bubble = avatarElement('Ana', null, '/files/ok/s64');
    const img = bubble.querySelector('img')!;
    expect(bubble.classList.contains('has-image')).toBe(true);
    expect(bubble.textContent).toBe('A');
    expect(img.className).toBe('nowo-milkdown-avatar__image');
    expect(img.getAttribute('src')).toBe('/files/ok/s64');
    expect(img.getAttribute('alt')).toBe('');
    expect(img.getAttribute('loading')).toBe('lazy');
    expect(img.getAttribute('decoding')).toBe('async');
    expect(img.getAttribute('referrerpolicy')).toBe('same-origin');
    expect(img.getAttribute('width')).toBe(String(AVATAR_SIZE));
    expect(img.getAttribute('height')).toBe(String(AVATAR_SIZE));
    expect(img.getAttributeNames().some((n) => n.startsWith('on') || n === 'style' || n === 'crossorigin')).toBe(false);
    img.dispatchEvent(new Event('load'));
    expect(bubble.classList.contains('is-loaded')).toBe(true);
  });

  it('falls back to the initial on error and does not request a failed URL again on this page', () => {
    const url = 'https://cdn.example.com/broken.png';
    expect(avatarFailed(url)).toBe(false);
    const bubble = avatarElement('Ana', null, url);
    const img = bubble.querySelector('img')!;
    img.dispatchEvent(new Event('load'));
    img.dispatchEvent(new Event('error'));
    expect(bubble.querySelector('img')).toBeNull();
    expect(bubble.classList.contains('has-image')).toBe(false);
    expect(bubble.classList.contains('is-loaded')).toBe(false);
    expect(bubble.textContent).toBe('A');
    expect(avatarFailed(url)).toBe(true);
    // The next render of the same author shows the initial straight away.
    const again = avatarElement('Ana', null, url);
    expect(again.querySelector('img')).toBeNull();
    expect(again.classList.contains('has-image')).toBe(false);
    // Other URLs are unaffected.
    expect(avatarElement('Ana', null, 'https://cdn.example.com/other.png').querySelector('img')).not.toBeNull();
  });
});
