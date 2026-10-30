<?php

declare(strict_types=1);

namespace Nowo\MilkdownEditorBundle\Tests\Unit\Markdown;

use InvalidArgumentException;
use League\CommonMark\Node\Inline\Text;
use League\CommonMark\Renderer\ChildNodeRendererInterface;
use Nowo\MilkdownEditorBundle\Markdown\DialectRenderer;
use Nowo\MilkdownEditorBundle\Markdown\Directive\DirectiveAttributes;
use Nowo\MilkdownEditorBundle\Markdown\Directive\DirectiveRendererInterface;
use Nowo\MilkdownEditorBundle\Markdown\DocumentProcessor;
use Nowo\MilkdownEditorBundle\Markdown\MilkdownMarkdownRenderer;
use Nowo\MilkdownEditorBundle\Markdown\Node\LeafDirective;
use Nowo\MilkdownEditorBundle\Markdown\Parser\TextDirectiveParser;
use Nowo\MilkdownEditorBundle\Markdown\Resolver\AllowlistIconResolver;
use Nowo\MilkdownEditorBundle\Markdown\Resolver\NullPageResolver;
use Nowo\MilkdownEditorBundle\Markdown\Resolver\NullUserResolver;
use Nowo\MilkdownEditorBundle\Markdown\Resolver\PageResolverInterface;
use Nowo\MilkdownEditorBundle\Markdown\Resolver\ResolvedPage;
use Nowo\MilkdownEditorBundle\Markdown\Resolver\ResolvedUser;
use Nowo\MilkdownEditorBundle\Markdown\Resolver\UserResolverInterface;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Psr\Log\AbstractLogger;
use RuntimeException;
use Stringable;
use Symfony\Contracts\Translation\TranslatorInterface;

use function is_string;

final class RendererTest extends TestCase
{
    private const ID     = '0b6f4f0e-3c55-4d0a-9a43-1f7a2c9e8d10';
    private const HIDDEN = 'c0ffee00-1234-4abc-8def-001122334455';

    /** @var list<array<int, string>> */
    private array $pageCalls = [];

    /**
     * @param array{html_input?: string, allow_remote_images?: bool, math?: bool, max_input_length?: int} $options
     * @param list<DirectiveRendererInterface> $directives
     */
    private function renderer(array $options = [], array $directives = [], ?PageResolverInterface $pages = null, ?UserResolverInterface $users = null, ?AbstractLogger $logger = null, ?TranslatorInterface $translator = null): MilkdownMarkdownRenderer
    {
        $test = $this;
        $pages ??= new class($test) implements PageResolverInterface {
            public function __construct(private readonly RendererTest $test)
            {
            }

            public function resolvePages(array $ids): array
            {
                $this->test->recordPageCall($ids);

                return [RendererTest::id() => new ResolvedPage('Install <guide>', '/wiki/install')];
            }
        };
        $users ??= new class implements UserResolverInterface {
            public function resolveUsers(array $handles): array
            {
                return ['ada' => new ResolvedUser('Ada Lovelace', '/users/ada'), 'grace' => new ResolvedUser('Grace'), 'evil' => new ResolvedUser('Evil', 'javascript:alert(1)')];
            }
        };

        return new MilkdownMarkdownRenderer(
            $options + ['mark_colors' => ['yellow', 'green']],
            $pages,
            $users,
            new AllowlistIconResolver('/sprite.svg', ['bug']),
            $directives,
            $translator,
            $logger,
        );
    }

    /**
     * @param array<int, string> $ids
     */
    public function recordPageCall(array $ids): void
    {
        $this->pageCalls[] = $ids;
    }

    public static function id(): string
    {
        return self::ID;
    }

