<?php

declare(strict_types=1);

namespace Nowo\MilkdownEditorBundle\Tests\Unit\Markdown;

use Nowo\MilkdownEditorBundle\Markdown\DialectRenderer;
use Nowo\MilkdownEditorBundle\Markdown\EmojiRule;
use Nowo\MilkdownEditorBundle\Markdown\MilkdownMarkdownRenderer;
use Nowo\MilkdownEditorBundle\Markdown\Resolver\AllowlistIconResolver;
use Nowo\MilkdownEditorBundle\Markdown\Resolver\NullPageResolver;
use Nowo\MilkdownEditorBundle\Markdown\Resolver\NullUserResolver;
use Nowo\MilkdownEditorBundle\Markdown\Resolver\TablerCatalog;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Symfony\Component\Asset\Package;
use Symfony\Component\Asset\Packages;
use Symfony\Component\Asset\PathPackage;
use Symfony\Component\Asset\VersionStrategy\EmptyVersionStrategy;
use Symfony\Component\Asset\VersionStrategy\StaticVersionStrategy;

use const JSON_THROW_ON_ERROR;
use const PREG_NO_ERROR;

/**
 * 1.7: the bundled Tabler catalog, catalog icons in the renderer and callout icons.
 */
final class IconCatalogTest extends TestCase
{
    private function renderer(?TablerCatalog $catalog, string $sprite = '/s.svg'): MilkdownMarkdownRenderer
    {
        return new MilkdownMarkdownRenderer([], new NullPageResolver(), new NullUserResolver(), new AllowlistIconResolver($sprite, ['bug'], $catalog), secret: 's');
    }

    private function namesFile(string $json): string
    {
        $file = tempnam(sys_get_temp_dir(), 'tabler');
        self::assertIsString($file);
        file_put_contents($file, $json);

        return $file;
    }

    #[Test]
    public function theShippedCatalogHasEveryTablerOutlineIcon(): void
    {
        $catalog = new TablerCatalog();
        self::assertGreaterThan(5000, $catalog->count());
        self::assertTrue($catalog->has('bulb'));
        self::assertFalse($catalog->has('nope-nope'));
        self::assertSame('/bundles/nowomilkdowneditor/icons/tabler-b.svg', $catalog->spriteUrl('bulb'));
        self::assertNull($catalog->spriteUrl('nope-nope'));
        foreach (['a', 'b', 'z'] as $shard) {
            self::assertFileExists(__DIR__ . '/../../../src/Resources/public/icons/tabler-' . $shard . '.svg');
        }
        self::assertFileExists(__DIR__ . '/../../../src/Resources/public/icons/LICENSE-tabler.txt');
    }

    #[Test]
    public function urlsComeFromTheAssetPackage(): void
    {
        $packages = new Packages(new Package(new EmptyVersionStrategy()), ['nowo_milkdown_editor' => new PathPackage('/app/bundles/nowomilkdowneditor', new StaticVersionStrategy('v7'))]);
        $catalog  = new TablerCatalog($packages, $this->namesFile('{"version":"3.50.0","names":["bulb","3d-cube-sphere","Bad",1]}'));
        self::assertSame(2, $catalog->count());
        self::assertSame('/app/bundles/nowomilkdowneditor/icons/tabler-3.svg?v7', $catalog->spriteUrl('3d-cube-sphere'));
        self::assertFalse($catalog->has('Bad'));
    }

    #[Test]
    public function aMissingOrBrokenNamesFileIsAnEmptyCatalog(): void
    {
        self::assertSame(0, (new TablerCatalog(null, '/nonexistent/tabler.json'))->count());
        self::assertSame(0, (new TablerCatalog(null, $this->namesFile('not json')))->count());
        self::assertSame(0, (new TablerCatalog(null, $this->namesFile('{"names":"x"}')))->count());
    }

    #[Test]
    public function catalogIconsRenderOnlyWhenTheCatalogIsOn(): void
    {
        self::assertSame('<p>:tabler-bulb: <svg class="nowo-md-icon" role="img" aria-label="bug"><use href="/s.svg#tabler-bug"></use></svg></p>', trim($this->renderer(null)->render(':tabler-bulb: :tabler-bug:')));
        $html = trim($this->renderer(new TablerCatalog())->render(':tabler-bulb: :tabler-bug: :tabler-nope-nope:'));
        self::assertSame('<p><svg class="nowo-md-icon" role="img" aria-label="bulb"><use href="/bundles/nowomilkdowneditor/icons/tabler-b.svg#tabler-bulb"></use></svg> <svg class="nowo-md-icon" role="img" aria-label="bug"><use href="/s.svg#tabler-bug"></use></svg> :tabler-nope-nope:</p>', $html);
    }

