<?php

declare(strict_types=1);

namespace Nowo\MilkdownEditorBundle\Markdown;

/**
 * Renders Markdown of the Milkdown dialect to safe HTML.
 *
 * @author Héctor Franco Aceituno <hectorfranco@nowo.tech>
 */
interface MarkdownRendererInterface
{
    /**
     * Safe HTML for `$markdown` (raw HTML escaped or stripped, unsafe links dropped, references resolved per viewer).
     */
    public function render(string $markdown): string;
}
