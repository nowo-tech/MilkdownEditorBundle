<?php

declare(strict_types=1);

namespace Nowo\MilkdownEditorBundle\Twig;

use Nowo\MilkdownEditorBundle\Csp\CspNonceProviderInterface;
use Nowo\MilkdownEditorBundle\DependencyInjection\Configuration;
use Nowo\MilkdownEditorBundle\Form\MilkdownEditorType;
use Nowo\MilkdownEditorBundle\Markdown\DialectRenderer;
use Nowo\MilkdownEditorBundle\Markdown\MarkdownRendererInterface;
use Symfony\Component\Asset\Packages;
use Symfony\Contracts\Translation\TranslatorInterface;
use Twig\Attribute\AsTwigFilter;
use Twig\Attribute\AsTwigFunction;

use function is_string;

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
     * @param TranslatorInterface|null $translator Translates the "Copy as Markdown" button (1.5)
     */
    public function __construct(
        private MarkdownRendererInterface $renderer,
        private Packages $packages,
        private ?CspNonceProviderInterface $nonceProvider = null,
        private ?TranslatorInterface $translator = null,
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

    /**
     * A read-view "Copy as Markdown" button (1.5): the Markdown travels in a `<template>` next to the button and the
     * editor module (`nowo_milkdown_editor_assets()`) copies it as plain text, saying the result in a status region.
     * Pass only Markdown the viewer may read, and only on pages the viewer may read: the source is in the page HTML.
     *
     * @param string|null $markdown The source (null or '' renders nothing)
     * @param array{label?: string, class?: string} $options `label` (default: the translated "Copy as Markdown") and
     *                                                       extra `class` of the button (e.g. a UiKit button class)
     */
    #[AsTwigFunction('nowo_milkdown_copy_markdown', isSafe: ['html'])]
    public function copyMarkdown(?string $markdown, array $options = []): string
    {
        if ($markdown === null || $markdown === '') {
            return '';
        }

        $label = is_string($options['label'] ?? null) ? $options['label'] : $this->trans('menu.copy_markdown');
        $class = is_string($options['class'] ?? null) && $options['class'] !== '' ? ' ' . $options['class'] : '';

        return '<span class="nowo-milkdown-copy" data-nowo-milkdown-copy>'
            . '<button type="button" class="nowo-milkdown-copy__button' . DialectRenderer::e($class) . '" data-nowo-milkdown-copy-markdown'
            . ' data-copied="' . DialectRenderer::e($this->trans('clipboard.copied_markdown')) . '"'
            . ' data-failed="' . DialectRenderer::e($this->trans('clipboard.copy_failed')) . '">' . DialectRenderer::e($label) . '</button>'
            . '<template>' . DialectRenderer::e($markdown) . '</template>'
            . '<span class="nowo-milkdown-copy__status" role="status"></span></span>';
    }

    private function trans(string $key): string
    {
        return $this->translator?->trans($key, [], MilkdownEditorType::DOMAIN) ?? $key;
    }
}
