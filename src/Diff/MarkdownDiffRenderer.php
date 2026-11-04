<?php

declare(strict_types=1);

namespace Nowo\MilkdownEditorBundle\Diff;

use Nowo\MilkdownEditorBundle\Markdown\DialectRenderer;
use Nowo\MilkdownEditorBundle\Markdown\MarkdownRendererInterface;
use Nowo\MilkdownEditorBundle\Markdown\MilkdownMarkdownRenderer;
use Symfony\Contracts\Translation\TranslatorInterface;

use function array_fill;
use function array_map;
use function array_pop;
use function count;
use function explode;
use function implode;
use function max;
use function min;
use function preg_match;
use function preg_split;
use function rtrim;
use function str_ends_with;
use function str_replace;
use function str_starts_with;
use function strlen;
use function trim;

use const PREG_SPLIT_DELIM_CAPTURE;
use const PREG_SPLIT_NO_EMPTY;

/**
 * Rendered, dialect-aware diff of two Markdown documents (1.6, contract section 8.2).
 *
 * 1. Each side is split into top-level blocks (blank-line separated; fenced code, `$$` math and `:::` containers
 *    kept whole; indented continuations stay with their block).
 * 2. Blocks are matched with an LCS over their normalised Markdown.
 * 3. Every block is rendered by the bundle's renderer (per-viewer resolvers, nothing cached here). A removed and an
 *    added block next to each other are shown as one *changed* block: an HTML-token LCS of their rendered HTML in
 *    which deleted words appear as text in `<del>` and all tags come from the new side, so nesting stays valid.
 *
 * Markup (stable, for sanitiser allow-lists): `div.nowo-md-diff[data-nowo-milkdown-diff]`, `h2.nowo-md-diff-summary`,
 * `div.nowo-md-diff-block[data-change=added|removed|changed]`, `ins.nowo-md-diff-ins`, `del.nowo-md-diff-del`,
 * `span.nowo-md-diff-sr` (visually hidden labels), and for the fallback `pre.nowo-md-diff-raw`.
 *
 * Limitations: blocks render one by one, so footnotes and reference-style links whose definition sits in another
 * block render as text.
 *
 * @author Héctor Franco Aceituno <hectorfranco@nowo.tech>
 */
