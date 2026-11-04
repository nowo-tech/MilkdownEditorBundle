<?php

declare(strict_types=1);

namespace Nowo\MilkdownEditorBundle\Tests\Unit\Diff;

use Nowo\MilkdownEditorBundle\Diff\MarkdownDiffRenderer;
use Nowo\MilkdownEditorBundle\Markdown\MarkdownRendererInterface;
use Nowo\MilkdownEditorBundle\Markdown\MilkdownMarkdownRenderer;
use Nowo\MilkdownEditorBundle\Markdown\Resolver\AllowlistIconResolver;
use Nowo\MilkdownEditorBundle\Markdown\Resolver\NullPageResolver;
use Nowo\MilkdownEditorBundle\Markdown\Resolver\NullUserResolver;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Symfony\Contracts\Translation\TranslatorInterface;

use function strlen;

final class MarkdownDiffRendererTest extends TestCase
{
    private function renderer(): MarkdownRendererInterface
    {
        return new MilkdownMarkdownRenderer([], new NullPageResolver(), new NullUserResolver(), new AllowlistIconResolver(), secret: 's');
    }

    #[Test]
    public function identicalDocumentsHaveNoChanges(): void
    {
        $diff = (new MarkdownDiffRenderer($this->renderer()))->render("# T\n\nText\n", "# T\r\n\r\nText\r\n");
        self::assertSame(0, $diff->changes);
        self::assertFalse($diff->fallback);
        self::assertStringContainsString('<h2 class="nowo-md-diff-summary">No changes</h2>', $diff->html);
        self::assertStringStartsWith('<div class="nowo-md nowo-md-diff" data-nowo-milkdown-diff data-previous="Previous change" data-next="Next change" data-position="Change {index} of {count}">', $diff->html);
        self::assertStringNotContainsString('data-change', $diff->html);
    }

    #[Test]
    public function itMarksAddedRemovedAndChangedBlocks(): void
    {
        $old  = "# Title\n\nKeep this.\n\nThe quick brown fox.\n\nGone paragraph.\n\n```js\nconst a = 1;\n\nconst b = 2;\n```\n";
        $new  = "# Title\n\nKeep this.\n\nThe quick red fox jumps.\n\n```js\nconst a = 1;\n\nconst b = 2;\n```\n\nNew <b>end</b>.\n";
        $diff = (new MarkdownDiffRenderer($this->renderer()))->render($old, $new);
        self::assertSame(3, $diff->changes);
        self::assertStringContainsString('3 changes', $diff->html);
        self::assertStringContainsString('data-change="changed"', $diff->html);
        self::assertStringContainsString('<del class="nowo-md-diff-del"><span class="nowo-md-diff-sr">Deleted: </span>brown</del>', $diff->html);
        self::assertStringContainsString('<ins class="nowo-md-diff-ins"><span class="nowo-md-diff-sr">Inserted: </span>red</ins>', $diff->html);
        self::assertStringContainsString('jumps.', $diff->html);
        self::assertStringContainsString('<div class="nowo-md-diff-block" data-change="removed"><span class="nowo-md-diff-sr">Removed block:</span><del class="nowo-md-diff-del"><p>Gone paragraph.</p>', $diff->html);
        self::assertStringContainsString('data-change="added"', $diff->html);
        // Raw HTML stays escaped; the code block (with a blank line) is one unchanged block.
        self::assertStringContainsString('&lt;b&gt;end&lt;/b&gt;', $diff->html);
        self::assertStringNotContainsString('<b>', $diff->html);
        self::assertSame(1, substr_count($diff->html, '<pre>'));
    }

    #[Test]
    public function blocksKeepFencesContainersMathAndContinuations(): void
    {
        self::assertSame(
            ['# H', "::: info\nA\n\nB\n:::", "\$\$\nx\n\ny\n\$\$", '$$x$$', "- one\n\n  more", "~~~\n\n~~~", 'end'],
            MarkdownDiffRenderer::blocks("# H\n\n::: info\nA\n\nB\n:::\n\n\$\$\nx\n\ny\n\$\$\n\n\$\$x\$\$\n\n- one\n\n  more\n\n~~~\n\n~~~\n\nend"),
        );
        self::assertSame([], MarkdownDiffRenderer::blocks("\n\n"));
    }

    #[Test]
    public function lcsUsesPrefixSuffixAndCapsTheTable(): void
    {
        self::assertSame([['=', 0, 0], ['-', 1, -1], ['+', -1, 1], ['=', 2, 2]], MarkdownDiffRenderer::lcs(['a', 'b', 'c'], ['a', 'x', 'c']));
        self::assertSame([['+', -1, 0]], MarkdownDiffRenderer::lcs([], ['a']));
        $a   = array_map(static fn (int $i): string => 'a' . $i, range(1, 1001));
        $b   = array_map(static fn (int $i): string => 'b' . $i, range(1, 1001));
        $ops = MarkdownDiffRenderer::lcs($a, $b);
        self::assertCount(2002, $ops);
        self::assertSame(['-', 0, -1], $ops[0]);
        self::assertSame(['+', -1, 0], $ops[1001]);
        // Common prefix and suffix around a middle too large for the table.
        $ops = MarkdownDiffRenderer::lcs(['p', ...$a, 's'], ['p', ...$b, 's']);
        self::assertSame(['=', 0, 0], $ops[0]);
        self::assertSame(['=', 1002, 1002], $ops[2003]);
    }

