<?php

declare(strict_types=1);

namespace Nowo\MilkdownEditorBundle\Markdown;

use League\CommonMark\Environment\EnvironmentBuilderInterface;
use League\CommonMark\Event\DocumentParsedEvent;
use League\CommonMark\Extension\ExtensionInterface;
use Nowo\MilkdownEditorBundle\Markdown\Node\ContainerDirective;
use Nowo\MilkdownEditorBundle\Markdown\Node\LeafDirective;
use Nowo\MilkdownEditorBundle\Markdown\Node\Math;
use Nowo\MilkdownEditorBundle\Markdown\Node\MathBlock;
use Nowo\MilkdownEditorBundle\Markdown\Node\Mention;
use Nowo\MilkdownEditorBundle\Markdown\Node\TablerIcon;
use Nowo\MilkdownEditorBundle\Markdown\Node\TextDirective;
use Nowo\MilkdownEditorBundle\Markdown\Node\WikiLink;
use Nowo\MilkdownEditorBundle\Markdown\Parser\DialectInlineParser;
use Nowo\MilkdownEditorBundle\Markdown\Parser\DirectiveBlockStartParser;
use Nowo\MilkdownEditorBundle\Markdown\Parser\MathInlineParser;
use Nowo\MilkdownEditorBundle\Markdown\Parser\TextDirectiveParser;

/**
 * league/commonmark extension of the FR-075 dialect. Add it to any environment that already has the CommonMark
 * core (and, ideally, GFM) extension; {@see MilkdownMarkdownRenderer} builds such an environment.
 *
 * @author Héctor Franco Aceituno <hectorfranco@nowo.tech>
 */
final readonly class MilkdownDialectExtension implements ExtensionInterface
{
    /**
     * @param DialectRenderer $renderer HTML of the dialect nodes
     * @param DocumentProcessor $processor Batched resolution after parsing
     * @param bool $math Parse `$…$` and `$$` blocks
     */
    public function __construct(
        private DialectRenderer $renderer,
        private DocumentProcessor $processor,
        private bool $math = true,
    ) {
    }

    /**
     * Registers parsers (before the core ones), renderers and the document listener.
     *
     * @param EnvironmentBuilderInterface $environment The environment being built
     */
    public function register(EnvironmentBuilderInterface $environment): void
    {
        $environment
            ->addBlockStartParser(new DirectiveBlockStartParser($this->math), 90)
            ->addInlineParser(new DialectInlineParser(), 200)
            ->addInlineParser(new TextDirectiveParser(), 190)
            ->addEventListener(DocumentParsedEvent::class, $this->processor);
        if ($this->math) {
            $environment->addInlineParser(new MathInlineParser(), 180);
        }
        foreach ([WikiLink::class, Mention::class, TablerIcon::class, Math::class, MathBlock::class, TextDirective::class, ContainerDirective::class, LeafDirective::class] as $class) {
            $environment->addRenderer($class, $this->renderer);
        }
    }
}
