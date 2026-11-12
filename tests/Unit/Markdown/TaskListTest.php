<?php

declare(strict_types=1);

namespace Nowo\MilkdownEditorBundle\Tests\Unit\Markdown;

use DOMDocument;
use DOMElement;
use InvalidArgumentException;
use League\CommonMark\Node\Inline\Text;
use League\CommonMark\Renderer\ChildNodeRendererInterface;
use Nowo\MilkdownEditorBundle\Markdown\MilkdownMarkdownRenderer;
use Nowo\MilkdownEditorBundle\Markdown\Resolver\AllowlistIconResolver;
use Nowo\MilkdownEditorBundle\Markdown\Resolver\NullPageResolver;
use Nowo\MilkdownEditorBundle\Markdown\Resolver\NullUserResolver;
use Nowo\MilkdownEditorBundle\Markdown\TaskItemRenderer;
use Nowo\MilkdownEditorBundle\Markdown\TaskMarkerRenderer;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Symfony\Contracts\Translation\TranslatorInterface;

use function array_diff;
use function libxml_use_internal_errors;

/**
 * 1.17 (Wiki UX review item 8): task items are rendered with the read-only editor's markup, and the checkbox is the only
 * `<input>` the renderer can emit, with a fixed attribute set.
 */
final class TaskListTest extends TestCase
{
    /**
     * @param array{html_input?: string} $options
     */
    private function render(string $markdown, array $options = [], ?TranslatorInterface $translator = null): string
    {
        return trim((new MilkdownMarkdownRenderer($options, new NullPageResolver(), new NullUserResolver(), new AllowlistIconResolver(), translator: $translator, secret: 's'))->render($markdown));
    }

    /**
     * @return iterable<string, array{string, string}>
     */
    public static function markup(): iterable
    {
        $box  = '<input type="checkbox" class="nowo-milkdown-task__box" disabled="" aria-label="Done">';
        $done = '<input type="checkbox" class="nowo-milkdown-task__box" disabled="" checked="" aria-label="Done">';

        yield 'tight' => [
            "- [ ] todo\n- [x] done",
            "<ul>\n<li class=\"nowo-milkdown-task\" data-checked=\"false\">{$box}<div class=\"nowo-milkdown-task__content\">todo</div></li>\n"
            . "<li class=\"nowo-milkdown-task\" data-checked=\"true\">{$done}<div class=\"nowo-milkdown-task__content\">done</div></li>\n</ul>",
        ];
        yield 'loose' => [
            "- [ ] one\n\n- [x] two",
            "<ul>\n<li class=\"nowo-milkdown-task\" data-checked=\"false\">{$box}<div class=\"nowo-milkdown-task__content\">\n<p>one</p>\n</div></li>\n"
            . "<li class=\"nowo-milkdown-task\" data-checked=\"true\">{$done}<div class=\"nowo-milkdown-task__content\">\n<p>two</p>\n</div></li>\n</ul>",
        ];
        yield 'inline first' => [
            '- [ ] **bold** rest',
            "<ul>\n<li class=\"nowo-milkdown-task\" data-checked=\"false\">{$box}<div class=\"nowo-milkdown-task__content\"><strong>bold</strong> rest</div></li>\n</ul>",
        ];
        yield 'nested and plain siblings' => [
            "1. [x] parent\n   - child\n2. plain",
            "<ol>\n<li class=\"nowo-milkdown-task\" data-checked=\"true\">{$done}<div class=\"nowo-milkdown-task__content\">parent\n<ul>\n<li>child</li>\n</ul>\n</div></li>\n<li>plain</li>\n</ol>",
        ];
        yield 'brackets later stay text' => ['- item [x] here', "<ul>\n<li>item [x] here</li>\n</ul>"];
        yield 'not in a list' => ['[x] alone', '<p>[x] alone</p>'];
    }

    #[Test]
    #[DataProvider('markup')]
    public function taskItemsUseTheEditorMarkup(string $markdown, string $html): void
    {
        self::assertSame($html, $this->render($markdown));
    }

