<?php

declare(strict_types=1);

namespace Nowo\MilkdownEditorBundle\Markdown\Node;

use League\CommonMark\Node\Block\AbstractBlock;
use Nowo\MilkdownEditorBundle\Markdown\Directive\DirectiveRendererInterface;

/**
 * `::name[label]{attributes}` on its own line: an embedded block rendered by a host
 * {@see DirectiveRendererInterface} (e.g. a live issue block).
 *
 * @author Héctor Franco Aceituno <hectorfranco@nowo.tech>
 */
final class LeafDirective extends AbstractBlock
{
    /**
     * @param string $name Directive name
     * @param string $label Text between brackets ('' for none)
     * @param array<string, string> $attributes Parsed attributes
     */
    public function __construct(
        public readonly string $name,
        public readonly string $label = '',
        public readonly array $attributes = [],
    ) {
        parent::__construct();
    }
}
