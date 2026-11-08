<?php

declare(strict_types=1);

namespace Nowo\MilkdownEditorBundle\Tests\Unit\DependencyInjection;

use Nowo\MilkdownEditorBundle\DependencyInjection\Configuration;
use Nowo\MilkdownEditorBundle\Feature;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Symfony\Component\Config\Definition\Exception\InvalidConfigurationException;
use Symfony\Component\Config\Definition\Processor;

final class ConfigurationTest extends TestCase
{
    private const FILES = '^/files/(?<id>[0-9a-f-]{36})/(?:original|preview)$';

    /**
     * @param array<string, mixed> $config
     *
     * @return array{default_profile: string, profiles: array<string, array{features: list<string>, theme: string, mention_display: string}>, markdown: array{html_input: string, allow_unsafe_links: bool, allow_remote_images: bool, footnotes: bool, max_footnote_refs: int, mention_display: string, max_input_length: int, max_inline_markers: int, max_references: int}}
     */
    private function process(array $config): array
    {
        /** @var array{default_profile: string, profiles: array<string, array{features: list<string>, theme: string, mention_display: string}>, markdown: array{html_input: string, allow_unsafe_links: bool, allow_remote_images: bool, footnotes: bool, max_footnote_refs: int, mention_display: string, max_input_length: int, max_inline_markers: int, max_references: int}} $processed */
        $processed = (new Processor())->processConfiguration(new Configuration(), [$config]);

        return $processed;
    }

    #[Test]
    public function defaultsAreSafe(): void
    {
        $c = $this->process([]);
        self::assertSame('default', $c['default_profile']);
        self::assertSame(['toolbar', 'link_tooltip', 'table', 'code_mirror', 'placeholder', 'cursor', 'slash_menu'], $c['profiles']['default']['features']);
        self::assertSame('auto', $c['profiles']['default']['theme']);
        self::assertSame('escape', $c['markdown']['html_input']);
        self::assertFalse($c['markdown']['allow_unsafe_links']);
        self::assertFalse($c['markdown']['allow_remote_images']);
        self::assertTrue($c['markdown']['footnotes']);
        self::assertSame(200, $c['markdown']['max_footnote_refs']);
        self::assertSame('handle', $c['markdown']['mention_display']);
        self::assertSame('handle', $c['profiles']['default']['mention_display']);
        self::assertSame(100000, $c['markdown']['max_input_length']);
        self::assertSame(10000, $c['markdown']['max_inline_markers']);
        self::assertSame(500, $c['markdown']['max_references']);
        // 1.7: decorative icons on, catalog off.
        $profile = $c['profiles']['default'];
        self::assertSame([false, true, true], [$profile['icon_catalog'] ?? null, $profile['toolbar_icons'] ?? null, $profile['menu_icons'] ?? null]);
        self::assertFalse($c['markdown']['icon_catalog'] ?? null);
        // 1.8: both action-bar buttons, no per-kind upload lists.
        self::assertSame([['file', 'icon'], [], []], [$profile['action_bar_insert'] ?? null, $profile['upload_accept_images'] ?? null, $profile['upload_accept_files'] ?? null]);
        self::assertContains('file_cards', Feature::values());
    }

    #[Test]
    public function actionBarAndUploadKindsAreConfigurable(): void
    {
        $profile = $this->process(['profiles' => ['default' => ['features' => ['file_cards'], 'action_bar_insert' => [], 'upload_accept_images' => ['image/png'], 'upload_accept_files' => ['application/pdf', '.csv']]]])['profiles']['default'];
        self::assertSame(['file_cards'], $profile['features']);
        self::assertSame([], $profile['action_bar_insert'] ?? null);
        self::assertSame(['image/png'], $profile['upload_accept_images'] ?? null);
        self::assertSame(['application/pdf', '.csv'], $profile['upload_accept_files'] ?? null);
    }

    #[Test]
    public function severalProfilesAndADefault(): void
    {
        $c = $this->process(['default_profile' => 'wiki', 'profiles' => ['wiki' => ['features' => ['code_mirror', 'math', 'mermaid']], 'comment' => ['features' => ['toolbar']]]]);
        self::assertSame(['code_mirror', 'math', 'mermaid'], $c['profiles']['wiki']['features']);
        self::assertSame(['wiki', 'comment'], array_keys($c['profiles']));
    }

