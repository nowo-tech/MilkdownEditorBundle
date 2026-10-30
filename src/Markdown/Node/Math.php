<?php

declare(strict_types=1);

namespace Nowo\MilkdownEditorBundle\Markdown\Node;

use League\CommonMark\Node\Inline\AbstractInline;

/**
 * Inline math `$…$`: rendered as escaped TeX in `<span data-math="inline">` (KaTeX runs in the browser).
 *
 * @author Héctor Franco Aceituno <hectorfranco@nowo.tech>
 */
final class Math extends AbstractInline
{
    /**
     * @param string $tex The TeX source
     */
    public function __construct(public readonly string $tex)
    {
        parent::__construct();
    }
}
