<?php

declare(strict_types=1);

namespace Nowo\MilkdownEditorBundle\Markdown;

use League\CommonMark\Environment\Environment;
use League\CommonMark\Event\DocumentParsedEvent;
use League\CommonMark\Extension\CommonMark\CommonMarkCoreExtension;
use League\CommonMark\Extension\Footnote\FootnoteExtension;
use League\CommonMark\Extension\GithubFlavoredMarkdownExtension;
use League\CommonMark\MarkdownConverter;
use Nowo\MilkdownEditorBundle\Markdown\Directive\DirectiveRendererInterface;
use Nowo\MilkdownEditorBundle\Markdown\Resolver\IconResolverInterface;
use Nowo\MilkdownEditorBundle\Markdown\Resolver\PageResolverInterface;
use Nowo\MilkdownEditorBundle\Markdown\Resolver\UserResolverInterface;
use Psr\Log\LoggerInterface;
use Symfony\Contracts\Service\ResetInterface;
use Symfony\Contracts\Translation\TranslatorInterface;

use function count_chars;
use function ord;
use function str_split;
use function strlen;

/**
 * The PHP renderer of the dialect (FR-074 / FR-075): CommonMark + GFM + the {@see MilkdownDialectExtension}, raw HTML
 * escaped (or stripped), unsafe links dropped, remote images turned into links unless allowed, bounded nesting and
 * input length. The environment is built once per service (worker-safe: no request state).
 *
 * @author Héctor Franco Aceituno <hectorfranco@nowo.tech>
 */
final class MilkdownMarkdownRenderer implements MarkdownRendererInterface, ResetInterface
{
    /**
     * Default `max_input_length` in bytes. With the default marker budget the worst input measured peaks at about
     * 35 MB and 0.7 s (PHP 8.4), well within PHP's default `memory_limit` of 128M.
     */
    public const DEFAULT_MAX_INPUT_LENGTH = 100000;

    /** Default `max_inline_markers`: CommonMark allocates about 1.5 KB per inline delimiter while parsing. */
    public const DEFAULT_MAX_INLINE_MARKERS = 10000;

    /**
     * Bytes that cost a parser node or match array each: the delimiters of inline constructs (CommonMark core, GFM and
     * the dialect) and the line feed (one `Newline` node per soft break).
     */
    public const INLINE_MARKERS = "[]*_`!<&@:\$~|\\\n";

    private ?MarkdownConverter $converter = null;

    private ?FootnoteSalt $footnoteSalt = null;

    /**
     * @param array{html_input?: string, allow_unsafe_links?: bool, allow_remote_images?: bool, math?: bool, footnotes?: bool, max_footnote_refs?: int, mention_display?: string, max_nesting_level?: int, max_input_length?: int, max_inline_markers?: int, max_references?: int, mark_colors?: list<string>} $options The `nowo_milkdown_editor.markdown` configuration
     * @param PageResolverInterface $pages Page link resolver (per viewer)
     * @param UserResolverInterface $users Mention resolver
     * @param IconResolverInterface $icons Icon allowlist and sprite
     * @param iterable<DirectiveRendererInterface> $directiveRenderers Host renderers of leaf directives
     * @param TranslatorInterface|null $translator Translates *Content not visible*
     * @param LoggerInterface|null $logger Logs resolver failures
     * @param string $secret `kernel.secret`: keys the footnote id salt (1.3.1)
     */
    public function __construct(
        private readonly array $options,
        private readonly PageResolverInterface $pages,
        private readonly UserResolverInterface $users,
        private readonly IconResolverInterface $icons,
        private readonly iterable $directiveRenderers = [],
        private readonly ?TranslatorInterface $translator = null,
        private readonly ?LoggerInterface $logger = null,
        private readonly string $secret = '',
    ) {
    }

