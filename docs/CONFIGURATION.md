# Configuration

## Table of contents

- [Reference](#reference)
- [Profiles](#profiles)
- [Features](#features)
- [Markdown renderer](#markdown-renderer)
  - [Host references](#host-references)
    - [Plain URLs as host references (1.13)](#plain-urls-as-host-references-113)
  - [Renderer limits](#renderer-limits)
- [Form options](#form-options)
- [Icons](#icons)
- [Theme tokens](#theme-tokens)
- [Locales](#locales)

## Reference

```yaml
nowo_milkdown_editor:
    # Profile used when a field does not set the `profile` option. Must exist under `profiles`.
    default_profile: default
    profiles:
        default:
            # toolbar, top_bar, link_tooltip, table, code_mirror, math, mermaid, placeholder, cursor, slash_menu,
            # context_menu (1.3), block_actions, block_drag, colors (1.4), file_cards (1.8), image_block, insert_button (1.9)
            features: [toolbar, link_tooltip, table, code_mirror, placeholder, cursor, slash_menu]
            theme: auto                 # light | dark | auto
            min_height: 12rem           # CSS length: px, rem, em or vh
            icon_sprite_url: ~          # SVG sprite with <symbol id="tabler-NAME"> (null: icons stay text)
            icons: []                   # allowlisted icon names offered by the `:` trigger
            icon_catalog: false         # 1.7: the bundled Tabler outline catalog (5,203 icons, MIT) in the picker and `:`
            toolbar_icons: true         # 1.7: decorative icons in the action bar buttons
            menu_icons: true            # 1.7: decorative icons in the context, block and `/` menus
            upload_max_size: 10485760   # bytes, checked in the browser before uploading (0: no limit)
            upload_accept: []           # MIME types, `type/*` or `.ext` (empty: any)
            upload_accept_images: []    # 1.8: types expected as images (empty: upload_accept)
            upload_accept_files: []     # 1.8: other types accepted as attachments (empty: none besides upload_accept)
            action_bar_insert: [file, icon]  # 1.8: action-bar buttons Insert file / Insert icon; [] hides both
            mention_display: handle     # handle | name: mention chips show @handle or the name (1.2.1)
    markdown:
        html_input: escape              # escape | strip — raw HTML in Markdown is never rendered
        allow_unsafe_links: false       # javascript:, vbscript:, file:, data: links are dropped
        allow_remote_images: false      # images from other hosts become links
        math: true                      # $inline$ and $$block$$ math
        footnotes: true                 # GFM footnotes [^1] / [^1]: … (ids nowo-md-fn-<salt>-<label>)
        heading_ids: false              # 1.6: <h2 id="nowo-h-<slug>">, the same slugs as the editor feature heading_ids
        max_footnote_refs: 200          # more footnote references render as literal [^label] text (1.2.1)
        mention_display: handle         # handle | name: rendered mentions show @handle or the resolved name (1.2.1)
        max_nesting_level: 50
        max_input_length: 100000        # bytes; longer input renders as escaped text (also the form's max_length)
        max_inline_markers: 10000       # more [ ] * _ ` ! < & @ : $ ~ | \ characters and line feeds: escaped text
        max_references: 500             # distinct page ids / handles / host references sent to each resolver per document
        host_schemes: {}                # 1.9: scheme => {image, file, preview} URL templates with {id} (see below)
        host_image_origins: []          # 1.9: origins host images may load from while allow_remote_images is off
        host_url_patterns: []           # 1.13: plain URLs that are host references: [{pattern, scheme, url: written|resolved}]
        host_url_hosts: []              # 1.13: hosts whose absolute URLs the patterns read as their path (the request's host always counts); 1.14: env placeholders allowed
        host_refused_links: text        # 1.13: text | hidden — a refused scheme: link keeps its text or reads *Content not visible*
        image_block: false              # 1.9: images take {width=… align=…}; a standalone image renders as a figure
        file_preview_sandbox: []        # 1.9: tokens added to the sandbox attribute of preview frames
        icon_sprite_url: ~
        icons: []
        icon_catalog: false             # 1.7: also render any Tabler outline icon (and callout icon) from the bundled shards
        mark_colors: [yellow, green, blue, red, purple, gray, brown, orange, pink]  # 1.4: + brown, orange, pink
```

Invalid values fail at container compile time with the configuration path in the message (unknown feature, `math`
or `mermaid` without `code_mirror`, a missing default profile, a bad CSS length or icon name).

## Profiles

A **profile** is a named set of editor defaults (REQ-CFG-001). A field picks one with the `profile` option; `null`
uses `default_profile`. Every profile key can be overridden per field with the option of the same name.

```yaml
nowo_milkdown_editor:
    default_profile: wiki
    profiles:
        wiki:
            features: [toolbar, link_tooltip, table, code_mirror, math, mermaid, placeholder, cursor, slash_menu]
            min_height: 18rem
            icon_sprite_url: /icons/tabler-sprite.svg
            icons: [bug, bolt, rocket, alert-triangle]
        comment:
            features: [toolbar, link_tooltip, placeholder]
            min_height: 6rem
            theme: light
```

```php
$builder->add('body', MilkdownEditorType::class, ['profile' => 'comment']);
```

An unknown profile name throws `InvalidOptionsException` listing the defined profiles. The processed profiles are
available as the `nowo_milkdown_editor.profiles` and `nowo_milkdown_editor.default_profile` parameters and through
the `Nowo\MilkdownEditorBundle\ProfileRegistry` service.

## Features

| Feature | What it adds | Chunk |
|---------|--------------|-------|
| `toolbar` | Selection toolbar (bold, italic, strike, code, link…) | entry |
| `top_bar` | Fixed top bar with a heading selector and insert actions | lazy |
| `link_tooltip` | Link preview / edit tooltip | entry |
| `table` | GFM tables with row / column handles (named controls) | entry |
| `code_mirror` | CodeMirror code blocks, languages loaded on demand, nonce-aware | lazy |
| `math` | `$…$` / `$$…$$` with KaTeX (needs `code_mirror`) | lazy |
| `mermaid` | Mermaid preview of `mermaid` code blocks (needs `code_mirror`) | lazy |
| `placeholder` | Placeholder text of an empty document | entry |
| `cursor` | Drop cursor and gap cursor | entry |
| `slash_menu` | Accessible `/` block menu | entry |
| `block_actions` | "⋮⋮" block handle and block menu (turn into, colour, duplicate, move, delete), **Ctrl / ⌘ + /**, **Alt+Shift+↑ / ↓** (1.4) | lazy |
| `block_drag` | Drag the block handle to move a block (needs `block_actions`; keyboard moves stay) (1.4) | lazy |
| `colors` | Text and background colours: *Color* in the block menu, the context menu and the toolbar (1.4, see [USAGE](USAGE.md#block-actions-and-colours)) | lazy |
| `context_menu` | Right-click / Shift+F10 / ContextMenu-key menu: clipboard, *Turn into*, table, link and block actions, host items (1.3, see [USAGE](USAGE.md#context-menu)) | lazy |
| `markdown_clipboard` | Smart paste of Markdown; *Paste as Markdown* (**Ctrl / ⌘ + Alt + V**) and *Copy as Markdown* (**Ctrl / ⌘ + Alt + Shift + C**), also in the context menu (1.5, see [USAGE](USAGE.md#markdown-clipboard)) | lazy |
| `insert_menu` | *Insert* group of the context menu: file, icon and the `/` blocks of the field (needs `context_menu`; 1.5) | entry |
| `comments` | Inline comment anchors, highlights, **Ctrl / ⌘ + Alt + M**, next / previous comment, events; optional thread component with `comments.url` (1.6, see [USAGE](USAGE.md#comments)) | lazy |
| `version_view` | Read-only view of an old version with a banner (*Restore* / *Copy to a new page* events); never with `comments` (1.6, see [USAGE](USAGE.md#version-view-and-diff)) | lazy |
| `heading_ids` | Headings get ids `nowo-h-<slug>`, the same as the renderer's `markdown.heading_ids` (1.6) | lazy |
| `file_cards` | Uploads that are not images become file cards `::file[name]{href size type}` instead of links (1.8, see [USAGE](USAGE.md#uploads)); `::file` is always rendered as a card. 1.9: *View* and *Preview height* menus and `/file` variants ([USAGE](USAGE.md#file-views-and-previews)) | entry |
| `image_block` | 1.9: caption, width and alignment of images with a toolbar on the selected image ([USAGE](USAGE.md#images)); enable `markdown.image_block` for the read side | entry |
| `insert_button` | 1.9: a "+" beside the empty line with the caret opens the `/` menu (needs `slash_menu`) | entry |

Lists, task lists, blockquotes, headings, links, images and the dialect nodes are always available.

## Markdown renderer

See the reference above. Hosts implement the resolver interfaces (see [USAGE.md](USAGE.md#rendering-markdown-in-php)):
`PageResolverInterface`, `UserResolverInterface`, `IconResolverInterface` (default: the configured allowlist) and
tagged `DirectiveRendererInterface` services.

### Host references

```yaml
nowo_milkdown_editor:
    markdown:
        host_schemes:
            app-file:
                image: /files/{id}/thumbnail   # <img src>; default: file
                file: /files/{id}              # links and file cards
                preview: /files/{id}/preview   # view="preview"; none: no previews
        host_image_origins: [https://cdn.example.com]
```

A scheme is lower-case letters, digits, `+`, `.` and `-`, and not one of the browser's (`http`, `data`, `javascript`,
`file`, `view-source`…). A template is a path starting with one `/` or an http(s) URL, has `{id}` after the first `/` of
the path (never in the host) and at most 500 characters; anything else fails at container build. The templates are in the
page (`script[data-nowo-milkdown-config]`, printed by `nowo_milkdown_editor_assets()`), so do not put secrets in them.
See [USAGE](USAGE.md#host-references).

#### Plain URLs as host references (1.13)

```yaml
nowo_milkdown_editor:
    markdown:
        host_url_patterns:
            - { pattern: '^/files/(?<id>[0-9a-f-]{36})/(?:original|preview|thumb|s128|s64)$', scheme: app-file }
            - { pattern: '^https://cdn\.example\.com/(?<id>[A-Za-z0-9_-]+)$', scheme: app-file, url: resolved }
        host_url_hosts: [app.example.com]   # https://app.example.com/files/… and //app.example.com/files/… match the first pattern
        host_refused_links: hidden
```

`host_url_hosts` entries are `host` or `host:port`, compared in lower case. Since 1.14 an entry may be an env placeholder,
e.g. `'%env(key:host:url:DEFAULT_URI)%'` (the URL's host, without its port). Literal entries are checked when the
container compiles; a placeholder is checked once resolved, when the container builds `HostSchemes`: a value that is not a
host name with an optional port throws an `InvalidArgumentException` (the renderer and the editor's Twig functions cannot
be built), an empty value adds no host.

Before matching, a URL is normalised: trimmed, its query and fragment dropped, its path percent-decoded once and its uuids
lower-cased; an absolute or protocol-relative URL of `host_url_hosts` or of the current request's host is read as its path
(other origins keep theirs, so a pattern can still name a CDN). The first pattern that matches makes it the reference
`scheme:<id>`, resolved with the scheme's other references. **A pattern must cover every URL form your file route serves**
(all variants such as `thumb` or `s128`, every path prefix): anything it does not match stays an ordinary link. A URL
that matches but cannot be checked is refused: a pattern that fails to run (PCRE limits), and a normalised URL over 2,048
characters that starts with a pattern's literal prefix. Avoid nested quantifiers (`(?:a+)+`): they only make matches fail
closed, but cost CPU. `url: written` (default) keeps the author's URL when the
viewer may see the file; `url: resolved` uses the resolver's URL. A refused one renders *Content not visible* without URL,
alt text or name. A pattern is read by PCRE and by the browser, so only a common subset is accepted: anchored `^…$`,
no top-level `|` (put alternatives in a group), exactly one `(?<id>…)`, no other `(?` group (no lookaround, flags or other
named groups), no `(*` verbs, no POSIX `[:…:]` classes, no class starting with `]`, escapes only `\d \D \w \W \s \S`
and punctuation, printable ASCII without `#`, at most 300 characters; its scheme must be in `host_schemes`. Anything else
fails at container build. The patterns are in the page (`hostUrlPatterns`) like the templates.

### Renderer limits

league/commonmark allocates about **1.5 KB of memory per inline delimiter** (`[ ] * _ ` ` ! < & @ : $ ~ | \`) and
per soft line break while it parses a paragraph, and the dialect parsers add CPU on top (about 5 s per MB of
delimiter-dense input). Two limits keep a hostile document within PHP's default `memory_limit` (128M):

| Option | Default | Over the limit |
|--------|---------|----------------|
| `max_input_length` | `100000` bytes | Rendered as escaped plain text; `MilkdownEditorType` rejects it on save (`Length`, bytes) |
| `max_inline_markers` | `10000` delimiters + line feeds | Rendered as escaped plain text |
| `max_references` | `500` | Later page links render *Content not visible*, later mentions plain `@handle` |
| `max_footnote_refs` | `200` | Every footnote reference renders as literal `[^label]` text and the notes are dropped (each reference adds two links, ~50× output) |

With the defaults the worst input measured peaks at about 39 MB (process total) and 1.2 s (PHP 8.4); see
[SECURITY.md](SECURITY.md#parser-cost). For longer documents raise both limits together with `memory_limit`
(keep `max_inline_markers` below `memory_limit / 3 KB`).

## Form options

| Option | Type | Default | Notes |
|--------|------|---------|-------|
| `profile` | `?string` | `null` | Profile name (null: `default_profile`) |
| `features` | `list<string\|Feature>` | profile | Validated; `math` / `mermaid` need `code_mirror` |
| `theme` | `light\|dark\|auto` | profile | |
| `min_height` | `string` | profile | CSS length |
| `placeholder` | `?string` | `null` | Translated with the field's `translation_domain`; null: the bundle default |
| `suggestions` | `array<'@'\|'[['\|':', string>` | `[]` | Candidate URLs (`GET url?q=…`) |
| `link_title_url` | `?string` | `null` | `GET url?ids=a,b` → `[{id, title, url, visible}]` |
| `mention_display` | `handle\|name` | profile | `name`: chips show the person's name (from the `@` suggestions and `user_title_url`), the handle stays in the Markdown (1.2.1) |
| `user_title_url` | `?string` | `null` | `GET url?handles=a,b` → `[{handle, name}]`, used with `mention_display: name` (1.2.1) |
| `icon_sprite_url` | `?string` | profile | |
| `icons` | `list<string>` | profile | Allowlisted names |
| `icon_catalog` | `bool` | profile (`false`) | 1.7: the bundled Tabler outline catalog (see [Icons](#icons)) |
| `toolbar_icons` | `bool` | profile (`true`) | 1.7: icons before the action bar labels |
| `menu_icons` | `bool` | profile (`true`) | 1.7: icons before menu and `/` labels |
| `upload_url` | `?string` | `null` | POST target (multipart `file`) |
| `upload_csrf_token` | `?string` | `null` | Sent as `X-CSRF-Token` |
| `upload_max_size` | `int` | profile | Bytes |
| `upload_accept` | `list<string>` | profile | Accepted types (empty: any) |
| `upload_accept_images` | `list<string>` | profile (`[]`) | 1.8: types expected as images; with `upload_accept_files` the editor accepts their union (images default to `upload_accept`; `upload_accept_files` alone: only those files; see [USAGE](USAGE.md#uploads)) |
| `upload_accept_files` | `list<string>` | profile (`[]`) | 1.8: other types accepted as attachments (file cards with `file_cards`) |
| `action_bar_insert` | `list<'file'\|'icon'>` | profile (`[file, icon]`) | 1.8: action-bar buttons; `[]` hides *Insert file* and *Insert icon* (sent in the widget JSON only when not the default) |
| `collaboration` | `?array{url, hub_url, topic, user?: {name, color}, update_delay_ms?: int, awareness_delay_ms?: int, max_update_bytes?: int, connect_timeout_ms?: int}` | `null` | Opt-in Yjs over Mercure; send windows in ms and the largest update per POST (1.5.1, defaults 200 / 750 / 256 KiB); longest wait for the shared document before editing without it (1.10, 0–60000 ms, default 5000; see [USAGE](USAGE.md#collaboration)) |
| `csp_nonce` | `?string` | `null` | Null: `CspNonceProviderInterface`; stamped on the module `<script>` and `<link>` only |
| `max_length` | `?int` | `markdown.max_input_length` | Bytes; adds a `Length` constraint when symfony/validator is installed (null: none) |
| `comments` | `?array{url?, csrf_token?, can_create?, panel?, container?, topic?}` | `null` | With the `comments` feature (1.6): host endpoints of the thread component (a path or an http(s) URL on the page origin; null: events only), CSRF token, whether the viewer may start threads (default true), `margin` / `sidebar` / `container` / `none` (`margin` when `url` is set; `container` renders into `container`, a CSS selector of 1–200 characters of your drawer, or wherever `handle.comments.mount(el)` puts it, with no landmark, heading, layout or Escape handling of its own), private Mercure topic of thread ids |
| `version` | `?array{label?, restore?, copy?}` | `null` | With `version_view` (1.6): banner text and whether *Restore* / *Copy to a new page* exist (default true; false removes the button) |

`disabled: true` makes the editor read-only. `nowo_milkdown_view(markdown, options)` (1.6) renders the same widget
read-only outside a form.

## Icons

Three independent icon settings (1.7):

- **`menu_icons` / `toolbar_icons`** (default on): a decorative glyph before each label of the context menu, the block
  menu, the `/` menu and the action bar. The glyphs are part of the editor module (inline SVG, about 3 kB gzip),
  `aria-hidden="true"`, coloured with `currentColor` (menus: `--nowo-milkdown-icon-color`, default the muted token),
  sized by `--nowo-milkdown-icon-size` (default `1.125em`). Crepe's selection toolbar and top bar already use icons.
- **`icons` + `icon_sprite_url`**: your own allowlist and sprite (`<symbol id="tabler-NAME">`), as before.
- **`icon_catalog`** (default off) and **`markdown.icon_catalog`**: every icon of the Tabler outline set shipped with the
  bundle. The editor searches the names and Tabler keywords in a lazy chunk (about 79 kB gzip, loaded on the first
  picker or `:` use); icons render from `/bundles/nowomilkdowneditor/icons/tabler-<first character>.svg` (26 shards,
  about 250 kB gzip in total, the largest 55 kB; a page only fetches the shards of the icons it shows). Allowlisted
  names keep your sprite. Enable both keys so the read pages render what the editor shows.
  SVG `<use>` only loads same-origin files: serve the bundle assets (`assets:install`) from the page's origin, not
  from a CDN `base_urls` of the `nowo_milkdown_editor` package, or catalog icons stay invisible (they fail closed).
  Like the other bundle assets, send the shards with `Content-Type: image/svg+xml` and
  `X-Content-Type-Options: nosniff` (they contain only `svg`, `symbol` and `path`).

With `icons` or `icon_catalog` the **icon picker** is available (see [USAGE](USAGE.md#icons-and-the-icon-picker)).

Tabler Icons © Paweł Kuna, MIT: the licence is published next to the shards (`icons/LICENSE-tabler.txt`).

## Theme tokens

The widget reads `--nowo-milkdown-*` custom properties (defined on `.nowo-milkdown` and `.nowo-md`): `text`, `muted`,
`background`, `surface`, `border`, `accent`, `accent-text`, `accent-soft`, `focus`, `selection`, `info`, `success`,
`warning`, `danger`, `radius`, `radius-control`, `shadow`, `mark-*`, `code-*`, `font`, `font-code`, `font-size`,
`min-height`, and since 1.7 the optional `icon-size` and `icon-color`. Dark values apply with `data-theme="dark"` on the widget, or with `theme: auto` under a
`[data-theme="dark"]` ancestor or a dark colour scheme. Override them in your stylesheet:

```css
.nowo-milkdown { --nowo-milkdown-accent: #4338ca; --nowo-milkdown-accent-text: #3730a3; }
```

## Locales

UI strings ship in **en, es, de, fr, it, nl, pt** (`NowoMilkdownEditorBundle` domain). Override any key in
`translations/NowoMilkdownEditorBundle.<locale>.yaml` of your application.
