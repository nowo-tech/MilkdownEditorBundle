<?php

declare(strict_types=1);

namespace Nowo\MilkdownEditorBundle\Markdown;

use function array_key_exists;
use function explode;
use function preg_match;
use function rawurlencode;
use function str_replace;
use function strlen;
use function strtolower;
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

    /**
     * @param array<string, array{image?: ?string, file?: ?string, preview?: ?string}> $schemes scheme => templates (validated by the configuration)
     * @param list<string> $imageOrigins Origins (`https://cdn.example.com`) host images may load from although `allow_remote_images` is off
     * @param list<array{pattern: string, scheme: string, url?: string}> $urlPatterns 1.13 `host_url_patterns` (validated by the configuration)
     */
    public function __construct(private array $schemes = [], private array $imageOrigins = [], private array $urlPatterns = [])
    {
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
     * matched id is not a valid id (such a URL is a host value no viewer sees) — or null when no pattern matches.
     *
     * @return array{0: ?string, 1: string}|null
     */
    public function matchUrl(string $url): ?array
    {
        $url = trim($url, " \t\n\r\f\v");
        if ($this->urlPatterns === [] || $url === '' || strlen($url) > self::MAX_PATTERN_URL_LENGTH) {
            return null;
        }
        foreach ($this->urlPatterns as $entry) {
            if (preg_match('#' . $entry['pattern'] . '#D', $url, $m) !== 1) {
                continue;
            }
            $scheme = strtolower($entry['scheme']);
            $id     = $m['id'] ?? '';
            $valid  = array_key_exists($scheme, $this->schemes) && preg_match('#^' . self::ID_PATTERN . '$#D', $id) === 1;

            return [$valid ? $scheme . ':' . $id : null, ($entry['url'] ?? self::URL_WRITTEN) === self::URL_RESOLVED ? self::URL_RESOLVED : self::URL_WRITTEN];
        }

        return null;
    }

    /**
     * Whether `$url` is a host value: an allow-listed scheme ({@see self::isHostUrl()}) or, 1.13, a URL that matches a
     * `host_url_patterns` entry.
     */
    public function isHostValue(string $url): bool
    {
        return $this->isHostUrl($url) || $this->matchUrl($url) !== null;
    }

    /**
     * The `scheme:id` reference of a host value ({@see self::reference()} or, 1.13, of its URL pattern), or null.
     */
    public function hostReference(string $url): ?string
    {
        return $this->isHostUrl($url) ? $this->reference($url) : ($this->matchUrl($url)[0] ?? null);
    }

    /**
     * 1.13: whether a host value keeps the author's URL once the resolver lets the viewer see it (a URL pattern with
     * `url: written`); `scheme:` values and `url: resolved` patterns take the resolver's URL.
     */
    public function keepsWrittenUrl(string $url): bool
    {
        return !$this->isHostUrl($url) && ($this->matchUrl($url)[1] ?? null) === self::URL_WRITTEN;
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
