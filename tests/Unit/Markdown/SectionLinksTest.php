<?php

declare(strict_types=1);

namespace Nowo\MilkdownEditorBundle\Tests\Unit\Markdown;

use Nowo\MilkdownEditorBundle\Markdown\DialectRenderer;
use Nowo\MilkdownEditorBundle\Markdown\HeadingAnchorLinks;
use Nowo\MilkdownEditorBundle\Markdown\LinkUrl;
use Nowo\MilkdownEditorBundle\Markdown\MilkdownMarkdownRenderer;
use Nowo\MilkdownEditorBundle\Markdown\Resolver\AllowlistIconResolver;
use Nowo\MilkdownEditorBundle\Markdown\Resolver\NullUserResolver;
use Nowo\MilkdownEditorBundle\Markdown\Resolver\PageResolverInterface;
use Nowo\MilkdownEditorBundle\Markdown\Resolver\ResolvedPage;
use Nowo\MilkdownEditorBundle\Markdown\Resolver\SectionResolverInterface;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Psr\Log\AbstractLogger;
use RuntimeException;
use Stringable;

use function file_get_contents;
use function is_string;
use function json_decode;
use function memory_get_usage;
use function str_repeat;
use function substr_count;
use function trim;

use const JSON_THROW_ON_ERROR;

/**
 * 1.18: page links to sections (href, `Title › Section` labels through SectionResolverInterface), the read view's
 * heading anchor links, and the link picker's URL check (shared vectors with the editor).
 */
final class SectionLinksTest extends TestCase
{
    private const PAGE   = '0b6f4f0e-3c55-4d0a-9a43-1f7a2c9e8d10';
    private const HIDDEN = 'c0ffee00-1234-4abc-8def-001122334455';

    /** @var list<array<string, list<string>>> */
    public array $sectionCalls = [];

    private function renderer(?SectionResolverInterface $sections, ?AbstractLogger $logger = null): MilkdownMarkdownRenderer
    {
        $pages = new class implements PageResolverInterface {
            public function resolvePages(array $ids): array
            {
                return ['0b6f4f0e-3c55-4d0a-9a43-1f7a2c9e8d10' => new ResolvedPage('Install', '/wiki/install#old')];
            }
        };

        return new MilkdownMarkdownRenderer(['heading_ids' => true], $pages, new NullUserResolver(), new AllowlistIconResolver(), logger: $logger, secret: 's', sections: $sections);
    }

    private function sections(): SectionResolverInterface
    {
        $test = $this;

        return new class($test) implements SectionResolverInterface {
            public function __construct(private readonly SectionLinksTest $test)
            {
            }

            public function sectionTitles(array $anchors): array
            {
                $this->test->sectionCalls[] = $anchors;

                return [SectionLinksTest::page() => ['setup' => 'Set <up>', 'año' => 'Año nuevo', 'blank' => '  ']];
            }
        };
    }

    public static function page(): string
    {
        return self::PAGE;
    }

    #[Test]
    public function sectionLinksPointAtTheHeadingAndShowTheSectionText(): void
    {
        $html = $this->renderer($this->sections())->render(
            '[[wiki:' . self::PAGE . '#setup]] [[wiki:' . self::PAGE . '#nowo-h-año]] [[wiki:' . self::PAGE . '#gone]] [[wiki:' . self::PAGE . '#blank]] [[wiki:' . self::PAGE . ']] [[wiki:' . self::HIDDEN . '#secret-plan]] [[wiki:' . self::PAGE . '#setup]]',
        );
        self::assertStringContainsString('<a class="nowo-md-ref" href="/wiki/install#nowo-h-setup">Install › Set &lt;up&gt;</a>', $html);
        self::assertStringContainsString('<a class="nowo-md-ref" href="/wiki/install#nowo-h-año">Install › Año nuevo</a>', $html);
        // A missing (or blank) section: the title alone, never the raw id.
        self::assertStringContainsString('<a class="nowo-md-ref" href="/wiki/install#nowo-h-gone">Install</a>', $html);
        self::assertStringContainsString('<a class="nowo-md-ref" href="/wiki/install#nowo-h-blank">Install</a>', $html);
        self::assertStringContainsString('<a class="nowo-md-ref" href="/wiki/install#old">Install</a>', $html);
        // A hidden page: the placeholder only, and the resolver is never asked about it.
        self::assertStringNotContainsString('secret', $html);
        self::assertSame([[self::PAGE => ['setup', 'año', 'gone', 'blank']]], $this->sectionCalls);
        // Links without an anchor never ask.
        $this->renderer($this->sections())->render('[[wiki:' . self::PAGE . ']]');
        self::assertCount(1, $this->sectionCalls);
    }

