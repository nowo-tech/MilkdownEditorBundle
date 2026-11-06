<?php

declare(strict_types=1);

namespace Nowo\MilkdownEditorBundle\Tests\Unit\Markdown;

use Nowo\MilkdownEditorBundle\Markdown\Directive\DirectiveRendererInterface;
use Nowo\MilkdownEditorBundle\Markdown\HostSchemes;
use Nowo\MilkdownEditorBundle\Markdown\ImageAttributes;
use Nowo\MilkdownEditorBundle\Markdown\MilkdownMarkdownRenderer;
use Nowo\MilkdownEditorBundle\Markdown\Node\LeafDirective;
use Nowo\MilkdownEditorBundle\Markdown\Resolver\AllowlistIconResolver;
use Nowo\MilkdownEditorBundle\Markdown\Resolver\FilePreviewResolverInterface;
use Nowo\MilkdownEditorBundle\Markdown\Resolver\FileReference;
use Nowo\MilkdownEditorBundle\Markdown\Resolver\HostFileResolverInterface;
use Nowo\MilkdownEditorBundle\Markdown\Resolver\NullPageResolver;
use Nowo\MilkdownEditorBundle\Markdown\Resolver\NullUserResolver;
use Nowo\MilkdownEditorBundle\Markdown\Resolver\ResolvedFile;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Psr\Log\AbstractLogger;
use RuntimeException;
use Stringable;

/**
 * 1.9 (ME-5): host references. The scheme is configured, resolved URLs pass the same checks as any other, and a
 * reference that cannot be resolved renders safely. `image_block`: the attribute block and figures.
 */
final class HostFilesTest extends TestCase
{
    private const TEMPLATES = ['host-file' => ['image' => '/files/{id}/view', 'file' => '/files/{id}', 'preview' => '/files/{id}/preview']];

    /**
     * @param array{allow_remote_images?: bool, max_references?: int, image_block?: bool, file_preview_sandbox?: list<string>} $options
     * @param list<string> $origins
     */
    private function render(string $markdown, array $options = [], ?HostFileResolverInterface $files = null, ?FilePreviewResolverInterface $previews = null, array $origins = [], ?AbstractLogger $logger = null): string
    {
        return (new MilkdownMarkdownRenderer(
            $options,
            new NullPageResolver(),
            new NullUserResolver(),
            new AllowlistIconResolver(),
            logger: $logger,
            secret: 'test-secret',
            hostSchemes: new HostSchemes(self::TEMPLATES, $origins),
            sources: $files,
            previews: $previews,
        ))->render($markdown);
    }

    /**
     * @param array<string, ResolvedFile>|RuntimeException $answer
     */
    private function files(array|RuntimeException $answer): RecordingHostFileResolver
    {
        return new RecordingHostFileResolver($answer);
    }

    #[Test]
    public function imagesAndLinksResolveThroughTheTemplates(): void
    {
        $html = $this->render('![alt](host-file:abc-1) and [doc](HOST-FILE:abc-1)');
        self::assertStringContainsString('<img loading="lazy" src="/files/abc-1/view" alt="alt"', $html);
        self::assertStringContainsString('<a href="/files/abc-1">doc</a>', $html);
        self::assertStringNotContainsString('host-file:', $html);
    }

    #[Test]
    public function withoutSchemesNothingChanges(): void
    {
        $renderer = new MilkdownMarkdownRenderer([], new NullPageResolver(), new NullUserResolver(), new AllowlistIconResolver(), secret: 'test-secret');
        // As in 1.8: not a known scheme, so the renderer treats it as any other image (remote policy: a link).
        self::assertStringContainsString('<a href="host-file:abc">a</a>', $renderer->render('![a](host-file:abc)'));
        self::assertStringContainsString('<img src="/x.png" alt="a" />', $renderer->render('![a](/x.png)'));
    }

