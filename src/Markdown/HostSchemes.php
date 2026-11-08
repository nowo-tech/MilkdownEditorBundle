<?php

declare(strict_types=1);

namespace Nowo\MilkdownEditorBundle\Markdown;

use InvalidArgumentException;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RequestStack;

use function array_key_exists;
use function array_pop;
use function chr;
use function count;
use function explode;
use function get_debug_type;
use function hexdec;
use function implode;
use function in_array;
use function is_string;
use function ltrim;
use function preg_match;
use function preg_replace_callback;
use function rawurldecode;
use function rawurlencode;
use function rtrim;
use function sprintf;
use function str_contains;
use function str_ends_with;
use function str_replace;
use function str_starts_with;
use function strcspn;
use function strlen;
use function strpbrk;
use function strrpos;
use function strtolower;
use function substr;
use function trim;

/**
 * Host URL schemes (1.9, ME-5): references such as `host-file:<id>` that a host stores instead of URLs
 * (`![alt](host-file:9b1c…)`, `::file[name]{href="host-file:9b1c…"}`, `[name](host-file:9b1c…)`). Only the
 * allow-listed schemes are understood; each one has URL templates with `{id}`:
 *
 *   image   — the `<img src>` of an image (default: `file`)
 *   file    — the target of links and file cards (open / download)
 *   preview — the page embedded by a file card with `view="preview"` (null: no previews)
 *
 * An id is 1–200 characters of `[A-Za-z0-9._~-]`, without a leading dot (`..` would walk up the template's path), and is
 * URL-encoded into the template; anything else with an allow-listed scheme is not a valid reference and stays inert
 * (no link, no image). `host_image_origins` lists the other origins host images may load from while
 * `allow_remote_images` is off.
 *
 * 1.13: `host_url_patterns` make plain URLs host references too, so content written before the scheme existed
 * (`![plan](/files/<uuid>/preview)`) goes through the same resolver. Each pattern is anchored, has a named group `id`
 * and maps to a scheme of `host_schemes`; a matching URL is the reference `scheme:<id>`. With `url: written` (default)
 * the resolver only decides whether the viewer sees the reference and the author's URL is kept as written; with
 * `url: resolved` the resolver's URL replaces it, as for `scheme:` values. A matching URL whose id is not a valid id
 * is a reference no viewer sees.
 *
 * @author Héctor Franco Aceituno <hectorfranco@nowo.tech>
 */
