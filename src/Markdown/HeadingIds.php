<?php

declare(strict_types=1);

namespace Nowo\MilkdownEditorBundle\Markdown;

use League\CommonMark\Event\DocumentParsedEvent;
use League\CommonMark\Extension\CommonMark\Node\Block\Heading;
use League\CommonMark\Extension\CommonMark\Node\Inline\Code;
use League\CommonMark\Node\Inline\Text;
use League\CommonMark\Node\Node;
use Normalizer;

use function class_exists;
use function count;
use function is_string;
use function mb_strlen;
use function mb_strtolower;
use function mb_substr;
use function preg_match;
use function preg_replace;
use function str_starts_with;
use function strlen;
use function substr;
use function trim;

/**
 * Heading ids (1.6, `markdown.heading_ids`): the same ids as the editor, prefixed with {@see self::PREFIX} so a heading
 * can never clobber a host element id or a global (DOM clobbering).
 *
 * Slug: the text in NFC (when `intl` is present), lower-case, every run of characters outside lower-case / other
 * letters, marks and digits becomes `-`, trimmed (a leading mark goes too), at most 80 characters, `section` when empty.
 * Only text and inline code count (mentions, page links and icons do not, as in the editor).
 *
 * 1.18: a heading may carry an explicit id, the `{#id}` suffix ({@see Parser\HeadingIdSuffixParser}). Every valid
 * explicit id is reserved first, in document order (the first occurrence wins); then each other heading takes its slug
 * (a repeated explicit id: its own value), or that value plus the lowest free `-N` ({@see self::resolve()}, linear). At
 * most {@see self::MAX_IDS} headings get an id. Ids follow {@see self::ANCHOR}, the grammar of `[[wiki:<uuid>#<id>]]`
 * too; a leading `nowo-h-` is read as the bare id.
 *
 * @author Héctor Franco Aceituno <hectorfranco@nowo.tech>
 */
final class HeadingIds
{
    public const PREFIX   = 'nowo-h-';
    public const MAX_SLUG = 80;

    /** 1.18: longest id in characters (a slug of 80 characters plus `-9999` fits). */
    public const MAX_ID = 90;

    /** 1.18: headings of one document that get an id (later ones have none). */
    public const MAX_IDS = 1000;

    /** 1.18: where {@see Parser\HeadingIdSuffixParser} keeps the explicit id of a heading (`$heading->data`). */
    public const DATA_KEY = 'nowo_heading_id';

    /**
     * 1.18: the canonical id grammar (PCRE with `/u`), shared with `[[wiki:<uuid>#<id>]]` and the editor
     * (`dialect/patterns.ts`). Linear: the repeated classes never match `-`, so no quantifier can backtrack into another.
     */
    public const ANCHOR = '[\p{Ll}\p{Lo}\p{Lm}\p{N}][\p{Ll}\p{Lo}\p{Lm}\p{M}\p{N}]*(?:-[\p{Ll}\p{Lo}\p{Lm}\p{M}\p{N}]+)*';

    /**
     * The slug of a heading text.
     *
     * @param string $text The heading's text
     */
    public static function slug(string $text): string
    {
        if (class_exists(Normalizer::class)) {
            $normal = Normalizer::normalize($text, Normalizer::FORM_C);
            $text   = is_string($normal) ? $normal : $text;
        }
        $slug = trim((string) preg_replace('/[^\p{Ll}\p{Lo}\p{Lm}\p{M}\p{N}]+/u', '-', mb_strtolower($text, 'UTF-8')), '-');
        $slug = (string) preg_replace('/^[\p{M}-]+/u', '', $slug);
        $slug = trim(mb_substr($slug, 0, self::MAX_SLUG, 'UTF-8'), '-');

        return $slug === '' ? 'section' : $slug;
    }

