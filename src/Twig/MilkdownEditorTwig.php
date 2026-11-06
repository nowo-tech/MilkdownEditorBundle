<?php

declare(strict_types=1);

namespace Nowo\MilkdownEditorBundle\Twig;

use Nowo\MilkdownEditorBundle\Csp\CspNonceProviderInterface;
use Nowo\MilkdownEditorBundle\DependencyInjection\Configuration;
use Nowo\MilkdownEditorBundle\Form\MilkdownEditorType;
use Nowo\MilkdownEditorBundle\Markdown\DialectRenderer;
use Nowo\MilkdownEditorBundle\Markdown\DocumentProcessor;
use Nowo\MilkdownEditorBundle\Markdown\HostSchemes;
use Nowo\MilkdownEditorBundle\Markdown\MarkdownRendererInterface;
use Symfony\Component\Asset\Packages;
use Symfony\Contracts\Translation\TranslatorInterface;
use Twig\Attribute\AsTwigFilter;
use Twig\Attribute\AsTwigFunction;

use function is_string;
use function json_encode;

use const JSON_HEX_AMP;
use const JSON_HEX_APOS;
use const JSON_HEX_QUOT;
use const JSON_HEX_TAG;
use const JSON_THROW_ON_ERROR;
use const JSON_UNESCAPED_SLASHES;

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
    /** Static icon of the copy button (two sheets); markup from the bundle, never from user data. */
    public const COPY_ICON = '<svg class="nowo-milkdown-copy__icon" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></svg>';

    /**
     * @param MarkdownRendererInterface $renderer Markdown → safe HTML
     * @param Packages $packages Asset packages (`nowo_milkdown_editor`)
     * @param CspNonceProviderInterface|null $nonceProvider Nonce of the current response
     * @param TranslatorInterface|null $translator Translates the "Copy as Markdown" button (1.5)
     * @param HostSchemes $hostSchemes `markdown.host_schemes` for the page's editors (1.9)
     * @param string $previewSandbox `markdown.file_preview_sandbox` tokens, space separated (1.9)
     * @param int $maxPreviews Previews per editor: `markdown.max_references` (1.9)
     */
    public function __construct(
        private MarkdownRendererInterface $renderer,
        private Packages $packages,
        private ?CspNonceProviderInterface $nonceProvider = null,
        private ?TranslatorInterface $translator = null,
        private HostSchemes $hostSchemes = new HostSchemes(),
        private string $previewSandbox = '',
        private int $maxPreviews = DocumentProcessor::DEFAULT_MAX_REFERENCES,
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
     * 1.9: with `markdown.host_schemes`, also the page's editor configuration (`script[data-nowo-milkdown-config]`, a
     * nonce-stamped data block): auto-mounted editors take host references and the preview sandbox only from it, never
     * from a widget's `data-*` attribute (audit GX-L2).
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

        $config = '';
        if (!$this->hostSchemes->isEmpty()) {
            // A data block: never executed, and `<`, `&` and quotes cannot end it.
            $json   = json_encode(['hostSchemes' => $this->hostSchemes->toArray(), 'previewSandbox' => $this->previewSandbox, 'maxPreviews' => $this->maxPreviews], JSON_THROW_ON_ERROR | JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_UNESCAPED_SLASHES);
            $config = '<script type="application/json" data-nowo-milkdown-config' . $attr . '>' . $json . '</script>';
        }

        return $config . '<link rel="stylesheet" href="' . $css . '"' . $attr . '><script type="module" src="' . $js . '"' . $attr . '></script>';
    }

    /**
     * A read-view "Copy as Markdown" button (1.5): the Markdown travels in a `<template>` next to the button and the
     * editor module (`nowo_milkdown_editor_assets()`) copies it as plain text, saying the result in a status region.
     * Pass only Markdown the viewer may read, and only on pages the viewer may read: the source is in the page HTML.
     *
     * @param string|null $markdown The source (null or '' renders nothing)
     *                              Markup (public API, stable since 1.5.1): `span.nowo-milkdown-copy[data-nowo-milkdown-copy]` holding
     *                              `button.nowo-milkdown-copy__button[data-nowo-milkdown-copy-markdown][data-copied][data-failed]`, the source in an
     *                              inert `<template>` and `span.nowo-milkdown-copy__status[role=status]`. With `icon`, the button starts with
     *                              `svg.nowo-milkdown-copy__icon[aria-hidden=true]`; with `icon: 'only'` the label is kept for assistive technology
     *                              in `span.nowo-milkdown-sr-only` and as the `title` tooltip.
     * @param array{label?: string, class?: string, icon?: bool|string} $options `label` (default: the translated
     *                                                                           "Copy as Markdown"), extra `class` of the button (e.g. a UiKit button class), `icon` (`true`: icon and
     *                                                                           label, `'only'`: icon-only button with an accessible label; default `false`)
     */
    #[AsTwigFunction('nowo_milkdown_copy_markdown', isSafe: ['html'])]
    public function copyMarkdown(?string $markdown, array $options = []): string
    {
        if ($markdown === null || $markdown === '') {
            return '';
        }

        $label = is_string($options['label'] ?? null) ? $options['label'] : $this->trans('menu.copy_markdown');
        $class = is_string($options['class'] ?? null) && $options['class'] !== '' ? ' ' . $options['class'] : '';
        $icon  = $options['icon'] ?? false;
        $only  = $icon === 'only';
        // 1.5.1: an optional static icon (bundle markup, no inline style); icon-only keeps a visually hidden label.
        $content = match (true) {
            $only          => self::COPY_ICON . '<span class="nowo-milkdown-sr-only">' . DialectRenderer::e($label) . '</span>',
            $icon === true => self::COPY_ICON . '<span class="nowo-milkdown-copy__label">' . DialectRenderer::e($label) . '</span>',
            default        => DialectRenderer::e($label),
        };

        return '<span class="nowo-milkdown-copy" data-nowo-milkdown-copy>'
            . '<button type="button" class="nowo-milkdown-copy__button' . ($only ? ' nowo-milkdown-copy__button--icon' : '') . DialectRenderer::e($class) . '" data-nowo-milkdown-copy-markdown'
            . ($only ? ' title="' . DialectRenderer::e($label) . '"' : '')
            . ' data-copied="' . DialectRenderer::e($this->trans('clipboard.copied_markdown')) . '"'
            . ' data-failed="' . DialectRenderer::e($this->trans('clipboard.copy_failed')) . '">' . $content . '</button>'
            . '<template>' . DialectRenderer::e($markdown) . '</template>'
            . '<span class="nowo-milkdown-copy__status" role="status"></span></span>';
    }

    private function trans(string $key): string
    {
        return $this->translator?->trans($key, [], MilkdownEditorType::DOMAIN) ?? $key;
    }
}
