<?php

declare(strict_types=1);

namespace Nowo\MilkdownEditorBundle\Tests\Unit\Markdown;

use Nowo\MilkdownEditorBundle\Markdown\HostSchemes;
use Nowo\MilkdownEditorBundle\Markdown\MilkdownMarkdownRenderer;
use Nowo\MilkdownEditorBundle\Markdown\Resolver\AllowlistIconResolver;
use Nowo\MilkdownEditorBundle\Markdown\Resolver\ContextualHostFileResolverInterface;
use Nowo\MilkdownEditorBundle\Markdown\Resolver\HostFileResolverInterface;
use Nowo\MilkdownEditorBundle\Markdown\Resolver\NullPageResolver;
use Nowo\MilkdownEditorBundle\Markdown\Resolver\NullUserResolver;
use Nowo\MilkdownEditorBundle\Markdown\Resolver\RenderContextProviderInterface;
use Nowo\MilkdownEditorBundle\Markdown\Resolver\ResolvedFile;
use Nowo\MilkdownEditorBundle\Markdown\Resolver\TemplateHostFileResolver;
use Nowo\MilkdownEditorBundle\Twig\MilkdownEditorTwig;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use stdClass;
use Symfony\Component\Asset\Package;
use Symfony\Component\Asset\Packages;
use Symfony\Component\Asset\VersionStrategy\EmptyVersionStrategy;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RequestStack;

use function str_repeat;

use const JSON_THROW_ON_ERROR;

/**
 * 1.13: `host_url_patterns` — plain URLs that are host references — and the render context of contextual resolvers.
 * Refused references leave no URL, id, alt text or name; with the default `url: written` and a viewer who may see the
 * file, the output is exactly what it was without patterns.
 */
final class HostUrlPatternsTest extends TestCase
{
    private const UUID = '0f8fad5b-d9cb-469f-a165-70867728950e';

    private const FILES = '^/files/(?<id>[0-9a-f-]{36})/(?:original|preview)$';

    private const SCHEMES = ['app-file' => ['image' => '/f/{id}/view', 'file' => '/f/{id}', 'preview' => '/f/{id}/embed']];

    private const DOCUMENT = '![secret alt](/files/' . self::UUID . "/preview \"t\")\n\n[secret name.pdf](/files/" . self::UUID . "/original)\n\n::file[secret card.pdf]{href=\"/files/" . self::UUID . "/original\" view=\"preview\"}\n\n[![secret nested](/files/" . self::UUID . '/preview)](/files/' . self::UUID . '/original)';

    /**
     * @param list<array{pattern: string, scheme: string, url?: string}> $patterns
     * @param array{allow_remote_images?: bool, host_refused_links?: string} $options
     */
    private function render(string $markdown, array $patterns, ?HostFileResolverInterface $files = null, array $options = [], ?RenderContextProviderInterface $context = null): string
    {
        $schemes = new HostSchemes(self::SCHEMES, [], $patterns);

        return (new MilkdownMarkdownRenderer(
            $options,
            new NullPageResolver(),
            new NullUserResolver(),
            new AllowlistIconResolver(),
            secret: 'test-secret',
            hostSchemes: $schemes,
            sources: $files ?? new TemplateHostFileResolver($schemes),
            renderContext: $context,
        ))->render($markdown);
    }

    /**
     * @return list<array{pattern: string, scheme: string}>
     */
    private function written(): array
    {
        return [['pattern' => self::FILES, 'scheme' => 'app-file']];
    }

    #[Test]
    public function writtenAndVisibleIsExactlyTheOutputWithoutPatterns(): void
    {
        $before = $this->render(self::DOCUMENT, []);
        self::assertStringContainsString('<img src="/files/' . self::UUID . '/preview" alt="secret alt" title="t" />', $before);
        self::assertSame($before, $this->render(self::DOCUMENT, $this->written()));
        self::assertSame($before, $this->render(self::DOCUMENT, [['pattern' => self::FILES, 'scheme' => 'app-file', 'url' => 'written']], new RecordingHostFileResolver(['app-file:' . self::UUID => new ResolvedFile('/elsewhere', '/elsewhere/i', 10, 10, 'Real.pdf', 'application/pdf')])));
    }

