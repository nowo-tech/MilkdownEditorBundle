<?php

declare(strict_types=1);

namespace Nowo\MilkdownEditorBundle\Tests\Unit\DependencyInjection;

use Nowo\MilkdownEditorBundle\DependencyInjection\Configuration;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Symfony\Component\Config\Definition\Exception\InvalidConfigurationException;
use Symfony\Component\Config\Definition\Processor;

final class ConfigurationTest extends TestCase
{
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
        yield 'bad theme' => [['profiles' => ['default' => ['theme' => 'blue']]]];
        yield 'bad min height' => [['profiles' => ['default' => ['min_height' => '10%']]]];
        yield 'non-string min height' => [['profiles' => ['default' => ['min_height' => 10]]]];
        yield 'bad icon' => [['profiles' => ['default' => ['icons' => ['Bug']]]]];
        yield 'bad html input' => [['markdown' => ['html_input' => 'allow']]];
        yield 'bad mark colour' => [['markdown' => ['mark_colors' => ['Red!']]]];
        yield 'bad renderer icon' => [['markdown' => ['icons' => ['a b']]]];
        yield 'negative upload size' => [['profiles' => ['default' => ['upload_max_size' => -1]]]];
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
}
