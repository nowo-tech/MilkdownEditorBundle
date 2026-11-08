# Security

## Table of contents

- [Scope](#scope)
- [Attack surface](#attack-surface)
- [Threat model](#threat-model)
- [Mitigations](#mitigations)
  - [Collaboration: availability and integrity of the field (1.10)](#collaboration-availability-and-integrity-of-the-field-110)
  - [Host references and previews](#host-references-and-previews)
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

- **Comments (1.6).** Comments are decorations, never in the Markdown, exports or search. **Anchors are untrusted on
  both sides**: the editor validates every anchor and thread id from the host (`parseCommentAnchor()`, ids
  `^[A-Za-z0-9_-]{1,64}$`, quote ≤ 4096 UTF-16 units, context ≤ 32, offsets ≤ 10⁷, Yjs positions base64 ≤ 512, the whole
  anchor ≤ 16 KiB; unknown keys dropped), and hosts must validate them with `CommentAnchor::fromJson()` (the same
  caps and shared test vectors) before storing, and treat `quote.exact` as text (escape it in notifications and
  e-mails). Yjs positions are decoded in a try / catch and only ever handed to Yjs. **Quotes duplicate page text**
  outside the body: apply the page's read permission to comments, include anchors in purge and privacy erasure, and
  keep them out of exports, search and AI context. Mentions, page links and icons are `U+FFFC` in quotes, so anchors
  hold no per-viewer title or name. **Thread component:** requests go only to `comments.url` (validated as a path or
  an http(s) URL in PHP and as the page origin in the browser; `redirect: 'error'`, same-origin credentials, the CSRF
  header on writes). Comment bodies are host HTML (rendered with this bundle's safe renderer) that the component
  **never assigns with `innerHTML`**: it parses it in an inert `DOMParser` document and copies an allow-list of
  elements (`p br strong em del s code pre blockquote ul ol li a span mark h1–h6 table …`) and attributes (`href`
  through `safeUrl()`, `nowo-md-*` classes, `title`, `datetime`, `lang`); scripts, styles, SVG, iframes and event
  handlers are dropped, other elements become their text, and links get `rel="noopener noreferrer nofollow"`. Names
  are text, colours `#rrggbb`, avatars through `safeAvatarUrl()` (only `https://` without userinfo or a same-origin `/`
  path; `http:`, `data:` of any kind, `blob:`, `//`, backslashes, quotes, `<`, `>`, backticks, controls (a trailing line
  feed included), IPv6 literals, invalid ports and URLs over 2048 UTF-8 bytes are dropped; the
  `<img>` has `alt=""`, `referrerpolicy="same-origin"`, no `crossorigin`, and falls back to the initial on error; the
  host's `img-src` applies), reactions short non-ASCII
  strings. Buttons follow the host's `can` flags, which the host re-checks on every write. Live updates carry ids
  only (validated, at most 100 per message, debounced). The editor keeps nothing in storage.
- **Version view and diff (1.6).** `version_view` is read-only, without collaboration, uploads or comments; *Restore*
  and *Copy* only emit events. `nowo_milkdown_diff()` renders both versions with the normal renderer (per-viewer
  resolvers, no cache across calls); deleted words are copied from the renderer's escaped output into `<del>`, and
  tags come from the new version only, so the markup stays well-formed; inputs over `max_input_length`, more than
  2000 blocks or 500 changed blocks fall back to an escaped line diff, LCS tables are capped at 10⁶ cells, and one
  render has a total budget of 10⁶ word-level cells (about 0.3 s): once spent, the remaining changed blocks are shown
  whole as removed + added, so revisions written to be expensive cannot hold a PHP worker for long.
- **Heading ids (1.6).** Every editor heading id is prefixed `nowo-h-` (before 1.6 Milkdown used the bare heading
  text, which a heading could use to take over a host element id); the read-side ids (`markdown.heading_ids`) are
  prefixed too, so headings never clobber host ids or globals. Ids are unique per document only: two editors on one
  page, or both sides of a diff, can repeat one.
- **Comment panel container (1.6).** `comments.container` resolves to the first match **outside** any editor, read
  view (`.nowo-md`) or contenteditable region, and `comments.mount()` refuses such elements, so page content can
  neither receive the panel nor get its text saved into the Markdown.

### Collaboration: availability and integrity of the field (1.10)

A failing or slow hub, or a hostile or broken `GET state`, must not be able to destroy content. The field is written only
from a bound document or from what the person typed. An answer that is not a 2xx with a `state` string or an `updates` list
is an error (retried, or a fallback), never an empty document. An empty state without an order to seed does not bind over a non-empty field. A
client that is not in the session sends no presence, no compaction and no document update, so it cannot write an empty or
stale document to the shared log. The hold on
submit is bounded by a clamped timer (at most 60 s) and cannot block a form for good. The option is an integer validated
in PHP and clamped again in the browser; the new messages are text (`textContent`).

The number in `_nowo_milkdown_collab_seq` (1.11) comes from the client and is not proof: a host clamps it to its last number.
It only decides whether a later save outside the session asks first, and an editor can replace the document anyway. A missing
hub message cannot raise it: an update counts only once the one before it does. Independent audit (Appendix HV, 2026-11-07, `98e0b76`): **Pass (good) / Low**. With a host that names its logs, a tab that was away posts nothing and its save asks, in Chromium, Firefox and WebKit on a real hub. The number never counted an update the document lacks, in about 1,500 fault-injection runs. Open: in Firefox, a tab that never binds keeps what the browser restored on reload, even when that is older than the page, and a save replaces the page with no ask; connection steps give up after a fixed 20 s, which fails safe.

`e` and `_nowo_milkdown_collab_epoch` (1.12) come from the client and are compared with the host's current value: an equal one
gains nothing, since an editor may replace the document anyway. A wrong one only makes that client's request refused or its save ask.

Still the host's: a save without `_nowo_milkdown_collab` can replace a shared log, so check the base revision, and keep
revisions. A save while `offline` is one: it goes without a session and with no warning, as it has since 1.2, and the same
path applies (WikiBundle: `replaced()`). A peer with edit rights can still post an update that empties the shared document; that is an edit. The next
editor of a non-empty field does not bind it: it goes standalone at the deadline, and the field keeps its content.

**Audit:** Appendix HF, **Pass (conditional) / Medium** at `4d2cc37`, no Critical or High. Accepted residual, closed next by a conflict answer on WikiBundle's side: a save outside the session makes a host with a shared log drop it, which loses peers' unsaved work (see above). That covers a standalone save, where the person is warned, and an `offline` save, where they are not. While waiting, keys in the editor do not reach the page's bubble-phase listeners.

### Host references and previews

(1.9, opt-in. Audited: Appendix GX, **Pass (good) / Info** at `1de17cd`.) What an author controls is the id, the view,
the height, the label, `type`, `size`, caption, width and alignment; the templates, schemes, origins and sandbox tokens are
configuration, and a host resolver's answer is semi-trusted.

- **Schemes.** Only those of `markdown.host_schemes`, never a browser scheme. Unknown schemes follow the existing rules.
- **Ids.** `[A-Za-z0-9._~-]{1,200}`, no leading dot (`..` would walk up the template's path), URL-encoded into the
  template, which must have `{id}` after the first `/` of its path. Any other value of the scheme is inert on both sides.
- **Resolved URLs** (templates and resolvers, images, links, cards, previews) pass `safeUrl()` / `DialectRenderer::safeUrl()`
  after resolution. A resolved image also meets the remote-image policy: off `host_image_origins` and with
  `allow_remote_images` off it becomes a link, with no request. The list compares the whole origin, and author images never
  use it. The editor shows what the templates give; there, as for author images, `img-src` is the control.
- **Failures.** A reference the resolver leaves out, a thrown exception or an answer of the wrong type renders
  *Content not visible* or the plain card; nothing about the file is shown, and logs carry no document content. References
  are capped by `max_references`.
- **Attribute block.** Bounded pattern, fixed keys and fixed values; classes and the `width` attribute only.
- **Previews.** A frame with the strictest `sandbox` by default, `referrerpolicy="no-referrer"`, `loading="lazy"`; in the
  editor the source is set near the viewport and at most `max_references` files per editor get a frame. Tokens are an
  allow-list, and `allow-scripts` with `allow-same-origin` or `allow-popups-to-escape-sandbox` is refused by the
  configuration and dropped by the renderer and the editor. Even without `allow-scripts`, `allow-popups-to-escape-sandbox`
  lets a link in the preview open outside the sandbox: add it only for a preview origin you trust. An author can make any
  reader's browser open a preview URL of the configured template for any id, also top-level through a plain link, where the
  frame's `sandbox` does not apply: the **endpoint** must authorise the viewer and send the headers in
  [USAGE](USAGE.md#previews). Requests use `GET`, so every path a template can reach must be free of side effects.
- **Planted widgets.** Auto-mount takes `hostSchemes` and `previewSandbox` only from `script[data-nowo-milkdown-config]`
  (printed by `nowo_milkdown_editor_assets()`, with the page's nonce when it has one), never from a widget's JSON. On a page
  without nonces the element itself is accepted: a sanitizer that allows `script type="application/json"` can let it through, and `frame-src` is what then stops a frame.
- **Editor view.** Host images and previews are built with DOM APIs; the toolbar writes node attributes, and values are
  validated again when read.
- **Plain URLs (1.13, `host_url_patterns`).** Configuration, never author input. A matching image, link or card is a
  reference of its scheme: the resolver decides, and a refused one keeps no URL, id, alt text, link text or name. Patterns
  are anchored, need one `(?<id>…)` group, are limited to a subset PCRE and RegExp read alike (no lookaround, inline flags,
  back references, Unicode escapes, verbs, POSIX classes or top-level alternation) and to 300 characters. URLs are
  normalised first (query and fragment dropped, path percent-decoded once, uuids lower-cased, absolute URLs of
  `host_url_hosts` or the request's host read as their path). A match that cannot be checked fails closed: a PCRE error, or
  a URL over 2,048 characters starting with a pattern's literal prefix, is refused (audit IJ-L1). What remains: a URL form a
  pattern does not describe (another variant, another host not listed, double encoding) stays an ordinary link, so patterns
  must cover the file route. Only patterns of the page's configuration block reach the editor. Text that merely contains a
  file URL (not a link or image), or raw HTML escaped as text, is not a reference.
- **Hosts from env placeholders (1.14).** `host_url_hosts` entries may be `%env()%` placeholders. They are validated and
  lower-cased when the container builds `HostSchemes`, and an invalid value throws instead of being matched. A host only
  widens which absolute URLs are read as host values (more URLs go through the resolver and can be hidden), never what a
  viewer sees, so a placeholder cannot weaken the checks. The error names the entry, never the resolved value (it could
  be a DSN, audit IK-I1); `''` and `null` add no host; a whole-list placeholder is refused at compile time (IK-I2).
- **Browser-normalised URL forms (1.14, audit IJ-I10).** Before matching, the host of an absolute URL loses a trailing
  dot, the scheme's default port and any userinfo (an own host with `user@` counts as own, so the URL is hidden unless
  visible), and a path loses repeated slashes and dot segments (`.`, `..`, `%2e`, RFC 3986 §5.2.4) after the single
  decoding. Server and editor (`urlCandidate()`) apply the same rules. 1.14.1 (Delta IK, IK-I7, IK-I8): ASCII percent-escapes in the host are decoded, leading zeros of the port dropped (a decoded host with `@`, `/`, `\`, `?` or `#` counts as own, so it is hidden unless visible), and a URL that matches no pattern is tried once more without one trailing slash. What remains: other hosts not listed in
  `host_url_hosts`, double encoding and backslashes stay ordinary links.
- **Context (1.13).** A `ContextualHostFileResolverInterface` gets the host's render context, so a host can refuse files
  outside it (e.g. an API token's reach). The bundle never reads or stores the context.

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

With host previews, **`frame-src` is required**: list the preview origin (`'self'` if same-origin), and nothing broader. It
is also what stops a frame on a page where HTML injection has already happened.

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
  a raster image, and `Content-Security-Policy: sandbox` — or from a separate, cookie-less origin;
- (1.8) answer `kind` from the sniffed type: the editor trusts the host's `kind` and never the browser's file type when
  the answer has one.

**File cards (1.8).** `::file[name]{href size type}` comes from Markdown anyone with edit rights can write. The editor
and the PHP renderer escape the name and drop control and invisible format characters (Cc / Cf: a right-to-left
override could make `fdp.exe` read as `exe.pdf`), keep only relative or http(s) links (`safeUrl()`, also when
`allow_unsafe_links` is on), percent-encode quotes and brackets before the URL is written into the Markdown, add
`rel="noopener noreferrer"`, and render a card without a usable URL as plain text. The badge and category come from
the link target (its extension, else the MIME type), never only from the label, so `::file[invoice.pdf]{href=
"/u/setup.exe"}` shows `EXE`; badges are letters and digits only; `size` must be digits; nothing from the card reaches
a `style` attribute.

**Top layer (1.8).** Menus use `popover="manual"` (an attribute, not a style) and are positioned through CSSOM, which a
strict `style-src-attr` allows; the fallback without the Popover API copies the theme tokens with `style.setProperty()`.

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

| Date | Change | Grade |
|------|--------|-------|
| 2026-11-08 | 1.13.0: `host_url_patterns`, `ContextualHostFileResolverInterface`, `host_refused_links` (Beacon request after WikiBundle Appendix IF) | Appendix IJ at `a2560e7`: **Pass-Low** (IJ-L1; IJ-I1 to IJ-I3) |
| 2026-11-08 | IJ fixes: fail closed on PCRE errors and long URLs (IJ-L1), stricter patterns (IJ-I1), one classification per URL and document (IJ-I2), URL normalisation and `host_url_hosts` (IJ-I3) | Delta IJ at `51f3606`: **Pass** (IJ-I10 Info: crafted URLs that browsers normalise — default port, userinfo, dot segments — still match no pattern) |
| 2026-11-08 | 1.14.0: `host_url_hosts` env placeholders, validated at service build, invalid values throw | Appendix IK at `fed6d92`: **Pass** (IK-I1 to IK-I3 Info, fixed with the IJ-I10 hardening in the follow-up commit); Delta IK at `a52c088`: **Pass** (IK-I7, IK-I8 Info open: percent-encoded hosts, leading-zero ports, trailing slash after the variant) |
| 2026-11-08 | Unreleased (1.14.1): IK-I7 (percent-encoded hosts, leading-zero ports) and IK-I8 (one trailing slash) hardening in `HostSchemes` and `host.ts` | Delta pending |

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
