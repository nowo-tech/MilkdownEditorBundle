<?php

declare(strict_types=1);

namespace Nowo\MilkdownEditorBundle\Markdown\Resolver;

/**
 * Decides which `:tabler-<name>:` shortcodes render as SVG and where the sprite is.
 *
 * @author Héctor Franco Aceituno <hectorfranco@nowo.tech>
 */
interface IconResolverInterface
{
    /**
     * Sprite URL for `name` (symbols `tabler-<name>`), or null to keep the shortcode as text.
     */
    public function spriteUrl(string $name): ?string;
}
