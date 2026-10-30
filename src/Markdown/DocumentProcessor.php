<?php

declare(strict_types=1);

namespace Nowo\MilkdownEditorBundle\Markdown;

use League\CommonMark\Event\DocumentParsedEvent;
use League\CommonMark\Extension\CommonMark\Node\Inline\Image;
use League\CommonMark\Extension\CommonMark\Node\Inline\Link;
use League\CommonMark\Node\Node;
use Nowo\MilkdownEditorBundle\Markdown\Directive\DirectiveRendererInterface;
use Nowo\MilkdownEditorBundle\Markdown\Node\LeafDirective;
use Nowo\MilkdownEditorBundle\Markdown\Node\Mention;
use Nowo\MilkdownEditorBundle\Markdown\Node\WikiLink;
use Nowo\MilkdownEditorBundle\Markdown\Resolver\PageResolverInterface;
use Nowo\MilkdownEditorBundle\Markdown\Resolver\UserResolverInterface;
use Psr\Log\LoggerInterface;
use Throwable;

/**
 * After parsing, resolves every page link and mention of the document in one call per resolver (FR-061: per viewer),
 * prepares host directive renderers, and turns remote images into links when they are not allowed.
 *
 * @author Héctor Franco Aceituno <hectorfranco@nowo.tech>
 */
final readonly class DocumentProcessor
{
    /**
     * @param PageResolverInterface $pages Page link resolver
     * @param UserResolverInterface $users Mention resolver
     * @param iterable<DirectiveRendererInterface> $directiveRenderers Host renderers of leaf directives
     * @param bool $allowRemoteImages Keep images from other hosts
     * @param LoggerInterface|null $logger Logs resolver failures (never document content)
     */
    public function __construct(
        private PageResolverInterface $pages,
        private UserResolverInterface $users,
        private iterable $directiveRenderers = [],
        private bool $allowRemoteImages = false,
        private ?LoggerInterface $logger = null,
    ) {
    }

    /**
     * Listener of {@see DocumentParsedEvent}.
     *
     * @param DocumentParsedEvent $event The parsed document
     */
    public function __invoke(DocumentParsedEvent $event): void
    {
        /** @var array<string, list<WikiLink>> $links */
        $links = [];
        /** @var array<string, list<Mention>> $mentions */
        $mentions = [];
        /** @var list<LeafDirective> $leaves */
        $leaves = [];
        /** @var list<Image> $images */
        $images = [];
        foreach ($event->getDocument()->iterator() as $node) {
            if ($node instanceof WikiLink) {
                $links[$node->pageId][] = $node;
            } elseif ($node instanceof Mention) {
                $mentions[$node->handle][] = $node;
            } elseif ($node instanceof LeafDirective) {
                $leaves[] = $node;
            } elseif ($node instanceof Image && !$this->allowRemoteImages && self::isRemote($node->getUrl())) {
                $images[] = $node;
            }
        }

        if ($links !== []) {
            $found = $this->call(fn (): array => $this->pages->resolvePages(array_keys($links)), 'page');
            foreach ($links as $id => $nodes) {
                foreach ($nodes as $link) {
                    $link->page = $found[$id] ?? null;
                }
            }
        }
        if ($mentions !== []) {
            $found = $this->call(fn (): array => $this->users->resolveUsers(array_map('strval', array_keys($mentions))), 'user');
            foreach ($mentions as $handle => $nodes) {
                foreach ($nodes as $mention) {
                    $mention->user = $found[$handle] ?? null;
                }
            }
        }
        foreach ($this->directiveRenderers as $renderer) {
            $mine = array_values(array_filter($leaves, static fn (LeafDirective $l): bool => $renderer->supports($l->name)));
            if ($mine !== []) {
                $renderer->prepare($mine);
            }
        }
        foreach ($images as $image) {
            $this->imageToLink($image);
        }
    }

    /**
     * @template T of object
     *
     * @param callable(): array<string, T> $resolve
     *
     * @return array<string, T>
     */
    private function call(callable $resolve, string $kind): array
    {
        try {
            return $resolve();
        } catch (Throwable $e) {
            $this->logger?->warning('Milkdown renderer: the {kind} resolver failed; references render as not visible.', ['kind' => $kind, 'exception' => $e::class]);

            return [];
        }
    }

    /**
     * Whether an image URL may load from another origin: any scheme (`http:host/x` included) except `data:image/…`,
     * and protocol-relative forms (`//host`, `/\host`, `\\host`).
     */
    public static function isRemote(string $url): bool
    {
        $url = trim($url);
        if (preg_match('~^[\\\\/][\\\\/]~', $url) === 1) {
            return true;
        }
        if (preg_match('~^([a-z][a-z0-9+.-]*):~i', $url, $m) === 1) {
            return strtolower($m[1]) !== 'data' || preg_match('~^data:image/~i', $url) !== 1;
        }

        return false;
    }

    private function imageToLink(Image $image): void
    {
        $link = new Link($image->getUrl(), null, $image->getTitle());
        /** @var list<Node> $children */
        $children = [];
        foreach ($image->children() as $child) {
            $children[] = $child;
        }
        foreach ($children as $child) {
            $link->appendChild($child);
        }
        $image->replaceWith($link);
    }
}
