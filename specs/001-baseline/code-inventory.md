# Milkdown Editor Bundle — baseline code inventory

**Package**: `nowo-tech/milkdown-editor-bundle`  
**Last audited**: 2026-11-27 (1.18: stable heading ids, link picker)  
**Production units**: **159/159**  
**Audit command**: `find src -type f \( -name '*.php' -o -name '*.twig' -o -name '*.yaml' -o -name '*.ts' -o -name '*.css' \) -not -path 'src/Resources/assets/tests/*' -not -path 'src/Resources/public/*' | wc -l`

## Scope notes

- Vitest files under `src/Resources/assets/tests/` are **excluded** (test code, not shipped behaviour).
- `src/Resources/public/` (`milkdown-editor.js`, `milkdown-editor.css`, `chunks/`, `katex/`; `icons/` is mapped separately below) is the Vite **build output** of `src/Resources/assets/src/index.ts` (`FR-BUILD-001`), not separate units.
- `demo/` and `.symfony/` (Flex recipe) are out of inventory scope.

## Coverage summary

| Category | Mapped |
| --- | ---: |
| Bundle, configuration & DI | 10 |
| Form type & CSP | 4 |
| PHP Markdown renderer | 56 |
| Twig & form theme | 2 |
| Translations | 7 |
| Comments, versions & diff | 15 |
| Browser: dialect | 4 |
| Browser: nodes & plugins | 24 |
| Browser: icons | 8 |
| Browser: files, host references & images | 6 |
| Browser: previews, collaboration & features | 7 |
| Browser: editor core | 16 |
| **Total** | **159** |

## Bundle, configuration & DI

