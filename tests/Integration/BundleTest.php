<?php

declare(strict_types=1);

namespace Nowo\MilkdownEditorBundle\Tests\Integration;

use Nowo\MilkdownEditorBundle\Csp\CspNonceProviderInterface;
use Nowo\MilkdownEditorBundle\Form\MilkdownEditorType;
use Nowo\MilkdownEditorBundle\Markdown\MarkdownRendererInterface;
use Nowo\MilkdownEditorBundle\NowoMilkdownEditorBundle;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Symfony\Component\Asset\Packages;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\Form\FormFactoryInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Contracts\Translation\LocaleAwareInterface;
use Twig\Environment;

use const ENT_HTML5;
use const ENT_QUOTES;
use const JSON_THROW_ON_ERROR;

final class BundleTest extends TestCase
{
    private ?TestKernel $kernel = null;

    protected function tearDown(): void
    {
        if ($this->kernel instanceof TestKernel) {
            $this->kernel->shutdown();
            // FrameworkBundle::boot() registers Symfony's exception handler; give PHPUnit its own back.
            restore_exception_handler();
        }
        $this->kernel = null;
        parent::tearDown();
    }

    /**
     * @param array<string, mixed> $config
     */
    private function container(array $config = []): ContainerInterface
    {
        $kernel       = new TestKernel('test', false, $config);
        $this->kernel = $kernel;
        $kernel->boot();
        $container = $kernel->getContainer()->get('test.service_container');
        self::assertInstanceOf(ContainerInterface::class, $container);

        return $container;
    }

    /**
     * @template T of object
     *
     * @param class-string<T> $class
     *
     * @return T
     */
    private function service(ContainerInterface $container, string $id, string $class): object
    {
        $service = $container->get($id);
        self::assertInstanceOf($class, $service);

        return $service;
    }

    #[Test]
    public function itRendersTheWidgetWithOptionsNonceAndAssets(): void
    {
        $container = $this->container(['profiles' => ['default' => ['icons' => ['bug'], 'icon_sprite_url' => '/sprite.svg']]]);
        $request   = Request::create('/');
        $request->attributes->set('csp_nonce', 'n0nce');
        $this->service($container, 'request_stack', RequestStack::class)->push($request);

        $form = $this->service($container, FormFactoryInterface::class, FormFactoryInterface::class)
            ->createNamedBuilder('page')
            ->add('body', MilkdownEditorType::class, [
                'label'       => 'Body',
                'suggestions' => ['@' => '/users', '[[' => '/pages'],
                'upload_url'  => '/upload',
                'data'        => "# Hi\r\n",
            ])
            ->getForm();
        $html = $this->service($container, 'twig', Environment::class)
            ->createTemplate('{{ form_widget(form.body) }}')
            ->render(['form' => $form->createView()]);

        self::assertStringContainsString('class="nowo-milkdown"', $html);
        self::assertStringContainsString('data-theme="auto"', $html);
        self::assertStringContainsString('<textarea id="page_body" name="page[body]"', $html);
        self::assertStringContainsString('nonce="n0nce"', $html);
        self::assertStringContainsString('/bundles/nowomilkdowneditor/milkdown-editor.js', $html);
        self::assertSame(1, preg_match('/data-nowo-milkdown-options="([^"]+)"/', $html, $m));
        /** @var array{suggestions: array<string, string>, icons: list<string>, iconSpriteUrl: string, nonce: string, label: string, messages: array<string, string>, upload: array{url: string}} $options */
        $options = json_decode(html_entity_decode($m[1], ENT_QUOTES | ENT_HTML5), true, 512, JSON_THROW_ON_ERROR);
        self::assertSame(['@' => '/users', '[[' => '/pages'], $options['suggestions']);
        self::assertSame(['bug'], $options['icons']);
        self::assertSame('/sprite.svg', $options['iconSpriteUrl']);
        self::assertSame('n0nce', $options['nonce']);
        self::assertSame('Body', $options['label']);
        self::assertSame('Content not visible', $options['messages']['ref.hidden']);
        self::assertSame('/upload', $options['upload']['url']);

        $form->submit(['body' => "a\r\nb\rc"]);
        self::assertSame("a\nb\nc", $form->get('body')->getData());
    }

    #[Test]
    public function itTranslatesTheUiStrings(): void
    {
        $container = $this->container();
        $this->service($container, 'translator', LocaleAwareInterface::class)->setLocale('es');
        $view = $this->service($container, FormFactoryInterface::class, FormFactoryInterface::class)
            ->create(MilkdownEditorType::class, null, ['translation_domain' => false, 'label' => 'Cuerpo', 'placeholder' => 'Escribe'])
            ->createView();
        /** @var array{messages: object, placeholder: string, label: string} $options */
        $options = $view->vars['milkdown_options'];
        self::assertSame('Contenido no visible', ((array) $options['messages'])['ref.hidden']);
        self::assertSame('Escribe', $options['placeholder']);
        self::assertSame('Cuerpo', $options['label']);
    }

    #[Test]
    public function itExposesTheRendererFilterAndServices(): void
    {
        $container = $this->container();
        $this->service($container, MarkdownRendererInterface::class, MarkdownRendererInterface::class);
        $this->service($container, CspNonceProviderInterface::class, CspNonceProviderInterface::class);
        self::assertSame('/bundles/nowomilkdowneditor/x.js', $this->service($container, 'assets.packages', Packages::class)->getUrl('x.js', 'nowo_milkdown_editor'));
        $twig = $this->service($container, 'twig', Environment::class);
        self::assertSame("<p><strong>a</strong> &lt;b&gt;</p>\n", $twig->createTemplate('{{ md|milkdown_markdown }}')->render(['md' => '**a** <b>']));
        self::assertSame('', $twig->createTemplate('{{ null|milkdown_markdown }}')->render());
        self::assertStringNotContainsString('nonce', $twig->createTemplate('{{ nowo_milkdown_editor_assets() }}')->render());
        self::assertTrue($twig->getLoader()->exists('@NowoMilkdownEditorBundle/Form/milkdown_editor_theme.html.twig'));
        self::assertTrue($twig->getLoader()->exists('@NowoMilkdownEditorBundle/.keep.html.twig'));
    }

    #[Test]
    public function theBundleBuildsItsExtensionOnce(): void
    {
        $bundle = new NowoMilkdownEditorBundle();
        self::assertSame($bundle->getContainerExtension(), $bundle->getContainerExtension());
        self::assertSame('nowo_milkdown_editor', $bundle->getContainerExtension()->getAlias());
    }
}
