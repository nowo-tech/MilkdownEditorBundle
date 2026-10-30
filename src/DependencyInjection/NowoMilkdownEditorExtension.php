<?php

declare(strict_types=1);

namespace Nowo\MilkdownEditorBundle\DependencyInjection;

use Nowo\MilkdownEditorBundle\Markdown\MilkdownMarkdownRenderer;
use Nowo\MilkdownEditorBundle\Markdown\Resolver\AllowlistIconResolver;
use Symfony\Component\Config\FileLocator;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Extension\Extension;
use Symfony\Component\DependencyInjection\Extension\PrependExtensionInterface;
use Symfony\Component\DependencyInjection\Loader\PhpFileLoader;

/**
 * Loads `nowo_milkdown_editor`, registers the asset package and the form theme.
 *
 * Container parameters: `nowo_milkdown_editor.default_profile`, `nowo_milkdown_editor.profiles`,
 * `nowo_milkdown_editor.markdown`.
 *
 * @author Héctor Franco Aceituno <hectorfranco@nowo.tech>
 */
final class NowoMilkdownEditorExtension extends Extension implements PrependExtensionInterface
{
    /** Public path created by `assets:install` for this bundle (REQ-ASSETS-004). */
    public const ASSET_BASE_PATH = '/bundles/nowomilkdowneditor';

    /** Form theme with the `milkdown_editor_widget` block. */
    public const FORM_THEME = '@NowoMilkdownEditorBundle/Form/milkdown_editor_theme.html.twig';

    /**
     * Registers the `nowo_milkdown_editor` asset package and appends the form theme.
     *
     * @param ContainerBuilder $container The container being built
     */
    public function prepend(ContainerBuilder $container): void
    {
        if ($container->hasExtension('framework')) {
            $container->prependExtensionConfig('framework', [
                'assets' => ['packages' => [Configuration::ALIAS => ['base_path' => self::ASSET_BASE_PATH]]],
            ]);
        }
        if ($container->hasExtension('twig')) {
            $container->prependExtensionConfig('twig', ['form_themes' => [self::FORM_THEME]]);
        }
    }

    /**
     * Loads the services and exposes the processed configuration.
     *
     * @param array<array<string, mixed>> $configs Raw configuration blocks
     * @param ContainerBuilder $container The container being built
     */
    public function load(array $configs, ContainerBuilder $container): void
    {
        /** @var array{default_profile: string, profiles: array<string, array<string, mixed>>, markdown: array<string, mixed>&array{icon_sprite_url: ?string, icons: list<string>}} $config */
        $config = $this->processConfiguration(new Configuration(), $configs);

        $container->setParameter(Configuration::ALIAS . '.default_profile', $config['default_profile']);
        $container->setParameter(Configuration::ALIAS . '.profiles', $config['profiles']);
        $container->setParameter(Configuration::ALIAS . '.markdown', $config['markdown']);

        (new PhpFileLoader($container, new FileLocator(__DIR__ . '/../Resources/config')))->load('services.php');

        $container->getDefinition(AllowlistIconResolver::class)
            ->setArgument('$spriteUrl', $config['markdown']['icon_sprite_url'])
            ->setArgument('$icons', $config['markdown']['icons']);
        $container->getDefinition(MilkdownMarkdownRenderer::class)
            ->setArgument('$options', $config['markdown']);
    }

    /**
     * The configuration alias (`nowo_milkdown_editor`).
     */
    public function getAlias(): string
    {
        return Configuration::ALIAS;
    }
}
