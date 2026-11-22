# Feature specification: Milkdown Editor Bundle (baseline)

**Feature branch**: `main` (baseline backfill)  
**Created**: 2026-10-30  
**Status**: Implemented (1.0.0)  
**Origin**: Symfony Beacon spec 178 block H (FR-072, FR-073, FR-075), task T058; the Milkdown + Crepe spike.

## Summary

A Symfony bundle that edits Markdown in forms with Milkdown 7 and a reduced Crepe build, and renders the same Markdown
dialect in PHP with league/commonmark. Markdown is the stored value; references to pages and people are stored by id
or handle and resolved per viewer; the editor is accessible (WCAG 2.1 AA) and works under a strict nonce-based CSP.

## User scenarios

### US-01 — Install and edit Markdown (P1)

**Given** a Symfony 7.4+ application, **when** a developer installs the bundle, runs `assets:install` and adds a
`MilkdownEditorType` field, **then** the form shows a Milkdown editor whose value is Markdown, with a textarea
fallback without JavaScript.

### US-02 — Profiles (P1)

**Given** several named profiles, **when** a field sets `profile`, **then** its features, theme, icons and upload
limits come from that profile, overridable per field; an unknown profile or invalid value fails early.

### US-03 — Link pages, mention people, insert icons (P1)

**Given** candidate URLs, **when** the author types `[[`, `@` or `:`, **then** a listbox of at most 10 candidates
opens (keyboard: Up / Down, Enter / Tab, Escape) and the pick is stored as `[[wiki:<uuid>]]`, `@handle` or
`:tabler-<name>:` / an emoji.

### US-04 — Per-viewer rendering (P1)

**Given** a page link, **when** a viewer sees the editor or the rendered HTML, **then** it shows the page's current
title for viewers who may read it and *Content not visible* otherwise, resolved in one batch.

### US-05 — Rich content (P2)

**Given** the dialect directives, **when** an author uses `/` or types them, **then** callouts, collapsible
sections, alignment, highlights, tables, task lists, Mermaid diagrams and math round trip through Markdown.

### US-06 — Uploads (P2)

**Given** an upload URL and CSRF token, **when** files are dropped, pasted or picked, **then** they are uploaded
with progress and errors announced, and inserted as images or links.

### US-07 — Accessibility and CSP (P1)

**Given** a keyboard or screen-reader user and a strict nonce CSP, **then** every control is named, Tab leaves the
editor outside lists / tables / code, axe reports no serious or critical violation and the page reports no CSP
violation.

### US-08 — Collaboration (P3)

**Given** collaboration options, **when** several people edit, **then** changes merge through Yjs relayed by the
host over Mercure, offline edits are kept and the saving client still submits Markdown.

### US-09 — Theming and translations (P3)

**Given** `--nowo-milkdown-*` tokens and 7 locales, **then** the host matches its design (light, dark, auto) and
language without overriding templates.

## Functional requirements

### Bundle, configuration and DI

- **FR-CFG-001** `nowo_milkdown_editor` tree with `default_profile` (must exist) and `profiles` (features, theme,
  min height, icon sprite + allowlist, upload limits); `markdown` renderer options with safe defaults.
- **FR-CFG-002** Asset package `nowo_milkdown_editor` (`/bundles/nowomilkdowneditor`) and the form theme are
  prepended; Twig namespace `@NowoMilkdownEditorBundle` with application overrides first.

### Form type and CSP

- **FR-FORM-001** `MilkdownEditorType` (parent `TextareaType`, block prefix `milkdown_editor`) renders the widget
  JSON: features, theme, min height, placeholder, label, read-only, suggestions, link-title URL, icons, upload,
  collaboration, nonce and translated UI strings.
- **FR-FORM-002** Options are validated (features, `math` / `mermaid` need `code_mirror`, triggers, CSS lengths,
  icon names, collaboration keys); line endings are normalised to LF; with symfony/validator a `Length` constraint
  (`max_length` bytes, default `max_input_length`) rejects documents the renderer would not parse.
- **FR-FORM-003** The CSP nonce comes from the `csp_nonce` option or `CspNonceProviderInterface` (default: the
  `csp_nonce` request attribute).

### PHP Markdown renderer

