# Upgrading

## Table of contents

- [General procedure](#general-procedure)
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
