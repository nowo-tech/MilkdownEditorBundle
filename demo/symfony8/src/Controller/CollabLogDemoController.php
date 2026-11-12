<?php

declare(strict_types=1);

namespace App\Controller;

use App\Form\MilkdownDemoType;
use RuntimeException;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Profiler\Profiler;
use Symfony\Component\Routing\Attribute\Route;

use function is_string;

use const JSON_THROW_ON_ERROR;
use const LOCK_EX;
use const LOCK_UN;

/**
 * 1.11 demo: a small host with a stored log, to race a session save against a peer's update for real: requests are
 * separate workers on one file, under a lock. It keeps WikiBundle's rules: sequence numbers grow but are not consecutive; a
 * save outside the session is refused while the log has updates past the saved number (`?replace=1` confirms); a session
 * save records the number its text includes. `?legacy=1` is a host that knows nothing of those numbers; `?save_delay=<ms>`
 * widens a save. Not a model for storage: a real host uses its database.
 */
final class CollabLogDemoController extends AbstractController
{
    private const FIELD       = '_nowo_milkdown_collab';
    private const SEQ_FIELD   = '_nowo_milkdown_collab_seq';
    private const EPOCH_FIELD = '_nowo_milkdown_collab_epoch';
    private const DOC         = '[a-z0-9-]{1,40}';
    private const EMPTY       = ['body' => 'Original body', 'updates' => [], 'seq' => 0, 'saved' => 0, 'claim' => null, 'revisions' => [], 'epoch' => 'first'];

    public function __construct(
        #[Autowire(service: 'profiler')]
        private readonly ?Profiler $profiler = null,
    ) {
    }

    #[Route('/collab/log/{doc}', name: 'demo_collab_log', requirements: ['doc' => self::DOC], methods: ['GET', 'POST'])]
    public function page(Request $request, string $doc): Response
    {
        if ($request->query->get('devtools') === '0') {
            $this->profiler?->disable();
        }
        $topic         = 'urn:demo:log:' . $doc;
        $legacy        = $request->query->has('legacy') ? '?legacy=1' : '';
        $collaboration = ['url' => '/collab/log/' . $doc . '/api', 'hub_url' => '/collab/hub', 'topic' => $topic, 'user' => ['name' => 'Ada', 'color' => '#1f6f54']];
        if ($legacy !== '') {
            $collaboration['url'] .= '/legacy';
        }
        if ($request->query->has('connect_timeout')) {
            $collaboration['connect_timeout_ms'] = $request->query->getInt('connect_timeout');
        }
        $form = $this->createForm(MilkdownDemoType::class, ['body' => $this->locked($doc, static fn (array $log): array => [$log, $log['body']])], [
            'editors' => ['body' => ['label' => 'demo.body', 'profile' => 'wiki', 'collaboration' => $collaboration]],
        ]);
        $form->handleRequest($request);
        $status = Response::HTTP_OK;
        if ($form->isSubmitted() && $form->isValid()) {
            /** @var array{body: string|null} $data */
            $data = $form->getData();
            // A real save takes time between reading the form and recording it; that is the window being raced.
            usleep(1000 * min(1000, $request->query->getInt('save_delay')));
            $session = $request->request->get(self::FIELD) === $topic;
            $sent    = $request->request->get(self::SEQ_FIELD);
            $text    = (string) $data['body'];
            $replace = $request->query->has('replace');
            $useSeq  = $legacy === '';
            $epoch   = $useSeq ? $request->request->get(self::EPOCH_FIELD) : null;
            $status  = $this->locked($doc, static function (array $log) use ($session, $sent, $text, $replace, $useSeq, $epoch): array {
                // Text from a log that has been replaced: it asks, whatever the log holds now (HV-M1).
                if (is_string($epoch) && $epoch !== $log['epoch'] && !$replace) {
                    return [$log, Response::HTTP_CONFLICT];
                }
                if (!$session && !$replace && $log['seq'] > $log['saved']) {
                    return [$log, Response::HTTP_CONFLICT];
                }
                $log['body']        = $text;
                $log['revisions'][] = $text;
                if ($session) {
                    $seq          = $useSeq && is_string($sent) && ctype_digit($sent) ? min((int) $sent, $log['seq']) : $log['seq'];
                    $log['saved'] = max($log['saved'], $seq);
                } else {
                    $log = ['updates' => [], 'seq' => 0, 'saved' => 0, 'claim' => null, 'epoch' => bin2hex(random_bytes(8))] + $log;
                }

                return [$log, Response::HTTP_FOUND];
            });
        }

        return $this->render('demo/collab_log.html.twig', ['form' => $form, 'status' => $status], new Response(null, $status === Response::HTTP_FOUND ? Response::HTTP_OK : $status));
    }