    #[Test]
    public function withoutAResolverOrWhenItFailsTheLabelIsTheTitle(): void
    {
        self::assertSame('<p><a class="nowo-md-ref" href="/wiki/install#nowo-h-setup">Install</a></p>', trim($this->renderer(null)->render('[[wiki:' . self::PAGE . '#setup]]')));
        $logger = new class extends AbstractLogger {
            /** @var list<string> */
            public array $lines = [];

            public function log($level, string|Stringable $message, array $context = []): void
            {
                $kind          = $context['kind'] ?? '';
                $this->lines[] = $message . ' ' . (is_string($kind) ? $kind : '');
            }
        };
        $failing = new class implements SectionResolverInterface {
            public function sectionTitles(array $anchors): array
            {
                throw new RuntimeException('down');
            }
        };
        self::assertSame('<p><a class="nowo-md-ref" href="/wiki/install#nowo-h-setup">Install</a></p>', trim($this->renderer($failing, $logger)->render('[[wiki:' . self::PAGE . '#setup]]')));
        self::assertStringContainsString('section', $logger->lines[0] ?? '');
    }

    #[Test]
    public function aKeptAliveRendererAsksForSectionsOnEveryRender(): void
    {
        $renderer = $this->renderer($this->sections());
        $renderer->render('[[wiki:' . self::PAGE . '#setup]]');
        $before = memory_get_usage();
        for ($i = 0; $i < 200; ++$i) {
            self::assertStringContainsString('Install › Set &lt;up&gt;', $renderer->render('[[wiki:' . self::PAGE . '#setup]]'));
        }
        self::assertCount(201, $this->sectionCalls);
        self::assertLessThan(2 * 1024 * 1024, memory_get_usage() - $before);
    }

    #[Test]
    public function headingsGetAnAnchorLinkWithoutJavaScript(): void
    {
        $html = $this->renderer(null)->render("# Intro\n\n## Set up {#setup}\n\ntext\n");
        $out  = HeadingAnchorLinks::decorate($html, 'Link to "this" section', 'https://wiki.test/p/install');
        self::assertStringContainsString('<h2 id="nowo-h-setup">Set up <a class="nowo-md-heading-anchor" href="#nowo-h-setup" title="Link to &quot;this&quot; section" data-nowo-ui-clipboard-text="https://wiki.test/p/install#nowo-h-setup"><span class="nowo-milkdown-sr-only">Link to &quot;this&quot; section</span><span aria-hidden="true">#</span></a></h2>', $out);
        self::assertStringContainsString('<h1 id="nowo-h-intro">Intro <a class="nowo-md-heading-anchor" href="#nowo-h-intro"', $out);
        self::assertStringContainsString('<p>text</p>', $out);
    }

    #[Test]
    public function onlyValidPrefixedIdsGetAnAnchorLink(): void
    {
        $html = '<h2>No id</h2><h2 id="other">Host id</h2><h3 data-id="nowo-h-x">Data</h3><h4 id="nowo-h-Bad">Bad</h4><h5 id="nowo-h-a&quot;b">Quote</h5><h6 id="nowo-h-ok" class="c">Ok</h6><h2 id="nowo-h-' . str_repeat('a', 91) . '">Long</h2>';
        $out  = HeadingAnchorLinks::decorate($html, 'Link', 'javascript:alert(1)');
        self::assertSame(1, substr_count($out, 'nowo-md-heading-anchor'));
        self::assertStringContainsString('<h6 id="nowo-h-ok" class="c">Ok <a class="nowo-md-heading-anchor" href="#nowo-h-ok" title="Link">', $out);
        self::assertStringNotContainsString('data-nowo-ui-clipboard-text', $out);
        self::assertSame('<p>No headings</p>', HeadingAnchorLinks::decorate('<p>No headings</p>', 'Link'));
    }

    #[Test]
    public function theLinkUrlCheckMatchesTheEditor(): void
    {
        /** @var array{accepted: list<array{input: string, href: string, host: string}>, refused: list<string>} $vectors */
        $vectors = json_decode((string) file_get_contents(__DIR__ . '/../../Fixtures/link-urls.json'), true, 8, JSON_THROW_ON_ERROR);
        foreach ($vectors['accepted'] as $case) {
            self::assertSame($case['href'], LinkUrl::check($case['input']), $case['input']);
        }
        foreach ($vectors['refused'] as $input) {
            self::assertSame('', LinkUrl::check($input), $input);
        }
        // The field may only narrow the schemes.
        self::assertSame('', LinkUrl::check('mailto:ada@example.com', ['http', 'https']));
        self::assertSame('', LinkUrl::check('example.com', ['mailto']));
        self::assertSame('', LinkUrl::check('tel:1', ['tel']));
    }

    #[Test]
    public function safeUrlAcceptsMailtoWithoutHeaders(): void
    {
        self::assertSame('mailto:ada@example.com', DialectRenderer::safeUrl('mailto:ada@example.com'));
        self::assertSame('', DialectRenderer::safeUrl('mailto:ada@example.com?bcc=eve@example.com'));
        self::assertSame('', DialectRenderer::safeUrl('tel:123'));
        self::assertSame('/p#nowo-h-x', DialectRenderer::withFragment('/p#old', 'x'));
        self::assertSame('/p', DialectRenderer::withFragment('/p', 'Bad Id'));
    }
}
