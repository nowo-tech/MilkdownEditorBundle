<?php

declare(strict_types=1);

namespace Nowo\MilkdownEditorBundle\Tests\Unit\Markdown;

use Nowo\MilkdownEditorBundle\Markdown\Directive\DirectiveRendererInterface;
use Nowo\MilkdownEditorBundle\Markdown\FileCard;
use Nowo\MilkdownEditorBundle\Markdown\MilkdownMarkdownRenderer;
use Nowo\MilkdownEditorBundle\Markdown\Node\LeafDirective;
use Nowo\MilkdownEditorBundle\Markdown\Resolver\AllowlistIconResolver;
use Nowo\MilkdownEditorBundle\Markdown\Resolver\NullPageResolver;
use Nowo\MilkdownEditorBundle\Markdown\Resolver\NullUserResolver;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;

use function file_get_contents;
use function json_decode;
use function substr_count;
use function trim;

use const JSON_THROW_ON_ERROR;

/**
 * 1.8 (ME-3): `::file` cards — the same category, badge, size and name rules as the editor (shared fixture), escaping
 * and the link rules of the renderer.
 */
final class FileCardTest extends TestCase
{
    /**
     * @return array{cards: list<array{name: string, type: string, href: string, size: string, category: string, badge: string, sizeText: string}>, names: list<array{string, string}>}
     */
    private static function fixture(): array
    {
        /** @var array{cards: list<array{name: string, type: string, href: string, size: string, category: string, badge: string, sizeText: string}>, names: list<array{string, string}>} $data */
        $data = json_decode((string) file_get_contents(__DIR__ . '/../../Fixtures/file-cards.json'), true, 8, JSON_THROW_ON_ERROR);

        return $data;
    }

    /**
     * @return iterable<string, array{string, string, string, string, string, string, string}>
     */
    public static function cards(): iterable
    {
        foreach (self::fixture()['cards'] as $c) {
            yield $c['name'] . ' ' . $c['type'] . ' ' . $c['href'] . ' ' . $c['size'] => [$c['name'], $c['type'], $c['href'], $c['size'], $c['category'], $c['badge'], $c['sizeText']];
        }
    }

    /**
     * @return iterable<int, array{string, string}>
     */
    public static function names(): iterable
    {
        yield from self::fixture()['names'];
    }

    #[Test]
    #[DataProvider('cards')]
    public function categoryBadgeAndSizeMatchTheEditor(string $name, string $type, string $href, string $size, string $category, string $badge, string $sizeText): void
    {
        self::assertSame([$category, $badge], FileCard::kind($name, $type, $href));
        self::assertSame($sizeText, FileCard::size($size));
    }

    #[Test]
    #[DataProvider('names')]
    public function namesAreCleanedLikeTheEditor(string $input, string $output): void
    {
        self::assertSame($output, FileCard::name($input));
    }

    #[Test]
    public function rendersAnEscapedLinkCard(): void
    {
        $html = FileCard::render(new LeafDirective('file', 'Q3 <b>.pdf', ['href' => '/files/1?a=1&b="2"', 'size' => '1258291', 'type' => 'application/pdf']));
        self::assertSame(
            '<div class="nowo-md-file nowo-md-file--pdf" data-directive="file"><a class="nowo-md-file__link" href="/files/1?a=1&amp;b=&quot;2&quot;" rel="noopener noreferrer">'
            . '<span class="nowo-md-file__badge" aria-hidden="true">PDF</span><span class="nowo-md-file__name">Q3 &lt;b&gt;.pdf</span><span class="nowo-md-file__size">1.2 MB</span></a></div>',
            $html,
        );
    }

    #[Test]
    public function unsafeOrMissingLinksRenderNoLink(): void
    {
        foreach (['javascript:alert(1)', 'data:text/html,x', '//evil.example/x', ''] as $href) {
            $html = FileCard::render(new LeafDirective('file', 'x.zip', ['href' => $href]));
            self::assertStringNotContainsString('<a', $html, $href);
            self::assertStringContainsString('<span class="nowo-md-file__link">', $html);
            self::assertStringNotContainsString('nowo-md-file__size', $html);
        }
        self::assertStringContainsString('href="https://cdn.example/x.zip"', FileCard::render(new LeafDirective('file', 'x.zip', ['href' => 'https://cdn.example/x.zip'])));
    }

