<?php

declare(strict_types=1);

namespace Nowo\MilkdownEditorBundle\Comment;

use InvalidArgumentException;

/**
 * A comment anchor that breaks the 1.6 contract (hosts answer 422).
 *
 * @author Héctor Franco Aceituno <hectorfranco@nowo.tech>
 */
final class InvalidCommentAnchorException extends InvalidArgumentException
{
}
