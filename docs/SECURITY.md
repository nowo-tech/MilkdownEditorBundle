# Security

## Table of contents

- [Scope](#scope)
- [Attack surface](#attack-surface)
- [Threat model](#threat-model)
- [Mitigations](#mitigations)
- [Content Security Policy](#content-security-policy)
- [Secrets](#secrets)
- [Logging](#logging)
- [Dependencies](#dependencies)
- [Permissions](#permissions)
- [CSRF](#csrf)
- [Release security checklist (12.4.1)](#release-security-checklist-1241)
- [AI security audit](#ai-security-audit)
  - [Independent audit of 1.0.0 (Appendix CE, 2026-11-01)](#independent-audit-of-100-appendix-ce-2026-11-01)
  - [Parser cost](#parser-cost)
- [Reporting a vulnerability](#reporting-a-vulnerability)

## Scope

`nowo-tech/milkdown-editor-bundle`: the `MilkdownEditorType` form type and its widget (TypeScript editor), the PHP
Markdown renderer (`MarkdownRendererInterface`, `milkdown_markdown`), configuration, translations and the demo.
The host owns its endpoints (candidates, titles, uploads, collaboration), authentication and authorisation.

## Attack surface

- **Markdown input** — from any user who can edit a field; rendered by the PHP renderer and parsed by the editor.
- **Candidate and title answers** — JSON from the host's endpoints, shown in the editor.
- **Upload answers** — URLs inserted into the document.
- **Configuration** — profile values (sprite URL, icons) and renderer options.
- **Mermaid and KaTeX** — third-party renderers of user-controlled source.

## Threat model

| Threat | Example |
|--------|---------|
| Stored XSS through raw HTML | `<script>` / `<img onerror>` in Markdown |
| Script URLs | `[x](javascript:…)`, `data:` URLs, URLs from endpoints or uploads |
| Remote resources | Tracking pixels `![](https://evil/p.png)`, Mermaid image shapes `A@{ img: "https://…" }` |
| Leaking hidden pages | Rendering the title of a page the viewer may not read |
| Injection through names | Icon names, directive names / attributes, mention handles in markup |
| Diagram / math injection | Mermaid HTML labels, KaTeX `\href` |
| DoS | Huge input, deep nesting, delimiter floods (`*_` × N), deeply nested TeX |
| CSP bypass | Inline styles or scripts without a nonce, nonce exfiltration |
| Hostile uploads | SVG / HTML files served from the host's origin |

## Mitigations

- The PHP renderer escapes raw HTML (`html_input: escape`, or `strip`), drops unsafe link schemes
  (`allow_unsafe_links: false`), turns remote images into links (`allow_remote_images: false`) and bounds nesting
  (`max_nesting_level`). Input over `max_input_length` (100 000 bytes) or with more than `max_inline_markers`
  (10 000) inline delimiter characters and line feeds is rendered as escaped text without parsing (see
  [Parser cost](#parser-cost)). At most `max_references` (500) distinct page ids and mention handles per document
  reach each resolver; later ones render as not visible / plain text.
  With `mention_display: name` the resolved name is escaped like every other value (editor: `textContent`); the user
  title endpoint must return only people the viewer may see, like the `@` candidates.
  Footnote ids are prefixed and salted per document (`nowo-md-fn-<salt>-<label>`, 1.3.1: the salt is 12 hex
  characters of an HMAC under a `kernel.secret` subkey of the render count and the Markdown, so it reveals nothing
  about the source; only footnote nodes are renamed, never
  user text or links), so a label cannot clobber a host element id and two documents on one page never share an id; labels are case-insensitive (as in GFM), so no two notes
  share a lower-cased id. Each reference expands to two links, so more than `max_footnote_refs` (200) references
  render as literal text (audit CZ-L1: 4 900 references to one note had grown 24.5 KB into 1.12 MB).
  `MilkdownEditorType` adds a matching `Length` constraint (bytes) when symfony/validator is installed, so such input
  is rejected when it is saved.
- Every value in dialect HTML is escaped; resolver URLs keep relative and http(s) forms only; icon, directive and
  attribute names are validated against strict patterns; unknown icons stay text.
- Page links render *Content not visible* — never a title or id — when the resolver does not return the page; a
  failing resolver hides every reference.
- The editor builds DOM nodes (no `innerHTML` for user data); candidate, title and upload URLs pass `safeUrl()`
  (TS and PHP strip leading C0 controls / spaces and inner tabs / newlines first, as browsers do); chips never store
  titles in Markdown.
- Mermaid runs with `securityLevel: 'strict'` and `htmlLabels: false`; its SVG is parsed with `DOMParser`, scripts,
  `foreignObject` and `on*` attributes are removed.
- **Remote resources in diagrams** (unless `renderRichContent(root, { allowRemoteImages: true })`; the editor's
  Mermaid preview always applies them). Mermaid lays a diagram out in the live document before the bundle sees the
  SVG, so the filtering starts with the source:
  1. image-shape metadata (`A@{ img: … }`, any spelling or YAML escape) is removed before `mermaid.render()`;
  2. on every `style`, `classDef`, `linkStyle` and `cssClass` line (any diagram type) the CSS is unescaped and each
     declaration containing `url(`, `image-set(`, `@import` or `expression(` is dropped;
  3. `themeCSS`, `themeVariables`, `fontFamily` and `altFontFamily` are Mermaid `secure` keys, so `%%{init}%%` and
     front matter cannot set them;
  4. in the returned SVG, `href` / `xlink:href` of `image`, `use`, `feImage` and `pattern` leaving the page's origin
     are dropped (fragments and `data:image/(png|gif|jpeg|webp)` stay), `<set>` / `<animate>` of an `href` are removed,
     and every inline style and restored `<style>` block is CSS-unescaped (`\75 rl(`, comments, case) and loses
     `@import`, `@font-face`, `image-set()` and non-local `url()`.
  The auditor's variants (absolute, `//host`, `\\host`, `/\host`, mixed case, `https:host`, a tab in the scheme,
  `themeCSS` rules, escaped `url(`, image-shape edge cases, `classDiagram` `style` and `stateDiagram` `classDef`
  with `url()`) fetched nothing with no CSP. A CSP `img-src` remains the backstop for diagram constructs not listed
  here.
- KaTeX always runs with `trust: false` (no `\href`), `maxExpand: 500`, bounded `maxSize` and a fresh, empty macro
  table. A formula is not handed to KaTeX when it is over 5 000 characters, has more than 200 `^` / `_` scripts,
  nests more than 50 levels (`{…}` groups including `^{…}` / `_{…}` scripts, `\left…\right`, `\begin…\end`,
  `\bgroup…\egroup`, `\begingroup…\endgroup`) or defines a macro (`\def`, `\gdef`, `\edef`, `\xdef`, `\let`,
  `\futurelet`, `\newcommand`, `\renewcommand`, `\providecommand`, `\global`, `\long`, `\csname`, …) — a macro
  would hide its nesting, and about 160 nested superscripts crash the browser tab, which no `try` / `catch` can
  catch. The guard patches the shared KaTeX module, so the editor's inline math and LaTeX preview are bounded too;
  each read-side formula renders in its own `try` / `catch`, so one failure (marked `data-math-error`) never stops the
  others. The auditor's crash inputs (`\bgroup`, `\begingroup`, `_\bgroup` and `\def` chains, 160 levels) no
  longer crash the reader page or the editor.
- **Context menu (1.3):** labels are text (`textContent`); *Open link* passes the href through `safeUrl()` and opens
  it with `noopener,noreferrer`; *Paste* goes through ProseMirror's paste pipeline (HTML parsed into the schema, never
  inserted raw); *Paste as plain text* never parses Markdown; host items receive a narrow context (selection, text,
  block type, `insertText`), not the ProseMirror view. The Clipboard API asks the browser for permission; without it
  the paste items are disabled.
- **Colours (1.4):** only names from `markdown.mark_colors` become classes (`nowo-md-text--NAME`, `nowo-md-bg--NAME`);
  no inline style and no raw CSS value is ever taken from Markdown, so colours add nothing to the CSP or XSS surface.
  The block handle and menus use CSSOM positioning only. Dragging hands ProseMirror a slice of the document itself.
- Crepe's image-block feature (rewrites alt text, loads remote images) and the emoji plugin (CDN images) are not used.
- **Markdown clipboard (1.5):** smart paste inspects the clipboard HTML with `DOMParser` (inert: no script runs, no
  node of it is inserted) and parses only the plain text, through the dialect parser and then the schema's DOM round
  trip, like the plain-text and HTML paths: unsafe link and image targets (`javascript:`, `data:`) are dropped, and
  the same hostile Markdown is stored identically whichever path pasted it (audit DN-L1, regression test). *Copy as
  Markdown* writes plain text only.
- **`nowo_milkdown_copy_markdown()` publishes the raw source** (audit DN-I2). The `<template>` is inert and escaped, but
  everything in it reaches whoever sees the page HTML: the ids of linked pages (`[[page:<id>]]`, even those the viewer
  sees as *Content not visible*), mention handles, and the attributes of host leaf directives and live blocks (their
  parameters), all things the per-viewer render hides or resolves. Print it only for readers who may see that raw
  source (typically: people who may edit the page), never on public or shared views, and never with Markdown that
  holds values the viewer may not read. When in doubt, offer the button to editors only.

## Content Security Policy

The widget works under `script-src 'self' 'nonce-…'` and `style-src-elem 'self' 'nonce-…'` with no `unsafe-inline`
scripts or style elements. CodeMirror's injected styles get the nonce (`EditorView.cspNonce`), Mermaid's style
elements get it while rendering, the widget's `<script type="module">` and `<link>` carry it. ProseMirror, KaTeX and
Mermaid set style attributes: `style-src-attr 'unsafe-inline'` is required. The demo e2e asserts 0 CSP violations
for the demo content.

- **The nonce is not copied into the page.** The editor reads it from its `<script nonce>` element's `nonce` property
  (browsers hide the attribute value from CSS and the DOM); it is not written into `data-nowo-milkdown-options`.
- **Mermaid's own handlers.** Sequence-diagram `link` / `links` popups and `click` callbacks use inline handlers;
  they are removed from the SVG and, under a nonce CSP, Mermaid's attempts show up as `script-src-attr` reports.
  Those diagram features do not work under this CSP by design.
- **Global patch while Mermaid renders.** For the duration of one render, `Document.prototype.createElement[NS]`
  stamp `<style>` elements with the nonce and `DOMParser.prototype.parseFromString` moves `<style>` blocks into
  placeholders (Mermaid builds its SVG on the live document, so a detached document is not an option). Other scripts
  running in that window are affected the same way; renders are serialised, the prototypes are restored in
  `finally` and the placeholder stash is emptied after each render.
- **`img-src` is the real control for remote images** in the editor (Markdown images are shown as written): use
  `img-src 'self' data: blob:` or the hosts you trust.

## Secrets

The bundle stores no secrets. CSRF tokens for uploads are generated by the host per form render. The demo's
`APP_SECRET` is a placeholder in `.env.example`; `.env` is never committed.

## Logging

The renderer logs a `warning` (channel `nowo_milkdown_editor`) when a resolver throws, with the resolver kind and the
exception class only — never Markdown, titles, handles or user data. The bundle never logs request bodies.

## Dependencies

Composer and npm dependencies are pinned (exact npm versions, `pnpm-lock.yaml`, `composer.lock` for development).
Run `composer audit` and `pnpm audit --prod` before a release; Dependabot watches Composer, npm and GitHub Actions.

## Permissions

The bundle performs no authorisation: the host's candidate endpoints must return only pages the author may read and
people who may read the document; the title endpoint and the `PageResolverInterface` implementation decide per
viewer; collaboration endpoints check edit rights before issuing the Mercure cookie (and on every `update`, `awareness`, `state` and — 1.2 — `compact` request; a `compact` snapshot replaces the host's log, so it gets the same edit check, size limit and rate limit as `update`; `corrupt` lets any editor's client trigger a log reset, so the host must cap those resets per page); upload endpoints validate the
token, size and type. Readers without edit rights must not receive `collaboration` options.

**Uploads.** The client checks (`upload_accept`, `upload_max_size`) are advisory: a direct POST skips them. The
upload endpoint must:

- accept an explicit list of types and **exclude `image/svg+xml` and HTML** (`image/*` matches SVG, which can carry
  script);
- detect the type on the server (content sniffing), not trust the client's `Content-Type` or file name;
- serve stored files with `X-Content-Type-Options: nosniff`, `Content-Disposition: attachment` for anything that is not
  a raster image, and `Content-Security-Policy: sandbox` — or from a separate, cookie-less origin.

**Auto-mount.** The module mounts an editor on every element with `data-nowo-milkdown-options`. A page that also shows
untrusted HTML through a sanitizer that keeps `data-*` attributes (DOMPurify's default) lets that HTML plant an
editor whose endpoints point elsewhere (cross-origin requests carry no cookies, but same-origin paths can be
targeted). On such pages add `data-nowo-milkdown-manual` to `<html>` and mount the bundle's own widgets explicitly
with `window.NowoMilkdownEditor.mount(el)`, or strip `data-nowo-milkdown-*` in the sanitizer.

## CSRF

N/A for the bundle — it has no session-authenticated mutations of its own (REQ-SEC-005). The upload hook sends the
host's token in `X-CSRF-Token`; the host validates it.

## Release security checklist (12.4.1)

1. No secrets, tokens or credentials in code, docs, fixtures or Git history.
2. `composer audit` and `pnpm audit --prod` clean (or documented exceptions).
3. Raw HTML escaped by default; unsafe links dropped; remote images off by default.
4. Every value interpolated into HTML escaped (PHP `DialectRenderer::e()`, TS `textContent`).
5. CSP: 0 violations in the demo e2e under the strict nonce policy.
6. No `eval`, `new Function`, inline handlers or `innerHTML` with user data (ESLint rule).
7. Per-viewer resolution: hidden pages never leak titles or ids (tests).
8. Input bounds: `max_input_length`, `max_inline_markers`, `max_references`, `max_nesting_level`, the form `Length`
   constraint, TeX length / depth, 10 suggestions, 50 ids per title request.
9. Logging carries no user content.
10. Dependencies pinned; Dependabot enabled.
11. AI security audit passed with a good grade (below).

## AI security audit

**2026-10-30 — Pass (good)** after remediation (REQ-SEC-004). Method: independent read-only review of `src/` (PHP
renderer, form type, Twig, CSP) and the TypeScript editor, focused on stored XSS, URL schemes, ReDoS, information
leaks, CSP bypasses, Mermaid / KaTeX injection, option parsing, uploads and worker-mode state. First grade: Pass
(conditional), one High; all findings fixed before 1.0.0:

| # | Severity | Finding | Fix |
|---|----------|---------|-----|
| 1 | High | Quadratic scanning / unbounded recursion in text-directive labels (`:a[` × N) | Labels ≤ 2 000 bytes, attributes ≤ 1 000 bytes on one line, nesting ≤ 8, ≤ 200 attempts per inline container; regression test |
| 2 | Medium | Polynomial backtracking in the directive fence regexes | Possessive quantifiers |
| 3 | Low | `http:host/x` images bypassed `allow_remote_images: false` | Any scheme except `data:image/…` and protocol-relative forms count as remote |
| 4 | Low | `//host` / `/\host` accepted by `safeUrl()` (TS and PHP) | Protocol-relative forms rejected |
| 5 | Low | Peer cursor colours written into style strings by y-prosemirror | Own `cursorBuilder` / `selectionBuilder` with `#rrggbb` validation and CSSOM |
| 6 | Low | Concurrent Mermaid renders could leave the nonce patch installed | Renders serialised |
| 7 | Info | Collaboration POSTs carry no CSRF token | Hosts must require `Content-Type: application/json` and check Origin / SameSite cookies (see USAGE) |
| 8 | Info | The editor shows Markdown images as written | Use a CSP `img-src` (the bundle's renderer applies `allow_remote_images`) |

### Independent audit of 1.0.0 (Appendix CE, 2026-11-01)

An independent static + PoC audit of v1.0.0 graded it **Pass (conditional) / Medium** (no Critical or High; no XSS
in 66 server-side payloads, Mermaid / KaTeX payloads under three CSPs, the editor and HTML paste). The 1.0.0
statement that league/commonmark's memory use was "bounded by `max_input_length`" was wrong: with the 1 MB default,
about 100 KB of `*_` exhausted PHP's default 128M `memory_limit`.

The auditor's re-verifications of PR #5 graded it **Pass (good) / Low** twice, each with partial fixes. At
`b236447`, L1 was only partly fixed (requests went out while Mermaid laid the diagram out, and restored `<style>`
blocks were not filtered) and L4, L5 and I7 were new. At `a065b1d`, two residuals remained: `classDiagram` `style` /
`stateDiagram` `classDef` `url()` (L1) and a depth bypass through `\bgroup`, `\begingroup` and macros (L5).

**Final grade: Pass (good) / Info** on `8eb4285`, the commit shipped in **v1.1.0**. The auditor measured both
residuals closed (no remote request from Mermaid style statements with no CSP or a lax CSP; no tab crash from
`\bgroup` / `\begingroup` / macro formulas, on the read side or in the editor), reproduced the committed assets byte
for byte and found `pnpm audit --prod` and `composer audit` clean. No Critical, High, Medium or Low finding remains;
only the documented Info items I3–I6 stay open. No GitHub security advisory (GHSA) was published: the impact of every
finding was availability only and needs an authenticated author who can save Markdown.

| Pass | Commit | Grade |
|------|--------|-------|
| Initial audit | `ffc5739` (1.0.0) | Pass (conditional) / Medium |
| Re-verification 1 | `b236447` (PR #5) | Pass (good) / Low (partial fixes) |
| Re-verification 2 | `a065b1d` (PR #5) | Pass (good) / Low (partial fixes) |
| Re-verification 3 (final) | `8eb4285` (PR #5, shipped in 1.1.0) | **Pass (good) / Info** |

The findings table lists the 1.1.0 state.

| # | Severity | Finding | Fix (1.1.0) |
|---|----------|---------|-------------|
| M1 | Medium | Stored DoS: ~1.5 KB of parser memory per inline delimiter; 1 MB default → ~1.5 GB, fatal error at 128M | `max_input_length` 100 000 bytes; `max_inline_markers` budget (10 000) before parsing; form `Length` constraint; regression tests |
| L1 | Low | Read-side Mermaid image shapes, `themeCSS` and style statements loaded remote images despite `allow_remote_images: false` | Source pre-filter (image shapes, resource-loading declarations of `style` / `classDef` / `linkStyle` / `cssClass`, CSS `secure` keys) so nothing is fetched during layout; remote `href`s, SMIL `href` animations and CSS-unescaped remote `url()` / `@import` / `image-set()` removed from the SVG and its restored styles (two earlier attempts in PR #5 were partial) |
| L2 | Low | One deeply nested formula (`RangeError`) stopped every later KaTeX render | Per-formula `try` / `catch` (`data-math-error`); TeX limits (see L5) |
| L3 | Low | Upload guidance allowed SVG and said nothing on serving uploads | [Permissions → Uploads](#permissions); USAGE example lists raster types |
| I1 | Info | `safeUrl()` accepted control-character prefixes before `//host` | TS and PHP strip them first |
| I2 | Info | Nonce copied into `data-nowo-milkdown-options` | Read from the script's `nonce` property; no longer emitted |
| I3 | Info | Mermaid's own inline handlers raise `script-src-attr` reports | Documented ([CSP](#content-security-policy)) |
| I4 | Info | DOM prototypes patched globally while Mermaid renders | Stash emptied after each render; documented |
| I5 | Info | Auto-mount is a script gadget next to sanitised untrusted HTML | Documented with the manual-mount mode |
| I6 | Info | Dev-only `minimatch` advisory via ESLint; Actions pinned by tag | Not shipped; org convention |
| L4 | Low | Line feeds were not counted: 100 KB of `a\n` peaked at ~90 MB | Line feeds count in `max_inline_markers`; worst case within the defaults ~39 MB ([Parser cost](#parser-cost)) |
| L5 | Low | 160 nested superscripts / 190 subscripts crashed the reader's tab within the 200-group cap; `\bgroup`, `\begingroup` and macros bypassed the first depth cap | Depth cap 50 counting `{}`, `\left`, `\begin`, `\bgroup`, `\begingroup`; ≤ 200 scripts; macro definitions refused; `macros: {}`, `trust: false`, `maxExpand: 500` forced; KaTeX module guarded for the editor too |
| I7 | Info | One document could send ~10 000 handles / ~2 000 page ids to a resolver | `max_references` (500) distinct ids / handles per resolver call; resolvers should still chunk their queries |

### Parser cost

league/commonmark scans each paragraph once per inline parser and allocates about 1.5 KB per delimiter or soft line
break it finds; the bundle's dialect parsers add CPU on top. Worst inputs within the defaults (100 000 bytes, 10 000
delimiters and line feeds), measured with the auditor's PoC families plus line-feed shapes on PHP 8.4 at
`memory_limit=128M`, total process peak (`memory_get_peak_usage()`, about 20 MB of it the PHP runtime and
autoloader): at most **39 MB** (10 000 lines of `a`) and **1.2 s** (10 000 one-word list items); 0.7 s for `:a[` per
paragraph, 0.6 s for headings, 0.4 s for 100 KB of `www.` autolinks. Plain prose is parsed in milliseconds. Raising
either limit raises those costs linearly: keep the budget under `memory_limit / 3 KB` (minus what your request
already uses) and size `max_input_length` for your longest real document.

## Reporting a vulnerability

See [.github/SECURITY.md](../.github/SECURITY.md): report privately to hectorfranco@nowo.tech.
