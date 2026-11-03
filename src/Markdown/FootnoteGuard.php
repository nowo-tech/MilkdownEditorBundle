<?php

declare(strict_types=1);

namespace Nowo\MilkdownEditorBundle\Markdown;

use League\CommonMark\Event\DocumentParsedEvent;
use League\CommonMark\Extension\Footnote\Node\Footnote;
use League\CommonMark\Extension\Footnote\Node\FootnoteRef;
use League\CommonMark\Node\Inline\Text;
use League\CommonMark\Reference\Reference;

use function count;
use function mb_strtolower;
use function sprintf;

/**
 * Runs before league/commonmark's footnote listeners (1.2.1, audit CZ-L1 / Info):
 *
 * - labels are case-insensitive, as in GFM and the editor (`[^Body]` and `[^body]` are one footnote), so two
 *   footnotes never get the same lower-cased id;
 * - more than `max_footnote_refs` references render as their literal `[^label]` text and the notes are dropped: each
 *   reference costs a superscript link and a back reference, so a short document could otherwise expand ~50×.
 *
 * Stateless (worker-safe).
 */
final readonly class FootnoteGuard
{
    public const DEFAULT_MAX_FOOTNOTE_REFS = 200;

    /**
     * @param int $maxRefs Footnote references allowed per document (`markdown.max_footnote_refs`)
     */
    public function __construct(private int $maxRefs = self::DEFAULT_MAX_FOOTNOTE_REFS)
    {
    }

    /**
     * Lower-cases footnote labels, or turns every reference back into text when there are too many.
     *
     * @param DocumentParsedEvent $event The parsed document
     */
    public function onDocumentParsed(DocumentParsedEvent $event): void
    {
        $refs  = [];
        $notes = [];
        foreach ($event->getDocument()->iterator() as $node) {
            if ($node instanceof FootnoteRef) {
                $refs[] = $node;
            } elseif ($node instanceof Footnote) {
                $notes[] = $node;
            }
        }

        if (count($refs) > $this->maxRefs) {
            foreach ($refs as $ref) {
                $ref->replaceWith(new Text(sprintf('[^%s]', $ref->getReference()->getLabel())));
            }
            foreach ($notes as $note) {
                $note->detach();
            }

            return;
        }

        foreach ($refs as $ref) {
            $label = mb_strtolower($ref->getReference()->getLabel(), 'UTF-8');
            if ($label !== $ref->getReference()->getLabel()) {
                $ref->setReference(new Reference($label, mb_strtolower($ref->getReference()->getDestination(), 'UTF-8'), $label));
            }
        }
        foreach ($notes as $note) {
            $label = mb_strtolower($note->getReference()->getLabel(), 'UTF-8');
            if ($label === $note->getReference()->getLabel()) {
                continue;
            }
            $lower = new Footnote(new Reference($label, $label, $label));
            foreach ($note->children() as $child) {
                $lower->appendChild($child);
            }
            $note->replaceWith($lower);
        }
    }
}
