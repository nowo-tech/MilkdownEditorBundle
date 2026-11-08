<?php

declare(strict_types=1);

namespace Nowo\MilkdownEditorBundle\Markdown\Resolver;

/**
 * 1.13: what the render in progress is rendering, for resolvers that depend on it (e.g. a wiki's space, page and the
 * reach of an API token). The bundle never reads the value: it hands it to a {@see ContextualHostFileResolverInterface}.
 * Point this interface at a host service (or pass one to the renderer) whose value lives only for the render (reset
 * between requests in worker mode). Without one, contextual resolvers get null.
 *
 * @author Héctor Franco Aceituno <hectorfranco@nowo.tech>
 */
interface RenderContextProviderInterface
{
    /**
     * The host's context of the render in progress, or null outside any.
     */
    public function renderContext(): ?object;
}
