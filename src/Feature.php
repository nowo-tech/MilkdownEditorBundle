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
    case Toolbar      = 'toolbar';
    case TopBar       = 'top_bar';
    case LinkTooltip  = 'link_tooltip';
    case Table        = 'table';
    case CodeMirror   = 'code_mirror';
    case Math         = 'math';
    case Mermaid      = 'mermaid';
    case Placeholder  = 'placeholder';
    case Cursor       = 'cursor';
    case SlashMenu    = 'slash_menu';
    case ContextMenu  = 'context_menu';
    case BlockActions = 'block_actions';
    case BlockDrag    = 'block_drag';
    case Colors       = 'colors';
    /** 1.5: smart paste of Markdown, Paste / Copy as Markdown (Ctrl / ⌘ + Alt + V / C). */
    case MarkdownClipboard = 'markdown_clipboard';
    /** 1.5: the Insert group of the context menu (needs `context_menu`). */
    case InsertMenu = 'insert_menu';
    /** 1.6: inline comment anchors, highlights, events and the optional thread component. */
    case Comments = 'comments';
    /** 1.6: read-only view of an old version with a banner (never with `comments`). */
    case VersionView = 'version_view';
    /** 1.6: prefixed heading ids (`nowo-h-<slug>`), the same slugs as `markdown.heading_ids`. */
    case HeadingIds = 'heading_ids';

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
