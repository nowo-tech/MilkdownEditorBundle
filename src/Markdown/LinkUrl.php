<?php

declare(strict_types=1);

namespace Nowo\MilkdownEditorBundle\Markdown;

use function in_array;
use function preg_match;
use function str_contains;
use function strlen;
use function strtolower;

/**
 * 1.18: the check of a link target typed into the link picker (the editor runs the same rules in `ui/link-url.ts`);
 * hosts can run it on API input. The renderer's {@see DialectRenderer::safeUrl()} and the host's sanitizer stay the
 * final gates.
 *
 * Accepted: a relative path (`/x`, `./x`, `../x`), a `?query` or a `#fragment`; an absolute URL whose scheme is in the
 * allowed list (`http`, `https`, `mailto` by default; the list may only be narrowed). A bare host (`example.com/x`)
 * becomes `https://example.com/x`. Refused (`''`): any other scheme (`javascript:`, `data:`, `vbscript:`, `file:`…),
 * protocol-relative forms (`//`, `/\`, `\\`), control, bidi and white-space characters, user info (`user:pass@host`, a
 * phishing vector), an http(s) URL without a host, `mailto:` with a `?` header part, more than 2048 bytes.
 *
 * @author Héctor Franco Aceituno <hectorfranco@nowo.tech>
 */
final readonly class LinkUrl
{
    /** Schemes the picker may write (owner decision O5: no `tel`). */
    public const SCHEMES = ['http', 'https', 'mailto'];

    /** Longest accepted target, in bytes. */
    public const MAX_LENGTH = 2048;

    /**
     * The target to write, or `''` when it is refused.
     *
     * @param string $input What the person typed or pasted
     * @param list<string> $schemes Allowed schemes (a subset of {@see self::SCHEMES})
     */
    public static function check(string $input, array $schemes = self::SCHEMES): string
    {
        $url = DialectRenderer::cleanUrl($input);
        if ($url === '' || strlen($url) > self::MAX_LENGTH
            // C0 / C1 controls, white space, bidi and zero-width marks.
            || preg_match('/[\x{0000}-\x{0020}\x{007F}-\x{009F}\x{00A0}\x{1680}\x{2000}-\x{200F}\x{2028}-\x{202F}\x{205F}-\x{206F}\x{3000}\x{FEFF}]/u', $url) !== 0
            || preg_match('~^[\\\\/][\\\\/]~', $url) === 1) {
            return '';
        }
        if (preg_match('~^(?:/|\./|\.\./|\?|#)~', $url) === 1) {
            return $url;
        }
        if (preg_match('~^([a-z][a-z0-9+.-]*):(.*)$~is', $url, $m) === 1) {
            $scheme = strtolower($m[1]);
            if (!in_array($scheme, $schemes, true) || !in_array($scheme, self::SCHEMES, true)) {
                return '';
            }
            if ($scheme === 'mailto') {
                return !str_contains($m[2], '?') && preg_match('~^[^@/\\\\]+@[^@/\\\\]+$~', $m[2]) === 1 ? $url : '';
            }

            return self::hasCleanAuthority($m[2]) ? $url : '';
        }
        // A bare host: `example.com`, `example.com/path`.
        if (preg_match('~^[^/\\\\?#:@]+\.[^/\\\\?#:@]+(?:[/?#].*)?$~s', $url) === 1 && in_array('https', $schemes, true)) {
            return self::hasCleanAuthority('//' . $url) ? 'https://' . $url : '';
        }

        return '';
    }

    /** `//host[:port]` with a host and no user info (browsers end the authority at `/`, `\`, `?` or `#`). */
    private static function hasCleanAuthority(string $rest): bool
    {
        if (preg_match('~^//([^/\\\\?#]*)~', $rest, $m) !== 1) {
            return false;
        }

        return $m[1] !== '' && !str_contains($m[1], '@') && preg_match('~^[^:]+(?::\d{1,5})?$~', $m[1]) === 1;
    }
}