final readonly class MarkdownDiffRenderer implements MarkdownDiffRendererInterface
{
    public const DOMAIN = 'NowoMilkdownEditorBundle';
    /** At most this many blocks per side are compared (otherwise the line fallback). */
    public const MAX_BLOCKS = 2000;
    /** More changed blocks than this → the line fallback. */
    public const MAX_CHANGED = 500;
    /** Token cap of the word-level diff of one changed block (otherwise removed + added). */
    public const MAX_TOKENS = 4000;
    /** Cells of one LCS table (memory bound); beyond it the middle part is shown as removed + added. */
    public const MAX_CELLS = 1_000_000;
    /**
     * Cells of all word-level LCS tables of one render (CPU bound, about 0.3 s per million cells): once spent, the
     * remaining changed blocks are shown whole as removed + added, which costs no table (audit DW-M1). Ordinary
     * edits use a few cells per block (common prefixes and suffixes are skipped before the table is built).
     */
    public const MAX_TOTAL_CELLS = 1_000_000;

    /**
     * @param MarkdownRendererInterface $renderer The bundle's renderer (per-viewer resolvers)
     * @param TranslatorInterface|null $translator Labels (`diff.*` keys)
     * @param int $maxInputLength Inputs longer than this (bytes) use the line fallback
     */
    public function __construct(
        private MarkdownRendererInterface $renderer,
        private ?TranslatorInterface $translator = null,
        private int $maxInputLength = MilkdownMarkdownRenderer::DEFAULT_MAX_INPUT_LENGTH,
    ) {
    }

    public function render(string $old, string $new): MarkdownDiff
    {
        $old = str_replace(["\r\n", "\r"], "\n", $old);
        $new = str_replace(["\r\n", "\r"], "\n", $new);
        if (strlen($old) > $this->maxInputLength || strlen($new) > $this->maxInputLength) {
            return $this->lines($old, $new);
        }
        $a = self::blocks($old);
        $b = self::blocks($new);
        if (count($a) > self::MAX_BLOCKS || count($b) > self::MAX_BLOCKS) {
            return $this->lines($old, $new);
        }
        $ops     = $this->merge(self::lcs(array_map($this->key(...), $a), array_map($this->key(...), $b)), $a, $b);
        $changes = 0;
        foreach ($ops as [$op]) {
            $changes += $op === '=' ? 0 : 1;
        }
        if ($changes > self::MAX_CHANGED) {
            return $this->lines($old, $new);
        }

        $html   = '';
        $budget = self::MAX_TOTAL_CELLS;
        foreach ($ops as [$op, $left, $right]) {
            $html .= match ($op) {
                '='     => $this->renderer->render($right),
                '+'     => $this->block('added', '<ins class="nowo-md-diff-ins">' . $this->renderer->render($right) . '</ins>'),
                '-'     => $this->block('removed', '<del class="nowo-md-diff-del">' . $this->renderer->render($left) . '</del>'),
                default => $this->changed($left, $right, $budget),
            };
        }

        return new MarkdownDiff($this->wrap($changes, $html), $changes, false);
    }

    /**
     * Top-level blocks of a Markdown document.
     *
     * @param string $markdown The Markdown (LF line endings)
     *
     * @return list<string>
     */
    public static function blocks(string $markdown): array
    {
        $blocks  = [];
        $current = [];
        $fence   = null;
        $depth   = 0;
        foreach (explode("\n", $markdown) as $line) {
            $trimmed = trim($line);
            if ($fence !== null) {
                $current[] = $line;
                if (str_starts_with($trimmed, $fence) && trim($trimmed, $fence[0]) === '') {
                    $fence = null;
                }
                continue;
            }
            if (preg_match('/^(`{3,}|~{3,}|\$\$)/', $trimmed, $m) === 1 && $depth === 0) {
                $current[] = $line;
                $fence     = $m[1];
                if ($m[1] === '$$' && strlen($trimmed) > 2 && str_ends_with($trimmed, '$$')) {
                    $fence = null;
                }
                continue;
            }
            if (preg_match('/^(:{3,})(.*)$/', $trimmed, $m) === 1) {
                $depth += trim($m[2]) === '' && $depth > 0 ? -1 : 1;
                $current[] = $line;
                continue;
            }
            if ($trimmed === '' && $depth === 0) {
                if ($current !== []) {
                    $blocks[] = implode("\n", $current);
                    $current  = [];
                }
                continue;
            }
            if ($current === [] && $blocks !== [] && preg_match('/^( {2,}|\t)\S/', $line) === 1) {
                // An indented continuation (list item paragraph, nested list): stays with the previous block.
                $current = [...explode("\n", $blocks[count($blocks) - 1]), '', $line];
                array_pop($blocks);
                continue;
            }
            $current[] = $line;
        }
        if ($current !== []) {
            $blocks[] = implode("\n", $current);
        }

        return $blocks;
    }

    private function key(string $block): string
    {
        return implode("\n", array_map(static fn (string $l): string => rtrim($l), explode("\n", trim($block))));
    }

    /**
     * LCS edit script: `=` keep, `-` delete from a, `+` insert from b.
     *
     * @param list<string> $a Old tokens
     * @param list<string> $b New tokens
     *
     * @return list<array{string, int, int}> Operation, index in a, index in b
     */
    public static function lcs(array $a, array $b): array
    {
        $n             = count($a);
        $m             = count($b);
        [$start, $end] = self::common($a, $b);
        $rows          = $n - $start - $end;
        $cols          = $m - $start - $end;
        if ($rows * $cols > self::MAX_CELLS) {
            $ops = [];
            for ($k = 0; $k < $start; ++$k) {
                $ops[] = ['=', $k, $k];
            }
            for ($k = 0; $k < $rows; ++$k) {
                $ops[] = ['-', $start + $k, -1];
            }
            for ($k = 0; $k < $cols; ++$k) {
                $ops[] = ['+', -1, $start + $k];
            }
            for ($k = 0; $k < $end; ++$k) {
                $ops[] = ['=', $n - $end + $k, $m - $end + $k];
            }

            return $ops;
        }
        $table = array_fill(0, $rows + 1, array_fill(0, $cols + 1, 0));
        for ($i = $rows - 1; $i >= 0; --$i) {
            for ($j = $cols - 1; $j >= 0; --$j) {
                $table[$i][$j] = $a[$start + $i] === $b[$start + $j] ? $table[$i + 1][$j + 1] + 1 : max($table[$i + 1][$j], $table[$i][$j + 1]);
            }
        }
        $ops = [];
        for ($k = 0; $k < $start; ++$k) {
            $ops[] = ['=', $k, $k];
        }
        $i = $j = 0;
        while ($i < $rows || $j < $cols) {
            if ($i < $rows && $j < $cols && $a[$start + $i] === $b[$start + $j]) {
                $ops[] = ['=', $start + $i++, $start + $j++];
            } elseif ($i < $rows && ($j === $cols || $table[$i + 1][$j] >= $table[$i][$j + 1])) {
                // Deletions before insertions: "old → new" reads naturally.
                $ops[] = ['-', $start + $i++, -1];
            } else {
                $ops[] = ['+', -1, $start + $j++];
            }
        }
        for ($k = 0; $k < $end; ++$k) {
            $ops[] = ['=', $n - $end + $k, $m - $end + $k];
        }

        return $ops;
    }

    /**
     * Cells of the table `lcs()` builds for these sequences (common prefix and suffix excluded; 0 above MAX_CELLS,
     * where no table is built).
     *
     * @param list<string> $a Old tokens
     * @param list<string> $b New tokens
     */
    public static function cells(array $a, array $b): int
    {
        [$start, $end] = self::common($a, $b);
        $cells         = (count($a) - $start - $end) * (count($b) - $start - $end);

        return $cells > self::MAX_CELLS ? 0 : $cells;
    }

    /**
     * Lengths of the common prefix and suffix (most edits touch a small part of a document).
     *
     * @param list<string> $a Old tokens
     * @param list<string> $b New tokens
     *
     * @return array{int, int}
     */
    private static function common(array $a, array $b): array
    {
        $n     = count($a);
        $m     = count($b);
        $start = 0;
        while ($start < $n && $start < $m && $a[$start] === $b[$start]) {
            ++$start;
        }
        $end = 0;
        while ($end < $n - $start && $end < $m - $start && $a[$n - 1 - $end] === $b[$m - 1 - $end]) {
            ++$end;
        }

        return [$start, $end];
    }

    /**
     * Turns the block script into render operations; a run of deletions followed by a run of insertions is paired
     * into *changed* blocks (the extras stay removed / added).
     *
     * @param list<array{string, int, int}> $ops The LCS script
     * @param list<string> $a Old blocks
     * @param list<string> $b New blocks
     *
     * @return list<array{string, string, string}> Operation (`=`, `+`, `-`, `~`), old block, new block
     */
    private function merge(array $ops, array $a, array $b): array
    {
        $out     = [];
        $removed = [];
        $added   = [];
        foreach ($ops as [$op, $i, $j]) {
            if ($op === '=') {
                $out     = [...$out, ...$this->pairs($removed, $added, $a, $b), ['=', $a[$i], $b[$j]]];
                $removed = [];
                $added   = [];
            } elseif ($op === '-') {
                $removed[] = $i;
            } else {
                $added[] = $j;
            }
        }

        return [...$out, ...$this->pairs($removed, $added, $a, $b)];
    }

    /**
     * Pairs a run of removed blocks with the following run of added blocks.
     *
     * @param list<int> $removed Indexes in a
     * @param list<int> $added Indexes in b
     * @param list<string> $a Old blocks
     * @param list<string> $b New blocks
     *
     * @return list<array{string, string, string}>
     */
    private function pairs(array $removed, array $added, array $a, array $b): array
    {
        $out   = [];
        $pairs = min(count($removed), count($added));
        foreach ($removed as $k => $i) {
            $out[] = $k < $pairs ? ['~', $a[$i], $b[$added[$k]]] : ['-', $a[$i], ''];
        }
        foreach ($added as $k => $j) {
            if ($k >= $pairs) {
                $out[] = ['+', '', $b[$j]];
            }
        }

        return $out;
    }

    /**
     * A changed block: word-level diff of the rendered HTML (tags from the new side only).
     *
     * @param int $budget LCS cells left for this render; the table built here is taken from it
     */
    private function changed(string $old, string $new, int &$budget): string
    {
        $left  = self::tokens($this->renderer->render($old));
        $right = self::tokens($this->renderer->render($new));
        $cells = count($left) > self::MAX_TOKENS || count($right) > self::MAX_TOKENS ? 0 : self::cells($left, $right);
        if ($cells > $budget) {
            $budget = 0; // spent: every later changed block is shown whole (cheap, no table)
        }
        if ($budget === 0 || count($left) > self::MAX_TOKENS || count($right) > self::MAX_TOKENS) {
            return $this->block('removed', '<del class="nowo-md-diff-del">' . implode('', $left) . '</del>')
                . $this->block('added', '<ins class="nowo-md-diff-ins">' . implode('', $right) . '</ins>');
        }
        // Runs of inserted / deleted words; equal tokens and new-side tags are literal ('').
        /** @var list<array{string, string}> $parts */
        $parts = [];
        $budget -= $cells;
        foreach (self::lcs($left, $right) as [$op, $i, $j]) {
            $token = $op === '-' ? $left[$i] : $right[$j];
            $tag   = str_starts_with($token, '<');
            if ($op === '-' && $tag) {
                continue;
            }
            $kind = $op === '=' || $tag ? '' : $op;
            $last = count($parts) - 1;
            if ($kind !== '' && $last >= 0 && $parts[$last][0] === $kind) {
                $parts[$last][1] .= $token;
            } else {
                $parts[] = [$kind, $token];
            }
        }
        $html = '';
        foreach ($parts as [$kind, $text]) {
            $html .= match ($kind) {
                ''      => $text,
                '+'     => '<ins class="nowo-md-diff-ins"><span class="nowo-md-diff-sr">' . $this->label('diff.inserted', 'Inserted:') . ' </span>' . $text . '</ins>',
                default => '<del class="nowo-md-diff-del"><span class="nowo-md-diff-sr">' . $this->label('diff.deleted', 'Deleted:') . ' </span>' . $text . '</del>',
            };
        }

        return $this->block('changed', $html);
    }

    /**
     * HTML split into tags, words and whitespace (the renderer's output: text is already escaped).
     *
     * @return list<string>
     */
    public static function tokens(string $html): array
    {
        /* @var list<string> */
        return preg_split('/(<[^>]*>|\s+)/', $html, -1, PREG_SPLIT_DELIM_CAPTURE | PREG_SPLIT_NO_EMPTY) ?: [];
    }

    private function block(string $change, string $html): string
    {
        $start = match ($change) {
            'added'   => $this->label('diff.block_added', 'Added block:'),
            'removed' => $this->label('diff.block_removed', 'Removed block:'),
            default   => $this->label('diff.block_changed', 'Changed block:'),
        };

        return '<div class="nowo-md-diff-block" data-change="' . $change . '"><span class="nowo-md-diff-sr">' . $start . '</span>'
            . $html . '<span class="nowo-md-diff-sr">' . $this->label('diff.end', 'End of change.') . '</span></div>';
    }

    private function wrap(int $changes, string $html): string
    {
        $summary = $changes === 0
            ? $this->label('diff.none', 'No changes')
            : DialectRenderer::e(str_replace('{count}', (string) $changes, $this->translator?->trans('diff.summary', [], self::DOMAIN) ?? '{count} changes'));

        $nav = ' data-previous="' . $this->label('diff.previous', 'Previous change') . '" data-next="' . $this->label('diff.next', 'Next change')
            . '" data-position="' . $this->label('diff.position', 'Change {index} of {count}') . '"';

        return '<div class="nowo-md nowo-md-diff" data-nowo-milkdown-diff' . $nav . '><h2 class="nowo-md-diff-summary">' . $summary . '</h2>' . $html . '</div>';
    }

    private function label(string $key, string $fallback): string
    {
        $text = $this->translator?->trans($key, [], self::DOMAIN);

        return DialectRenderer::e($text === null || $text === $key ? $fallback : $text);
    }

    /** Escaped line diff (inputs too large or too different). */
    private function lines(string $old, string $new): MarkdownDiff
    {
        $a       = explode("\n", $old);
        $b       = explode("\n", $new);
        $ops     = self::lcs($a, $b);
        $out     = '';
        $changes = 0;
        foreach ($ops as [$op, $i, $j]) {
            $line = DialectRenderer::e($op === '-' ? $a[$i] : $b[$j]);
            $out .= match ($op) {
                '='     => '  ' . $line . "\n",
                '+'     => '<ins class="nowo-md-diff-ins"><span class="nowo-md-diff-sr">' . $this->label('diff.inserted', 'Inserted:') . ' </span>+ ' . $line . "</ins>\n",
                default => '<del class="nowo-md-diff-del"><span class="nowo-md-diff-sr">' . $this->label('diff.deleted', 'Deleted:') . ' </span>- ' . $line . "</del>\n",
            };
            $changes += $op === '=' ? 0 : 1;
        }

        return new MarkdownDiff($this->wrap($changes, '<pre class="nowo-md-diff-raw">' . $out . '</pre>'), $changes, true);
    }
}
