<?php

declare(strict_types=1);

namespace Nowo\MilkdownEditorBundle\Comment;

use JsonException;

use function is_array;
use function is_int;
use function is_string;
use function json_decode;
use function json_encode;
use function preg_match;
use function preg_match_all;
use function sprintf;
use function str_contains;
use function strlen;

use const JSON_THROW_ON_ERROR;
use const JSON_UNESCAPED_SLASHES;
use const JSON_UNESCAPED_UNICODE;

/**
 * A comment anchor (1.6, contract v1): where an inline comment thread points in a document. The editor creates and
 * resolves anchors; hosts store them as opaque JSON and validate them with this class before storing (same caps and
 * test vectors as the editor's `parseCommentAnchor()`). Unknown keys are dropped.
 *
 * Lengths are UTF-16 code units, like JavaScript string lengths.
 *
 * @author Héctor Franco Aceituno <hectorfranco@nowo.tech>
 */
final readonly class CommentAnchor
{
    public const VERSION         = 1;
    public const MAX_EXACT       = 4096;
    public const MAX_CONTEXT     = 32;
    public const MAX_POSITION    = 10_000_000;
    public const MAX_BLOCK_INDEX = 100_000;
    public const MAX_HEADING     = 200;
    public const MAX_BYTES       = 16384;
    private const BASE64         = '/^[A-Za-z0-9+\/]{4,512}={0,2}\z/'; // \z: no trailing newline (audit DW-L2)

    /**
     * @param string $exact Quoted text (canonical text, not Markdown)
     * @param string $prefix Up to 32 code units before it
     * @param string $suffix Up to 32 code units after it
     * @param int $start Start offset in the canonical text
     * @param int $end End offset (exclusive)
     * @param int $blockIndex Top-level block holding the start
     * @param string|null $heading Text of the nearest heading before the start
     * @param string|null $yjsStart Base64 Yjs relative position of the start (null without collaboration)
     * @param string|null $yjsEnd Base64 Yjs relative position of the end
     */
    private function __construct(
        public string $exact,
        public string $prefix,
        public string $suffix,
        public int $start,
        public int $end,
        public int $blockIndex,
        public ?string $heading,
        public ?string $yjsStart,
        public ?string $yjsEnd,
    ) {
    }

    /**
     * Validates a decoded anchor.
     *
     * @param mixed $value The decoded JSON
     *
     * @throws InvalidCommentAnchorException When any field breaks the contract
     */
    public static function fromArray(mixed $value): self
    {
        if (!is_array($value) || array_is_list($value) || ($value['v'] ?? null) !== self::VERSION) {
            throw new InvalidCommentAnchorException('Unsupported comment anchor version.');
        }
        $quote    = self::map($value['quote'] ?? null, 'quote');
        $position = self::map($value['position'] ?? null, 'position');
        $block    = self::map($value['block'] ?? null, 'block');

        $exact  = self::text($quote['exact'] ?? null, 1, self::MAX_EXACT, 'quote.exact');
        $prefix = self::text($quote['prefix'] ?? null, 0, self::MAX_CONTEXT, 'quote.prefix');
        $suffix = self::text($quote['suffix'] ?? null, 0, self::MAX_CONTEXT, 'quote.suffix');
        $start  = self::int($position['start'] ?? null, self::MAX_POSITION, 'position.start');
        $end    = self::int($position['end'] ?? null, self::MAX_POSITION, 'position.end');
        if ($start >= $end || $end - $start !== self::length($exact)) {
            throw new InvalidCommentAnchorException('The anchor position does not match the quote.');
        }
        $index   = self::int($block['index'] ?? null, self::MAX_BLOCK_INDEX, 'block.index');
        $heading = ($block['heading'] ?? null) === null ? null : self::text($block['heading'], 1, self::MAX_HEADING, 'block.heading');

        $yjsStart = $yjsEnd = null;
        if (($value['yjs'] ?? null) !== null) {
            $yjs      = self::map($value['yjs'], 'yjs');
            $yjsStart = self::base64($yjs['start'] ?? null, 'yjs.start');
            $yjsEnd   = self::base64($yjs['end'] ?? null, 'yjs.end');
        }

        $anchor = new self($exact, $prefix, $suffix, $start, $end, $index, $heading, $yjsStart, $yjsEnd);
        if (strlen($anchor->toJson()) > self::MAX_BYTES) {
            throw new InvalidCommentAnchorException('The comment anchor is larger than 16 KiB.');
        }

        return $anchor;
    }

    /**
     * Validates an anchor in JSON.
     *
     * @param string $json The JSON
     *
     * @throws InvalidCommentAnchorException When the JSON is invalid or any field breaks the contract
     */
    public static function fromJson(string $json): self
    {
        if (strlen($json) > self::MAX_BYTES * 2) {
            throw new InvalidCommentAnchorException('The comment anchor is too large.');
        }
        try {
            $value = json_decode($json, true, 8, JSON_THROW_ON_ERROR);
        } catch (JsonException $e) {
            throw new InvalidCommentAnchorException('The comment anchor is not valid JSON.', 0, $e);
        }

        return self::fromArray($value);
    }

    /**
     * The normalised anchor (only contract keys).
     *
     * @return array{v: int, quote: array{exact: string, prefix: string, suffix: string}, position: array{start: int, end: int}, block: array{index: int, heading: string|null}, yjs: array{start: string, end: string}|null}
     */
    public function toArray(): array
    {
        return [
            'v'        => self::VERSION,
            'quote'    => ['exact' => $this->exact, 'prefix' => $this->prefix, 'suffix' => $this->suffix],
            'position' => ['start' => $this->start, 'end' => $this->end],
            'block'    => ['index' => $this->blockIndex, 'heading' => $this->heading],
            'yjs'      => $this->yjsStart !== null && $this->yjsEnd !== null ? ['start' => $this->yjsStart, 'end' => $this->yjsEnd] : null,
        ];
    }

    /**
     * The normalised anchor as JSON (what hosts store).
     */
    public function toJson(): string
    {
        return json_encode($this->toArray(), JSON_THROW_ON_ERROR | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    }

    /**
     * Length in UTF-16 code units (JavaScript `string.length`) of valid UTF-8, or -1 for invalid UTF-8.
     *
     * @param string $value The text
     */
    public static function length(string $value): int
    {
        $chars = preg_match_all('/./su', $value);
        if ($chars === false) {
            return -1;
        }

        return $chars + (int) preg_match_all('/[\x{10000}-\x{10FFFF}]/u', $value);
    }

    /**
     * @return array<string, mixed>
     */
    private static function map(mixed $value, string $field): array
    {
        if (!is_array($value) || ($value !== [] && array_is_list($value))) {
            throw new InvalidCommentAnchorException(sprintf('The anchor field "%s" must be an object.', $field));
        }

        $map = [];
        foreach ($value as $key => $item) {
            $map[(string) $key] = $item;
        }

        return $map;
    }

    private static function text(mixed $value, int $min, int $max, string $field): string
    {
        $length = is_string($value) ? self::length($value) : -1;
        if (!is_string($value) || $length < $min || $length > $max || str_contains($value, "\0")) {
            throw new InvalidCommentAnchorException(sprintf('The anchor field "%s" must be text of %d to %d characters.', $field, $min, $max));
        }

        return $value;
    }

    private static function int(mixed $value, int $max, string $field): int
    {
        if (!is_int($value) || $value < 0 || $value > $max) {
            throw new InvalidCommentAnchorException(sprintf('The anchor field "%s" must be an integer from 0 to %d.', $field, $max));
        }

        return $value;
    }

    private static function base64(mixed $value, string $field): string
    {
        if (!is_string($value) || preg_match(self::BASE64, $value) !== 1) {
            throw new InvalidCommentAnchorException(sprintf('The anchor field "%s" must be base64.', $field));
        }

        return $value;
    }
}
