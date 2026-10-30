<?php

declare(strict_types=1);

namespace Nowo\MilkdownEditorBundle\Csp;

use Symfony\Component\HttpFoundation\RequestStack;

use function is_string;

/**
 * Default nonce provider: reads the `csp_nonce` attribute of the main request (set it in a request listener, or
 * alias {@see CspNonceProviderInterface} to another provider). Stateless: safe in FrankenPHP worker mode.
 *
 * @author Héctor Franco Aceituno <hectorfranco@nowo.tech>
 */
final readonly class RequestAttributeCspNonceProvider implements CspNonceProviderInterface
{
    /** Request attribute holding the nonce. */
    public const ATTRIBUTE = 'csp_nonce';

    /**
     * @param RequestStack|null $requestStack The request stack (null outside HTTP)
     */
    public function __construct(private ?RequestStack $requestStack = null)
    {
    }

    /**
     * The nonce stored on the main request, if any.
     */
    public function getNonce(): ?string
    {
        $nonce = $this->requestStack?->getMainRequest()?->attributes->get(self::ATTRIBUTE);

        return is_string($nonce) && $nonce !== '' ? $nonce : null;
    }
}