    /**
     * @return iterable<string, array{string}>
     */
    public static function invalidReferences(): iterable
    {
        yield 'path traversal' => ['host-file:..'];
        yield 'one dot' => ['host-file:.'];
        yield 'dots' => ['host-file:....'];
        yield 'a slash' => ['host-file:a/b'];
        yield 'percent' => ['host-file:a%2Fb'];
        yield 'query' => ['host-file:a?x=1'];
        yield 'empty' => ['host-file:'];
        yield 'too long' => ['host-file:' . str_repeat('a', 201)];
    }

    #[Test]
    #[DataProvider('invalidReferences')]
    public function invalidReferencesStayInert(string $reference): void
    {
        $html = $this->render('![a](<' . $reference . '>) [t](<' . $reference . '>)');
        self::assertStringNotContainsString('<img', $html);
        self::assertStringNotContainsString('<a ', $html);
        self::assertStringNotContainsString('/files/', $html);
        self::assertStringContainsString('nowo-md-ref--hidden', $html);
        self::assertStringContainsString('t', $html);
    }

    /**
     * @return iterable<string, array{string}>
     */
    public static function unsafeResolvedUrls(): iterable
    {
        yield 'javascript' => ['javascript:alert(1)'];
        yield 'obfuscated' => ["java\tscript:alert(1)"];
        yield 'data' => ['data:text/html,x'];
        yield 'data image' => ['data:image/svg+xml,x'];
        yield 'protocol relative' => ['//evil.example/x'];
        yield 'backslash' => ['/\\evil.example/x'];
        yield 'control prefix' => ["\x01//evil.example/x"];
    }

    #[Test]
    #[DataProvider('unsafeResolvedUrls')]
    public function aResolvedUrlPassesTheSameChecks(string $url): void
    {
        $html = $this->render("![a](host-file:x) [t](host-file:x)\n\n::file[f.pdf]{href=\"host-file:x\"}", [], $this->files(['host-file:x' => new ResolvedFile($url, $url)]));
        self::assertStringNotContainsString('<img', $html);
        self::assertStringNotContainsString('<a ', $html);
        self::assertStringNotContainsString('evil', $html);
        self::assertStringNotContainsString('script', $html);
        self::assertStringNotContainsString('f.pdf', $html);
    }

    #[Test]
    public function theRemoteImagePolicyAppliesToResolvedImages(): void
    {
        $files = $this->files(['host-file:x' => new ResolvedFile('https://cdn.example/x', 'https://cdn.example/x?signed=1')]);

        // Off and not listed: a link, no request.
        $html = $this->render('![a](host-file:x)', [], $files);
        self::assertStringNotContainsString('<img', $html);
        self::assertStringContainsString('<a href="https://cdn.example/x?signed=1">a</a>', $html);

        // Listed origin (case does not matter), or remote images on: an image.
        self::assertStringContainsString('<img loading="lazy" src="https://cdn.example/x?signed=1"', $this->render('![a](host-file:x)', [], $files, null, ['HTTPS://CDN.example']));
        self::assertStringContainsString('<img loading="lazy" src="https://cdn.example/x?signed=1"', $this->render('![a](host-file:x)', ['allow_remote_images' => true], $files));
    }

    /**
     * @return iterable<string, array{string}>
     */
    public static function notTheOrigin(): iterable
    {
        yield 'user info' => ['https://cdn.example@evil.example/x'];
        yield 'suffix' => ['https://cdn.example.evil.example/x'];
        yield 'other scheme' => ['http://cdn.example/x'];
        yield 'other port' => ['https://cdn.example:8443/x'];
        yield 'no slashes' => ['https:cdn.example/x'];
    }

    #[Test]
    #[DataProvider('notTheOrigin')]
    public function theOriginListComparesTheWholeOrigin(string $url): void
    {
        $html = $this->render('![a](host-file:x)', [], $this->files(['host-file:x' => new ResolvedFile($url)]), null, ['https://cdn.example']);
        self::assertStringNotContainsString('<img', $html);
    }

    #[Test]
    public function authorImagesNeverUseTheOriginList(): void
    {
        self::assertStringNotContainsString('<img', $this->render('![a](https://cdn.example/x.png)', [], null, null, ['https://cdn.example']));
    }

