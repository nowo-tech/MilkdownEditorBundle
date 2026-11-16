<?php

declare(strict_types=1);

namespace Nowo\MilkdownEditorBundle\Markdown\Parser;

use League\CommonMark\Parser\Inline\InlineParserInterface;
use League\CommonMark\Parser\Inline\InlineParserMatch;
use League\CommonMark\Parser\InlineParserContext;
use Nowo\MilkdownEditorBundle\Markdown\HeadingIds;
use Nowo\MilkdownEditorBundle\Markdown\Node\Mention;
use Nowo\MilkdownEditorBundle\Markdown\Node\TablerIcon;
use Nowo\MilkdownEditorBundle\Markdown\Node\WikiLink;

/**
 * Inline tokens of the dialect (the same expressions as the TypeScript `dialect/patterns.ts`): page links by id,
 * mentions (start of text, whitespace or `(` before `@`) and Tabler icon shortcodes.
 *
 * 1.18: the anchor of a page link follows the heading id grammar ({@see HeadingIds::ANCHOR}, Unicode, 1–90
 * characters); a leading `nowo-h-` is accepted and dropped. A token whose anchor is too long stays text.
 *
 * @author Héctor Franco Aceituno <hectorfranco@nowo.tech>
 */
final class DialectInlineParser implements InlineParserInterface
{
    public const UUID   = '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}';
    public const ANCHOR = HeadingIds::ANCHOR;
    public const HANDLE = '[a-zA-Z0-9_](?:[a-zA-Z0-9_.-]{0,38}[a-zA-Z0-9_])?';
    public const ICON   = '[a-z0-9]+(?:-[a-z0-9]+)*';

    /**
     * One case-sensitive alternation for the three tokens.
     */
    public function getMatchDefinition(): InlineParserMatch
    {
        return InlineParserMatch::regex('\[\[wiki:(' . self::UUID . ')(?:#(?:' . HeadingIds::PREFIX . ')?(' . self::ANCHOR . '))?\]\]|@(' . self::HANDLE . ')|:tabler-(' . self::ICON . '):')
            ->caseSensitive();
    }

    /**
     * Appends the node for the token at the cursor; a mention glued to a word (an e-mail) is left to other parsers.
     *
     * @param InlineParserContext $inlineContext The parser context
     */
    public function parse(InlineParserContext $inlineContext): bool
    {
        $cursor = $inlineContext->getCursor();
        $m      = $inlineContext->getSubMatches();
        if (($m[0] ?? '') !== '') {
            $anchor = (string) ($m[1] ?? '');
            if ($anchor !== '' && !HeadingIds::isValid($anchor)) {
                return false;
            }
            $node = new WikiLink((string) $m[0], $anchor);
        } elseif (($m[2] ?? '') !== '') {
            $previous = $cursor->peek(-1);
            if ($previous !== null && preg_match('/^[\s(]$/u', $previous) !== 1) {
                return false;
            }
            $node = new Mention((string) $m[2]);
        } else {
            $node = new TablerIcon((string) ($m[3] ?? ''));
        }
        $cursor->advanceBy($inlineContext->getFullMatchLength());
        $inlineContext->getContainer()->appendChild($node);

        return true;
    }
}
