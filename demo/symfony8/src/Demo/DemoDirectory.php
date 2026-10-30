<?php

declare(strict_types=1);

namespace App\Demo;

use Nowo\MilkdownEditorBundle\Markdown\Resolver\PageResolverInterface;
use Nowo\MilkdownEditorBundle\Markdown\Resolver\ResolvedPage;
use Nowo\MilkdownEditorBundle\Markdown\Resolver\ResolvedUser;
use Nowo\MilkdownEditorBundle\Markdown\Resolver\UserResolverInterface;

/**
 * In-memory pages and people of the demo. One page is "forbidden" for the viewer: the editor and the renderer
 * show *Content not visible* for it, never its title.
 */
final class DemoDirectory implements PageResolverInterface, UserResolverInterface
{
    public const PAGES = [
        '0b6f4f0e-3c55-4d0a-9a43-1f7a2c9e8d10' => 'Architecture',
        '5d2c8a1e-7f0b-4a5e-b6c9-2e4d1f0a9b33' => 'Installation guide',
        '8e1d7c3b-2a4f-4b6e-9c0d-1f2e3a4b5c6d' => 'Release process',
        'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d' => 'Incident runbook',
        'c0ffee00-1234-4abc-8def-001122334455' => 'Secret roadmap',
    ];
    public const FORBIDDEN = 'c0ffee00-1234-4abc-8def-001122334455';

    public const USERS = [
        'ada'      => 'Ada Lovelace',
        'grace'    => 'Grace Hopper',
        'linus'    => 'Linus Torvalds',
        'margaret' => 'Margaret Hamilton',
    ];

    /**
     * Pages whose title contains `$query`, readable by the viewer (at most 10).
     *
     * @return list<array{id: string, label: string, url: string}>
     */
    public function searchPages(string $query): array
    {
        $out = [];
        foreach (self::PAGES as $id => $title) {
            if ($id !== self::FORBIDDEN && ($query === '' || stripos($title, $query) !== false)) {
                $out[] = ['id' => $id, 'label' => $title, 'url' => '/pages/' . $id];
            }
        }

        return \array_slice($out, 0, 10);
    }

    /**
     * People whose handle or name contains `$query` (at most 10).
     *
     * @return list<array{id: string, label: string}>
     */
    public function searchUsers(string $query): array
    {
        $out = [];
        foreach (self::USERS as $handle => $name) {
            if ($query === '' || stripos($handle . ' ' . $name, $query) !== false) {
                $out[] = ['id' => $handle, 'label' => $name];
            }
        }

        return \array_slice($out, 0, 10);
    }

    public function resolvePages(array $ids): array
    {
        $out = [];
        foreach ($ids as $id) {
            if (isset(self::PAGES[$id]) && $id !== self::FORBIDDEN) {
                $out[$id] = new ResolvedPage(self::PAGES[$id], '/pages/' . $id);
            }
        }

        return $out;
    }

    public function resolveUsers(array $handles): array
    {
        $out = [];
        foreach ($handles as $handle) {
            if (isset(self::USERS[$handle])) {
                $out[$handle] = new ResolvedUser(self::USERS[$handle]);
            }
        }

        return $out;
    }
}
