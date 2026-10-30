<?php

declare(strict_types=1);

namespace App\Controller;

use App\Demo\DemoDirectory;
use Nowo\MilkdownEditorBundle\Form\MilkdownEditorType;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Profiler\Profiler;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Csrf\CsrfToken;
use Symfony\Component\Security\Csrf\CsrfTokenManagerInterface;

/**
 * Demo pages: the editor (wiki and comment profiles), the rendered preview and the JSON endpoints the editor calls
 * (candidates, page titles per viewer, uploads).
 */
final class DemoController extends AbstractController
{
    private const SAMPLE = <<<'MD'
        # Release notes

        Ask @ada about [[wiki:0b6f4f0e-3c55-4d0a-9a43-1f7a2c9e8d10#setup]] before :tabler-bolt: shipping; the
        [[wiki:c0ffee00-1234-4abc-8def-001122334455]] stays hidden for you.

        :::callout{type="warning"}
        Freeze **merges** on Friday. :mark[Highlight]{color="green"} the risky ones.
        :::

        * [x] Changelog
        * [ ] Tag

        | Step | Owner |
        | ---- | ----- |
        | Tag  | @grace |

        ```mermaid
        graph LR
          A[Merge] --> B[Tag] --> C[Deploy]
        ```

        Euler: $e^{i\pi} + 1 = 0$

        MD;

    public function __construct(
        private readonly DemoDirectory $directory,
        private readonly CsrfTokenManagerInterface $csrf,
        #[Autowire(service: '?profiler')]
        private readonly ?Profiler $profiler = null,
    ) {
    }

    #[Route('/', name: 'demo_home', methods: ['GET', 'POST'])]
    public function home(Request $request): Response
    {
        // `?devtools=0`: no WebProfiler toolbar (its inline assets), so the e2e can assert 0 CSP violations page-wide.
        if ($request->query->get('devtools') === '0') {
            $this->profiler?->disable();
        }
        $form = $this->createFormBuilder(['title' => 'Release process', 'body' => self::SAMPLE, 'comment' => 'Thanks @grace :tabler-star:'])
            ->add('title', TextType::class, ['label' => 'demo.title'])
            ->add('body', MilkdownEditorType::class, [
                'label'             => 'demo.body',
                'profile'           => 'wiki',
                'theme'             => $request->query->get('theme') === 'dark' ? 'dark' : 'auto',
                'suggestions'       => ['@' => '/api/users', '[[' => '/api/pages'],
                'link_title_url'    => '/api/pages/titles',
                'upload_url'        => '/api/upload',
                'upload_csrf_token' => $this->csrf->getToken('milkdown_upload')->getValue(),
            ])
            ->add('comment', MilkdownEditorType::class, [
                'label'       => 'demo.comment',
                'profile'     => 'comment',
                'suggestions' => ['@' => '/api/users'],
            ])
            ->add('save', SubmitType::class, ['label' => 'demo.save'])
            ->getForm();
        $form->handleRequest($request);

        return $this->render('demo/home.html.twig', [
            'form'  => $form,
            'saved' => $form->isSubmitted() && $form->isValid() ? $form->getData() : null,
            'dark'  => $request->query->get('theme') === 'dark',
        ]);
    }

    #[Route('/api/pages', name: 'demo_api_pages', methods: ['GET'])]
    public function pages(Request $request): JsonResponse
    {
        return $this->json($this->directory->searchPages($request->query->getString('q')));
    }

    #[Route('/api/pages/titles', name: 'demo_api_page_titles', methods: ['GET'])]
    public function titles(Request $request): JsonResponse
    {
        $ids  = array_slice(array_filter(explode(',', $request->query->getString('ids'))), 0, 50);
        $out  = [];
        foreach ($this->directory->resolvePages($ids) as $id => $page) {
            $out[] = ['id' => $id, 'title' => $page->title, 'url' => $page->url, 'visible' => true];
        }

        return $this->json($out);
    }

    #[Route('/api/users', name: 'demo_api_users', methods: ['GET'])]
    public function users(Request $request): JsonResponse
    {
        return $this->json($this->directory->searchUsers($request->query->getString('q')));
    }

    #[Route('/api/upload', name: 'demo_api_upload', methods: ['POST'])]
    public function upload(Request $request): JsonResponse
    {
        if (!$this->csrf->isTokenValid(new CsrfToken('milkdown_upload', $request->headers->get('X-CSRF-Token')))) {
            return $this->json(['error' => 'Invalid CSRF token'], Response::HTTP_FORBIDDEN);
        }
        $file = $request->files->get('file');
        if (!$file instanceof UploadedFile || !$file->isValid() || $file->getSize() > 2097152) {
            return $this->json(['error' => 'Invalid file'], Response::HTTP_UNPROCESSABLE_ENTITY);
        }
        $mime  = (string) $file->getMimeType();
        $image = \in_array($mime, ['image/png', 'image/jpeg', 'image/gif', 'image/webp'], true);
        $name  = bin2hex(random_bytes(8)) . '.' . ($image ? (string) $file->guessExtension() : 'bin');
        $file->move($this->getParameter('kernel.project_dir') . '/public/uploads', $name);

        return $this->json(['url' => '/uploads/' . $name, 'name' => $file->getClientOriginalName(), 'image' => $image]);
    }
}