    #[Test]
    public function theDefaultProfileMustExist(): void
    {
        $this->expectException(InvalidConfigurationException::class);
        $this->expectExceptionMessage('The default profile "x" is not defined');
        $this->process(['default_profile' => 'x']);
    }

    /**
     * @return iterable<string, array{array<string, mixed>}>
     */
    public static function invalid(): iterable
    {
        yield 'unknown feature' => [['profiles' => ['default' => ['features' => ['emoji']]]]];
        yield 'math without code mirror' => [['profiles' => ['default' => ['features' => ['math']]]]];
        yield 'mermaid without code mirror' => [['profiles' => ['default' => ['features' => ['mermaid']]]]];
        yield 'block drag without block actions' => [['profiles' => ['default' => ['features' => ['block_drag']]]]];
        yield 'insert menu without context menu' => [['profiles' => ['default' => ['features' => ['insert_menu']]]]];
        yield 'bad theme' => [['profiles' => ['default' => ['theme' => 'blue']]]];
        yield 'bad min height' => [['profiles' => ['default' => ['min_height' => '10%']]]];
        yield 'non-string min height' => [['profiles' => ['default' => ['min_height' => 10]]]];
        yield 'bad icon' => [['profiles' => ['default' => ['icons' => ['Bug']]]]];
        yield 'bad html input' => [['markdown' => ['html_input' => 'allow']]];
        yield 'bad mark colour' => [['markdown' => ['mark_colors' => ['Red!']]]];
        yield 'bad renderer icon' => [['markdown' => ['icons' => ['a b']]]];
        yield 'negative upload size' => [['profiles' => ['default' => ['upload_max_size' => -1]]]];
        yield 'unknown action bar button' => [['profiles' => ['default' => ['action_bar_insert' => ['file', 'link']]]]];
        yield 'empty accept entry' => [['profiles' => ['default' => ['upload_accept_files' => ['']]]]];
    }

    /**
     * @param array<string, mixed> $config
     */
    #[Test]
    #[DataProvider('invalid')]
    public function invalidConfigurationIsRejected(array $config): void
    {
        $this->expectException(InvalidConfigurationException::class);
        $this->process($config);
    }

    /** 1.9 (ME-5, ME-6): off by default; schemes keep their "-"; templates, origins and the sandbox are validated. */
    #[Test]
    public function hostSchemesOriginsAndSandbox(): void
    {
        $markdown = $this->process([])['markdown'];
        self::assertSame([[], [], [], false], [$markdown['host_schemes'] ?? null, $markdown['host_image_origins'] ?? null, $markdown['file_preview_sandbox'] ?? null, $markdown['image_block'] ?? null]);

        $markdown = $this->process(['markdown' => [
            'host_schemes'         => ['app-file' => ['image' => '/f/{id}/i', 'file' => 'https://x.example/{id}']],
            'host_image_origins'   => ['https://cdn.example:8443'],
            'file_preview_sandbox' => ['allow-scripts', 'allow-downloads'],
        ]])['markdown'];
        self::assertSame(['app-file' => ['image' => '/f/{id}/i', 'file' => 'https://x.example/{id}', 'preview' => null]], $markdown['host_schemes'] ?? null);
    }

    /** 1.13: off by default; url defaults to written; the scheme must be declared. */
    #[Test]
    public function hostUrlPatterns(): void
    {
        $markdown = $this->process([])['markdown'];
        self::assertSame([[], 'text'], [$markdown['host_url_patterns'] ?? null, $markdown['host_refused_links'] ?? null]);

        $markdown = $this->process(['markdown' => [
            'host_schemes'       => ['app-file' => ['file' => '/f/{id}']],
            'host_url_patterns'  => [['pattern' => self::FILES, 'scheme' => 'app-file'], ['pattern' => '^https://cdn\\.example/(?<id>\\w+)\\$$', 'scheme' => 'app-file', 'url' => 'resolved']],
            'host_refused_links' => 'hidden',
        ]])['markdown'];
        self::assertSame([['pattern' => self::FILES, 'scheme' => 'app-file', 'url' => 'written'], ['pattern' => '^https://cdn\\.example/(?<id>\\w+)\\$$', 'scheme' => 'app-file', 'url' => 'resolved']], $markdown['host_url_patterns'] ?? null);
        self::assertSame('hidden', $markdown['host_refused_links'] ?? null);
    }

