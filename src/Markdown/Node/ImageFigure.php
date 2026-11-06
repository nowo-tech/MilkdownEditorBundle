<?php

declare(strict_types=1);

namespace Nowo\MilkdownEditorBundle\Markdown\Node;

use League\CommonMark\Node\Block\AbstractBlock;

/**
 * A standalone image as a figure (1.9, `markdown.image_block`): `![alt](src "caption"){width=50% align=center}` on a
 * paragraph of its own. The image is the child; the caption is its title.
 *
 * @author Héctor Franco Aceituno <hectorfranco@nowo.tech>
 */
final class ImageFigure extends AbstractBlock
{
    /**
     * @param string $width `25%`, `50%`, `75%`, `100%`, `<n>px` (16–2000) or '' (natural size)
     * @param string $align `left`, `center`, `right` or '' (default: center)
     * @param string $caption Caption (the image title), plain text
     */
    public function __construct(
        public readonly string $width = '',
        public readonly string $align = '',
        public readonly string $caption = '',
    ) {
        parent::__construct();
    }
}
