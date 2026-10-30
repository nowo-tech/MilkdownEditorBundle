<?php

declare(strict_types=1);

namespace Nowo\MilkdownEditorBundle\Markdown\Node;

use League\CommonMark\Node\Block\AbstractBlock;

/**
 * Block math between `$$` lines: rendered as escaped TeX in `<div data-math="block">`.
 *
 * @author Héctor Franco Aceituno <hectorfranco@nowo.tech>
 */
final class MathBlock extends AbstractBlock
{
    /** The TeX source (lines joined with `\n`). */
    public string $tex = '';
}
