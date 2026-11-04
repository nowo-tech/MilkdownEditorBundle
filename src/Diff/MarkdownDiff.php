<?php

declare(strict_types=1);

namespace Nowo\MilkdownEditorBundle\Diff;

/**
 * Result of {@see MarkdownDiffRendererInterface::render()} (1.6).
 *
 * @author Héctor Franco Aceituno <hectorfranco@nowo.tech>
 */
final readonly class MarkdownDiff
{
    /**
     * @param string $html Safe HTML of the diff (markup documented in docs/USAGE.md, stable for sanitiser allow-lists)
     * @param int $changes Number of changed blocks (added, removed or changed)
     * @param bool $fallback True when the documents were too large or too different: `$html` is an escaped line diff
     */
    public function __construct(
        public string $html,
        public int $changes,
        public bool $fallback,
    ) {
    }
}
