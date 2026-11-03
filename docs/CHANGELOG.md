# Changelog

All notable changes to this project are documented in this file. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project uses [Semantic Versioning](https://semver.org/).

## Table of contents

- [[Unreleased]](#unreleased)
- [[1.3.0] - 2026-11-03](#130---2026-11-03)
- [[1.2.1] - 2026-11-03](#121---2026-11-03)
- [[1.2.0] - 2026-11-02](#120---2026-11-02)
- [[1.1.1] - 2026-11-01](#111---2026-11-01)
- [[1.1.0] - 2026-11-01](#110---2026-11-01)
- [[1.0.0] - 2026-10-31](#100---2026-10-31)

## [Unreleased]

## [1.3.0] - 2026-11-03

context menu (right-click / Shift+F10), opt-in

### Added

- **Context menu** (`context_menu` feature, opt-in): right click, **Shift+F10** or the **ContextMenu** key inside the
  editable open an accessible menu (WAI-ARIA menu pattern: arrow keys, Home / End, type-ahead, submenus with Right /
  Left, Escape and Tab close and return focus to the caret) with *Cut*, *Copy*, *Paste*, *Paste as plain text*,
  *Turn into* (text, headings 1–3, lists, task list, quote, code), table actions (insert row above / below, column
  left / right, delete row / column / table), link actions (open in a new tab with `noopener`, copy address, remove)
  and block actions (duplicate, move up / down, delete). Shift + right click, right clicks in code blocks and form
  fields and touch long-presses keep the browser menu. Loaded as a lazy chunk only for fields that enable it.
  Actions apply to the selection the menu was opened for, even if something on the page moved the editor selection
  while the menu had focus.
- **Host items:** `window.NowoMilkdownEditor.contextMenu.register({ id, label, shortcut?, when?, run })` (also the
  `registerContextMenuItem` export) and the cancellable `nowo-milkdown:contextmenu` event on the widget root, whose
  `detail.groups` the host may edit.
- 21 `menu.*` UI strings in the 7 locales, sent in the widget JSON only when `context_menu` is enabled (fields
  without it keep the same JSON).

## [1.2.1] - 2026-11-03

footnotes in the PHP renderer (bounded, deterministic ids), mention_display: name

### Fixed

- **Footnotes render on read pages.** The editor (Crepe's GFM preset) writes GFM footnotes (`text[^1]` and
  `[^1]: note`), but the PHP renderer did not parse them: the definition was read as a CommonMark link reference,
  so `text[^1]` became a link labelled `^1` pointing at the note's first word, and the note itself disappeared. The
  renderer now enables league/commonmark's `FootnoteExtension` with prefixed ids (`nowo-md-fn-*`, `nowo-md-fnref-*`) and classes
  (`nowo-md-footnotes`, `nowo-md-footnote-ref`, `nowo-md-footnote-backref`). New option
  `nowo_milkdown_editor.markdown.footnotes` (default `true`; `false` keeps the 1.2.0 output). Ids are salted per
  document (`nowo-md-fn-<salt>-<label>`: a hash of the Markdown, stable across requests, plus a counter when one
  document is rendered twice on a page), labels are case-insensitive as in GFM, and more than
  `markdown.max_footnote_refs` (200) references render as literal text (audit CZ-L1, output amplification). See
  [UPGRADING](UPGRADING.md#121).

### Added

- **Mention names (opt-in, for apps without user names):** `nowo_milkdown_editor.markdown.mention_display: name`
  renders a resolved mention as the person's name (`ResolvedUser::$name`, escaped) with the handle in `data-handle`
  and `title="@handle"`; the profile / field option `mention_display: name` does the same in the editor, with names
  from the `@` suggestions and the new optional `user_title_url` (`GET url?handles=a,b` → `[{handle, name}]`). The
  Markdown keeps `@handle`. Defaults (`handle`) render exactly as 1.2.0, and the widget JSON only gains
  `mentionDisplay` / `userTitleUrl` when they are set.

### Documentation

- `docs/ROADMAP.md`: feature roadmap towards Notion / Outline parity (context menu, block menu with colour, comments,
  templates, media, database block, writing tools), parity matrix, open decisions.

## [1.2.0] - 2026-11-02

collaboration client: state log, compaction, reset notice with capped reload, corrupt report

### Added

- **Collaboration state log (FR-076):** `GET <url>/state` may answer `updates` (a list of base64 Yjs updates applied after `state`, in order), `seq` and `compact`; with `compact: true` and an integer `seq` the client posts its full state to `POST <url>/compact` (`{c, d, s}`) so a host that cannot merge Yjs updates (PHP) can compact its log. Answers with `state` only behave as before. `stateUpdates()` is exported from the collaboration module.
- **Collaboration reset:** a `{t: "r"}` message on the topic (the host replaced the document: restore, import, conversion) stops the session, sets the status `reset` (`data-collab="reset"`, announced with the new `collab.reset` message in 7 locales) and reloads the page after 1.5 s.
- **Session saves, seeding tab, corrupt reports:** a submit while the session is online adds the hidden `_nowo_milkdown_collab` field (the topic); token and state requests send `X-Nowo-Collab-Client` (the tab's Yjs client id); a state or update that cannot be applied is reported once with `POST <url>/corrupt` (`{c, s}`) and the provider stays offline (no loop).
- **Reload cap:** at most 3 automatic reloads per topic per 5 minutes (sessionStorage); beyond that the editor stays, announces `collab.reset_paused` and offers a **Reload** button (`collab.reload`), both in 7 locales. Malformed hub messages and broken presence updates are ignored instead of thrown.

## [1.1.1] - 2026-11-01

Code-block buttons visible on keyboard focus (focus-within / focus-visible, reduced motion) See [UPGRADING](https://github.com/nowo-tech/MilkdownEditorBundle/blob/v1.1.1/docs/UPGRADING.md#to-111).

### Fixed

- Accessibility: the code-block buttons (language picker, copy, preview toggle) were only shown on hover (`opacity: 0`
  at rest), so a keyboard user could tab onto invisible buttons. They now also show while focus is inside the code
  block (`:focus-within`) or on a button (`:focus-visible`), with the existing 2 px focus ring. With
  `prefers-reduced-motion: reduce` they appear without the fade. Hover behaviour and colours are unchanged.

### Documentation

- SECURITY.md (§ Independent audit) and COMPLIANCE.md (REQ-SEC-004) record the final Appendix CE grade: **Pass
  (good) / Info** on `8eb4285`, shipped in 1.1.0 (1.0.0 was Pass (conditional) / Medium; the re-verifications of
  `b236447` and `a065b1d` were Pass (good) / Low with partial fixes). No GHSA: availability impact only, authenticated
  author.

### Tests

- Demo e2e: the axe colour-contrast check no longer fails on the first run after a fresh stack. The click in
  `openToolbar()` left the pointer next to the Mermaid code block; on a cold load the lazy Mermaid preview landed
  afterwards, grew the block under the pointer and started Crepe's 200 ms hover fade-in of the code-block buttons,
  which axe read half-transparent (below 4.5:1; about 7:1 at rest in both themes). `openDemo()` now waits for the
  Mermaid preview and fonts, and `seriousViolations()` waits for running transitions to finish. A regression test
  runs axe during a slowed fade.
- Demo e2e: tabbing to a code-block button (with and without reduced motion) asserts opacity 1, a 2 px solid focus
  outline and no serious axe violation while it is focused.

## [1.1.0] - 2026-11-01

Security hardening (Appendix CE): renderer cost budget, 100 KB default, Mermaid remote-resource filter, KaTeX depth and macro limits See [UPGRADING](UPGRADING.md#to-110).

Planned as **1.1.0** (minor): security fixes that change defaults and add options.

### Added

- Renderer options `nowo_milkdown_editor.markdown.max_inline_markers` (default 10 000) and `max_references`
  (default 500).
- `MilkdownEditorType` option `max_length` (bytes; default `markdown.max_input_length`; `null` turns it off): a
  `Length` constraint when symfony/validator is installed (now suggested).
- `renderRichContent()` option `allowRemoteImages` (default `false`).

### Changed

- `nowo_milkdown_editor.markdown.max_input_length` defaults to 100 000 bytes (was 1 000 000).
- The CSP nonce is no longer written into `data-nowo-milkdown-options`; the editor reads it from its `<script nonce>`.
- Mermaid diagrams (read side and editor preview) no longer load remote images or set `themeCSS` / `themeVariables`
  / `fontFamily` from `%%{init}%%` or front matter unless `allowRemoteImages` is on.
- KaTeX formulas nested deeper than 50 levels, with more than 200 scripts or defining macros are shown as source
  with `data-math-error`; `maxExpand` is 500 (was 1 000).
- `make release-check` starts the Docker stack (`ensure-up`) before the co-author trailer check, in the order of the
  bundle standards.
- `.cursorignore` excludes the committed Vite build (`src/Resources/public/chunks/`, `katex/`, `milkdown-editor.*`)
  instead of a stale `js/*.map` pattern.
- Development and demo lock files: `league/commonmark` 2.10.7 and, in the demo, `nowo-tech/twig-inspector-bundle`
  1.3.2 (the bundle's constraints are unchanged).

### Security

Fixes for the independent REQ-SEC-004 audit of 1.0.0 (Appendix CE: Pass (conditional) / Medium) and its
re-verification of the first fix (Pass (good) / Low).

- **M1 (Medium, stored DoS):** league/commonmark uses about 1.5 KB of memory per inline delimiter, so the old 1 MB
  `max_input_length` let ~100 KB of `*_` exhaust PHP's default 128M `memory_limit` on every render. Input over
  `max_input_length` or `max_inline_markers` now renders as escaped text without parsing, and the form rejects it.
- **L4 (Low):** line feeds count in `max_inline_markers` (100 KB of `a\n` peaked at ~90 MB). Worst case within the
  defaults: ~39 MB, 1.2 s (PHP 8.4).
- **L1 (Low):** Mermaid image shapes are removed from the source, `style` / `classDef` / `linkStyle` / `cssClass` lines
  (any diagram type) lose declarations with `url(`, `image-set(`, `@import` or `expression(` after CSS unescaping, and
  the CSS keys are Mermaid `secure` keys, so nothing is fetched while Mermaid lays the diagram out; the SVG then loses remote `href`s, SMIL `href` animations and, after
  CSS unescaping, remote `url()`, `image-set()`, `@import` and `@font-face` in inline and restored styles. (The first
  attempt only filtered the final SVG.)
- **L2 (Low):** each KaTeX formula renders in its own `try` / `catch` (`data-math-error` on failure).
- **L5 (Low):** formulas over 5 000 characters, over 200 `^` / `_` scripts, nested over 50 levels (groups, scripts,
  `\left`, `\begin`, `\bgroup`, `\begingroup`) or defining macros (`\def`, `\gdef`, `\let`, `\newcommand`, …) are
  not handed to KaTeX — 160 nested superscripts crashed the reader's tab. Every KaTeX call gets `trust: false`,
  `macros: {}` and `maxExpand: 500`; the guard covers the editor's math too.
- **L3 (Low, docs):** upload guidance excludes SVG / HTML and asks for server-side type detection, `nosniff`,
  `Content-Disposition: attachment` and a sandbox CSP or separate origin.
- **I1:** `safeUrl()` (TS and PHP) and the remote-image check strip leading C0 controls / spaces and inner tabs /
  newlines before checking for protocol-relative URLs.
- **I2:** the CSP nonce is no longer copied into `data-nowo-milkdown-options`.
- **I7:** at most `max_references` distinct page ids / handles reach each resolver per document (and only answers for
  requested keys are used).
- **I3–I5:** documented Mermaid's inline handlers under a nonce CSP, the global prototype patch while Mermaid
  renders (its style stash is now emptied after each render) and the manual-mount mode for pages with untrusted
  HTML.

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
