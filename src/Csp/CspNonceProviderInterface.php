<?php

declare(strict_types=1);

namespace Nowo\MilkdownEditorBundle\Csp;

/**
 * Gives the editor the CSP nonce of the current response (CodeMirror and Mermaid style elements, the widget's
 * script and stylesheet tags). Alias this interface to the host's own provider (e.g. one wrapping NelmioSecurity's
 * `csp_nonce()` or a request attribute).
 *
 * @author Héctor Franco Aceituno <hectorfranco@nowo.tech>
 */
interface CspNonceProviderInterface
{
    /**
     * The nonce for style and script elements, or null when the page has no nonce-based policy.
     */
    public function getNonce(): ?string;
}
