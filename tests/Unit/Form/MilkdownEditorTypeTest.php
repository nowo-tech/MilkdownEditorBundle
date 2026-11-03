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
use Symfony\Component\Form\Extension\Validator\ValidatorExtension;
use Symfony\Component\Form\PreloadedExtension;
use Symfony\Component\Form\Test\TypeTestCase;
use Symfony\Component\OptionsResolver\Exception\InvalidOptionsException;
use Symfony\Component\Validator\Constraints\NotBlank;
use Symfony\Component\Validator\Validation;

final class MilkdownEditorTypeTest extends TypeTestCase
{
    private const PROFILE = ['features' => ['toolbar'], 'theme' => 'dark', 'min_height' => '10rem', 'icon_sprite_url' => null, 'icons' => [], 'upload_max_size' => 5, 'upload_accept' => ['image/*'], 'mention_display' => 'handle'];

    protected function getExtensions(): array
    {
        $nonce = new class implements CspNonceProviderInterface {
            public function getNonce(): string
            {
                return 'abc';
            }
        };

        return [
            new PreloadedExtension([new MilkdownEditorType(new ProfileRegistry(['default' => self::PROFILE, 'wiki' => ['features' => ['code_mirror', 'math']] + self::PROFILE], 'default'), $nonce, null, 10)], []),
            new ValidatorExtension(Validation::createValidator()),
        ];
    }

    /**
     * Appendix CE M1: oversized Markdown is rejected when it is written (bytes, default `max_input_length`).
     */
    #[Test]
    public function aLengthConstraintMatchesTheRendererLimit(): void
    {
        $form = $this->factory->create(MilkdownEditorType::class);
        $form->submit('ééééé!');
        self::assertFalse($form->isValid());
        $form = $this->factory->create(MilkdownEditorType::class);
        $form->submit('short');
        self::assertTrue($form->isValid());

        $form = $this->factory->create(MilkdownEditorType::class, null, ['max_length' => 3, 'constraints' => new NotBlank()]);
        $form->submit('');
        self::assertFalse($form->isValid());
        $form = $this->factory->create(MilkdownEditorType::class, null, ['max_length' => 3, 'constraints' => [new NotBlank()]]);
        $form->submit('abcd');
        self::assertFalse($form->isValid());

        $form = $this->factory->create(MilkdownEditorType::class, null, ['max_length' => null]);
        $form->submit(str_repeat('x', 50));
        self::assertTrue($form->isValid());

        $this->expectException(InvalidOptionsException::class);
        $this->factory->create(MilkdownEditorType::class, null, ['max_length' => 0]);
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
        self::assertArrayNotHasKey('nonce', $o); // Appendix CE I2: the script's nonce property is read instead
        self::assertSame('abc', $view->vars['milkdown_nonce']);
        self::assertTrue($o['readonly']);
        self::assertSame('', $o['label']);
        self::assertSame(['url' => '/up', 'csrfToken' => null, 'maxSize' => 5, 'accept' => ['image/*']], $o['upload']);
        self::assertSame(['url' => '/c', 'hubUrl' => '/hub', 'topic' => 't', 'user' => ['name' => 'Ada', 'color' => '#123456']], $o['collaboration']);
        self::assertEquals((object) [], $o['messages']);
        self::assertArrayNotHasKey('mentionDisplay', $o); // 1.2.1 keys only when set: default JSON unchanged
        self::assertArrayNotHasKey('userTitleUrl', $o);
        self::assertSame('milkdown_editor', (new MilkdownEditorType(new ProfileRegistry(['default' => self::PROFILE], 'default')))->getBlockPrefix());
        self::assertSame(TextareaType::class, (new MilkdownEditorType(new ProfileRegistry(['default' => self::PROFILE], 'default')))->getParent());
    }

    #[Test]
    public function mentionsCanShowNames(): void
    {
        $o = $this->factory->create(MilkdownEditorType::class, null, ['mention_display' => 'name', 'user_title_url' => '/api/users/names'])->createView()->vars['milkdown_options'];
        self::assertIsArray($o);
        self::assertSame('name', $o['mentionDisplay']);
        self::assertSame('/api/users/names', $o['userTitleUrl']);

        $this->expectException(InvalidOptionsException::class);
        $this->factory->create(MilkdownEditorType::class, null, ['mention_display' => 'email']);
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
        self::assertSame('x', $view->vars['milkdown_nonce']);
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
        yield 'block drag without block actions' => [['features' => ['block_drag']], 'needs "block_actions"'];
        yield 'insert menu without context menu' => [['features' => ['insert_menu']], 'needs "context_menu"'];
        yield 'bad min height' => [['min_height' => 'big'], 'CSS length'];
        yield 'bad icon' => [['icons' => ['Bad Name']], 'Invalid icon name'];
        yield 'unknown trigger' => [['suggestions' => ['#' => '/x']], 'Unknown suggestion trigger "#"'];
        yield 'empty url' => [['suggestions' => ['@' => '']], 'needs a candidate URL'];
        yield 'collaboration without topic' => [['collaboration' => ['url' => '/c', 'hub_url' => '/h']], 'non-empty "topic"'];
        yield 'collaboration update delay too long' => [['collaboration' => ['url' => '/c', 'hub_url' => '/h', 'topic' => 't', 'update_delay_ms' => 2001]], 'collaboration.update_delay_ms'];
        yield 'collaboration update cap too small' => [['collaboration' => ['url' => '/c', 'hub_url' => '/h', 'topic' => 't', 'max_update_bytes' => 100]], 'from 1024 to 67108864'];
        yield 'collaboration awareness delay not an int' => [['collaboration' => ['url' => '/c', 'hub_url' => '/h', 'topic' => 't', 'awareness_delay_ms' => '500']], 'collaboration.awareness_delay_ms'];
        yield 'collaboration negative delay' => [['collaboration' => ['url' => '/c', 'hub_url' => '/h', 'topic' => 't', 'update_delay_ms' => -1]], 'from 0 to 2000.'];
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
        self::assertSame(
            ['url' => '/c', 'hubUrl' => '/h', 'topic' => 't', 'user' => ['name' => 'Anonymous', 'color' => '#1f6f54'], 'updateDelay' => 150, 'awarenessDelay' => 1000, 'maxUpdateBytes' => 131072],
            MilkdownEditorType::normaliseCollaboration(['url' => '/c', 'hub_url' => '/h', 'topic' => 't', 'update_delay_ms' => 150, 'awareness_delay_ms' => 1000, 'max_update_bytes' => 131072]),
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
