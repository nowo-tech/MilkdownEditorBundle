<?php

declare(strict_types=1);

namespace Nowo\MilkdownEditorBundle\DependencyInjection;

use Nowo\MilkdownEditorBundle\Diff\MarkdownDiffRenderer;
use Nowo\MilkdownEditorBundle\Form\MilkdownEditorType;
use Nowo\MilkdownEditorBundle\Markdown\HostSchemes;
use Nowo\MilkdownEditorBundle\Markdown\MilkdownMarkdownRenderer;
use Nowo\MilkdownEditorBundle\Markdown\Resolver\AllowlistIconResolver;
use Nowo\MilkdownEditorBundle\Markdown\Resolver\TablerCatalog;
use Nowo\MilkdownEditorBundle\Twig\MilkdownEditorTwig;
use Symfony\Component\Config\Definition\Exception\InvalidConfigurationException;
use Symfony\Component\Config\FileLocator;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Extension\Extension;
use Symfony\Component\DependencyInjection\Extension\PrependExtensionInterface;
use Symfony\Component\DependencyInjection\Loader\PhpFileLoader;
use Symfony\Component\DependencyInjection\Reference;

use function is_string;
use function json_encode;
use function preg_match;
use function sprintf;
use function strtolower;

use const JSON_UNESCAPED_SLASHES;

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
        /** @var array{default_profile: string, profiles: array<string, array<string, mixed>>, markdown: array<string, mixed>&array{icon_sprite_url: ?string, icons: list<string>, icon_catalog: bool, max_input_length: int, mark_colors: list<string>, max_references: int, host_schemes: array<string, array{image?: ?string, file?: ?string, preview?: ?string}>, host_image_origins: list<string>, host_url_patterns: list<array{pattern: string, scheme: string, url: string}>, host_url_hosts: list<string>, file_preview_sandbox: list<string>}} $config */
        $config                               = $this->processConfiguration(new Configuration(), $configs);
        $config['markdown']['host_url_hosts'] = self::urlHosts($config['markdown']['host_url_hosts'], $container);

        $container->setParameter(Configuration::ALIAS . '.default_profile', $config['default_profile']);
        $container->setParameter(Configuration::ALIAS . '.profiles', $config['profiles']);
        $container->setParameter(Configuration::ALIAS . '.markdown', $config['markdown']);

        (new PhpFileLoader($container, new FileLocator(__DIR__ . '/../Resources/config')))->load('services.php');

        $container->getDefinition(HostSchemes::class)
            ->setArgument('$schemes', $config['markdown']['host_schemes'])
            ->setArgument('$imageOrigins', $config['markdown']['host_image_origins'])
            ->setArgument('$urlPatterns', $config['markdown']['host_url_patterns'])
            ->setArgument('$urlHosts', $config['markdown']['host_url_hosts']);
        $container->getDefinition(AllowlistIconResolver::class)
            ->setArgument('$spriteUrl', $config['markdown']['icon_sprite_url'])
            ->setArgument('$icons', $config['markdown']['icons'])
            ->setArgument('$catalog', $config['markdown']['icon_catalog'] ? new Reference(TablerCatalog::class) : null);
        $container->getDefinition(MilkdownMarkdownRenderer::class)
            ->setArgument('$options', $config['markdown']);
        $container->getDefinition(MarkdownDiffRenderer::class)
            ->setArgument('$maxInputLength', $config['markdown']['max_input_length']);
        $container->getDefinition(MilkdownEditorType::class)
            ->setArgument('$maxInputLength', $config['markdown']['max_input_length'])
            ->setArgument('$markColors', $config['markdown']['mark_colors']);
        $container->getDefinition(MilkdownEditorTwig::class)
            ->setArgument('$previewSandbox', implode(' ', $config['markdown']['file_preview_sandbox']))
            ->setArgument('$maxPreviews', $config['markdown']['max_references']);
    }

    /**
     * 1.14: `host_url_hosts` with its literal entries lower-cased and validated; env placeholders
     * (`%env(key:host:url:DEFAULT_URI)%`) are kept as they are, and {@see HostSchemes} validates them once resolved.
     *
     * @param array<mixed> $hosts The processed entries
     * @param ContainerBuilder $container The container being built (knows the env placeholders)
     *
     * @throws InvalidConfigurationException When a literal entry is not a host name with an optional port
     *
     * @return list<mixed>
     */
    public static function urlHosts(array $hosts, ContainerBuilder $container): array
    {
        $out = [];
        foreach ($hosts as $host) {
            $envs = [];
            if (is_string($host)) {
                $container->resolveEnvPlaceholders($host, '%%env(%s)%%', $envs);
            }
            if ($envs !== []) {
                $out[] = $host;
                continue;
            }
            $literal = is_string($host) ? strtolower($host) : null;
            if ($literal === null || preg_match(HostSchemes::HOST_PATTERN, $literal) !== 1) {
                throw new InvalidConfigurationException(sprintf('Invalid configuration for path "%s.markdown.host_url_hosts": host_url_hosts accepts host names with an optional port, without scheme or path (%s).', Configuration::ALIAS, json_encode($host, JSON_UNESCAPED_SLASHES)));
            }
            $out[] = $literal;
        }

        return $out;
    }

    /**
     * The configuration alias (`nowo_milkdown_editor`).
     */
    public function getAlias(): string
    {
        return Configuration::ALIAS;
    }
}
