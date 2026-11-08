<?php

declare(strict_types=1);

namespace Nowo\MilkdownEditorBundle\Markdown;

/**
 * 1.13: what {@see HostSchemes::classify()} found in an image, link or card URL: a host value (a `scheme:` value or a
 * URL of `host_url_patterns`), its `scheme:id` reference (null: a value no viewer sees, such as an invalid id, a
 * matching URL over the length bound or a pattern that failed to run) and whether a visible one keeps the author's URL.
 *
 * @author Héctor Franco Aceituno <hectorfranco@nowo.tech>
 */
final readonly class HostValue
{
    /**
     * @param string|null $reference The `scheme:id` reference, or null when the value is refused without asking the resolver
     * @param bool $keepsWrittenUrl A visible value keeps the author's URL (`url: written` patterns)
     * @param bool $scheme The value uses a host scheme (`app-file:<id>`), not a URL pattern
     */
    public function __construct(
        public ?string $reference,
        public bool $keepsWrittenUrl = false,
        public bool $scheme = false,
    ) {
    }
}
