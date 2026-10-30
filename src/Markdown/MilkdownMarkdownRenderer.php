<?php

declare(strict_types=1);

namespace Nowo\MilkdownEditorBundle\Markdown;

use League\CommonMark\Environment\Environment;
use League\CommonMark\Extension\CommonMark\CommonMarkCoreExtension;
use League\CommonMark\Extension\GithubFlavoredMarkdownExtension;
use League\CommonMark\MarkdownConverter;
use Nowo\MilkdownEditorBundle\Markdown\Directive\DirectiveRendererInterface;
use Nowo\MilkdownEditorBundle\Markdown\Resolver\IconResolverInterface;
use Nowo\MilkdownEditorBundle\Markdown\Resolver\PageResolverInterface;
use Nowo\MilkdownEditorBundle\Markdown\Resolver\UserResolverInterface;
use Psr\Log\LoggerInterface;
use Symfony\Contracts\Translation\TranslatorInterface;

use function strlen;

/**
 * The PHP renderer of the dialect (FR-074 / FR-075): CommonMark + GFM + the {@see MilkdownDialectExtension}, raw HTML
 * escaped (or stripped), unsafe links dropped, remote images turned into links unless allowed, bounded nesting and
 * input length. The environment is built once per service (worker-safe: no request state).
 *
 * @author Héctor Franco Aceituno <hectorfranco@nowo.tech>
 */
final class MilkdownMarkdownRenderer implements MarkdownRendererInterface
{
    private ?MarkdownConverter $converter = null;

    /**
     * @param array{html_input?: string, allow_unsafe_links?: bool, allow_remote_images?: bool, math?: bool, max_nesting_level?: int, max_input_length?: int, mark_colors?: list<string>} $options The `nowo_milkdown_editor.markdown` configuration
     * @param PageResolverInterface $pages Page link resolver (per viewer)
     * @param UserResolverInterface $users Mention resolver
     * @param IconResolverInterface $icons Icon allowlist and sprite
     * @param iterable<DirectiveRendererInterface> $directiveRenderers Host renderers of leaf directives
     * @param TranslatorInterface|null $translator Translates *Content not visible*
     * @param LoggerInterface|null $logger Logs resolver failures
     */
    public function __construct(
        private readonly array $options,
        private readonly PageResolverInterface $pages,
        private readonly UserResolverInterface $users,
        private readonly IconResolverInterface $icons,
        private readonly iterable $directiveRenderers = [],
        private readonly ?TranslatorInterface $translator = null,
        private readonly ?LoggerInterface $logger = null,
    ) {
    }

    /**
     * Safe HTML for `$markdown`; input longer than `max_input_length` is rendered as escaped text.
     */
    public function render(string $markdown): string
    {
        $markdown = str_replace(["\r\n", "\r"], "\n", $markdown);
        if (strlen($markdown) > ($this->options['max_input_length'] ?? 1000000)) {
            return '<p>' . nl2br(DialectRenderer::e($markdown), false) . '</p>';
        }

        return $this->converter()->convert($markdown)->getContent();
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
        ]);
        $environment->addExtension(new CommonMarkCoreExtension());
        $environment->addExtension(new GithubFlavoredMarkdownExtension());
        $environment->addExtension(new MilkdownDialectExtension(
            new DialectRenderer($this->icons, $this->directiveRenderers, $this->options['mark_colors'] ?? ['yellow'], $this->translator),
            new DocumentProcessor($this->pages, $this->users, $this->directiveRenderers, $this->options['allow_remote_images'] ?? false, $this->logger),
            $math,
        ));

        // @igor-ignore - Built once from configuration; holds no request or user state
        return $this->converter = new MarkdownConverter($environment);
    }
}
