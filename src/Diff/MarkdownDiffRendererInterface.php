<?php

declare(strict_types=1);

namespace Nowo\MilkdownEditorBundle\Diff;

/**
 * Rendered, dialect-aware diff of two Markdown documents (1.6, for version history). Both sides go through the
 * bundle's renderer with the per-viewer page / user resolvers; nothing is cached across calls.
 *
 * @author Héctor Franco Aceituno <hectorfranco@nowo.tech>
 */
interface MarkdownDiffRendererInterface
{
    /**
     * @param string $old The older Markdown
     * @param string $new The newer Markdown
     */
    public function render(string $old, string $new): MarkdownDiff;
}
