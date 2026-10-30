<?php

declare(strict_types=1);

namespace Nowo\MilkdownEditorBundle\Markdown\Node;

use League\CommonMark\Node\Block\AbstractBlock;

/**
 * `:::name[label]{attributes}` … `:::` (callout, details, align and unknown names, rendered as a plain `div`).
 *
 * @author Héctor Franco Aceituno <hectorfranco@nowo.tech>
 */
final class ContainerDirective extends AbstractBlock
{
    /**
     * @param string $name Directive name (`align` for `::: {align=…}`)
     * @param string $label Text between brackets ('' for none)
     * @param array<string, string> $attributes Parsed attributes
     * @param int $fenceLength Number of colons of the opening fence (the closing one needs as many)
     */
    public function __construct(
        public readonly string $name,
        public readonly string $label = '',
        public readonly array $attributes = [],
        public readonly int $fenceLength = 3,
    ) {
        parent::__construct();
    }
}
