<?php

declare(strict_types=1);

namespace App\Controller;

use Nowo\MilkdownEditorBundle\Comment\CommentAnchor;
use Nowo\MilkdownEditorBundle\Comment\InvalidCommentAnchorException;
use Nowo\MilkdownEditorBundle\Form\MilkdownEditorType;
use Nowo\MilkdownEditorBundle\Markdown\MarkdownRendererInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Profiler\Profiler;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Csrf\CsrfToken;
use Symfony\Component\Security\Csrf\CsrfTokenManagerInterface;

/**
 * 1.6 demo: inline comments (the thread component on host endpoints kept in the session), a version view and a
 * rendered diff. A real host (WikiBundle) stores threads in its database and checks rights on every call.
 */
final class CommentsDemoController extends AbstractController
{
    private const OLD = "# Deploy checklist\n\nTag the release, then deploy to staging.\n\n- Run the smoke tests\n- Ask @ada\n";
    private const NEW = "# Deploy checklist\n\nTag the release, then deploy to production after staging.\n\n- Run the smoke tests\n- Ask @ada\n\nRoll back with the previous tag.\n";
    private const KEY = 'demo_comment_threads';

    public function __construct(
        private readonly CsrfTokenManagerInterface $csrf,
        private readonly MarkdownRendererInterface $renderer,
        #[Autowire(service: '?profiler')]
        private readonly ?Profiler $profiler = null,
    ) {
    }

    #[Route('/comments', name: 'demo_comments', methods: ['GET'])]
    public function page(Request $request): Response
    {
        if ($request->query->get('devtools') === '0') {
            $this->profiler?->disable();
        }
        $dark = $request->query->get('theme') === 'dark';
        $form = $this->createFormBuilder(['body' => self::NEW])
            ->add('body', MilkdownEditorType::class, [
                'label'    => 'demo.body',
                'profile'  => 'wiki',
                'theme'    => $dark ? 'dark' : 'auto',
                'features' => ['toolbar', 'link_tooltip', 'placeholder', 'cursor', 'context_menu', 'comments', 'heading_ids'],
                'comments' => ['url' => '/comments/api', 'csrf_token' => $this->csrf->getToken('milkdown_comments')->getValue(), 'panel' => 'margin'],
            ])
            ->getForm();

        return $this->render('demo/comments.html.twig', ['form' => $form, 'old' => self::OLD, 'new' => self::NEW, 'dark' => $dark]);
    }

    #[Route('/comments/api/threads', name: 'demo_comments_list', methods: ['GET'])]
    public function list(Request $request): JsonResponse
    {
        $threads = $this->threads($request);
        $refs    = static fn (bool $page): array => array_values(array_map(static fn (array $t): array => array_intersect_key($t, array_flip(['id', 'anchor', 'resolved', 'count', 'updatedAt'])), array_filter($threads, static fn (array $t): bool => ($t['anchor'] === null) === $page)));

        return $this->json(['threads' => $refs(false), 'page' => $refs(true)]);
    }

    #[Route('/comments/api/threads/{id}', name: 'demo_comments_get', methods: ['GET'], requirements: ['id' => '[a-f0-9]{16}'])]
    public function get(Request $request, string $id): JsonResponse
    {
        $threads = $this->threads($request);

        return isset($threads[$id]) ? $this->json($this->view($threads[$id])) : $this->json([], Response::HTTP_NOT_FOUND);
    }