    /**
     * @return iterable<string, array{string, string}>
     */
    public static function cases(): iterable
    {
        $id = self::ID;
        yield 'page link' => ["See [[wiki:{$id}#setup]].", '<p>See <a class="nowo-md-ref" href="/wiki/install#setup">Install &lt;guide&gt; › setup</a>.</p>'];
        yield 'hidden page' => ['[[wiki:' . self::HIDDEN . ']]', '<p><span class="nowo-md-ref nowo-md-ref--hidden">Content not visible</span></p>'];
        yield 'mentions' => ['Hi @ada, (@grace) @nobody @evil mail ada@example.com', '<p>Hi <a class="nowo-md-mention" href="/users/ada" title="Ada Lovelace">@ada</a>, (<span class="nowo-md-mention" title="Grace">@grace</span>) @nobody <span class="nowo-md-mention" title="Evil">@evil</span> mail <a href="mailto:ada@example.com">ada@example.com</a></p>'];
        yield 'icons' => [':tabler-bug: :tabler-unknown:', '<p><svg class="nowo-md-icon" role="img" aria-label="bug"><use href="/sprite.svg#tabler-bug"></use></svg> :tabler-unknown:</p>'];
        yield 'mark' => ['A :mark[*hot* [x]]{color=green} :mark[b]{color=red} :note[c]', '<p>A <mark class="nowo-md-mark nowo-md-mark--green"><em>hot</em> [x]</mark> <mark class="nowo-md-mark nowo-md-mark--yellow">b</mark> <span class="nowo-md-directive" data-directive="note">c</span></p>'];
        yield 'unclosed text directive' => [':mark[open', '<p>:mark[open</p>'];
        yield 'callout' => [":::callout{type=\"warning\"}\n**Careful**\n:::", '<div class="nowo-md-callout nowo-md-callout--warning" role="note"><p><strong>Careful</strong></p></div>'];
        yield 'callout default type' => [":::callout{type=x}\nA\n:::", '<div class="nowo-md-callout nowo-md-callout--info" role="note"><p>A</p></div>'];
        yield 'details' => [":::details{summary=\"More <b>\"}\nHidden\n:::", '<details class="nowo-md-details"><summary>More &lt;b&gt;</summary><p>Hidden</p></details>'];
        yield 'details label' => [":::details[Label]\nX\n:::", '<details class="nowo-md-details"><summary>Label</summary><p>X</p></details>'];
        yield 'details empty' => [":::details\nX\n:::", '<details class="nowo-md-details"><summary>…</summary><p>X</p></details>'];
        yield 'nameless align' => ["::: {align=center}\nMid\n:::", '<div class="nowo-md-align nowo-md-align--center"><p>Mid</p></div>'];
        yield 'align default' => [":::align{align=up}\nX\n:::", '<div class="nowo-md-align nowo-md-align--left"><p>X</p></div>'];
        yield 'unknown container' => [":::foo\nX\n:::", '<div class="nowo-md-directive" data-directive="foo"><p>X</p></div>'];
        yield 'nested containers' => ["::::callout\nA\n:::details\nB\n:::\n::::", "<div class=\"nowo-md-callout nowo-md-callout--info\" role=\"note\"><p>A</p>\n<details class=\"nowo-md-details\"><summary>…</summary><p>B</p></details></div>"];
        yield 'bare fence is text' => [":::\nX", "<p>:::\nX</p>"];
        yield 'leaf default' => ['::embed{id=1}', '<div class="nowo-md-directive nowo-md-directive--leaf" data-directive="embed"></div>'];
        yield 'math' => ['Euler $e^{i\pi}+1=0$ costs $5 and $10', '<p>Euler <span class="nowo-md-math" data-math="inline">e^{i\pi}+1=0</span> costs $5 and $10</p>'];
        yield 'math block' => ["\$\$\n\\int_0^1 x<y\n\$\$", '<div class="nowo-md-math" data-math="block">\int_0^1 x&lt;y</div>'];
        yield 'glued at sign is text' => ['user@ada x', '<p>user@ada x</p>'];
        yield 'indented fence is code' => ['    :::callout', "<pre><code>:::callout\n</code></pre>"];
        yield 'double dollar inline is text' => ['a $$b$ c', '<p>a $$b$ c</p>'];
        yield 'raw html escaped' => ['<script>alert(1)</script>', '&lt;script&gt;alert(1)&lt;/script&gt;'];
        yield 'unsafe link dropped' => ['[x](javascript:alert(1))', '<p><a>x</a></p>'];
        yield 'remote image becomes a link' => ['![pixel](https://evil.example/p.png "t")', '<p><a href="https://evil.example/p.png" title="t">pixel</a></p>'];
        yield 'local image kept' => ['![a](/files/a.png)', '<p><img src="/files/a.png" alt="a" /></p>'];
        yield 'code keeps tokens' => ['`@ada [[wiki:' . self::ID . ']]`', '<p><code>@ada [[wiki:' . self::ID . ']]</code></p>'];
        yield 'mermaid fence' => ["```mermaid\ngraph TD\n```", "<pre><code class=\"language-mermaid\">graph TD\n</code></pre>"];
        yield 'gfm' => ["| a |\n|---|\n| b |\n\n- [x] done", "<table>\n<thead>\n<tr>\n<th>a</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td>b</td>\n</tr>\n</tbody>\n</table>\n<ul>\n<li><input checked=\"\" disabled=\"\" type=\"checkbox\"> done</li>\n</ul>"];
    }

