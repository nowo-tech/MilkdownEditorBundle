# Changelog

All notable changes to this project are documented in this file. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project uses [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Changed

- `make release-check` starts the Docker stack (`ensure-up`) before the co-author trailer check, in the order of the
  bundle standards.
- `.cursorignore` excludes the committed Vite build (`src/Resources/public/chunks/`, `katex/`, `milkdown-editor.*`)
  instead of a stale `js/*.map` pattern.
- Development and demo lock files: `league/commonmark` 2.10.7 and, in the demo, `nowo-tech/twig-inspector-bundle`
  1.3.2 (the bundle's constraints are unchanged).

### Documentation

- `specs/001-baseline`: the code inventory maps 79/79 production units (adds `assets.ts`) to the functional
  requirements defined in `spec.md`; `spec.md` gains `FR-THEME-001` and `FR-BUILD-001` / `FR-BUILD-002`.
- `docs/DEMO-FRANKENPHP.md` lists its troubleshooting subsections in the table of contents, and `docs/COMPLIANCE.md`
  gains one.

## [1.0.0] - 2026-10-31

First release.

### Added

- `MilkdownEditorType`: Markdown field edited with Milkdown 7.23 and a reduced `CrepeBuilder` (toolbar, top bar, link
  tooltip, tables, CodeMirror, placeholder, cursor, accessible `/` block menu); named profiles
  (`nowo_milkdown_editor.profiles`, `default_profile`) and per-field options (features, theme, min height,
  suggestions, link-title URL, icon sprite and allowlist, uploads, collaboration, CSP nonce).
- Markdown dialect in TypeScript (remark parse + stringify) and PHP (league/commonmark extension): page links by id
  `[[wiki:<uuid>#anchor]]`, mentions `@handle`, Tabler icons `:tabler-<name>:`, directives `:::callout`,
  `:::details`, `::: {align=…}`, `:mark[…]{color=…}`, leaf directives for host blocks, math and Mermaid fences.
- Suggestion hook for `[[`, `@`, `:` and `/`: remote candidates (debounced, at most 10), listbox pattern on the
  multi-line editable, capture-phase keys.
- Per-viewer page titles (batched `?ids=` request; *Content not visible* for pages the viewer may not read).
- Upload hook: multipart POST with an `X-CSRF-Token` header, progress and errors in live regions, *Insert file*.
- Opt-in Yjs collaboration over Mercure (`collaboration` option, lazy chunk).
- Mermaid previews (strict security level, no HTML labels, nonce-stamped styles) and KaTeX math (no `\href`), lazy.
- Accessibility fixes over Crepe: named controls, `ul > li` lists with real task checkboxes, contrast-safe code and
  list colours, visible focus rings, Tab leaves the editor outside lists / tables / code, named CodeMirror content.
- CSP: CodeMirror gets the nonce (`EditorView.cspNonce`), the widget's module and stylesheet carry it,
  `CspNonceProviderInterface` (default: the `csp_nonce` request attribute).
- `MarkdownRendererInterface` / `milkdown_markdown` Twig filter, resolver interfaces for pages, users, icons and
  directives; `nowo_milkdown_editor_assets()` Twig function; `renderRichContent()` for read pages.
- `--nowo-milkdown-*` theme tokens (light, dark, auto); translations in en, es, de, fr, it, nl, pt.
- Symfony 8.1 demo on FrankenPHP with Playwright + axe + CSP e2e.