    #[Test]
    public function aMissingAnswerIsNotVisibleAndNothingIsLeaked(): void
    {
        $html = $this->render("![secret alt](host-file:x)\n\n[kept](host-file:x)\n\n::file[secret.pdf]{href=\"host-file:x\" view=\"preview\"}", [], $this->files([]));
        self::assertStringNotContainsString('<img', $html);
        self::assertStringNotContainsString('secret', $html);
        self::assertStringContainsString('kept', $html);
        self::assertStringNotContainsString('href', $html);
        self::assertSame(2, substr_count($html, 'nowo-md-ref--hidden'));
    }

    #[Test]
    public function aResolverFailureRendersSafelyAndIsLogged(): void
    {
        $logger = new class extends AbstractLogger {
            /** @var list<array<mixed>> */
            public array $contexts = [];

            public function log($level, string|Stringable $message, array $context = []): void
            {
                $this->contexts[] = $context;
            }
        };
        $html = $this->render('![a](host-file:x)', [], $this->files(new RuntimeException('secret')), null, [], $logger);
        self::assertStringContainsString('nowo-md-ref--hidden', $html);
        self::assertStringNotContainsString('secret', $html);
        self::assertSame('host file', $logger->contexts[0]['kind'] ?? null);
    }

    #[Test]
    public function oneBatchWithDistinctReferencesUpToTheBudget(): void
    {
        $files = $this->files(['host-file:a' => new ResolvedFile('/a'), 'host-file:b' => new ResolvedFile('/b'), 'host-file:other' => new ResolvedFile('/o')]);
        $html  = $this->render("![1](host-file:a) ![2](host-file:a) [3](host-file:b)\n\n::file[f]{href=\"host-file:b\"} ![4](host-file:c)", ['max_references' => 2], $files);
        self::assertSame([['host-file:a', 'host-file:b']], $files->calls);
        self::assertStringContainsString('src="/a"', $html);
        self::assertStringNotContainsString('host-file:c', $html);
    }

    #[Test]
    public function intrinsicSizeComesFromTheResolver(): void
    {
        $html = $this->render('![a](host-file:x)', [], $this->files(['host-file:x' => new ResolvedFile('/x', null, 640, 480)]));
        self::assertMatchesRegularExpression('~<img [^>]*width="640"[^>]*height="480"~', $html);
    }

    #[Test]
    public function aFileCardLinksToTheResolvedUrl(): void
    {
        $html = $this->render('::file[a.pdf]{href="host-file:x" type="application/pdf"}');
        self::assertStringContainsString('href="/files/x"', $html);
        self::assertStringContainsString('nowo-md-file--pdf', $html);
    }

    #[Test]
    public function previewsAskTheHostAndFallBackToTheCard(): void
    {
        $markdown = '::file[a.csv]{href="host-file:x" view="preview" height="320"}';
        // Default resolver: the template.
        $html = $this->render($markdown, ['file_preview_sandbox' => ['allow-downloads']]);
        self::assertStringContainsString('<iframe class="nowo-md-file__frame" src="/files/x/preview" title="a.csv" sandbox="allow-downloads" loading="lazy" referrerpolicy="no-referrer" height="320"></iframe>', $html);
        self::assertStringContainsString('href="/files/x" target="_blank" rel="noopener noreferrer">Open</a>', $html);
        self::assertStringContainsString('href="/files/x" download rel="noopener noreferrer">Download</a>', $html);

        $previews = new class implements FilePreviewResolverInterface {
            /** @var list<FileReference> */
            public array $files  = [];
            public mixed $answer = [];

            public function resolvePreviews(array $files): array
            {
                $this->files = $files;
                if ($this->answer instanceof RuntimeException) {
                    throw $this->answer;
                }
                /** @var array<string, string> $answer */
                $answer = $this->answer;

                return $answer;
            }
        };
        // The host says no: the card.
        $html = $this->render($markdown, [], null, $previews);
        self::assertStringNotContainsString('<iframe', $html);
        self::assertStringContainsString('nowo-md-file__link', $html);
        self::assertSame('host-file:x', $previews->files[0]->reference);
        self::assertSame('a.csv', $previews->files[0]->name);
        self::assertSame('/files/x', $previews->files[0]->url);
        // An unsafe or non-string answer: the card.
        foreach ([['host-file:x' => 'javascript:alert(1)'], ['host-file:x' => '//evil.example'], ['host-file:x' => 5]] as $answer) {
            $previews->answer = $answer;
            self::assertStringNotContainsString('<iframe', $this->render($markdown, [], null, $previews));
        }
        // A failure: the card.
        $previews->answer = new RuntimeException('secret');
        $html             = $this->render($markdown, [], null, $previews);
        self::assertStringNotContainsString('<iframe', $html);
        self::assertStringNotContainsString('secret', $html);
        // The host's URL.
        $previews->answer = ['host-file:x' => '/embed/x?a=1&b=2'];
        self::assertStringContainsString('src="/embed/x?a=1&amp;b=2"', $this->render($markdown, [], null, $previews));
    }

