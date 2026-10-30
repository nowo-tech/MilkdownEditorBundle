# Installation

## Table of contents

- [Requirements](#requirements)
- [Install with Composer](#install-with-composer)
- [Register the bundle](#register-the-bundle)
- [Publish the assets](#publish-the-assets)
- [Twig Extra](#twig-extra)
- [Content Security Policy](#content-security-policy)
- [Symfony Flex recipe](#symfony-flex-recipe)
- [FrankenPHP](#frankenphp)

## Requirements

- PHP 8.2–8.5 (Symfony 8.x needs PHP 8.4+)
- Symfony 7.4 or 8.x: FrameworkBundle, Form, TwigBundle, Asset
- Twig 3.21+ with `twig/extra-bundle` and `twig/string-extra`
- league/commonmark 2.7+

## Install with Composer

```bash
composer require nowo-tech/milkdown-editor-bundle
```

## Register the bundle

With Symfony Flex the recipe registers the bundle and adds `config/packages/nowo_milkdown_editor.yaml`. Without it:

```php
// config/bundles.php
return [
    // ...
    Twig\Extra\TwigExtraBundle\TwigExtraBundle::class => ['all' => true],
    Nowo\MilkdownEditorBundle\NowoMilkdownEditorBundle::class => ['all' => true],
];
```

## Publish the assets

The editor is a pre-built ES module with lazy chunks in `src/Resources/public/`. Publish it:

```bash
php bin/console assets:install public
```

The bundle registers the `nowo_milkdown_editor` asset package (`/bundles/nowomilkdowneditor`). The form theme
adds the stylesheet and `<script type="module">` itself; on pages that only render Markdown with Mermaid or math,
add them with `{{ nowo_milkdown_editor_assets() }}` (never hard-code `/bundles/...`; the files resolve through
`asset('milkdown-editor.js', 'nowo_milkdown_editor')`).

## Twig Extra

The bundle requires `twig/extra-bundle` and `twig/string-extra`; register `TwigExtraBundle` as shown above.

## Content Security Policy

The editor works under a strict policy such as:

```
script-src 'self' 'nonce-RANDOM'; style-src-elem 'self' 'nonce-RANDOM'; style-src-attr 'unsafe-inline';
img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self'
```

Give it the response nonce: set the `csp_nonce` request attribute (read by the default
`RequestAttributeCspNonceProvider`), alias `Nowo\MilkdownEditorBundle\Csp\CspNonceProviderInterface` to your own
provider, or pass the `csp_nonce` form option. `style-src-attr 'unsafe-inline'` is needed by ProseMirror, KaTeX and
Mermaid layout attributes. See [SECURITY.md](SECURITY.md).

## Symfony Flex recipe

The recipe lives in `.symfony/recipe/nowo-tech/milkdown-editor-bundle/1.0/` (bundle registration, default
configuration and a post-install note about `assets:install`).

## FrankenPHP

The bundle keeps no request state in services and works in worker mode without extra configuration. See
[FRANKENPHP-WORKER-AUDIT.md](FRANKENPHP-WORKER-AUDIT.md) and [DEMO-FRANKENPHP.md](DEMO-FRANKENPHP.md).
