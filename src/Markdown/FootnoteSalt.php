<?php

declare(strict_types=1);

namespace Nowo\MilkdownEditorBundle\Markdown;

use League\CommonMark\Event\DocumentParsedEvent;
use League\CommonMark\Extension\Footnote\Node\Footnote;
use League\CommonMark\Extension\Footnote\Node\FootnoteRef;
use League\CommonMark\Reference\Reference;
use Symfony\Contracts\Service\ResetInterface;

use function hash_hmac;
use function strlen;
use function substr;

/**
 * Salts the labels league/commonmark builds footnote ids from, so `nowo-md-fn-<salt>-<label>` is unique on a page (a
 * page and its comments) yet stable for one document (stored HTML, ETags).
 *
 * 1.3.1 (audit CZ-I10 / CZ-I11): the salt is 12 hex characters of an HMAC, under a subkey of `kernel.secret`, of the
 * render count and the Markdown (`count . "\0" . markdown`). It reveals nothing about the source, two documents
 * collide only with probability 2^-48, and the counter is inside the HMAC, so the boundary between salt and label is
 * always the 13th character. Only footnote nodes are renamed (after orphans were restored as text, before numbering):
 * user text and links are never touched. The counter is cleared on `kernel.reset` (worker-safe).
 */
final class FootnoteSalt implements ResetInterface
{
    public const SALT_LENGTH = 12;

    /** @var array<string, int> document digest => renders in this request */
    private array $renders = [];

    private string $salt = '';

    private readonly string $key;

    /**
     * @param string $secret `kernel.secret` (a purpose-bound subkey is derived from it; '' only outside a kernel)
     */
    public function __construct(string $secret = '')
    {
        $this->key = hash_hmac('sha256', 'nowo_milkdown_footnote_salt', $secret);
    }

    /**
     * Sets the salt for the next document.
     *
     * @param string $markdown The Markdown about to be parsed
     */
    public function prepare(string $markdown): void
    {
        $digest                 = hash_hmac('sha256', "0\0" . $markdown, $this->key);
        $count                  = $this->renders[$digest] ?? 0;
        $this->renders[$digest] = $count + 1;
        $this->salt             = substr($count === 0 ? $digest : hash_hmac('sha256', $count . "\0" . $markdown, $this->key), 0, self::SALT_LENGTH);
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