    #[Test]
    public function plainUrlsGetNoDefaultPreview(): void
    {
        self::assertStringNotContainsString('<iframe', $this->render('::file[a.pdf]{href="/a.pdf" view="preview"}'));
    }

    #[Test]
    public function aHostRendererOfFileCardsKeepsThem(): void
    {
        $renderer = new class implements DirectiveRendererInterface {
            public function supports(string $name): bool
            {
                return $name === 'file';
            }

            public function prepare(array $nodes): void
            {
            }

            public function render(LeafDirective $node): string
            {
                return '<x-file></x-file>';
            }
        };
        $html = (new MilkdownMarkdownRenderer([], new NullPageResolver(), new NullUserResolver(), new AllowlistIconResolver(), [$renderer], secret: 'test-secret', hostSchemes: new HostSchemes(self::TEMPLATES)))->render('::file[a]{href="host-file:x"}');
        self::assertStringContainsString('<x-file></x-file>', $html);
    }

    #[Test]
    public function schemesAndTemplates(): void
    {
        $schemes = new HostSchemes(['a' => ['file' => '/f/{id}'], 'b' => ['image' => '/i/{id}/{id}'], 'c' => []]);
        self::assertFalse($schemes->isEmpty());
        self::assertTrue((new HostSchemes())->isEmpty());
        self::assertSame('/f/x', $schemes->url('a:x', 'image'));
        self::assertSame('/i/x/x', $schemes->url('b:x', 'image'));
        self::assertNull($schemes->url('b:x', 'file'));
        self::assertNull($schemes->url('c:x', 'image'));
        self::assertNull($schemes->url('nope:x', 'file'));
        self::assertSame(['image' => null, 'file' => '/f/{id}', 'preview' => null], $schemes->toArray()['a']);
        self::assertFalse($schemes->isHostUrl('https://x'));
        self::assertTrue($schemes->isHostUrl(' A:x'));
        self::assertSame('a:x', $schemes->reference(" A:x\n"));
        self::assertNull($schemes->reference('nope:x'));
    }

    #[Test]
    public function templateResolversOnlyAnswerWhatTheyCanBuild(): void
    {
        $html = (new MilkdownMarkdownRenderer([], new NullPageResolver(), new NullUserResolver(), new AllowlistIconResolver(), secret: 'test-secret', hostSchemes: new HostSchemes(['noop' => [], 'img' => ['image' => '/i/{id}']])))->render('![a](noop:x) ![b](img:y) [c](img:y)');
        self::assertStringContainsString('nowo-md-ref--hidden', $html);
        self::assertStringContainsString('<img loading="lazy" src="/i/y"', $html);
        self::assertStringContainsString('<a href="/i/y">c</a>', $html);
    }

