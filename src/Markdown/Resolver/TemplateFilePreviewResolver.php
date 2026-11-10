<?php

declare(strict_types=1);

namespace Nowo\MilkdownEditorBundle\Markdown\Resolver;

use Nowo\MilkdownEditorBundle\Markdown\FileCard;
use Nowo\MilkdownEditorBundle\Markdown\HostSchemes;
use Nowo\MilkdownEditorBundle\Markdown\HostValue;

/**
 * Default {@see FilePreviewResolverInterface}: host references of a scheme with a `preview` template get that URL; the
 * host's preview endpoint checks the viewer (and answers 404 for types it cannot preview). Plain URLs get no preview.
 *
 * 1.16 (spec 212 B): with `file_preview_written_urls`, a plain URL of a `url: written` pattern gets the `preview`
 * template URL of its matched id too (never the written URL); with `file_preview_types`, only cards of those types
 * ({@see FileCard::previewable()}).
 *
 * @author Héctor Franco Aceituno <hectorfranco@nowo.tech>
 */
final readonly class TemplateFilePreviewResolver implements FilePreviewResolverInterface
{
    /**
     * @param HostSchemes $schemes The configured host schemes
     * @param bool $writtenUrls 1.16: `markdown.file_preview_written_urls`
     * @param list<string> $types 1.16: `markdown.file_preview_types` (empty: any)
     */
    public function __construct(
        private HostSchemes $schemes,
        private bool $writtenUrls = false,
        private array $types = [],
    ) {
    }

    /**
     * Builds the preview URLs from the templates.
     *
     * @param list<FileReference> $files Cards asking for a preview
     *
     * @return array<string, string>
     */
    public function resolvePreviews(array $files): array
    {
        $out = [];
        foreach ($files as $file) {
            if (!FileCard::previewable($this->types, $file->name, $file->type, $file->href)) {
                continue;
            }
            $reference = $file->reference;
            if ($reference === null && $this->writtenUrls) {
                $value     = $this->schemes->classify($file->href);
                $reference = $value instanceof HostValue && $value->keepsWrittenUrl ? $value->reference : null;
            }
            $url = $reference === null ? null : $this->schemes->url($reference, 'preview');
            if ($url !== null) {
                $out[$file->href] = $url;
            }
        }

        return $out;
    }
}
