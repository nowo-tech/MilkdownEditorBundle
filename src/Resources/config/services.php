<?php

declare(strict_types=1);

use Nowo\MilkdownEditorBundle\Csp\CspNonceProviderInterface;
use Nowo\MilkdownEditorBundle\Csp\RequestAttributeCspNonceProvider;
use Nowo\MilkdownEditorBundle\Diff\MarkdownDiffRenderer;
use Nowo\MilkdownEditorBundle\Diff\MarkdownDiffRendererInterface;
use Nowo\MilkdownEditorBundle\Form\MilkdownEditorType;
use Nowo\MilkdownEditorBundle\Markdown\Directive\DirectiveRendererInterface;
use Nowo\MilkdownEditorBundle\Markdown\HostSchemes;
use Nowo\MilkdownEditorBundle\Markdown\MarkdownRendererInterface;
use Nowo\MilkdownEditorBundle\Markdown\MilkdownMarkdownRenderer;
use Nowo\MilkdownEditorBundle\Markdown\Resolver\AllowlistIconResolver;
use Nowo\MilkdownEditorBundle\Markdown\Resolver\FilePreviewResolverInterface;
use Nowo\MilkdownEditorBundle\Markdown\Resolver\HostFileResolverInterface;
use Nowo\MilkdownEditorBundle\Markdown\Resolver\IconResolverInterface;
use Nowo\MilkdownEditorBundle\Markdown\Resolver\NullPageResolver;
use Nowo\MilkdownEditorBundle\Markdown\Resolver\NullUserResolver;
use Nowo\MilkdownEditorBundle\Markdown\Resolver\PageResolverInterface;
use Nowo\MilkdownEditorBundle\Markdown\Resolver\TablerCatalog;
use Nowo\MilkdownEditorBundle\Markdown\Resolver\TemplateFilePreviewResolver;
use Nowo\MilkdownEditorBundle\Markdown\Resolver\TemplateHostFileResolver;
use Nowo\MilkdownEditorBundle\Markdown\Resolver\UserResolverInterface;
use Nowo\MilkdownEditorBundle\ProfileRegistry;
use Nowo\MilkdownEditorBundle\Twig\MilkdownEditorTwig;
use Nowo\MilkdownEditorBundle\Twig\MilkdownViewTwig;
use Symfony\Component\DependencyInjection\Loader\Configurator\ContainerConfigurator;

use function Symfony\Component\DependencyInjection\Loader\Configurator\param;
use function Symfony\Component\DependencyInjection\Loader\Configurator\service;
use function Symfony\Component\DependencyInjection\Loader\Configurator\tagged_iterator;

/*
 * Services of nowo-tech/milkdown-editor-bundle. The resolver and nonce interfaces are aliases: point them at the
 * host's implementations (see docs/USAGE.md).
 */
return static function (ContainerConfigurator $container): void {
    $services = $container->services()
        ->defaults()
            ->private();

    $services->instanceof(DirectiveRendererInterface::class)
        ->tag('nowo_milkdown_editor.directive_renderer');

    $services->set(ProfileRegistry::class)
        ->args([param('nowo_milkdown_editor.profiles'), param('nowo_milkdown_editor.default_profile')]);

    $services->set(RequestAttributeCspNonceProvider::class)
        ->args([service('request_stack')->nullOnInvalid()]);
    $services->alias(CspNonceProviderInterface::class, RequestAttributeCspNonceProvider::class);

    $services->set(NullPageResolver::class);
    $services->alias(PageResolverInterface::class, NullPageResolver::class);
    $services->set(NullUserResolver::class);
    $services->alias(UserResolverInterface::class, NullUserResolver::class);
    $services->set(TablerCatalog::class)->args([service('assets.packages')->nullOnInvalid()]);
    $services->set(AllowlistIconResolver::class)->args([null, [], null]);
    $services->alias(IconResolverInterface::class, AllowlistIconResolver::class);

    // 1.9: host references (`markdown.host_schemes`) and file previews; point the interfaces at the host's resolvers
    // to check the viewer and give per-viewer URLs.
    $services->set(HostSchemes::class)->args([[], []]);
    $services->set(TemplateHostFileResolver::class)->args([service(HostSchemes::class)]);
    $services->alias(HostFileResolverInterface::class, TemplateHostFileResolver::class);
    $services->set(TemplateFilePreviewResolver::class)->args([service(HostSchemes::class)]);
    $services->alias(FilePreviewResolverInterface::class, TemplateFilePreviewResolver::class);

    $services->set(MilkdownMarkdownRenderer::class)
        ->args([
            '$options'            => [],
            '$pages'              => service(PageResolverInterface::class),
            '$users'              => service(UserResolverInterface::class),
            '$icons'              => service(IconResolverInterface::class),
            '$directiveRenderers' => tagged_iterator('nowo_milkdown_editor.directive_renderer'),
            '$translator'         => service('translator')->nullOnInvalid(),
            '$logger'             => service('logger')->nullOnInvalid(),
            '$secret'             => '%kernel.secret%',
            '$hostSchemes'        => service(HostSchemes::class),
            '$sources'            => service(HostFileResolverInterface::class),
            '$previews'           => service(FilePreviewResolverInterface::class),
        ])
        ->tag('monolog.logger', ['channel' => 'nowo_milkdown_editor'])
        // 1.2.1: per-request footnote render counters (FootnoteSalt) are cleared between requests (worker mode).
        ->tag('kernel.reset', ['method' => 'reset']);
    $services->alias(MarkdownRendererInterface::class, MilkdownMarkdownRenderer::class)->public();

    // 1.6: rendered diff of two versions; the same renderer (per-viewer resolvers), nothing cached.
    $services->set(MarkdownDiffRenderer::class)
        ->args([service(MarkdownRendererInterface::class), service('translator')->nullOnInvalid()]);
    $services->alias(MarkdownDiffRendererInterface::class, MarkdownDiffRenderer::class)->public();

    $services->set(MilkdownEditorType::class)
        ->args([
            service(ProfileRegistry::class),
            service(CspNonceProviderInterface::class)->nullOnInvalid(),
            service('translator')->nullOnInvalid(),
        ])
        ->arg('$hostSchemes', service(HostSchemes::class))
        ->tag('form.type');

    $services->set(MilkdownEditorTwig::class)
        ->args([service(MarkdownRendererInterface::class), service('assets.packages'), service(CspNonceProviderInterface::class)->nullOnInvalid(), service('translator')->nullOnInvalid(), service(HostSchemes::class)])
        ->autoconfigure();

    // 1.6: `nowo_milkdown_view()` / `nowo_milkdown_diff()` (only when symfony/form's factory is available).
    $services->set(MilkdownViewTwig::class)
        ->args([service(MarkdownDiffRendererInterface::class), service('form.factory')->nullOnInvalid()])
        ->autoconfigure();
};
