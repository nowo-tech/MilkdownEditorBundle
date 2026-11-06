<?php

declare(strict_types=1);

namespace Nowo\MilkdownEditorBundle\Markdown\Resolver;

use Nowo\MilkdownEditorBundle\Markdown\HostSchemes;

/**
 * Default {@see HostFileResolverInterface}: every reference of an allow-listed scheme resolves to its URL templates
 * (`file` for links and cards, `image` for images); the host's file endpoint checks the viewer.
 *
 * @author Héctor Franco Aceituno <hectorfranco@nowo.tech>
 */
final readonly class TemplateHostFileResolver implements HostFileResolverInterface
{
    /**
     * @param HostSchemes $schemes The configured host schemes
     */
    public function __construct(private HostSchemes $schemes)
    {
    }

    /**
     * Builds the URLs of the references from the templates.
     *
     * @param list<string> $references `scheme:id` references
     *
     * @return array<string, ResolvedFile>
     */
    public function resolveFiles(array $references): array
    {
        $out = [];
        foreach ($references as $reference) {
            $file  = $this->schemes->url($reference, 'file');
            $image = $this->schemes->url($reference, 'image');
            if ($file !== null || $image !== null) {
                $out[$reference] = new ResolvedFile($file ?? (string) $image, $image);
            }
        }

        return $out;
    }
}
