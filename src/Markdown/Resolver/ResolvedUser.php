<?php

declare(strict_types=1);

namespace Nowo\MilkdownEditorBundle\Markdown\Resolver;

/**
 * A mentioned user: display name and an optional profile URL.
 *
 * @author Héctor Franco Aceituno <hectorfranco@nowo.tech>
 */
final readonly class ResolvedUser
{
    /**
     * @param string $name Display name (shown as the mention's title)
     * @param string|null $url Profile URL, or null for a mention without link
     */
    public function __construct(public string $name, public ?string $url = null)
    {
    }
}
