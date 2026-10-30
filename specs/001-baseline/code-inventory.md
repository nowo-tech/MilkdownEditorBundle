# Milkdown Editor Bundle — baseline code inventory

**Package**: `nowo-tech/milkdown-editor-bundle`  
**Last audited**: 2026-10-30  
**Production units**: **78/78**  
**Audit command**: `find src -type f \( -name '*.php' -o -name '*.twig' -o -name '*.yaml' -o -name '*.ts' -o -name '*.css' \) -not -path 'src/Resources/assets/tests/*' -not -path 'src/Resources/public/*' | wc -l`

## Scope notes

- Vitest files under `src/Resources/assets/tests/` are **excluded** (test code, not shipped behaviour).
- `src/Resources/public/` (`milkdown-editor.js`, `milkdown-editor.css`, `chunks/`, `assets/`) is the Vite **build output** of `src/Resources/assets/src/index.ts` (`FR-BUILD-001`), not separate units.
- `demo/` and `.symfony/` (Flex recipe) are out of inventory scope.

## Coverage summary

| Category | Mapped |
| --- | ---: |
| Bundle, configuration & DI | 8 |
| Form type & CSP | 4 |
| PHP Markdown renderer | 30 |
| Twig & form theme | 2 |
| Translations | 7 |
| Browser: dialect | 3 |
| Browser: nodes & plugins | 6 |
| Browser: previews, collaboration & features | 6 |
| Browser: editor core | 12 |
| **Total** | **78** |

## Bundle, configuration & DI

| Path | Spec section | Req IDs |
| --- | --- | --- |
| `src/DependencyInjection/Compiler/TwigPathsPass.php` | Bundle, configuration & DI — @NowoMilkdownEditorBundle namespace + app overrides | FR-CFG-001 |
| `src/DependencyInjection/Configuration.php` | Bundle, configuration & DI — Config tree: profiles, default profile, markdown renderer options | FR-CFG-002 |
| `src/DependencyInjection/NowoMilkdownEditorExtension.php` | Bundle, configuration & DI — Loads services, parameters; prepends asset package and form theme | FR-CFG-003 |
| `src/Feature.php` | Bundle, configuration & DI — Feature enum | FR-CFG-004 |
| `src/NowoMilkdownEditorBundle.php` | Bundle, configuration & DI — Bundle class; registers TwigPathsPass | FR-CFG-005 |
| `src/ProfileRegistry.php` | Bundle, configuration & DI — Named profiles | FR-CFG-006 |
| `src/Resources/config/services.php` | Bundle, configuration & DI — Service wiring and interface aliases | FR-CFG-007 |
| `src/Theme.php` | Bundle, configuration & DI — Theme enum | FR-CFG-008 |

## Form type & CSP

| Path | Spec section | Req IDs |
| --- | --- | --- |
| `src/Csp/CspNonceProviderInterface.php` | Form type & CSP — Nonce provider contract | FR-FORM-001 |
| `src/Csp/RequestAttributeCspNonceProvider.php` | Form type & CSP — Default nonce provider (request attribute) | FR-FORM-002 |
| `src/Form/DataTransformer/MarkdownNewlineTransformer.php` | Form type & CSP — LF line endings | FR-FORM-003 |
| `src/Form/MilkdownEditorType.php` | Form type & CSP — Form type: options, normalisers, widget JSON, UI strings | FR-FORM-004 |

## PHP Markdown renderer