    #[Test]
    #[DataProvider('cases')]
    public function itRendersTheDialect(string $markdown, string $html): void
    {
        self::assertSame($html, trim($this->renderer()->render($markdown)));
    }

    #[Test]
    public function pagesAreResolvedInOneBatchPerDocument(): void
    {
        $this->renderer()->render('[[wiki:' . self::ID . ']] [[wiki:' . self::ID . ']] [[wiki:' . self::HIDDEN . ']] text');
        self::assertSame([[self::ID, self::HIDDEN]], $this->pageCalls);
    }

    #[Test]
    public function optionsChangeTheOutput(): void
    {
        $r = $this->renderer(['math' => false, 'allow_remote_images' => true, 'html_input' => 'strip', 'max_input_length' => 30]);
        self::assertSame('<p>$a$</p>', trim($r->render('$a$')));
        self::assertSame('$$', explode("\n", trim($r->render("\$\$\nx\n\$\$")))[0] === '<p>$$' ? '$$' : 'x');
        self::assertSame('<p><img src="https://x.example/a.png" alt="a" /></p>', trim($r->render('![a](https://x.example/a.png)')));
        self::assertSame('<p>a</p>', trim($r->render('a<b>')));
        self::assertSame("<p>&lt;b&gt;<br>\n" . str_repeat('x', 30) . '</p>', $r->render("<b>\r\n" . str_repeat('x', 30)));
    }

    #[Test]
    public function aFailingResolverIsLoggedAndRendersHidden(): void
    {
        $logger = new class extends AbstractLogger {
            /** @var list<string> */
            public array $lines = [];

            public function log($level, string|Stringable $message, array $context = []): void
            {
                $this->lines[] = (is_string($level) ? $level : '') . ' ' . (is_string($context['kind'] ?? null) ? $context['kind'] : '');
            }
        };
        $pages = new class implements PageResolverInterface {
            public function resolvePages(array $ids): array
            {
                throw new RuntimeException('db down');
            }
        };
        $users = new class implements UserResolverInterface {
            public function resolveUsers(array $handles): array
            {
                throw new RuntimeException('db down');
            }
        };
        $translator = new class implements TranslatorInterface {
            /**
             * @param array<string, mixed> $parameters
             */
            public function trans(string $id, array $parameters = [], ?string $domain = null, ?string $locale = null): string
            {
                return 'No visible';
            }

            public function getLocale(): string
            {
                return 'es';
            }
        };
        $html = $this->renderer([], [], $pages, $users, $logger, $translator)->render('[[wiki:' . self::ID . ']] @ada');
        self::assertSame('<p><span class="nowo-md-ref nowo-md-ref--hidden">No visible</span> @ada</p>', trim($html));
        self::assertSame(['warning page', 'warning user'], $logger->lines);
    }

    #[Test]
    public function hostDirectiveRenderersArePreparedInOneBatch(): void
    {
        $issue = new class implements DirectiveRendererInterface {
            /** @var list<list<string>> */
            public array $prepared = [];

            public function supports(string $name): bool
            {
                return $name === 'beacon';
            }

            public function prepare(array $nodes): void
            {
                $this->prepared[] = array_map(static fn (LeafDirective $n): string => $n->attributes['id'] ?? '', $nodes);
            }

            public function render(LeafDirective $node): string
            {
                return '<div class="issue">' . DialectRenderer::e($node->label . '#' . ($node->attributes['id'] ?? '')) . '</div>';
            }
        };
        $html = $this->renderer([], [$issue])->render("::beacon[Bug]{type=issue id=1}\n\n::beacon{#2 .a .b}\n\n::other");
        self::assertSame("<div class=\"issue\">Bug#1</div>\n<div class=\"issue\">#2</div>\n<div class=\"nowo-md-directive nowo-md-directive--leaf\" data-directive=\"other\"></div>", trim($html));
        self::assertSame([['1', '2']], $issue->prepared);
    }

