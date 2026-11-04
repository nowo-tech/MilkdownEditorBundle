<?php

declare(strict_types=1);

namespace Nowo\MilkdownEditorBundle\Tests\Integration;

use LogicException;
use Nowo\MilkdownEditorBundle\Csp\CspNonceProviderInterface;
use Nowo\MilkdownEditorBundle\Diff\MarkdownDiffRendererInterface;
use Nowo\MilkdownEditorBundle\Form\MilkdownEditorType;
use Nowo\MilkdownEditorBundle\Markdown\MarkdownRendererInterface;
use Nowo\MilkdownEditorBundle\NowoMilkdownEditorBundle;
use Nowo\MilkdownEditorBundle\Twig\MilkdownViewTwig;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Symfony\Component\Asset\Packages;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\Form\FormFactoryInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Contracts\Translation\LocaleAwareInterface;
use Twig\Environment;

use function count;

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
        /** @var array{suggestions: array<string, string>, icons: list<string>, iconSpriteUrl: string, label: string, messages: array<string, string>, upload: array{url: string}} $options */
        $options = json_decode(html_entity_decode($m[1], ENT_QUOTES | ENT_HTML5), true, 512, JSON_THROW_ON_ERROR);
        self::assertSame(['@' => '/users', '[[' => '/pages'], $options['suggestions']);
        self::assertSame(['bug'], $options['icons']);
        self::assertSame('/sprite.svg', $options['iconSpriteUrl']);
        self::assertArrayNotHasKey('nonce', $options);
        self::assertStringNotContainsString('n0nce', $m[1]);
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
        self::assertArrayNotHasKey('menu.cut', (array) $options['messages']);
    }

    #[Test]
    public function theColourFeatureOffersTheRendererColours(): void
    {
        $container = $this->container();
        $factory   = $this->service($container, FormFactoryInterface::class, FormFactoryInterface::class);
        /** @var array<string, mixed> $with */
        $with = $factory->create(MilkdownEditorType::class, null, ['features' => ['toolbar', 'colors']])->createView()->vars['milkdown_options'];
        /** @var array<string, mixed> $without */
        $without = $factory->create(MilkdownEditorType::class, null, ['features' => ['toolbar']])->createView()->vars['milkdown_options'];
        self::assertSame(['yellow', 'green', 'blue', 'red', 'purple', 'gray', 'brown', 'orange', 'pink'], $with['colors']);
        self::assertArrayNotHasKey('colors', $without, 'BC: same JSON without the feature');
    }

    #[Test]
    public function featureStringsAreSentOnlyWithTheirFeature(): void
    {
        $container = $this->container();
        $this->service($container, 'translator', LocaleAwareInterface::class)->setLocale('es');
        $view = $this->service($container, FormFactoryInterface::class, FormFactoryInterface::class)
            ->create(MilkdownEditorType::class, null, ['features' => ['toolbar', 'context_menu']])
            ->createView();
        /** @var array{messages: object, features: list<string>} $options */
        $options  = $view->vars['milkdown_options'];
        $messages = (array) $options['messages'];
        self::assertSame(['toolbar', 'context_menu'], $options['features']);
        self::assertSame('Cortar', $messages['menu.cut']);
        self::assertCount(count(MilkdownEditorType::MESSAGE_KEYS) + count(MilkdownEditorType::FEATURE_MESSAGE_KEYS['context_menu']), $messages);
    }

    #[Test]
    public function theClipboardAndInsertStringsComeWithTheirFeatures(): void
    {
        $container = $this->container();
        $this->service($container, 'translator', LocaleAwareInterface::class)->setLocale('es');
        $view = $this->service($container, FormFactoryInterface::class, FormFactoryInterface::class)
            ->create(MilkdownEditorType::class, null, ['features' => ['context_menu', 'markdown_clipboard', 'insert_menu']])
            ->createView();
        /** @var array{messages: object} $options */
        $options  = $view->vars['milkdown_options'];
        $messages = (array) $options['messages'];
        self::assertSame('Copiar como Markdown', $messages['menu.copy_markdown']);
        self::assertSame('Insertar', $messages['menu.insert']);
        self::assertCount(count(MilkdownEditorType::MESSAGE_KEYS) + count(MilkdownEditorType::FEATURE_MESSAGE_KEYS['context_menu'])
            + count(MilkdownEditorType::FEATURE_MESSAGE_KEYS['markdown_clipboard']) + count(MilkdownEditorType::FEATURE_MESSAGE_KEYS['insert_menu']), $messages);
    }

    #[Test]
    public function theCopyAsMarkdownButtonCarriesTheEscapedSource(): void
    {
        $container = $this->container();
        $this->service($container, 'translator', LocaleAwareInterface::class)->setLocale('es');
        $twig = $this->service($container, 'twig', Environment::class);

        self::assertSame(
            '<span class="nowo-milkdown-copy" data-nowo-milkdown-copy><button type="button" class="nowo-milkdown-copy__button" data-nowo-milkdown-copy-markdown'
            . ' data-copied="Copiado como Markdown" data-failed="No se ha podido copiar al portapapeles">Copiar como Markdown</button>'
            . '<template># T &lt;/template&gt;&lt;script&gt;x&lt;/script&gt; &amp; &quot;q&quot;</template><span class="nowo-milkdown-copy__status" role="status"></span></span>',
            $twig->createTemplate('{{ nowo_milkdown_copy_markdown(md) }}')->render(['md' => '# T </template><script>x</script> & "q"']),
        );
        self::assertStringContainsString('class="nowo-milkdown-copy__button btn btn-sm" data-nowo-milkdown-copy-markdown', $twig->createTemplate("{{ nowo_milkdown_copy_markdown('x', {class: 'btn btn-sm', label: 'Copy <md>'}) }}")->render());
        self::assertStringContainsString('>Copy &lt;md&gt;</button>', $twig->createTemplate("{{ nowo_milkdown_copy_markdown('x', {label: 'Copy <md>'}) }}")->render());
        self::assertSame('', $twig->createTemplate('{{ nowo_milkdown_copy_markdown(null) }}{{ nowo_milkdown_copy_markdown(\'\') }}')->render());
        // 1.5.1: icon variants (static SVG, no inline style; icon-only keeps an accessible label).
        $iconOnly = $twig->createTemplate("{{ nowo_milkdown_copy_markdown('x', {icon: 'only', label: 'Copy <md>', class: 'btn'}) }}")->render();
        self::assertStringContainsString('class="nowo-milkdown-copy__button nowo-milkdown-copy__button--icon btn" data-nowo-milkdown-copy-markdown title="Copy &lt;md&gt;"', $iconOnly);
        self::assertStringContainsString('<span class="nowo-milkdown-sr-only">Copy &lt;md&gt;</span></button>', $iconOnly);
        self::assertStringContainsString('<svg class="nowo-milkdown-copy__icon"', $iconOnly);
        self::assertStringNotContainsString('style=', $iconOnly);
        $withIcon = $twig->createTemplate("{{ nowo_milkdown_copy_markdown('x', {icon: true}) }}")->render();
        self::assertMatchesRegularExpression('#</svg><span class="nowo-milkdown-copy__label">[^<]+</span></button>#', $withIcon);
        self::assertStringNotContainsString(' title=', $withIcon);
        self::assertStringNotContainsString('<svg', $twig->createTemplate("{{ nowo_milkdown_copy_markdown('x', {icon: 'yes'}) }}")->render());
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
    public function itRendersReadOnlyViewsAndDiffs(): void
    {
        $container = $this->container(['markdown' => ['heading_ids' => true]]);
        $twig      = $this->service($container, 'twig', Environment::class);
        $html      = $twig->createTemplate("{{ nowo_milkdown_view(md, {features: ['comments'], comments: {url: '/c', can_create: true}}) }}{{ nowo_milkdown_view(null) }}")->render(['md' => '# Hi']);
        self::assertSame(2, preg_match_all('/data-nowo-milkdown-options="([^"]+)"/', $html, $m));
        self::assertSame(1, preg_match('/name="nowo_milkdown_view_[0-9a-f]{8}"/', $html));
        self::assertStringContainsString('disabled="disabled"', $html);
        /** @var array{readonly: bool, comments: array{url: string, panel: string}, messages: array<string, string>} $options */
        $options = json_decode(html_entity_decode($m[1][0], ENT_QUOTES | ENT_HTML5), true, 512, JSON_THROW_ON_ERROR);
        self::assertTrue($options['readonly']);
        self::assertSame(['url' => '/c', 'csrfToken' => null, 'canCreate' => true, 'panel' => 'margin', 'container' => null, 'topic' => null], $options['comments']);
        self::assertSame('Comment', $options['messages']['comments.action']);

        $diff = $twig->createTemplate('{{ nowo_milkdown_diff(a, b) }}')->render(['a' => "# Hi\n\nold", 'b' => "# Hi\n\nnew"]);
        self::assertStringContainsString('<h1 id="nowo-h-hi">Hi</h1>', $diff);
        self::assertStringContainsString('data-change="changed"', $diff);
        self::assertSame('1 changes', $this->service($container, MarkdownDiffRendererInterface::class, MarkdownDiffRendererInterface::class)->render('a', 'b')->changes . ' changes');
        self::assertStringContainsString('<h1 id="nowo-h-hi">', $twig->createTemplate('{{ md|milkdown_markdown }}')->render(['md' => '# Hi']));
    }

    /** Audit DW-M1: the diff service honours the configured markdown.max_input_length. */
    #[Test]
    public function theDiffServiceUsesTheConfiguredMaxInputLength(): void
    {
        $container = $this->container(['markdown' => ['max_input_length' => 64]]);
        $diff      = $this->service($container, MarkdownDiffRendererInterface::class, MarkdownDiffRendererInterface::class);
        self::assertFalse($diff->render('short', 'shorter')->fallback);
        self::assertTrue($diff->render(str_repeat('word ', 20), 'x')->fallback);
    }

    #[Test]
    public function theViewFunctionNeedsForms(): void
    {
        $diff = $this->createStub(MarkdownDiffRendererInterface::class);
        $this->expectException(LogicException::class);
        (new MilkdownViewTwig($diff))->view($this->createStub(Environment::class), 'x');
    }

    #[Test]
    public function theBundleBuildsItsExtensionOnce(): void
    {
        $bundle = new NowoMilkdownEditorBundle();
        self::assertSame($bundle->getContainerExtension(), $bundle->getContainerExtension());
        self::assertSame('nowo_milkdown_editor', $bundle->getContainerExtension()->getAlias());
    }
}