- **FR-MD-001** CommonMark + GFM (+ footnotes, 1.2.1, `markdown.footnotes`) + the dialect: page links, mentions, Tabler icons, text / container / leaf
  directives, inline and block math; raw HTML escaped or stripped, unsafe links dropped, remote images as links,
  bounded nesting; input over `max_input_length` bytes or `max_inline_markers` inline delimiters is rendered as
  escaped text without parsing (line feeds count as markers).
- **FR-MD-002** References are resolved in one call per resolver per document (at most `max_references` distinct
  ids / handles); missing pages render *Content not visible*; failing resolvers are logged and hide their
  references.
- **FR-MD-003** Host leaf directives are prepared in one batch and rendered by tagged `DirectiveRendererInterface`
  services.

### Twig

- **FR-TWIG-001** `milkdown_markdown` filter and `nowo_milkdown_editor_assets()` function (stylesheet + module with
  the nonce); `milkdown_editor_widget` block.

### Browser (TypeScript)

- **FR-TS-001** Reduced `CrepeBuilder` with the requested features; CodeMirror, KaTeX, Mermaid, top bar and
  collaboration are lazy chunks; the Markdown is written back to the textarea on change and submit.
- **FR-DIALECT-001** Remark plugin: directives, inline tokens, verbatim serialisation, narrowed escaping, nameless
  alignment containers, no `<br />` markers; round trip stable after the first save.
- **FR-EDIT-001** Nodes and views for page links (per-viewer titles), mentions (handle, or the name with
  `mention_display: name`, 1.2.1), icons, directives (editable
  attributes) and task items (real checkboxes).
- **FR-EDIT-002** Suggestion hook (listbox pattern, capture-phase keys, debounced remote sources, max 10) and the `/`
  block menu.
- **FR-EDIT-003** Accessibility: named controls, editable name, Tab handling, focus rings, contrast-safe tokens.
- **FR-LAZY-001** Mermaid (strict, no HTML labels, nonce-stamped styles, sanitised SVG without remote resources),
  KaTeX (`trust: false`, no macros, TeX ≤ 5 000 chars, 50 nesting levels and 200 scripts in the editor and on read
  pages, one formula's failure isolated), Mermaid source pre-filtered (image shapes, style statements, CSS config
  keys) and its styles CSS-unescaped and
  filtered, `renderRichContent()` for read pages, Yjs + Mercure provider.
- **FR-TS-002** Upload hook (checks, progress, CSRF header, safe answers) and *Insert file* / *Insert icon* buttons.
- **FR-THEME-001** One stylesheet styles the widget and the read-only render through `--nowo-milkdown-*` custom
  properties, with light, dark and `auto` (follows `prefers-color-scheme`) themes.
- **FR-I18N-001** UI strings in en, es, de, fr, it, nl, pt (`NowoMilkdownEditorBundle` domain), same keys as the
  TypeScript defaults.

- **FR-COMMENT-001** Inline comments (1.6, opt-in `comments`): `CommentAnchor` contract v1 (text quote, offsets, block hint,
  Yjs relative positions) validated in PHP and TypeScript (`InvalidCommentAnchorException` for hosts to answer 422), host
  endpoints client, highlight decorations, `handle.comments` API, inert allow-listed comment bodies, avatar URL policy and an
  optional thread component.
- **FR-VERSION-001** `version_view` (1.6, opt-in) and `nowo_milkdown_view()`: read-only widget of an old version with a banner.
- **FR-DIFF-001** Rendered diff (1.6): `nowo_milkdown_diff()` and `MarkdownDiffRendererInterface` compare two documents through
  the safe renderer, dialect-aware, with a work budget and an escaped line-diff fallback; keyboard navigation of changes.
- **FR-HEADING-001** Heading ids (1.6, `heading_ids` / `markdown.heading_ids`): `nowo-h-<slug>` with the same slugs in the editor
  and the PHP renderer.
- **FR-HEADING-002** Stable heading ids (1.18, `stable_heading_ids`): an explicit `## Title {#id}` suffix (`HeadingIdSuffixParser`,
  `dialect/heading-id.ts`; only that exact form, a literal one is written `\{#x}`), heading nodes that keep their own id
  (`nodes/heading.ts`, written back to Markdown only when it differs from the slug) frozen by the peer that caused it when
  the caret leaves the heading (`plugins/heading-stable-ids.ts`), `CollabSchema` (version 2) folded by hosts into their log
  epoch so older tabs reload, and `HeadingAnchorLinks` (a "copy link to this section" control on sanitised read-view
  headings, no JavaScript needed).
