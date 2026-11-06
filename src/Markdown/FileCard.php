<?php

declare(strict_types=1);

namespace Nowo\MilkdownEditorBundle\Markdown;

use Nowo\MilkdownEditorBundle\Markdown\Node\LeafDirective;

use function array_filter;
use function array_map;
use function array_unique;
use function array_values;
use function explode;
use function floor;
use function implode;
use function in_array;
use function is_string;
use function mb_substr;
use function preg_match;
use function preg_replace;
use function round;
use function str_starts_with;
use function strrpos;
use function strtolower;
use function strtoupper;
use function strtr;
use function substr;
use function trim;

/**
 * File cards of the dialect (1.8, ME-3): `::file[name]{href="…" size="…" type="…"}`, written by the editor for
 * uploads that are not images (`file_cards`); 1.9 (ME-6) adds `view="link|icon|card|preview"` and `height="…"`. Rendered as a link card (badge, name, size); the name is escaped and
 * loses control and bidi-override characters, the link follows the link rules of the renderer ({@see DialectRenderer::safeUrl()}:
 * relative or http(s) only, even with `allow_unsafe_links`), and a card without a usable URL has no link. The
 * category, badge and size text match the editor (`file-card.ts`; shared fixture `tests/Fixtures/file-cards.json`).
 *
 * @author Héctor Franco Aceituno <hectorfranco@nowo.tech>
 */
final class FileCard
{
    /** Name of the leaf directive. */
    public const NAME = 'file';

    /** Longest file name shown (characters). */
    public const MAX_NAME = 200;

    /** @var array<string, string> extension => category */
    private const BY_EXTENSION = [
        'pdf'  => 'pdf',
        'png'  => 'image', 'jpg' => 'image', 'jpeg' => 'image', 'gif' => 'image', 'webp' => 'image', 'avif' => 'image', 'svg' => 'image', 'bmp' => 'image', 'heic' => 'image',
        'mp3'  => 'audio', 'wav' => 'audio', 'ogg' => 'audio', 'm4a' => 'audio', 'flac' => 'audio',
        'mp4'  => 'video', 'mov' => 'video', 'webm' => 'video', 'mkv' => 'video', 'avi' => 'video',
        'zip'  => 'archive', 'rar' => 'archive', '7z' => 'archive', 'tar' => 'archive', 'gz' => 'archive', 'tgz' => 'archive', 'bz2' => 'archive',
        'csv'  => 'sheet', 'tsv' => 'sheet', 'xls' => 'sheet', 'xlsx' => 'sheet', 'ods' => 'sheet', 'numbers' => 'sheet',
        'doc'  => 'doc', 'docx' => 'doc', 'odt' => 'doc', 'rtf' => 'doc', 'pages' => 'doc',
        'ppt'  => 'slides', 'pptx' => 'slides', 'odp' => 'slides', 'key' => 'slides',
        'txt'  => 'text', 'md' => 'text', 'log' => 'text',
        'json' => 'code', 'xml' => 'code', 'yaml' => 'code', 'yml' => 'code', 'html' => 'code', 'css' => 'code', 'js' => 'code', 'ts' => 'code', 'php' => 'code', 'sql' => 'code',
    ];

    private const UNITS = ['KB', 'MB', 'GB', 'TB'];

    /** Views of a file (1.9, ME-6): `card` is the default and the fallback. */
    public const VIEWS = ['link', 'icon', 'card', 'preview'];

    /** Height of a preview in px (1.9): default, and the accepted range. */
    public const DEFAULT_HEIGHT = 480;
    public const MIN_HEIGHT     = 160;
    public const MAX_HEIGHT     = 1200;

    /** `sandbox` tokens a host may add to preview frames; `allow-scripts` and `allow-same-origin` never together. */
    public const SANDBOX_TOKENS = ['allow-scripts', 'allow-same-origin', 'allow-popups', 'allow-popups-to-escape-sandbox', 'allow-downloads'];