    #[Route('/comments/api/threads', name: 'demo_comments_create', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        if (($error = $this->guard($request)) !== null) {
            return $error;
        }
        $data = $request->toArray();
        try {
            $anchor = ($data['anchor'] ?? null) === null ? null : CommentAnchor::fromArray($data['anchor'])->toArray();
        } catch (InvalidCommentAnchorException) {
            return $this->json(['error' => 'Invalid anchor'], Response::HTTP_UNPROCESSABLE_ENTITY);
        }
        $id      = bin2hex(random_bytes(8));
        $threads = $this->threads($request);
        $threads[$id] = ['id' => $id, 'anchor' => $anchor, 'resolved' => false, 'count' => 0, 'updatedAt' => gmdate('Y-m-d\TH:i:s\Z'), 'comments' => []];
        $threads[$id] = $this->add($threads[$id], (string) ($data['body'] ?? ''));

        return $this->save($request, $threads, $id, Response::HTTP_CREATED);
    }

    #[Route('/comments/api/threads/{id}/comments', name: 'demo_comments_reply', methods: ['POST'], requirements: ['id' => '[a-f0-9]{16}'])]
    public function reply(Request $request, string $id): JsonResponse
    {
        $threads = $this->threads($request);
        if (($error = $this->guard($request)) !== null || !isset($threads[$id])) {
            return $error ?? $this->json([], Response::HTTP_NOT_FOUND);
        }
        $threads[$id] = $this->add($threads[$id], (string) ($request->toArray()['body'] ?? ''));

        return $this->save($request, $threads, $id);
    }

    #[Route('/comments/api/threads/{id}', name: 'demo_comments_patch', methods: ['PATCH'], requirements: ['id' => '[a-f0-9]{16}'])]
    public function patch(Request $request, string $id): JsonResponse
    {
        $threads = $this->threads($request);
        if (($error = $this->guard($request)) !== null || !isset($threads[$id])) {
            return $error ?? $this->json([], Response::HTTP_NOT_FOUND);
        }
        $data = $request->toArray();
        if (isset($data['anchor'])) {
            if (($data['base'] ?? null) !== $threads[$id]['updatedAt']) {
                return $this->json([], Response::HTTP_CONFLICT);
            }
            try {
                $threads[$id]['anchor'] = CommentAnchor::fromArray($data['anchor'])->toArray();
            } catch (InvalidCommentAnchorException) {
                return $this->json([], Response::HTTP_UNPROCESSABLE_ENTITY);
            }
        }
        if (isset($data['resolved'])) {
            $threads[$id]['resolved'] = $data['resolved'] === true;
        }
        $threads[$id]['updatedAt'] = gmdate('Y-m-d\TH:i:s\Z');

        return $this->save($request, $threads, $id);
    }

    #[Route('/comments/api/comments/{cid}', name: 'demo_comments_delete', methods: ['DELETE'], requirements: ['cid' => '[a-f0-9]{16}'])]
    public function delete(Request $request, string $cid): JsonResponse
    {
        if (($error = $this->guard($request)) !== null) {
            return $error;
        }
        $threads = $this->threads($request);
        foreach ($threads as $id => $thread) {
            $comments = array_values(array_filter($thread['comments'], static fn (array $c): bool => $c['id'] !== $cid));
            if (\count($comments) === \count($thread['comments'])) {
                continue;
            }
            if ($comments === []) {
                unset($threads[$id]);
                $request->getSession()->set(self::KEY, $threads);

                return $this->json(null, Response::HTTP_NO_CONTENT);
            }
            $threads[$id]['comments'] = $comments;
            $threads[$id]['count']    = \count($comments);

            return $this->save($request, $threads, $id);
        }

        return $this->json([], Response::HTTP_NOT_FOUND);
    }

    private function guard(Request $request): ?JsonResponse
    {
        return $this->csrf->isTokenValid(new CsrfToken('milkdown_comments', $request->headers->get('X-CSRF-Token')))
            ? null
            : $this->json(['error' => 'Invalid CSRF token'], Response::HTTP_FORBIDDEN);
    }

    /**
     * @return array<string, array<string, mixed>>
     */
    private function threads(Request $request): array
    {
        /** @var array<string, array<string, mixed>> */
        return $request->getSession()->get(self::KEY, []);
    }

    /**
     * @param array<string, mixed> $thread
     *
     * @return array<string, mixed>
     */
    private function add(array $thread, string $body): array
    {
        $thread['comments'][] = ['id' => bin2hex(random_bytes(8)), 'body' => mb_substr(trim($body), 0, 10000), 'createdAt' => gmdate('Y-m-d\TH:i:s\Z')];
        $thread['count']      = \count($thread['comments']);
        $thread['updatedAt']  = gmdate('Y-m-d\TH:i:s\Z');

        return $thread;
    }

    /**
     * @param array<string, array<string, mixed>> $threads
     */
    private function save(Request $request, array $threads, string $id, int $status = Response::HTTP_OK): JsonResponse
    {
        $request->getSession()->set(self::KEY, $threads);

        return $this->json($this->view($threads[$id]), $status);
    }

    /**
     * The thread as the component expects it (bodies rendered by the bundle's safe renderer).
     *
     * @param array<string, mixed> $thread
     *
     * @return array<string, mixed>
     */
    private function view(array $thread): array
    {
        $thread['comments'] = array_map(fn (array $c): array => [
            'id'        => $c['id'],
            'author'    => ['name' => 'Demo user', 'color' => '#1f6f54'],
            'html'      => $this->renderer->render($c['body']),
            'createdAt' => $c['createdAt'],
            'reactions' => [],
            'can'       => ['edit' => false, 'delete' => true],
        ], $thread['comments']);
        $thread['can'] = ['reply' => true, 'resolve' => true, 'react' => false];

        return $thread;
    }
}
