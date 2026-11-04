<?php

declare(strict_types=1);

namespace Nowo\MilkdownEditorBundle\Tests\Unit\Markdown;

use Nowo\MilkdownEditorBundle\Markdown\DialectRenderer;
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
    public function emojiRule(): void
    {
        self::assertTrue(DialectRenderer::isEmoji('💡'));
        self::assertTrue(DialectRenderer::isEmoji('👩‍💻'));
        self::assertTrue(DialectRenderer::isEmoji('⚠️'));
        self::assertFalse(DialectRenderer::isEmoji('é'));
        self::assertFalse(DialectRenderer::isEmoji('💡 x'));
        self::assertFalse(DialectRenderer::isEmoji(''));
        self::assertFalse(DialectRenderer::isEmoji(str_repeat('💡', 9)));
    }
}
