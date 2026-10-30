<?php

declare(strict_types=1);

use Nowo\MilkdownEditorBundle\Csp\CspNonceProviderInterface;
use Nowo\MilkdownEditorBundle\Csp\RequestAttributeCspNonceProvider;
use Nowo\MilkdownEditorBundle\Form\MilkdownEditorType;
use Nowo\MilkdownEditorBundle\Markdown\Directive\DirectiveRendererInterface;
use Nowo\MilkdownEditorBundle\Markdown\MarkdownRendererInterface;
use Nowo\MilkdownEditorBundle\Markdown\MilkdownMarkdownRenderer;
use Nowo\MilkdownEditorBundle\Markdown\Resolver\AllowlistIconResolver;
use Nowo\MilkdownEditorBundle\Markdown\Resolver\IconResolverInterface;
use Nowo\MilkdownEditorBundle\Markdown\Resolver\NullPageResolver;
use Nowo\MilkdownEditorBundle\Markdown\Resolver\NullUserResolver;
use Nowo\MilkdownEditorBundle\Markdown\Resolver\PageResolverInterface;
use Nowo\MilkdownEditorBundle\Markdown\Resolver\UserResolverInterface;
use Nowo\MilkdownEditorBundle\ProfileRegistry;
use Nowo\MilkdownEditorBundle\Twig\MilkdownEditorTwig;
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
    $services->set(AllowlistIconResolver::class)->args([null, []]);
    $services->alias(IconResolverInterface::class, AllowlistIconResolver::class);

    $services->set(MilkdownMarkdownRenderer::class)
        ->args([
            '$options'            => [],
            '$pages'              => service(PageResolverInterface::class),
            '$users'              => service(UserResolverInterface::class),
            '$icons'              => service(IconResolverInterface::class),
            '$directiveRenderers' => tagged_iterator('nowo_milkdown_editor.directive_renderer'),
            '$translator'         => service('translator')->nullOnInvalid(),
            '$logger'             => service('logger')->nullOnInvalid(),
        ])
        ->tag('monolog.logger', ['channel' => 'nowo_milkdown_editor']);
    $services->alias(MarkdownRendererInterface::class, MilkdownMarkdownRenderer::class)->public();

    $services->set(MilkdownEditorType::class)
        ->args([
            service(ProfileRegistry::class),
            service(CspNonceProviderInterface::class)->nullOnInvalid(),
            service('translator')->nullOnInvalid(),
        ])
        ->tag('form.type');

    $services->set(MilkdownEditorTwig::class)
        ->args([service(MarkdownRendererInterface::class), service('assets.packages'), service(CspNonceProviderInterface::class)->nullOnInvalid()])
        ->autoconfigure();
};