    /**
     * @return iterable<string, array{string, array{html_input?: string}}>
     */
    public static function hostile(): iterable
    {
        yield 'raw input after the marker' => ['- [ ] <input type="checkbox" onclick="alert(1)" name="x" value="y" form="f">', []];
        yield 'raw input as an item' => ["- <input type=checkbox checked onfocus=alert(1) autofocus>\n- [x] ok", []];
        yield 'raw input, stripped' => ['- [x] <input type="checkbox" onclick="alert(1)"><img src=x onerror=alert(1)>', ['html_input' => 'strip']];
        yield 'attribute breakout in text' => ['- [x] x" onmouseover="alert(1)', []];
        yield 'attribute block syntax' => ["- [ ] task\n  {onclick=alert(1) .evil}", []];
        yield 'link in the item' => ['- [ ] [go](javascript:alert(1))', []];
        yield 'nested markers' => ["- [ ] a\n  - [x] b\n    - [ ] <script>alert(1)</script>", []];
    }

    /**
     * @param array{html_input?: string} $options
     */
    #[Test]
    #[DataProvider('hostile')]
    public function theOnlyInputIsTheDisabledCheckbox(string $markdown, array $options): void
    {
        $html = $this->render($markdown, $options);
        self::assertDoesNotMatchRegularExpression('/<(script|img)\b/i', $html);
        self::assertStringNotContainsString('href="javascript:', $html);

        $doc = $this->parse($html);
        foreach ($doc->getElementsByTagName('*') as $element) {
            foreach ($element->attributes ?? [] as $attribute) {
                self::assertStringStartsNotWith('on', $attribute->name, 'no event handler on <' . $element->tagName . '>');
            }
        }
        $inputs = $this->inputs($html);
        self::assertNotSame([], $inputs);
        foreach ($inputs as $input) {
            $names = [];
            foreach ($input->attributes as $attribute) {
                $names[] = $attribute->name;
            }
            self::assertSame([], array_diff($names, TaskMarkerRenderer::CHECKBOX_ATTRIBUTES), 'no attribute outside the allowlist');
            self::assertSame('checkbox', $input->getAttribute('type'));
            self::assertTrue($input->hasAttribute('disabled'));
            self::assertSame('nowo-milkdown-task__box', $input->getAttribute('class'));
            self::assertSame('', $input->getAttribute('disabled'));
        }
    }

    #[Test]
    public function aHostileTranslationStaysInsideTheLabel(): void
    {
        $translator = new class implements TranslatorInterface {
            /**
             * @param array<string, mixed> $parameters
             */
            public function trans(string $id, array $parameters = [], ?string $domain = null, ?string $locale = null): string
            {
                return '"><script>alert(1)</script><input onclick="x';
            }

            public function getLocale(): string
            {
                return 'en';
            }
        };
        $html = $this->render('- [x] done', [], $translator);
        self::assertStringNotContainsString('<script', $html);
        $inputs = $this->inputs($html);
        self::assertCount(1, $inputs);
        self::assertSame('"><script>alert(1)</script><input onclick="x', $inputs[0]->getAttribute('aria-label'));
        self::assertFalse($inputs[0]->hasAttribute('onclick'));
    }

    #[Test]
    public function aPlainItemIsLeftToCommonMark(): void
    {
        self::assertSame("<ul>\n<li>\n<p>a</p>\n<p>b</p>\n</li>\n</ul>", $this->render("- a\n\n  b"));
        self::assertSame("<ul>\n<li></li>\n</ul>", $this->render('-'));
    }

    #[Test]
    public function theRendererRejectsOtherNodes(): void
    {
        $this->expectException(InvalidArgumentException::class);
        (new TaskItemRenderer())->render(new Text('x'), $this->createStub(ChildNodeRendererInterface::class));
    }

    /**
     * @return list<DOMElement>
     */
    private function inputs(string $html): array
    {
        $inputs = [];
        foreach ($this->parse($html)->getElementsByTagName('input') as $input) {
            $inputs[] = $input;
        }

        return $inputs;
    }

    private function parse(string $html): DOMDocument
    {
        $doc      = new DOMDocument();
        $previous = libxml_use_internal_errors(true);
        $doc->loadHTML('<!doctype html><html><body>' . $html . '</body></html>');
        libxml_use_internal_errors($previous);

        return $doc;
    }
}
