# Milkdown Editor Bundle — baseline code inventory

**Package**: `nowo-tech/milkdown-editor-bundle`  
**Last audited**: 2026-11-16  
**Production units**: **145/145**  
**Audit command**: `find src -type f \( -name '*.php' -o -name '*.twig' -o -name '*.yaml' -o -name '*.ts' -o -name '*.css' \) -not -path 'src/Resources/assets/tests/*' -not -path 'src/Resources/public/*' | wc -l`

## Scope notes

- Vitest files under `src/Resources/assets/tests/` are **excluded** (test code, not shipped behaviour).
- `src/Resources/public/` (`milkdown-editor.js`, `milkdown-editor.css`, `chunks/`, `katex/`) is the Vite **build output** of `src/Resources/assets/src/index.ts` (`FR-BUILD-001`), not separate units.
- `demo/` and `.symfony/` (Flex recipe) are out of inventory scope.

## Coverage summary

| Category | Mapped |
| --- | ---: |
| Bundle, configuration & DI | 9 |
| Form type & CSP | 4 |
| PHP Markdown renderer | 51 |
| Twig & form theme | 2 |
| Translations | 7 |
| Comments, versions & diff | 15 |
| Browser: dialect | 3 |
| Browser: nodes & plugins | 18 |
| Browser: icons | 8 |
| Browser: files, host references & images | 6 |
| Browser: previews, collaboration & features | 7 |
| Browser: editor core | 15 |
| **Total** | **145** |

## Bundle, configuration & DI

| Path | Spec section | Req IDs |
| --- | --- | --- |
| `src/DependencyInjection/Compiler/TwigPathsPass.php` | Bundle, configuration & DI — @NowoMilkdownEditorBundle namespace + app overrides | FR-CFG-002 |
| `src/DependencyInjection/Configuration.php` | Bundle, configuration & DI — Config tree: profiles, default profile, markdown renderer options | FR-CFG-001 |
| `src/DependencyInjection/NowoMilkdownEditorExtension.php` | Bundle, configuration & DI — Loads services, parameters; prepends asset package and form theme | FR-CFG-001, FR-CFG-002 |
| `src/EventListener/WorkerBoundaryResetListener.php` | Bundle, configuration & DI — Clears the per-page footnote counters at the main request, Messenger and console boundaries (1.16.1, REQ-RUNTIME-002) | FR-WORKER-001 |
| `src/Feature.php` | Bundle, configuration & DI — Feature enum | FR-CFG-001, FR-FORM-002 |
| `src/NowoMilkdownEditorBundle.php` | Bundle, configuration & DI — Bundle class; registers TwigPathsPass | FR-CFG-002 |
| `src/ProfileRegistry.php` | Bundle, configuration & DI — Named profiles | FR-CFG-001 |
| `src/Resources/config/services.php` | Bundle, configuration & DI — Service wiring and interface aliases | FR-CFG-001, FR-FORM-003, FR-MD-003 |
| `src/Theme.php` | Bundle, configuration & DI — Theme enum | FR-CFG-001 |

## Form type & CSP

| Path | Spec section | Req IDs |
| --- | --- | --- |
| `src/Csp/CspNonceProviderInterface.php` | Form type & CSP — Nonce provider contract | FR-FORM-003 |
| `src/Csp/RequestAttributeCspNonceProvider.php` | Form type & CSP — Default nonce provider (request attribute) | FR-FORM-003 |
| `src/Form/DataTransformer/MarkdownNewlineTransformer.php` | Form type & CSP — LF line endings | FR-FORM-002 |
| `src/Form/MilkdownEditorType.php` | Form type & CSP — Form type: options, normalisers, widget JSON, UI strings | FR-FORM-001, FR-FORM-002 |

## PHP Markdown renderer

