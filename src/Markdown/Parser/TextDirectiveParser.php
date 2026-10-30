<?php

declare(strict_types=1);

namespace Nowo\MilkdownEditorBundle\Markdown\Parser;

use League\CommonMark\Environment\EnvironmentAwareInterface;
use League\CommonMark\Environment\EnvironmentInterface;
use League\CommonMark\Node\Block\Paragraph;
use League\CommonMark\Node\Node;
use League\CommonMark\Parser\Inline\InlineParserInterface;
use League\CommonMark\Parser\Inline\InlineParserMatch;
use League\CommonMark\Parser\InlineParserContext;
use League\CommonMark\Parser\InlineParserEngine;
use Nowo\MilkdownEditorBundle\Markdown\Directive\DirectiveAttributes;
use Nowo\MilkdownEditorBundle\Markdown\Node\TextDirective;
use WeakMap;

use function strlen;

/**
 * `:name[label]{attributes}`: the label is parsed as inline Markdown (emphasis, links… inside a highlight).
 *
 * Bounded work on hostile input: a label is at most {@see MAX_LABEL} bytes, attributes {@see MAX_ATTRIBUTES} bytes,
 * text directives nest at most {@see MAX_DEPTH} levels and one inline container tries at most {@see MAX_ATTEMPTS}
 * directives; past a bound the source stays text.
 *
 * @author Héctor Franco Aceituno <hectorfranco@nowo.tech>
 */
final class TextDirectiveParser implements InlineParserInterface, EnvironmentAwareInterface
{
    public const MAX_LABEL      = 2000;
    public const MAX_ATTRIBUTES = 1000;
    public const MAX_DEPTH      = 8;
    public const MAX_ATTEMPTS   = 200;

    private ?EnvironmentInterface $environment = null;

    /** Nesting level of the label being parsed (labels are parsed by a nested engine that reuses this parser). */
    private int $depth = 0;

    /** @var WeakMap<object, int> Attempts per inline container (entries go with the parsed document) */
    private WeakMap $attempts;

    public function __construct()
    {
        $this->attempts = new WeakMap();
    }

    /**
     * Stores the environment (needed to parse the label).
     */
    public function setEnvironment(EnvironmentInterface $environment): void
    {
        // @igor-ignore - Set once when the CommonMark environment is built; immutable afterwards
        $this->environment = $environment;
    }

    /**
     * `:` + name + `[` (the label and attributes are scanned by hand: brackets may nest).
     */
    public function getMatchDefinition(): InlineParserMatch
    {
        return InlineParserMatch::regex(':(' . DirectiveAttributes::NAME_PATTERN . ')\[')->caseSensitive();
    }

    /**
     * Parses the directive, or returns false (text) when the label is not closed.
     *
     * @param InlineParserContext $inlineContext The parser context
     */
    public function parse(InlineParserContext $inlineContext): bool
    {
        if (!$this->environment instanceof EnvironmentInterface || $this->depth >= self::MAX_DEPTH || !$this->countAttempt($inlineContext->getContainer())) {
            return false;
        }
        $cursor = $inlineContext->getCursor();
        $start  = $inlineContext->getFullMatchLength();
        $rest   = substr($cursor->getRemainder(), 0, $start + self::MAX_LABEL + self::MAX_ATTRIBUTES + 2);
        $end    = self::closingBracket($rest, $start, self::MAX_LABEL);
        if ($end === null) {
            return false;
        }
        $label      = substr($rest, $start, $end - $start);
        $consumed   = $end + 1;
        $attributes = [];
        if (($rest[$consumed] ?? '') === '{') {
            $close = strpos($rest, '}', $consumed);
            if ($close !== false && !str_contains(substr($rest, $consumed, $close - $consumed), "\n")) {
                $attributes = DirectiveAttributes::parse(substr($rest, $consumed + 1, $close - $consumed - 1));
                $consumed   = $close + 1;
            }
        }
        $name = (string) $inlineContext->getSubMatches()[0];
        $cursor->advanceBy(mb_strlen(substr($rest, 0, $consumed), 'UTF-8'));

        $node = new TextDirective($name, $attributes);
        $tmp  = new Paragraph();
        // @igor-ignore - Nesting counter of the document being parsed; always restored in finally
        ++$this->depth;
        try {
            (new InlineParserEngine($this->environment, $inlineContext->getReferenceMap()))->parse($label, $tmp);
        } finally {
            // @igor-ignore - Restores the nesting counter (per-document parse state)
            --$this->depth;
        }
        /** @var list<Node> $children */
        $children = [];
        foreach ($tmp->children() as $child) {
            $children[] = $child;
        }
        foreach ($children as $child) {
            $node->appendChild($child);
        }
        $inlineContext->getContainer()->appendChild($node);

        return true;
    }

    /**
     * Counts one attempt in `$container`; false once the container used up {@see MAX_ATTEMPTS}.
     */
    private function countAttempt(object $container): bool
    {
        $count = ($this->attempts[$container] ?? 0) + 1;
        // @igor-ignore - Per-document parse bookkeeping in a WeakMap keyed by the document's own nodes
        $this->attempts[$container] = $count;

        return $count <= self::MAX_ATTEMPTS;
    }

    /**
     * Index of the `]` closing the label that starts at `$from` (nested brackets and backslash escapes), or null when
     * it is not found within `$max` bytes or before a line break.
     */
    public static function closingBracket(string $text, int $from, int $max = self::MAX_LABEL): ?int
    {
        $depth  = 0;
        $length = min(strlen($text), $from + $max + 1);
        for ($i = $from; $i < $length; ++$i) {
            $c = $text[$i];
            if ($c === '\\') {
                ++$i;
            } elseif ($c === '[') {
                ++$depth;
            } elseif ($c === ']') {
                if ($depth === 0) {
                    return $i;
                }
                --$depth;
            } elseif ($c === "\n") {
                return null;
            }
        }

        return null;
    }
}
