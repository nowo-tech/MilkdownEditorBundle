<?php

declare(strict_types=1);

namespace Nowo\MilkdownEditorBundle\Markdown\Resolver;

/**
 * Resolves `[[wiki:<uuid>]]` links for the current viewer. Called once per rendered document with every id it
 * contains; ids missing from the answer render as *Content not visible* (never the page's title).
 *
 * @author Héctor Franco Aceituno <hectorfranco@nowo.tech>
 */
interface PageResolverInterface
{
    /**
     * @param list<string> $ids Page UUIDs (unique)
     *
     * @return array<string, ResolvedPage> The pages the viewer may read, by id
     */
    public function resolvePages(array $ids): array;
}
