<?php

declare(strict_types=1);

namespace Nowo\MilkdownEditorBundle\Tests\Integration;

use Nowo\MilkdownEditorBundle\Markdown\MarkdownRendererInterface;
use Nowo\MilkdownEditorBundle\NowoMilkdownEditorBundle;
use Symfony\Bundle\FrameworkBundle\FrameworkBundle;
use Symfony\Bundle\FrameworkBundle\Kernel\MicroKernelTrait;
use Symfony\Bundle\TwigBundle\TwigBundle;
use Symfony\Component\Config\Loader\LoaderInterface;
use Symfony\Component\DependencyInjection\Compiler\CompilerPassInterface;
use Symfony\Component\DependencyInjection\Compiler\PassConfig;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\Form\FormFactoryInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Kernel;
use Symfony\Component\Routing\Loader\Configurator\RoutingConfigurator;
use Twig\Extra\TwigExtraBundle\TwigExtraBundle;

use function assert;

/**
 * Minimal kernel: FrameworkBundle (forms, assets, translator), Twig, Twig Extra and the bundle; one route that renders
 * a user's Markdown (worker tests).
 */
final class TestKernel extends Kernel
{
    use MicroKernelTrait;

    /**
     * @param array<string, mixed> $bundleConfig `nowo_milkdown_editor` configuration
     */
    public function __construct(string $environment = 'test', bool $debug = false, private readonly array $bundleConfig = [])
    {
        parent::__construct($environment, $debug);
    }

    public function registerBundles(): iterable
    {
        yield new FrameworkBundle();
        yield new TwigBundle();
        yield new TwigExtraBundle();
        yield new NowoMilkdownEditorBundle();
    }

    public function getProjectDir(): string
    {
        return __DIR__ . '/Fixtures/project';
    }

    public function getCacheDir(): string
    {
        return sys_get_temp_dir() . '/nowo-milkdown-editor-bundle/cache/' . md5(serialize($this->bundleConfig));
    }

    public function getLogDir(): string
    {
        return sys_get_temp_dir() . '/nowo-milkdown-editor-bundle/log';
    }

    protected function build(ContainerBuilder $container): void
    {
        // The tests read the form factory from the container.
        $container->addCompilerPass(new class implements CompilerPassInterface {
            public function process(ContainerBuilder $container): void
            {
                $container->getAlias(FormFactoryInterface::class)->setPublic(true);
            }
        }, PassConfig::TYPE_BEFORE_REMOVING);
    }

    protected function configureContainer(ContainerBuilder $container, LoaderInterface $loader): void
    {
        $container->loadFromExtension('framework', [
            'secret'               => 'test',
            'test'                 => true,
            'http_method_override' => false,
            'form'                 => ['enabled' => true, 'csrf_protection' => false],
            'csrf_protection'      => false,
            'translator'           => ['enabled' => true, 'default_path' => '%kernel.project_dir%/translations', 'fallbacks' => ['en']],
            'default_locale'       => 'en',
            'assets'               => ['enabled' => true],
            'router'               => ['utf8' => true, 'resource' => 'kernel::loadRoutes', 'type' => 'service'],
            'property_access'      => true,
        ]);
        $container->loadFromExtension('twig', ['strict_variables' => true, 'default_path' => '%kernel.project_dir%/templates']);
        $container->loadFromExtension('nowo_milkdown_editor', $this->bundleConfig);
    }

    /**
     * Renders the Markdown note of `?user=` (the worker test's page).
     */
    public function note(Request $request): Response
    {
        $renderer = $this->getContainer()->get(MarkdownRendererInterface::class);
        assert($renderer instanceof MarkdownRendererInterface);
        $user = $request->query->getString('user');

        return new Response($renderer->render('Note of ' . $user . '[^1].' . "\n\n" . '[^1]: Private to ' . $user . '.'));
    }

    protected function configureRoutes(RoutingConfigurator $routes): void
    {
        $routes->add('note', '/note')->controller('kernel::note');
    }
}
