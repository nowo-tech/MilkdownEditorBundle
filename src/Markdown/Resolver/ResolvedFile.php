<?php

declare(strict_types=1);

namespace Nowo\MilkdownEditorBundle\Markdown\Resolver;

/**
 * A host file the viewer may read (1.9, ME-5): the URL that opens / downloads it and, for images, the URL of the
 * displayed variant and its intrinsic size (avoids layout shift). URLs must be relative or http(s); the renderer drops
 * anything else.
 *
 * @author Héctor Franco Aceituno <hectorfranco@nowo.tech>
 */
final readonly class ResolvedFile
{
    /**
     * @param string $url Open / download URL (links and file cards)
     * @param string|null $imageUrl Displayed image (null: `$url`)
     * @param int|null $width Intrinsic width in px of the displayed image
     * @param int|null $height Intrinsic height in px of the displayed image
     */
    public function __construct(
        public string $url,
        public ?string $imageUrl = null,
        public ?int $width = null,
        public ?int $height = null,
    ) {
    }
}