    /**
     * @return iterable<string, array{string, string}>
     */
    public static function callouts(): iterable
    {
        yield 'no icon: unchanged' => [":::callout{type=\"info\"}\nA\n:::", '<div class="nowo-md-callout nowo-md-callout--info" role="note"><p>A</p></div>'];
        yield 'allowlisted icon' => [":::callout{icon=\"bug\" type=\"warning\"}\nA\n:::", '<div class="nowo-md-callout nowo-md-callout--warning nowo-md-callout--icon" role="note"><svg class="nowo-md-icon nowo-md-callout__icon" aria-hidden="true" focusable="false"><use href="/s.svg#tabler-bug"></use></svg><div class="nowo-md-callout__body"><p>A</p></div></div>'];
        yield 'catalog icon' => [":::callout{icon=\"bulb\"}\nA\n:::", '<div class="nowo-md-callout nowo-md-callout--info nowo-md-callout--icon" role="note"><svg class="nowo-md-icon nowo-md-callout__icon" aria-hidden="true" focusable="false"><use href="/bundles/nowomilkdowneditor/icons/tabler-b.svg#tabler-bulb"></use></svg><div class="nowo-md-callout__body"><p>A</p></div></div>'];
        yield 'unknown name: ignored' => [":::callout{icon=\"nope-nope\"}\nA\n:::", '<div class="nowo-md-callout nowo-md-callout--info" role="note"><p>A</p></div>'];
        yield 'emoji, drawn by CSS from the attribute' => [":::callout{icon=\"💡\"}\nA\n:::", '<div class="nowo-md-callout nowo-md-callout--info nowo-md-callout--icon" role="note"><span class="nowo-md-callout__icon nowo-md-callout__emoji" data-emoji="💡" aria-hidden="true"></span><div class="nowo-md-callout__body"><p>A</p></div></div>'];
        yield 'markup is not an icon' => [":::callout{icon='\"><script>'}\nA\n:::", '<div class="nowo-md-callout nowo-md-callout--info" role="note"><p>A</p></div>'];
        yield 'text is not an emoji' => [":::callout{icon=\"Bulb\"}\nA\n:::", '<div class="nowo-md-callout nowo-md-callout--info" role="note"><p>A</p></div>'];
    }

    #[Test]
    #[DataProvider('callouts')]
    public function calloutIcons(string $markdown, string $html): void
    {
        self::assertSame($html, trim($this->renderer(new TablerCatalog())->render($markdown)));
    }

    #[Test]
    public function calloutIconsNeedASafeSprite(): void
    {
        self::assertSame('<div class="nowo-md-callout nowo-md-callout--info" role="note"><p>A</p></div>', trim($this->renderer(null, 'javascript:x')->render(":::callout{icon=\"bug\"}\nA\n:::")));
    }

    #[Test]
    public function emojiRuleFollowsTheSharedTable(): void
    {
        /** @var array{rows: list<array{value: string, emoji: bool, note: string}>} $table */
        $table = json_decode((string) file_get_contents(__DIR__ . '/../../Fixtures/callout-icon-values.json'), true, 512, JSON_THROW_ON_ERROR);
        foreach ($table['rows'] as $row) {
            self::assertSame($row['emoji'], DialectRenderer::isEmoji($row['value']), $row['note']);
            self::assertSame($row['emoji'], EmojiRule::matches($row['value']), $row['note']);
        }
        self::assertFalse(EmojiRule::matches("\xFF\xFE"));
    }

    #[Test]
    public function theEditorUsesTheSameEmojiTable(): void
    {
        $ts = (string) file_get_contents(__DIR__ . '/../../../src/Resources/assets/src/dialect/emoji-rule.ts');
        self::assertSame(1, preg_match('/PICTOGRAPHIC: readonly number\[\] = \[(.*?)\];/s', $ts, $m));
        preg_match_all('/0x([0-9a-f]+)/i', $m[1], $hex);
        self::assertSame(EmojiRule::PICTOGRAPHIC, array_map('hexdec', $hex[1]));
    }

    #[Test]
    public function hostileValuesAreLinear(): void
    {
        foreach ([25, 1000, 100000] as $n) {
            foreach (["\u{FE0F}", "\u{20E3}", "\u{200D}💡"] as $mark) {
                $value = str_repeat($mark, $n) . 'a';
                $t     = hrtime(true);
                self::assertFalse(DialectRenderer::isEmoji($value));
                self::assertLessThan(50, (hrtime(true) - $t) / 1e6);
                self::assertSame(PREG_NO_ERROR, preg_last_error(), 'no "Backtrack limit exhausted"');
            }
        }
    }

    #[Test]
    public function aPageOfHostileCalloutsRendersLikeABenignOne(): void
    {
        $renderer = $this->renderer(new TablerCatalog());
        $page     = static fn (string $value): string => str_repeat(':::callout{icon="' . $value . '"}' . "\nx\n:::\n\n", 500);
        $renderer->render($page('x')); // warm-up
        $t = hrtime(true);
        $renderer->render($page(str_repeat("\u{2B50}", 40) . 'a'));
        $baseline = (hrtime(true) - $t) / 1e6;
        $t        = hrtime(true);
        $html     = $renderer->render($page(str_repeat("\u{FE0F}", 40) . 'a'));
        $hostile  = (hrtime(true) - $t) / 1e6;
        self::assertSame(PREG_NO_ERROR, preg_last_error());
        self::assertStringNotContainsString('nowo-md-callout--icon', $html);
        self::assertLessThan(max(3 * $baseline, $baseline + 100), $hostile);
    }

    #[Test]
    public function longIconValuesAreIgnoredBeforeAnyPattern(): void
    {
        self::assertSame('<div class="nowo-md-callout nowo-md-callout--info" role="note"><p>A</p></div>', trim($this->renderer(new TablerCatalog())->render(':::callout{icon="' . str_repeat('a', 65) . "\"}\nA\n:::")));
    }
}
