<?php

declare(strict_types=1);

namespace Nowo\MilkdownEditorBundle\Markdown\Resolver;

use Nowo\MilkdownEditorBundle\Markdown\HostSchemes;

/**
 * Default {@see FilePreviewResolverInterface}: host references of a scheme with a `preview` template get that URL; the
 * host's preview endpoint checks the viewer (and answers 404 for types it cannot preview). Plain URLs get no preview.
 *
 * @author Héctor Franco Aceituno <hectorfranco@nowo.tech>
 */
final readonly class TemplateFilePreviewResolver implements FilePreviewResolverInterface
{
    /**
     * @param HostSchemes $schemes The configured host schemes
     */
    public function __construct(private HostSchemes $schemes)
    {
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
            $url = $file->reference === null ? null : $this->schemes->url($file->reference, 'preview');
            if ($url !== null) {
                $out[$file->href] = $url;
            }
        }

        return $out;
    }
}