    #[Test]
    public function removedFormattingKeepsTheNewTagsOnly(): void
    {
        $diff = (new MarkdownDiffRenderer(self::renderer()))->render('a **b** c', 'a b c');
        self::assertStringNotContainsString('<strong>', $diff->html);
        self::assertStringContainsString('data-change="changed"', $diff->html);
    }

    #[Test]
    public function largeOrVeryDifferentInputsFallBackToAnEscapedLineDiff(): void
    {
        $small = new MarkdownDiffRenderer($this->renderer(), null, 20);
        $diff  = $small->render("line one\n<script>x</script>", "line one\nline two and more");
        self::assertTrue($diff->fallback);
        self::assertSame(2, $diff->changes);
        self::assertStringContainsString('<pre class="nowo-md-diff-raw">', $diff->html);
        self::assertStringContainsString('- &lt;script&gt;x&lt;/script&gt;</del>', $diff->html);
        self::assertStringContainsString('+ line two and more</ins>', $diff->html);

        $old = implode("\n\n", array_map(static fn (int $i): string => 'old ' . $i, range(1, 600)));
        $new = implode("\n\n", array_map(static fn (int $i): string => 'new ' . $i, range(1, 600)));
        self::assertTrue((new MarkdownDiffRenderer($this->renderer()))->render($old, $new)->fallback);
        $many = implode("\n\n", array_fill(0, MarkdownDiffRenderer::MAX_BLOCKS + 1, 'x'));
        self::assertTrue((new MarkdownDiffRenderer($this->renderer(), null, 10_000_000))->render($many, 'x')->fallback);
    }

    #[Test]
    public function hugeChangedBlocksAreShownAsRemovedAndAdded(): void
    {
        $old  = implode(' ', array_map(static fn (int $i): string => 'w' . $i, range(1, 2100)));
        $new  = implode(' ', array_map(static fn (int $i): string => 'v' . $i, range(1, 2100)));
        $diff = (new MarkdownDiffRenderer($this->renderer()))->render($old, $new);
        self::assertStringContainsString('data-change="removed"', $diff->html);
        self::assertStringContainsString('data-change="added"', $diff->html);
        self::assertStringNotContainsString('data-change="changed"', $diff->html);
    }

    /** Audit DW-M1 PoC: ~100 paragraphs of ~1 000 tokens whose words all differ, inside max_input_length. */
    #[Test]
    public function oneRenderHasAWorkBudgetAcrossAllChangedBlocks(): void
    {
        $doc = static fn (string $word): string => implode("\n\n", array_map(static fn (int $b): string => 'p' . $b . ' ' . implode(' ', array_fill(0, 495, $word)), range(0, 96))) . "\n";
        $old = $doc('a');
        $new = $doc('b');
        self::assertLessThan(MilkdownMarkdownRenderer::DEFAULT_MAX_INPUT_LENGTH, strlen($new));
        $start = microtime(true);
        $diff  = (new MarkdownDiffRenderer($this->renderer()))->render($old, $new);
        self::assertLessThan(1.0, microtime(true) - $start);
        self::assertFalse($diff->fallback);
        self::assertSame(97, $diff->changes);
        // The first pair fits the budget (word level); the rest are shown whole as removed + added.
        self::assertSame(1, substr_count($diff->html, 'data-change="changed"'));
        self::assertSame(96, substr_count($diff->html, 'data-change="removed"'));
        self::assertSame(96, substr_count($diff->html, 'data-change="added"'));
        self::assertStringContainsString('p96 b b', $diff->html);

        // Ordinary edits (one word per paragraph) keep the word-level view for every block.
        $edited = (string) preg_replace('/^(p\d+) a/m', '$1 z', $old);
        $normal = (new MarkdownDiffRenderer($this->renderer()))->render($old, $edited);
        self::assertSame(97, substr_count($normal->html, 'data-change="changed"'));
    }

    #[Test]
    public function cellsCountsTheTableWithoutPrefixAndSuffix(): void
    {
        self::assertSame(2, MarkdownDiffRenderer::cells(['a', 'x', 'y', 'b'], ['a', 'z', 'b']));
        self::assertSame(0, MarkdownDiffRenderer::cells(['a'], ['a']));
        $big = array_map(static fn (int $i): string => 'x' . $i, range(1, 1001));
        self::assertSame(0, MarkdownDiffRenderer::cells($big, array_map(static fn (string $t): string => $t . 'y', $big)));
    }

    #[Test]
    public function labelsAreTranslatedAndEscaped(): void
    {
        $translator = $this->createStub(TranslatorInterface::class);
        $translator->method('trans')->willReturnCallback(static fn (string $id): string => match ($id) {
            'diff.summary'  => '{count} <cambios>',
            'diff.inserted' => 'Insertado:',
            default         => $id,
        });
        $diff = (new MarkdownDiffRenderer($this->renderer(), $translator))->render('a', 'b');
        self::assertStringContainsString('1 &lt;cambios&gt;', $diff->html);
        self::assertStringContainsString('Insertado: ', $diff->html);
        self::assertStringContainsString('Deleted: ', $diff->html);
    }
}
