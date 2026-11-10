<?php

declare(strict_types=1);

namespace Nowo\MilkdownEditorBundle\Tests\Unit\Markdown;

use Nowo\MilkdownEditorBundle\DependencyInjection\Configuration;
use Nowo\MilkdownEditorBundle\DependencyInjection\NowoMilkdownEditorExtension;
use Nowo\MilkdownEditorBundle\Markdown\FileCard;
use Nowo\MilkdownEditorBundle\Markdown\HostSchemes;
use Nowo\MilkdownEditorBundle\Markdown\MilkdownMarkdownRenderer;
use Nowo\MilkdownEditorBundle\Markdown\Resolver\AllowlistIconResolver;
use Nowo\MilkdownEditorBundle\Markdown\Resolver\FileReference;
use Nowo\MilkdownEditorBundle\Markdown\Resolver\NullPageResolver;
use Nowo\MilkdownEditorBundle\Markdown\Resolver\NullUserResolver;
use Nowo\MilkdownEditorBundle\Markdown\Resolver\TemplateFilePreviewResolver;
use Nowo\MilkdownEditorBundle\Markdown\Resolver\TemplateHostFileResolver;
use Nowo\MilkdownEditorBundle\Twig\MilkdownEditorTwig;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Symfony\Component\Asset\Package;
use Symfony\Component\Asset\Packages;
use Symfony\Component\Asset\VersionStrategy\EmptyVersionStrategy;
use Symfony\Component\Config\Definition\Exception\InvalidConfigurationException;
use Symfony\Component\Config\Definition\Processor;
use Symfony\Component\DependencyInjection\ContainerBuilder;

use function str_replace;

/**
 * 1.16 (spec 212 block B): previews of `url: written` pattern cards (`file_preview_written_urls`) and the types the host
 * can preview (`file_preview_types`). Without either option, everything is exactly as in 1.15.
 */
final class WrittenPreviewsTest extends TestCase
{
    private const UUID = '0f8fad5b-d9cb-469f-a165-70867728950e';

    private const FILES = '^/files/(?<id>[0-9a-f-]{36})/(?:original|preview)$';

    private const SCHEMES = ['app-file' => ['image' => '/files/{id}/preview', 'file' => '/files/{id}/original', 'preview' => '/files/{id}/frame']];

    /**
     * @param array{file_preview_written_urls?: bool, file_preview_types?: list<string>, file_preview_sandbox?: list<string>} $options
     */
    private function render(string $markdown, array $options = [], string $url = HostSchemes::URL_WRITTEN): string
    {
        $schemes = new HostSchemes(self::SCHEMES, [], [['pattern' => self::FILES, 'scheme' => 'app-file', 'url' => $url]]);

        return (new MilkdownMarkdownRenderer(
            $options,
            new NullPageResolver(),
            new NullUserResolver(),
            new AllowlistIconResolver(),
            secret: 'test-secret',
            hostSchemes: $schemes,
            sources: new TemplateHostFileResolver($schemes),
        ))->render($markdown);
    }

    private function card(string $name, string $type = '', string $href = '/files/' . self::UUID . '/original'): string
    {
        return '::file[' . $name . ']{href="' . $href . '"' . ($type !== '' ? ' type="' . $type . '"' : '') . ' view="preview"}';
    }

    #[Test]
    public function withoutTheOptionsWrittenCardsStayCards(): void
    {
        $html = $this->render($this->card('a.csv'));
        self::assertStringNotContainsString('<iframe', $html);
        self::assertStringContainsString('href="/files/' . self::UUID . '/original"', $html);
        // Host references keep their 1.9 previews.
        self::assertStringContainsString('src="/files/x/frame"', $this->render('::file[a.csv]{href="app-file:x" view="preview"}'));
    }

    #[Test]
    public function writtenCardsPreviewTheTemplateUrlNeverTheWrittenOne(): void
    {
        $html = $this->render($this->card('a.csv'), ['file_preview_written_urls' => true, 'file_preview_sandbox' => ['allow-downloads']]);
        self::assertStringContainsString('<iframe class="nowo-md-file__frame" src="/files/' . self::UUID . '/frame" title="a.csv" sandbox="allow-downloads" loading="lazy" referrerpolicy="no-referrer" height="480"></iframe>', $html);
        // The card and its actions keep the author's URL (url: written).
        self::assertStringContainsString('class="nowo-md-file__open" href="/files/' . self::UUID . '/original"', $html);
        // A card that is no pattern URL gets no frame.
        foreach (['https://evil.example/a.csv', '/elsewhere/a.csv', 'javascript:alert(1)', 'data:text/html,x'] as $href) {
            self::assertStringNotContainsString('<iframe', $this->render($this->card('a.csv', '', $href), ['file_preview_written_urls' => true]));
        }
    }

    #[Test]
    public function previewTypesKeepOtherCardsAsCards(): void
    {
        $options = ['file_preview_written_urls' => true, 'file_preview_types' => ['text/csv', '.md', 'application/*']];
        self::assertStringNotContainsString('<iframe', $this->render($this->card('report.pdf', 'image/png'), $options));
        self::assertStringContainsString('<iframe', $this->render($this->card('data', 'text/csv'), $options));
        self::assertStringContainsString('<iframe', $this->render($this->card('notes.md'), $options));
        self::assertStringContainsString('<iframe', $this->render($this->card('x', 'application/json; charset=utf-8'), $options));
        // Host references too.
        self::assertStringNotContainsString('<iframe', $this->render('::file[a.pdf]{href="app-file:x" view="preview"}', $options));
        self::assertStringContainsString('<iframe', $this->render('::file[a.md]{href="app-file:x" view="preview"}', $options));
    }