| Path | Spec section | Req IDs |
| --- | --- | --- |
| `src/Markdown/DialectRenderer.php` | PHP Markdown renderer — DialectRenderer.php | FR-MD-001 |
| `src/Markdown/Directive/DirectiveAttributes.php` | PHP Markdown renderer — DirectiveAttributes.php | FR-MD-001, FR-MD-003 |
| `src/Markdown/Directive/DirectiveRendererInterface.php` | PHP Markdown renderer — DirectiveRendererInterface.php | FR-MD-003 |
| `src/Markdown/DocumentProcessor.php` | PHP Markdown renderer — DocumentProcessor.php | FR-MD-001, FR-MD-002, FR-MD-003 |
| `src/Markdown/EmojiRule.php` | PHP Markdown renderer — Callout `icon` emoji detection, bounded scan (1.7) | FR-ICON-005, FR-ICON-006 (spec 006) |
| `src/Markdown/FileCard.php` | PHP Markdown renderer — `::file[name]{href size type}` cards in the read-only render (1.8) | FR-CARD-001, FR-SEC-001 (spec 007) |
| `src/Markdown/FootnoteGuard.php` | PHP Markdown renderer — footnote label case and reference cap (1.2.1, CZ-L1) | FR-MD-001 |
| `src/Markdown/FootnoteSalt.php` | PHP Markdown renderer — per-document footnote id salt (1.2.1, CZ-I7) | FR-MD-001 |
| `src/Markdown/HeadingIds.php` | PHP Markdown renderer — `markdown.heading_ids`: heading slugs shared with the editor (1.6) | FR-HEADING-001 |
| `src/Markdown/HostSchemes.php` | PHP Markdown renderer — Allow-listed host URL schemes (`host-file:<id>`, 1.9) | FR-HOST-001, FR-HOST-002 (spec 008) |
| `src/Markdown/HostValue.php` | PHP Markdown renderer — A parsed host reference value and its resolution (1.9) | FR-HOST-002, FR-HOST-005 (spec 008) |
| `src/Markdown/ImageAttributes.php` | PHP Markdown renderer — Image attribute block `{width align}` (1.9, `image_block`) | FR-IMG-001 (spec 008) |
| `src/Markdown/MarkdownRendererInterface.php` | PHP Markdown renderer — MarkdownRendererInterface.php | FR-MD-001 |
| `src/Markdown/MilkdownDialectExtension.php` | PHP Markdown renderer — MilkdownDialectExtension.php | FR-MD-001 |
| `src/Markdown/MilkdownMarkdownRenderer.php` | PHP Markdown renderer — MilkdownMarkdownRenderer.php | FR-MD-001, FR-MD-002 |
| `src/Markdown/Node/ContainerDirective.php` | PHP Markdown renderer — ContainerDirective.php | FR-MD-001 |
| `src/Markdown/Node/HiddenReference.php` | PHP Markdown renderer — Host image the viewer may not read: *Content not visible* (1.9) | FR-HOST-005 (spec 008) |
| `src/Markdown/Node/ImageFigure.php` | PHP Markdown renderer — Standalone image as a figure with caption (1.9) | FR-IMG-001, FR-IMG-002 (spec 008) |
| `src/Markdown/Node/LeafDirective.php` | PHP Markdown renderer — LeafDirective.php | FR-MD-001 |
| `src/Markdown/Node/Math.php` | PHP Markdown renderer — Math.php | FR-MD-001 |
| `src/Markdown/Node/MathBlock.php` | PHP Markdown renderer — MathBlock.php | FR-MD-001 |
| `src/Markdown/Node/Mention.php` | PHP Markdown renderer — Mention.php | FR-MD-001 |
| `src/Markdown/Node/TablerIcon.php` | PHP Markdown renderer — TablerIcon.php | FR-MD-001 |
| `src/Markdown/Node/TextDirective.php` | PHP Markdown renderer — TextDirective.php | FR-MD-001 |
| `src/Markdown/Node/WikiLink.php` | PHP Markdown renderer — WikiLink.php | FR-MD-001 |
| `src/Markdown/Parser/ContainerDirectiveParser.php` | PHP Markdown renderer — ContainerDirectiveParser.php | FR-MD-001 |
| `src/Markdown/Parser/DialectInlineParser.php` | PHP Markdown renderer — DialectInlineParser.php | FR-MD-001 |
| `src/Markdown/Parser/DirectiveBlockStartParser.php` | PHP Markdown renderer — DirectiveBlockStartParser.php | FR-MD-001 |
| `src/Markdown/Parser/LeafDirectiveParser.php` | PHP Markdown renderer — LeafDirectiveParser.php | FR-MD-001 |
| `src/Markdown/Parser/MathBlockParser.php` | PHP Markdown renderer — MathBlockParser.php | FR-MD-001 |
| `src/Markdown/Parser/MathInlineParser.php` | PHP Markdown renderer — MathInlineParser.php | FR-MD-001 |
| `src/Markdown/Parser/TextDirectiveParser.php` | PHP Markdown renderer — TextDirectiveParser.php | FR-MD-001 |
| `src/Markdown/Resolver/AllowlistIconResolver.php` | PHP Markdown renderer — AllowlistIconResolver.php | FR-MD-001 |
| `src/Markdown/Resolver/ContextualHostFileResolverInterface.php` | PHP Markdown renderer — Host file resolver that also receives the render context (1.9) | FR-HOST-003 (spec 008) |
| `src/Markdown/Resolver/FilePreviewResolverInterface.php` | PHP Markdown renderer — Port: may this viewer see a preview of the file, and where (1.9) | FR-FILE-002 (spec 008) |
| `src/Markdown/Resolver/FileReference.php` | PHP Markdown renderer — VO: a file card that asks for a preview (1.9) | FR-FILE-001 (spec 008) |
| `src/Markdown/Resolver/HostFileResolverInterface.php` | PHP Markdown renderer — Port: resolves host references for the current viewer in one batch (1.9) | FR-HOST-003 (spec 008) |
| `src/Markdown/Resolver/IconResolverInterface.php` | PHP Markdown renderer — IconResolverInterface.php | FR-MD-001 |
| `src/Markdown/Resolver/NullPageResolver.php` | PHP Markdown renderer — NullPageResolver.php | FR-MD-002 |
| `src/Markdown/Resolver/NullUserResolver.php` | PHP Markdown renderer — NullUserResolver.php | FR-MD-002 |
| `src/Markdown/Resolver/PageResolverInterface.php` | PHP Markdown renderer — PageResolverInterface.php | FR-MD-002 |
| `src/Markdown/Resolver/RenderContextProviderInterface.php` | PHP Markdown renderer — Port: opaque render context handed to the contextual resolver (1.9) | FR-HOST-003 (spec 008) |
| `src/Markdown/Resolver/ResolvedFile.php` | PHP Markdown renderer — VO: a host file the viewer may read (URL, image URL) (1.9) | FR-HOST-003, FR-HOST-004 (spec 008) |
| `src/Markdown/Resolver/ResolvedPage.php` | PHP Markdown renderer — ResolvedPage.php | FR-MD-002 |
| `src/Markdown/Resolver/ResolvedUser.php` | PHP Markdown renderer — ResolvedUser.php | FR-MD-002 |
| `src/Markdown/Resolver/TablerCatalog.php` | PHP Markdown renderer — Bundled Tabler outline catalog names and sprite URLs (1.7, `icon_catalog`) | FR-ICON-002 (spec 006) |
| `src/Markdown/Resolver/TemplateFilePreviewResolver.php` | PHP Markdown renderer — Default preview resolver from scheme `preview` URL templates (1.9) | FR-FILE-002, FR-FILE-003 (spec 008) |
| `src/Markdown/Resolver/TemplateHostFileResolver.php` | PHP Markdown renderer — Default host resolver from scheme URL templates (1.9) | FR-HOST-003, FR-HOST-004 (spec 008) |
| `src/Markdown/Resolver/UserResolverInterface.php` | PHP Markdown renderer — UserResolverInterface.php | FR-MD-002 |
| `src/Markdown/TaskItemRenderer.php` | PHP Markdown renderer — Read-only task items with the editor markup (1.17) | FR-TASK-001 |
| `src/Markdown/TaskMarkerRenderer.php` | PHP Markdown renderer — named task-list checkboxes (1.3.1) | FR-MD-001 |