| Path | Spec section | Req IDs |
| --- | --- | --- |
| `src/Markdown/DialectRenderer.php` | PHP Markdown renderer — DialectRenderer.php | FR-MD-001 |
| `src/Markdown/Directive/DirectiveAttributes.php` | PHP Markdown renderer — DirectiveAttributes.php | FR-MD-002 |
| `src/Markdown/Directive/DirectiveRendererInterface.php` | PHP Markdown renderer — DirectiveRendererInterface.php | FR-MD-003 |
| `src/Markdown/DocumentProcessor.php` | PHP Markdown renderer — DocumentProcessor.php | FR-MD-004 |
| `src/Markdown/MarkdownRendererInterface.php` | PHP Markdown renderer — MarkdownRendererInterface.php | FR-MD-005 |
| `src/Markdown/MilkdownDialectExtension.php` | PHP Markdown renderer — MilkdownDialectExtension.php | FR-MD-006 |
| `src/Markdown/MilkdownMarkdownRenderer.php` | PHP Markdown renderer — MilkdownMarkdownRenderer.php | FR-MD-007 |
| `src/Markdown/Node/ContainerDirective.php` | PHP Markdown renderer — ContainerDirective.php | FR-MD-008 |
| `src/Markdown/Node/LeafDirective.php` | PHP Markdown renderer — LeafDirective.php | FR-MD-009 |
| `src/Markdown/Node/Math.php` | PHP Markdown renderer — Math.php | FR-MD-010 |
| `src/Markdown/Node/MathBlock.php` | PHP Markdown renderer — MathBlock.php | FR-MD-011 |
| `src/Markdown/Node/Mention.php` | PHP Markdown renderer — Mention.php | FR-MD-012 |
| `src/Markdown/Node/TablerIcon.php` | PHP Markdown renderer — TablerIcon.php | FR-MD-013 |
| `src/Markdown/Node/TextDirective.php` | PHP Markdown renderer — TextDirective.php | FR-MD-014 |
| `src/Markdown/Node/WikiLink.php` | PHP Markdown renderer — WikiLink.php | FR-MD-015 |
| `src/Markdown/Parser/ContainerDirectiveParser.php` | PHP Markdown renderer — ContainerDirectiveParser.php | FR-MD-016 |
| `src/Markdown/Parser/DialectInlineParser.php` | PHP Markdown renderer — DialectInlineParser.php | FR-MD-017 |
| `src/Markdown/Parser/DirectiveBlockStartParser.php` | PHP Markdown renderer — DirectiveBlockStartParser.php | FR-MD-018 |
| `src/Markdown/Parser/LeafDirectiveParser.php` | PHP Markdown renderer — LeafDirectiveParser.php | FR-MD-019 |
| `src/Markdown/Parser/MathBlockParser.php` | PHP Markdown renderer — MathBlockParser.php | FR-MD-020 |
| `src/Markdown/Parser/MathInlineParser.php` | PHP Markdown renderer — MathInlineParser.php | FR-MD-021 |
| `src/Markdown/Parser/TextDirectiveParser.php` | PHP Markdown renderer — TextDirectiveParser.php | FR-MD-022 |
| `src/Markdown/Resolver/AllowlistIconResolver.php` | PHP Markdown renderer — AllowlistIconResolver.php | FR-MD-023 |
| `src/Markdown/Resolver/IconResolverInterface.php` | PHP Markdown renderer — IconResolverInterface.php | FR-MD-024 |
| `src/Markdown/Resolver/NullPageResolver.php` | PHP Markdown renderer — NullPageResolver.php | FR-MD-025 |
| `src/Markdown/Resolver/NullUserResolver.php` | PHP Markdown renderer — NullUserResolver.php | FR-MD-026 |
| `src/Markdown/Resolver/PageResolverInterface.php` | PHP Markdown renderer — PageResolverInterface.php | FR-MD-027 |
| `src/Markdown/Resolver/ResolvedPage.php` | PHP Markdown renderer — ResolvedPage.php | FR-MD-028 |
| `src/Markdown/Resolver/ResolvedUser.php` | PHP Markdown renderer — ResolvedUser.php | FR-MD-029 |
| `src/Markdown/Resolver/UserResolverInterface.php` | PHP Markdown renderer — UserResolverInterface.php | FR-MD-030 |

## Twig & form theme

| Path | Spec section | Req IDs |
| --- | --- | --- |
| `src/Resources/views/Form/milkdown_editor_theme.html.twig` | Twig & form theme — milkdown_editor_widget block | FR-TWIG-001 |
| `src/Twig/MilkdownEditorTwig.php` | Twig & form theme — milkdown_markdown filter, nowo_milkdown_editor_assets() | FR-TWIG-002 |

## Translations

| Path | Spec section | Req IDs |
| --- | --- | --- |
| `src/Resources/translations/NowoMilkdownEditorBundle.de.yaml` | Translations — NowoMilkdownEditorBundle.de.yaml | FR-I18N-001 |
| `src/Resources/translations/NowoMilkdownEditorBundle.en.yaml` | Translations — NowoMilkdownEditorBundle.en.yaml | FR-I18N-002 |
| `src/Resources/translations/NowoMilkdownEditorBundle.es.yaml` | Translations — NowoMilkdownEditorBundle.es.yaml | FR-I18N-003 |
| `src/Resources/translations/NowoMilkdownEditorBundle.fr.yaml` | Translations — NowoMilkdownEditorBundle.fr.yaml | FR-I18N-004 |
| `src/Resources/translations/NowoMilkdownEditorBundle.it.yaml` | Translations — NowoMilkdownEditorBundle.it.yaml | FR-I18N-005 |
| `src/Resources/translations/NowoMilkdownEditorBundle.nl.yaml` | Translations — NowoMilkdownEditorBundle.nl.yaml | FR-I18N-006 |
| `src/Resources/translations/NowoMilkdownEditorBundle.pt.yaml` | Translations — NowoMilkdownEditorBundle.pt.yaml | FR-I18N-007 |

