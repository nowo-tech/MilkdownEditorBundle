<?php

declare(strict_types=1);

namespace Nowo\MilkdownEditorBundle\Tests\Unit\Form;

use Nowo\MilkdownEditorBundle\Csp\CspNonceProviderInterface;
use Nowo\MilkdownEditorBundle\Feature;
use Nowo\MilkdownEditorBundle\Form\DataTransformer\MarkdownNewlineTransformer;
use Nowo\MilkdownEditorBundle\Form\MilkdownEditorType;
use Nowo\MilkdownEditorBundle\ProfileRegistry;
use Nowo\MilkdownEditorBundle\Theme;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\Test;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\PreloadedExtension;
use Symfony\Component\Form\Test\TypeTestCase;
use Symfony\Component\OptionsResolver\Exception\InvalidOptionsException;

final class MilkdownEditorTypeTest extends TypeTestCase
{
    private const PROFILE = ['features' => ['toolbar'], 'theme' => 'dark', 'min_height' => '10rem', 'icon_sprite_url' => null, 'icons' => [], 'upload_max_size' => 5, 'upload_accept' => ['image/*']];

    protected function getExtensions(): array
    {
        $nonce = new class implements CspNonceProviderInterface {
            public function getNonce(): string
            {
                return 'abc';
            }
        };

        return [new PreloadedExtension([new MilkdownEditorType(new ProfileRegistry(['default' => self::PROFILE, 'wiki' => ['features' => ['code_mirror', 'math']] + self::PROFILE], 'default'), $nonce)], [])];
    }

    #[Test]
    public function itUsesTheProfileAndNoTranslator(): void
    {
        $view = $this->factory->create(MilkdownEditorType::class, null, [
            'upload_url'    => '/up',
            'collaboration' => ['url' => '/c', 'hub_url' => '/hub', 'topic' => 't', 'user' => ['name' => 'Ada', 'color' => '#123456']],
            'disabled'      => true,
            'label'         => false,
        ])->createView();
        /** @var array<string, mixed> $o */
        $o = $view->vars['milkdown_options'];
        self::assertSame(['toolbar'], $o['features']);
        self::assertSame('dark', $o['theme']);
        self::assertSame('abc', $o['nonce']);
        self::assertTrue($o['readonly']);
        self::assertSame('', $o['label']);
        self::assertSame(['url' => '/up', 'csrfToken' => null, 'maxSize' => 5, 'accept' => ['image/*']], $o['upload']);
        self::assertSame(['url' => '/c', 'hubUrl' => '/hub', 'topic' => 't', 'user' => ['name' => 'Ada', 'color' => '#123456']], $o['collaboration']);
        self::assertEquals((object) [], $o['messages']);
        self::assertSame('milkdown_editor', (new MilkdownEditorType(new ProfileRegistry(['default' => self::PROFILE], 'default')))->getBlockPrefix());
        self::assertSame(TextareaType::class, (new MilkdownEditorType(new ProfileRegistry(['default' => self::PROFILE], 'default')))->getParent());
    }

    #[Test]
    public function optionsOverrideTheProfile(): void
    {
        $view = $this->factory->create(MilkdownEditorType::class, null, [
            'profile'     => 'wiki',
            'features'    => [Feature::CodeMirror, 'mermaid', 'code_mirror'],
            'icons'       => ['bug', 'bug', 'alert-triangle'],
            'csp_nonce'   => 'x',
            'min_height'  => '20px',
            'placeholder' => 'Type',
        ])->createView();
        /** @var array<string, mixed> $o */
        $o = $view->vars['milkdown_options'];
        self::assertSame(['code_mirror', 'mermaid'], $o['features']);
        self::assertSame(['bug', 'alert-triangle'], $o['icons']);
        self::assertSame('x', $o['nonce']);
        self::assertSame('20px', $o['minHeight']);
        self::assertSame('Type', $o['placeholder']);
        self::assertNull($o['upload']);
    }

    /**
     * @return iterable<string, array{array<string, mixed>, string}>
     */
    public static function invalidOptions(): iterable
    {
        yield 'unknown profile' => [['profile' => 'x'], 'Unknown Milkdown editor profile "x"'];
        yield 'unknown feature' => [['features' => ['emoji']], 'Unknown Milkdown editor feature "emoji"'];
        yield 'non-string feature' => [['features' => [1]], 'Unknown Milkdown editor feature "int"'];
        yield 'math without code mirror' => [['features' => ['math']], 'needs "code_mirror"'];
        yield 'bad min height' => [['min_height' => 'big'], 'CSS length'];
        yield 'bad icon' => [['icons' => ['Bad Name']], 'Invalid icon name'];
        yield 'unknown trigger' => [['suggestions' => ['#' => '/x']], 'Unknown suggestion trigger "#"'];
        yield 'empty url' => [['suggestions' => ['@' => '']], 'needs a candidate URL'];
        yield 'collaboration without topic' => [['collaboration' => ['url' => '/c', 'hub_url' => '/h']], 'non-empty "topic"'];
        yield 'bad theme' => [['theme' => 'blue'], 'theme'];
    }

    /**
     * @param array<string, mixed> $options
     */
    #[Test]
    #[DataProvider('invalidOptions')]
    public function invalidOptionsAreRejected(array $options, string $message): void
    {
        $this->expectException(InvalidOptionsException::class);
        $this->expectExceptionMessage($message);
        $this->factory->create(MilkdownEditorType::class, null, $options);
    }

    #[Test]
    public function collaborationDefaults(): void
    {
        self::assertSame(
            ['url' => '/c', 'hubUrl' => '/h', 'topic' => 't', 'user' => ['name' => 'Anonymous', 'color' => '#1f6f54']],
            MilkdownEditorType::normaliseCollaboration(['url' => '/c', 'hub_url' => '/h', 'topic' => 't', 'user' => ['color' => 'red']]),
        );
    }

    #[Test]
    public function newlineTransformerAndEnums(): void
    {
        $t = new MarkdownNewlineTransformer();
        self::assertSame('', $t->transform(null));
        self::assertSame("a\r\n", $t->transform("a\r\n"));
        self::assertNull($t->reverseTransform(null));
        self::assertSame("a\nb", $t->reverseTransform("a\r\nb"));
        self::assertSame(['light', 'dark', 'auto'], Theme::values());
        self::assertContains('slash_menu', Feature::values());
        self::assertTrue(Feature::Mermaid->needsCodeMirror());
        self::assertFalse(Feature::Table->needsCodeMirror());
    }
}
