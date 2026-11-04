<?php

declare(strict_types=1);

namespace Nowo\MilkdownEditorBundle\Tests\Unit\DependencyInjection;

use Nowo\MilkdownEditorBundle\DependencyInjection\Compiler\TwigPathsPass;
use Nowo\MilkdownEditorBundle\DependencyInjection\NowoMilkdownEditorExtension;
use Nowo\MilkdownEditorBundle\Form\MilkdownEditorType;
use Nowo\MilkdownEditorBundle\Markdown\MilkdownMarkdownRenderer;
use Nowo\MilkdownEditorBundle\Markdown\Resolver\AllowlistIconResolver;
use Nowo\MilkdownEditorBundle\Markdown\Resolver\TablerCatalog;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Definition;
use Symfony\Component\DependencyInjection\Extension\Extension;
use Symfony\Component\DependencyInjection\Reference;

use function dirname;

final class ExtensionTest extends TestCase
{
    #[Test]
    public function loadExposesParametersAndConfiguresTheRenderer(): void
    {
        $container = new ContainerBuilder();
        $extension = new NowoMilkdownEditorExtension();
        $extension->load([['markdown' => ['icons' => ['bug'], 'icon_sprite_url' => '/s.svg', 'max_input_length' => 5000]]], $container);
        self::assertSame('nowo_milkdown_editor', $extension->getAlias());
        self::assertSame('default', $container->getParameter('nowo_milkdown_editor.default_profile'));
        self::assertSame(['bug'], $container->getDefinition(AllowlistIconResolver::class)->getArgument('$icons'));
        self::assertSame('/s.svg', $container->getDefinition(AllowlistIconResolver::class)->getArgument('$spriteUrl'));
        self::assertIsArray($container->getDefinition(MilkdownMarkdownRenderer::class)->getArgument('$options'));
        self::assertSame(5000, $container->getDefinition(MilkdownEditorType::class)->getArgument('$maxInputLength'));
        self::assertNull($container->getDefinition(AllowlistIconResolver::class)->getArgument('$catalog'));
        self::assertTrue($container->hasDefinition(TablerCatalog::class));

        // 1.7: markdown.icon_catalog gives the resolver the bundled catalog.
        $catalog = new ContainerBuilder();
        $extension->load([['markdown' => ['icon_catalog' => true]]], $catalog);
        $reference = $catalog->getDefinition(AllowlistIconResolver::class)->getArgument('$catalog');
        self::assertInstanceOf(Reference::class, $reference);
        self::assertSame(TablerCatalog::class, (string) $reference);
    }

    #[Test]
    public function prependRegistersAssetsAndFormThemeOnlyWhenTheExtensionsExist(): void
    {
        $empty = new ContainerBuilder();
        (new NowoMilkdownEditorExtension())->prepend($empty);
        self::assertSame([], $empty->getExtensionConfig('framework'));

        $container = new ContainerBuilder();
        foreach (['framework', 'twig'] as $alias) {
            $container->registerExtension(new class($alias) extends Extension {
                public function __construct(private readonly string $alias)
                {
                }

                public function load(array $configs, ContainerBuilder $container): void
                {
                }

                public function getAlias(): string
                {
                    return $this->alias;
                }
            });
        }
        (new NowoMilkdownEditorExtension())->prepend($container);
        /** @var array{assets: array{packages: array{nowo_milkdown_editor: array{base_path: string}}}} $framework */
        $framework = $container->getExtensionConfig('framework')[0];
        self::assertSame('/bundles/nowomilkdowneditor', $framework['assets']['packages']['nowo_milkdown_editor']['base_path']);
        self::assertSame([NowoMilkdownEditorExtension::FORM_THEME], $container->getExtensionConfig('twig')[0]['form_themes']);
    }

    #[Test]
    public function twigPathsPassFollowsTheLoaderAliasesAndOverrides(): void
    {
        $pass = new TwigPathsPass();

        $none = new ContainerBuilder();
        $pass->process($none);
        self::assertFalse($none->hasDefinition('twig.loader.native_filesystem'));

        $aliased = new ContainerBuilder();
        $aliased->setDefinition('loader', new Definition());
        $aliased->setAlias('middle', 'loader');
        $aliased->setAlias('twig.loader.native', 'middle');
        $aliased->setParameter('kernel.project_dir', dirname(__DIR__, 2) . '/Integration/Fixtures/project');
        $pass->process($aliased);
        $calls = $aliased->getDefinition('loader')->getMethodCalls();
        self::assertSame(['prependPath', 'addPath', 'addPath'], array_column($calls, 0));

        $dangling = new ContainerBuilder();
        $dangling->setAlias('twig.loader.native', 'missing');
        $pass->process($dangling);
        self::assertFalse($dangling->hasDefinition('missing'));

        $plain = new ContainerBuilder();
        $plain->setDefinition('twig.loader.native_filesystem', new Definition());
        $pass->process($plain);
        self::assertCount(2, $plain->getDefinition('twig.loader.native_filesystem')->getMethodCalls());
    }
}