    #[Test]
    public function aRefusedReferenceLeavesNoUrlIdAltOrName(): void
    {
        $files = new RecordingHostFileResolver([]);
        $html  = $this->render(self::DOCUMENT, $this->written(), $files);
        self::assertSame([['app-file:' . self::UUID]], $files->calls);
        self::assertStringNotContainsString(self::UUID, $html);
        self::assertStringNotContainsString('secret', $html);
        self::assertStringNotContainsString('href', $html);
        self::assertStringNotContainsString('<img', $html);
        self::assertStringNotContainsString('<iframe', $html);
        self::assertSame(4, substr_count($html, 'Content not visible'));
    }

    #[Test]
    public function resolvedTakesTheResolversUrlsAndFile(): void
    {
        $reference = 'app-file:' . self::UUID;
        $files     = new RecordingHostFileResolver([$reference => new ResolvedFile('/signed/1', '/signed/1/img', 640, 480, 'Real.pdf', 'application/pdf')]);
        $html      = $this->render(self::DOCUMENT, [['pattern' => self::FILES, 'scheme' => 'app-file', 'url' => 'resolved']], $files);
        self::assertStringContainsString('<img loading="lazy" width="640" height="480" src="/signed/1/img" alt="secret alt" title="t" />', $html);
        self::assertStringContainsString('<a href="/signed/1">secret name.pdf</a>', $html);
        self::assertStringContainsString('Real.pdf', $html);
        self::assertStringContainsString('/f/' . self::UUID . '/embed', $html);
        self::assertStringNotContainsString('/files/', $html);
    }

    #[Test]
    public function writtenRemoteImagesFollowTheAuthorPolicy(): void
    {
        $patterns = [['pattern' => '^https://cdn\.example/files/(?<id>[0-9a-f-]{36})$', 'scheme' => 'app-file']];
        $md       = '![a](https://cdn.example/files/' . self::UUID . ')';
        self::assertStringContainsString('<a href="https://cdn.example/files/' . self::UUID . '">a</a>', $this->render($md, $patterns));
        self::assertStringContainsString('<img src="https://cdn.example/files/' . self::UUID . '" alt="a" />', $this->render($md, $patterns, null, ['allow_remote_images' => true]));
    }

    #[Test]
    public function anInvalidIdOrALongUrl(): void
    {
        $files = new RecordingHostFileResolver([]);
        $html  = $this->render('![secret](/files/.env/original) [x](/files/' . str_repeat('a', 2048) . '/original)', [['pattern' => '^/files/(?<id>[^/]+)/original$', 'scheme' => 'app-file']], $files);
        self::assertSame([], $files->calls);
        self::assertStringNotContainsString('secret', $html);
        self::assertStringNotContainsString('.env', $html);
        // Audit IJ-L1: a matching URL over the length bound is refused too.
        self::assertStringNotContainsString('aaaa', $html);
        self::assertSame(2, substr_count($html, 'Content not visible'));
    }

    #[Test]
    public function refusedSchemeLinksKeepTheirTextUnlessHidden(): void
    {
        $files = new RecordingHostFileResolver([]);
        self::assertStringContainsString('<p>doc</p>', $this->render('[doc](app-file:x)', [], $files));
        $html = $this->render('[doc](app-file:x)', [], $files, ['host_refused_links' => 'hidden']);
        self::assertStringNotContainsString('doc', $html);
        self::assertStringContainsString('Content not visible', $html);
    }

