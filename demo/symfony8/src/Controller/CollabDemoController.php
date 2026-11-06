<?php

declare(strict_types=1);

namespace App\Controller;

use Nowo\MilkdownEditorBundle\Form\MilkdownEditorType;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Profiler\Profiler;
use Symfony\Component\Routing\Attribute\Route;

/**
 * 1.10 demo: a form with collaboration on and a hub that does not answer (`/collab/hub` is a 404), so the page shows the
 * connecting state and then the fallback to editing without collaboration. The endpoints are stateless: an empty
 * document this client is told to seed. A real host (WikiBundle) stores the Yjs log and publishes through Mercure; the
 * e2e replaces the hub and the state answer to cover the other cases.
 */
final class CollabDemoController extends AbstractController
{
    public const BODY = 'Original body';

    public function __construct(
        // Not `?profiler`: that is taken as a service id, so this was always null and `?devtools=0` never disabled anything.
        #[Autowire(service: 'profiler')]
        private readonly ?Profiler $profiler = null,
    ) {
    }

    #[Route('/collab', name: 'demo_collab', methods: ['GET', 'POST'])]
    public function page(Request $request): Response
    {
        if ($request->query->get('devtools') === '0') {
            $this->profiler?->disable();
        }
        $collaboration = [
            'url'     => '/collab/api',
            'hub_url' => '/collab/hub',
            'topic'   => 'urn:demo:collab',
            'user'    => ['name' => 'Ada', 'color' => '#1f6f54'],
        ];
        if ($request->query->has('connect_timeout')) {
            $collaboration['connect_timeout_ms'] = $request->query->getInt('connect_timeout');
        }
        $form = $this->createFormBuilder(['body' => self::BODY])
            ->add('body', MilkdownEditorType::class, ['label' => 'demo.body', 'profile' => 'wiki', 'collaboration' => $collaboration])
            ->add('save', SubmitType::class, ['label' => 'demo.save'])
            ->getForm();
        $form->handleRequest($request);

        return $this->render('demo/collab.html.twig', [
            'form'  => $form,
            'saved' => $form->isSubmitted() && $form->isValid() ? $form->getData() : null,
        ]);
    }

    #[Route('/collab/api/{action}', name: 'demo_collab_api', requirements: ['action' => 'token|update|awareness|compact|corrupt'], methods: ['POST'])]
    public function post(): Response
    {
        return new Response(null, Response::HTTP_NO_CONTENT);
    }

    #[Route('/collab/api/state', name: 'demo_collab_state', methods: ['GET'])]
    public function state(): JsonResponse
    {
        return $this->json(['state' => 'AAA=', 'seed' => true]);
    }
}
