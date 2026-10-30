<?php

declare(strict_types=1);

namespace Nowo\MilkdownEditorBundle\Markdown\Resolver;

/**
 * A page the current viewer may read: its current title and URL.
 *
 * @author Héctor Franco Aceituno <hectorfranco@nowo.tech>
 */
final readonly class ResolvedPage
{
    /**
     * @param string $title Current page title
     * @param string $url Page URL (relative or http(s); other schemes are dropped by the renderer)
     */
    public function __construct(public string $title, public string $url)
    {
    }
}
