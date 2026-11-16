<?php

declare(strict_types=1);

namespace App\Controller;

use App\Demo\DemoDirectory;
use App\Demo\DemoSections;
use App\Form\MilkdownDemoType;
use Nowo\MilkdownEditorBundle\Form\MilkdownEditorType;
use Nowo\MilkdownEditorBundle\Markdown\HeadingAnchorLinks;
use Nowo\MilkdownEditorBundle\Markdown\MarkdownRendererInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Contracts\Translation\TranslatorInterface;

use function array_filter;
use function array_slice;
use function array_values;
use function is_array;
use function is_string;
use function mb_strlen;
use function stripos;

/**
 * 1.18: stable heading ids and the link picker (`link_picker`, `stable_heading_ids`) with mock host endpoints, and the
 * read view with "link to this section" anchors (HeadingAnchorLinks, no JavaScript needed).
 */
final class LinkPickerDemoController extends AbstractController
{
    private const SAMPLE = <<<'MD'
        # Linking to sections

        Press **Ctrl+K**, use the link button or type `[[` to open the picker; see [[wiki:5d2c8a1e-7f0b-4a5e-b6c9-2e4d1f0a9b33#setup]].

        ## Overview

        Rename this heading: its id stays, and the Markdown keeps it as `{#overview}`.

        ## Año nuevo {#año}

        A Unicode id. [Back to the overview](#nowo-h-overview).

        MD;

    /** Pages of another wiki of the same tenant (`others`). */
    private const HANDBOOK = ['8e1d7c3b-2a4f-4b6e-9c0d-1f2e3a4b5c6d' => 'Release process', 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d' => 'Incident runbook'];

    public function __construct(
        private readonly DemoDirectory $directory,
        private readonly DemoSections $sections,
        private readonly MarkdownRendererInterface $renderer,
        private readonly TranslatorInterface $translator,
    ) {
    }

    #[Route('/links', name: 'demo_links', methods: ['GET', 'POST'])]
    public function links(Request $request): Response
    {
        $form = $this->createForm(MilkdownDemoType::class, ['body' => self::SAMPLE], [
            'editors' => [
                'body' => [
                    'label'          => 'demo.links.body',
                    'profile'        => 'links',
                    'suggestions'    => ['[[' => '/api/link-candidates'],
                    'link_sections'  => '/api/link-candidates/{id}/sections',
                    'link_title_url' => '/api/pages/titles',
                ],
            ],
        ]);
        $form->handleRequest($request);
        $data = $form->getData();
        $body = is_array($data) && is_string($data['body'] ?? null) ? $data['body'] : self::SAMPLE;
        $html = HeadingAnchorLinks::decorate(
            $this->renderer->render($body),
            $this->translator->trans('heading.anchor_link', [], MilkdownEditorType::DOMAIN),
            $request->getUri(),
        );

        return $this->render('demo/links.html.twig', ['form' => $form, 'preview' => $html]);
    }

    /**
     * The picker's candidates: title matches in this wiki, then (from 2 characters) other wikis of the same tenant.
     */
    #[Route('/api/link-candidates', name: 'demo_api_link_candidates', methods: ['GET'])]
    public function candidates(Request $request): JsonResponse
    {
        $q      = $request->query->getString('q');
        $here   = array_values(array_filter($this->directory->searchPages($q), static fn (array $p): bool => !isset(self::HANDBOOK[$p['id']])));
        $others = [];
        if (mb_strlen($q) >= 2) {
            $pages = [];
            foreach (self::HANDBOOK as $id => $title) {
                if (stripos($title, $q) !== false) {
                    $pages[] = ['id' => $id, 'label' => $title, 'url' => '/pages/' . $id];
                }
            }
            if ($pages !== []) {
                $others[] = ['wiki' => 'Handbook', 'pages' => array_slice($pages, 0, 3)];
            }
        }
        $response = $this->json(['here' => array_slice($here, 0, 10), 'others' => $others]);
        $response->headers->set('Cache-Control', 'private, no-store');

        return $response;
    }

    /** The sections of a readable page; 404 for an unknown or unreadable one. */
    #[Route('/api/link-candidates/{pageId}/sections', name: 'demo_api_link_sections', methods: ['GET'])]
    public function sections(string $pageId): JsonResponse
    {
        $sections = $this->sections->sectionsOf($pageId);
        $response = $sections === [] ? $this->json(['error' => 'not_found'], 404) : $this->json(['sections' => $sections]);
        $response->headers->set('Cache-Control', 'private, no-store');

        return $response;
    }
}
