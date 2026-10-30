<?php

declare(strict_types=1);

namespace Nowo\MilkdownEditorBundle;

/**
 * Optional editor features (form option and profile key `features`).
 *
 * @author Héctor Franco Aceituno <hectorfranco@nowo.tech>
 */
enum Feature: string
{
    case Toolbar     = 'toolbar';
    case TopBar      = 'top_bar';
    case LinkTooltip = 'link_tooltip';
    case Table       = 'table';
    case CodeMirror  = 'code_mirror';
    case Math        = 'math';
    case Mermaid     = 'mermaid';
    case Placeholder = 'placeholder';
    case Cursor      = 'cursor';
    case SlashMenu   = 'slash_menu';

    /**
     * Features enabled when a profile does not list its own.
     *
     * @return list<self>
     */
    public static function defaults(): array
    {
        return [self::Toolbar, self::LinkTooltip, self::Table, self::CodeMirror, self::Placeholder, self::Cursor, self::SlashMenu];
    }

    /**
     * Every value, in declaration order.
     *
     * @return list<string>
     */
    public static function values(): array
    {
        return array_map(static fn (self $f): string => $f->value, self::cases());
    }

    /**
     * Whether the feature renders inside a code block preview (and therefore needs CodeMirror).
     */
    public function needsCodeMirror(): bool
    {
        return $this === self::Math || $this === self::Mermaid;
    }
}
