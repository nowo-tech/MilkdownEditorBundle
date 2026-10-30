<?php

declare(strict_types=1);

namespace Nowo\MilkdownEditorBundle\Markdown\Parser;

use League\CommonMark\Parser\Block\AbstractBlockContinueParser;
use League\CommonMark\Parser\Block\BlockContinue;
use League\CommonMark\Parser\Block\BlockContinueParserInterface;
use League\CommonMark\Parser\Cursor;
use Nowo\MilkdownEditorBundle\Markdown\Node\MathBlock;

/**
 * Collects the TeX lines of a `$$` block until the closing `$$` line.
 *
 * @author Héctor Franco Aceituno <hectorfranco@nowo.tech>
 */
final class MathBlockParser extends AbstractBlockContinueParser
{
    /** @var list<string> */
    private array $lines = [];

    /**
     * @param MathBlock $block The math block node
     */
    public function __construct(private readonly MathBlock $block)
    {
    }

    /**
     * The math block node.
     */
    public function getBlock(): MathBlock
    {
        return $this->block;
    }

    /**
     * Finishes on `$$`, continues otherwise.
     *
     * @param Cursor $cursor The line cursor
     * @param BlockContinueParserInterface $activeBlockParser The innermost open parser
     */
    public function tryContinue(Cursor $cursor, BlockContinueParserInterface $activeBlockParser): BlockContinue
    {
        if (preg_match('/^[ \t]*\$\$[ \t]*$/', $cursor->getRemainder()) === 1) {
            $cursor->advanceToEnd();

            return BlockContinue::finished();
        }

        return BlockContinue::at($cursor);
    }

    /**
     * Keeps one TeX line.
     *
     * @param string $line The line
     */
    public function addLine(string $line): void
    {
        // @igor-ignore - One parser object per math block of one document; never shared between requests
        $this->lines[] = $line;
    }

    /**
     * Stores the TeX on the node.
     */
    public function closeBlock(): void
    {
        // The opening `$$` line leaves an empty first line.
        if (($this->lines[0] ?? null) === '') {
            array_shift($this->lines);
        }
        // @igor-ignore - Writes the node of the document being parsed (per-document object)
        $this->block->tex = implode("\n", $this->lines);
    }
}
