<?php

declare(strict_types=1);

namespace Nowo\MilkdownEditorBundle\Markdown;

use League\CommonMark\Event\DocumentParsedEvent;
use League\CommonMark\Extension\CommonMark\Node\Inline\Image;
use League\CommonMark\Extension\CommonMark\Node\Inline\Link;
use League\CommonMark\Node\Block\Paragraph;
use League\CommonMark\Node\Inline\Text;
use League\CommonMark\Node\Node;
use Nowo\MilkdownEditorBundle\Markdown\Directive\DirectiveRendererInterface;
use Nowo\MilkdownEditorBundle\Markdown\Node\HiddenReference;
use Nowo\MilkdownEditorBundle\Markdown\Node\ImageFigure;
use Nowo\MilkdownEditorBundle\Markdown\Node\LeafDirective;
use Nowo\MilkdownEditorBundle\Markdown\Node\Mention;
use Nowo\MilkdownEditorBundle\Markdown\Node\WikiLink;
use Nowo\MilkdownEditorBundle\Markdown\Resolver\ContextualHostFileResolverInterface;
use Nowo\MilkdownEditorBundle\Markdown\Resolver\FilePreviewResolverInterface;
use Nowo\MilkdownEditorBundle\Markdown\Resolver\FileReference;
use Nowo\MilkdownEditorBundle\Markdown\Resolver\HostFileResolverInterface;
use Nowo\MilkdownEditorBundle\Markdown\Resolver\PageResolverInterface;
use Nowo\MilkdownEditorBundle\Markdown\Resolver\RenderContextProviderInterface;
use Nowo\MilkdownEditorBundle\Markdown\Resolver\ResolvedFile;
use Nowo\MilkdownEditorBundle\Markdown\Resolver\UserResolverInterface;
use Psr\Log\LoggerInterface;
use Throwable;

use function array_filter;
use function array_flip;
use function array_intersect_key;
use function array_keys;
use function array_slice;
use function array_values;
use function count;
use function is_string;
use function str_ends_with;
use function trim;

/**
 * After parsing, resolves every page link and mention of the document in one call per resolver (FR-061: per viewer),
 * prepares host directive renderers, and turns remote images into links when they are not allowed. At most
 * `max_references` distinct page ids and handles are sent to each resolver; later ones render as not visible / text.
 *
 * 1.9: host references (`host-file:<id>`, `markdown.host_schemes`) of images, links and file cards are resolved in
 * one batch ({@see HostFileResolverInterface}); every resolved URL goes through {@see DialectRenderer::safeUrl()} and
 * images also through the remote-image policy. File cards with `view="preview"` ask {@see FilePreviewResolverInterface}.
 * With `markdown.image_block`, an image takes the `{width=… align=…}` block that follows it, and a paragraph holding only
 * an image becomes an {@see ImageFigure}.
 *
 * 1.13: plain URLs that match `markdown.host_url_patterns` are host references too, resolved in the same batch; a
 * {@see ContextualHostFileResolverInterface} gets the render's context ({@see RenderContextProviderInterface}). A refused
 * image, card or pattern link renders *Content not visible* with no URL, alt text or name; a refused `scheme:` link keeps
 * its text unless `host_refused_links` is `hidden`. A visible `url: written` reference keeps the author's URL untouched.
 *
 * @author Héctor Franco Aceituno <hectorfranco@nowo.tech>
 */
