<?php

declare(strict_types=1);

namespace Nowo\MilkdownEditorBundle\Markdown\Resolver;

/**
 * Resolves `@handle` mentions; called once per rendered document. Unknown handles stay plain text.
 *
 * @author Héctor Franco Aceituno <hectorfranco@nowo.tech>
 */
interface UserResolverInterface
{
    /**
     * @param list<string> $handles Handles without `@` (unique)
     *
     * @return array<string, ResolvedUser> Known users, by handle
     */
    public function resolveUsers(array $handles): array;
}
