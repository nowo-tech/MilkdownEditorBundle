# Changelog

All notable changes to this project are documented in this file. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project uses [Semantic Versioning](https://semver.org/).

## Table of contents

- [[Unreleased]](#unreleased)
- [[1.15.1] - 2026-11-09](#1151---2026-11-09)
- [[1.15.0] - 2026-11-09](#1150---2026-11-09)
- [[1.14.1] - 2026-11-08](#1141---2026-11-08)
- [[1.14.0] - 2026-11-08](#1140---2026-11-08)
- [[1.13.0] - 2026-11-08](#1130---2026-11-08)
- [[1.12.0] - 2026-11-07](#1120---2026-11-07)
- [[1.11.0] - 2026-11-07](#1110---2026-11-07)
- [[1.10.0] - 2026-11-07](#1100---2026-11-07)
- [[1.9.0] - 2026-11-06](#190---2026-11-06)
- [[1.8.0] - 2026-11-06](#180---2026-11-06)
- [[1.7.0] - 2026-11-04](#170---2026-11-04)
- [[1.6.0] - 2026-11-04](#160---2026-11-04)
- [[1.5.1] - 2026-11-04](#151---2026-11-04)
- [[1.5.0] - 2026-11-03](#150---2026-11-03)
- [[1.4.0] - 2026-11-03](#140---2026-11-03)
- [[1.3.1] - 2026-11-03](#131---2026-11-03)
- [[1.3.0] - 2026-11-03](#130---2026-11-03)
- [[1.2.1] - 2026-11-03](#121---2026-11-03)
- [[1.2.0] - 2026-11-02](#120---2026-11-02)
- [[1.1.1] - 2026-11-01](#111---2026-11-01)
- [[1.1.0] - 2026-11-01](#110---2026-11-01)
- [[1.0.0] - 2026-10-31](#100---2026-10-31)

## [Unreleased]

### Documentation

- USAGE: new section "Using it from a DDD / hexagonal application" (where the bundle sits in a hexagonal host, the ports, events and DTOs to build an anti-corruption layer on, and the known limitations).

## [1.15.1] - 2026-11-09

Patch: bundled mermaid 12.3.0 and mdast-util-directive 3.2.0, assets rebuilt.

### Changed

- **Dependencies:** the bundled `mermaid` goes from 12.2.0 to 12.3.0 and `mdast-util-directive` from 3.1.1 to 3.2.0 (built with vite 8.3.6); the shipped assets under `src/Resources/public` are rebuilt (chunk file names change). No API or configuration change.

## [1.15.0] - 2026-11-09

Next minor: **1.15.0**. The `top_bar` keeps one row on phones with a "⋮" overflow menu, and its heading selector is translated (Beacon MUX-41). See [UPGRADING](UPGRADING.md#to-1151).

### Added

- **Top bar overflow on phones (MUX-41):** below 768 px (`TOP_BAR_GROUP_MEDIA_QUERY`, followed live) the `top_bar` no longer wraps to several rows: the controls that do not fit are hidden and offered by a "⋮" menu button (`aria-haspopup="menu"`, `aria-expanded`, `aria-controls`) that opens the bundle's accessible menu (arrow keys, Home / End, type-ahead, Esc closes and gives the focus back; the heading selector becomes a submenu of radio items). Desktop keeps the bar as it is.
- **Top bar accessibility:** Crepe's icon buttons get names (`aria-label` / `title`), and Enter / Space run them (Crepe reacts to pointer presses only); on the heading selector they open the heading options as a menu.
- **Translated top bar (MUX-41):** the heading selector no longer shows Crepe's English *Paragraph* / *Heading 1–6*. 23 new `topbar.*` keys in the 7 locales (de, en, es, fr, it, nl, pt), sent only to fields with `top_bar`; four new UI glyphs (`bold`, `italic`, `strikethrough`, `dots-vertical`, Tabler 3.50.0). Assets rebuilt.

## [1.14.1] - 2026-11-08

Three more URL forms that browsers normalise are read as host values (Delta IK, IK-I7 and IK-I8; Delta IK2, IK2-L1). Nothing to configure.

### Security

- **Encoded hosts and zero-padded ports (IK-I7).** `HostSchemes::normalizeAuthority()` and the editor's
  `normalizeAuthority()` decode ASCII percent-escapes in the authority (`beacon%2Eexample.com`, `host%3A443`) and drop
  leading zeros of the port (`:0443` is `:443`, so the default-port rule applies) before comparing with the own hosts. A
  decoded host that contains a URL delimiter (`@`, `/`, `\`, `?`, `#`) is no host a browser opens; it is read as own, so
  the URL goes through the resolver and is hidden unless visible.
- **Trailing slash (IK-I8).** When a normalised URL matches no `host_url_patterns` entry and ends with `/`, it is
  matched again without that one slash, so `/files/<uuid>/original/` and `/files/<uuid>/original/.` (which Symfony's
  router redirects to the route without the slash) are host values. A pattern written with the slash still matches as
  written. Server (`HostSchemes::matchUrl()`) and editor (`matchHostUrl()`) apply the same rules.
- **Tabs and newlines inside a URL (IK2-L1, since 1.13).** `HostSchemes::candidate()` and the editor's `urlCandidate()`
  clean the URL as a browser reads it (`DialectRenderer::cleanUrl()` rules: leading and trailing C0 controls and spaces
  trimmed, every tab, LF and CR inside removed) before matching. `::file{href="/fi<TAB>les/<uuid>/original"}` and
  `https://bea<TAB>con.example/…` were classified as foreign but rendered as the own file link; they now go through the
  resolver and are hidden when refused, like the plain form.

### Documentation

- `SECURITY.md`: non-ASCII host forms that browsers map to an own host (zero-width space, full-width dot, U+3002) are
  not treated as own (IK2-I1); the 1.14.1 audit row cites Delta IK2 (Pass-Low).

## [1.14.0] - 2026-11-08

`host_url_hosts` takes env placeholders, and own-host URLs are normalised further: default port, trailing dot, userinfo and dot segments (Beacon ME ask; audit IJ-I10). Audit: Appendix IK and Delta IK, Pass.

`markdown.host_url_hosts` accepts env placeholders. Requested by Beacon on 2026-11-08, so the host names come from
`DEFAULT_URI` instead of being repeated per environment.

### Changed

- **`markdown.host_url_hosts` entries may be env placeholders**, e.g. `%env(key:host:url:DEFAULT_URI)%`. Literal entries
  are still validated and lower-cased when the container compiles (now by the extension, so the processed configuration
  keeps them as written); placeholders are skipped there (lower-casing one would break it, and `key:` processors are
  typed as arrays too, so the entries are a variable prototype) and `HostSchemes` validates and lower-cases the resolved
  value when the container builds it. A resolved value
  that is not `host` or `host:port` throws `InvalidArgumentException` naming the key and the value, so the renderer, the
  form type and the Twig functions fail to build instead of silently matching other URLs; the message names the entry
  (`entry #2`), never its value, which could be a DSN (audit IK-I1). A value that resolves to an empty string or to
  `null` (`%env(default::X)%` with `X` unset) adds no host (IK-I3). A placeholder for the whole list
  (`host_url_hosts: '%env(json:HOSTS)%'`) is refused with an `InvalidConfigurationException` asking for one placeholder
  per entry (IK-I2). Duplicates are dropped. The host pattern is shared as `HostSchemes::HOST_PATTERN` and no
  longer accepts a trailing newline.

- **URL normalisation before matching `host_url_patterns` (audit IJ-I10)**, in `HostSchemes::candidate()` and the
  editor's `urlCandidate()`: the host is compared without a trailing dot, without the scheme's default port (`:443`
  for https, `:80` for http, either for `//`) and without userinfo (`https://user@own.host/…` is read as the own host's
  path, so it goes through the resolver); a path has its repeated slashes collapsed and its dot segments (`.`, `..`,
  also `%2e`) removed after the single percent-decoding (RFC 3986 §5.2.4). New helpers
  `HostSchemes::normalizeAuthority()` and `HostSchemes::removeDotSegments()`.

### Security

- Crafted URLs that a browser normalises to an own file URL (default port, trailing dot, userinfo, dot segments,
  repeated slashes) are now host values too, so a refused file is hidden in these forms as well (audit IJ-I10). They
  only ever make more URLs go through the resolver.
- Placeholders do not weaken `host_url_hosts`: a host only widens which absolute URLs are read as host values (more URLs
  go through the resolver and can be hidden), never what a viewer sees, and an invalid resolved value throws instead of
  being matched.

## [1.13.0] - 2026-11-08

Plain URLs can be host references, and a host resolver can see the render's context. Requested by Beacon on 2026-11-08
after the WikiBundle 1.24 REST API audit (spec 218, Appendix IF): wiki pages reference files as `/files/<uuid>/original`,
so the API's reader view returned their uuid and alt text even when the token's *where* excluded the file. Nothing changes
for hosts that leave the new keys empty. Audit: Appendix IJ, Pass after the fixes (Delta IJ, 2026-11-08).

### Added

- **`markdown.host_url_patterns`**: `{pattern, scheme, url}` entries that make plain URLs host references of a
  `host_schemes` scheme, e.g. `^/files/(?<id>[0-9a-f-]{36})/(?:original|preview)$` → `app-file`. A matching image `src`,
  link `href` or file card `href` goes through the same `HostFileResolverInterface` batch as `app-file:<id>`. With
  `url: written` (default) a file the viewer may see keeps the author's URL and the output is unchanged; with
  `url: resolved` the resolver's URL (and a card's real name, type and preview) replaces it, as for scheme values. Patterns
  are checked at container build: anchored `^…$` with no top-level `|`, exactly one `(?<id>…)`, no other `(?` group, no
  `(*` verb, no POSIX `[:…:]` class, no class starting with `]`, a fixed set of escapes, printable ASCII without `#`, at most
  300 characters, the scheme declared in `host_schemes`. The editor reads the same patterns from the page's configuration block (`hostUrlPatterns`, only when set),
  never from a widget's JSON; `resolved` patterns show the scheme's templates there.
- **Normalisation before matching** (audit IJ-I3): the query and fragment are dropped, the path is percent-decoded once,
  uuids are lower-cased, and `https://<host>/…` / `//<host>/…` read as their path when the host is the current request's
  or one of the new **`markdown.host_url_hosts`** (`[beacon.example.com]`). Each distinct URL is classified once per
  document (IJ-I2).
- **`ContextualHostFileResolverInterface`** (extends `HostFileResolverInterface`):
  `resolveFilesInContext(list<string> $references, ?object $context)`. The renderer calls it with the value of the
  **`RenderContextProviderInterface`** (`renderContext(): ?object`) service, when the host aliases one, or one passed to
  `MilkdownMarkdownRenderer` / `DocumentProcessor` (`$renderContext`). Plain `HostFileResolverInterface` resolvers are called
  as before.
- **`markdown.host_refused_links`**: `text` (default, as 1.9) or `hidden`. With `hidden`, a refused `scheme:` link renders
  *Content not visible* instead of its text.

### Security

- A refused reference matched by a URL pattern (image, link, file card, also nested) renders *Content not visible*: no
  URL, no id, no alt text, no link text, no name. A matched URL whose id is not a valid id is refused without asking the
  resolver.
- A matching URL that cannot be checked is refused, never left as a plain link (audit IJ-L1): a pattern that fails to run
  (PCRE backtrack or JIT limit) and a URL over 2,048 characters that starts with a pattern's literal prefix both render
  *Content not visible*.

## [1.12.0] - 2026-11-07

### Fixed

- **A tab that returns after the log was dropped no longer undoes the newer text** (audit HV-M1), with a host that names its
  logs. On reconnect the client posted its whole document to whatever log it found, and the next session save made that text
  current, with no ask. Now an **epoch** names the log: `state` gives it, `update`, `compact`, `corrupt` and the form send it, and a
  mismatch posts nothing. A tab with nothing of the person's reloads; one with their text keeps it, says so, and its save asks.
  Also covers a hub drop without going offline, a client that never heard the reset, and a live editor on the new log. Hosts and
  clients without it behave as before ([USAGE](USAGE.md#collaboration)).
- **`POST update` and `POST compact` have a time limit** of 20 s (audit HV-L3). A hung update held every later one.
- **The seed is what the server sent.** Firefox restores a textarea on reload, so a tab reloaded onto a replaced page could
  seed its old text into the new log. A tab that never binds keeps the restored text, as before.
- A client on an old log no longer holds the seed of the new one for 30 s (`X-Nowo-Collab-Epoch`).

## [1.11.0] - 2026-11-07

### Added

- **A session save says what its text includes** (audit HO-L1, window 2). The form now sends
  `_nowo_milkdown_collab_seq` next to `_nowo_milkdown_collab`, so a host can stop counting as saved an update stored while
  that save was in flight. Optional numbers on stored updates keep it close: `s` and `p` on the hub, `{"s", "p"}` as the
  answer to `POST update`. Hosts that change nothing work as before ([USAGE](USAGE.md#collaboration)).
- Demo page `/collab/log/{doc}`, a host with a stored log, and a Playwright race against it.

### Fixed

- **A connection step that never answers no longer holds the connection for good** (audit HO-I6). The token, opening the
  hub and the state each get 20 s, then are aborted and retried. The person was already safe (standalone with a notice), but
  never rejoined until a reload.

## [1.10.0] - 2026-11-07

**Upgrade if you use `collaboration`: every version since 1.0.0 can save an empty page.** Saving right after opening an
edit form, or while the hub was down, replaced the body with nothing, and text typed before the bind was lost. Where the
host keeps revisions the body can be restored; typed text cannot. Independent audit: Appendix HF.

### Fixed

- **Data loss with collaboration on (every version since 1.0.0).** The editor was created empty and editable, and the
  Yjs document was bound only after the token, the hub and the state answered. In that window, or for good when the
  hub never opened, typed text was replaced at the bind and a save wrote the empty editor over the field: **saving
  right after opening an edit form saved an empty page**. Now:
  - Until the document is bound the editor shows the field's content read-only, with `aria-busy="true"` on the widget
    and the *Connecting…* status. The action buttons are disabled and document changes are refused. Keys pressed in it
    stay there instead of reaching the page's shortcuts or scrolling it; Tab and Escape still work.
  - A save while waiting does not leave yet: it waits with a message and goes on by itself when the wait ends, with the
    same submit button. The field is never written while there is no document.
  - The wait is bounded by `collaboration.connect_timeout_ms` (default 5000). A 429, a 5xx or a hub error is retried
    meanwhile. After it, or at once when the token or state answers 401, 403 or 404, the state is unusable or the log is
    corrupt, `data-collab` becomes `standalone`: the person edits the field's content without collaboration and is told
    so. An untouched standalone save keeps the field's exact bytes.
  - A connection that arrives late binds only if the content is untouched. The first edit ends the session: the text is
    not replaced and nothing is sent, not even presence. Until it joins, a client posts no presence and no compaction.
- **An empty state no longer reaches the field.** A `GET state` answering an error with a JSON body (a 429), a non-JSON
  page or JSON without a state was read as an empty document. It is now an error. An empty state without `seed: true`
  (another client holds the seed) waits for the content, and asks again in case the holder left (not from a hidden tab); it never binds an empty
  document over a non-empty field. A log holding only paragraphs without text counts as empty, also when a peer deleted
  the text. An order to seed only applies to a blank document (the previous
  condition looked at the text, so it replaced a document with only an image).
- `data-collab="online"` is set after the bind, not before it. A token or state error on a **reconnect** no longer stays on
  `connecting` for good: it shows `offline`, keeps the text and retries (backing off to every 30 s after a 401, 403, 404 or unusable state),
  so a save can rejoin the session. A host reset does not reload away text typed
  without collaboration, also when it is typed in the 1.5 s before the reload.

### Added

- `collaboration.connect_timeout_ms` (0–60000, default 5000), sent in the widget JSON only when set.
- `data-collab="standalone"`, and the messages `collab.standalone` and `collab.save_waiting`, sent only to fields with
  collaboration. Fields without collaboration keep the same widget JSON and the same behaviour.
- Demo page `/collab` (a hub that answers 404) and its Playwright suite, `COLLAB_REPEAT` runs per scenario.

## [1.9.0] - 2026-11-06

Host references for images and files, images with caption, width and alignment, a "+" button on empty lines, and four
views of a file (link, link with icon, card, sandboxed preview). All opt-in: hosts that change nothing get the same
output and the same widget JSON. Requested by Beacon on 2026-11-06 (*milkdown-file-views-and-previews*, ME-5, ME-6);
see [UPGRADING](UPGRADING.md#to-190) and `specs/008-host-files-image-block/spec.md`.

**Audit.** Appendix GX: **Pass (good) / Info** at `1de17cd` (first pass at `e180751`: Pass (good) / Low). GX-L1, GX-L2, GX-I1 to GX-I6, GX-I8 and GX-I9 are fixed. Open, all Info: GX-I7 (documented), GX-I10 (demo tooling), GX-D1, GX-D2, GX-D3.

### Added

- **Host references (ME-5).** `markdown.host_schemes` declares schemes a host stores instead of URLs
  (`![alt](app-file:<id>)`, `[name](app-file:<id>)`, `::file[name]{href="app-file:<id>"}`), each with `image`, `file` and
  `preview` URL templates (`{id}`). The editor and the renderer resolve them with the same rules; a reference that
  cannot be resolved stays inert (*Image not available* in the editor, *Content not visible* on read pages).
- **`HostFileResolverInterface`** (`resolveFiles(list<string>): array<string, ResolvedFile>`): one batch per document, for
  the viewer, optionally with per-viewer URLs and the image's size. Default: the templates
  (`TemplateHostFileResolver`).
- `ResolvedFile` can carry the file's real `name` and `type` for cards. Host links open through the template in the
  editor and keep their reference on paste.
- **`markdown.host_image_origins`**: other origins host images may load from while `allow_remote_images` is off.
- **`image_block`** (feature and `markdown.image_block`): `![alt](src "caption"){width=50% align=center}`. Caption, width
  (`25%`, `50%`, `75%`, `100%`, `<n>px`) and alignment; a toolbar on the selected image, *Edit image…* in the block and
  context menus as the keyboard path; a paragraph holding only an image renders as a `<figure>`.
- **`insert_button`** (feature): a "+" beside the empty line that holds the caret opens the `/` menu.
- **File views (ME-6).** `::file[name]{… view="link|icon|card|preview" height="…"}`, switched from *View* and *Preview
  height* in the block and context menus (radio items) and picked up front with `/file` variants (*File as a link…*,
  *File as a link with icon…*, *File with preview…*). The `icon` view has one icon per file type. Unknown views are
  cards, so 1.8 Markdown renders as before.
- **Previews (ME-6)**: a host page in a sandboxed `<iframe>` (`loading="lazy"`, `referrerpolicy="no-referrer"`, the file
  name as title) under a header with the card, *Open* and *Download*. `FilePreviewResolverInterface` says per file
  whether a preview exists for the viewer (default: the `preview` template); without one the card is shown.
  `markdown.file_preview_sandbox` adds `sandbox` tokens (`allow-scripts` with `allow-same-origin` is refused).

### Security

- A resolved URL (template or resolver) passes `safeUrl()`; images also the remote-image policy (a remote URL off
  `host_image_origins` renders as a link, without a request). Ids are `[A-Za-z0-9._~-]{1,200}` without a leading dot;
  `{id}` must come after the first `/` of a template's path.
- Editor previews load only near the viewport and are capped per editor by `max_references` (GX-L1).
- Auto-mounted editors take `hostSchemes` and `previewSandbox` only from the page's `script[data-nowo-milkdown-config]`
  (with the page's nonce), never from a widget's `data-*` JSON (GX-L2).
- `allow-scripts` is refused with `allow-popups-to-escape-sandbox` too (GX-I1). Paste keeps only the host schemes of that
  editor and never a browser scheme (GX-I3).
- No value of an image's attribute block reaches a `style` attribute; invalid blocks stay text. See
  [SECURITY](SECURITY.md#host-references-and-previews).

## [1.8.0] - 2026-11-06

Menus open in the top layer, the action bar's insert buttons are configurable (`action_bar_insert`), and several files can be dropped or pasted at once: images become image nodes, other files become file cards (`file_cards`).

Beacon request 2026-11-06 (*milkdown-menu-layer-and-file-drop*): menus in the top layer, optional action-bar insert
buttons, Notion / Outline style drop and paste of any allowed file. No BC break; fields with the defaults keep the
same widget JSON (only `messages` gains the new strings).

### Fixed

- **Menus under other layers or not shown (ME-1).** The context menu and its submenus, the block menu, the `/` and
  suggestion lists and the icon picker now render in the browser's **top layer** (`popover="manual"`,
  `showPopover()` / `hidePopover()`): a sticky header or drawer with a high `z-index`, a modal `<dialog>`, or an
  ancestor that creates a containing block for fixed elements (`transform`, `filter`, `contain`, `container-type`,
  `will-change`) no longer covers them or moves them off screen. They stay inside the widget in the DOM, so they keep
  the `--nowo-milkdown-*` tokens and dark mode, and they are placed in viewport coordinates through CSSOM (no inline
  `style` attribute, strict CSP unchanged). Keyboard, type-ahead, focus return and click-outside are unchanged
  (`manual` popovers: the bundle keeps its own dismissal). Browsers without the Popover API get the popup appended to
  `<body>` (or to the open modal dialog around the editor) with the computed theme tokens copied through CSSOM.
- File drops on a **read-only** editor or a field **without `upload_url`** no longer let the browser open the file or
  Crepe insert a `blob:` image: nothing is inserted and the status region says *Uploads are off in this editor*.

### Added

- **`action_bar_insert`** (profile key and form option, ME-2): the action-bar buttons shown above the editor, a list of
  `file` (*Insert file*) and `icon` (*Insert icon*); default `[file, icon]` (unchanged), `[]` hides both. `/file`,
  `/icon`, the context menu *Insert* group, Shift+F10 and drop / paste stay.
- **Drop and paste of several files at once (ME-3).** Each file gets its own placeholder at the drop point (the drop
  cursor shows where they land) with its progress; files upload one after the other and land **in order**. A failed
  file leaves a **dismissible inline notice** in its place (a decoration, never saved; the error is also announced).
  A clipboard with files and no HTML (screenshots, files copied in a file manager) behaves like a drop at the caret;
  HTML with files (Word, Excel, a copied web image) keeps the normal paste.
- **File cards** (`file_cards` feature, opt-in): uploads that are not images become a file card —
  `::file[name]{href="…" size="…" type="…"}` in the Markdown, a card with a type badge, the name and the size in the
  editor, and the same card from the PHP renderer (`.nowo-md-file`; a host `DirectiveRendererInterface` that supports
  `file` still wins). Without the feature they stay links `[name](url)` as before.
- **`/file`** (*Image or file…*) in the `/` menu when the field has uploads: the keyboard path of drag and drop
  (WCAG 2.5.7).
- **Upload answer `{url, name?, size?, type?, kind?: image|file, alt?}`.** The **host decides the kind** (from the bytes
  it sniffed): `kind`, else the legacy `image` flag, and only an answer with neither falls back to the browser's guess.
  The 1.0 answers `{url}` and `{url, name, image, alt}` keep working. HTTP 415 is announced as a type error.
- **`upload_accept_images` / `upload_accept_files`** (profile keys and form options): accepted types per kind. Empty
  by default: `upload_accept` keeps its meaning. With either list set, the editor accepts their union (images default
  to `upload_accept`; `upload_accept_files` alone accepts only those files, never "any type") and the widget JSON
  `upload` gains `acceptImages` / `acceptFiles`.
- Demo: `/layers` (editors in a transformed box, under a sticky header with `z-index: 100` and in a modal dialog, with
  `action_bar_insert: []`), file cards and per-kind types in the wiki profile, and an upload endpoint that answers
  the 1.8 contract with the kind from the sniffed type (fileinfo; the old endpoint needed symfony/mime, which the demo
  does not install). The demo endpoint is marked DEMO ONLY; it stores files outside `public/` and serves them with
  `nosniff`, `Content-Security-Policy: sandbox` and `Content-Disposition: attachment` for documents (audit GR-L1). Playwright: `layers.spec.ts` (menu and submenu on top, at the pointer, keyboard, focus, axe, CSP)
  and `files.spec.ts` (PNG + PDF + CSV dropped in order, save, reload, read side; refused type; `/file`).

### Security

- File cards: the name loses control and invisible format characters (Unicode Cc / Cf: bidi overrides and isolates,
  ALM, zero-width characters, word joiner, BOM — no right-to-left override hiding an `.exe` extension) and square
  brackets, and is cut at 200 characters, in the editor and in PHP; the link goes through
  the link rules (`safeUrl()` / `DialectRenderer::safeUrl()`: relative or http(s) only, **even with
  `allow_unsafe_links`**), quotes and brackets in the URL are percent-encoded before they reach the Markdown, and a card
  without a usable URL renders without a link. Card links carry `rel="noopener noreferrer"`. The badge and category
  come from the link target (its extension, else the MIME type), not from the label, so a PDF name on an `.exe` link
  shows `EXE`.
- Upload answers: `size` must be a non-negative integer and `type` a MIME type, otherwise the file's own values are
  used; names are cleaned as above; the kind is the host's. Hosts must validate type and size on the server (see
  SECURITY.md).

## [1.7.0] - 2026-11-04

Icons: menus and toolbar, Tabler catalog and picker, callout icons.

### Added

- **Icons in the UI** (`menu_icons`, `toolbar_icons`, both on by default): a decorative Tabler glyph before the label of
  every context menu item (clipboard, link, table, block actions, *Insert* and *Turn into* submenus), every block menu
  item, every `/` slash menu option and the action bar buttons (*Insert file*, *Insert icon*). Glyphs are bundled inline
  SVG built with DOM APIs (`svg.nowo-milkdown-glyph[aria-hidden="true"]`): no fetch, no inline style, the label stays
  the accessible name; they follow the `--nowo-milkdown-*` tokens and dark mode (optional tokens
  `--nowo-milkdown-icon-size`, `--nowo-milkdown-icon-color`). Host menu items may set `icon` to a glyph name.
- **Tabler outline catalog** (`icon_catalog` profile / field option and `markdown.icon_catalog`, off by default): the
  5,203 icons of Tabler Icons 3.50.0 (MIT) become insertable as `:tabler-NAME:` and render from sprite shards
  published with the bundle (`icons/tabler-<first character>.svg`, a page only fetches the shards it uses). Allowlisted
  icons keep the host sprite. The searchable names and keywords load as a lazy chunk.
- **Icon picker** (lazy chunk): a non-modal dialog with a search field (`role="combobox"`) and a listbox of icons
  (WAI-ARIA combobox + listbox; Up / Down, Page Up / Down, Enter, Escape). It opens from *Insert → Icon…*, `/icon`,
  the action bar's *Insert icon* and *Browse all icons…*, the last option of the `:` suggestions; the icon is always
  inserted **inline at the caret**. Available with `icons` or `icon_catalog`; otherwise these entries still type `:`.
- **Callout icons**: `:::callout{icon="bulb" type="info"}` (a Tabler name) or `:::callout{icon="💡" type="info"}` (an
  emoji). The callout header has an icon button opening the picker with *Icons* / *Emoji* tabs and *No icon*. The PHP
  renderer adds the icon (decorative, `aria-hidden`; an emoji is drawn by CSS from `data-emoji`, so the HTML text is only
  the body) and wraps the content in `.nowo-md-callout__body`. Callouts without `icon` are unchanged.
- `TablerCatalog` service and an optional `$catalog` argument of `AllowlistIconResolver`.

### Changed

- The *Icon or emoji* item of the *Insert* group and the `/` menu is now **Icon…** (`slash.icon`) and opens the picker
  when the field has icons; emoji stay available through `:`.

### Fixed

- *Insert → Icon* (context menu) no longer adds a new paragraph before the `:` trigger: inline entries are inserted at
  the caret.
- Callout emoji rule (audit DY-M1 / DY-L1 / DY-I1, before release): a linear check of at most 64 bytes and 8 code
  points, the same table in TS and PHP (Unicode 18 Extended_Pictographic, flags, keycaps, skin tones, VS16, ZWJ).
  The first version's pattern backtracked exponentially on values such as 40 × U+FE0F + `a`. It also accepted
  combining marks, U+2800 and plain symbols and rejected ℹ️, which the picker offers.
- The callout icon button checks catalog names like inline icons do: an unknown one shows its name (DY-I4). The picker
  search is capped at 64 characters (DY-I2).
- A key pressed right after the browser moved the caret (End, Home, arrows, a click) acted on the old caret: Shift+F10 /
  the ContextMenu key opened the context menu (and inserted) there, Ctrl / ⌘ + / the block menu, Enter split the old
  block. The editor now reads the pending DOM selection (ProseMirror's own flush) before its key handlers and before
  opening a menu from the keyboard.

## [1.6.0] - 2026-11-04

Comments, version view and diff, heading ids

Comments, version view, rendered diff and heading ids (all opt-in).

### Added

- **Inline comments** (`comments`, opt-in; host contract v1.2 with WikiBundle 1.16):
  - comment on a selection from the toolbar, the context menu or **Ctrl / ⌘ + Alt + M**
    (`nowo-milkdown:comment-create`, cancelable, with a v1 anchor: text quote, offsets, block hint and Yjs relative
    positions while co-editing);
  - highlights as decorations (never in the Markdown), resolved threads hidden until shown, orphan detection
    (`comment-orphaned`), anchor refresh (`comment-anchors-changed`), next / previous comment
    (**Ctrl / ⌘ + Alt + PageDown / PageUp**, announced), **Enter** opens, **Escape** leaves;
  - `handle.comments` API (`set`, `upsert`, `remove`, `status`, `selectionAnchor`, `start`, `focus`, `next`,
    `previous`, `showResolved`, `snapshot`, `refresh`, `open`);
  - drawer integration (`panel: container` + `container` or `comments.mount()`, `comments-open-requested`,
    `comments.reveal()` with a flash, `comments.count()` / `comments-count` for a tab badge; no chrome, layout or
    Escape handling of its own);
  - an optional, accessible thread component (`comments.url`, `panel: margin | sidebar | container`): replies, reactions,
    resolve / reopen, edit / delete own, *Show resolved*, page-level comments, live updates by thread id over Mercure;
  - comment avatars (`author.avatarUrl`, `resolvedBy.avatarUrl`; avatar contract v1.1): only `https://` without
    userinfo or a same-origin `/` path (no `http:`, `data:`, `blob:`, `//`, backslashes, controls, over 2048 bytes),
    a lazy `<img alt="" referrerpolicy="same-origin">` over the initial in `.nowo-milkdown-avatar`, falling back to
    the initial on error (failed URLs are not requested again on that page);
  - `Nowo\MilkdownEditorBundle\Comment\CommentAnchor` to validate anchors on the host (shared test vectors with the
    editor).
- **`version_view`** (opt-in): a read-only view of an old version with a banner; *Restore* / *Copy to a new page*
  emit events, `version.restore: false` / `version.copy: false` remove them.
- **`nowo_milkdown_view(markdown, options)`**: the editor widget, read-only, outside a form (comment-only readers,
  versions).
- **Rendered diff:** `nowo_milkdown_diff(old, new)` and the public `MarkdownDiffRendererInterface` service
  (`MarkdownDiff {html, changes, fallback}`): block LCS, word-level changes, stable documented markup, visually
  hidden *Inserted / Deleted* labels, an escaped line-diff fallback for large or very different versions.
- **Heading ids** (`heading_ids` feature, `markdown.heading_ids` renderer option): `nowo-h-<slug>`, the same slugs in
  the editor and in PHP.

### Changed

- Editor heading ids are always prefixed `nowo-h-` (Milkdown used the bare heading text), so a heading can no longer
  take over a host element id such as a comments drawer (1.6.0 audit DW-M2).

### Security

- 1.6.0 audit (Appendix DW), fixed before release: the rendered diff has a work budget for the whole render (DW-M1);
  `comments.container` and `comments.mount()` never use an element inside an editor, read view or contenteditable
  region (DW-M2); the quote search finds blocks by binary search (DW-L1); the PHP `CommentAnchor` rejects a Yjs
  position with a trailing line feed, as the editor does (DW-L2); `open(id)` and `refresh(ids)` accept host ids only,
  many live ids in one window refetch the list once, and the `handle.comments` API is a no-op after `destroy()`
  (DW-I3–I5). Avatar URLs also reject quotes, `<`, `>`, backticks, IPv6 literals and invalid ports (UiKit audit DZ).

## [1.5.1] - 2026-11-04

Collaboration request rate (patch).

### Fixed

- **Co-editing no longer floods the host (Beacon audit, High).** The collaboration client posted one request per Yjs
  update and one per presence change: about 30 requests/s for a 15 keys/s typist, so a `600/min` limiter answered 429
  and the editor went offline. Now:
  - local updates are merged with `Y.mergeUpdates` and posted once per **200 ms** window, one request in flight (order
    kept), and flushed at once on editor blur, form submit, hidden / closed tab (`keepalive`) and destroy;
  - presence is posted at most once per **750 ms** (trailing edge); leaving is still announced at once;
  - a **429** keeps the merged edits and retries without going offline, after the exponential backoff (1 s doubling up
    to 30 s) or a longer `Retry-After` (seconds or a date, clamped to 1–60 s: `0` or a past date cannot loop, audit
    DS-L1); presence backs off the same way; other failures behave as before (offline, the reconnect diff carries the
    edits);
  - a hidden tab flushes through the normal path (throttle, one request in flight, re-queued on failure); only
    `pagehide` / unload / destroy use `keepalive`, and that batch stays queued and dirty until a 2xx confirms it, so a
    refused keepalive never drops edits from the shared log (audit DS-L2);
  - a batch never exceeds `max_update_bytes` (default 256 KiB, the host's limit): a larger backlog goes out in several
    POSTs instead of one refused request (audit DS-I1).
  - Measured with a deterministic test (15 keys/s for 10 s, caret moving with each key): **300 → 63 requests**
    (50 updates + 13 presence), i.e. 30 → 6.3 requests/s.

- **Insert submenu at the right edge** (Beacon): a submenu with no room on the right now opens to the left of its
  menu instead of being pushed over the menu's shortcut column (keyboard behaviour unchanged).
- **"Copied as Markdown" never cleared** (Beacon): editor confirmations are now transient (cleared after 4 s and on the
  next key or pointer action in the editor); the read-view copy status clears after 4 s and on the next click.

### Added

- **`nowo_milkdown_copy_markdown(markdown, {icon})`** (Beacon): `icon: true` adds a static copy icon before the label,
  `icon: 'only'` renders an icon-only button whose label stays in a visually hidden span and the `title` (no inline
  styles). The markup is now **public API** (see USAGE: *Markdown clipboard*), checked by the demo e2e.
- `collaboration.update_delay_ms` (0–2000, default 200), `collaboration.awareness_delay_ms` (0–5000, default 750) and
  `collaboration.max_update_bytes` (1024–64 MiB, default 256 KiB) form options; sent in the widget JSON only when set.

## [1.5.0] - 2026-11-03

Markdown clipboard and the Insert group (opt-in), "Copy as Markdown" for read pages.

### Added

- **Markdown clipboard** (`markdown_clipboard`, opt-in):
  - **Smart paste:** text copied from a code editor, a terminal or a plain text field (HTML that only wraps text) is
    parsed as Markdown when it looks like Markdown (headings, lists, emphasis, links, fences, tables, quotes). Rich HTML
    keeps the sanitising HTML path, and nothing is parsed inside a code block.
    Pasted links and images never keep an unsafe target (`javascript:`, `data:`…): with the feature, every paste
    path (smart, plain text, Paste as Markdown, ProseMirror's own) empties them the same way, so the stored Markdown
    is identical whichever path pasted it (audit DN-L1).
  - **Paste as Markdown** (**Ctrl / ⌘ + Alt + V**) and **Copy as Markdown** (**Ctrl / ⌘ + Alt + Shift + C**, as
    Ctrl / ⌘ + Alt + C is Milkdown's code block). Both are also in the context menu, with their shortcuts. The copy
    is announced in the live region. Readers get *Copy as Markdown* only.
- **Insert group** (`insert_menu`, needs `context_menu`): an *Insert* submenu in the context menu with *Image or file…*
  (with uploads), *Icon or emoji* (with icons) and the `/` blocks of the field (headings, lists, table, code, callout,
  divider, math, Mermaid). New blocks go after the current block, so hosts no longer fake clicks on toolbar buttons.
- **`nowo_milkdown_copy_markdown(markdown, {label?, class?})`**: a "Copy as Markdown" button for read pages. It copies
  the Markdown the page passes (escaped in a `<template>`) and says the result in a status region. The editor module
  binds it (`nowo_milkdown_editor_assets()`).
- Six UI strings in the 7 locales (`menu.paste_markdown`, `menu.copy_markdown`, `menu.insert`, `menu.insert_file`,
  `clipboard.copied_markdown`, `clipboard.copy_failed`), sent in the widget JSON only with their feature.

## [1.4.0] - 2026-11-03

Block menu with text and background colour (opt-in), visible Crepe icons.

### Added

- **Block actions** (`block_actions`, opt-in): a named "⋮⋮" button beside the block under the pointer or the caret
  opens the block menu (*Turn into*, *Color*, *Duplicate*, *Move up* / *Down*, *Delete*); **Ctrl / ⌘ + /** opens it at
  the caret and **Alt+Shift+↑ / ↓** move the block, announced in the live region. The button stays out of the tab
  order. `block_drag` (needs `block_actions`) adds pointer drag of the button.
- **Colours** (`colors`, opt-in): Notion's nine text and background colours on a selection (`:mark[…]{text=… bg=…}`)
  or a block (`::: {text=… bg=…}`, the container that also carries `align=`), from the block menu, the context menu
  and a toolbar button. `:mark{color=…}` keeps meaning the background. The PHP renderer emits classes only, for names
  in `markdown.mark_colors` (default extended with brown, orange and pink); tokens `--nowo-milkdown-color-*` and
  `--nowo-milkdown-mark-*` meet WCAG AA in both themes; a text colour on a background uses the background's paired
  text colour, so all 81 combinations stay AA (tested). The menus offer the colours of `markdown.mark_colors`
  (widget JSON `colors`, only with the feature). A drag of the handle is cancelled when the document changes
  meanwhile.

### Fixed

- **Crepe icons visible** (Beacon): `--crepe-color-outline`, the tone of Crepe's toolbar, table and link icons, maps
  to `--nowo-milkdown-muted` (≥ 3:1 on the page and the toolbar in both themes) instead of the border colour.
- **Text-only marks on the read side** (audit DB-L1): `:mark[…]{text=…}` has no background in the PHP render either
  (it showed the default yellow, failing AA for some text colours); text coloured inside a block with a background
  colour uses the paired text colour too (DB-I3).
- **Colour changes per mark** (DB-I8): changing one colour of a selection across several marks keeps each mark's
  other colour. **Dragging the handle** resolves the block again when the drag starts (DB-I5).

## [1.3.1] - 2026-11-03

footnote ids keyed with kernel.secret, accessible task-list checkboxes, underlined footnote links

### Fixed

- **Accessible read side** (axe): GFM task-list checkboxes in the PHP render get a name (`aria-label`, the editor's
  `task.toggle` string, *Done*; their checked state tells whether the task is done), and footnote links keep their
  underline (1.2.1 removed it, so they could only be told apart from text by colour).

### Security

- **Footnote id salt keyed with `kernel.secret`** (audit CZ-I10 / CZ-I11): 12 hex characters of an HMAC, under a
  purpose-bound subkey of `kernel.secret`, of the render count and the Markdown. 1.2.1 used 6 characters of a plain
  SHA-256 of the Markdown (24 bits, a digest of the source) and appended the counter with `-`, which could be read as
  part of the label. Ids stay stable per document; their salt part changes once with this release.

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