    /** Outline icons of the `icon` view (Tabler 3.50.0, MIT; the same as the editor's glyphs): static markup, never user data. */
    private const ICONS = [
        'archive' => ['M6 20.735a2 2 0 0 1 -1 -1.735v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2h-1', 'M11 17a2 2 0 0 1 2 2v2a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1v-2a2 2 0 0 1 2 -2', 'M11 5l-1 0', 'M13 7l-1 0', 'M11 9l-1 0', 'M13 11l-1 0', 'M11 13l-1 0', 'M13 15l-1 0'],
        'audio'   => ['M3 17a3 3 0 1 0 6 0a3 3 0 0 0 -6 0', 'M13 17a3 3 0 1 0 6 0a3 3 0 0 0 -6 0', 'M9 17v-13h10v13', 'M9 8h10'],
        'code'    => ['M14 3v4a1 1 0 0 0 1 1h4', 'M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2', 'M10 13l-1 2l1 2', 'M14 13l1 2l-1 2'],
        'csv'     => ['M14 3v4a1 1 0 0 0 1 1h4', 'M5 12v-7a2 2 0 0 1 2 -2h7l5 5v4', 'M7 16.5a1.5 1.5 0 0 0 -3 0v3a1.5 1.5 0 0 0 3 0', 'M10 20.25c0 .414 .336 .75 .75 .75h1.25a1 1 0 0 0 1 -1v-1a1 1 0 0 0 -1 -1h-1a1 1 0 0 1 -1 -1v-1a1 1 0 0 1 1 -1h1.25a.75 .75 0 0 1 .75 .75', 'M16 15l2 6l2 -6'],
        'doc'     => ['M14 3v4a1 1 0 0 0 1 1h4', 'M5 12v-7a2 2 0 0 1 2 -2h7l5 5v4', 'M5 15v6h1a2 2 0 0 0 2 -2v-2a2 2 0 0 0 -2 -2h-1', 'M20 16.5a1.5 1.5 0 0 0 -3 0v3a1.5 1.5 0 0 0 3 0', 'M12.5 15a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1 -3 0v-3a1.5 1.5 0 0 1 1.5 -1.5'],
        'image'   => ['M15 8h.01', 'M3 6a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v12a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3v-12', 'M3 16l5 -5c.928 -.893 2.072 -.893 3 0l5 5', 'M14 14l1 -1c.928 -.893 2.072 -.893 3 0l3 3'],
        'other'   => ['M14 3v4a1 1 0 0 0 1 1h4', 'M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2'],
        'pdf'     => ['M14 3v4a1 1 0 0 0 1 1h4', 'M5 12v-7a2 2 0 0 1 2 -2h7l5 5v4', 'M5 18h1.5a1.5 1.5 0 0 0 0 -3h-1.5v6', 'M17 18h2', 'M20 15h-3v6', 'M11 15v6h1a2 2 0 0 0 2 -2v-2a2 2 0 0 0 -2 -2h-1'],
        'sheet'   => ['M14 3v4a1 1 0 0 0 1 1h4', 'M5 12v-7a2 2 0 0 1 2 -2h7l5 5v4', 'M4 15l4 6', 'M4 21l4 -6', 'M17 20.25c0 .414 .336 .75 .75 .75h1.25a1 1 0 0 0 1 -1v-1a1 1 0 0 0 -1 -1h-1a1 1 0 0 1 -1 -1v-1a1 1 0 0 1 1 -1h1.25a.75 .75 0 0 1 .75 .75', 'M11 15v6h3'],
        'slides'  => ['M14 3v4a1 1 0 0 0 1 1h4', 'M14 3v4a1 1 0 0 0 1 1h4', 'M5 18h1.5a1.5 1.5 0 0 0 0 -3h-1.5v6', 'M11 18h1.5a1.5 1.5 0 0 0 0 -3h-1.5v6', 'M16.5 15h3', 'M18 15v6', 'M5 12v-7a2 2 0 0 1 2 -2h7l5 5v4'],
        'text'    => ['M14 3v4a1 1 0 0 0 1 1h4', 'M14 3v4a1 1 0 0 0 1 1h4', 'M16.5 15h3', 'M5 12v-7a2 2 0 0 1 2 -2h7l5 5v4', 'M4.5 15h3', 'M6 15v6', 'M18 15v6', 'M10 15l4 6', 'M10 21l4 -6'],
        'video'   => ['M4 6a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2l0 -12', 'M8 4l0 16', 'M16 4l0 16', 'M4 8l4 0', 'M4 16l4 0', 'M4 12l16 0', 'M16 8l4 0', 'M16 16l4 0'],
    ];

