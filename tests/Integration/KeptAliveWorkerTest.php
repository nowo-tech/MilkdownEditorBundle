<?php

declare(strict_types=1);

namespace Nowo\MilkdownEditorBundle\Tests\Integration;

use Nowo\MilkdownEditorBundle\Markdown\MarkdownRendererInterface;
use Nowo\MilkdownEditorBundle\Markdown\MilkdownMarkdownRenderer;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Event\ConsoleCommandEvent;
use Symfony\Component\Console\Event\ConsoleTerminateEvent;
use Symfony\Component\Console\Input\ArrayInput;
use Symfony\Component\Console\Output\NullOutput;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\HttpKernelInterface;
use Symfony\Component\HttpKernel\TerminableInterface;
use Symfony\Contracts\EventDispatcher\Event;

use function gc_collect_cycles;
use function memory_get_usage;
use function preg_match;
use function restore_exception_handler;

/**
 * REQ-RUNTIME-002: one kept-alive kernel where the services resetter never runs.
 *
 * HTTP: `http_kernel` handle / terminate directly (never `Kernel::handle()`, which runs `services_resetter`), two users'
 * notes in alternation. Messenger / console: the worker and console events dispatched by name around each render, as
 * `messenger:consume --no-reset` and a long-running command do. Each user's note must get the same footnote ids every
 * time (stored HTML, ETags), never ids derived from what earlier requests rendered, and memory must stay flat.
 */
final class KeptAliveWorkerTest extends TestCase
{
    private const REQUESTS = 1000;

    private const MESSAGES = 500;

    private const BOUNDARIES = [
        ['Symfony\\Component\\Messenger\\Event\\WorkerMessageReceivedEvent', 'Symfony\\Component\\Messenger\\Event\\WorkerMessageHandledEvent'],
        ['Symfony\\Component\\Messenger\\Event\\WorkerMessageReceivedEvent', 'Symfony\\Component\\Messenger\\Event\\WorkerMessageFailedEvent'],
        ['console.command', 'console.terminate'],
    ];

    private ?TestKernel $kernel = null;

    protected function tearDown(): void
    {
        if ($this->kernel instanceof TestKernel) {
            $this->kernel->shutdown();
            restore_exception_handler();
        }
        $this->kernel = null;
        parent::tearDown();
    }

    #[Test]
    public function keptAliveHttpWorkerRendersEachNoteWithStableFootnoteIds(): void
    {
        $http = $this->boot()->getContainer()->get('http_kernel');
        self::assertInstanceOf(HttpKernelInterface::class, $http);
        self::assertInstanceOf(TerminableInterface::class, $http);
        $ids    = [];
        $before = 0;

        for ($i = 0; $i < self::REQUESTS; ++$i) {
            $user     = $i % 2 === 0 ? 'alice' : 'bob';
            $request  = Request::create('/note', 'GET', ['user' => $user]);
            $response = $http->handle($request);
            $html     = (string) $response->getContent();
            self::assertSame(200, $response->getStatusCode());
            self::assertStringContainsString('Private to ' . $user . '.', $html, 'request #' . $i);
            self::assertStringNotContainsString($user === 'alice' ? 'bob' : 'alice', $html, 'request #' . $i);
            $ids[$user] ??= $this->footnoteId($html);
            self::assertSame($ids[$user], $this->footnoteId($html), 'request #' . $i . ': same note, same footnote ids');
            $http->terminate($request, $response);

            if ($i === 99) {
                gc_collect_cycles();
                $before = memory_get_usage();
            }
        }

        self::assertNotSame($ids['alice'], $ids['bob']);
        gc_collect_cycles();
        self::assertLessThan(2 * 1024 * 1024, memory_get_usage() - $before, 'Memory must stay flat over 900 requests.');
    }

    #[Test]
    public function messengerAndConsoleUnitsWithoutResetRenderWithStableFootnoteIds(): void
    {
        $container = $this->boot()->getContainer()->get('test.service_container');
        self::assertInstanceOf(ContainerInterface::class, $container);
        $dispatcher = $container->get('event_dispatcher');
        self::assertInstanceOf(EventDispatcherInterface::class, $dispatcher);
        $renderer = $container->get(MarkdownRendererInterface::class);
        self::assertInstanceOf(MarkdownRendererInterface::class, $renderer);
        $ids = [];

        for ($i = 0; $i < self::MESSAGES; ++$i) {
            $user          = $i % 2 === 0 ? 'alice' : 'bob';
            [$start, $end] = self::BOUNDARIES[$i % 3];
            $dispatcher->dispatch($this->event($start), $start);
            $html = $renderer->render('Note of ' . $user . "[^1].\n\n[^1]: Private to " . $user . '.');
            $dispatcher->dispatch($this->event($end), $end);
            $ids[$user] ??= $this->footnoteId($html);
            self::assertSame($ids[$user], $this->footnoteId($html), 'unit #' . $i);
        }
    }

    #[Test]
    public function aBoundaryNeverBuildsTheRenderer(): void
    {
        $kernel    = $this->boot();
        $container = $kernel->getContainer()->get('test.service_container');
        self::assertInstanceOf(ContainerInterface::class, $container);
        $dispatcher = $container->get('event_dispatcher');
        self::assertInstanceOf(EventDispatcherInterface::class, $dispatcher);

        $dispatcher->dispatch($this->event('console.terminate'), 'console.terminate');

        self::assertFalse($container->initialized(MilkdownMarkdownRenderer::class));
    }

    private function boot(): TestKernel
    {
        $this->kernel = new TestKernel('test', false, []);
        $this->kernel->boot();

        return $this->kernel;
    }

    /**
     * The console events carry their command (Symfony's console listeners type them); the Messenger ones are dispatched
     * by name only (no Messenger listener in this kernel).
     */
    private function event(string $name): object
    {
        $command = new Command('app:worker-probe');

        return match ($name) {
            'console.command'   => new ConsoleCommandEvent($command, new ArrayInput([]), new NullOutput()),
            'console.terminate' => new ConsoleTerminateEvent($command, new ArrayInput([]), new NullOutput(), Command::SUCCESS),
            default             => new Event(),
        };
    }

    private function footnoteId(string $html): string
    {
        self::assertSame(1, preg_match('/id="(nowo-md-fn-[0-9a-f]{12}-1)"/', $html, $match), 'footnote rendered');

        return $match[1];
    }
}
