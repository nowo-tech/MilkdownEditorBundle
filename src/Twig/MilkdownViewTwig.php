<?php

declare(strict_types=1);

namespace Nowo\MilkdownEditorBundle\Twig;

use LogicException;
use Nowo\MilkdownEditorBundle\Diff\MarkdownDiffRendererInterface;
use Nowo\MilkdownEditorBundle\Form\MilkdownEditorType;
use Symfony\Component\Form\FormFactoryInterface;
use Symfony\Component\Form\FormRenderer;
use Twig\Attribute\AsTwigFunction;
use Twig\Environment;

/**
 * Twig functions of 1.6:
 *
 * - `nowo_milkdown_view(markdown, options)`: a read-only editor mount outside any form (commenters without the edit
 *   right, `version_view`). It is the form type's widget (same options, same JSON) with `disabled: true` and no form;
 * - `nowo_milkdown_diff(old, new)`: the rendered diff of two Markdown versions ({@see MarkdownDiffRendererInterface}).
 *
 * @author Héctor Franco Aceituno <hectorfranco@nowo.tech>
 */
final readonly class MilkdownViewTwig
{
    /**
     * @param MarkdownDiffRendererInterface $diff The diff renderer
     * @param FormFactoryInterface|null $forms Builds the widget view (null when the application has no forms)
     */
    public function __construct(
        private MarkdownDiffRendererInterface $diff,
        private ?FormFactoryInterface $forms = null,
    ) {
    }

    /**
     * A read-only editor on `markdown` (no form, no submitted name).
     *
     * @param Environment $twig The Twig environment (form theme)
     * @param string|null $markdown The Markdown
     * @param array<string, mixed> $options `MilkdownEditorType` options (`profile`, `features`, `comments`, `version`, `label`, …)
     */
    #[AsTwigFunction('nowo_milkdown_view', needsEnvironment: true, isSafe: ['html'])]
    public function view(Environment $twig, ?string $markdown, array $options = []): string
    {
        if (!$this->forms instanceof FormFactoryInterface) {
            throw new LogicException('nowo_milkdown_view() needs symfony/form enabled (framework.form).');
        }
        $form = $this->forms->createNamed('nowo_milkdown_view_' . bin2hex(random_bytes(4)), MilkdownEditorType::class, $markdown ?? '', ['disabled' => true, 'required' => false] + $options);

        return $twig->getRuntime(FormRenderer::class)->searchAndRenderBlock($form->createView(), 'widget');
    }

    /**
     * The rendered diff of two versions (safe HTML; see docs/USAGE.md for the markup).
     *
     * @param string|null $old The older Markdown
     * @param string|null $new The newer Markdown
     */
    #[AsTwigFunction('nowo_milkdown_diff', isSafe: ['html'])]
    public function diff(?string $old, ?string $new): string
    {
        return $this->diff->render($old ?? '', $new ?? '')->html;
    }
}