    /**
     * Safe HTML for `$markdown`. Input longer than `max_input_length` bytes, or with more than `max_inline_markers`
     * inline delimiter characters and line feeds, is rendered as escaped text without parsing: the parser's memory and CPU grow
     * with the number of delimiters, so this bounds the cost of a hostile document.
     */
    public function render(string $markdown): string
    {
        $markdown = str_replace(["\r\n", "\r"], "\n", $markdown);
        if (strlen($markdown) > ($this->options['max_input_length'] ?? self::DEFAULT_MAX_INPUT_LENGTH)
            || self::countInlineMarkers($markdown) > ($this->options['max_inline_markers'] ?? self::DEFAULT_MAX_INLINE_MARKERS)) {
            return '<p>' . nl2br(DialectRenderer::e($markdown), false) . '</p>';
        }

        $converter = $this->converter();
        $this->footnoteSalt?->prepare($markdown);

        return $converter->convert($markdown)->getContent();
    }

    /**
     * Forgets the per-request footnote render counters (`kernel.reset`).
     */
    public function reset(): void
    {
        $this->footnoteSalt?->reset();
    }

    /**
     * Number of {@see self::INLINE_MARKERS} bytes in `$markdown` (one pass, no per-match allocation).
     */
    public static function countInlineMarkers(string $markdown): int
    {
        $bytes = count_chars($markdown, 1);
        $count = 0;
        foreach (str_split(self::INLINE_MARKERS) as $char) {
            $count += $bytes[ord($char)] ?? 0;
        }

        return $count;
    }

    private function converter(): MarkdownConverter
    {
        if ($this->converter instanceof MarkdownConverter) {
            return $this->converter;
        }
        $math        = $this->options['math'] ?? true;
        $environment = new Environment([
            'html_input'         => $this->options['html_input'] ?? 'escape',
            'allow_unsafe_links' => $this->options['allow_unsafe_links'] ?? false,
            'max_nesting_level'  => $this->options['max_nesting_level'] ?? 50,
            // Prefixed ids: a footnote can never clobber a host element id or a heading anchor.
            'footnote' => [
                'backref_class'      => 'nowo-md-footnote-backref',
                'container_add_hr'   => true,
                'container_class'    => 'nowo-md-footnotes',
                'ref_class'          => 'nowo-md-footnote-ref',
                'ref_id_prefix'      => 'nowo-md-fnref-',
                'footnote_class'     => 'nowo-md-footnote',
                'footnote_id_prefix' => 'nowo-md-fn-',
            ],
        ]);
        $environment->addExtension(new CommonMarkCoreExtension());
        $environment->addExtension(new GithubFlavoredMarkdownExtension());
        if ($this->options['footnotes'] ?? true) {
            $environment->addExtension(new FootnoteExtension());
            // Before the footnote listeners (40 … 10): case-insensitive labels and the reference cap (CZ-L1).
            $environment->addEventListener(DocumentParsedEvent::class, [new FootnoteGuard($this->options['max_footnote_refs'] ?? FootnoteGuard::DEFAULT_MAX_FOOTNOTE_REFS), 'onDocumentParsed'], 50);
            // After orphans become text (30), before numbering (20): per-document salt of the footnote ids (CZ-I7).
            $this->footnoteSalt = new FootnoteSalt($this->secret);
            $environment->addEventListener(DocumentParsedEvent::class, [$this->footnoteSalt, 'onDocumentParsed'], 25);
        }
        $environment->addExtension(new MilkdownDialectExtension(
            new DialectRenderer($this->icons, $this->directiveRenderers, $this->options['mark_colors'] ?? ['yellow'], $this->translator, $this->options['mention_display'] ?? 'handle'),
            new DocumentProcessor(
                $this->pages,
                $this->users,
                $this->directiveRenderers,
                $this->options['allow_remote_images'] ?? false,
                $this->logger,
                $this->options['max_references'] ?? DocumentProcessor::DEFAULT_MAX_REFERENCES,
            ),
            $math,
        ));

        // @igor-ignore - Built once from configuration; holds no request or user state
        return $this->converter = new MarkdownConverter($environment);
    }
}
