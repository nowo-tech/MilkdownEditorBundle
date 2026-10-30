<?php

declare(strict_types=1);

namespace Nowo\MilkdownEditorBundle\Markdown\Node;

use League\CommonMark\Node\Inline\AbstractInline;

/**
 * `:name[label]{attributes}`: `:mark[…]{color=…}` is a highlight; other names keep their label only.
 *
 * @author Héctor Franco Aceituno <hectorfranco@nowo.tech>
 */
final class TextDirective extends AbstractInline
{
    /**
     * @param string $name Directive name
     * @param array<string, string> $attributes Parsed attributes
     */
    public function __construct(public readonly string $name, public readonly array $attributes = [])
    {
        parent::__construct();
    }
}
