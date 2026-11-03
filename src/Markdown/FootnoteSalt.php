<?php

declare(strict_types=1);

namespace Nowo\MilkdownEditorBundle\Markdown;

use League\CommonMark\Event\DocumentParsedEvent;
use League\CommonMark\Extension\Footnote\Node\Footnote;
use League\CommonMark\Extension\Footnote\Node\FootnoteRef;
use League\CommonMark\Reference\Reference;
use Symfony\Contracts\Service\ResetInterface;

use function hash;
use function strlen;
use function substr;

/**
 * Salts the labels league/commonmark builds footnote ids from (1.2.1, audit CZ-I7), so `nowo-md-fn-<salt>-<label>` is
 * unique on a page (a page and its comments) yet stable for one document: the salt is the first 6 hex characters of a
 * hash of the Markdown, plus a counter when the same document is rendered again in the same request. Only the
 * footnote nodes are renamed (after orphans were restored as text, before numbering): user text and links are never
 * touched. The counter is cleared on `kernel.reset` (worker-safe).
 */
final class FootnoteSalt implements ResetInterface
{
    /** @var array<string, int> document hash => renders in this request */
    private array $renders = [];

    private string $salt = '';

    /**
     * Sets the salt for the next document.
     *
     * @param string $markdown The Markdown about to be parsed
     */
    public function prepare(string $markdown): void
    {
        $hash                 = substr(hash('sha256', $markdown), 0, 6);
        $count                = $this->renders[$hash] ?? 0;
        $this->renders[$hash] = $count + 1;
        $this->salt           = $count === 0 ? $hash : $hash . '-' . $count;
    }

    /**
     * Prefixes the label of every footnote and footnote reference with the salt.
     *
     * @param DocumentParsedEvent $event The parsed document
     */
    public function onDocumentParsed(DocumentParsedEvent $event): void
    {
        $notes = [];
        foreach ($event->getDocument()->iterator() as $node) {
            if ($node instanceof FootnoteRef) {
                $reference   = $node->getReference();
                $label       = $this->salt . '-' . $reference->getLabel();
                $destination = $reference->getDestination(); // '#' . footnote_id_prefix . label
                $node->setReference(new Reference($label, substr($destination, 0, strlen($destination) - strlen($reference->getLabel())) . $label, $reference->getTitle()));
            } elseif ($node instanceof Footnote) {
                $notes[] = $node;
            }
        }
        foreach ($notes as $note) {
            $label  = $this->salt . '-' . $note->getReference()->getLabel();
            $salted = new Footnote(new Reference($label, $label, $label));
            foreach ($note->children() as $child) {
                $salted->appendChild($child);
            }
            $note->replaceWith($salted);
        }
    }

    /**
     * Forgets the documents rendered in this request (`kernel.reset`).
     */
    public function reset(): void
    {
        $this->renders = [];
        $this->salt    = '';
    }
}
