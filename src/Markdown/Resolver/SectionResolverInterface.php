<?php

declare(strict_types=1);

namespace Nowo\MilkdownEditorBundle\Markdown\Resolver;

/**
 * 1.18 (optional): the text of the sections that `[[wiki:<uuid>#<id>]]` links point at, so a link reads
 * `Title › Section text` instead of `Title`. Alias this interface to a host service to enable it; without one, a link
 * to a section shows the page title only (never the raw id).
 *
 * The renderer calls it once per document, after {@see PageResolverInterface}, and only with pages that resolved for
 * this viewer: a hidden page never reaches it and its placeholder never shows an anchor or a section. Return plain text
 * (the renderer escapes it); leave out what the viewer may not read, and keep no state between calls (worker mode).
 *
 * @author Héctor Franco Aceituno <hectorfranco@nowo.tech>
 */
interface SectionResolverInterface
{
    /**
     * @param array<string, list<string>> $anchors Page UUID → bare heading ids (no `nowo-h-` prefix) linked in the document
     *
     * @return array<string, array<string, string>> Page UUID → id → section text; a missing entry means no section text
     */
    public function sectionTitles(array $anchors): array;
}