    /**
     * HTML of a `::file` directive in its view (1.9: `view="link|icon|card|preview"`, `height` for previews).
     *
     * The link is the URL resolved by {@see DocumentProcessor} for host references (`nowo_file_url`, or
     * `nowo_file_hidden` for a file the viewer may not read), otherwise the `href` through
     * {@see DialectRenderer::safeUrl()}. A preview renders only with a URL from {@see Resolver\FilePreviewResolverInterface}
     * (`nowo_file_preview`), else the card.
     *
     * @param LeafDirective $node The directive
     * @param array{open?: string, download?: string, hidden?: string, sandbox?: string} $options Translated labels and the frame's `sandbox` value
     */
    public static function render(LeafDirective $node, array $options = []): string
    {
        if ($node->data->get('nowo_file_hidden', false) === true) {
            return '<div class="nowo-md-file nowo-md-file--hidden" data-directive="file"><span class="nowo-md-ref nowo-md-ref--hidden">' . DialectRenderer::e($options['hidden'] ?? 'Content not visible') . '</span></div>';
        }
        $name               = self::name($node->label);
        $resolved           = $node->data->get('nowo_file_url', null);
        $href               = is_string($resolved) ? $resolved : DialectRenderer::safeUrl($node->attributes['href'] ?? '');
        [$category, $badge] = self::kind($name, $node->attributes['type'] ?? '', $href);
        $view               = self::view($node->attributes);
        $link               = $href !== '' ? ' href="' . DialectRenderer::e($href) . '" rel="noopener noreferrer"' : '';
        $tag                = $href !== '' ? 'a' : 'span';
        $attrs              = ' data-directive="file" data-view="' . $view . '"';

        if ($view === 'link') {
            return '<p class="nowo-md-file nowo-md-file--link-view nowo-md-file--' . $category . '"' . $attrs . '><' . $tag . ' class="nowo-md-file__text"' . $link . '>' . DialectRenderer::e($name) . '</' . $tag . '></p>';
        }
        if ($view === 'icon') {
            return '<p class="nowo-md-file nowo-md-file--icon-view nowo-md-file--' . $category . '"' . $attrs . '><' . $tag . ' class="nowo-md-file__inline"' . $link . '>' . self::icon($category, $badge) . '<span class="nowo-md-file__name">' . DialectRenderer::e($name) . '</span></' . $tag . '></p>';
        }

        $size  = self::size($node->attributes['size'] ?? '');
        $inner = '<span class="nowo-md-file__badge" aria-hidden="true">' . DialectRenderer::e($badge) . '</span>'
            . '<span class="nowo-md-file__name">' . DialectRenderer::e($name) . '</span>'
            . ($size !== '' ? '<span class="nowo-md-file__size">' . DialectRenderer::e($size) . '</span>' : '');
        $card = '<' . $tag . ' class="nowo-md-file__link"' . $link . '>' . $inner . '</' . $tag . '>';

        $preview = $node->data->get('nowo_file_preview', null);
        if ($view === 'preview' && is_string($preview) && $preview !== '' && $href !== '') {
            $e = DialectRenderer::e(...);

            return '<figure class="nowo-md-file nowo-md-file--preview-view nowo-md-file--' . $category . '"' . $attrs . '>'
                . '<div class="nowo-md-file__head">' . $card
                . '<span class="nowo-md-file__actions">'
                . '<a class="nowo-md-file__open" href="' . $e($href) . '" target="_blank" rel="noopener noreferrer">' . $e($options['open'] ?? 'Open') . '</a>'
                . '<a class="nowo-md-file__download" href="' . $e($href) . '" download rel="noopener noreferrer">' . $e($options['download'] ?? 'Download') . '</a>'
                . '</span></div>'
                . '<iframe class="nowo-md-file__frame" src="' . $e($preview) . '" title="' . $e($name) . '" sandbox="' . $e(self::sandbox($options['sandbox'] ?? '')) . '" loading="lazy" referrerpolicy="no-referrer" height="' . self::height($node->attributes['height'] ?? '') . '"></iframe>'
                . '</figure>';
        }

        return '<div class="nowo-md-file nowo-md-file--' . $category . '"' . ($view === 'card' ? ' data-directive="file"' : $attrs) . '>' . $card . '</div>';
    }

    /** The file-type icon of a category (`CSV` has its own), the generic file for the others. */
    private static function icon(string $category, string $badge): string
    {
        $paths = self::ICONS[$badge === 'CSV' ? 'csv' : $category] ?? self::ICONS['other'];

        return '<svg class="nowo-md-file__icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'
            . implode('', array_map(static fn (string $d): string => '<path d="' . $d . '"/>', $paths))
            . '</svg>';
    }

    /**
     * The view of a card: `view=` when known, else `card`.
     *
     * @param array<string, string> $attributes The directive attributes
     */
    public static function view(array $attributes): string
    {
        $view = $attributes['view'] ?? 'card';

        return in_array($view, self::VIEWS, true) ? $view : 'card';
    }

    /** A preview height in px: digits within the bounds, else the default. */
    public static function height(string $value): int
    {
        if (preg_match('/^\d{1,4}$/', $value) !== 1) {
            return self::DEFAULT_HEIGHT;
        }
        $height = (int) $value;

        return $height >= self::MIN_HEIGHT && $height <= self::MAX_HEIGHT ? $height : self::DEFAULT_HEIGHT;
    }

