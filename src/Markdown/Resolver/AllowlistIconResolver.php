<?php

declare(strict_types=1);

namespace Nowo\MilkdownEditorBundle\Markdown\Resolver;

/**
 * Icon resolver from configuration (`nowo_milkdown_editor.markdown.icon_sprite_url` + `icons`).
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
     */
    public function __construct(private readonly ?string $spriteUrl = null, array $icons = [])
    {
        $this->allowed = array_fill_keys($icons, true);
    }

    /**
     * The sprite URL when `name` is allowlisted.
     */
    public function spriteUrl(string $name): ?string
    {
        return $this->spriteUrl !== null && isset($this->allowed[$name]) ? $this->spriteUrl : null;
    }
}
