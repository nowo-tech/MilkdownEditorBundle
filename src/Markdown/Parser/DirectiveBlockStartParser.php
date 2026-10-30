<?php

declare(strict_types=1);

namespace Nowo\MilkdownEditorBundle\Markdown\Parser;

use League\CommonMark\Parser\Block\BlockStart;
use League\CommonMark\Parser\Block\BlockStartParserInterface;
use League\CommonMark\Parser\Cursor;
use League\CommonMark\Parser\MarkdownParserStateInterface;
use Nowo\MilkdownEditorBundle\Markdown\Directive\DirectiveAttributes;
use Nowo\MilkdownEditorBundle\Markdown\Node\ContainerDirective;
use Nowo\MilkdownEditorBundle\Markdown\Node\LeafDirective;
use Nowo\MilkdownEditorBundle\Markdown\Node\MathBlock;

use function strlen;

use const PREG_UNMATCHED_AS_NULL;

/**
 * Starts the block constructs of the dialect: `:::name[label]{…}` containers (`::: {align=…}` is an `align`
 * container), `::name[label]{…}` leaf directives and `$$` math blocks (when math is on).
 *
 * @author Héctor Franco Aceituno <hectorfranco@nowo.tech>
 */
final class DirectiveBlockStartParser implements BlockStartParserInterface
{
    // Possessive quantifiers: whitespace runs never backtrack (no polynomial matching on long lines).
    private const LABEL_ATTRS = '(?:\[([^\]\n]*+)\][ \t]*+)?(?:\{([^}\n]*+)\}[ \t]*+)?$';

    /**
     * @param bool $math Whether `$$` starts a math block
     */
    public function __construct(private readonly bool $math = true)
    {
    }

    /**
     * Returns the block start for a directive or math fence at the cursor, or none.
     *
     * @param Cursor $cursor The line cursor
     * @param MarkdownParserStateInterface $parserState The parser state
     */
    public function tryStart(Cursor $cursor, MarkdownParserStateInterface $parserState): ?BlockStart
    {
        if ($cursor->isIndented()) {
            return BlockStart::none();
        }
        $line = $cursor->getRemainder();
        if (preg_match('/^[ \t]*+(:{3,}+)[ \t]*+(' . DirectiveAttributes::NAME_PATTERN . ')?+[ \t]*+' . self::LABEL_ATTRS . '/', $line, $m, PREG_UNMATCHED_AS_NULL) === 1) {
            $name = $m[2] ?? '';
            if ($name === '' && $m[4] === null) {
                return BlockStart::none(); // a bare fence closes, it never opens
            }
            $cursor->advanceToEnd();

            return BlockStart::of(new ContainerDirectiveParser(new ContainerDirective(
                $name === '' ? 'align' : $name,
                trim($m[3] ?? ''),
                DirectiveAttributes::parse($m[4] ?? ''),
                strlen((string) $m[1]),
            )))->at($cursor);
        }
        if (preg_match('/^[ \t]*+::(' . DirectiveAttributes::NAME_PATTERN . ')' . self::LABEL_ATTRS . '/', $line, $m, PREG_UNMATCHED_AS_NULL) === 1) {
            $cursor->advanceToEnd();

            return BlockStart::of(new LeafDirectiveParser(new LeafDirective(
                (string) $m[1],
                trim($m[2] ?? ''),
                DirectiveAttributes::parse($m[3] ?? ''),
            )))->at($cursor);
        }
        if ($this->math && preg_match('/^[ \t]*\$\$[ \t]*$/', $line) === 1) {
            $cursor->advanceToEnd();

            return BlockStart::of(new MathBlockParser(new MathBlock()))->at($cursor);
        }

        return BlockStart::none();
    }
}