    /**
     * The `sandbox` value of preview frames: allowed tokens only, never `allow-scripts` with `allow-same-origin`
     * (then `allow-same-origin` is dropped).
     */
    public static function sandbox(string $value): string
    {
        $tokens = array_values(array_unique(array_filter(explode(' ', strtolower($value)), static fn (string $t): bool => in_array($t, self::SANDBOX_TOKENS, true))));
        if (in_array('allow-scripts', $tokens, true)) {
            $tokens = array_values(array_filter($tokens, static fn (string $t): bool => $t !== 'allow-same-origin'));
        }

        return implode(' ', $tokens);
    }

    /**
     * The shown name: without control or invisible format characters (Unicode Cc / Cf), brackets as parentheses, single spaces,
     * at most {@see self::MAX_NAME} characters; `file` when nothing is left (the editor's `fileName()`).
     */
    public static function name(string $value): string
    {
        $clean = (string) preg_replace('/\s+/u', ' ', $value);
        // Controls and every invisible format character (Cf: bidi overrides and isolates, ALM, zero-width, word joiner,
        // BOM; audit GR-I2).
        $clean = (string) preg_replace('/[\p{Cc}\p{Cf}]/u', '', $clean);
        $clean = trim(strtr($clean, ['[' => '(', ']' => ')']));
        $clean = trim(mb_substr($clean, 0, self::MAX_NAME));

        return $clean !== '' ? $clean : 'file';
    }

    /** The lower-case extension (letters and digits, at most 8), or ''. */
    public static function extension(string $name): string
    {
        return preg_match('/\.([a-z0-9]{1,8})$/i', trim($name), $m) === 1 ? strtolower($m[1]) : '';
    }

    /**
     * Category (pdf, image, audio, video, archive, sheet, doc, slides, text, code, other) and badge of a card (audit
     * GR-I1, the editor's `fileKind()`). The **target** decides, not the label: the extension of the link's file when it
     * has one, else the MIME type, else the label's extension. The badge is the deciding extension in capitals (at most
     * 4 characters); a label extension that disagrees with the type, or none, gives `FILE`.
     *
     * @return array{string, string} category and badge
     */
    public static function kind(string $name, string $type = '', string $href = ''): array
    {
        $fromHref = self::hrefExtension($href);
        if ($fromHref !== '') {
            return [self::BY_EXTENSION[$fromHref] ?? 'other', self::badgeOf($fromHref)];
        }
        $label  = self::extension($name);
        $byType = self::typeCategory($type);
        if ($byType !== null) {
            return [$byType, $label !== '' && (self::BY_EXTENSION[$label] ?? null) === $byType ? self::badgeOf($label) : 'FILE'];
        }

        return [self::BY_EXTENSION[$label] ?? 'other', $label !== '' ? self::badgeOf($label) : 'FILE'];
    }

    /** The category a MIME type names, or null for an unknown or empty type. */
    public static function typeCategory(string $type): ?string
    {
        $type = strtolower($type);
        if ($type === '') {
            return null;
        }
        if ($type === 'application/pdf') {
            return 'pdf';
        }
        // Specific families first: `text/csv` is a sheet, `text/rtf` a document.
        $family = match (true) {
            preg_match('/zip|compressed|tar|gzip/', $type) === 1     => 'archive',
            preg_match('/spreadsheet|excel|csv/', $type) === 1       => 'sheet',
            preg_match('/presentation|powerpoint/', $type) === 1     => 'slides',
            preg_match('/word|opendocument\.text|rtf/', $type) === 1 => 'doc',
            default                                                  => null,
        };
        if ($family !== null) {
            return $family;
        }
        foreach (['image', 'audio', 'video', 'text'] as $prefix) {
            if (str_starts_with($type, $prefix . '/')) {
                return $prefix;
            }
        }

        return null;
    }

    /** The extension of the last path segment of a URL (query and fragment ignored), or ''. */
    public static function hrefExtension(string $href): string
    {
        $path  = explode('?', explode('#', $href, 2)[0], 2)[0];
        $slash = strrpos($path, '/');

        return self::extension($slash === false ? $path : substr($path, $slash + 1));
    }

    private static function badgeOf(string $extension): string
    {
        return strtoupper(substr($extension, 0, 4));
    }

    /** A byte count as `512 B`, `1.5 KB`, `12 MB` (1024 steps; one decimal under 10); '' when not a count. */
    public static function size(string $value): string
    {
        if (preg_match('/^\d{1,15}$/', $value) !== 1) {
            return '';
        }
        $size = (float) $value;
        if ($size < 1024) {
            return (int) $value . ' B';
        }
        $unit = -1;
        while ($size >= 1024 && $unit < 3) {
            $size /= 1024;
            ++$unit;
        }
        $rounded = $size < 10 ? round($size, 1) : round($size);

        return ($rounded === floor($rounded) ? (string) (int) $rounded : (string) $rounded) . ' ' . self::UNITS[$unit];
    }
}