    /**
     * Unique slugs of headings in order (headings without explicit ids).
     *
     * @param list<string> $texts Heading texts in document order
     *
     * @return list<string>
     */
    public static function slugs(array $texts): array
    {
        $headings = [];
        foreach ($texts as $text) {
            $headings[] = ['text' => $text, 'explicit' => ''];
        }

        return self::resolve($headings);
    }

    /**
     * 1.18: whether `$id` is a valid bare id ({@see self::ANCHOR}, 1–90 characters).
     *
     * @param string $id A candidate id
     */
    public static function isValid(string $id): bool
    {
        return $id !== ''
            && strlen($id) <= self::MAX_ID * 4
            && mb_strlen($id, 'UTF-8') <= self::MAX_ID
            && preg_match('/^(?:' . self::ANCHOR . ')$/u', $id) === 1;
    }

    /**
     * 1.18: the bare id of an untrusted value (a token anchor, a suffix, an editor attribute): a leading `nowo-h-` is
     * dropped, and a value that is not a valid id gives `''`.
     *
     * @param string $value The value
     */
    public static function normalise(string $value): string
    {
        if (str_starts_with($value, self::PREFIX)) {
            $value = substr($value, strlen(self::PREFIX));
        }

        return self::isValid($value) ? $value : '';
    }

    /**
     * 1.18: unique ids of headings in document order. Valid explicit ids are reserved first (the first occurrence wins);
     * every other heading takes its slug (a repeated explicit id: its own value), or that value plus the lowest free `-N`.
     *
     * @param list<array{text: string, explicit: string}> $headings Text and explicit id (`''`: none) of each heading
     *
     * @return list<string>
     */
    public static function resolve(array $headings): array
    {
        $used     = [];
        $explicit = [];
        foreach ($headings as $i => $heading) {
            $id = self::normalise($heading['explicit']);
            if ($id !== '' && !isset($used[$id])) {
                $used[$id]    = true;
                $explicit[$i] = $id;
            }
        }
        $next = [];
        $out  = [];
        foreach ($headings as $i => $heading) {
            if (isset($explicit[$i])) {
                $out[] = $explicit[$i];
                continue;
            }
            $id        = self::normalise($heading['explicit']);
            $base      = $id !== '' ? $id : self::slug($heading['text']);
            $candidate = $base;
            while (isset($used[$candidate])) {
                $next[$base] ??= 2;
                $candidate = $base . '-' . $next[$base]++;
            }
            $used[$candidate] = true;
            $out[]            = $candidate;
        }

        return $out;
    }

    /**
     * 1.18: the text of a heading as its id sees it (text and inline code only).
     *
     * @param Node $heading A heading node
     */
    public static function text(Node $heading): string
    {
        $text = '';
        foreach ($heading->iterator() as $node) {
            if ($node instanceof Text || $node instanceof Code) {
                $text .= $node->getLiteral();
            }
        }

        return $text;
    }

    /**
     * 1.18: the explicit id the `{#id}` suffix gave a heading (`''`: none).
     *
     * @param Heading $heading The heading
     */
    public static function explicit(Heading $heading): string
    {
        $id = $heading->data->get(self::DATA_KEY, '');

        return is_string($id) ? $id : '';
    }

    /**
     * Sets the `id` of every heading of the parsed document (at most {@see self::MAX_IDS}).
     *
     * @param DocumentParsedEvent $event The parsed document
     */
    public function onDocumentParsed(DocumentParsedEvent $event): void
    {
        $headings = [];
        $input    = [];
        foreach ($event->getDocument()->iterator() as $node) {
            if ($node instanceof Heading) {
                $headings[] = $node;
                $input[]    = ['text' => self::text($node), 'explicit' => self::explicit($node)];
                if (count($headings) === self::MAX_IDS) {
                    break;
                }
            }
        }
        foreach (self::resolve($input) as $i => $id) {
            $headings[$i]->data->set('attributes/id', self::PREFIX . $id);
        }
    }
}
