<?php

declare(strict_types=1);

namespace Nowo\MilkdownEditorBundle\Markdown\Parser;

use League\CommonMark\Node\Block\AbstractBlock;
use League\CommonMark\Parser\Block\AbstractBlockContinueParser;
use League\CommonMark\Parser\Block\BlockContinue;
use League\CommonMark\Parser\Block\BlockContinueParserInterface;
use League\CommonMark\Parser\Cursor;
use Nowo\MilkdownEditorBundle\Markdown\Node\ContainerDirective;

use function strlen;

/**
 * Keeps a container directive open until a fence of at least as many colons (`remark-directive` semantics: an
 * outer container uses more colons than the ones it holds).
 *
 * @author Héctor Franco Aceituno <hectorfranco@nowo.tech>
 */
final class ContainerDirectiveParser extends AbstractBlockContinueParser
{
    /**
     * @param ContainerDirective $block The container being parsed
     */
    public function __construct(private readonly ContainerDirective $block)
    {
    }

    /**
     * The container node.
     */
    public function getBlock(): ContainerDirective
    {
        return $this->block;
    }

    /**
     * Containers hold other blocks.
     */
    public function isContainer(): bool
    {
        return true;
    }

    /**
     * Any block may be nested.
     *
     * @param AbstractBlock $childBlock The candidate child
     */
    public function canContain(AbstractBlock $childBlock): bool
    {
        return true;
    }

    /**
     * Finishes on the closing fence, continues otherwise.
     *
     * @param Cursor $cursor The line cursor
     * @param BlockContinueParserInterface $activeBlockParser The innermost open parser
     */
    public function tryContinue(Cursor $cursor, BlockContinueParserInterface $activeBlockParser): BlockContinue
    {
        if (!$cursor->isIndented() && preg_match('/^[ \t]*(:{3,})[ \t]*$/', $cursor->getRemainder(), $m) === 1 && strlen($m[1]) >= $this->block->fenceLength) {
            $cursor->advanceToEnd();

            return BlockContinue::finished();
        }

        return BlockContinue::at($cursor);
    }
}
