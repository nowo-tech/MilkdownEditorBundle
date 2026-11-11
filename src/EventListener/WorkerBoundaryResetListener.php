<?php

declare(strict_types=1);

namespace Nowo\MilkdownEditorBundle\EventListener;

use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Contracts\Service\ResetInterface;

/**
 * Clears the renderer's per-page footnote counters at every unit-of-work boundary (REQ-RUNTIME-002).
 *
 * `kernel.reset` alone is not enough: it does not run where the services resetter does not, i.e. a host that removes
 * or bypasses `services_resetter` (or drives `http_kernel` directly), a Messenger consumer started with `--no-reset`,
 * or a long-running console command. There the counters kept growing for the life of the process, and a document
 * rendered again in a later request got other footnote ids (stored HTML and ETags changed for the same Markdown).
 *
 * Boundaries: the main `kernel.request` and `kernel.terminate`; Messenger `WorkerMessageReceived` / `Handled` /
 * `Failed` and `console.command` / `console.terminate` (by name: symfony/messenger and symfony/console stay optional).
 * The renderer is injected as `IGNORE_ON_UNINITIALIZED_REFERENCE`, so a boundary never builds it.
 */
final readonly class WorkerBoundaryResetListener
{
    /** Listener priority of every boundary event (late, after the unit's own listeners of that event). */
    public const PRIORITY = -1024;

    /** Boundaries handled by {@see onBoundary()} (the main request goes through {@see onKernelRequest()}). */
    public const EVENTS = [
        KernelEvents::TERMINATE,
        'Symfony\\Component\\Messenger\\Event\\WorkerMessageReceivedEvent',
        'Symfony\\Component\\Messenger\\Event\\WorkerMessageHandledEvent',
        'Symfony\\Component\\Messenger\\Event\\WorkerMessageFailedEvent',
        'console.command',
        'console.terminate',
    ];

    /**
     * @param iterable<ResetInterface> $resettables the Markdown renderer, when initialized
     */
    public function __construct(
        private iterable $resettables,
    ) {
    }

    /**
     * Main request start; sub-requests (`render(controller())`) belong to the same page and keep the counters.
     */
    public function onKernelRequest(RequestEvent $event): void
    {
        if ($event->isMainRequest()) {
            $this->onBoundary();
        }
    }

    /**
     * Any other boundary: forgets the documents rendered in the unit of work that ended or starts.
     */
    public function onBoundary(): void
    {
        foreach ($this->resettables as $resettable) {
            $resettable->reset();
        }
    }
}
