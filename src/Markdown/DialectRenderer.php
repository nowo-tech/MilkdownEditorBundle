<?php

declare(strict_types=1);

namespace Nowo\MilkdownEditorBundle\Markdown;

use InvalidArgumentException;
use League\CommonMark\Node\Node;
use League\CommonMark\Renderer\ChildNodeRendererInterface;
use League\CommonMark\Renderer\NodeRendererInterface;
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
     */
    public function __construct(
        private IconResolverInterface $icons,
        private iterable $directiveRenderers = [],
        private array $markColors = ['yellow'],
        private ?TranslatorInterface $translator = null,
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
     * Keeps relative URLs and http(s) URLs; anything else (javascript:, data:…) becomes ''.
     */
    public static function safeUrl(string $url): string
    {
        $url = trim($url);
        if (preg_match('~^[\\\\/][\\\\/]~', $url) === 1) {
            return ''; // protocol-relative (`//host`, `/\host`, `\\host`): another origin
        }
        if (preg_match('~^([^/?#]*):~', $url, $m) === 1) {
            return preg_match('~^https?$~i', $m[1]) === 1 ? $url : '';
        }

        return $url;
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
            $color = in_array($node->attributes['color'] ?? '', $this->markColors, true) ? $node->attributes['color'] : ($this->markColors[0] ?? 'yellow');

            return '<mark class="nowo-md-mark nowo-md-mark--' . self::e($color) . '">' . $content . '</mark>';
        }

        return '<span class="nowo-md-directive" data-directive="' . self::e($node->name) . '">' . $content . '</span>';
    }

    private function container(ContainerDirective $node, string $content): string
    {
        $a = $node->attributes;

        return match ($node->name) {
            'callout' => '<div class="nowo-md-callout nowo-md-callout--' . (in_array($a['type'] ?? '', self::CALLOUT_TYPES, true) ? $a['type'] : 'info') . '" role="note">' . $content . '</div>',
            'details' => '<details class="nowo-md-details"><summary>' . self::e($a['summary'] ?? ($node->label !== '' ? $node->label : '…')) . '</summary>' . $content . '</details>',
            'align'   => '<div class="nowo-md-align nowo-md-align--' . (in_array($a['align'] ?? '', self::ALIGNMENTS, true) ? $a['align'] : 'left') . '">' . $content . '</div>',
            default   => '<div class="nowo-md-directive" data-directive="' . self::e($node->name) . '">' . $content . '</div>',
        };
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
