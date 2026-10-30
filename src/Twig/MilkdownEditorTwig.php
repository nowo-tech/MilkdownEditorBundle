<?php

declare(strict_types=1);

namespace Nowo\MilkdownEditorBundle\Twig;

use Nowo\MilkdownEditorBundle\Csp\CspNonceProviderInterface;
use Nowo\MilkdownEditorBundle\DependencyInjection\Configuration;
use Nowo\MilkdownEditorBundle\Markdown\DialectRenderer;
use Nowo\MilkdownEditorBundle\Markdown\MarkdownRendererInterface;
use Symfony\Component\Asset\Packages;
use Twig\Attribute\AsTwigFilter;
use Twig\Attribute\AsTwigFunction;

/**
 * Twig API (REQ-SF-003 attributes): the `milkdown_markdown` filter (safe HTML of the dialect) and
 * `nowo_milkdown_editor_assets()` (stylesheet + ES module, with the CSP nonce) for pages that render Markdown with
 * Mermaid or math, or that mount editors without the form theme.
 *
 * @author Héctor Franco Aceituno <hectorfranco@nowo.tech>
 */
final readonly class MilkdownEditorTwig
{
    /** Built entry and stylesheet inside the asset package. */
    public const SCRIPT     = 'milkdown-editor.js';
    public const STYLESHEET = 'milkdown-editor.css';

    /**
     * @param MarkdownRendererInterface $renderer Markdown → safe HTML
     * @param Packages $packages Asset packages (`nowo_milkdown_editor`)
     * @param CspNonceProviderInterface|null $nonceProvider Nonce of the current response
     */
    public function __construct(
        private MarkdownRendererInterface $renderer,
        private Packages $packages,
        private ?CspNonceProviderInterface $nonceProvider = null,
    ) {
    }

    /**
     * Renders Markdown of the dialect to safe HTML (`{{ page.body|milkdown_markdown }}`).
     *
     * @param string|null $markdown The Markdown (null renders nothing)
     */
    #[AsTwigFilter('milkdown_markdown', isSafe: ['html'])]
    public function markdown(?string $markdown): string
    {
        return $markdown === null || $markdown === '' ? '' : $this->renderer->render($markdown);
    }

    /**
     * The `<link>` and `<script type="module">` tags of the editor bundle (each nonce-stamped when a nonce is known).
     *
     * @param string|null $nonce Nonce to use (null: the provider's)
     */
    #[AsTwigFunction('nowo_milkdown_editor_assets', isSafe: ['html'])]
    public function assets(?string $nonce = null): string
    {
        $nonce ??= $this->nonceProvider?->getNonce();
        $attr = $nonce !== null && $nonce !== '' ? ' nonce="' . DialectRenderer::e($nonce) . '"' : '';
        $css  = DialectRenderer::e($this->packages->getUrl(self::STYLESHEET, Configuration::ALIAS));
        $js   = DialectRenderer::e($this->packages->getUrl(self::SCRIPT, Configuration::ALIAS));

        return '<link rel="stylesheet" href="' . $css . '"' . $attr . '><script type="module" src="' . $js . '"' . $attr . '></script>';
    }
}