## Twig & form theme

| Path | Spec section | Req IDs |
| --- | --- | --- |
| `src/Resources/views/Form/milkdown_editor_theme.html.twig` | Twig & form theme — milkdown_editor_widget block | FR-TWIG-001 |
| `src/Twig/MilkdownEditorTwig.php` | Twig & form theme — milkdown_markdown filter, nowo_milkdown_editor_assets() | FR-TWIG-001 |

## Translations

| Path | Spec section | Req IDs |
| --- | --- | --- |
| `src/Resources/translations/NowoMilkdownEditorBundle.de.yaml` | Translations — NowoMilkdownEditorBundle.de.yaml | FR-I18N-001 |
| `src/Resources/translations/NowoMilkdownEditorBundle.en.yaml` | Translations — NowoMilkdownEditorBundle.en.yaml | FR-I18N-001 |
| `src/Resources/translations/NowoMilkdownEditorBundle.es.yaml` | Translations — NowoMilkdownEditorBundle.es.yaml | FR-I18N-001 |
| `src/Resources/translations/NowoMilkdownEditorBundle.fr.yaml` | Translations — NowoMilkdownEditorBundle.fr.yaml | FR-I18N-001 |
| `src/Resources/translations/NowoMilkdownEditorBundle.it.yaml` | Translations — NowoMilkdownEditorBundle.it.yaml | FR-I18N-001 |
| `src/Resources/translations/NowoMilkdownEditorBundle.nl.yaml` | Translations — NowoMilkdownEditorBundle.nl.yaml | FR-I18N-001 |
| `src/Resources/translations/NowoMilkdownEditorBundle.pt.yaml` | Translations — NowoMilkdownEditorBundle.pt.yaml | FR-I18N-001 |