final readonly class DocumentProcessor
{
    /** Default `max_references`: distinct page ids and mention handles resolved per document. */
    public const DEFAULT_MAX_REFERENCES = 500;

    /**
     * @param PageResolverInterface $pages Page link resolver
     * @param UserResolverInterface $users Mention resolver
     * @param iterable<DirectiveRendererInterface> $directiveRenderers Host renderers of leaf directives
     * @param bool $allowRemoteImages Keep images from other hosts
     * @param LoggerInterface|null $logger Logs resolver failures (never document content)
     * @param int $maxReferences Distinct page ids / handles sent to each resolver per document
     * @param HostSchemes $hostSchemes Allow-listed host schemes (1.9)
     * @param HostFileResolverInterface|null $sources Resolves host references for the viewer (1.9; null: none resolve)
     * @param FilePreviewResolverInterface|null $previews Previews of `view="preview"` file cards (1.9; null: none)
     * @param bool $imageBlock Standalone images become figures with caption, width and alignment (1.9)
     * @param RenderContextProviderInterface|null $renderContext The render's context for a contextual host file resolver (1.13)
     * @param bool $hideRefusedLinks A refused `scheme:` link renders *Content not visible* instead of its text (1.13, `host_refused_links: hidden`)
     */
    public function __construct(
        private PageResolverInterface $pages,
        private UserResolverInterface $users,
        private iterable $directiveRenderers = [],
        private bool $allowRemoteImages = false,
        private ?LoggerInterface $logger = null,
        private int $maxReferences = self::DEFAULT_MAX_REFERENCES,
        private HostSchemes $hostSchemes = new HostSchemes(),
        private ?HostFileResolverInterface $sources = null,
        private ?FilePreviewResolverInterface $previews = null,
        private bool $imageBlock = false,
        private ?RenderContextProviderInterface $renderContext = null,
        private bool $hideRefusedLinks = false,
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
        /** @var list<Image|Link> $hosted */
        $hosted = [];
        /** @var list<Paragraph> $paragraphs */
        $paragraphs = [];
        if ($this->imageBlock) {
            $this->readImageAttributes($event->getDocument());
        }
        foreach ($event->getDocument()->iterator() as $node) {
            if ($node instanceof WikiLink) {
                $links[$node->pageId][] = $node;
            } elseif ($node instanceof Mention) {
                $mentions[$node->handle][] = $node;
            } elseif ($node instanceof LeafDirective) {
                $leaves[] = $node;
            } elseif (($node instanceof Image || $node instanceof Link) && $this->hostSchemes->isHostValue($node->getUrl())) {
                $hosted[] = $node;
            } elseif ($node instanceof Image && !$this->allowRemoteImages && self::isRemote($node->getUrl())) {
                $images[] = $node;
            } elseif ($node instanceof Paragraph) {
                $paragraphs[] = $node;
            }
        }

        if ($links !== []) {
            $ids   = array_slice(array_keys($links), 0, $this->maxReferences);
            $found = array_intersect_key($this->call(fn (): array => $this->pages->resolvePages($ids), 'page'), array_flip($ids));
            foreach ($links as $id => $nodes) {
                foreach ($nodes as $link) {
                    $link->page = $found[$id] ?? null;
                }
            }
        }
        if ($mentions !== []) {
            $handles = array_slice(array_map('strval', array_keys($mentions)), 0, $this->maxReferences);
            $found   = array_intersect_key($this->call(fn (): array => $this->users->resolveUsers($handles), 'user'), array_flip($handles));
            foreach ($mentions as $handle => $nodes) {
                foreach ($nodes as $mention) {
                    $mention->user = $found[$handle] ?? null;
                }
            }
        }
        $fileCardsOwned = false;
        foreach ($this->directiveRenderers as $renderer) {
            $mine = array_values(array_filter($leaves, static fn (LeafDirective $l): bool => $renderer->supports($l->name)));
            if ($mine !== []) {
                $renderer->prepare($mine);
            }
            $fileCardsOwned = $fileCardsOwned || $renderer->supports(FileCard::NAME);
        }
        foreach ($images as $image) {
            $this->imageToLink($image);
        }
        if ($this->imageBlock) {
            foreach ($paragraphs as $paragraph) {
                $this->toFigure($paragraph);
            }
        }
        $cards = $fileCardsOwned ? [] : array_values(array_filter($leaves, static fn (LeafDirective $l): bool => $l->name === FileCard::NAME));
        $this->resolveHosted($hosted, $cards);
    }

    /**
     * 1.9 (ME-5 / ME-6): host references of images, links and file cards, then the previews of preview cards.
     *
     * @param list<Image|Link> $hosted
     * @param list<LeafDirective> $cards
     */
    private function resolveHosted(array $hosted, array $cards): void
    {
        $references = [];
        foreach ($hosted as $node) {
            $reference = $this->hostSchemes->hostReference($node->getUrl());
            if ($reference !== null) {
                $references[$reference] = true;
            }
        }
        foreach ($cards as $card) {
            $reference = $this->hostSchemes->hostReference($card->attributes['href'] ?? '');
            if ($reference !== null) {
                $references[$reference] = true;
            }
        }
        $ids      = array_slice(array_keys($references), 0, $this->maxReferences);
        $resolved = $ids === [] || !$this->sources instanceof HostFileResolverInterface
            ? []
            : array_intersect_key($this->call(fn (): array => $this->resolveFiles($ids), 'host file'), array_flip($ids));

        foreach ($hosted as $node) {
            $written   = $node->getUrl();
            $reference = $this->hostSchemes->hostReference($written);
            $source    = $reference !== null ? ($resolved[$reference] ?? null) : null;
            $keep      = $this->hostSchemes->keepsWrittenUrl($written);
            $url       = $source instanceof ResolvedFile ? DialectRenderer::safeUrl($keep ? $written : ($node instanceof Image ? ($source->imageUrl ?? $source->url) : $source->url)) : '';
            if ($node instanceof Link) {
                if ($url !== '') {
                    // 1.13 `url: written`: the link as the author wrote it.
                    $node->setUrl($keep ? $written : $url);
                } elseif ($this->hideRefusedLinks || !$this->hostSchemes->isHostUrl($written)) {
                    // 1.13: neither the target nor the text (often the file name) of a reference the viewer may not see.
                    $node->replaceWith(new HiddenReference());
                } else {
                    $this->unwrap($node);
                }
                continue;
            }
            if ($url === '' || !$source instanceof ResolvedFile) {
                $node->replaceWith(new HiddenReference());
                continue;
            }
            if ($keep) {
                // 1.13 `url: written`: the image as the author wrote it, under the policy of author images.
                if (!$this->allowRemoteImages && self::isRemote($written)) {
                    $this->imageToLink($node);
                }
                continue;
            }
            $node->setUrl($url);
            // The same remote-image policy as images written by authors, unless the host listed that origin.
            if (!$this->allowRemoteImages && self::isRemote($url) && !$this->hostSchemes->isAllowedImageOrigin($url)) {
                $this->imageToLink($node);
                continue;
            }
            $node->data->set('attributes/loading', 'lazy');
            if ((int) $source->width > 0 && (int) $source->height > 0 && !$node->data->has('attributes/width')) {
                $node->data->set('attributes/width', (string) $source->width);
                $node->data->set('attributes/height', (string) $source->height);
            }
        }

        /** @var array<string, FileReference> $wanted */
        $wanted = [];
        /** @var array<string, list<LeafDirective>> $byHref */
        $byHref = [];
        foreach ($cards as $card) {
            $href = $card->attributes['href'] ?? '';
            $url  = DialectRenderer::safeUrl($href);
            $keep = $this->hostSchemes->keepsWrittenUrl($href);
            if ($this->hostSchemes->isHostValue($href)) {
                $reference = $this->hostSchemes->hostReference($href);
                $source    = $reference !== null ? ($resolved[$reference] ?? null) : null;
                $url       = $source instanceof ResolvedFile ? DialectRenderer::safeUrl($keep ? $href : $source->url) : '';
                if ($url === '' || !$source instanceof ResolvedFile) {
                    $card->data->set('nowo_file_hidden', true);
                    continue;
                }
                // 1.13 `url: written`: the card as the author wrote it.
                if (!$keep && $source->name !== null) {
                    $card->data->set('nowo_file_name', $source->name);
                }
                if (!$keep && $source->type !== null) {
                    $card->data->set('nowo_file_type', $source->type);
                }
            }
            $card->data->set('nowo_file_url', $url);
            if ($url !== '' && FileCard::view($card->attributes) === 'preview') {
                $byHref[$href][] = $card;
                $wanted[$href]   = new FileReference($href, $url, FileCard::name($this->text($card->data->get('nowo_file_name', null)) ?? $card->label), $this->text($card->data->get('nowo_file_type', null)) ?? $card->attributes['type'] ?? '', $keep ? null : $this->hostSchemes->hostReference($href));
            }
        }
        if ($wanted === [] || !$this->previews instanceof FilePreviewResolverInterface) {
            return;
        }
        $files = array_slice(array_values($wanted), 0, $this->maxReferences);
        try {
            $previews = $this->previews->resolvePreviews($files);
        } catch (Throwable $e) {
            $this->logger?->warning('Milkdown renderer: the {kind} resolver failed; references render as not visible.', ['kind' => 'file preview', 'exception' => $e::class]);
            $previews = [];
        }
        foreach ($byHref as $href => $nodes) {
            $preview = $previews[$href] ?? null;
            $preview = is_string($preview) ? DialectRenderer::safeUrl($preview) : '';
            if ($preview === '') {
                continue;
            }
            foreach ($nodes as $card) {
                $card->data->set('nowo_file_preview', $preview);
            }
        }
    }

    /**
     * 1.13: the host resolver's answer, with the render's context when it takes one.
     *
     * @param list<string> $references
     *
     * @return array<string, ResolvedFile>
     */
    private function resolveFiles(array $references): array
    {
        $sources = $this->sources;
        if ($sources instanceof ContextualHostFileResolverInterface) {
            return $sources->resolveFilesInContext($references, $this->renderContext?->renderContext());
        }

        return $sources instanceof HostFileResolverInterface ? $sources->resolveFiles($references) : [];
    }

    private function text(mixed $value): ?string
    {
        return is_string($value) ? $value : null;
    }

    /** A link the viewer may not open keeps its text, without a target. */
    private function unwrap(Link $link): void
    {
        /** @var list<Node> $children */
        $children = [];
        foreach ($link->children() as $child) {
            $children[] = $child;
        }
        foreach ($children as $child) {
            $link->insertBefore($child);
        }
        $link->detach();
    }

    /**
     * 1.9 `image_block`: an image takes the `{width=… align=…}` block right after it, out of the text. A px width is the
     * image's `width` attribute; everything else is for {@see self::toFigure()}.
     */
    private function readImageAttributes(Node $document): void
    {
        /** @var list<Image> $found */
        $found = [];
        foreach ($document->iterator() as $node) {
            if ($node instanceof Image) {
                $found[] = $node;
            }
        }
        foreach ($found as $image) {
            $next = $image->next();
            $read = $next instanceof Text ? ImageAttributes::prefix($next->getLiteral()) : null;
            if ($read === null || !$next instanceof Text) {
                continue;
            }
            $rest = ImageAttributes::rest($next->getLiteral(), $read['length']);
            if ($rest === '') {
                $next->detach();
            } else {
                $next->setLiteral($rest);
            }
            $image->data->set('nowo_image', ['width' => $read['width'], 'align' => $read['align']]);
            if (str_ends_with($read['width'], 'px')) {
                $image->data->set('attributes/width', (string) (int) $read['width']);
            }
        }
    }

    /**
     * 1.9 `image_block`: a paragraph that holds only an image becomes a figure (the caption is the image's title, which
     * stops being a tooltip there).
     */
    private function toFigure(Paragraph $paragraph): void
    {
        $nodes = [];
        foreach ($paragraph->children() as $child) {
            if (!$child instanceof Text || trim($child->getLiteral()) !== '') {
                $nodes[] = $child;
            }
        }
        $image = $nodes[0] ?? null;
        if (!$image instanceof Image || count($nodes) > 1) {
            return;
        }
        /** @var array{width?: string, align?: string} $attributes */
        $attributes = (array) $image->data->get('nowo_image', []);
        $figure     = new ImageFigure($attributes['width'] ?? '', $attributes['align'] ?? '', (string) $image->getTitle());
        $image->setTitle(null);
        $paragraph->replaceWith($figure);
        $figure->appendChild($image);
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
        $url = DialectRenderer::cleanUrl($url);
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
