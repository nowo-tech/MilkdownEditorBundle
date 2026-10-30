<?php

declare(strict_types=1);

namespace Nowo\MilkdownEditorBundle;

/**
 * Colour scheme of the widget: light, dark or `auto` (follows `prefers-color-scheme` or a `[data-theme]` ancestor).
 *
 * @author Héctor Franco Aceituno <hectorfranco@nowo.tech>
 */
enum Theme: string
{
    case Light = 'light';
    case Dark  = 'dark';
    case Auto  = 'auto';

    /**
     * Every value, in declaration order.
     *
     * @return list<string>
     */
    public static function values(): array
    {
        return array_map(static fn (self $t): string => $t->value, self::cases());
    }
}
