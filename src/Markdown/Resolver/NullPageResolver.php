<?php

declare(strict_types=1);

namespace Nowo\MilkdownEditorBundle\Markdown\Resolver;

/**
 * Default page resolver: no page is visible (alias {@see PageResolverInterface} to the host's implementation).
 *
 * @author Héctor Franco Aceituno <hectorfranco@nowo.tech>
 */
final class NullPageResolver implements PageResolverInterface
{
    /**
     * @param list<string> $ids Page UUIDs
     *
     * @return array<string, ResolvedPage> Always empty
     */
    public function resolvePages(array $ids): array
    {
        return [];
    }
}
