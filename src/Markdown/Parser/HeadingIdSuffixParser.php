<?php

declare(strict_types=1);

namespace Nowo\MilkdownEditorBundle\Markdown\Parser;

use League\CommonMark\Extension\CommonMark\Node\Block\Heading;
use League\CommonMark\Node\Inline\Text;
use League\CommonMark\Parser\Inline\InlineParserInterface;
use League\CommonMark\Parser\Inline\InlineParserMatch;
use League\CommonMark\Parser\InlineParserContext;
use Nowo\MilkdownEditorBundle\Markdown\HeadingIds;

use function rtrim;

/**
 * 1.18: the explicit heading id suffix, `## Install guide {#setup}` (the form of Pandoc, kramdown, PHP Markdown Extra and
 * Docusaurus). Only this exact form counts: spaces, then `{#` + an id ({@see HeadingIds::ANCHOR}) + `}` at the very end
 * of an ATX or setext heading's text. No other attribute (no class, no key=value). A literal `{#x}` at the end of a
 * heading is written `\{#x}`: the backslash comes before the brace, so this pattern does not match it.
 *
 * The suffix is removed from the heading's text and kept in `$heading->data` ({@see HeadingIds::DATA_KEY}), where
 * {@see HeadingIds} (and a host's own listener) reads it. A `nowo-h-` prefix is dropped; anywhere else than at the end
 * of a heading, or with an invalid id, the text stays as it is. The pattern is anchored at the end and linear.
 *
 * @author Héctor Franco Aceituno <hectorfranco@nowo.tech>
 */
final class HeadingIdSuffixParser implements InlineParserInterface
{
    /**
     * Spaces, then the suffix, at the end of the inline content (a match starts at the first space of a run: linear).
     */
    public function getMatchDefinition(): InlineParserMatch
    {
        return InlineParserMatch::regex('(?<![ \t])[ \t]+\{#(' . HeadingIds::ANCHOR . ')\}$')->caseSensitive();
    }

    /**
     * Takes the suffix off a heading and keeps its id.
     *
     * @param InlineParserContext $inlineContext The parser context
     */
    public function parse(InlineParserContext $inlineContext): bool
    {
        $heading = $inlineContext->getContainer();
        $id      = HeadingIds::normalise((string) ($inlineContext->getSubMatches()[0] ?? ''));
        if (!$heading instanceof Heading || $id === '' || $inlineContext->getCursor()->getRemainder() !== $inlineContext->getFullMatch()) {
            return false;
        }
        $heading->data->set(HeadingIds::DATA_KEY, $id);
        $inlineContext->getCursor()->advanceBy($inlineContext->getFullMatchLength());
        // The spaces before the suffix are not heading text.
        $last = $heading->lastChild();
        if ($last instanceof Text) {
            $last->setLiteral(rtrim($last->getLiteral(), " \t"));
        }

        return true;
    }
}
