<?php

declare(strict_types=1);

namespace Nowo\MilkdownEditorBundle;

use Nowo\MilkdownEditorBundle\DependencyInjection\Compiler\TwigPathsPass;
use Nowo\MilkdownEditorBundle\DependencyInjection\NowoMilkdownEditorExtension;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Extension\ExtensionInterface;
use Symfony\Component\HttpKernel\Bundle\Bundle;

/**
 * Markdown editing for Symfony forms with Milkdown + a reduced Crepe build, and a league/commonmark renderer for
 * the same Markdown dialect (page links by id, mentions, Tabler icons, directives, math, Mermaid).
 *
 * @author Héctor Franco Aceituno <hectorfranco@nowo.tech>
 * @copyright 2026 Nowo.tech
 */
final class NowoMilkdownEditorBundle extends Bundle
{
    /**
     * Registers the Twig paths compiler pass (application overrides first, then the bundle views).
     *
     * @param ContainerBuilder $container The container being compiled
     */
    public function build(ContainerBuilder $container): void
    {
        parent::build($container);
        $container->addCompilerPass(new TwigPathsPass());
    }

    /**
     * Returns the bundle extension (alias `nowo_milkdown_editor`).
     *
     * @return ExtensionInterface The lazily created extension
     */
    public function getContainerExtension(): ExtensionInterface
    {
        if (!$this->extension instanceof ExtensionInterface) {
            // @igor-ignore - Symfony bundle extension lazy-init at boot; not request state
            $this->extension = new NowoMilkdownEditorExtension();
        }

        return $this->extension;
    }
}
