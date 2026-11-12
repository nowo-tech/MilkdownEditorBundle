<?php

declare(strict_types=1);

namespace Nowo\MilkdownEditorBundle\Markdown;

use League\CommonMark\Extension\TaskList\TaskListItemMarker;
use League\CommonMark\Node\Node;
use League\CommonMark\Renderer\ChildNodeRendererInterface;
use League\CommonMark\Renderer\NodeRendererInterface;
use League\CommonMark\Util\HtmlElement;
use Nowo\MilkdownEditorBundle\Form\MilkdownEditorType;
use Stringable;
use Symfony\Contracts\Translation\TranslatorInterface;

use function assert;

/**
 * GFM task-list checkboxes with an accessible name (1.3.1, axe `label`), named like the editor's checkbox
 * (`task.toggle`, *Done*), the checked state saying whether the task is done.
 *
 * 1.17: the element is built from a fixed attribute set ({@see self::CHECKBOX_ATTRIBUTES}) and carries the editor's
 * class ({@see self::BOX_CLASS}), so the server body and the read-only editor show the same disabled checkbox. Node
 * data attributes are ignored: nothing else can reach the `<input>`, and a host sanitiser can allow exactly this set.
 */
final readonly class TaskMarkerRenderer implements NodeRendererInterface
{
    /** Class of the checkbox (the editor's `.nowo-milkdown-task__box`). */
    public const BOX_CLASS = 'nowo-milkdown-task__box';

    /**
     * Every attribute the checkbox can carry: `type` is always `checkbox`, `disabled` is always set, `checked` only for
     * a done task, `aria-label` is the translated name. A host sanitiser allows `<input>` with these attributes only.
     *
     * @var list<string>
     */
    public const CHECKBOX_ATTRIBUTES = ['type', 'class', 'disabled', 'checked', 'aria-label'];

    /**
     * @param TranslatorInterface|null $translator Translates the name (per request locale)
     */
    public function __construct(private ?TranslatorInterface $translator = null)
    {
    }

    /**
     * Renders `<input type="checkbox" class="nowo-milkdown-task__box" disabled [checked] aria-label="…">`.
     *
     * @param Node $node A task-list marker
     * @param ChildNodeRendererInterface $childRenderer Unused (the marker has no children)
     */
    public function render(Node $node, ChildNodeRendererInterface $childRenderer): Stringable
    {
        TaskListItemMarker::assertInstanceOf($node);
        assert($node instanceof TaskListItemMarker);
        $attributes = ['type' => 'checkbox', 'class' => self::BOX_CLASS, 'disabled' => ''];
        if ($node->isChecked()) {
            $attributes['checked'] = '';
        }
        $attributes['aria-label'] = $this->translator?->trans('task.toggle', [], MilkdownEditorType::DOMAIN) ?? 'Done';

        return new HtmlElement('input', $attributes, '', true);
    }
}