## Browser: dialect

| Path | Spec section | Req IDs |
| --- | --- | --- |
| `src/Resources/assets/src/dialect/directives.ts` | Browser: dialect — directives.ts | FR-DIALECT-001 |
| `src/Resources/assets/src/dialect/patterns.ts` | Browser: dialect — patterns.ts | FR-DIALECT-002 |
| `src/Resources/assets/src/dialect/remark-dialect.ts` | Browser: dialect — remark-dialect.ts | FR-DIALECT-003 |

## Browser: nodes & plugins

| Path | Spec section | Req IDs |
| --- | --- | --- |
| `src/Resources/assets/src/nodes/directives.ts` | Browser: nodes & plugins — directives.ts | FR-EDIT-001 |
| `src/Resources/assets/src/nodes/inline-refs.ts` | Browser: nodes & plugins — inline-refs.ts | FR-EDIT-002 |
| `src/Resources/assets/src/nodes/task-list.ts` | Browser: nodes & plugins — task-list.ts | FR-EDIT-003 |
| `src/Resources/assets/src/plugins/a11y.ts` | Browser: nodes & plugins — a11y.ts | FR-EDIT-004 |
| `src/Resources/assets/src/plugins/keyboard.ts` | Browser: nodes & plugins — keyboard.ts | FR-EDIT-005 |
| `src/Resources/assets/src/plugins/suggest.ts` | Browser: nodes & plugins — suggest.ts | FR-EDIT-006 |

## Browser: previews, collaboration & features

| Path | Spec section | Req IDs |
| --- | --- | --- |
| `src/Resources/assets/src/collab/index.ts` | Browser: previews, collaboration & features — index.ts | FR-LAZY-001 |
| `src/Resources/assets/src/collab/mercure-provider.ts` | Browser: previews, collaboration & features — mercure-provider.ts | FR-LAZY-002 |
| `src/Resources/assets/src/features/code.ts` | Browser: previews, collaboration & features — code.ts | FR-LAZY-003 |
| `src/Resources/assets/src/preview/highlight.ts` | Browser: previews, collaboration & features — highlight.ts | FR-LAZY-004 |
| `src/Resources/assets/src/preview/mermaid.ts` | Browser: previews, collaboration & features — mermaid.ts | FR-LAZY-005 |
| `src/Resources/assets/src/preview/render.ts` | Browser: previews, collaboration & features — render.ts | FR-LAZY-006 |

## Browser: editor core

| Path | Spec section | Req IDs |
| --- | --- | --- |
| `src/Resources/assets/src/editor.ts` | Browser: editor core — editor.ts | FR-TS-001 |
| `src/Resources/assets/src/emoji.ts` | Browser: editor core — emoji.ts | FR-TS-002 |
| `src/Resources/assets/src/features.ts` | Browser: editor core — features.ts | FR-TS-003 |
| `src/Resources/assets/src/i18n.ts` | Browser: editor core — i18n.ts | FR-TS-004 |
| `src/Resources/assets/src/index.ts` | Browser: editor core — index.ts | FR-TS-005 |
| `src/Resources/assets/src/link-titles.ts` | Browser: editor core — link-titles.ts | FR-TS-006 |
| `src/Resources/assets/src/options.ts` | Browser: editor core — options.ts | FR-TS-007 |
| `src/Resources/assets/src/runtime.ts` | Browser: editor core — runtime.ts | FR-TS-008 |
| `src/Resources/assets/src/styles/milkdown-editor.css` | Browser: editor core — milkdown-editor.css | FR-TS-009 |
| `src/Resources/assets/src/triggers.ts` | Browser: editor core — triggers.ts | FR-TS-010 |
| `src/Resources/assets/src/types.ts` | Browser: editor core — types.ts | FR-TS-011 |
| `src/Resources/assets/src/upload.ts` | Browser: editor core — upload.ts | FR-TS-012 |

## Build outputs

| Output | Source | Req IDs |
| --- | --- | --- |
| `src/Resources/public/milkdown-editor.js` + `chunks/` + `assets/` | `src/Resources/assets/src/index.ts` (Vite library, ES module) | FR-BUILD-001 |
| `src/Resources/public/milkdown-editor.css` | `src/Resources/assets/src/styles/milkdown-editor.css` | FR-BUILD-002 |
