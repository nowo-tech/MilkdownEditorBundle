<?php

declare(strict_types=1);

namespace Nowo\MilkdownEditorBundle\Markdown;

use InvalidArgumentException;
use League\CommonMark\Node\Node;
use League\CommonMark\Renderer\ChildNodeRendererInterface;
use League\CommonMark\Renderer\NodeRendererInterface;
use Nowo\MilkdownEditorBundle\DependencyInjection\Configuration;
use Nowo\MilkdownEditorBundle\Form\MilkdownEditorType;
use Nowo\MilkdownEditorBundle\Markdown\Directive\DirectiveRendererInterface;
use Nowo\MilkdownEditorBundle\Markdown\Node\ContainerDirective;
use Nowo\MilkdownEditorBundle\Markdown\Node\LeafDirective;
use Nowo\MilkdownEditorBundle\Markdown\Node\Math;
use Nowo\MilkdownEditorBundle\Markdown\Node\MathBlock;
use Nowo\MilkdownEditorBundle\Markdown\Node\Mention;
use Nowo\MilkdownEditorBundle\Markdown\Node\TablerIcon;
use Nowo\MilkdownEditorBundle\Markdown\Node\TextDirective;
use Nowo\MilkdownEditorBundle\Markdown\Node\WikiLink;
use Nowo\MilkdownEditorBundle\Markdown\Resolver\IconResolverInterface;
use Nowo\MilkdownEditorBundle\Markdown\Resolver\ResolvedPage;
use Nowo\MilkdownEditorBundle\Markdown\Resolver\ResolvedUser;
use Symfony\Contracts\Translation\TranslatorInterface;

use function in_array;

use const ENT_HTML5;
use const ENT_QUOTES;
use const ENT_SUBSTITUTE;

/**
 * HTML of every dialect node. Every value is escaped; URLs keep relative and http(s) forms only.
 *
 * @author Héctor Franco Aceituno <hectorfranco@nowo.tech>
 */
