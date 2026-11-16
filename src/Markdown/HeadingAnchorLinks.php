<?php

declare(strict_types=1);

namespace Nowo\MilkdownEditorBundle\Markdown;

use function html_entity_decode;
use function preg_match;
use function preg_replace_callback;
use function str_starts_with;

use const ENT_HTML5;
use const ENT_QUOTES;

/**
 * 1.18: a "copy link to this section" control on every heading of read-view HTML, with no JavaScript needed:
 *
 *   <hN id="nowo-h-setup">Install <a class="nowo-md-heading-anchor" href="#nowo-h-setup" title="Link to this section">
 *   <span class="nowo-milkdown-sr-only">Link to this section</span>#</a></hN>
 *
 * Run it on HTML that is **already sanitised** (after the host's sanitizer, which stays unchanged): only headings whose
 * `id` is `nowo-h-` plus a valid id ({@see HeadingIds::isValid()}) get the link, and the id is validated again and
 * escaped. Without JavaScript the link is an ordinary fragment link (*Copy link address* works); with `$pageUrl`, it also
 * carries `data-nowo-ui-clipboard-text` (the page URL plus the fragment) for UiKit's clipboard controller. The stylesheet
 * shows it on `:hover` / `:focus-within` and keeps it reachable by keyboard. Stateless; linear in the HTML length.
 *
 * @author Héctor Franco Aceituno <hectorfranco@nowo.tech>
 */
final readonly class HeadingAnchorLinks
{
    /** CSS class of the appended link. */
    public const CSS_CLASS = 'nowo-md-heading-anchor';

    /**
     * Appends the anchor link to every heading with a valid prefixed id.
     *
     * @param string $sanitizedHtml HTML that went through the host's sanitizer
     * @param string $label Accessible name and title of the link (already translated), e.g. *Link to this section*
     * @param string|null $pageUrl Absolute URL of the page (no fragment) for the clipboard attribute; null: none
     */
    public static function decorate(string $sanitizedHtml, string $label, ?string $pageUrl = null): string
    {
        $page = $pageUrl !== null ? DialectRenderer::safeUrl($pageUrl) : '';
        $name = DialectRenderer::e($label);

        // On a PCRE failure (backtrack limit) the HTML comes back unchanged, never empty.
        return preg_replace_callback(
            '~(<h([1-6])\b[^>]*>)(.*?)(</h\2\s*>)~is',
            static function (array $m) use ($page, $name): string {
                if (preg_match('~\sid\s*=\s*"([^"]*)"~i', $m[1], $id) !== 1) {
                    return $m[0];
                }
                $raw = html_entity_decode($id[1], ENT_QUOTES | ENT_HTML5, 'UTF-8');
                if (!str_starts_with($raw, HeadingIds::PREFIX)) {
                    return $m[0];
                }
                $bare = HeadingIds::normalise($raw);
                if ($bare === '' || $raw !== HeadingIds::PREFIX . $bare) {
                    return $m[0];
                }
                $fragment = '#' . HeadingIds::PREFIX . $bare;
                $copy     = $page !== '' ? ' data-nowo-ui-clipboard-text="' . DialectRenderer::e(DialectRenderer::withFragment($page, $bare)) . '"' : '';

                return $m[1] . $m[3] . ' <a class="' . self::CSS_CLASS . '" href="' . DialectRenderer::e($fragment) . '" title="' . $name . '"' . $copy . '>'
                    . '<span class="nowo-milkdown-sr-only">' . $name . '</span><span aria-hidden="true">#</span></a>' . $m[4];
            },
            $sanitizedHtml,
        ) ?? $sanitizedHtml;
    }
}
