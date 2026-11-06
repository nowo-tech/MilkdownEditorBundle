<?php

declare(strict_types=1);

namespace App\Controller;

use App\Demo\DemoDirectory;
use Nowo\MilkdownEditorBundle\Form\MilkdownEditorType;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\ResponseHeaderBag;
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

        :::callout{icon="alert-triangle" type="warning"}
        Freeze **merges** on Friday. :mark[Highlight]{color="green"} the :mark[risky]{text="red"} ones.
        :::

        ::: {bg="blue"}
        Coloured block: release owners only.
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

        Euler: $e^{i\pi} + 1 = 0$[^euler]

        [^euler]: Euler's identity.

        MD;

    /** Sniffed image types => stored extension (no SVG: it can carry scripts). */
    private const IMAGES = ['image/png' => 'png', 'image/jpeg' => 'jpg', 'image/gif' => 'gif', 'image/webp' => 'webp'];

    /** Sniffed document types => stored extension. */
    private const DOCUMENTS = [
        'application/pdf' => 'pdf',
        'text/plain'      => 'txt',
        'text/csv'        => 'csv',
        'application/csv' => 'csv',
        'application/zip' => 'zip',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document' => 'docx',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'       => 'xlsx',
    ];

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

    /**
     * DEMO ONLY — see docs/SECURITY.md › Uploads and docs/USAGE.md › Uploads before writing your own endpoint.
     *
     * Upload endpoint (1.8 contract `{url, name, size, type, kind}`): the server decides the kind from the sniffed MIME
     * type (never the client's), images and an allow-list of documents only, 2 MiB, stored outside public/ under a
     * random name with an extension from the allow-list, served by {@see self::uploaded()} with nosniff,
     * `Content-Disposition: attachment` for documents and `Content-Security-Policy: sandbox`.
     *
     * What a real endpoint adds and this demo does not: authentication and the right to edit the field's object
     * (CSRF alone only proves the form came from this site), a quota and a rate limit per user, a retention / cleanup
     * policy (the demo keeps files in the system's temporary directory), and ideally a separate cookie-less origin for the files.
     */
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
        // The sniffed type of the bytes (fileinfo), never the client's Content-Type nor the file name.
        $mime      = (string) (new \finfo(\FILEINFO_MIME_TYPE))->file($file->getPathname());
        $extension = self::IMAGES[$mime] ?? self::DOCUMENTS[$mime] ?? null;
        if ($extension === null) {
            return $this->json(['error' => 'Type not allowed'], Response::HTTP_UNSUPPORTED_MEDIA_TYPE);
        }
        // libmagic reads small CSV files as text/plain: keep the .csv of a plain-text file named so (still text, same
        // serving rules), so the card shows a sheet, as the target's extension decides (audit GR-I1).
        if ($extension === 'txt' && str_ends_with(strtolower($file->getClientOriginalName()), '.csv')) {
            $extension = 'csv';
        }
        $size = (int) $file->getSize();
        $name = bin2hex(random_bytes(8)) . '.' . $extension;
        $file->move(self::uploadDir($this->getParameter('kernel.project_dir')), $name);

        return $this->json([
            // 1.9 (ME-5): `?reference=1` answers with a host reference (`/files`), resolved by the bundle's host scheme.
            'url'  => $request->query->getBoolean('reference') ? 'demo-file:' . $name : '/uploads/' . $name,
            'name' => mb_substr($file->getClientOriginalName(), 0, 200),
            'size' => $size,
            'type' => $mime,
            'kind' => isset(self::IMAGES[$mime]) ? 'image' : 'file',
        ]);
    }

    /**
     * DEMO ONLY: serves an uploaded file with the headers docs/SECURITY.md › Uploads requires — `nosniff`,
     * `Content-Security-Policy: sandbox`, `Content-Disposition: attachment` for anything that is not a raster image —
     * and the type stored at upload time (never sniffed again by the browser). The name is the random one the upload
     * gave (the route requirement rejects anything else, no path is built from user input).
     */
    #[Route('/uploads/{name}', name: 'demo_uploaded', requirements: ['name' => '[0-9a-f]{16}\\.(?:png|jpg|gif|webp|pdf|txt|csv|zip|docx|xlsx)'], methods: ['GET'])]
    public function uploaded(string $name): Response
    {
        $path = self::uploadDir((string) $this->getParameter('kernel.project_dir')) . '/' . $name;
        if (!is_file($path)) {
            throw $this->createNotFoundException();
        }
        $extension = pathinfo($name, \PATHINFO_EXTENSION);
        $type      = array_search($extension, self::IMAGES, true) ?: array_search($extension, self::DOCUMENTS, true) ?: 'application/octet-stream';
        $image     = in_array($extension, self::IMAGES, true);
        $response  = new BinaryFileResponse($path, 200, ['Content-Type' => $type]);
        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('Content-Security-Policy', 'sandbox');
        $response->setContentDisposition($image ? ResponseHeaderBag::DISPOSITION_INLINE : ResponseHeaderBag::DISPOSITION_ATTACHMENT, $name);

        return $response;
    }

    /**
     * 1.9 (ME-5, ME-6): host references. Images and files are stored as `demo-file:<id>` (the upload answers with one);
     * the bundle resolves them through `markdown.host_schemes`. Also shows what cannot be resolved.
     */
    #[Route('/files', name: 'demo_files', methods: ['GET', 'POST'])]
    public function files(Request $request): Response
    {
        if ($request->query->get('devtools') === '0') {
            $this->profiler?->disable();
        }
        $form = $this->createFormBuilder(['body' => "Host files\n\n![broken](demo-file:..)\n\n"])
            ->add('body', MilkdownEditorType::class, [
                'label'             => 'demo.body',
                'profile'           => 'files',
                'upload_url'        => '/api/upload?reference=1',
                'upload_csrf_token' => $this->csrf->getToken('milkdown_upload')->getValue(),
            ])
            ->add('save', SubmitType::class, ['label' => 'demo.save'])
            ->getForm();
        $form->handleRequest($request);

        return $this->render('demo/files.html.twig', [
            'form'  => $form,
            'saved' => $form->isSubmitted() && $form->isValid() ? $form->getData() : null,
        ]);
    }

    /**
     * DEMO ONLY: the preview endpoint of `markdown.host_schemes` (`/uploads/{name}/preview`), embedded by file cards with
     * `view="preview"`: what docs/USAGE.md › Previews asks from a host. Text and CSV files as an escaped page; nothing
     * else has a preview (404). `sandbox` also in the CSP, no scripts, `nosniff`, framed by this site only. A real host
     * also checks that the viewer may read the file, and caps the size.
     */
    #[Route('/uploads/{name}/preview', name: 'demo_uploaded_preview', requirements: ['name' => '[0-9a-f]{16}\\.(?:txt|csv)'], methods: ['GET'])]
    public function uploadedPreview(string $name): Response
    {
        $path = self::uploadDir((string) $this->getParameter('kernel.project_dir')) . '/' . $name;
        if (!is_file($path)) {
            throw $this->createNotFoundException();
        }
        $text = (string) file_get_contents($path, false, null, 0, 65536);

        return new Response('<!doctype html><html lang="en"><title>Preview</title><pre>' . htmlspecialchars($text, \ENT_QUOTES | \ENT_SUBSTITUTE) . '</pre></html>', 200, [
            'Content-Type'            => 'text/html; charset=UTF-8',
            'Content-Security-Policy' => "sandbox; default-src 'none'; frame-ancestors 'self'",
            'X-Content-Type-Options'  => 'nosniff',
            'Referrer-Policy'         => 'no-referrer',
        ]);
    }

    /** Outside the project: FrankenPHP's `hot_reload` watches its images and would morph the page after an upload. */
    private static function uploadDir(mixed $projectDir): string
    {
        return sys_get_temp_dir() . '/milkdown-demo-uploads-' . md5(is_string($projectDir) ? $projectDir : '');
    }

    /**
     * ME-1: editors inside a transformed ancestor, under a sticky header (z-index 100) and in a modal dialog; their
     * menus must render on top, at the pointer (top layer). `action_bar_insert: []` (ME-2) on these fields.
     */
    #[Route('/layers', name: 'demo_layers', methods: ['GET'])]
    public function layers(Request $request): Response
    {
        if ($request->query->get('devtools') === '0') {
            $this->profiler?->disable();
        }
        $field = static fn (string $label): array => ['label' => $label, 'profile' => 'wiki', 'action_bar_insert' => []];
        $form  = $this->createFormBuilder(['transformed' => "# Transformed\n\nRight-click this paragraph.", 'sticky' => "# Sticky\n\nRight-click this paragraph.", 'dialog' => "# Dialog\n\nRight-click this paragraph."])
            ->add('transformed', MilkdownEditorType::class, $field('demo.layers.transformed'))
            ->add('sticky', MilkdownEditorType::class, $field('demo.layers.sticky'))
            ->add('dialog', MilkdownEditorType::class, $field('demo.layers.dialog'))
            ->getForm();

        return $this->render('demo/layers.html.twig', ['form' => $form->createView()]);
    }
}
