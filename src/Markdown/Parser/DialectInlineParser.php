<?php

declare(strict_types=1);

namespace Nowo\MilkdownEditorBundle\Markdown\Parser;

use League\CommonMark\Parser\Inline\InlineParserInterface;
use League\CommonMark\Parser\Inline\InlineParserMatch;
use League\CommonMark\Parser\InlineParserContext;
use Nowo\MilkdownEditorBundle\Markdown\Node\Mention;
use Nowo\MilkdownEditorBundle\Markdown\Node\TablerIcon;
use Nowo\MilkdownEditorBundle\Markdown\Node\WikiLink;

/**
 * Inline tokens of the dialect (the same expressions as the TypeScript `dialect/patterns.ts`): page links by id,
 * mentions (start of text, whitespace or `(` before `@`) and Tabler icon shortcodes.
 *
 * @author Héctor Franco Aceituno <hectorfranco@nowo.tech>
 */
final class DialectInlineParser implements InlineParserInterface
{
    public const UUID   = '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}';
    public const ANCHOR = '[a-z0-9][a-z0-9-]{0,80}';
    public const HANDLE = '[a-zA-Z0-9_](?:[a-zA-Z0-9_.-]{0,38}[a-zA-Z0-9_])?';
    public const ICON   = '[a-z0-9]+(?:-[a-z0-9]+)*';

    /**
     * One case-sensitive alternation for the three tokens.
     */
    public function getMatchDefinition(): InlineParserMatch
    {
        return InlineParserMatch::regex('\[\[wiki:(' . self::UUID . ')(?:#(' . self::ANCHOR . '))?\]\]|@(' . self::HANDLE . ')|:tabler-(' . self::ICON . '):')
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
            $node = new WikiLink((string) $m[0], (string) ($m[1] ?? ''));
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