    #[Route('/collab/log/{doc}/info', name: 'demo_collab_log_info', requirements: ['doc' => self::DOC], methods: ['GET'])]
    public function info(string $doc): JsonResponse
    {
        return $this->json($this->locked($doc, static fn (array $log): array => [$log, $log]));
    }

    #[Route('/collab/log/{doc}/api/{legacy}token', name: 'demo_collab_log_token', requirements: ['doc' => self::DOC, 'legacy' => '(legacy/)?'], defaults: ['legacy' => ''], methods: ['POST'])]
    public function token(Request $request, string $doc): Response
    {
        $client = (string) $request->headers->get('X-Nowo-Collab-Client');
        $sent   = $request->headers->get('X-Nowo-Collab-Epoch');
        $this->locked($doc, static function (array $log) use ($client, $sent): array {
            if ($log['updates'] === [] && ($sent === null || $sent === $log['epoch'])) {
                $log['claim'] ??= $client;
            }

            return [$log, null];
        });

        return new Response(null, Response::HTTP_NO_CONTENT);
    }

    #[Route('/collab/log/{doc}/api/{legacy}state', name: 'demo_collab_log_state', requirements: ['doc' => self::DOC, 'legacy' => '(legacy/)?'], defaults: ['legacy' => ''], methods: ['GET'])]
    public function state(Request $request, string $doc, string $legacy): JsonResponse
    {
        $client = (string) $request->headers->get('X-Nowo-Collab-Client');

        return $this->json($this->locked($doc, static fn (array $log): array => [$log, [
            'state'   => 'AAA=',
            'updates' => array_column($log['updates'], 'd'),
            'seq'     => $log['seq'],
            'seed'    => $log['updates'] === [] && $log['claim'] === $client,
        ] + ($legacy === '' ? ['epoch' => $log['epoch']] : [])]));
    }

    #[Route('/collab/log/{doc}/api/{legacy}update', name: 'demo_collab_log_update', requirements: ['doc' => self::DOC, 'legacy' => '(legacy/)?'], defaults: ['legacy' => ''], methods: ['POST'])]
    public function update(Request $request, string $doc, string $legacy): Response
    {
        /** @var array{d?: string, e?: string} $body */
        $body   = $request->toArray();
        $stored = $this->locked($doc, static function (array $log) use ($body): array {
            if (isset($body['e']) && $body['e'] !== $log['epoch']) {
                return [$log, null];
            }
            $previous = $log['seq'];
            // Like a shared auto-increment: growing, with gaps.
            $log['seq'] += random_int(1, 3);
            $log['updates'][] = ['s' => $log['seq'], 'd' => (string) ($body['d'] ?? '')];

            return [$log, ['s' => $log['seq'], 'p' => $previous]];
        });

        if ($stored === null) {
            return $this->json(['error' => 'log_epoch'], Response::HTTP_CONFLICT);
        }

        return $legacy === '' ? $this->json($stored) : new Response(null, Response::HTTP_NO_CONTENT);
    }

    #[Route('/collab/log/{doc}/api/{legacy}awareness', name: 'demo_collab_log_awareness', requirements: ['doc' => self::DOC, 'legacy' => '(legacy/)?'], defaults: ['legacy' => ''], methods: ['POST'])]
    public function awareness(): Response
    {
        return new Response(null, Response::HTTP_NO_CONTENT);
    }

    /**
     * Reads the log, runs the work and writes the result, all under a lock on its file.
     *
     * @template T
     *
     * @param callable(array{body: string, updates: list<array{s: int, d: string}>, seq: int, saved: int, claim: string|null, revisions: list<string>, epoch: string}): array{0: array<string, mixed>, 1: T} $work
     *
     * @return T
     */
    private function locked(string $doc, callable $work): mixed
    {
        $path = sys_get_temp_dir() . '/milkdown-demo-log-' . $doc . '.json';
        $file = fopen($path, 'c+');
        if ($file === false) {
            throw new RuntimeException('Cannot open the demo log.');
        }
        flock($file, LOCK_EX);
        try {
            $read = stream_get_contents($file);
            /** @var array{body: string, updates: list<array{s: int, d: string}>, seq: int, saved: int, claim: string|null, revisions: list<string>, epoch: string} $log */
            $log           = $read === '' || $read === false ? self::EMPTY : json_decode($read, true, flags: JSON_THROW_ON_ERROR);
            [$next, $back] = $work($log);
            ftruncate($file, 0);
            rewind($file);
            fwrite($file, json_encode($next, JSON_THROW_ON_ERROR));

            return $back;
        } finally {
            flock($file, LOCK_UN);
            fclose($file);
        }
    }
}