    /**
     * @return iterable<string, array{string}>
     */
    public static function invalidHostUrlPatterns(): iterable
    {
        yield 'not anchored at the start' => ['/files/(?<id>[a-z]+)$'];
        yield 'not anchored at the end' => ['^/files/(?<id>[a-z]+)'];
        yield 'escaped dollar' => ['^/files/(?<id>[a-z]+)\\$'];
        yield 'no id group' => ['^/files/([a-z]+)$'];
        yield 'two id groups' => ['^/(?<id>a)/(?<id>b)$'];
        yield 'lookahead' => ['^/(?=x)(?<id>a)$'];
        yield 'lookbehind' => ['^/(?<!x)(?<id>a)$'];
        yield 'inline flag' => ['^/(?i)(?<id>a)$'];
        yield 'other named group' => ['^/(?<x>a)(?<id>a)$'];
        yield 'python named group' => ['^/(?P<id>a)(?<id>a)$'];
        yield 'unicode escape' => ['^/\\p{L}(?<id>a)$'];
        yield 'back reference' => ['^/(?<id>a)\\1$'];
        yield 'subject anchor' => ['^\\A/(?<id>a)$'];
        yield 'dangling escape' => ['^/(?<id>a)$\\'];
        yield 'hash' => ['^/#(?<id>a)$'];
        yield 'not ascii' => ['^/é(?<id>a)$'];
        yield 'too long' => ['^/' . str_repeat('a', 300) . '(?<id>a)$'];
        yield 'invalid' => ['^/(?<id>[a)$'];
        yield 'top-level alternation' => ['^/a$|^(?<id>.*)$'];
        yield 'verb' => ['^/files/(?<id>\w+)(*ACCEPT)/x$'];
        yield 'posix class' => ['^/files/(?<id>[[:alnum:]]+)$'];
        yield 'class starting with ]' => ['^/files/(?<id>[]a]+)$'];
        yield 'negated class starting with ]' => ['^/files/(?<id>[^]a]+)$'];
    }

    #[Test]
    #[DataProvider('invalidHostUrlPatterns')]
    public function invalidHostUrlPatternsAreRefused(string $pattern): void
    {
        $this->expectException(InvalidConfigurationException::class);
        $this->expectExceptionMessage('Invalid host_url_patterns pattern');
        $this->process(['markdown' => ['host_schemes' => ['app-file' => ['file' => '/f/{id}']], 'host_url_patterns' => [['pattern' => $pattern, 'scheme' => 'app-file']]]]);
    }

    #[Test]
    public function alternationInsideAGroupAndHostsAreAccepted(): void
    {
        $markdown = $this->process(['markdown' => [
            'host_schemes'      => ['app-file' => ['file' => '/f/{id}']],
            'host_url_patterns' => [['pattern' => '^/files/(?<id>[^|/]{36})/(?:original|preview|[|])$', 'scheme' => 'app-file']],
            'host_url_hosts'    => ['Beacon.Example', 'beacon.example:8443'],
        ]])['markdown'];
        self::assertSame(['beacon.example', 'beacon.example:8443'], $markdown['host_url_hosts'] ?? null);
        self::assertSame([], $this->process([])['markdown']['host_url_hosts'] ?? null);

        $this->expectException(InvalidConfigurationException::class);
        $this->process(['markdown' => ['host_url_hosts' => ['https://beacon.example/x']]]);
    }