final readonly class HostSchemes
{
    /** A scheme name (never one of the browser's own). */
    public const SCHEME_PATTERN = '/^[a-z][a-z0-9+.-]{0,30}$/';

    /** Schemes that can never be host schemes. */
    public const RESERVED = ['http', 'https', 'javascript', 'vbscript', 'data', 'file', 'blob', 'about', 'mailto', 'tel', 'ftp', 'ws', 'wss', 'view-source', 'filesystem', 'jar'];

    /** The id after `scheme:`. */
    public const ID_PATTERN = '[A-Za-z0-9_~-][A-Za-z0-9._~-]{0,199}';

    /** Kinds of URL a template builds. */
    public const KINDS = ['image', 'file', 'preview'];

    /** 1.13: `url` of a URL pattern — keep the author's URL (the resolver only gates it). */
    public const URL_WRITTEN = 'written';

    /** 1.13: `url` of a URL pattern — the resolver's URL replaces the author's, as for `scheme:` references. */
    public const URL_RESOLVED = 'resolved';

    /** 1.13: longer URLs are never matched against `host_url_patterns` (bounds the regular expression's work). */
    public const MAX_PATTERN_URL_LENGTH = 2048;

    /** 1.14: a `host_url_hosts` entry once lower-cased: a host name with an optional port, without scheme or path. */
    public const HOST_PATTERN = '~^[a-z0-9][a-z0-9.-]{0,252}(?::\\d{1,5})?$~D';

    /** @var list<string> */
    private array $urlHosts;

    /**
     * @param array<string, array{image?: ?string, file?: ?string, preview?: ?string}> $schemes scheme => templates (validated by the configuration)
     * @param list<string> $imageOrigins Origins (`https://cdn.example.com`) host images may load from although `allow_remote_images` is off
     * @param list<array{pattern: string, scheme: string, url?: string}> $urlPatterns 1.13 `host_url_patterns` (validated by the configuration)
     * @param array<mixed> $urlHosts 1.13 `host_url_hosts`: hosts (`host[:port]`) whose absolute URLs read as their path.
     *                               1.14: entries may come from env placeholders, so they are validated and lower-cased here
     *                               ({@see self::normalizeUrlHosts()})
     * @param RequestStack|null $requests 1.13: the current request's host counts as one of `host_url_hosts`
     *
     * @throws InvalidArgumentException When a `host_url_hosts` entry is not a host name with an optional port
     */
    public function __construct(
        private array $schemes = [],
        private array $imageOrigins = [],
        private array $urlPatterns = [],
        array $urlHosts = [],
        private ?RequestStack $requests = null,
    ) {
        $this->urlHosts = self::normalizeUrlHosts($urlHosts);
    }

    /**
     * 1.14: `host_url_hosts` as matched — lower-cased, without empty entries. The extension validates literal entries at
     * compile time; entries written as env placeholders (`%env(key:host:url:DEFAULT_URI)%`) are only known once the
     * container resolves them, so they are checked here. An entry that resolves to an empty string or to null adds no
     * host (an unset optional variable, audit IK-I3); any other value that is not `host` or `host:port` throws, so a
     * misconfiguration fails loudly when the service is built instead of silently matching less or more. The message
     * names the entry, never its value (it could be a DSN with credentials, audit IK-I1). Hosts only ever widen what is
     * read as a host value (more URLs go through the resolver), never what a viewer sees.
     *
     * @param array<mixed> $hosts The configured or resolved entries
     *
     * @throws InvalidArgumentException When an entry is not a host name with an optional port
     *
     * @return list<string>
     */
    public static function normalizeUrlHosts(array $hosts): array
    {
        $out   = [];
        $index = 0;
        foreach ($hosts as $host) {
            ++$index;
            if ($host === '' || $host === null) {
                continue;
            }
            $normalized = is_string($host) ? strtolower($host) : null;
            if ($normalized === null || preg_match(self::HOST_PATTERN, $normalized) !== 1) {
                throw new InvalidArgumentException(sprintf('nowo_milkdown_editor.markdown.host_url_hosts entry #%d is not a host name with an optional port, without scheme or path (got %s; the value is not shown).', $index, is_string($host) ? 'a string of ' . strlen($host) . ' characters' : get_debug_type($host)));
            }
            if (!in_array($normalized, $out, true)) {
                $out[] = $normalized;
            }
        }

        return $out;
    }

    /**
     * Whether a resolved image URL is on a `host_image_origins` origin (scheme, host and port compared as a whole).
     */
    public function isAllowedImageOrigin(string $url): bool
    {
        if (preg_match('~^(https?://[^/?#\\\\]+)~i', $url, $m) !== 1) {
            return false;
        }
        $origin = strtolower($m[1]);
        foreach ($this->imageOrigins as $allowed) {
            if (strtolower($allowed) === $origin) {
                return true;
            }
        }

        return false;
    }

    /** Whether no scheme is configured. */
    public function isEmpty(): bool
    {
        return $this->schemes === [];
    }

    /**
     * Whether `$url` uses an allow-listed scheme (valid reference or not): such a value is never a URL of its own.
     */
    public function isHostUrl(string $url): bool
    {
        return preg_match('~^\s*([a-z][a-z0-9+.-]{0,30}):~i', $url, $m) === 1 && array_key_exists(strtolower($m[1]), $this->schemes);
    }

    /**
     * The `scheme:id` reference of `$url` (scheme lower-cased), or null when it is not a valid allow-listed reference.
     */
    public function reference(string $url): ?string
    {
        if (preg_match('#^\s*([a-z][a-z0-9+.-]{0,30}):(' . self::ID_PATTERN . ')\s*$#i', $url, $m) !== 1) {
            return null;
        }
        $scheme = strtolower($m[1]);

        return array_key_exists($scheme, $this->schemes) ? $scheme . ':' . $m[2] : null;
    }

    /**
     * 1.13: the `host_url_patterns` entry a plain URL matches, as `[reference, url mode]` — the reference is null when the
     * value is refused without asking the resolver (an invalid id, a pattern that fails to run, a URL over
     * {@see self::MAX_PATTERN_URL_LENGTH} that starts like a pattern) — or null when the URL is no host value.
     *
     * The URL is normalised first ({@see self::candidate()}): query and fragment dropped, the path percent-decoded once,
     * uuids lower-cased, and an absolute or protocol-relative URL of a `host_url_hosts` host (or of the current request's
     * host) read as its path.
     *
     * @return array{0: ?string, 1: string}|null
     */
    public function matchUrl(string $url): ?array
    {
        if ($this->urlPatterns === []) {
            return null;
        }
        $candidate = $this->candidate($url);
        if ($candidate === '') {
            return null;
        }
        $match = $this->matchCandidate($candidate);
        // 1.14.1 (audit IK-I8): `…/original/` (and `…/original/.`) reach the same route; one trailing slash is dropped
        // when the URL as written matches no pattern.
        if ($match === null && strlen($candidate) > 1 && str_ends_with($candidate, '/')) {
            $match = $this->matchCandidate(substr($candidate, 0, -1));
        }

        return $match;
    }

    /**
     * The `host_url_patterns` entry a normalised candidate matches ({@see self::matchUrl()}).
     *
     * @return array{0: ?string, 1: string}|null
     */
    private function matchCandidate(string $candidate): ?array
    {
        $tooLong = strlen($candidate) > self::MAX_PATTERN_URL_LENGTH;
        foreach ($this->urlPatterns as $entry) {
            $mode = ($entry['url'] ?? self::URL_WRITTEN) === self::URL_RESOLVED ? self::URL_RESOLVED : self::URL_WRITTEN;
            if ($tooLong) {
                // Audit IJ-L1: never let length turn a file URL into an unchecked link.
                if (str_starts_with($candidate, self::literalPrefix($entry['pattern']))) {
                    return [null, $mode];
                }
                continue;
            }
            $matched = @preg_match('#' . $entry['pattern'] . '#D', $candidate, $m);
            if ($matched === false) {
                // Audit IJ-L1: a pattern that fails to run (backtrack or JIT limit) refuses the URL.
                return [null, $mode];
            }
            if ($matched !== 1) {
                continue;
            }
            $scheme = strtolower($entry['scheme']);
            $id     = $m['id'] ?? '';
            $valid  = array_key_exists($scheme, $this->schemes) && preg_match('#^' . self::ID_PATTERN . '$#D', $id) === 1;

            return [$valid ? $scheme . ':' . $id : null, $mode];
        }

        return null;
    }

    /**
     * 1.13: the host value of an image, link or card URL — a `scheme:` value or a URL of `host_url_patterns` — or null.
     */
    public function classify(string $url): ?HostValue
    {
        if ($this->isHostUrl($url)) {
            return new HostValue($this->reference($url), false, true);
        }
        $match = $this->matchUrl($url);

        return $match === null ? null : new HostValue($match[0], $match[1] === self::URL_WRITTEN);
    }

    /**
     * 1.13 (audit IJ-I3): the string `host_url_patterns` are matched against. Query and fragment are dropped, the path is
     * percent-decoded once and uuids are lower-cased; `https://<host>/…` and `//<host>/…` read as their path when the host
     * is one of `host_url_hosts` or the current request's host. Other absolute URLs keep their origin.
     *
     * 1.14 (audit IJ-I10): forms a browser normalises to the same URL match too. The host is compared without a trailing
     * dot and without the scheme's default port (`:443` for https, `:80` for http, either for `//`), and with any
     * userinfo (`user@`) left out: such a URL is read as the host's path, so it goes through the resolver and is hidden
     * unless visible. A path (written as one, or an own host's) has its repeated slashes collapsed and its dot segments
     * (`.`, `..`, also percent-encoded) removed after the decoding (RFC 3986 §5.2.4).
     */
    public function candidate(string $url): string
    {
        $url  = trim($url, " \t\n\r\f\v");
        $cut  = strcspn($url, '?#');
        $url  = substr($url, 0, $cut);
        $path = str_starts_with($url, '/') && !str_starts_with($url, '//');
        if (preg_match('~^(?:(https?):)?//([^/\\\\]*)(.*)$~i', $url, $m) === 1 && $this->isOwnHost(strtolower($m[2]), strtolower($m[1]))) {
            $url  = $m[3] === '' ? '/' : $m[3];
            $path = true;
        }
        $url = rawurldecode($url);
        if ($path) {
            $url = self::removeDotSegments((string) preg_replace('~/{2,}~', '/', $url));
        }

        return (string) preg_replace_callback('/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i', static fn (array $u): string => strtolower($u[0]), $url);
    }

    /**
     * 1.14 (audit IJ-I10): RFC 3986 §5.2.4 `remove_dot_segments` for a path that starts with `/`.
     */
    public static function removeDotSegments(string $path): string
    {
        $segments = explode('/', $path);
        $last     = count($segments) - 1;
        $out      = [];
        foreach ($segments as $index => $segment) {
            if ($segment === '.' || $segment === '..') {
                if ($segment === '..' && count($out) > 1) {
                    array_pop($out);
                }
                if ($index === $last) {
                    $out[] = '';
                }
                continue;
            }
            $out[] = $segment;
        }

        return implode('/', $out);
    }

    /**
     * 1.14 (audit IJ-I10): an authority as compared with the own hosts — lower case, without userinfo, without a trailing
     * dot on the host and without the scheme's default port (`:443` for https, `:80` for http, either without scheme).
     * 1.14.1 (audit IK-I7): ASCII percent-escapes decoded and leading zeros of the port dropped first.
     *
     * @param string $authority `[userinfo@]host[:port]`, lower case
     * @param string $scheme `https`, `http` or `` (protocol-relative)
     */
    public static function normalizeAuthority(string $authority, string $scheme = ''): string
    {
        $at = strrpos($authority, '@');
        if ($at !== false) {
            $authority = substr($authority, $at + 1);
        }
        // 1.14.1 (audit IK-I7): ASCII percent-escapes decoded, as browsers do (`beacon%2Eexample.com`).
        $authority = strtolower((string) preg_replace_callback('~%([0-7][0-9a-f])~i', static fn (array $e): string => chr((int) hexdec($e[1])), $authority));
        // A host (or a bracketed IPv6 literal) and an optional port; anything else is compared as written.
        if (preg_match('~^(\[[^\]]*\]|[^:]*)(?::(\d*))?$~D', $authority, $m) !== 1) {
            return $authority;
        }
        [$authority, $port] = [$m[1], $m[2] ?? ''];
        // 1.14.1 (audit IK-I7): `:0443` is port 443.
        if ($port !== '') {
            $port = ltrim($port, '0');
            $port = $port === '' ? '0' : $port;
        }
        $host    = rtrim($authority, '.');
        $default = match ($scheme) {
            'https' => ['443'],
            'http'  => ['80'],
            default => ['443', '80'],
        };

        return $port === '' || in_array($port, $default, true) ? $host : $host . ':' . $port;
    }

    /** Whether an authority (lower case) is this application's: `host_url_hosts` or the request's host (1.14: normalised). */
    private function isOwnHost(string $authority, string $scheme): bool
    {
        $normalized = self::normalizeAuthority($authority, $scheme);
        if ($normalized === '' || str_starts_with($normalized, ':')) {
            return false;
        }
        // 1.14.1 (audit IK-I7): a decoded host with URL delimiters is no host a browser opens; read it as own (hidden).
        if (strpbrk($normalized, '@/\\?#') !== false) {
            return true;
        }
        foreach ($this->urlHosts as $host) {
            if ($host === $normalized || self::normalizeAuthority($host, $scheme) === $normalized) {
                return true;
            }
        }
        $request = $this->requests?->getCurrentRequest();

        return $request instanceof Request && self::normalizeAuthority(strtolower($request->getHttpHost()), $request->getScheme()) === $normalized;
    }

    /**
     * 1.13: the literal start of a pattern (after `^`, up to its first special character), for the length bound.
     */
    public static function literalPrefix(string $pattern): string
    {
        $prefix = '';
        $length = strlen($pattern);
        for ($i = 1; $i < $length; ++$i) {
            $char = $pattern[$i];
            if ($char === '\\' && $i + 1 < $length && str_contains('./-_~', $pattern[$i + 1])) {
                $char = $pattern[++$i];
            } elseif (preg_match('#[A-Za-z0-9/:_~-]#', $char) !== 1) {
                break;
            }
            // A quantifier makes the character before it optional (`?`, `*`, `{`) or repeatable (`+`).
            $next = $i + 1 < $length ? $pattern[$i + 1] : '';
            if ($next !== '' && str_contains('?*{', $next)) {
                break;
            }
            $prefix .= $char;
            if ($next === '+') {
                break;
            }
        }

        return $prefix;
    }

    /**
     * Whether `$url` is a host value: an allow-listed scheme ({@see self::isHostUrl()}) or, 1.13, a URL that matches a
     * `host_url_patterns` entry.
     */
    public function isHostValue(string $url): bool
    {
        return $this->classify($url) instanceof HostValue;
    }

    /**
     * The `scheme:id` reference of a host value ({@see self::reference()} or, 1.13, of its URL pattern), or null.
     */
    public function hostReference(string $url): ?string
    {
        return $this->classify($url)?->reference;
    }

    /**
     * 1.13: whether a host value keeps the author's URL once the resolver lets the viewer see it (a URL pattern with
     * `url: written`); `scheme:` values and `url: resolved` patterns take the resolver's URL.
     */
    public function keepsWrittenUrl(string $url): bool
    {
        return $this->classify($url)->keepsWrittenUrl ?? false;
    }

    /**
     * 1.13: `host_url_hosts`, for the editor's page configuration (`hostUrlHosts`).
     *
     * @return list<string>
     */
    public function urlHosts(): array
    {
        return $this->urlHosts;
    }

    /** 1.13: whether `host_url_patterns` has entries. */
    public function hasUrlPatterns(): bool
    {
        return $this->urlPatterns !== [];
    }

    /**
     * 1.13: the URL patterns for the editor's page configuration (`hostUrlPatterns`).
     *
     * @return list<array{pattern: string, scheme: string, url: string}>
     */
    public function urlPatternsToArray(): array
    {
        $out = [];
        foreach ($this->urlPatterns as $entry) {
            $out[] = ['pattern' => $entry['pattern'], 'scheme' => strtolower($entry['scheme']), 'url' => ($entry['url'] ?? self::URL_WRITTEN) === self::URL_RESOLVED ? self::URL_RESOLVED : self::URL_WRITTEN];
        }

        return $out;
    }

    /**
     * The URL of a reference for `$kind` (`image` falls back to `file`), or null without a template.
     *
     * @param string $reference A value returned by {@see self::reference()}
     * @param string $kind One of {@see self::KINDS}
     */
    public function url(string $reference, string $kind): ?string
    {
        [$scheme, $id] = explode(':', $reference, 2) + [1 => ''];
        $templates     = $this->schemes[$scheme] ?? null;
        if ($templates === null) {
            return null;
        }
        $template = $templates[$kind] ?? null;
        if ($kind === 'image' && ($template === null || $template === '')) {
            $template = $templates['file'] ?? null;
        }
        if ($template === null || $template === '') {
            return null;
        }

        return str_replace('{id}', rawurlencode($id), $template);
    }

    /**
     * The configuration for the editor's widget JSON (`hostSchemes`).
     *
     * @return array<string, array{image: ?string, file: ?string, preview: ?string}>
     */
    public function toArray(): array
    {
        $out = [];
        foreach ($this->schemes as $scheme => $templates) {
            $out[$scheme] = ['image' => $templates['image'] ?? null, 'file' => $templates['file'] ?? null, 'preview' => $templates['preview'] ?? null];
        }

        return $out;
    }
}