## Comments, versions & diff

| Path | Spec section | Req IDs |
| --- | --- | --- |
| `src/Comment/CommentAnchor.php` | Comments, versions & diff — VO: comment anchor, contract v1 (1.6) | FR-COMMENT-001 |
| `src/Comment/InvalidCommentAnchorException.php` | Comments, versions & diff — Anchor that breaks the contract (hosts answer 422) (1.6) | FR-COMMENT-001 |
| `src/Diff/MarkdownDiff.php` | Comments, versions & diff — VO: result of a rendered diff (1.6) | FR-DIFF-001 |
| `src/Diff/MarkdownDiffRenderer.php` | Comments, versions & diff — Dialect-aware diff of two documents through the safe renderer (1.6) | FR-DIFF-001 |
| `src/Diff/MarkdownDiffRendererInterface.php` | Comments, versions & diff — Port of the diff renderer (1.6) | FR-DIFF-001 |
| `src/Resources/assets/src/comments/anchor.ts` | Comments, versions & diff — Anchor validation, canonical text, anchors of a range (1.6) | FR-COMMENT-001 |
| `src/Resources/assets/src/comments/avatar.ts` | Comments, versions & diff — Avatar URL policy and bubble markup (1.6) | FR-COMMENT-001 |
| `src/Resources/assets/src/comments/client.ts` | Comments, versions & diff — Host comment endpoints and answer validation (1.6) | FR-COMMENT-001 |
| `src/Resources/assets/src/comments/index.ts` | Comments, versions & diff — `comments` lazy chunk and `handle.comments` API (1.6) | FR-COMMENT-001 |
| `src/Resources/assets/src/comments/plugin.ts` | Comments, versions & diff — Thread highlight decorations and anchor resolution (1.6) | FR-COMMENT-001 |
| `src/Resources/assets/src/comments/sanitize.ts` | Comments, versions & diff — Host-rendered comment bodies parsed inert and allow-listed (1.6) | FR-COMMENT-001 |
| `src/Resources/assets/src/comments/thread-ui.ts` | Comments, versions & diff — Optional comment thread component (1.6) | FR-COMMENT-001 |
| `src/Resources/assets/src/diff-nav.ts` | Comments, versions & diff — Keyboard navigation of rendered diffs (1.6) | FR-DIFF-001 |
| `src/Resources/assets/src/version.ts` | Comments, versions & diff — `version_view` banner of a read-only old version (1.6) | FR-VERSION-001 |
| `src/Twig/MilkdownViewTwig.php` | Comments, versions & diff — `nowo_milkdown_view()` / `nowo_milkdown_diff()` Twig functions (1.6) | FR-VERSION-001, FR-DIFF-001 |

## Browser: dialect

| Path | Spec section | Req IDs |
| --- | --- | --- |
| `src/Resources/assets/src/dialect/directives.ts` | Browser: dialect — directives.ts | FR-DIALECT-001 |
| `src/Resources/assets/src/dialect/patterns.ts` | Browser: dialect — patterns.ts | FR-DIALECT-001 |
| `src/Resources/assets/src/dialect/remark-dialect.ts` | Browser: dialect — remark-dialect.ts | FR-DIALECT-001 |

## Browser: nodes & plugins

