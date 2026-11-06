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
}
