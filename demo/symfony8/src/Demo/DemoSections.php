<?php

declare(strict_types=1);

namespace App\Demo;

use Nowo\MilkdownEditorBundle\Markdown\Resolver\SectionResolverInterface;

/**
 * 1.18: the sections of the demo pages (the same for every readable page), for the link picker's step 2 and the
 * `Title › Section` labels of `[[wiki:<uuid>#<id>]]`. The renderer only asks about pages that resolved for the viewer.
 */
final readonly class DemoSections implements SectionResolverInterface
{
    /** Bare id => level and text. */
    public const SECTIONS = [
        'overview' => [2, 'Overview'],
        'setup'    => [2, 'Set up'],
        'año'      => [3, 'Año nuevo (a Unicode id)'],
        'rollback' => [2, 'Roll back'],
    ];

    /**
     * @return list<array{id: string, level: int, text: string}>
     */
    public function sectionsOf(string $pageId): array
    {
        if (!isset(DemoDirectory::PAGES[$pageId]) || $pageId === DemoDirectory::FORBIDDEN) {
            return [];
        }
        $out = [];
        foreach (self::SECTIONS as $id => [$level, $text]) {
            $out[] = ['id' => (string) $id, 'level' => $level, 'text' => $text];
        }

        return $out;
    }

    public function sectionTitles(array $anchors): array
    {
        $out = [];
        foreach ($anchors as $pageId => $ids) {
            foreach ($ids as $id) {
                if (isset(self::SECTIONS[$id]) && $pageId !== DemoDirectory::FORBIDDEN) {
                    $out[$pageId][$id] = self::SECTIONS[$id][1];
                }
            }
        }

        return $out;
    }
}
