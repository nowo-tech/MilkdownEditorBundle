<?php

declare(strict_types=1);

namespace Nowo\MilkdownEditorBundle\Markdown;

use Nowo\MilkdownEditorBundle\Markdown\Node\LeafDirective;

use function explode;
use function floor;
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
 * uploads that are not images (`file_cards`). Rendered as a link card (badge, name, size); the name is escaped and
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

    /**
     * HTML of a `::file` directive.
     *
     * @param LeafDirective $node The directive
     */
    public static function render(LeafDirective $node): string
    {
        $name               = self::name($node->label);
        $href               = DialectRenderer::safeUrl($node->attributes['href'] ?? '');
        [$category, $badge] = self::kind($name, $node->attributes['type'] ?? '', $href);
        $size               = self::size($node->attributes['size'] ?? '');
        $inner              = '<span class="nowo-md-file__badge" aria-hidden="true">' . DialectRenderer::e($badge) . '</span>'
            . '<span class="nowo-md-file__name">' . DialectRenderer::e($name) . '</span>'
            . ($size !== '' ? '<span class="nowo-md-file__size">' . DialectRenderer::e($size) . '</span>' : '');
        $card = $href !== ''
            ? '<a class="nowo-md-file__link" href="' . DialectRenderer::e($href) . '" rel="noopener noreferrer">' . $inner . '</a>'
            : '<span class="nowo-md-file__link">' . $inner . '</span>';

        return '<div class="nowo-md-file nowo-md-file--' . $category . '" data-directive="file">' . $card . '</div>';
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
