<?php

declare(strict_types=1);

namespace Nowo\MilkdownEditorBundle\Markdown\Resolver;

/**
 * Default user resolver: no handle is known, mentions stay text (alias {@see UserResolverInterface} to the host's).
 *
 * @author Héctor Franco Aceituno <hectorfranco@nowo.tech>
 */
final class NullUserResolver implements UserResolverInterface
{
    /**
     * @param list<string> $handles Handles
     *
     * @return array<string, ResolvedUser> Always empty
     */
    public function resolveUsers(array $handles): array
    {
        return [];
    }
}
