<?php

declare(strict_types=1);

namespace Nowo\MilkdownEditorBundle\Markdown\Node;

use League\CommonMark\Node\Inline\AbstractInline;

/**
 * A host image the viewer may not read (1.9, ME-5): renders the neutral *Content not visible* placeholder.
 *
 * @author Héctor Franco Aceituno <hectorfranco@nowo.tech>
 */
final class HiddenReference extends AbstractInline
{
}
