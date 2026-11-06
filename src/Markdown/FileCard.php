<?php

declare(strict_types=1);

namespace Nowo\MilkdownEditorBundle\Markdown;

use Nowo\MilkdownEditorBundle\Markdown\Node\LeafDirective;

use function floor;
use function mb_substr;
use function preg_match;
use function preg_replace;
use function round;
use function str_starts_with;
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
        $name     = self::name($node->label);
        $href     = DialectRenderer::safeUrl($node->attributes['href'] ?? '');
        $category = self::category($name, $node->attributes['type'] ?? '');
        $size     = self::size($node->attributes['size'] ?? '');
        $inner    = '<span class="nowo-md-file__badge" aria-hidden="true">' . DialectRenderer::e(self::badge($name)) . '</span>'
            . '<span class="nowo-md-file__name">' . DialectRenderer::e($name) . '</span>'
            . ($size !== '' ? '<span class="nowo-md-file__size">' . DialectRenderer::e($size) . '</span>' : '');
        $card = $href !== ''
            ? '<a class="nowo-md-file__link" href="' . DialectRenderer::e($href) . '" rel="noopener noreferrer">' . $inner . '</a>'
            : '<span class="nowo-md-file__link">' . $inner . '</span>';

        return '<div class="nowo-md-file nowo-md-file--' . $category . '" data-directive="file">' . $card . '</div>';
    }

    /**
     * The shown name: without control, bidi-override and isolate characters, brackets as parentheses, single spaces,
     * at most {@see self::MAX_NAME} characters; `file` when nothing is left (the editor's `fileName()`).
     */
    public static function name(string $value): string
    {
        $clean = (string) preg_replace('/\s+/u', ' ', $value);
        $clean = (string) preg_replace('/[\x{0000}-\x{001F}\x{007F}-\x{009F}\x{200E}\x{200F}\x{202A}-\x{202E}\x{2066}-\x{2069}]/u', '', $clean);
        $clean = trim(strtr($clean, ['[' => '(', ']' => ')']));
        $clean = trim(mb_substr($clean, 0, self::MAX_NAME));

        return $clean !== '' ? $clean : 'file';
    }

    /** The lower-case extension (letters and digits, at most 8), or ''. */
    public static function extension(string $name): string
    {
        return preg_match('/\.([a-z0-9]{1,8})$/i', trim($name), $m) === 1 ? strtolower($m[1]) : '';
    }

    /** Category from the extension, else from the MIME type (one of pdf, image, audio, video, archive, sheet, doc, slides, text, code, other). */
    public static function category(string $name, string $type = ''): string
    {
        $byExtension = self::BY_EXTENSION[self::extension($name)] ?? null;
        if ($byExtension !== null) {
            return $byExtension;
        }
        $type = strtolower($type);
        if ($type === 'application/pdf') {
            return 'pdf';
        }
        foreach (['image', 'audio', 'video', 'text'] as $prefix) {
            if (str_starts_with($type, $prefix . '/')) {
                return $prefix;
            }
        }

        return match (true) {
            preg_match('/zip|compressed|tar|gzip/', $type) === 1     => 'archive',
            preg_match('/spreadsheet|excel|csv/', $type) === 1       => 'sheet',
            preg_match('/presentation|powerpoint/', $type) === 1     => 'slides',
            preg_match('/word|opendocument\.text|rtf/', $type) === 1 => 'doc',
            default                                                  => 'other',
        };
    }

    /** The badge: the extension in capitals (at most 4 characters), else `FILE`. */
    public static function badge(string $name): string
    {
        $extension = self::extension($name);

        return $extension !== '' ? strtoupper(substr($extension, 0, 4)) : 'FILE';
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