| Path | Spec section | Req IDs |
| --- | --- | --- |
| `src/DependencyInjection/Compiler/TwigPathsPass.php` | Bundle, configuration & DI — @NowoMilkdownEditorBundle namespace + app overrides | FR-CFG-002 |
| `src/DependencyInjection/Configuration.php` | Bundle, configuration & DI — Config tree: profiles, default profile, markdown renderer options | FR-CFG-001 |
| `src/DependencyInjection/NowoMilkdownEditorExtension.php` | Bundle, configuration & DI — Loads services, parameters; prepends asset package and form theme | FR-CFG-001, FR-CFG-002 |
| `src/EventListener/WorkerBoundaryResetListener.php` | Bundle, configuration & DI — Clears the per-page footnote counters at the main request, Messenger and console boundaries (1.16.1, REQ-RUNTIME-002) | FR-WORKER-001 |
| `src/Feature.php` | Enum of the optional editor features, the values of the `features` form option and profile key | FR-CFG-001, FR-FORM-002 |
| `src/NowoMilkdownEditorBundle.php` | Bundle, configuration & DI — Bundle class; registers TwigPathsPass | FR-CFG-002 |
| `src/ProfileRegistry.php` | Bundle, configuration & DI — Named profiles | FR-CFG-001 |
| `src/Resources/config/services.php` | Bundle, configuration & DI — Service wiring and interface aliases | FR-CFG-001, FR-FORM-003, FR-MD-003 |
| `src/Theme.php` | Enum of the widget colour scheme: `light`, `dark` or `auto` (follows `prefers-color-scheme` or a `[data-theme]` ancestor) | FR-CFG-001 |
| `src/CollabSchema.php` | Version of what the editor writes into a shared (Yjs) document (1.18): version 2 keeps each heading's own id (before, every peer rewrote ids from text); hosts keeping collaboration logs fold it into their log epoch so older tabs get `409 log_epoch` and reload | FR-HEADING-002 |

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
| `src/Markdown/DialectRenderer.php` | Renders the HTML of every dialect node; every value is escaped and URLs keep only relative and http(s) forms | FR-MD-001 |
| `src/Markdown/Directive/DirectiveAttributes.php` | Parses the `{...}` attribute list of a directive (`key=value`, quoted values, `#id`, `.class`, bare `key`): lower-case keys, at most 20 attributes, values cut to 500 characters | FR-MD-001, FR-MD-003 |
| `src/Markdown/Directive/DirectiveRendererInterface.php` | Host port that renders leaf directives such as `::beacon{type=issue id=...}` (autoconfigured with the `nowo_milkdown_editor.directive_renderer` tag); `prepare()` receives every matching node first so the host loads them in one query per type | FR-MD-003 |
| `src/Markdown/DocumentProcessor.php` | After parsing, resolves every page link and mention in one call per resolver (per viewer), resolves host references of images, links and file cards in one batch, prepares host directive renderers and turns remote images into links when not allowed; at most `max_references` distinct ids and handles per resolver | FR-MD-001, FR-MD-002, FR-MD-003 |
| `src/Markdown/EmojiRule.php` | PHP Markdown renderer — Callout `icon` emoji detection, bounded scan (1.7) | FR-ICON-005, FR-ICON-006 (spec 006) |
| `src/Markdown/FileCard.php` | PHP Markdown renderer — `::file[name]{href size type}` cards in the read-only render (1.8) | FR-CARD-001, FR-SEC-001 (spec 007) |
| `src/Markdown/FootnoteGuard.php` | PHP Markdown renderer — footnote label case and reference cap (1.2.1, CZ-L1) | FR-MD-001 |
| `src/Markdown/FootnoteSalt.php` | PHP Markdown renderer — per-document footnote id salt (1.2.1, CZ-I7) | FR-MD-001 |
| `src/Markdown/HeadingIds.php` | PHP Markdown renderer — `markdown.heading_ids`: heading slugs shared with the editor (1.6) | FR-HEADING-001 |
| `src/Markdown/HostSchemes.php` | PHP Markdown renderer — Allow-listed host URL schemes (`host-file:<id>`, 1.9) | FR-HOST-001, FR-HOST-002 (spec 008) |
| `src/Markdown/HostValue.php` | PHP Markdown renderer — A parsed host reference value and its resolution (1.9) | FR-HOST-002, FR-HOST-005 (spec 008) |
| `src/Markdown/ImageAttributes.php` | PHP Markdown renderer — Image attribute block `{width align}` (1.9, `image_block`) | FR-IMG-001 (spec 008) |
| `src/Markdown/MarkdownRendererInterface.php` | Public port: renders Milkdown-dialect Markdown to safe HTML | FR-MD-001 |
| `src/Markdown/MilkdownDialectExtension.php` | league/commonmark extension of the dialect (FR-075): add it to any environment that already has the CommonMark core and, ideally, GFM; the renderer builds such an environment | FR-MD-001 |
| `src/Markdown/MilkdownMarkdownRenderer.php` | The PHP renderer of the dialect (FR-074 / FR-075): CommonMark + GFM + the dialect extension, raw HTML escaped or stripped, unsafe links dropped, remote images turned into links unless allowed, bounded nesting and input length; the environment is built once per service (worker-safe, no request state) | FR-MD-001, FR-MD-002 |
| `src/Markdown/Node/ContainerDirective.php` | AST node of a `:::name[label]{attributes}` container (callout, details, align; unknown names render as a plain `div`) | FR-MD-001 |
| `src/Markdown/Node/HiddenReference.php` | PHP Markdown renderer — Host image the viewer may not read: *Content not visible* (1.9) | FR-HOST-005 (spec 008) |
| `src/Markdown/Node/ImageFigure.php` | PHP Markdown renderer — Standalone image as a figure with caption (1.9) | FR-IMG-001, FR-IMG-002 (spec 008) |
| `src/Markdown/Node/LeafDirective.php` | AST node of a `::name[label]{attributes}` leaf directive on its own line, rendered by a host directive renderer | FR-MD-001 |
| `src/Markdown/Node/Math.php` | AST node of inline math `$...$`, rendered as escaped TeX in `<span data-math="inline">` (KaTeX runs in the browser) | FR-MD-001 |
| `src/Markdown/Node/MathBlock.php` | AST node of block math between `$$` lines, rendered as escaped TeX in `<div data-math="block">` | FR-MD-001 |
| `src/Markdown/Node/Mention.php` | AST node of an `@handle` (never inside an e-mail address), rendered as a mention when the user resolver knows the handle | FR-MD-001 |
| `src/Markdown/Node/TablerIcon.php` | AST node of a `:tabler-<name>:` shortcode: the SVG icon from the configured sprite when the name is allowlisted, the shortcode text otherwise | FR-MD-001 |
| `src/Markdown/Node/TextDirective.php` | AST node of an inline `:name[label]{attributes}` directive: `:mark[...]{color=...}` is a highlight, other names keep only their label | FR-MD-001 |
| `src/Markdown/Node/WikiLink.php` | AST node of `[[wiki:<uuid>]]` / `[[wiki:<uuid>#anchor]]`: a page link by id rendered with the page's current title for viewers who may read it (one batch per document), *Content not visible* otherwise | FR-MD-001 |
| `src/Markdown/Parser/ContainerDirectiveParser.php` | Block parser that keeps a container directive open until a fence with at least as many colons (`remark-directive` semantics: an outer container uses more colons than its content) | FR-MD-001 |
| `src/Markdown/Parser/DialectInlineParser.php` | Inline parser of the dialect tokens (same expressions as `dialect/patterns.ts`): page links by id (the anchor follows the heading id grammar since 1.18), mentions (start of text, whitespace or `(` before `@`) and Tabler icon shortcodes | FR-MD-001 |
| `src/Markdown/Parser/DirectiveBlockStartParser.php` | Starts the dialect's block constructs: `:::name` containers (`::: {align=...}` is an `align` container), `::name` leaf directives and `$$` math blocks when math is on | FR-MD-001 |
| `src/Markdown/Parser/LeafDirectiveParser.php` | Block parser of a leaf directive: one line, it never continues | FR-MD-001 |
| `src/Markdown/Parser/MathBlockParser.php` | Block parser that collects the TeX lines of a `$$` block until the closing `$$` line | FR-MD-001 |
| `src/Markdown/Parser/MathInlineParser.php` | Inline parser of `$tex$` with the pandoc rule (no space after the opening `$` or before the closing one, no digit right after it) so prices such as "$5 and $10" stay text | FR-MD-001 |
| `src/Markdown/Parser/TextDirectiveParser.php` | Inline parser of `:name[label]{attributes}` whose label is parsed as inline Markdown; bounded work on hostile input (label, attribute bytes, nesting depth and attempts are capped) | FR-MD-001 |
| `src/Markdown/Resolver/AllowlistIconResolver.php` | Default icon resolver from configuration (`markdown.icon_sprite_url` + `icons`, and the bundled Tabler catalogue with `markdown.icon_catalog`) | FR-MD-001 |
| `src/Markdown/Resolver/ContextualHostFileResolverInterface.php` | PHP Markdown renderer — Host file resolver that also receives the render context (1.9) | FR-HOST-003 (spec 008) |
| `src/Markdown/Resolver/FilePreviewResolverInterface.php` | PHP Markdown renderer — Port: may this viewer see a preview of the file, and where (1.9) | FR-FILE-002 (spec 008) |
| `src/Markdown/Resolver/FileReference.php` | PHP Markdown renderer — VO: a file card that asks for a preview (1.9) | FR-FILE-001 (spec 008) |
| `src/Markdown/Resolver/HostFileResolverInterface.php` | PHP Markdown renderer — Port: resolves host references for the current viewer in one batch (1.9) | FR-HOST-003 (spec 008) |
| `src/Markdown/Resolver/IconResolverInterface.php` | Port that decides which `:tabler-<name>:` shortcodes render as SVG and where the sprite is | FR-MD-001 |
| `src/Markdown/Resolver/NullPageResolver.php` | Default page resolver: no page is visible (alias `PageResolverInterface` to the host's implementation) | FR-MD-002 |
| `src/Markdown/Resolver/NullUserResolver.php` | Default user resolver: no handle is known, mentions stay text (alias `UserResolverInterface` to the host's) | FR-MD-002 |
| `src/Markdown/Resolver/PageResolverInterface.php` | Host port resolving `[[wiki:<uuid>]]` links for the current viewer, once per document with every id it holds; ids missing from the answer render as *Content not visible*, never the page title | FR-MD-002 |
| `src/Markdown/Resolver/RenderContextProviderInterface.php` | PHP Markdown renderer — Port: opaque render context handed to the contextual resolver (1.9) | FR-HOST-003 (spec 008) |
| `src/Markdown/Resolver/ResolvedFile.php` | PHP Markdown renderer — VO: a host file the viewer may read (URL, image URL) (1.9) | FR-HOST-003, FR-HOST-004 (spec 008) |
| `src/Markdown/Resolver/ResolvedPage.php` | Value object of a page the current viewer may read: its current title and URL | FR-MD-002 |
| `src/Markdown/Resolver/ResolvedUser.php` | Value object of a mentioned user: display name and optional profile URL | FR-MD-002 |
| `src/Markdown/Resolver/TablerCatalog.php` | PHP Markdown renderer — Bundled Tabler outline catalog names and sprite URLs (1.7, `icon_catalog`) | FR-ICON-002 (spec 006) |
| `src/Markdown/Resolver/TemplateFilePreviewResolver.php` | PHP Markdown renderer — Default preview resolver from scheme `preview` URL templates (1.9) | FR-FILE-002, FR-FILE-003 (spec 008) |
| `src/Markdown/Resolver/TemplateHostFileResolver.php` | PHP Markdown renderer — Default host resolver from scheme URL templates (1.9) | FR-HOST-003, FR-HOST-004 (spec 008) |
| `src/Markdown/Resolver/UserResolverInterface.php` | Host port resolving `@handle` mentions, once per document; unknown handles stay plain text | FR-MD-002 |
| `src/Markdown/TaskItemRenderer.php` | PHP Markdown renderer — Read-only task items with the editor markup (1.17) | FR-TASK-001 |
| `src/Markdown/TaskMarkerRenderer.php` | PHP Markdown renderer — named task-list checkboxes (1.3.1) | FR-MD-001 |
| `src/Markdown/FootnoteBackrefPlacement.php` | Moves the footnote back links that league/commonmark appended to a non-paragraph child (list, table, quote, code block) into a new paragraph at the end of the footnote (valid HTML, axe `list`); a footnote ending with a paragraph renders as before | FR-MD-004 |
| `src/Markdown/HeadingAnchorLinks.php` | 1.18: adds a "copy link to this section" anchor to every heading of already sanitised read-view HTML, without JavaScript; only headings whose id is `nowo-h-` plus a valid id get it | FR-HEADING-002 |
| `src/Markdown/Parser/HeadingIdSuffixParser.php` | 1.18: parses the explicit heading id suffix `## Install guide {#setup}` (exact form only: spaces, `{#id}`, end of an ATX or setext heading; no classes or key=value) | FR-HEADING-002 |
| `src/Markdown/LinkUrl.php` | 1.18: validates a link target typed into the link picker (same rules as `ui/link-url.ts`; hosts can run it on API input): relative paths, `?query`, `#fragment` or an absolute URL whose scheme is allowed (`http`, `https`, `mailto` by default, only narrowable); a bare host gets `https://`; the renderer and the host sanitiser remain the final gates | FR-LINK-001 |
| `src/Markdown/Resolver/SectionResolverInterface.php` | 1.18 optional host port: the text of the sections `[[wiki:<uuid>#<id>]]` points at, so a link reads `Title › Section text`; without it a section link shows the page title only, never the raw id | FR-LINK-002 |

## Twig & form theme

| Path | Spec section | Req IDs |
| --- | --- | --- |
| `src/Resources/views/Form/milkdown_editor_theme.html.twig` | Twig & form theme — milkdown_editor_widget block | FR-TWIG-001 |
| `src/Twig/MilkdownEditorTwig.php` | Twig & form theme — milkdown_markdown filter, nowo_milkdown_editor_assets() | FR-TWIG-001 |

## Translations

| Path | Spec section | Req IDs |
| --- | --- | --- |
| `src/Resources/translations/NowoMilkdownEditorBundle.de.yaml` | Translations: editor UI strings in German (labels, placeholders, menu, toolbar, status and live-region messages; same keys in all 7 locales) | FR-I18N-001 |
| `src/Resources/translations/NowoMilkdownEditorBundle.en.yaml` | Translations: editor UI strings in English (reference) (labels, placeholders, menu, toolbar, status and live-region messages; same keys in all 7 locales) | FR-I18N-001 |
| `src/Resources/translations/NowoMilkdownEditorBundle.es.yaml` | Translations: editor UI strings in Spanish (labels, placeholders, menu, toolbar, status and live-region messages; same keys in all 7 locales) | FR-I18N-001 |
| `src/Resources/translations/NowoMilkdownEditorBundle.fr.yaml` | Translations: editor UI strings in French (labels, placeholders, menu, toolbar, status and live-region messages; same keys in all 7 locales) | FR-I18N-001 |
| `src/Resources/translations/NowoMilkdownEditorBundle.it.yaml` | Translations: editor UI strings in Italian (labels, placeholders, menu, toolbar, status and live-region messages; same keys in all 7 locales) | FR-I18N-001 |
| `src/Resources/translations/NowoMilkdownEditorBundle.nl.yaml` | Translations: editor UI strings in Dutch (labels, placeholders, menu, toolbar, status and live-region messages; same keys in all 7 locales) | FR-I18N-001 |
| `src/Resources/translations/NowoMilkdownEditorBundle.pt.yaml` | Translations: editor UI strings in Portuguese (labels, placeholders, menu, toolbar, status and live-region messages; same keys in all 7 locales) | FR-I18N-001 |

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
| `src/Resources/assets/src/dialect/directives.ts` | Browser: dialect: helpers of the directive syntax (`remark-directive`): callout types and icons (Tabler name or emoji), `details`, nameless align / colour containers, `:mark` highlights, the allowed names, colours and alignments, and attribute cleaning | FR-DIALECT-001 |
| `src/Resources/assets/src/dialect/patterns.ts` | Browser: dialect: the inline token expressions shared by the remark plugin and the suggestion hook (`[[wiki:<uuid>#anchor]]`, `@handle` with no e-mails, `:tabler-<name>:`) and their validators; the PHP parser mirrors them | FR-DIALECT-001 |
| `src/Resources/assets/src/dialect/remark-dialect.ts` | Browser: dialect: remark plugin of the dialect: directives plus the inline tokens, splitting text nodes (never inside code, links or HTML) and serialising every dialect node verbatim so Markdown stays the single source of truth | FR-DIALECT-001 |
| `src/Resources/assets/src/dialect/heading-id.ts` | Browser: dialect: the explicit heading id suffix `## Title {#id}` (1.18): parse it into the heading, resolve heading ids and write it back, escaping a literal `{#x}` as `\{#x}` | FR-HEADING-002 |

## Browser: nodes & plugins

| Path | Spec section | Req IDs |
| --- | --- | --- |
| `src/Resources/assets/src/commands/blocks.ts` | Browser: commands: block commands shared by the context menu and the block menu: current block, turn into, duplicate, delete, move up / down; pure ProseMirror transactions, one per action so undo and Yjs see one step | FR-MENU-001 (spec 002) |
| `src/Resources/assets/src/commands/colors.ts` | Browser: commands: text and background colours (`colors` feature, 1.3), inline on a selection (`:mark`) and on a whole top-level block (nameless container), named colours only, with the colour menu | FR-COLOR-001 (spec 003) |
| `src/Resources/assets/src/commands/insert.ts` | Browser: commands: the Insert group of the context menu (`insert_menu`, 1.5): image or file, icon and the `/` blocks (headings, lists, table, code, callout, divider, math, Mermaid), each only when its feature is on | FR-INSERT-001 (spec 004) |
| `src/Resources/assets/src/commands/markdown-clipboard.ts` | Browser: commands: Markdown clipboard (`markdown_clipboard`, 1.5): smart paste of text-wrapping HTML whose plain text looks like Markdown, Paste / Copy as Markdown; pasted URLs are checked for safety and content goes through the schema | FR-CLIP-001, FR-CLIP-002 (spec 004) |
| `src/Resources/assets/src/nodes/directives.ts` | Browser: nodes: ProseMirror nodes and views of the directives: containers (callout with icon button, details, align, unknown names kept), leaf directives (embedded host blocks) and text directives (`:mark`), with read-only chrome | FR-EDIT-001 |
| `src/Resources/assets/src/nodes/inline-refs.ts` | Browser: nodes: inline atom nodes of the dialect, page links by id, mentions and Tabler icons, whose Markdown keeps their source text | FR-EDIT-001 |
| `src/Resources/assets/src/nodes/task-list.ts` | Browser: nodes: GFM task items with a real, named checkbox keeping `ul > li` semantics (Crepe's list-item feature is not used); read-only the checkbox is disabled, as in the server render, and follows read-only switches (1.17) | FR-EDIT-001 |
| `src/Resources/assets/src/plugins/a11y.ts` | Browser: plugins: accessibility fixes over Crepe (FR-073): names every button and button-like control, makes the editable a named multi-line textbox, and a MutationObserver names controls Crepe renders later | FR-EDIT-003 |
| `src/Resources/assets/src/plugins/block-actions.ts` | Browser: plugins: block actions (`block_actions`, 1.3): the grip button beside the block under the pointer or caret opens the block menu (turn into, colour, duplicate, move, delete); Ctrl / Cmd + / and Alt+Shift+Up / Down work from the keyboard (WCAG 2.1.1, 2.5.7) and are announced in the live region | FR-BLOCK-001 (spec 003) |
| `src/Resources/assets/src/plugins/context-menu.ts` | Browser: plugins: context menu (`context_menu`, lazy chunk): right click, Shift+F10 or the ContextMenu key open an accessible menu with clipboard, turn into, table, link and block actions plus host items; Shift + right click, code blocks, form fields and touch long-presses keep the browser menu | FR-MENU-001 (spec 002) |
| `src/Resources/assets/src/plugins/editable.ts` | Browser: nodes & plugins — Re-applies node views when the `editable` prop changes | FR-TS-001 |
| `src/Resources/assets/src/plugins/heading-ids.ts` | Browser: nodes & plugins — `heading_ids`: DOM ids on headings (1.6) | FR-HEADING-001 |
| `src/Resources/assets/src/plugins/heading-slug.ts` | Browser: nodes & plugins — Heading slugs shared with the PHP renderer (1.6) | FR-HEADING-001 |
| `src/Resources/assets/src/plugins/insert-button.ts` | Browser: nodes & plugins — `insert_button`: "+" beside the empty paragraph (1.9) | FR-INSERT-002 |
| `src/Resources/assets/src/plugins/keyboard.ts` | Browser: plugins: Tab never traps keyboard users (FR-073, WCAG 2.1.2): nests / un-nests in list items, moves between table cells, stays with CodeMirror in code blocks, otherwise leaves the editor | FR-EDIT-003 |
| `src/Resources/assets/src/plugins/suggest.ts` | Browser: plugins: suggestion hook (FR-053 / FR-085): typed triggers open an ARIA listbox fed by an async source, with `aria-controls`, `aria-activedescendant` and `aria-autocomplete=list` on the editable | FR-EDIT-002 |
| `src/Resources/assets/src/ui/layer.ts` | Browser: nodes & plugins — Top layer (Popover API) for menus, lists and the icon picker (1.8) | FR-LAYER-001, FR-LAYER-002 (spec 007) |
| `src/Resources/assets/src/ui/menu.ts` | Browser: ui: accessible popup menu on the WAI-ARIA APG menu pattern shared by the context menu and the block menu: roving focus, arrows, Home / End, submenus, Escape, separators and shortcut labels | FR-MENU-002 (spec 002) |
| `src/Resources/assets/src/nodes/heading.ts` | Browser: nodes: the heading node with stable ids (1.18): the `id` attribute holds the bare id, written to Markdown as a `{#id}` suffix only when it differs from the slug and to the DOM as `nowo-h-<id>` | FR-HEADING-002 |
| `src/Resources/assets/src/plugins/heading-stable-ids.ts` | Browser: plugins: `stable_heading_ids` (1.18, lazy chunk): freezes a heading's id into its attribute only on the peer that caused it, inside the history step of the causing change, so ids survive text edits | FR-HEADING-002 |
| `src/Resources/assets/src/plugins/link-trigger.ts` | Browser: plugins: typing `[[` opens the link picker on its Wiki page tab (`link_picker`, 1.18); closing without a pick types the brackets back; never inside code and only with a candidates URL | FR-LINK-001 |
| `src/Resources/assets/src/commands/link.ts` | Browser: commands: what the link button, `Mod-k`, `[[` and Edit link do with the picker (`link_picker`, lazy chunk): a picked page becomes a `[[wiki:<uuid>#<id>]]` node, a picked URL links the selection or inserts text, an existing link reopens the picker with its values | FR-LINK-001 |
| `src/Resources/assets/src/ui/link-picker.ts` | Browser: ui: the link picker (`link_picker`, 1.18, lazy chunk) with two tabs: Wiki page (ARIA combobox over a grouped listbox: current wiki first, then others, then a section step) and External URL; bounded query, candidate and label sizes | FR-LINK-001 |
| `src/Resources/assets/src/ui/link-url.ts` | Browser: ui: checks a link target typed into the link picker (relative path, `?query`, `#fragment` or an allowed scheme; bare host gets `https://`); the PHP `LinkUrl` runs the same rules and the renderer / host sanitiser remain the final gates | FR-LINK-001 |

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
| `src/Resources/assets/src/collab/index.ts` | Browser: collaboration: collaboration entry loaded only when the form enables it: Milkdown's collab plugin bound to a Yjs document relayed by `MercureProvider`, with cursors, selections, reset / reload handling | FR-LAZY-001 |
| `src/Resources/assets/src/collab/mercure-provider.ts` | Browser: collaboration: Yjs provider over Mercure (FR-076): an EventSource on the private topic for updates down, JSON POSTs to the host `/update` and `/awareness` up, with batching, byte caps, backoff and status events | FR-LAZY-001 |
| `src/Resources/assets/src/features/code.ts` | Browser: features: CodeMirror code blocks (chunk): page nonce for CodeMirror's injected styles, a named editor, contrast-safe token colours, languages loaded on demand and the Mermaid preview | FR-TS-001, FR-LAZY-001 |
| `src/Resources/assets/src/features/top-bar.ts` | Browser: previews, collaboration & features — `top_bar` lazy chunk with translated heading options | FR-TS-001, FR-LAZY-001 |
| `src/Resources/assets/src/preview/highlight.ts` | Browser: previews: code token colours from the `--nowo-milkdown-code-*` tokens, WCAG AA in light and dark (CodeMirror's default palette fails contrast in dark mode) | FR-LAZY-001 |
| `src/Resources/assets/src/preview/mermaid.ts` | Browser: previews: Mermaid previews (FR-086): loaded on demand, strict security level, no HTML labels, styles stamped with the page nonce and the returned SVG parsed, never set through `innerHTML` | FR-LAZY-001 |
| `src/Resources/assets/src/preview/render.ts` | Browser: previews: read-side rendering of server HTML (FR-086): `pre > code.language-mermaid` become diagrams and `[data-math]` become KaTeX, both loaded only when needed, with bounded TeX length, depth and scripts | FR-LAZY-001 |

## Browser: editor core

| Path | Spec section | Req IDs |
| --- | --- | --- |
| `src/Resources/assets/src/assets.ts` | Browser: editor core: URLs of the files published next to the module (`assets:install`): the KaTeX stylesheet and fonts, linked once per page and only when math is used | FR-TS-001, FR-LAZY-001 |
| `src/Resources/assets/src/context-menu-registry.ts` | Browser: editor core: registry of host context-menu items (`window.NowoMilkdownEditor.contextMenu.register`), kept out of the lazy chunk so hosts can register before any editor loads it | FR-MENU-003 (spec 002) |
| `src/Resources/assets/src/editor.ts` | Browser: editor core: builds one editor on the widget root rendered by `MilkdownEditorType` (hidden textarea keeps the Markdown, written back on every change and on submit), wiring features, runtime, collaboration, status and the handle API | FR-TS-001 |
| `src/Resources/assets/src/emoji.ts` | Browser: editor core: small offline emoji list for the `:` trigger when the host gives no icon URL (emoji stay Unicode text) | FR-EDIT-002 |
| `src/Resources/assets/src/features.ts` | Browser: editor core: the reduced Crepe build (FR-072): only the features the form asks for, CodeMirror, KaTeX and Mermaid as lazy chunks; Crepe's list-item, image-block, block-edit, AI and emoji features are never used | FR-TS-001 |
| `src/Resources/assets/src/i18n.ts` | Browser: editor core: the built-in English messages and `translate()` with placeholder substitution; host messages from the widget options override them | FR-I18N-001 |
| `src/Resources/assets/src/index.ts` | Browser: editor core — library entry; logs the `milkdown-editor` script-loaded banner (REQ-ASSETS-005) | FR-TS-001, FR-TS-003 |
| `src/Resources/assets/src/link-titles.ts` | Browser: editor core: per-viewer page titles for `[[wiki:<uuid>]]` chips: ids seen in one tick are resolved by one `GET <url>?ids=a,b`, ids missing from the answer are not visible; URL safety check | FR-EDIT-001 |
| `src/Resources/assets/src/options.ts` | Browser: editor core: reads and validates the widget options JSON (`data-nowo-milkdown-options`) written by the form type: features, preview sandbox, action bar, uploads, same-origin checks, comments, link sections | FR-TS-001 |
| `src/Resources/assets/src/runtime.ts` | Browser: editor core: per-editor runtime settings (page and user resolvers, translations, section memory) shared with node views and plugins through a Milkdown ctx slice | FR-TS-001 |
| `src/Resources/assets/src/styles/milkdown-editor.css` | Browser: editor core: the editor and rendered-content stylesheet themed by `--nowo-milkdown-*` tokens (light, dark, `auto`), importing Crepe's theme parts and mapping `--crepe-*` onto the tokens; built to `milkdown-editor.css` | FR-EDIT-003, FR-THEME-001 |
| `src/Resources/assets/src/triggers.ts` | Browser: editor core: the suggestion triggers of one editor: `[[` pages, `@` people, `:` icons and emoji (remote candidate URLs from the options) and `/` blocks (local commands, FR-085) | FR-EDIT-002 |
| `src/Resources/assets/src/logger.ts` | Browser: editor core — bundle logger: `scriptLoaded()` banner with the build label (`__MILKDOWN_EDITOR_BUILD_TIME__`), quiet switch (`data-nowo-console`, `NOWO_CONSOLE`), debug-gated level methods | FR-TS-003 |
| `src/Resources/assets/src/types.ts` | Browser: editor core: public option types of the widget (features, action bar, uploads, triggers, candidates, collaboration, theme) that the form type renders as JSON | FR-TS-001 |
| `src/Resources/assets/src/upload.ts` | Browser: editor core: upload hook (FR-045): dropped, pasted or picked files are POSTed (multipart `file`) to the host upload URL with the CSRF token in `X-CSRF-Token`; accepts `{url, name?, size?, type?, kind?, alt?}` answers (older shapes still work) and checks type and size first | FR-TS-002 |
| `src/Resources/assets/src/user-names.ts` | Browser: editor core: display names of mentioned people (`mention_display: name`, 1.2.1): handles seen in one tick are resolved by one `GET <url>?handles=a,b`; picked names are remembered; a handle without a name keeps showing `@handle` | FR-EDIT-001 |

## Build outputs

| Output | Source | Req IDs |
| --- | --- | --- |
| `src/Resources/public/milkdown-editor.js` + `chunks/` + `katex/` | `src/Resources/assets/src/index.ts` (Vite library, ES module) | FR-BUILD-001 |
| `src/Resources/public/icons/` (`tabler-a.svg` … `tabler-z.svg` sprite shards by first character, `tabler-outline.json` names + keywords, `LICENSE-tabler.txt`) | Tabler Icons outline (MIT) catalogue produced by the build step of `vite.config.ts` for the lazy icon chunk and the picker ([spec 006](../006-icons/spec.md)) | FR-ICON-002 |
| `src/Resources/public/milkdown-editor.css` | `src/Resources/assets/src/styles/milkdown-editor.css` | FR-BUILD-002 |