    #[Test]
    public function rendererRejectsForeignNodesAndNullResolversHideEverything(): void
    {
        $renderer = new DialectRenderer(new AllowlistIconResolver());
        try {
            $renderer->render(new Text('x'), $this->createStub(ChildNodeRendererInterface::class));
            self::fail('expected exception');
        } catch (InvalidArgumentException $e) {
            self::assertStringContainsString('Unsupported node', $e->getMessage());
        }
        $html = (new MilkdownMarkdownRenderer([], new NullPageResolver(), new NullUserResolver(), new AllowlistIconResolver()))->render('[[wiki:' . self::ID . ']] @ada :tabler-bug:');
        self::assertSame('<p><span class="nowo-md-ref nowo-md-ref--hidden">Content not visible</span> @ada :tabler-bug:</p>', trim($html));
        $pages = new class implements PageResolverInterface {
            public function resolvePages(array $ids): array
            {
                return [RendererTest::id() => new ResolvedPage('T', 'javascript:x')];
            }
        };
        self::assertSame('<p><span class="nowo-md-ref">T</span></p>', trim($this->renderer([], [], $pages)->render('[[wiki:' . self::ID . ']]')));
        $badSprite = new MilkdownMarkdownRenderer([], new NullPageResolver(), new NullUserResolver(), new AllowlistIconResolver('javascript:x', ['bug']));
        self::assertSame('<p>:tabler-bug:</p>', trim($badSprite->render(':tabler-bug:')));
    }

    /**
     * @return iterable<string, array{string, string}>
     */
    public static function urls(): iterable
    {
        yield 'relative' => ['/a', '/a'];
        yield 'dot' => ['./a', './a'];
        yield 'plain' => ['a/b', 'a/b'];
        yield 'https' => ['https://x', 'https://x'];
        yield 'javascript' => ['javascript:alert(1)', ''];
        yield 'obfuscated' => ["java\nscript:x", ''];
        yield 'data' => ['data:text/html,x', ''];
        yield 'protocol relative' => ['//evil', ''];
        yield 'backslash relative' => ['/\\evil', ''];
        yield 'query colon' => ['/a?b=c:d', '/a?b=c:d'];
    }

    #[Test]
    #[DataProvider('urls')]
    public function safeUrl(string $in, string $out): void
    {
        self::assertSame($out, DialectRenderer::safeUrl($in));
    }

    #[Test]
    public function hostileInputStaysFastAndBounded(): void
    {
        $r     = $this->renderer();
        $start = microtime(true);
        $html  = $r->render(str_repeat(':a[', 10000));
        self::assertStringStartsWith('<p>:a[', $html);
        $nested = $r->render(str_repeat(':a[', 30) . 'x' . str_repeat(']', 30));
        self::assertStringContainsString('x', $nested);
        self::assertSame(8, substr_count($nested, 'data-directive="a"'));
        $r->render(':::' . str_repeat(' ', 5000) . '!' . "\n" . str_repeat(":::callout\n", 200));
        $long = $r->render(':mark[' . str_repeat('x', 3000) . ']');
        self::assertStringNotContainsString('<mark', $long);
        // Attributes never span lines: the mark keeps its default colour and the braces stay text.
        self::assertStringContainsString('nowo-md-mark--yellow">a</mark>{color=', $r->render(":mark[a]{color=\ngreen}"));
        self::assertLessThan(5.0, microtime(true) - $start);
    }

    /**
     * @return iterable<string, array{string, bool}>
     */
    public static function imageUrls(): iterable
    {
        yield 'relative' => ['/a.png', false];
        yield 'plain' => ['a.png', false];
        yield 'http without slashes' => ['http:evil.example/p.png', true];
        yield 'protocol relative' => ['//evil.example/p.png', true];
        yield 'backslash' => ['/\\evil.example/p.png', true];
        yield 'data image' => ['data:image/png;base64,AA', false];
        yield 'data other' => ['data:text/html,x', true];
    }

    #[Test]
    #[DataProvider('imageUrls')]
    public function remoteImages(string $url, bool $remote): void
    {
        self::assertSame($remote, DocumentProcessor::isRemote($url));
    }

    #[Test]
    public function attributesAndBrackets(): void
    {
        self::assertSame(['id' => 'x', 'class' => 'a b', 'k' => 'v w', 'q' => 'it is', 'bare' => '', 'n' => '1'], DirectiveAttributes::parse("#x .a .b k=\"v w\" q='it is' bare n=1"));
        self::assertSame(['a' => '1'], DirectiveAttributes::parse('a=1 = junk'));
        self::assertCount(20, DirectiveAttributes::parse(implode(' ', array_map(static fn (int $i): string => "k{$i}=1", range(1, 30)))));
        self::assertSame(500, mb_strlen(DirectiveAttributes::parse('a=' . str_repeat('é', 600))['a']));
        self::assertSame(5, TextDirectiveParser::closingBracket('[a]\]]', 0));
        self::assertNull(TextDirectiveParser::closingBracket("a\n]", 0));
        self::assertNull(TextDirectiveParser::closingBracket('abc', 0));
    }
}
