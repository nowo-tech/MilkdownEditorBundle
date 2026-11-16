<?php

declare(strict_types=1);

namespace Nowo\MilkdownEditorBundle\Tests\Unit\Markdown;

use Nowo\MilkdownEditorBundle\Markdown\HeadingIds;
use Nowo\MilkdownEditorBundle\Markdown\MilkdownMarkdownRenderer;
use Nowo\MilkdownEditorBundle\Markdown\Resolver\AllowlistIconResolver;
use Nowo\MilkdownEditorBundle\Markdown\Resolver\NullPageResolver;
use Nowo\MilkdownEditorBundle\Markdown\Resolver\NullUserResolver;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;

use function html_entity_decode;
use function preg_match;
use function str_repeat;
use function strip_tags;
use function substr_count;

use const ENT_HTML5;
use const ENT_QUOTES;
use const JSON_THROW_ON_ERROR;

final class HeadingIdsTest extends TestCase
{
    /**
     * @return array<string, array{string, string}>
     */
    public static function slugVectors(): array
    {
        $out = [];
        foreach (self::vectors()['slug'] as $i => [$text, $slug]) {
            $out[$i . ': ' . substr($text, 0, 20)] = [$text, $slug];
        }

        return $out;
    }

    #[Test]
    #[DataProvider('slugVectors')]
    public function itSlugsLikeTheEditor(string $text, string $expected): void
    {
        self::assertSame($expected, HeadingIds::slug($text));
    }

    #[Test]
    public function itDedupesLikeTheEditor(): void
    {
        foreach (self::vectors()['unique'] as $case) {
            self::assertSame($case['slugs'], HeadingIds::slugs($case['texts']));
        }
    }

    #[Test]
    public function theRendererSetsPrefixedIdsOnlyWhenEnabled(): void
    {
        $markdown = "# Intro\n\nText\n\n## Intro\n\n### Café *au* `lait`\n\n## <script>x</script>\n";
        $on       = (new MilkdownMarkdownRenderer(['heading_ids' => true], new NullPageResolver(), new NullUserResolver(), new AllowlistIconResolver(), secret: 's'))->render($markdown);
        self::assertStringContainsString('<h1 id="nowo-h-intro">', $on);
        self::assertStringContainsString('<h2 id="nowo-h-intro-2">', $on);
        self::assertStringContainsString('<h3 id="nowo-h-café-au-lait">', $on);
        // Raw HTML is not heading text (as in the editor, where it is an atom).
        self::assertStringContainsString('<h2 id="nowo-h-x">&lt;script&gt;', $on);
        $off = (new MilkdownMarkdownRenderer([], new NullPageResolver(), new NullUserResolver(), new AllowlistIconResolver(), secret: 's'))->render($markdown);
        self::assertStringNotContainsString(' id="nowo-h-', $off);
    }

    #[Test]
    public function itResolvesExplicitAndImplicitIdsLikeTheEditor(): void
    {
        foreach (self::vectors()['resolve'] as $case) {
            self::assertSame($case['ids'], HeadingIds::resolve($case['headings']));
        }
    }

    #[Test]
    public function itValidatesIdsWithTheSharedGrammar(): void
    {
        foreach (self::vectors()['valid'] as $id) {
            self::assertTrue(HeadingIds::isValid($id), $id);
            self::assertSame($id, HeadingIds::normalise(HeadingIds::PREFIX . $id));
        }
        foreach (self::vectors()['invalid'] as $id) {
            self::assertFalse(HeadingIds::isValid($id), $id);
        }
        self::assertSame('', HeadingIds::normalise('nowo-h-'));
        self::assertSame('', HeadingIds::normalise(str_repeat('a', 400)));
    }

    /**
     * @return iterable<string, array{string, string, string}>
     */
    public static function suffixVectors(): iterable
    {
        foreach (self::vectors()['suffix'] as $i => $case) {
            yield $i . ': ' . $case['markdown'] => [$case['markdown'], $case['text'], $case['id']];
        }
    }

    #[Test]
    #[DataProvider('suffixVectors')]
    public function itReadsTheSuffixLikeTheEditor(string $markdown, string $text, string $id): void
    {
        $html = (new MilkdownMarkdownRenderer(['heading_ids' => true], new NullPageResolver(), new NullUserResolver(), new AllowlistIconResolver(), secret: 's'))->render($markdown);
        self::assertSame(1, preg_match('~<h[1-6] id="([^"]*)">(.*)</h[1-6]>~s', $html, $m), $html);
        self::assertSame($text, html_entity_decode(strip_tags($m[2]), ENT_QUOTES | ENT_HTML5, 'UTF-8'));
        self::assertSame(HeadingIds::PREFIX . ($id !== '' ? $id : HeadingIds::slug($text)), $m[1]);
        // Without heading ids the suffix is still not text.
        $off = (new MilkdownMarkdownRenderer([], new NullPageResolver(), new NullUserResolver(), new AllowlistIconResolver(), secret: 's'))->render($markdown);
        self::assertSame(1, preg_match('~<h[1-6]>(.*)</h[1-6]>~s', $off, $o), $off);
        self::assertSame($text, html_entity_decode(strip_tags($o[1]), ENT_QUOTES | ENT_HTML5, 'UTF-8'));
    }

    #[Test]
    public function explicitIdsAreReservedFirstAndDuplicatesAreRemovedAtRenderTime(): void
    {
        $html = (new MilkdownMarkdownRenderer(['heading_ids' => true], new NullPageResolver(), new NullUserResolver(), new AllowlistIconResolver(), secret: 's'))
            ->render("# Intro\n\n## Other {#intro}\n\n## Again {#intro}\n\n### Text {#bad id}\n");
        self::assertStringContainsString('<h1 id="nowo-h-intro-2">Intro</h1>', $html);
        self::assertStringContainsString('<h2 id="nowo-h-intro">Other</h2>', $html);
        self::assertStringContainsString('<h2 id="nowo-h-intro-3">Again</h2>', $html);
        self::assertStringContainsString('<h3 id="nowo-h-text-bad-id">Text {#bad id}</h3>', $html);
    }

    #[Test]
    public function atMostAThousandHeadingsGetAnId(): void
    {
        $html = (new MilkdownMarkdownRenderer(['heading_ids' => true], new NullPageResolver(), new NullUserResolver(), new AllowlistIconResolver(), secret: 's'))
            ->render(str_repeat("# H\n\n", HeadingIds::MAX_IDS + 2));
        self::assertSame(HeadingIds::MAX_IDS, substr_count($html, ' id="nowo-h-'));
        self::assertStringContainsString('id="nowo-h-h-1000"', $html);
    }

    /**
     * @return array{slug: list<array{string, string}>, unique: list<array{texts: list<string>, slugs: list<string>}>, resolve: list<array{headings: list<array{text: string, explicit: string}>, ids: list<string>}>, valid: list<string>, invalid: list<string>, suffix: list<array{markdown: string, text: string, id: string}>}
     */
    private static function vectors(): array
    {
        /** @var array{slug: list<array{string, string}>, unique: list<array{texts: list<string>, slugs: list<string>}>, resolve: list<array{headings: list<array{text: string, explicit: string}>, ids: list<string>}>, valid: list<string>, invalid: list<string>, suffix: list<array{markdown: string, text: string, id: string}>} $vectors */
        $vectors = json_decode((string) file_get_contents(__DIR__ . '/../../Fixtures/heading-ids.json'), true, 8, JSON_THROW_ON_ERROR);

        return $vectors;
    }
}
