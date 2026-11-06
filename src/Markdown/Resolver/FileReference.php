<?php

declare(strict_types=1);

namespace Nowo\MilkdownEditorBundle\Markdown\Resolver;

/**
 * A file card that asks for a preview (1.9, ME-6, `view="preview"`).
 *
 * @author Héctor Franco Aceituno <hectorfranco@nowo.tech>
 */
final readonly class FileReference
{
    /**
     * @param string $href The card's `href` as written (a host reference such as `host-file:<id>`, or a URL)
     * @param string $url The URL the card links to for this viewer (resolved)
     * @param string $name The file name (cleaned)
     * @param string $type The MIME type from the card ('' when unknown)
     * @param string|null $reference The `scheme:id` host reference, or null for a plain URL
     */
    public function __construct(
        public string $href,
        public string $url,
        public string $name,
        public string $type = '',
        public ?string $reference = null,
    ) {
    }
}
