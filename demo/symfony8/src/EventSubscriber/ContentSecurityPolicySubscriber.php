<?php

declare(strict_types=1);

namespace App\EventSubscriber;

use Nowo\MilkdownEditorBundle\Csp\RequestAttributeCspNonceProvider;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpKernel\Event\ResponseEvent;
use Symfony\Component\HttpKernel\KernelEvents;

/**
 * A strict, nonce-based Content Security Policy (the same directives as Symfony Beacon in production): the editor
 * must work without 'unsafe-inline' scripts or style elements. The nonce lives on the request (worker-safe).
 */
final class ContentSecurityPolicySubscriber implements EventSubscriberInterface
{
    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::REQUEST  => ['onRequest', 512],
            KernelEvents::RESPONSE => ['onResponse', -10],
        ];
    }

    public function onRequest(RequestEvent $event): void
    {
        if ($event->isMainRequest()) {
            $event->getRequest()->attributes->set(RequestAttributeCspNonceProvider::ATTRIBUTE, rtrim(strtr(base64_encode(random_bytes(18)), '+/', '-_'), '='));
        }
    }

    public function onResponse(ResponseEvent $event): void
    {
        $nonce = $event->getRequest()->attributes->get(RequestAttributeCspNonceProvider::ATTRIBUTE);
        if (!$event->isMainRequest() || !\is_string($nonce) || $event->getResponse()->headers->has('Content-Security-Policy')) {
            return;
        }
        $event->getResponse()->headers->set('Content-Security-Policy', implode('; ', [
            "default-src 'self'",
            "base-uri 'self'",
            "object-src 'none'",
            "frame-ancestors 'self'",
            "form-action 'self'",
            "font-src 'self' data:",
            "img-src 'self' data: blob:",
            "frame-src 'self'",
            "style-src-elem 'self' 'nonce-{$nonce}'",
            "style-src-attr 'unsafe-inline'",
            "script-src 'self' 'nonce-{$nonce}'",
            "connect-src 'self'",
            "worker-src 'self'",
            "manifest-src 'self'",
        ]));
    }
}
