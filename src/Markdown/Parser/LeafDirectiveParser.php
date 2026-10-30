<?php

declare(strict_types=1);

namespace Nowo\MilkdownEditorBundle\Markdown\Parser;

use League\CommonMark\Parser\Block\AbstractBlockContinueParser;
use League\CommonMark\Parser\Block\BlockContinue;
use League\CommonMark\Parser\Block\BlockContinueParserInterface;
use League\CommonMark\Parser\Cursor;
use Nowo\MilkdownEditorBundle\Markdown\Node\LeafDirective;

/**
 * A leaf directive is one line: it never continues.
 *
 * @author Héctor Franco Aceituno <hectorfranco@nowo.tech>
 */
final class LeafDirectiveParser extends AbstractBlockContinueParser
{
    /**
     * @param LeafDirective $block The directive node
     */
    public function __construct(private readonly LeafDirective $block)
    {
    }

    /**
     * The directive node.
     */
    public function getBlock(): LeafDirective
    {
        return $this->block;
    }

    /**
     * Never continues past its line.
     *
     * @param Cursor $cursor The line cursor
     * @param BlockContinueParserInterface $activeBlockParser The innermost open parser
     */
    public function tryContinue(Cursor $cursor, BlockContinueParserInterface $activeBlockParser): ?BlockContinue
    {
        return BlockContinue::none();
    }
}