    #[Test]
    public function aContextualResolverGetsTheRenderContext(): void
    {
        $context  = new stdClass();
        $provider = new class($context) implements RenderContextProviderInterface {
            public function __construct(private readonly object $context)
            {
            }

            public function renderContext(): object
            {
                return $this->context;
            }
        };
        $files = new ContextRecordingResolver();
        $html  = $this->render(self::DOCUMENT, $this->written(), $files, [], $provider);
        self::assertSame([[['app-file:' . self::UUID], $context]], $files->calls);
        self::assertStringNotContainsString(self::UUID, $html);

        $files = new ContextRecordingResolver();
        $this->render('![a](app-file:x)', [], $files);
        self::assertSame([[['app-file:x'], null]], $files->calls);
        self::assertSame([], $files->resolveFiles(['app-file:x']));
    }

    #[Test]
    public function hostSchemesReadPatterns(): void
    {
        $schemes = new HostSchemes(self::SCHEMES, [], [['pattern' => self::FILES, 'scheme' => 'APP-FILE', 'url' => 'resolved'], ['pattern' => '^/other/(?<id>\w+)$', 'scheme' => 'gone']]);
        self::assertTrue($schemes->hasUrlPatterns());
        self::assertFalse((new HostSchemes(self::SCHEMES))->hasUrlPatterns());
        self::assertSame([['pattern' => self::FILES, 'scheme' => 'app-file', 'url' => 'resolved'], ['pattern' => '^/other/(?<id>\w+)$', 'scheme' => 'gone', 'url' => 'written']], $schemes->urlPatternsToArray());
        self::assertSame(['app-file:' . self::UUID, 'resolved'], $schemes->matchUrl(' /files/' . self::UUID . '/original '));
        self::assertSame([null, 'written'], $schemes->matchUrl('/other/abc'));
        self::assertNull($schemes->matchUrl('/files/x/original'));
        self::assertNull($schemes->matchUrl(''));
        self::assertTrue($schemes->isHostValue('app-file:x'));
        self::assertTrue($schemes->isHostValue('/other/abc'));
        self::assertFalse($schemes->isHostValue('/x.png'));
        self::assertSame('app-file:x', $schemes->hostReference('app-file:x'));
        self::assertNull($schemes->hostReference('/x.png'));
        self::assertFalse($schemes->keepsWrittenUrl('app-file:x'));
        self::assertFalse($schemes->keepsWrittenUrl('/files/' . self::UUID . '/original'));
        self::assertTrue($schemes->keepsWrittenUrl('/other/abc'));
    }

    /** Audit IJ-L1: a pattern that fails to run, or a long URL that starts like a pattern, is refused, never a plain link. */
    #[Test]
    public function errorsAndLengthFailClosed(): void
    {
        $redos = [['pattern' => '^/files/(?<id>[0-9a-f-]{36})/(?:a+)+$', 'scheme' => 'app-file']];
        $files = new RecordingHostFileResolver(['app-file:' . self::UUID => new ResolvedFile('/f')]);
        $html  = $this->render('[secret](/files/' . self::UUID . '/' . str_repeat('a', 1000) . 'b)', $redos, $files);
        self::assertStringNotContainsString(self::UUID, $html);
        self::assertStringNotContainsString('secret', $html);
        self::assertStringContainsString('Content not visible', $html);

        $long = '/files/' . self::UUID . '/' . str_repeat('x', 2100);
        $html = $this->render('[secret](' . $long . ') [other](/elsewhere/' . str_repeat('y', 2100) . ')', $this->written(), $files);
        self::assertStringNotContainsString('secret', $html);
        self::assertStringContainsString('<a href="/elsewhere/yyy', $html);
        self::assertSame([], $files->calls);
    }