final readonly class DialectRenderer implements NodeRendererInterface
{
    public const CALLOUT_TYPES = ['info', 'success', 'warning', 'danger'];
    public const ALIGNMENTS    = ['left', 'center', 'right'];

    /**
     * @param IconResolverInterface $icons Icon allowlist and sprite
     * @param iterable<DirectiveRendererInterface> $directiveRenderers Host renderers of leaf directives
     * @param list<string> $markColors Accepted `:mark` colours
     * @param TranslatorInterface|null $translator Translates *Content not visible* (per request locale)
     * @param string $mentionDisplay `handle` (`@handle`) or `name` (the resolved name, handle in `data-handle` / `title`)
     */
    public function __construct(
        private IconResolverInterface $icons,
        private iterable $directiveRenderers = [],
        private array $markColors = ['yellow'],
        private ?TranslatorInterface $translator = null,
        private string $mentionDisplay = 'handle',
    ) {
    }

    /**
     * Renders one dialect node.
     *
     * @param Node $node The node
     * @param ChildNodeRendererInterface $childRenderer Renders the node's children
     *
     * @throws InvalidArgumentException For a node this renderer does not handle
     */
    public function render(Node $node, ChildNodeRendererInterface $childRenderer): string
    {
        return match (true) {
            $node instanceof WikiLink           => $this->wikiLink($node),
            $node instanceof Mention            => $this->mention($node),
            $node instanceof TablerIcon         => $this->icon($node),
            $node instanceof Math               => '<span class="nowo-md-math" data-math="inline">' . self::e($node->tex) . '</span>',
            $node instanceof MathBlock          => '<div class="nowo-md-math" data-math="block">' . self::e($node->tex) . '</div>',
            $node instanceof TextDirective      => $this->textDirective($node, $childRenderer->renderNodes($node->children())),
            $node instanceof ContainerDirective => $this->container($node, $childRenderer->renderNodes($node->children())),
            $node instanceof LeafDirective      => $this->leaf($node),
            default                             => throw new InvalidArgumentException('Unsupported node ' . $node::class),
        };
    }

    /**
     * Escapes text for HTML content and attributes.
     */
    public static function e(string $value): string
    {
        return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE | ENT_HTML5, 'UTF-8');
    }

    /**
     * Keeps relative URLs and http(s) URLs; anything else (javascript:, data:…) becomes ''. Leading and trailing C0
     * controls / spaces and inner tabs / newlines are removed first, as browsers do when they parse a URL.
     */
    public static function safeUrl(string $url): string
    {
        $url = self::cleanUrl($url);
        if (preg_match('~^[\\\\/][\\\\/]~', $url) === 1) {
            return ''; // protocol-relative (`//host`, `/\host`, `\\host`): another origin
        }
        if (preg_match('~^([^/?#]*):~', $url, $m) === 1) {
            return preg_match('~^https?$~i', $m[1]) === 1 ? $url : '';
        }

        return $url;
    }

    /**
     * `$url` as a browser reads it: without leading / trailing C0 controls and spaces, nor tabs and newlines inside.
     */
    public static function cleanUrl(string $url): string
    {
        return str_replace(["\t", "\n", "\r"], '', trim($url, "\x00..\x20\x7f"));
    }

    private function wikiLink(WikiLink $node): string
    {
        $page = $node->page;
        $url  = $page instanceof ResolvedPage ? self::safeUrl($page->url) : '';
        if (!$page instanceof ResolvedPage) {
            return '<span class="nowo-md-ref nowo-md-ref--hidden">' . self::e($this->translator?->trans('ref.hidden', [], MilkdownEditorType::DOMAIN) ?? 'Content not visible') . '</span>';
        }
        $title = self::e($page->title . ($node->anchor !== '' ? ' › ' . $node->anchor : ''));
        if ($url === '') {
            return '<span class="nowo-md-ref">' . $title . '</span>';
        }

        return '<a class="nowo-md-ref" href="' . self::e($url . ($node->anchor !== '' ? '#' . $node->anchor : '')) . '">' . $title . '</a>';
    }

    private function mention(Mention $node): string
    {
        $text = '@' . self::e($node->handle);
        if (!$node->user instanceof ResolvedUser) {
            return $text;
        }
        $url   = self::safeUrl((string) $node->user->url);
        $title = ' title="' . self::e($node->user->name) . '"';
        if ($this->mentionDisplay === 'name' && trim($node->user->name) !== '') {
            // For apps without user names (1.2.1): the person's name is the text, the handle stays in the markup.
            $title = ' title="@' . self::e($node->handle) . '" data-handle="' . self::e($node->handle) . '"';
            $text  = self::e($node->user->name);
        }

        return $url !== ''
            ? '<a class="nowo-md-mention" href="' . self::e($url) . '"' . $title . '>' . $text . '</a>'
            : '<span class="nowo-md-mention"' . $title . '>' . $text . '</span>';
    }

    private function icon(TablerIcon $node): string
    {
        $sprite = $this->icons->spriteUrl($node->name);
        if ($sprite === null || self::safeUrl($sprite) === '') {
            return ':tabler-' . self::e($node->name) . ':';
        }

        return '<svg class="nowo-md-icon" role="img" aria-label="' . self::e($node->name) . '"><use href="' . self::e($sprite . '#tabler-' . $node->name) . '"></use></svg>';
    }

    private function textDirective(TextDirective $node, string $content): string
    {
        if ($node->name === 'mark') {
            // 1.4: `bg=` (legacy `color=`) is the background, `text=` the text colour; names only, from the allow-list.
            $a    = $node->attributes;
            $text = $this->color($a['text'] ?? null);
            $bg   = $this->color($a['bg'] ?? null) ?? $this->color($a['color'] ?? null) ?? ($text === null ? ($this->markColors[0] ?? 'yellow') : 'none');

            return '<mark class="nowo-md-mark nowo-md-mark--' . self::e($bg) . ($text !== null ? ' nowo-md-text--' . self::e($text) : '') . '">' . $content . '</mark>';
        }

        return '<span class="nowo-md-directive" data-directive="' . self::e($node->name) . '">' . $content . '</span>';
    }

    private function container(ContainerDirective $node, string $content): string
    {
        $a = $node->attributes;

        return match ($node->name) {
            'callout' => $this->callout($a, $content),
            'details' => '<details class="nowo-md-details"><summary>' . self::e($a['summary'] ?? ($node->label !== '' ? $node->label : '…')) . '</summary>' . $content . '</details>',
            'align'   => '<div class="nowo-md-align nowo-md-align--' . (in_array($a['align'] ?? '', self::ALIGNMENTS, true) ? $a['align'] : 'left') . $this->blockColors($a) . '">' . $content . '</div>',
            default   => '<div class="nowo-md-directive" data-directive="' . self::e($node->name) . '">' . $content . '</div>',
        };
    }

    /**
     * A callout; with a resolvable `icon=` (1.7: a Tabler name, or an emoji) the icon comes first, decorative, and the
     * content is wrapped in `.nowo-md-callout__body`. The emoji is drawn by CSS from `data-emoji` so the element has no
     * text (excerpts and plain-text extraction keep only the body).
     *
     * @param array<string, string> $a
     */
    private function callout(array $a, string $content): string
    {
        $class = 'nowo-md-callout nowo-md-callout--' . (in_array($a['type'] ?? '', self::CALLOUT_TYPES, true) ? $a['type'] : 'info');
        $value = $a['icon'] ?? '';
        $icon  = '';
        if (preg_match(Configuration::ICON_PATTERN, $value) === 1) {
            $sprite = $this->icons->spriteUrl($value);
            if ($sprite !== null && self::safeUrl($sprite) !== '') {
                $icon = '<svg class="nowo-md-icon nowo-md-callout__icon" aria-hidden="true" focusable="false"><use href="' . self::e($sprite . '#tabler-' . $value) . '"></use></svg>';
            }
        } elseif (self::isEmoji($value)) {
            $icon = '<span class="nowo-md-callout__icon nowo-md-callout__emoji" data-emoji="' . self::e($value) . '" aria-hidden="true"></span>';
        }
        if ($icon === '') {
            return '<div class="' . $class . '" role="note">' . $content . '</div>';
        }

        return '<div class="' . $class . ' nowo-md-callout--icon" role="note">' . $icon . '<div class="nowo-md-callout__body">' . $content . '</div></div>';
    }

    /**
     * An emoji value of a callout icon: 1–8 code points, none ASCII, a letter, a digit, a separator or a control (ZWJ,
     * VS16 and the keycap mark allowed). The editor uses the same rule.
     */
    public static function isEmoji(string $value): bool
    {
        return preg_match('/^(?:[^\p{L}\p{N}\p{Z}\p{C}\x00-\x7F]|\x{200D}|\x{FE0F}|\x{20E3})+$/u', $value) === 1 && preg_match_all('/./su', $value) <= 8;
    }

    /** A colour name from the allow-list (`markdown.mark_colors`), or null. */
    private function color(?string $name): ?string
    {
        return $name !== null && in_array($name, $this->markColors, true) ? $name : null;
    }

    /**
     * Classes of a coloured block (`::: {text=… bg=…}`, 1.3), with a leading space; '' without colours.
     *
     * @param array<string, string> $attributes
     */
    private function blockColors(array $attributes): string
    {
        $text = $this->color($attributes['text'] ?? null);
        $bg   = $this->color($attributes['bg'] ?? null);

        return ($text !== null ? ' nowo-md-text--' . $text : '') . ($bg !== null ? ' nowo-md-bg--' . $bg : '');
    }

    private function leaf(LeafDirective $node): string
    {
        foreach ($this->directiveRenderers as $renderer) {
            if ($renderer->supports($node->name)) {
                return $renderer->render($node);
            }
        }

        return '<div class="nowo-md-directive nowo-md-directive--leaf" data-directive="' . self::e($node->name) . '"></div>';
    }
}
