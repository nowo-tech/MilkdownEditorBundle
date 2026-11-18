<?php

declare(strict_types=1);

namespace Nowo\MilkdownEditorBundle\Markdown;

use League\CommonMark\Event\DocumentParsedEvent;
use League\CommonMark\Extension\Footnote\Node\Footnote;
use League\CommonMark\Extension\Footnote\Node\FootnoteBackref;
use League\CommonMark\Node\Block\Paragraph;
use League\CommonMark\Node\Node;

/**
 * Puts the back links of a footnote in a paragraph.
 *
 * league/commonmark appends the `↩` back links to the last child of a footnote, whatever that child is. A footnote that
 * ends with a list, a table, a quote or a code block then renders an `<a>` directly in `<ul>` / `<table>` (invalid HTML,
 * axe `list`) or loses it (a code block renders no children). Back links whose parent is not a paragraph are moved
 * into a new paragraph at the end of the footnote; a footnote that ends with a paragraph renders exactly as before.
 *
 * Stateless (worker-safe): it only rewrites the document of the event.
 */
final class FootnoteBackrefPlacement
{
    /** After league/commonmark's GatherFootnotesListener (10), which creates the back links. */
    public const PRIORITY = 5;

    public function onDocumentParsed(DocumentParsedEvent $event): void
    {
        $footnotes = [];
        foreach ($event->getDocument()->iterator() as $node) {
            if ($node instanceof Footnote) {
                $footnotes[] = $node;
            }
        }
        foreach ($footnotes as $footnote) {
            $this->place($footnote);
        }
    }

    private function place(Footnote $footnote): void
    {
        $misplaced = [];
        $host      = $footnote->lastChild();
        foreach ([$footnote, $host] as $parent) {
            if (!$parent instanceof Node || $parent instanceof Paragraph) {
                continue;
            }
            foreach ($parent->children() as $child) {
                if ($child instanceof FootnoteBackref) {
                    $misplaced[] = $child;
                }
            }
        }
        if ($misplaced === []) {
            return;
        }
        $paragraph = new Paragraph();
        foreach ($misplaced as $backref) {
            $backref->detach();
            $paragraph->appendChild($backref);
        }
        $footnote->appendChild($paragraph);
    }
}
