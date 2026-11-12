<?php

declare(strict_types=1);

namespace Nowo\MilkdownEditorBundle\Markdown;

use League\CommonMark\Extension\CommonMark\Node\Block\ListItem;
use League\CommonMark\Extension\CommonMark\Renderer\Block\ListItemRenderer;
use League\CommonMark\Extension\TaskList\TaskListItemMarker;
use League\CommonMark\Node\Block\AbstractBlock;
use League\CommonMark\Node\Block\Paragraph;
use League\CommonMark\Node\Block\TightBlockInterface;
use League\CommonMark\Node\Inline\Text;
use League\CommonMark\Node\Node;
use League\CommonMark\Renderer\ChildNodeRendererInterface;
use League\CommonMark\Renderer\NodeRendererInterface;
use League\CommonMark\Util\HtmlElement;
use Stringable;

use function assert;
use function ltrim;

/**
 * Task items with the editor's markup (1.17, Wiki UX review item 8): the read-only editor draws a task as
 * `li.nowo-milkdown-task[data-checked] > input.nowo-milkdown-task__box + div.nowo-milkdown-task__content`, so the
 * server body does too and nothing moves when a host swaps one for the other. Other list items keep CommonMark's
 * `<li>`.
 *
 * The rendered document is the renderer's own (one per `convert()`), so the marker is moved out of the first paragraph
 * while rendering; no state is kept between documents.
 */
final readonly class TaskItemRenderer implements NodeRendererInterface
{
    /** Class of a task `<li>` (the editor's `.nowo-milkdown-task`). */
    public const ITEM_CLASS = 'nowo-milkdown-task';

    /** Class of the wrapper of the item's content (the editor's `.nowo-milkdown-task__content`). */
    public const CONTENT_CLASS = 'nowo-milkdown-task__content';

    /**
     * Renders a task item, or a plain item with CommonMark's renderer.
     *
     * @param Node $node A list item
     * @param ChildNodeRendererInterface $childRenderer Renders the marker and the item's blocks
     */
    public function render(Node $node, ChildNodeRendererInterface $childRenderer): Stringable
    {
        ListItem::assertInstanceOf($node);
        assert($node instanceof ListItem);
        $paragraph = $node->firstChild();
        $marker    = $paragraph instanceof Paragraph ? $paragraph->firstChild() : null;
        if (!$marker instanceof TaskListItemMarker) {
            return (new ListItemRenderer())->render($node, $childRenderer);
        }

        $box = $childRenderer->renderNodes([$marker]);
        $marker->detach();
        // The space after `[ ]` / `[x]` belongs to the marker (the editor keeps no leading space either).
        $text = $paragraph->firstChild();
        if ($text instanceof Text) {
            $text->setLiteral(ltrim($text->getLiteral()));
            if ($text->getLiteral() === '') {
                $text->detach();
            }
        }

        $tight    = ($parent = $node->parent()) instanceof TightBlockInterface && $parent->isTight();
        $contents = $childRenderer->renderNodes($node->children());
        if ($this->needsSeparator($node->firstChild(), $tight)) {
            $contents = "\n" . $contents;
        }
        if ($this->needsSeparator($node->lastChild(), $tight)) {
            $contents .= "\n";
        }

        return new HtmlElement(
            'li',
            ['class' => self::ITEM_CLASS, 'data-checked' => $marker->isChecked() ? 'true' : 'false'],
            $box . new HtmlElement('div', ['class' => self::CONTENT_CLASS], $contents),
        );
    }

    /** CommonMark's rule: a block child is on its own line, except the paragraph of a tight list. */
    private function needsSeparator(?Node $child, bool $tight): bool
    {
        return $child instanceof AbstractBlock && (!$child instanceof Paragraph || !$tight);
    }
}
