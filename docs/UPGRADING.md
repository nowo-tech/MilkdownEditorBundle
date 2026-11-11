# Upgrading

## Table of contents

- [General procedure](#general-procedure)
- [Unreleased](#unreleased)
- [To 1.16.0](#to-1160)
- [To 1.15.1](#to-1151)
- [To 1.15.0](#to-1150)
- [To 1.14.1](#to-1141)
- [To 1.14.0](#to-1140)
- [To 1.13.0](#to-1130)
- [To 1.12.0](#to-1120)
- [To 1.11.0](#to-1110)
- [To 1.10.0](#to-1100)
- [To 1.9.0](#to-190)
- [To 1.8.0](#to-180)
- [To 1.7.0](#to-170)
- [To 1.6.0](#to-160)
- [To 1.5.1](#to-151)
- [1.5.0](#150)
- [1.4.0](#140)
- [1.3.1](#131)
- [1.3.0](#130)
- [1.2.1](#121)
- [1.1.0](#110)
- [1.0.0](#100)
  - [Coming from TiptapEditorBundle](#coming-from-tiptapeditorbundle)

## General procedure

1. Read the [CHANGELOG](CHANGELOG.md) entries between your version and the target.
2. `composer update nowo-tech/milkdown-editor-bundle` then `php bin/console assets:install` (the editor module and its
   chunks change with every release).
3. If you override `Form/milkdown_editor_theme.html.twig`, compare your copy with the bundle's (freeze rule in
   [USAGE.md](USAGE.md#overriding-templates)).
4. Clear the cache.

Public API covered by Semantic Versioning: the configuration tree, profile keys, form options, Twig filter / function
names, the form theme block, the `--nowo-milkdown-*` tokens, the Markdown dialect, the resolver and directive
interfaces and `window.NowoMilkdownEditor`.

## Unreleased

To **1.16.1** (patch): `composer update nowo-tech/milkdown-editor-bundle`; no configuration change. The bundle
registers `Nowo\MilkdownEditorBundle\EventListener\WorkerBoundaryResetListener`, which resets the Markdown renderer's
footnote counters at every request, Messenger message and console command boundary.

## To 1.16.0

From **1.15.1**:

```bash
composer update nowo-tech/milkdown-editor-bundle
```

Target 1.16.0, from **1.15.1**:

```bash
composer update nowo-tech/milkdown-editor-bundle
php bin/console assets:install
```

Nothing to do: both new options are off by default and the output is the same as 1.15. To show previews of cards whose
`href` matches a `url: written` pattern (spec 212 block B), declare the scheme's `preview` template, turn the option on
and list what your preview endpoint can draw:

```yaml
nowo_milkdown_editor:
    markdown:
        host_schemes:
            app-file: { image: '/files/{id}/preview', file: '/files/{id}/original', preview: '/files/{id}/embed' }
        host_url_patterns:
            - { pattern: '^/files/(?<id>[0-9a-f-]{36})/(?:original|preview)$', scheme: app-file, url: written }
        file_preview_written_urls: true
        file_preview_types: [text/csv, .csv, text/plain, .txt, text/markdown, .md, application/json, .json]
```

The editor then frames `/files/<uuid>/embed` (never the written URL); your endpoint keeps checking the viewer and
answering 404 for what it cannot preview, and the page's CSP needs `frame-src` for that origin (`'self'` when it is
same-origin). A host `FilePreviewResolverInterface` is not affected by `file_preview_written_urls` (it already receives
those cards on the read side) and decides the types itself; keep `file_preview_types` in step with it so the editor and
the read view agree.

## To 1.15.1

From **1.15.0**:

```bash
composer update nowo-tech/milkdown-editor-bundle
```

No configuration or API change. The shipped assets were rebuilt with the updated front-end dependencies; clear the asset cache (`assets:install`) after updating.

## To 1.15.0

From **1.14.1**:

```bash
composer update nowo-tech/milkdown-editor-bundle
```

Next minor: 1.15.0. Nothing to do. Fields with `top_bar` keep one row on phones (below 768 px) and group the rest
behind "⋮"; desktop is unchanged. Hosts that translate the `NowoMilkdownEditorBundle` domain add the `topbar.*` keys
(see `src/Resources/translations/NowoMilkdownEditorBundle.en.yaml`). A host stylesheet that restyled
`.milkdown-top-bar .top-bar-inner` should check the bar at phone width (`.nowo-milkdown-top-bar--grouped`,
`.nowo-milkdown-top-bar__more`).

## To 1.14.1

From **1.14.0**:

```bash
composer update nowo-tech/milkdown-editor-bundle
```

Nothing to change. Encoded hosts, zero-padded ports, a trailing slash and tabs or newlines inside a URL are now read
like the plain form by `host_url_patterns` / `host_url_hosts` (audit IK-I7, IK-I8, IK2-L1), so more refused host files are
hidden. Rebuilt assets ship in the package.

## To 1.14.0

From **1.13.0**: nothing to change. `markdown.host_url_hosts` may now take env placeholders, so the application's host
can follow `DEFAULT_URI`:

```yaml
nowo_milkdown_editor:
    markdown:
        host_url_hosts: ['%env(key:host:url:DEFAULT_URI)%']   # literal entries still work and can be mixed in
```

The resolved value must be `host` or `host:port` (`key:host:url:` drops the port; write a literal `host:port` entry if
links use one). An invalid value makes building the renderer throw an `InvalidArgumentException` that names the entry
(not its value); an empty or `null` one adds no host. Use one placeholder per entry: a placeholder for the whole list
(`'%env(json:HOSTS)%'`) is refused when the container compiles.

URL matching is stricter in your favour (audit IJ-I10): `https://host:443/files/…`, `https://host./files/…`,
`https://user@host/files/…`, `/./files/…`, `/x/../files/…` and `/files//…` now match your `host_url_patterns` like
the plain form, so the resolver decides about them too. If a host renderer of yours matched such forms itself only to
hide them, Milkdown now covers them for the hosts in `host_url_hosts` and the request's host; list every host your links
use.

## To 1.13.0

From **1.12.0**: `composer update nowo-tech/milkdown-editor-bundle`, then run `assets:install`. Nothing changes until you set
the new keys:

- **Plain URLs as host references.** If your content links files by URL (`![plan](/files/<uuid>/preview)`), declare them so
  your `HostFileResolverInterface` decides who sees them:

  ```yaml
  nowo_milkdown_editor:
      markdown:
          host_schemes:
              app-file: { file: /files/{id}/original, image: /files/{id}/preview }
          host_url_patterns:
              - { pattern: '^/files/(?<id>[0-9a-f-]{36})/(?:original|preview|thumb|s128|s64)$', scheme: app-file }   # url: written
          host_url_hosts: [app.example.com]   # absolute https://app.example.com/files/… URLs too
          host_refused_links: hidden
  ```

  Cover every variant your file route serves; a URL no pattern matches stays an ordinary link.

  With the default resolver (the templates) every match resolves, so the output does not change; give the scheme at least a
  `file` or `image` template, or every match is refused. With your own resolver, a file it leaves out renders
  *Content not visible* without its URL, alt text or name. Use `url: resolved` only if the resolver's URLs should replace
  the written ones.
- **Context.** To narrow by what is being rendered (a wiki space, an API token's reach), implement
  `ContextualHostFileResolverInterface::resolveFilesInContext($references, ?object $context)` and alias
  `RenderContextProviderInterface` to a service that returns the render's context (WikiBundle passes its own to its
  renderer). Keep `resolveFiles()` for calls without a context.
- **Refused scheme links.** `host_refused_links: hidden` drops their text too.
- Constructors gained optional trailing arguments: `HostSchemes($schemes, $imageOrigins, $urlPatterns)`,
  `DocumentProcessor(…, $renderContext, $hideRefusedLinks)`, `MilkdownMarkdownRenderer(…, $renderContext)`.

## To 1.12.0

From **1.11.0**: `composer update nowo-tech/milkdown-editor-bundle`, then run `assets:install`. Fields without `collaboration` do
not change. With it, and a host that answers `epoch` in `state` (WikiBundle needs the matching release):

- **A tab on a replaced log does not post, and a tab with the person's text does not reload.** It stays on the page, with
  `data-collab="standalone"`, the alert `collab.replaced` and a **Reload** button. Before, it reloaded after 1.5 s and the text was gone.
- **A save has one more POST key**, `_nowo_milkdown_collab_epoch`, also while offline. A form with an empty name and no
  `allow_extra_fields` would refuse it, as it refuses the others.
- **The seed is what the server rendered** (`defaultValue`), when that is not empty: a script that sets the textarea before
  the editor mounts, on a field with collaboration, should render the value instead. A tab that never binds keeps what the
  browser restored, as before.
- **To name your logs** see [USAGE](USAGE.md#collaboration). A host that does not gets today's behaviour, including HV-M1.

## To 1.11.0

From **1.10.0**: `composer update nowo-tech/milkdown-editor-bundle`, then run `assets:install`. Fields without `collaboration`
do not change. With it:

- **A session save has one more POST key**, `_nowo_milkdown_collab_seq`, at the top level like `_nowo_milkdown_collab`. A form
  with a name ignores it. A form with an **empty name** and no `allow_extra_fields` would refuse it, as it already refuses the
  session field.
- **To use it** see [USAGE](USAGE.md#collaboration). Nothing changes for a host that does not read it.
- **Connection steps give up after 20 s** and are retried. An endpoint that needs longer than that to answer never connects.

## To 1.10.0

**Upgrade if you use `collaboration`:** versions 1.0.0 to 1.9.0 can save an empty document (see the
[CHANGELOG](CHANGELOG.md)). `composer update nowo-tech/milkdown-editor-bundle`, then run `assets:install`. Fields without
`collaboration` do not change, and neither does their widget JSON.

Until you upgrade, the only complete mitigation is to turn collaboration off: drop the `collaboration` option (WikiBundle:
`nowo_wiki.collaboration.enabled: false`). A server check that refuses an empty body on a save without the
`_nowo_milkdown_collab` field stops the empty saves (6 of 6, measured) but not the loss of typed text, and it also refuses
a person clearing a page on purpose.

**Finding and repairing empty saves.** The bundle keeps no history; it depends on the host. Measured on WikiBundle (5 of 5,
v1.9.0): the empty save adds a revision with an empty body, the earlier revision stays intact, restoring it brings the body
back, and the editor then shows it. Look for revisions with an empty body whose previous revision was not empty, and restore
that one before any history pruning removes it. Text typed before the bind is **not** recoverable: it never reached the
server (0 revisions held it, 10 of 10). A host that overwrites without revisions cannot recover the body.

Behaviour changes with collaboration on:

- **The editor is read-only until the document is bound**, at most `connect_timeout_ms` (default 5 s). Keys pressed before
  that never appear. Tests that type into the editor should wait for
  `.ProseMirror[contenteditable="true"]`, or for `data-collab` to leave `connecting`.
- **`data-collab` has one new value, `standalone`.** The existing ones keep their meaning, except that `online` now means
  bound too. `aria-busy="true"` is on the widget while it waits. The standalone warning is its own element,
  `.nowo-milkdown__notice` (`role="alert"`).
- **A submit while waiting is held**: the `submit` event is cancelled in the capture phase on the form, and
  `requestSubmit()` runs when the wait ends. Listeners in the bubble phase, on the form or above, see only the second event.
  Capture listeners on `document` or `window` see both, and `defaultPrevented` is false on both, so one that sends the form
  itself sends twice: use the bubble phase. A submit button that is disabled or removed during the wait still sends its name
  and value, through a hidden field; its `formaction` is lost.
- **Keys pressed in the editor while it waits stay there**, so host shortcuts do not fire and the page does not scroll.
  Tab and Escape pass, and browser shortcuts keep working. A `keydown` capture listener on `document` still sees them.
- **A standalone save carries no `_nowo_milkdown_collab`**, like an offline save: a host with a shared log treats it as a
  replacement (WikiBundle drops the log and live editors reload). The person is told before they save.
- **`createEditor()` and `nowo-milkdown:ready` always finish**, at the bind or at the deadline. They used to wait forever
  when the hub never opened, and to reject when it failed. Read `data-collab` to know which one happened.
- **A host answering `seed: false` to everybody** with an empty state and a non-empty field no longer gets an empty
  document: the editor goes standalone at the deadline. One client must be told to seed (see
  [USAGE](USAGE.md#collaboration)).
- **`token` and `state` answers:** 401, 403 and 404 fall back at once. A 429 (its `Retry-After` is honoured), a 5xx or any
  other error is retried, during the wait and after it while the content is untouched. A 2xx `state` must have a `state`
  string or an `updates` list; anything else falls back at once. A client not in the session stops on a 401, 403, 404 or unusable `state`. A bound editor shows `offline`, keeps its text and
  retries, backing off to every 30 s, so its save can rejoin the session; 429 and 5xx keep being retried.
- **A client waiting on another's seed asks again every 31 s** (`POST token`, the hub connection, `GET state`), not while the
  tab is hidden, so a host's stale seed claim gets taken over. An editor that has been edited while standalone asks nothing
  and claims nothing.

## To 1.9.0

From **1.8.0**: `composer update nowo-tech/milkdown-editor-bundle`, then run `assets:install`. With the defaults (no `host_schemes`, no new feature) the widget JSON does not change
and images in the editor are still Milkdown's `<img>`. The renderer's output changes in one case:

- **`::file{… view="…"}`**: 1.8 ignored `view`. In 1.9 `view="link"` and `view="icon"` draw those views and
  `view="preview"` adds `data-view` to the card, with no opt-in. Other values are cards, as before.

- **Adopting host references.** Set `markdown.host_schemes` and, to check the viewer in PHP, alias
  `HostFileResolverInterface` / `FilePreviewResolverInterface` to your services. Existing Markdown with those references
  starts to resolve. Your file endpoints must check the viewer themselves when you keep the default template resolvers.
- **A scheme you configure stops being a URL**: an invalid value of that scheme renders *Content not visible* and no link.
- **Remote host images**: an absolute `image` template or resolver URL renders as a link while `allow_remote_images` is
  off, until its origin is in `markdown.host_image_origins`.
- **Editors mounted from your own JavaScript** pass `hostSchemes`, `previewSandbox` and `maxPreviews` to `createEditor()`.
  Auto-mounted ones read the data block `nowo_milkdown_editor_assets()` prints, so a theme override must keep that call.
- **Previews need the host's CSP**: `frame-src` must allow the preview URLs, and the endpoint must send the headers in
  [USAGE](USAGE.md#previews).
- **`image_block`** has two switches: the profile feature (editor) and `markdown.image_block` (renderer). With only the
  feature, `{width=…}` shows as text on read pages.
- `DocumentProcessor`, `MilkdownMarkdownRenderer`, `DialectRenderer` and `MilkdownEditorType` gain optional constructor
  arguments at the end; `FileCard::render()` gains an optional second argument.

## To 1.8.0

From **1.7.0**:

```bash
composer update nowo-tech/milkdown-editor-bundle
```

- No BC break; run `assets:install` (the editor module and its chunks change). Fields with the defaults keep the same
  widget JSON except `messages` (new strings: `upload.off`, `upload.waiting`, `upload.dismiss`, `slash.file`).
- **Menus render in the top layer** (`popover="manual"`). They are still children of the widget, so host CSS that
  targets `.nowo-milkdown .nowo-milkdown-menu` keeps working; a host rule that set `z-index` on `.nowo-milkdown-menu`,
  `.nowo-milkdown-suggest` or `.nowo-milkdown-picker` to lift them above a header or dialog is no longer needed (the
  top layer ignores `z-index`). The suggestion list is now `position: fixed` in viewport coordinates (it was
  `absolute` inside the widget). Tests that read the popup's `hidden` attribute still can; `:popover-open` is the
  browser's own state.
- **Action bar:** to drop *Insert file* and *Insert icon* (Beacon's choice), set `action_bar_insert: []` on the profile
  or the field. Default unchanged.
- **Drop / paste:** several files at once now upload one after the other, each with its own placeholder, instead of one
  request batch inserted at the end; files dropped on a read-only editor or a field without `upload_url` are no longer
  inserted (nothing was uploaded for them anyway; images could appear as `blob:` URLs).
- **Upload endpoint:** answer `{url, name, size, type, kind: 'image'|'file'}` and decide `kind` on the server from the
  bytes (e.g. `finfo`), never from the client's `Content-Type`. Old answers keep working (`{url}` uses the browser's
  guess as before). Answer HTTP 415 for refused types (shown as *not an allowed file type*).
- **File cards** are opt-in: add `file_cards` to `features` and allow document types (e.g.
  `upload_accept_files: [application/pdf, text/csv, .csv, .docx, .xlsx, application/zip]`; keep images in
  `upload_accept` or `upload_accept_images`). Serve stored documents with `Content-Disposition: attachment` and
  `X-Content-Type-Options: nosniff`. The PHP renderer renders `::file` for every host (it was an empty
  `div.nowo-md-directive--leaf` before) unless a host `DirectiveRendererInterface` supports `file`.
- Search indexes that read the Markdown should treat `::file[…]{…}` lines like other directives (the label is the file
  name).

## To 1.7.0

- No BC break. Run `assets:install` (new `icons/` directory with the Tabler sprite shards and their licence).
- **Menus and the action bar show icons by default.** They are decorative (`aria-hidden`), so accessible names, item
  `textContent`, keys and the widget JSON options of default fields are unchanged (only `messages` gains the new
  strings); turn them off with `menu_icons: false` /
  `toolbar_icons: false` (profile or field) if your CSS styles these menus tightly.
- *Icon or emoji* is now **Icon…** (`slash.icon`, Spanish *Icono…*) and opens the icon picker when the field has
  `icons` or `icon_catalog`. Tests that select the item by name must use the new label; override the translation to
  keep the old one.
- The catalog's search data is a **lazy, opt-in** chunk of about **79 kB gzip** (5,203 names, Tabler tags and
  categories in a compact dictionary form), loaded only with `icon_catalog` on the first picker or `:` use; it never
  adds to the up-front JavaScript (+6.4 kB gzip over 1.6.0 for the glyphs, menus and the emoji rule).
- `icon_catalog` (editor) and `markdown.icon_catalog` (renderer) are **opt-in**: with them, any `:tabler-NAME:` of the
  Tabler outline set renders as an icon (it was text unless allowlisted). Enable both together.
- Callouts may carry `icon="…"`; renderers of other tools show the attribute as text, as for every directive attribute.
  Plain-text extraction that reads the Markdown (search indexes) should drop directive lines and attributes; extraction
  from the rendered HTML (`strip_tags`) only sees the body.
## To 1.6.0

From **1.5.1**:

```bash
composer update nowo-tech/milkdown-editor-bundle
```

- **New opt-in features:** `comments`, `version_view` (never together with `comments`) and `heading_ids`; new form
  options `comments` and `version`; new renderer option `markdown.heading_ids` (default `false`). Fields and pages
  without them keep the same widget JSON, DOM and HTML, except editor heading ids (below).
- **New Twig functions** `nowo_milkdown_view()` (needs symfony/form enabled) and `nowo_milkdown_diff()`, and the
  public services `MarkdownDiffRendererInterface` and `CommentAnchor` (a value class).
- With `comments`, **Ctrl / ⌘ + Alt + M** and **Ctrl / ⌘ + Alt + PageDown / PageUp** are taken in the editor.
- If you override translations, add the new `comments.*`, `version.*` and `diff.*` keys.
- Hosts storing comments: validate anchors with `CommentAnchor::fromJson()` and read the security notes in
  [SECURITY.md](SECURITY.md).
- **Comments in a host drawer:** use `comments.panel: 'container'` with `comments.container` (a CSS selector, 1–200
  characters) or call `handle.comments.mount(element)`. Open the drawer on `nowo-milkdown:comments-open-requested`
  (`{id}`, `id: null` for a new comment), use `handle.comments.reveal(id)` to scroll to and flash a thread's text
  without moving focus (`focus(id)` moves focus into the editor), and feed the tab badge from
  `nowo-milkdown:comments-count` / `handle.comments.count()` (`{open, resolved, orphaned, page, total}`). In this mode
  Escape, open / close and focus restoration belong to the host.
- Comment avatars (`author.avatarUrl`, `resolvedBy.avatarUrl`) accept only `https://` URLs without userinfo or
  same-origin paths starting with one `/`; `http:` and `data:` avatars show the initial.
- Editor heading ids are now always `nowo-h-<slug>` (Milkdown used the bare heading text): update scripts or CSS
  that targeted an editor heading by its old id. Do not give a comments container an id a heading could produce
  either way.
- Read-side heading ids are off by default; with `markdown.heading_ids: true` headings get `id="nowo-h-<slug>"`
  (sanitiser allow-lists that strip `id` must allow that prefix).

## To 1.5.1

From **1.5.0**:

```bash
composer update nowo-tech/milkdown-editor-bundle
```

- No BC break. Co-editing sends far fewer requests: edits are merged per 200 ms window and presence is throttled to
  one post per 750 ms (tunable with `collaboration.update_delay_ms` / `awareness_delay_ms`).
- **Hosts:** use **separate rate limiters** for `/update` and `/awareness` (and for `/token`, `/state`) instead of one
  shared limiter, and answer **429 with `Retry-After`** when a limit trips: the client now backs off and retries with
  the merged edits instead of going offline. Updates may now carry several edits merged with `Y.mergeUpdates` (still a
  plain Yjs update: nothing to change in a host that applies or logs them).
- `nowo_milkdown_copy_markdown()` accepts `icon` (`true` or `'only'`); its markup is a stable public contract, so hosts
  that copied it can call the function instead.
- Editor confirmations ("Copied as Markdown") now clear themselves; tests that read the live region later should
  read it right after the action.

## 1.5.0

- **New opt-in features:** `markdown_clipboard` and `insert_menu` (which needs `context_menu`). Fields without them
  keep the same widget JSON, menus and paste behaviour.
- With `markdown_clipboard`, **Ctrl / ⌘ + Alt + V** pastes as Markdown and **Ctrl / ⌘ + Alt + Shift + C** copies as
  Markdown. If your page binds these keys, choose between the two.
- **`nowo_milkdown_copy_markdown()`** is new. Print it only on pages the viewer may read, with the Markdown they may
  read: the source is in the page HTML.
- If you override translations, add the six new keys.

## 1.4.0

- **Block actions and colours (opt-in).** `block_actions`, `block_drag` (needs `block_actions`) and `colors`. With
  `block_actions` the editable gets a wider left gutter for the handle. `markdown.mark_colors` now defaults to nine
  names (adds brown, orange, pink); if you set it, add the names you want. Documents without the new attributes
  render exactly as before. New strings: `block.*`, `color.*`, `menu.color`.

## 1.3.1

- **Footnote ids change once.** The salt in `nowo-md-fn-<salt>-<label>` is now 12 hex characters keyed with
  `kernel.secret` (it was 6, from a plain hash of the Markdown). Cached HTML with footnotes renders with new ids after
  the update; select footnotes by prefix / suffix as before. `MilkdownMarkdownRenderer` gains an optional `$secret`
  argument (the bundle wires `%kernel.secret%`); constructing it yourself with footnotes on and no secret throws a
  `LogicException` (audit DB-I1).

## 1.3.0

- **Context menu (opt-in).** Nothing changes until a profile or field lists `context_menu` in `features`. With it,
  right clicks inside the editor open the bundle's menu (Shift + right click still opens the browser menu). Hosts
  with a CSP need nothing new (CSSOM positioning only). If you override translations, add the `menu.*` keys.

## 1.2.1

- **Footnotes are rendered.** Documents containing GFM footnotes (`text[^1]` plus `[^1]: note`) now render a
  footnote reference and a footnote list (`div.nowo-md-footnotes`, ids `nowo-md-fn-<salt>-<label>` /
  `nowo-md-fnref-<salt>-<label>`, the salt derived from the document — select them by prefix / suffix)
  instead of a broken link (1.2.0 read the definition as a link reference). Style `.nowo-md-footnotes` if your read pages need it. To keep the 1.2.0 output set
  `nowo_milkdown_editor.markdown.footnotes: false`. Documents with more than `markdown.max_footnote_refs` (200)
  references render them as literal `[^label]` text.
- **Mention names (opt-in).** `markdown.mention_display: name` and the profile / field option `mention_display: name`
  (with `user_title_url`) show people's names instead of `@handle`; nothing changes with the defaults. Use both
  together so the editor and the rendered page agree.

## 1.1.0

Security release (independent audit, Appendix CE). It is a minor version because defaults change and options are
added. Check these if you store long documents or rely on diagram styling:

- **`nowo_milkdown_editor.markdown.max_input_length` defaults to `100000` bytes (was `1000000`).** Longer documents
  now render as escaped plain text. The new `max_inline_markers` limit (default `10000`) does the same for documents
  with more inline delimiter characters **and line feeds** (a 100 KB document has about 2 500 lines). If your
  documents are longer, raise both (and `memory_limit`); see [CONFIGURATION](CONFIGURATION.md#renderer-limits).
- **`max_references` (default `500`)**: only the first 500 distinct page ids and the first 500 handles of a document
  are sent to the resolvers; later ones render as *Content not visible* / plain `@handle`. Resolvers only see the
  keys they were asked for, and answers for other keys are ignored.
- **`MilkdownEditorType` adds a `Length` constraint** (bytes, default `max_input_length`) when symfony/validator is
  installed. Saving a longer document now fails validation. Set the field option `'max_length' => null` to keep the
  old behaviour, or another value per field.
- **The CSP nonce is no longer written into `data-nowo-milkdown-options`.** The editor reads it from its
  `<script nonce>` element. If you override `Form/milkdown_editor_theme.html.twig`, keep the
  `nowo_milkdown_editor_assets(milkdown_nonce|default(null))` call (or load the module with a nonce yourself).
- **Mermaid:** image shapes (`A@{ img: … }`) are removed and `themeCSS`, `themeVariables`, `fontFamily` and
  `altFontFamily` can no longer be set from `%%{init}%%` or front matter. Pass
  `renderRichContent(root, { allowRemoteImages: true })` to keep them on read pages (the editor preview always
  filters).
- **KaTeX:** formulas nested deeper than 50 levels, over 5 000 characters, with more than 200 `^` / `_` or defining
  macros (`\def`, `\newcommand`, …) show their source with `data-math-error`, in the editor and on read pages.
- **Mermaid:** `style`, `classDef`, `linkStyle` and `cssClass` lines lose declarations that load resources
  (`url(…)`, `image-set(…)`, `@import`) unless `allowRemoteImages` is on.

## 1.0.0

First release: nothing to migrate.

### Coming from TiptapEditorBundle

Tiptap stores HTML; this bundle stores Markdown. Convert stored values once (for example with
`league/html-to-markdown` or your own converter) into new revisions, then replace `TiptapEditorType` with
`MilkdownEditorType`. Tiptap 1.6 `suggestions` (`[{trigger, url}]`) become `['@' => url, '[[' => url]`;
`upload_url` and `upload_csrf_token` keep their names and the JSON answer format.
