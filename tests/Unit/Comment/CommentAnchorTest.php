<?php

declare(strict_types=1);

namespace Nowo\MilkdownEditorBundle\Tests\Unit\Comment;

use Nowo\MilkdownEditorBundle\Comment\CommentAnchor;
use Nowo\MilkdownEditorBundle\Comment\InvalidCommentAnchorException;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;

use function strlen;

use const JSON_THROW_ON_ERROR;

final class CommentAnchorTest extends TestCase
{
    /**
     * @return array<string, array{mixed, mixed}>
     */
    public static function valid(): array
    {
        $out = [];
        foreach (self::vectors()['valid'] as $case) {
            $out[$case['name']] = [$case['anchor'], $case['normalised']];
        }

        return $out;
    }

    /**
     * @return array<string, array{mixed}>
     */
    public static function invalid(): array
    {
        $out = [];
        foreach (self::vectors()['invalid'] as $case) {
            $out[$case['name']] = [$case['anchor']];
        }

        return $out;
    }

    #[Test]
    #[DataProvider('valid')]
    public function itAcceptsTheSharedValidVectors(mixed $anchor, mixed $normalised): void
    {
        self::assertSame($normalised, CommentAnchor::fromArray($anchor)->toArray());
        self::assertSame($normalised, CommentAnchor::fromJson(json_encode($anchor, JSON_THROW_ON_ERROR))->toArray());
    }

    #[Test]
    #[DataProvider('invalid')]
    public function itRejectsTheSharedInvalidVectors(mixed $anchor): void
    {
        $this->expectException(InvalidCommentAnchorException::class);
        CommentAnchor::fromArray($anchor);
    }

    #[Test]
    public function itCountsUtf16CodeUnitsLikeJavaScript(): void
    {
        self::assertSame(2, CommentAnchor::length("\u{1F600}"));
        self::assertSame(3, CommentAnchor::length('añ中'));
        self::assertSame(-1, CommentAnchor::length("\xff"));
        $exact  = str_repeat("\u{1F600}", 2048);
        $anchor = CommentAnchor::fromArray(['v' => 1, 'quote' => ['exact' => $exact, 'prefix' => '', 'suffix' => ''], 'position' => ['start' => 0, 'end' => 4096], 'block' => ['index' => 0, 'heading' => null]]);
        self::assertSame($exact, $anchor->exact);
        self::assertNull($anchor->yjsStart);
        self::assertStringContainsString('"yjs":null', $anchor->toJson());
    }

    #[Test]
    public function itRejectsInvalidUtf8AndBadJson(): void
    {
        foreach (['{"v":1', '[1,2]', str_repeat(' ', 40000), '{"v":1,"quote":{"exact":"\ud800","prefix":"","suffix":""}}'] as $json) {
            try {
                CommentAnchor::fromJson($json);
                self::fail('accepted ' . substr($json, 0, 20));
            } catch (InvalidCommentAnchorException) {
                self::addToAssertionCount(1);
            }
        }
        $this->expectException(InvalidCommentAnchorException::class);
        CommentAnchor::fromArray(['v' => 1, 'quote' => ['exact' => "\xff\xfe", 'prefix' => '', 'suffix' => ''], 'position' => ['start' => 0, 'end' => 2], 'block' => ['index' => 0, 'heading' => null]]);
    }

    #[Test]
    public function itRejectsAnchorsOverSixteenKibibytes(): void
    {
        // 4096 three-byte characters (12 KiB) + 200 + 64 more: still valid; the cap is checked on the normalised JSON.
        $ok = CommentAnchor::fromArray(['v' => 1, 'quote' => ['exact' => str_repeat('中', 4096), 'prefix' => str_repeat('中', 32), 'suffix' => str_repeat('中', 32)], 'position' => ['start' => 0, 'end' => 4096], 'block' => ['index' => 0, 'heading' => str_repeat('中', 200)], 'yjs' => ['start' => str_repeat('A', 512), 'end' => str_repeat('A', 512)]]);
        self::assertGreaterThan(12288, strlen($ok->toJson()));
        self::assertLessThanOrEqual(CommentAnchor::MAX_BYTES, strlen($ok->toJson()));
        // Control characters are escaped as \u00XX (6 bytes each) in JSON, on both sides.
        $this->expectException(InvalidCommentAnchorException::class);
        CommentAnchor::fromArray(['v' => 1, 'quote' => ['exact' => str_repeat("\x01", 4096), 'prefix' => '', 'suffix' => ''], 'position' => ['start' => 0, 'end' => 4096], 'block' => ['index' => 0, 'heading' => null]]);
    }

    /**
     * @return array{valid: list<array{name: string, anchor: mixed, normalised: mixed}>, invalid: list<array{name: string, anchor: mixed}>}
     */
    private static function vectors(): array
    {
        /** @var array{valid: list<array{name: string, anchor: mixed, normalised: mixed}>, invalid: list<array{name: string, anchor: mixed}>} $vectors */
        $vectors = json_decode((string) file_get_contents(__DIR__ . '/../../Fixtures/comment-anchors.json'), true, 16, JSON_THROW_ON_ERROR);

        return $vectors;
    }
}
