<?php

declare(strict_types=1);

namespace Nowo\MilkdownEditorBundle\Markdown\Node;

use League\CommonMark\Node\Inline\AbstractInline;

/**
 * `:tabler-<name>:`: an icon from the configured sprite when the name is allowlisted, the shortcode text otherwise.
 *
 * @author Héctor Franco Aceituno <hectorfranco@nowo.tech>
 */
final class TablerIcon extends AbstractInline
{
    /**
     * @param string $name Icon name (lower-case words joined by hyphens)
     */
    public function __construct(public readonly string $name)
    {
        parent::__construct();
    }
}