- **FR-LINK-001** Link picker (1.18, `link_picker`): one picker for the link button, `Mod-k` and `[[` with a *Wiki page* tab
  (combobox over a grouped listbox, then the page's sections) and an *External URL* tab (`commands/link.ts`,
  `plugins/link-trigger.ts`, `ui/link-picker.ts`). The URL is checked by `ui/link-url.ts` and the PHP `Markdown\LinkUrl`
  with the same rules (relative, `http`, `https`, `mailto` by default, narrowing only; no other scheme, no user info,
  no protocol-relative form); the renderer's `safeUrl()` and the host's sanitizer stay the final gates.
- **FR-LINK-002** `SectionResolverInterface` (1.18, optional): the text of the sections that `[[wiki:<uuid>#<id>]]` links point
  at, called once per document after `PageResolverInterface` and only for pages that resolved for the viewer; without a
  host service a link to a section shows the page title only.
- **FR-MD-004** `FootnoteBackrefPlacement` (1.18.1): the back links of a footnote that ends with a list, table, quote or code
  block are moved into a new paragraph at the end of the footnote; a footnote ending with a paragraph renders as before.
- **FR-TASK-001** Task items (1.17): the read-only PHP render uses the editor's markup (`TaskItemRenderer`, fixed attribute
  set, no raw HTML).
- **FR-INSERT-002** `insert_button` feature (1.9): a "+" beside the empty line that holds the caret opens the `/` menu.
- **FR-WORKER-001** `WorkerBoundaryResetListener` (1.16.1): per-page footnote counters are cleared at the main request, Messenger
  and console boundaries, so a kept-alive worker (kernel reset off) never leaks state between requests.

### Build

- **FR-BUILD-001** `src/Resources/public/milkdown-editor.js` and its `chunks/` are the Vite ES-module build of
  `src/Resources/assets/src/index.ts`; KaTeX's stylesheet and fonts are copied to `katex/`. The build is committed
  and published by `assets:install`.
- **FR-BUILD-002** `src/Resources/public/milkdown-editor.css` is the build of
  `src/Resources/assets/src/styles/milkdown-editor.css`.

## Success criteria

- **SC-001** PHP line coverage 100%; TypeScript coverage ≥ 90% lines; PHPStan max with no ignored errors; Igor 0
  dangerous services.
- **SC-002** Demo e2e: axe 0 serious / critical (light, dark, suggestion list open), 0 CSP violations under the
  strict nonce policy, Tab leaves the editor, Markdown stable across two saves.
- **SC-003** Up-front JavaScript ≤ 400 kB gzip with code highlighting loaded on demand (`make bundle-size`).
- **SC-004** The code inventory maps **145/145** production units ([code-inventory.md](code-inventory.md)).

## Key entities

- **Profile** — named editor defaults (`ProfileRegistry`).
- **Widget options** — the JSON contract between the form type and the TypeScript editor.
- **Dialect nodes** — `WikiLink`, `Mention`, `TablerIcon`, `TextDirective`, `ContainerDirective`, `LeafDirective`,
  `Math`, `MathBlock` (PHP) and their ProseMirror counterparts.
- **Resolvers** — `PageResolverInterface`, `UserResolverInterface`, `IconResolverInterface`,
  `DirectiveRendererInterface`.

## Non-goals

- Storing HTML; server-side Yjs; collaboration endpoints and permission checks (host); file storage (host);
  Crepe's list-item, image-block, block-handle, AI and emoji features; the demo application is not public API.

## Assumptions

- Hosts implement the candidate, title, upload and collaboration endpoints and check permissions there.
- Pages using a strict CSP allow `style-src-attr 'unsafe-inline'` (ProseMirror, KaTeX and Mermaid attributes).

## Validation

```bash
make release-check   # hygiene, assets, lint, cs, rector, phpstan, igor, PHP coverage 100%, translations, demo e2e, Vitest, bundle size
```

## Links

- [docs/SPEC-DRIVEN-DEVELOPMENT.md](../../docs/SPEC-DRIVEN-DEVELOPMENT.md)
- [docs/SPEC-KIT.md](../../docs/SPEC-KIT.md)
- [code-inventory.md](code-inventory.md)