    /**
     * @return iterable<string, array{string, array{width: string, align: string}|null}>
     */
    public static function attributeBlocks(): iterable
    {
        yield 'width' => ['{width=50%}', ['width' => '50%', 'align' => '']];
        yield 'both' => ['{width=120px align=center}', ['width' => '120px', 'align' => 'center']];
        yield 'quotes and spaces' => ['{ align="right"  width="100%" }', ['width' => '100%', 'align' => 'right']];
        yield 'bad width' => ['{width=33%}', null];
        yield 'too small' => ['{width=15px}', null];
        yield 'too big' => ['{width=2001px}', null];
        yield 'bad align' => ['{align=justify}', null];
        yield 'css' => ['{width="1;color:red"}', null];
        yield 'unknown key' => ['{width=50% foo=bar}', null];
        yield 'three' => ['{width=50% align=left width=25%}', null];
        yield 'empty' => ['{}', null];
        yield 'not at the start' => [' {width=50%}', null];
    }

    /**
     * @param array{width: string, align: string}|null $expected
     */
    #[Test]
    #[DataProvider('attributeBlocks')]
    public function attributeBlocksHaveStrictRules(string $text, ?array $expected): void
    {
        $read = ImageAttributes::prefix($text);
        self::assertSame($expected, $read === null ? null : ['width' => $read['width'], 'align' => $read['align']]);
    }

    #[Test]
    public function theImageBlockRendersAFigure(): void
    {
        $on   = ['image_block' => true];
        $html = $this->render('![alt](/a.png "A <b>caption</b>"){width=50% align=center}', $on);
        self::assertStringContainsString('<figure class="nowo-md-figure nowo-md-figure--center nowo-md-figure--w50"><img src="/a.png" alt="alt" /><figcaption>A &lt;b&gt;caption&lt;/b&gt;</figcaption></figure>', $html);
        self::assertStringNotContainsString('style', $html);
        self::assertStringNotContainsString('<p>', $html);

        // A px width is the image's attribute.
        self::assertStringContainsString('width="240"', $this->render('![a](/a.png){width=240px}', $on));
        // No attributes, no caption: still a figure.
        self::assertStringContainsString('<figure class="nowo-md-figure"><img src="/a.png" alt="a" /></figure>', $this->render('![a](/a.png)', $on));
        // Not valid: stays text, nothing is lost.
        $html = $this->render('![a](/a.png){width=evil}', $on);
        self::assertStringContainsString('{width=evil}', $html);
        self::assertStringNotContainsString('<figure', $html);
        // An image inside a sentence keeps its place and takes the block.
        $html = $this->render('See ![a](/a.png){width=240px} here', $on);
        self::assertStringContainsString('<p>See <img width="240" src="/a.png" alt="a" /> here</p>', $html);
        self::assertStringNotContainsString('{', $html);
        // A host image in a figure, and one the viewer may not read keeps the figure's caption out of its alt.
        self::assertStringContainsString('<figure class="nowo-md-figure"><img loading="lazy" src="/files/x/view"', $this->render('![a](host-file:x)', $on));
        self::assertStringContainsString('<figure class="nowo-md-figure"><span class="nowo-md-ref nowo-md-ref--hidden">', $this->render('![a](host-file:..)', $on));
    }

    #[Test]
    public function withoutTheImageBlockTheBracesStayText(): void
    {
        $html = $this->render('![a](/a.png "t"){width=50%}');
        self::assertStringContainsString('<p><img src="/a.png" alt="a" title="t" />{width=50%}</p>', $html);
    }
}

/** Answers fixed files and records the batches. */
final class RecordingHostFileResolver implements HostFileResolverInterface
{
    /** @var list<list<string>> */
    public array $calls = [];

    /**
     * @param array<string, ResolvedFile>|RuntimeException $answer
     */
    public function __construct(private readonly array|RuntimeException $answer)
    {
    }

    public function resolveFiles(array $references): array
    {
        $this->calls[] = $references;
        if ($this->answer instanceof RuntimeException) {
            throw $this->answer;
        }

        return $this->answer;
    }
}
