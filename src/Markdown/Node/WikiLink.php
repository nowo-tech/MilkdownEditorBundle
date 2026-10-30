<?php

declare(strict_types=1);

namespace Nowo\MilkdownEditorBundle\Markdown\Node;

use League\CommonMark\Node\Inline\AbstractInline;
use Nowo\MilkdownEditorBundle\Markdown\Resolver\ResolvedPage;

/**
 * `[[wiki:<uuid>]]` / `[[wiki:<uuid>#anchor]]`: a page link by id, rendered with the page's current title for
 * viewers who may read it (resolved in one batch per document), *Content not visible* otherwise.
 *
 * @author Héctor Franco Aceituno <hectorfranco@nowo.tech>
 */
final class WikiLink extends AbstractInline
{
    /** The resolved page (null: not visible to the viewer or unknown). */
    public ?ResolvedPage $page = null;

    /**
     * @param string $pageId Page UUID (lower case)
     * @param string $anchor Heading anchor ('' for none)
     */
    public function __construct(public readonly string $pageId, public readonly string $anchor = '')
    {
        parent::__construct();
    }
}