    #[Test]
    public function aPatternNeedsADeclaredSchemeAndAValidName(): void
    {
        try {
            $this->process(['markdown' => ['host_url_patterns' => [['pattern' => self::FILES, 'scheme' => 'app-file']]]]);
            self::fail('An undeclared scheme was accepted.');
        } catch (InvalidConfigurationException $e) {
            self::assertStringContainsString('"app-file" is not one of host_schemes', $e->getMessage());
        }
        $this->expectException(InvalidConfigurationException::class);
        $this->expectExceptionMessage('Invalid host_url_patterns scheme "App"');
        $this->process(['markdown' => ['host_url_patterns' => [['pattern' => self::FILES, 'scheme' => 'App']]]]);
    }

    #[Test]
    public function theValidatorsReadAnyValue(): void
    {
        self::assertSame('Invalid host_url_patterns scheme "".', Configuration::invalidHostUrlPatterns(['x']));
        self::assertSame('Invalid host_url_patterns pattern "": it must be a string.', Configuration::invalidHostUrlPatterns([['scheme' => 'a', 'pattern' => 1]]));
        self::assertNull(Configuration::invalidHostUrlPatterns([['scheme' => 'a', 'pattern' => self::FILES]]));
    }

    /**
     * @return iterable<string, array{array<string, mixed>}>
     */
    public static function invalidHostFileConfiguration(): iterable
    {
        yield 'reserved scheme' => [['host_schemes' => ['javascript' => ['file' => '/{id}']]]];
        yield 'http scheme' => [['host_schemes' => ['https' => ['file' => '/{id}']]]];
        yield 'upper case' => [['host_schemes' => ['App' => ['file' => '/{id}']]]];
        yield 'no id' => [['host_schemes' => ['app' => ['file' => '/files']]]];
        yield 'protocol relative' => [['host_schemes' => ['app' => ['file' => '//evil/{id}']]]];
        yield 'backslash' => [['host_schemes' => ['app' => ['file' => '/\\\\evil/{id}']]]];
        yield 'script' => [['host_schemes' => ['app' => ['preview' => 'javascript:{id}']]]];
        yield 'relative' => [['host_schemes' => ['app' => ['image' => 'files/{id}']]]];
        yield 'too long' => [['host_schemes' => ['app' => ['image' => '/{id}' . str_repeat('a', 500)]]]];
        yield 'id in the host' => [['host_schemes' => ['app' => ['file' => 'https://{id}/x']]]];
        yield 'id in the subdomain' => [['host_schemes' => ['app' => ['file' => 'https://{id}.example.com/x']]]];
        yield 'id after the host' => [['host_schemes' => ['app' => ['file' => 'https://example.com{id}/x']]]];
        yield 'id in the port' => [['host_schemes' => ['app' => ['file' => 'https://example.com:{id}/x']]]];
        yield 'id in the user info' => [['host_schemes' => ['app' => ['file' => 'https://user:{id}@example.com/x']]]];
        yield 'view-source' => [['host_schemes' => ['view-source' => ['file' => '/{id}']]]];
        yield 'scripts and escaping popups' => [['file_preview_sandbox' => ['allow-scripts', 'allow-popups', 'allow-popups-to-escape-sandbox']]];
        yield 'origin with a path' => [['host_image_origins' => ['https://cdn.example/x']]];
        yield 'origin wildcard' => [['host_image_origins' => ['*']]];
        yield 'unknown token' => [['file_preview_sandbox' => ['allow-top-navigation']]];
        yield 'scripts and same origin' => [['file_preview_sandbox' => ['allow-scripts', 'allow-same-origin']]];
    }

    /**
     * @param array<string, mixed> $markdown
     */
    #[Test]
    #[DataProvider('invalidHostFileConfiguration')]
    public function invalidHostFileConfigurationIsRefused(array $markdown): void
    {
        $this->expectException(InvalidConfigurationException::class);
        $this->process(['markdown' => $markdown]);
    }

    #[Test]
    public function invalidHostSchemesHelper(): void
    {
        self::assertNull(Configuration::invalidHostSchemes(['app' => 'not an array']));
        self::assertNull(Configuration::invalidHostSchemes(['app' => ['file' => null]]));
        self::assertNotNull(Configuration::invalidHostSchemes(['app' => ['file' => 5]]));
    }
}