    #[Test]
    public function previewableRules(): void
    {
        self::assertTrue(FileCard::previewable([], 'a.exe'));
        $types = ['.csv', 'text/*'];
        self::assertTrue(FileCard::previewable($types, 'x', '', '/f/data.CSV?v=1#x'));
        self::assertTrue(FileCard::previewable($types, 'data.csv'));
        self::assertTrue(FileCard::previewable($types, 'x', 'TEXT/Plain'));
        self::assertFalse(FileCard::previewable($types, 'x.pdf', 'application/pdf'));
        self::assertFalse(FileCard::previewable($types, 'x', 'not a type'));
        self::assertFalse(FileCard::previewable($types, 'x'));
    }

    #[Test]
    public function theDefaultResolverReadsTheOptions(): void
    {
        $schemes = new HostSchemes(self::SCHEMES, [], [['pattern' => self::FILES, 'scheme' => 'app-file'], ['pattern' => '^/r/(?<id>\w+)$', 'scheme' => 'app-file', 'url' => 'resolved']]);
        $written = new FileReference('/files/' . self::UUID . '/original', '/files/' . self::UUID . '/original', 'a.csv');
        // A resolved pattern's card already carries its reference; a written one does not.
        $plain = new FileReference('/r/abc', '/files/abc/original', 'a.csv');
        self::assertSame([], (new TemplateFilePreviewResolver($schemes))->resolvePreviews([$written, $plain]));
        self::assertSame([$written->href => '/files/' . self::UUID . '/frame'], (new TemplateFilePreviewResolver($schemes, true))->resolvePreviews([$written, $plain]));
        self::assertSame([], (new TemplateFilePreviewResolver($schemes, true, ['.pdf']))->resolvePreviews([$written]));
    }

    #[Test]
    public function theConfigurationValidatesAndWiresTheOptions(): void
    {
        /** @var array{markdown: array{file_preview_types: list<string>, file_preview_written_urls: bool}} $config */
        $config = (new Processor())->processConfiguration(new Configuration(), [['markdown' => ['file_preview_types' => [' Text/CSV ', '.MD', 'text/*']]]]);
        self::assertSame(['text/csv', '.md', 'text/*'], $config['markdown']['file_preview_types']);
        self::assertFalse($config['markdown']['file_preview_written_urls']);
        /** @var array{markdown: array{file_preview_types: list<string>}} $defaults */
        $defaults = (new Processor())->processConfiguration(new Configuration(), [[]]);
        self::assertSame([], $defaults['markdown']['file_preview_types']);

        foreach ([['csv'], ['*/*'], ['text/'], ['42'], ['.toolongext']] as $bad) {
            try {
                (new Processor())->processConfiguration(new Configuration(), [['markdown' => ['file_preview_types' => $bad]]]);
                self::fail('Accepted ' . $bad[0]);
            } catch (InvalidConfigurationException $e) {
                self::assertStringContainsString('file_preview_types', $e->getMessage());
            }
        }

        $container = new ContainerBuilder();
        (new NowoMilkdownEditorExtension())->load([['markdown' => ['host_schemes' => self::SCHEMES, 'file_preview_written_urls' => true, 'file_preview_types' => ['text/csv']]]], $container);
        self::assertTrue($container->getDefinition(TemplateFilePreviewResolver::class)->getArgument('$writtenUrls'));
        self::assertSame(['text/csv'], $container->getDefinition(TemplateFilePreviewResolver::class)->getArgument('$types'));
        self::assertTrue($container->getDefinition(MilkdownEditorTwig::class)->getArgument('$previewWrittenUrls'));
        self::assertSame(['text/csv'], $container->getDefinition(MilkdownEditorTwig::class)->getArgument('$previewTypes'));
    }

    #[Test]
    public function thePageConfigurationCarriesTheOptionsOnlyWhenSet(): void
    {
        $renderer = new MilkdownMarkdownRenderer([], new NullPageResolver(), new NullUserResolver(), new AllowlistIconResolver(), secret: 'test-secret');
        $package  = new Package(new EmptyVersionStrategy());
        $packages = new Packages($package, ['nowo_milkdown_editor' => $package]);
        $schemes  = new HostSchemes(self::SCHEMES);

        $plain = (new MilkdownEditorTwig($renderer, $packages, null, null, $schemes))->assets('n');
        self::assertStringNotContainsString('previewWrittenUrls', $plain);
        self::assertStringNotContainsString('previewTypes', $plain);

        $assets = str_replace('"', '"', (new MilkdownEditorTwig($renderer, $packages, null, null, $schemes, '', 500, true, ['text/csv', 'text/*']))->assets('n'));
        self::assertStringContainsString('"previewWrittenUrls":true', $assets);
        self::assertStringContainsString('"previewTypes":["text/csv","text/*"]', $assets);
    }
}
