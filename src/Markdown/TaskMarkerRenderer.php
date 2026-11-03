<?php

declare(strict_types=1);

namespace Nowo\MilkdownEditorBundle\Markdown;

use League\CommonMark\Extension\TaskList\TaskListItemMarker;
use League\CommonMark\Extension\TaskList\TaskListItemMarkerRenderer;
use League\CommonMark\Node\Node;
use League\CommonMark\Renderer\ChildNodeRendererInterface;
use League\CommonMark\Renderer\NodeRendererInterface;
use League\CommonMark\Util\HtmlElement;
use Nowo\MilkdownEditorBundle\Form\MilkdownEditorType;
use Stringable;
use Symfony\Contracts\Translation\TranslatorInterface;

use function assert;

/**
 * GFM task-list checkboxes with an accessible name (1.3.1, axe `label`): league/commonmark renders a nameless
 * `<input type="checkbox" disabled>`; the read side names it like the editor's checkbox (`task.toggle`, *Done*), its
 * checked state saying whether the task is done.
 */
final readonly class TaskMarkerRenderer implements NodeRendererInterface
{
    /**
     * @param TranslatorInterface|null $translator Translates the name (per request locale)
     */
    public function __construct(private ?TranslatorInterface $translator = null)
    {
    }

    /**
     * Renders the checkbox with `aria-label`.
     *
     * @param Node $node A task-list marker
     * @param ChildNodeRendererInterface $childRenderer Unused (the marker has no children)
     */
    public function render(Node $node, ChildNodeRendererInterface $childRenderer): Stringable
    {
        TaskListItemMarker::assertInstanceOf($node);
        assert($node instanceof TaskListItemMarker);
        $checkbox = (new TaskListItemMarkerRenderer())->render($node, $childRenderer);
        if ($checkbox instanceof HtmlElement) {
            $checkbox->setAttribute('aria-label', $this->translator?->trans('task.toggle', [], MilkdownEditorType::DOMAIN) ?? 'Done');
        }

        return $checkbox;
    }
}
