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
  (10 000) inline delimiter characters is rendered as escaped text without parsing (see [Parser cost](#parser-cost)).
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
  `foreignObject` and `on*` attributes are removed. Unless `renderRichContent(root, { allowRemoteImages: true })` is
  used, `href` / `xlink:href` of `image`, `use`, `feImage` and `pattern` elements are dropped when they leave the
  page's origin (fragments and `data:image/(png|gif|jpeg|webp)` stay) and inline styles with a remote `url(…)` are
  removed; the editor's Mermaid preview always drops them. KaTeX runs with `trust: false` (no `\href`), bounded
  `maxExpand` and `maxSize`; formulas over 5 000 characters or 200 nested groups are not rendered, and each formula
  renders in its own `try` / `catch`, so one failure (marked `data-math-error`) never stops the others.
- Crepe's image-block feature (rewrites alt text, loads remote images) and the emoji plugin (CDN images) are not used.

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
viewer; collaboration endpoints check edit rights before issuing the Mercure cookie; upload endpoints validate the
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
8. Input bounds: `max_input_length`, `max_inline_markers`, `max_nesting_level`, the form `Length` constraint, TeX
   length / depth, 10 suggestions, 50 ids per title request.
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
about 100 KB of `*_` exhausted PHP's default 128M `memory_limit`. Fixed in 1.0.1; the re-grade belongs to the
independent auditor.

| # | Severity | Finding | Fix (1.0.1) |
|---|----------|---------|-------------|
| M1 | Medium | Stored DoS: ~1.5 KB of parser memory per inline delimiter; 1 MB default → ~1.5 GB, fatal error at 128M | `max_input_length` 100 000 bytes; `max_inline_markers` budget (10 000) before parsing; form `Length` constraint; regression tests |
| L1 | Low | Read-side Mermaid image shapes loaded remote images despite `allow_remote_images: false` | Remote `href`s of `image` / `use` / `feImage` / `pattern` and remote `url(…)` styles dropped |
| L2 | Low | One deeply nested formula (`RangeError`) stopped every later KaTeX render | Per-formula `try` / `catch` (`data-math-error`); TeX ≤ 5 000 chars and ≤ 200 nested groups |
| L3 | Low | Upload guidance allowed SVG and said nothing on serving uploads | [Permissions → Uploads](#permissions); USAGE example lists raster types |
| I1 | Info | `safeUrl()` accepted control-character prefixes before `//host` | TS and PHP strip them first |
| I2 | Info | Nonce copied into `data-nowo-milkdown-options` | Read from the script's `nonce` property; no longer emitted |
| I3 | Info | Mermaid's own inline handlers raise `script-src-attr` reports | Documented ([CSP](#content-security-policy)) |
| I4 | Info | DOM prototypes patched globally while Mermaid renders | Stash emptied after each render; documented |
| I5 | Info | Auto-mount is a script gadget next to sanitised untrusted HTML | Documented with the manual-mount mode |
| I6 | Info | Dev-only `minimatch` advisory via ESLint; Actions pinned by tag | Not shipped; org convention |

### Parser cost

league/commonmark scans each paragraph once per inline parser and allocates about 1.5 KB per delimiter it finds;
the bundle's dialect parsers add CPU on top. Worst inputs within the defaults (100 000 bytes, 10 000 delimiters),
measured with the auditor's PoC families on PHP 8.4 at `memory_limit=128M`: peak 35 MB, at most 0.7 s (`:a[` per
paragraph, `:::a` container lines), 0.4 s for 100 KB of `www.` autolinks. Plain prose is parsed in milliseconds.
Raising either limit raises those costs linearly: keep the delimiter budget under `memory_limit / 3 KB` and size
`max_input_length` for your longest real document.

## Reporting a vulnerability

See [.github/SECURITY.md](../.github/SECURITY.md): report privately to hectorfranco@nowo.tech.