    /** Audit GR-I1: a PDF label on an .exe link shows the link's badge. */
    #[Test]
    public function theTargetDecidesTheBadge(): void
    {
        $html = FileCard::render(new LeafDirective('file', 'invoice.pdf', ['href' => '/u/setup.exe', 'type' => 'application/pdf']));
        self::assertStringContainsString('nowo-md-file--other', $html);
        self::assertStringContainsString('aria-hidden="true">EXE</span>', $html);
    }

    /** Audit GR-I4: `allow_unsafe_links` keeps script links of ordinary links, never of file cards. */
    #[Test]
    public function aScriptCardHasNoLinkEvenWithUnsafeLinksAllowed(): void
    {
        $renderer = new MilkdownMarkdownRenderer(['footnotes' => false, 'allow_unsafe_links' => true], new NullPageResolver(), new NullUserResolver(), new AllowlistIconResolver(null, []));
        $html     = $renderer->render("::file[x.pdf]{href=\"javascript:alert(1)\"}\n\n::file[y.pdf]{href=\"data:text/html,x\"}");
        self::assertStringNotContainsString('<a', $html);
        self::assertStringNotContainsString('javascript:', $html);
        self::assertStringNotContainsString('data:', $html);
        self::assertSame(2, substr_count($html, '<span class="nowo-md-file__link">'));
    }

    #[Test]
    public function theRendererDrawsFileCardsUnlessAHostRendererOwnsThem(): void
    {
        $markdown = "Before\n\n::file[report.pdf]{href=\"/files/2\" size=\"512\" type=\"application/pdf\"}\n\nAfter";
        $renderer = new MilkdownMarkdownRenderer(['footnotes' => false], new NullPageResolver(), new NullUserResolver(), new AllowlistIconResolver(null, []));
        $html     = $renderer->render($markdown);
        self::assertStringContainsString('<div class="nowo-md-file nowo-md-file--pdf" data-directive="file"><a class="nowo-md-file__link" href="/files/2" rel="noopener noreferrer">', $html);
        self::assertStringContainsString('<span class="nowo-md-file__size">512 B</span>', $html);

        $host = new class implements DirectiveRendererInterface {
            public function supports(string $name): bool
            {
                return $name === 'file';
            }

            public function prepare(array $nodes): void
            {
            }

            public function render(LeafDirective $node): string
            {
                return '<p class="host-file">' . $node->label . '</p>';
            }
        };
        $hosted = new MilkdownMarkdownRenderer(['footnotes' => false], new NullPageResolver(), new NullUserResolver(), new AllowlistIconResolver(null, []), [$host]);
        self::assertStringContainsString('<p class="host-file">report.pdf</p>', trim($hosted->render($markdown)));
    }

    /** 1.9 (ME-6): one file, four views; an unknown view is the card. */
    #[Test]
    public function viewsRenderLinkIconCardAndFallBack(): void
    {
        $base = ['href' => '/f/report.pdf', 'size' => '2048'];
        $card = FileCard::render(new LeafDirective('file', 'report.pdf', $base));

        $link = FileCard::render(new LeafDirective('file', '<b>.pdf', ['view' => 'link'] + $base));
        self::assertSame('<p class="nowo-md-file nowo-md-file--link-view nowo-md-file--pdf" data-directive="file" data-view="link"><a class="nowo-md-file__text" href="/f/report.pdf" rel="noopener noreferrer">&lt;b&gt;.pdf</a></p>', $link);

        $icon = FileCard::render(new LeafDirective('file', 'report.pdf', ['view' => 'icon'] + $base));
        self::assertStringContainsString('nowo-md-file--icon-view', $icon);
        self::assertStringContainsString('<svg class="nowo-md-file__icon"', $icon);
        self::assertStringContainsString('aria-hidden="true"', $icon);
        self::assertStringContainsString('<span class="nowo-md-file__name">report.pdf</span>', $icon);

        self::assertSame($card, FileCard::render(new LeafDirective('file', 'report.pdf', ['view' => 'card'] + $base)));
        self::assertSame($card, FileCard::render(new LeafDirective('file', 'report.pdf', ['view' => 'evil"><x'] + $base)));

        // No link for an unsafe target, in every view.
        foreach (['link', 'icon', 'preview'] as $view) {
            self::assertStringNotContainsString('<a', FileCard::render(new LeafDirective('file', 'x', ['view' => $view, 'href' => 'javascript:alert(1)'])));
        }
    }

