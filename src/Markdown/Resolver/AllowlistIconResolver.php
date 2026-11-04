<?php

declare(strict_types=1);

namespace Nowo\MilkdownEditorBundle\Markdown\Resolver;

/**
 * Icon resolver from configuration (`nowo_milkdown_editor.markdown.icon_sprite_url` + `icons`, and since 1.7 the
 * bundled Tabler catalog with `markdown.icon_catalog`).
 *
 * @author Héctor Franco Aceituno <hectorfranco@nowo.tech>
 */
final class AllowlistIconResolver implements IconResolverInterface
{
    /** @var array<string, true> */
    private readonly array $allowed;

    /**
     * @param string|null $spriteUrl Sprite URL (null: every icon stays text)
     * @param list<string> $icons Allowlisted names
     * @param TablerCatalog|null $catalog 1.7 `markdown.icon_catalog`: names outside the allowlist render from the bundled catalog
     */
    public function __construct(private readonly ?string $spriteUrl = null, array $icons = [], private readonly ?TablerCatalog $catalog = null)
    {
        $this->allowed = array_fill_keys($icons, true);
    }

    /**
     * The sprite URL when `name` is allowlisted, else the catalog shard when the catalog is on and has `name`.
     */
    public function spriteUrl(string $name): ?string
    {
        if ($this->spriteUrl !== null && isset($this->allowed[$name])) {
            return $this->spriteUrl;
        }

        return $this->catalog?->spriteUrl($name);
    }
}
