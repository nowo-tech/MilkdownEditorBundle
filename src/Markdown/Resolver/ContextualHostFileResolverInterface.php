<?php

declare(strict_types=1);

namespace Nowo\MilkdownEditorBundle\Markdown\Resolver;

/**
 * 1.13: a {@see HostFileResolverInterface} that also gets the context of the render in progress (from the
 * {@see RenderContextProviderInterface}), so it can narrow what the viewer sees to that context — for instance, a
 * wiki's API token may reach fewer spaces than its person. The renderer calls {@see self::resolveFilesInContext()}
 * instead of {@see HostFileResolverInterface::resolveFiles()}; `resolveFiles()` stays for callers without a context.
 * A reference missing from the answer renders *Content not visible*, with no URL, alt text or name.
 *
 * @author Héctor Franco Aceituno <hectorfranco@nowo.tech>
 */
interface ContextualHostFileResolverInterface extends HostFileResolverInterface
{
    /**
     * @param list<string> $references `scheme:id` references (scheme lower case, at most `max_references`)
     * @param object|null $context The host's context of the render ({@see RenderContextProviderInterface::renderContext()}), or null
     *
     * @return array<string, ResolvedFile> by reference; missing = not visible
     */
    public function resolveFilesInContext(array $references, ?object $context): array;
}