    #[Test]
    public function theIconFollowsTheFileType(): void
    {
        $paths = [];
        foreach (['a.pdf', 'a.docx', 'a.xlsx', 'a.csv', 'a.pptx', 'a.txt', 'a.zip', 'a.png', 'a.mp3', 'a.mp4', 'a.json', 'a.bin'] as $name) {
            $html = FileCard::render(new LeafDirective('file', $name, ['view' => 'icon', 'href' => '/f/' . $name]));
            self::assertStringContainsString('<path d="', $html, $name);
            $paths[$name] = $html;
        }
        self::assertStringContainsString('M16 15l2 6l2 -6', $paths['a.csv']);
        self::assertStringContainsString('M4 15l4 6', $paths['a.xlsx']);
    }

    #[Test]
    public function previewWithoutAUrlIsTheCardWithItsView(): void
    {
        $html = FileCard::render(new LeafDirective('file', 'a.pdf', ['view' => 'preview', 'href' => '/f/a.pdf']));
        self::assertStringNotContainsString('<iframe', $html);
        self::assertStringContainsString('data-view="preview"', $html);
        self::assertStringContainsString('nowo-md-file__link', $html);
    }

    #[Test]
    public function previewFrameIsSandboxed(): void
    {
        $node = new LeafDirective('file', 'a"<.pdf', ['view' => 'preview', 'href' => '/f/a.pdf', 'height' => '9999']);
        $node->data->set('nowo_file_preview', '/p/a?x="1"');
        $html = FileCard::render($node, ['sandbox' => 'allow-scripts allow-same-origin', 'open' => 'Abrir', 'download' => 'Bajar']);
        self::assertStringContainsString('src="/p/a?x=&quot;1&quot;"', $html);
        self::assertStringContainsString('title="a&quot;&lt;.pdf"', $html);
        self::assertStringContainsString('sandbox="allow-scripts"', $html);
        self::assertStringContainsString('loading="lazy" referrerpolicy="no-referrer" height="480"', $html);
        self::assertStringContainsString('>Abrir</a>', $html);
        self::assertStringContainsString('>Bajar</a>', $html);
        // Nothing asked: the strictest sandbox.
        self::assertStringContainsString('sandbox=""', FileCard::render($node));
    }

    #[Test]
    public function viewHeightAndSandboxRules(): void
    {
        self::assertSame('card', FileCard::view([]));
        self::assertSame('icon', FileCard::view(['view' => 'icon']));
        self::assertSame('card', FileCard::view(['view' => 'embed']));
        self::assertSame(FileCard::DEFAULT_HEIGHT, FileCard::height(''));
        self::assertSame(FileCard::DEFAULT_HEIGHT, FileCard::height('10'));
        self::assertSame(FileCard::DEFAULT_HEIGHT, FileCard::height('12px'));
        self::assertSame(320, FileCard::height('320'));
        self::assertSame('', FileCard::sandbox('allow-top-navigation evil'));
        self::assertSame('allow-same-origin', FileCard::sandbox('ALLOW-SAME-ORIGIN'));
        self::assertSame('allow-popups allow-scripts', FileCard::sandbox('allow-popups allow-scripts allow-same-origin allow-popups'));
        self::assertSame('allow-scripts allow-popups', FileCard::sandbox('allow-scripts allow-popups allow-popups-to-escape-sandbox'));
        self::assertSame('allow-popups allow-popups-to-escape-sandbox', FileCard::sandbox('allow-popups allow-popups-to-escape-sandbox'));
        self::assertSame(FileCard::DEFAULT_HEIGHT, FileCard::height("320\n"));
        self::assertSame('', FileCard::size("12\n"));
    }

    #[Test]
    public function aHiddenCardShowsNothingOfTheFile(): void
    {
        $node = new LeafDirective('file', 'secret.pdf', ['href' => 'x:y']);
        $node->data->set('nowo_file_hidden', true);
        self::assertSame('<div class="nowo-md-file nowo-md-file--hidden" data-directive="file"><span class="nowo-md-ref nowo-md-ref--hidden">No</span></div>', FileCard::render($node, ['hidden' => 'No']));
    }
}
