<?php

declare(strict_types=1);

namespace Nowo\MilkdownEditorBundle\Markdown\Directive;

use Nowo\MilkdownEditorBundle\Markdown\Node\LeafDirective;

/**
 * Renders host leaf directives such as `::beacon{type=issue id=…}` (autoconfigured with the
 * `nowo_milkdown_editor.directive_renderer` tag). `prepare()` gets every matching node of a document first, so
 * the host can load them in one query per type.
 *
 * @author Héctor Franco Aceituno <hectorfranco@nowo.tech>
 */
interface DirectiveRendererInterface
{
    /**
     * Whether this renderer handles directives named `name`.
     */
    public function supports(string $name): bool;

    /**
     * Called once per document with every supported node, before rendering.
     *
     * @param list<LeafDirective> $nodes The directives of the document this renderer supports
     */
    public function prepare(array $nodes): void;

    /**
     * Safe HTML for one node (escape every value taken from its attributes).
     */
    public function render(LeafDirective $node): string;
}