    /** Audit IJ-I3: query, fragment, percent-encoding, upper case and this application's absolute URLs are normalised. */
    #[Test]
    public function urlsAreNormalisedBeforeMatching(): void
    {
        $requests = new RequestStack([Request::create('https://wiki.example:8443/x')]);
        $schemes  = new HostSchemes(self::SCHEMES, [], $this->written(), ['beacon.example'], $requests);
        $upper    = strtoupper(self::UUID);
        foreach ([
            '/files/' . self::UUID . '/original?download=1',
            '/files/' . self::UUID . '/original#page=2',
            '/files/%30' . substr(self::UUID, 1) . '/original',
            '/files/' . $upper . '/preview',
            'https://beacon.example/files/' . self::UUID . '/original',
            'HTTP://BEACON.EXAMPLE/files/' . self::UUID . '/original',
            '//beacon.example/files/' . self::UUID . '/original',
            'https://wiki.example:8443/files/' . self::UUID . '/original',
        ] as $url) {
            self::assertSame(['app-file:' . self::UUID, 'written'], $schemes->matchUrl($url), $url);
        }
        foreach (['https://evil.example/files/' . self::UUID . '/original', 'https://user@beacon.example/files/' . self::UUID . '/original', 'https://beacon.example', '?x', ''] as $url) {
            self::assertNull($schemes->matchUrl($url), $url);
        }
        self::assertSame('/', $schemes->candidate('https://beacon.example'));
        self::assertSame(['beacon.example'], $schemes->urlHosts());
        self::assertNull((new HostSchemes(self::SCHEMES, [], $this->written()))->matchUrl('https://beacon.example/files/' . self::UUID . '/original'));
    }

    #[Test]
    public function literalPrefixes(): void
    {
        self::assertSame('/files/', HostSchemes::literalPrefix(self::FILES));
        self::assertSame('https://cdn.example/f', HostSchemes::literalPrefix('^https://cdn\.example/f(?<id>\w+)$'));
        self::assertSame('/file', HostSchemes::literalPrefix('^/files?/(?<id>\w+)$'));
        self::assertSame('/a', HostSchemes::literalPrefix('^/a+b(?<id>\w+)$'));
        self::assertSame('', HostSchemes::literalPrefix('^(?<id>\w+)$'));
    }

    #[Test]
    public function theAssetsCarryThePatternsOnlyWhenConfigured(): void
    {
        $renderer = new MilkdownMarkdownRenderer([], new NullPageResolver(), new NullUserResolver(), new AllowlistIconResolver(), secret: 'test-secret');
        $package  = new Package(new EmptyVersionStrategy());
        $packages = new Packages($package, ['nowo_milkdown_editor' => $package]);
        self::assertStringNotContainsString('hostUrlPatterns', (new MilkdownEditorTwig($renderer, $packages, null, null, new HostSchemes(self::SCHEMES)))->assets(''));
        $assets = (new MilkdownEditorTwig($renderer, $packages, null, null, new HostSchemes(self::SCHEMES, [], $this->written())))->assets('');
        self::assertSame(1, preg_match('#data-nowo-milkdown-config>(.*?)</script>#', $assets, $m));
        self::assertStringNotContainsString('<id>', $m[1]);
        $data = json_decode($m[1], true, 8, JSON_THROW_ON_ERROR);
        self::assertIsArray($data);
        self::assertSame([['pattern' => self::FILES, 'scheme' => 'app-file', 'url' => 'written']], $data['hostUrlPatterns'] ?? null);
        self::assertArrayNotHasKey('hostUrlHosts', $data);
        $assets = (new MilkdownEditorTwig($renderer, $packages, null, null, new HostSchemes(self::SCHEMES, [], $this->written(), ['beacon.example'])))->assets('');
        self::assertStringContainsString('"hostUrlHosts":["beacon.example"]', $assets);
    }
}

/** A contextual resolver that sees nothing and records what it was asked, with the context. */
final class ContextRecordingResolver implements ContextualHostFileResolverInterface
{
    /** @var list<array{list<string>, ?object}> */
    public array $calls = [];

    public function resolveFiles(array $references): array
    {
        return [];
    }

    public function resolveFilesInContext(array $references, ?object $context): array
    {
        $this->calls[] = [$references, $context];

        return [];
    }
}
