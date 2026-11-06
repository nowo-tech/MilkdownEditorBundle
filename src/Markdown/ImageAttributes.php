<?php

declare(strict_types=1);

namespace Nowo\MilkdownEditorBundle\Markdown;

use function in_array;
use function preg_match;
use function strlen;
use function substr;

/**
 * The attribute block of an image (1.9, `image_block`, roadmap D9): `![alt](src "caption"){width=50% align=center}`.
 * Width: `25%`, `50%`, `75%`, `100%` or `<n>px` from 16 to 2000; align: `left`, `center`, `right`. Only a block made of
 * these keys with valid values counts: anything else stays text, so nothing an author wrote is lost, and no value
 * reaches a `style` attribute (classes and the `width` HTML attribute only). The editor uses the same rules
 * (`dialect/image.ts`).
 *
 * @author Héctor Franco Aceituno <hectorfranco@nowo.tech>
 */
final class ImageAttributes
{
    public const ALIGNMENTS = ['left', 'center', 'right'];

    public const PERCENTS = ['25%', '50%', '75%', '100%'];

    /** One `key=value`; values are short, so the pattern is bounded. */
    private const PAIR = '(width|align)=(?:"([^"{}\n]{1,20})"|([^\s"{}]{1,20}))';

    /**
     * Reads a block at the start of `$text` (the text right after an image).
     *
     * @return array{width: string, align: string, length: int}|null The values and the block's length, or null when `$text` does not start with a valid block
     */
    public static function prefix(string $text): ?array
    {
        if (preg_match('/^\{[ \t]*' . self::PAIR . '(?:[ \t]+' . self::PAIR . ')?[ \t]*\}/', $text, $m) !== 1) {
            return null;
        }
        $out = ['width' => '', 'align' => '', 'length' => strlen($m[0])];
        foreach ([[$m[1], ($m[2] ?? '') . ($m[3] ?? '')], [$m[4] ?? '', ($m[5] ?? '') . ($m[6] ?? '')]] as [$key, $value]) {
            if ($key === 'width') {
                $out['width'] = self::width($value);
                if ($out['width'] === '') {
                    return null;
                }
            } elseif ($key === 'align') {
                $out['align'] = self::align($value);
                if ($out['align'] === '') {
                    return null;
                }
            }
        }

        return $out;
    }

    /** `$text` without its leading block of `$length` bytes. */
    public static function rest(string $text, int $length): string
    {
        return substr($text, $length);
    }

    /** A valid width or ''. */
    public static function width(string $value): string
    {
        if (in_array($value, self::PERCENTS, true)) {
            return $value;
        }
        if (preg_match('/^([1-9]\d{1,3})px$/D', $value, $m) === 1 && (int) $m[1] >= 16 && (int) $m[1] <= 2000) {
            return $value;
        }

        return '';
    }

    /** A valid alignment or ''. */
    public static function align(string $value): string
    {
        return in_array($value, self::ALIGNMENTS, true) ? $value : '';
    }
}
