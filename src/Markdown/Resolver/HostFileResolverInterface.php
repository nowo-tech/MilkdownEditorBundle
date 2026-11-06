<?php

declare(strict_types=1);

namespace Nowo\MilkdownEditorBundle\Markdown\Resolver;

/**
 * Resolves host references (`host-file:<id>`, any allow-listed scheme of `markdown.host_schemes`) for the current
 * viewer, in one batch per document (1.9, ME-5): images, links and file cards. A reference missing from the answer is
 * one the viewer may not read (or that does not exist): images and file cards render *Content not visible*, links lose
 * their target. The default implementation ({@see TemplateHostFileResolver}) builds URLs from the configured
 * templates and lets the host's file endpoint decide; implement this interface to check permissions here and to give
 * per-viewer (e.g. pre-signed) URLs and image sizes.
 *
 * @author Héctor Franco Aceituno <hectorfranco@nowo.tech>
 */
interface HostFileResolverInterface
{
    /**
     * @param list<string> $references `scheme:id` references (scheme lower case, at most `max_references`)
     *
     * @return array<string, ResolvedFile> by reference; missing = not visible
     */
    public function resolveFiles(array $references): array;
}
