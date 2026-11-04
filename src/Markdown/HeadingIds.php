<?php

declare(strict_types=1);

namespace Nowo\MilkdownEditorBundle\Markdown;

use League\CommonMark\Event\DocumentParsedEvent;
use League\CommonMark\Extension\CommonMark\Node\Block\Heading;
use League\CommonMark\Extension\CommonMark\Node\Inline\Code;
use League\CommonMark\Node\Inline\Text;
use League\CommonMark\Node\Node;

use function mb_strtolower;
use function mb_substr;
use function preg_replace;
use function trim;

/**
 * Heading ids (1.6, `markdown.heading_ids`): the same slugs as the editor's `heading_ids` feature, prefixed with
 * {@see self::PREFIX} so a heading can never clobber a host element id or a global (DOM clobbering).
 *
 * Slug: lower-case, every run of characters outside letters, marks and digits becomes `-`, trimmed, at most 80
 * characters, `section` when empty; duplicates get `-2`, `-3`, … in document order. Only text and inline code count
 * (mentions, page links and icons do not, as in the editor).
 *
 * @author Héctor Franco Aceituno <hectorfranco@nowo.tech>
 */
final class HeadingIds
{
    public const PREFIX   = 'nowo-h-';
    public const MAX_SLUG = 80;

    /**
     * The slug of a heading text.
     *
     * @param string $text The heading's text
     */
    public static function slug(string $text): string
    {
        $slug = trim((string) preg_replace('/[^\p{L}\p{M}\p{N}]+/u', '-', mb_strtolower($text, 'UTF-8')), '-');
        $slug = trim(mb_substr($slug, 0, self::MAX_SLUG, 'UTF-8'), '-');

        return $slug === '' ? 'section' : $slug;
    }

    /**
     * Unique slugs of headings in order.
     *
     * @param list<string> $texts Heading texts in document order
     *
     * @return list<string>
     */
    public static function slugs(array $texts): array
    {
        $used = [];
        $out  = [];
        foreach ($texts as $text) {
            $base      = self::slug($text);
            $candidate = $base;
            for ($n = 2; isset($used[$candidate]); ++$n) {
                $candidate = $base . '-' . $n;
            }
            $used[$candidate] = true;
            $out[]            = $candidate;
        }

        return $out;
    }

    /**
     * Sets the `id` of every heading of the parsed document.
     *
     * @param DocumentParsedEvent $event The parsed document
     */
    public function onDocumentParsed(DocumentParsedEvent $event): void
    {
        $headings = [];
        $texts    = [];
        foreach ($event->getDocument()->iterator() as $node) {
            if ($node instanceof Heading) {
                $headings[] = $node;
                $texts[]    = $this->text($node);
            }
        }
        foreach (self::slugs($texts) as $i => $slug) {
            $headings[$i]->data->set('attributes/id', self::PREFIX . $slug);
        }
    }

    private function text(Node $heading): string
    {
        $text = '';
        foreach ($heading->iterator() as $node) {
            if ($node instanceof Text || $node instanceof Code) {
                $text .= $node->getLiteral();
            }
        }

        return $text;
    }
}
