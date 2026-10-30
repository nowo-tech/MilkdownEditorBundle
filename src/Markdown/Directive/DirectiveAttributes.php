<?php

declare(strict_types=1);

namespace Nowo\MilkdownEditorBundle\Markdown\Directive;

use function count;
use function strlen;

use const PREG_UNMATCHED_AS_NULL;

/**
 * Parses the `{…}` attribute list of a directive: `key=value`, `key="value"`, `key='value'`, `#id`, `.class`
 * (classes joined with spaces) and bare `key` (empty value). Keys are lower case; at most 20 attributes, values cut
 * to 500 characters.
 *
 * @author Héctor Franco Aceituno <hectorfranco@nowo.tech>
 */
final class DirectiveAttributes
{
    /** Directive names: a letter, then letters, digits and hyphens. */
    public const NAME_PATTERN = '[a-z][a-z0-9-]{0,40}';

    private const TOKEN = '/\G\s*(?:([#.])([^\s"\'=<>`#.}]+)|([a-z][a-z0-9_-]{0,40})(?:\s*=\s*(?:"([^"]*)"|\'([^\']*)\'|([^\s"\'=<>`}]+)))?)/';

    /**
     * @param string $source The text between `{` and `}`
     *
     * @return array<string, string>
     */
    public static function parse(string $source): array
    {
        $out    = [];
        $offset = 0;
        $length = strlen($source);
        while ($offset < $length && count($out) < 20) {
            if (preg_match(self::TOKEN, $source, $m, PREG_UNMATCHED_AS_NULL, $offset) !== 1) {
                break;
            }
            $offset += strlen($m[0]);
            if ($m[1] === '#') {
                $out['id'] = self::cut((string) $m[2]);
            } elseif ($m[1] === '.') {
                $out['class'] = trim(($out['class'] ?? '') . ' ' . self::cut((string) $m[2]));
            } else {
                $out[(string) $m[3]] = self::cut($m[4] ?? $m[5] ?? $m[6] ?? '');
            }
        }

        return $out;
    }

    private static function cut(string $value): string
    {
        return mb_substr($value, 0, 500);
    }
}
