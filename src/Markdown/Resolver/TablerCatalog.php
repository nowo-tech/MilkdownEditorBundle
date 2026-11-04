<?php

declare(strict_types=1);

namespace Nowo\MilkdownEditorBundle\Markdown\Resolver;

use Nowo\MilkdownEditorBundle\DependencyInjection\Configuration;
use Nowo\MilkdownEditorBundle\DependencyInjection\NowoMilkdownEditorExtension;
use Symfony\Component\Asset\Packages;

use function count;
use function is_array;
use function is_file;
use function is_string;

/**
 * The bundled Tabler outline catalog (1.7, `icon_catalog`): names from `public/icons/tabler-outline.json` and the URL
 * of the sprite shard holding each icon (`icons/tabler-<first character>.svg` in the `nowo_milkdown_editor` asset
 * package). Tabler Icons are MIT-licensed (`public/icons/LICENSE-tabler.txt`).
 *
 * @author Héctor Franco Aceituno <hectorfranco@nowo.tech>
 */
final readonly class TablerCatalog
{
    /** Names list written by the asset build. */
    public const NAMES_FILE = __DIR__ . '/../../Resources/public/icons/tabler-outline.json';

    /** @var array<string, true> */
    private array $names;

    /**
     * @param Packages|null $packages Asset packages (null: the default public path `/bundles/nowomilkdowneditor`)
     * @param string $namesFile JSON `{"version": "…", "names": ["…"]}`
     */
    public function __construct(private ?Packages $packages = null, string $namesFile = self::NAMES_FILE)
    {
        $this->names = $this->load($namesFile);
    }

    /**
     * Whether `name` is a catalog icon.
     */
    public function has(string $name): bool
    {
        return isset($this->names[$name]);
    }

    /**
     * Number of icons in the catalog.
     */
    public function count(): int
    {
        return count($this->names);
    }

    /**
     * URL of the sprite shard holding `name` (symbol `tabler-<name>`), or null for a name outside the catalog.
     */
    public function spriteUrl(string $name): ?string
    {
        if (!$this->has($name)) {
            return null;
        }
        $path = 'icons/tabler-' . $name[0] . '.svg';

        return $this->packages instanceof Packages
            ? $this->packages->getUrl($path, Configuration::ALIAS)
            : NowoMilkdownEditorExtension::ASSET_BASE_PATH . '/' . $path;
    }

    /**
     * @return array<string, true>
     */
    private function load(string $file): array
    {
        $json = is_file($file) ? file_get_contents($file) : false;
        $data = is_string($json) ? json_decode($json, true) : null;
        $out  = [];
        foreach (is_array($data) && is_array($data['names'] ?? null) ? $data['names'] : [] as $name) {
            if (is_string($name) && preg_match(Configuration::ICON_PATTERN, $name) === 1) {
                $out[$name] = true;
            }
        }

        return $out;
    }
}
