<?php

declare(strict_types=1);

namespace Nowo\MilkdownEditorBundle\DependencyInjection\Compiler;

use Symfony\Component\DependencyInjection\Compiler\CompilerPassInterface;
use Symfony\Component\DependencyInjection\ContainerBuilder;

use function dirname;
use function is_string;

/**
 * Registers the `@NowoMilkdownEditorBundle` Twig namespace (REQ-TWIG-001): the application override directory
 * `templates/bundles/NowoMilkdownEditorBundle` first (when it exists), then the bundle views, plus
 * `@!NowoMilkdownEditorBundle` for overrides that extend the original template.
 *
 * @author Héctor Franco Aceituno <hectorfranco@nowo.tech>
 */
final class TwigPathsPass implements CompilerPassInterface
{
    /** Twig namespace, bundle class name and translation domain (REQ-TWIG-002 / REQ-I18N-003). */
    public const TWIG_NAMESPACE = 'NowoMilkdownEditorBundle';

    /**
     * Adds the override directory (prepended) and the bundle views to the native Twig filesystem loader; does
     * nothing when Twig is not installed.
     *
     * @param ContainerBuilder $container The container being compiled
     */
    public function process(ContainerBuilder $container): void
    {
        $loaderId = $this->loaderId($container);
        if ($loaderId === null) {
            return;
        }
        $definition = $container->getDefinition($loaderId);

        $projectDir = $container->hasParameter('kernel.project_dir') ? $container->getParameter('kernel.project_dir') : null;
        if (is_string($projectDir) && is_dir($override = rtrim($projectDir, '/\\') . '/templates/bundles/' . self::TWIG_NAMESPACE)) {
            // @igor-ignore - Compile-time DI definition wiring; runs once at container build
            $definition->addMethodCall('prependPath', [$override, self::TWIG_NAMESPACE]);
        }
        $views = dirname(__DIR__, 2) . '/Resources/views';
        // @igor-ignore - Compile-time DI definition wiring; runs once at container build
        $definition->addMethodCall('addPath', [$views, self::TWIG_NAMESPACE]);
        // @igor-ignore - Compile-time DI definition wiring; runs once at container build
        $definition->addMethodCall('addPath', [$views, '!' . self::TWIG_NAMESPACE]);
    }

    /**
     * The native Twig filesystem loader: the definition behind `twig.loader.native` (alias chains followed), then a
     * `twig.loader.native` definition, then `twig.loader.native_filesystem`.
     */
    private function loaderId(ContainerBuilder $container): ?string
    {
        if ($container->hasAlias('twig.loader.native')) {
            $id = (string) $container->getAlias('twig.loader.native');
            for ($hops = 0; $hops < 32 && $container->hasAlias($id); ++$hops) {
                $id = (string) $container->getAlias($id);
            }

            return $container->hasDefinition($id) ? $id : null;
        }
        foreach (['twig.loader.native', 'twig.loader.native_filesystem'] as $id) {
            if ($container->hasDefinition($id)) {
                return $id;
            }
        }

        return null;
    }
}
