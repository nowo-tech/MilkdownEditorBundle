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

    /**
     * @return array{slug: list<array{string, string}>, unique: list<array{texts: list<string>, slugs: list<string>}>}
     */
    private static function vectors(): array
    {
        /** @var array{slug: list<array{string, string}>, unique: list<array{texts: list<string>, slugs: list<string>}>} $vectors */
        $vectors = json_decode((string) file_get_contents(__DIR__ . '/../../Fixtures/heading-slugs.json'), true, 8, JSON_THROW_ON_ERROR);

        return $vectors;
    }
}
