<?php

declare(strict_types=1);

namespace Nowo\MilkdownEditorBundle\Markdown\Resolver;

/**
 * Says, per file card with `view="preview"`, whether a preview exists and the current viewer may see it, and where
 * (1.9, ME-6), in one batch per document. The bundle never fetches or parses files: the preview is a host page embedded
 * in a sandboxed `<iframe>`. A card missing from the answer renders as a plain card. Default:
 * {@see TemplateFilePreviewResolver} (the `preview` template of host references; plain URLs get no preview).
 *
 * @author Héctor Franco Aceituno <hectorfranco@nowo.tech>
 */
interface FilePreviewResolverInterface
{
    /**
     * @param list<FileReference> $files Cards asking for a preview
     *
     * @return array<string, string> preview URL by {@see FileReference::$href} (relative or http(s)); missing = no preview
     */
    public function resolvePreviews(array $files): array;
}
