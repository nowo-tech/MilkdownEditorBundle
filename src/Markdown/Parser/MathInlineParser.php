<?php

declare(strict_types=1);

namespace Nowo\MilkdownEditorBundle\Markdown\Parser;

use League\CommonMark\Parser\Inline\InlineParserInterface;
use League\CommonMark\Parser\Inline\InlineParserMatch;
use League\CommonMark\Parser\InlineParserContext;
use Nowo\MilkdownEditorBundle\Markdown\Node\Math;

/**
 * `$tex$` with the pandoc rule (no space after the opening `$` or before the closing one, no digit right after it),
 * so prices such as "$5 and $10" stay text.
 *
 * @author Héctor Franco Aceituno <hectorfranco@nowo.tech>
 */
final class MathInlineParser implements InlineParserInterface
{
    /**
     * Single-line `$…$`, not `$$`.
     */
    public function getMatchDefinition(): InlineParserMatch
    {
        return InlineParserMatch::regex('\$(?!\$)([^\s$](?:[^$\n]*[^\s$\\\\])?)\$(?![\d$])');
    }

    /**
     * Appends a {@see Math} node.
     *
     * @param InlineParserContext $inlineContext The parser context
     */
    public function parse(InlineParserContext $inlineContext): bool
    {
        if ($inlineContext->getCursor()->peek(-1) === '$') {
            return false;
        }
        $inlineContext->getCursor()->advanceBy($inlineContext->getFullMatchLength());
        $inlineContext->getContainer()->appendChild(new Math((string) $inlineContext->getSubMatches()[0]));

        return true;
    }
}