| Path | Spec section | Req IDs |
| --- | --- | --- |
| `src/Resources/assets/src/commands/blocks.ts` | Browser: nodes & plugins — blocks.ts (block commands) | FR-MENU-001 (spec 002) |
| `src/Resources/assets/src/commands/colors.ts` | Browser: nodes & plugins — colors.ts (inline and block colours) | FR-COLOR-001 (spec 003) |
| `src/Resources/assets/src/commands/insert.ts` | Browser: nodes & plugins — insert.ts (Insert group of the context menu) | FR-INSERT-001 (spec 004) |
| `src/Resources/assets/src/commands/markdown-clipboard.ts` | Browser: nodes & plugins — markdown-clipboard.ts (smart paste, Paste / Copy as Markdown) | FR-CLIP-001, FR-CLIP-002 (spec 004) |
| `src/Resources/assets/src/nodes/directives.ts` | Browser: nodes & plugins — directives.ts | FR-EDIT-001 |
| `src/Resources/assets/src/nodes/inline-refs.ts` | Browser: nodes & plugins — inline-refs.ts | FR-EDIT-001 |
| `src/Resources/assets/src/nodes/task-list.ts` | Browser: nodes & plugins — task-list.ts | FR-EDIT-001 |
| `src/Resources/assets/src/plugins/a11y.ts` | Browser: nodes & plugins — a11y.ts | FR-EDIT-003 |
| `src/Resources/assets/src/plugins/block-actions.ts` | Browser: nodes & plugins — block-actions.ts (handle, block menu, keys, drag) | FR-BLOCK-001 (spec 003) |
| `src/Resources/assets/src/plugins/context-menu.ts` | Browser: nodes & plugins — context-menu.ts (lazy chunk) | FR-MENU-001 (spec 002) |
| `src/Resources/assets/src/plugins/editable.ts` | Browser: nodes & plugins — Re-applies node views when the `editable` prop changes | FR-TS-001 |
| `src/Resources/assets/src/plugins/heading-ids.ts` | Browser: nodes & plugins — `heading_ids`: DOM ids on headings (1.6) | FR-HEADING-001 |
| `src/Resources/assets/src/plugins/heading-slug.ts` | Browser: nodes & plugins — Heading slugs shared with the PHP renderer (1.6) | FR-HEADING-001 |
| `src/Resources/assets/src/plugins/insert-button.ts` | Browser: nodes & plugins — `insert_button`: "+" beside the empty paragraph (1.9) | FR-INSERT-002 |
| `src/Resources/assets/src/plugins/keyboard.ts` | Browser: nodes & plugins — keyboard.ts | FR-EDIT-003 |
| `src/Resources/assets/src/plugins/suggest.ts` | Browser: nodes & plugins — suggest.ts | FR-EDIT-002 |
| `src/Resources/assets/src/ui/layer.ts` | Browser: nodes & plugins — Top layer (Popover API) for menus, lists and the icon picker (1.8) | FR-LAYER-001, FR-LAYER-002 (spec 007) |
| `src/Resources/assets/src/ui/menu.ts` | Browser: nodes & plugins — menu.ts (APG menu) | FR-MENU-002 (spec 002) |

## Browser: icons

| Path | Spec section | Req IDs |
| --- | --- | --- |
| `src/Resources/assets/src/dialect/emoji-rule.ts` | Browser: icons — Callout `icon` emoji detection (1.7) | FR-ICON-005 (spec 006) |
| `src/Resources/assets/src/icons/catalog.ts` | Browser: icons — Tabler catalog lazy chunk with search keywords (1.7) | FR-ICON-002 (spec 006) |
| `src/Resources/assets/src/icons/open.ts` | Browser: icons — Icon picker entry points, inline insert at the caret (1.7) | FR-ICON-004 (spec 006) |
| `src/Resources/assets/src/icons/search.ts` | Browser: icons — Icon search ranking for the picker and `:` suggestions (1.7) | FR-ICON-003 (spec 006) |
| `src/Resources/assets/src/icons/virtual.d.ts` | Browser: icons — Types of the generated `nowo-tabler-icons` virtual module (1.7) | FR-ICON-002 (spec 006) |
| `src/Resources/assets/src/ui/glyphs.ts` | Browser: icons — Generated Tabler glyph data for menu / slash / action labels (1.7) | FR-ICON-001 (spec 006) |
| `src/Resources/assets/src/ui/icon-picker.ts` | Browser: icons — Icon picker dialog (APG combobox + listbox, 1.7) | FR-ICON-003 (spec 006) |
| `src/Resources/assets/src/ui/icons.ts` | Browser: icons — DOM-built decorative inline SVG icons (1.7) | FR-ICON-001 (spec 006) |

## Browser: files, host references & images

