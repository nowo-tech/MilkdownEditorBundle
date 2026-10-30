<?php

declare(strict_types=1);

namespace Nowo\MilkdownEditorBundle\Markdown\Node;

use League\CommonMark\Node\Inline\AbstractInline;
use Nowo\MilkdownEditorBundle\Markdown\Resolver\ResolvedUser;

/**
 * `@handle` (never inside an e-mail address): rendered as a mention when the user resolver knows the handle.
 *
 * @author Héctor Franco Aceituno <hectorfranco@nowo.tech>
 */
final class Mention extends AbstractInline
{
    /** The resolved user (null: unknown handle, rendered as plain text). */
    public ?ResolvedUser $user = null;

    /**
     * @param string $handle The handle without `@`
     */
    public function __construct(public readonly string $handle)
    {
        parent::__construct();
    }
}