| Path | Spec section | Req IDs |
| --- | --- | --- |
| `src/Resources/assets/src/commands/file-view.ts` | Browser: files, host references & images — File *View* and *Preview height* commands (1.9) | FR-FILE-001, FR-FILE-004 (spec 008) |
| `src/Resources/assets/src/dialect/file-card.ts` | Browser: files, host references & images — `::file` leaf directive and its view, DOM APIs only (1.8) | FR-CARD-001, FR-SEC-001 (spec 007) |
| `src/Resources/assets/src/dialect/image.ts` | Browser: files, host references & images — Image attribute block of the dialect (1.9) | FR-IMG-001, FR-IMG-002 (spec 008) |
| `src/Resources/assets/src/host.ts` | Browser: files, host references & images — Host references (`host-file:<id>`) in the editor (1.9) | FR-HOST-001, FR-HOST-002, FR-HOST-007 (spec 008) |
| `src/Resources/assets/src/nodes/image.ts` | Browser: files, host references & images — Image node: host references and `image_block` (1.9) | FR-HOST-006, FR-IMG-001 (spec 008) |
| `src/Resources/assets/src/plugins/file-drop.ts` | Browser: files, host references & images — File drop / paste with placeholders and sequential uploads (1.8) | FR-DROP-001, FR-DROP-002, FR-DROP-003 (spec 007) |

## Browser: previews, collaboration & features

| Path | Spec section | Req IDs |
| --- | --- | --- |
| `src/Resources/assets/src/collab/index.ts` | Browser: previews, collaboration & features — index.ts | FR-LAZY-001 |
| `src/Resources/assets/src/collab/mercure-provider.ts` | Browser: previews, collaboration & features — mercure-provider.ts | FR-LAZY-001 |
| `src/Resources/assets/src/features/code.ts` | Browser: previews, collaboration & features — code.ts | FR-TS-001, FR-LAZY-001 |
| `src/Resources/assets/src/features/top-bar.ts` | Browser: previews, collaboration & features — `top_bar` lazy chunk with translated heading options | FR-TS-001, FR-LAZY-001 |
| `src/Resources/assets/src/preview/highlight.ts` | Browser: previews, collaboration & features — highlight.ts | FR-LAZY-001 |
| `src/Resources/assets/src/preview/mermaid.ts` | Browser: previews, collaboration & features — mermaid.ts | FR-LAZY-001 |
| `src/Resources/assets/src/preview/render.ts` | Browser: previews, collaboration & features — render.ts | FR-LAZY-001 |

## Browser: editor core

| Path | Spec section | Req IDs |
| --- | --- | --- |
| `src/Resources/assets/src/assets.ts` | Browser: editor core — assets.ts (module base URL; KaTeX stylesheet linked once per page with the nonce) | FR-TS-001, FR-LAZY-001 |
| `src/Resources/assets/src/context-menu-registry.ts` | Browser: editor core — context-menu-registry.ts (host items) | FR-MENU-003 (spec 002) |
| `src/Resources/assets/src/editor.ts` | Browser: editor core — editor.ts | FR-TS-001 |
| `src/Resources/assets/src/emoji.ts` | Browser: editor core — emoji.ts | FR-EDIT-002 |
| `src/Resources/assets/src/features.ts` | Browser: editor core — features.ts | FR-TS-001 |
| `src/Resources/assets/src/i18n.ts` | Browser: editor core — i18n.ts | FR-I18N-001 |
| `src/Resources/assets/src/index.ts` | Browser: editor core — index.ts | FR-TS-001 |
| `src/Resources/assets/src/link-titles.ts` | Browser: editor core — link-titles.ts | FR-EDIT-001 |
| `src/Resources/assets/src/options.ts` | Browser: editor core — options.ts | FR-TS-001 |
| `src/Resources/assets/src/runtime.ts` | Browser: editor core — runtime.ts | FR-TS-001 |
| `src/Resources/assets/src/styles/milkdown-editor.css` | Browser: editor core — milkdown-editor.css | FR-EDIT-003, FR-THEME-001 |
| `src/Resources/assets/src/triggers.ts` | Browser: editor core — triggers.ts | FR-EDIT-002 |
| `src/Resources/assets/src/types.ts` | Browser: editor core — types.ts | FR-TS-001 |
| `src/Resources/assets/src/upload.ts` | Browser: editor core — upload.ts | FR-TS-002 |
| `src/Resources/assets/src/user-names.ts` | Browser: editor core — user-names.ts (mention names, 1.2.1) | FR-EDIT-001 |

## Build outputs

| Output | Source | Req IDs |
| --- | --- | --- |
| `src/Resources/public/milkdown-editor.js` + `chunks/` + `katex/` | `src/Resources/assets/src/index.ts` (Vite library, ES module) | FR-BUILD-001 |
| `src/Resources/public/milkdown-editor.css` | `src/Resources/assets/src/styles/milkdown-editor.css` | FR-BUILD-002 |
