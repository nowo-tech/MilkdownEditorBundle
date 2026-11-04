# Configuration

## Table of contents

- [Reference](#reference)
- [Profiles](#profiles)
- [Features](#features)
- [Markdown renderer](#markdown-renderer)
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
            # context_menu (1.3), block_actions, block_drag, colors (1.4)
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
            mention_display: handle     # handle | name: mention chips show @handle or the name (1.2.1)
    markdown:
        html_input: escape              # escape | strip — raw HTML in Markdown is never rendered
        allow_unsafe_links: false       # javascript:, vbscript:, file:, data: links are dropped
        allow_remote_images: false      # images from other hosts become links
        math: true                      # $inline$ and $$block$$ math
        footnotes: true                 # GFM footnotes [^1] / [^1]: … (ids nowo-md-fn-<salt>-<label>)
        max_footnote_refs: 200          # more footnote references render as literal [^label] text (1.2.1)
        mention_display: handle         # handle | name: rendered mentions show @handle or the resolved name (1.2.1)
        max_nesting_level: 50
        max_input_length: 100000        # bytes; longer input renders as escaped text (also the form's max_length)
        max_inline_markers: 10000       # more [ ] * _ ` ! < & @ : $ ~ | \ characters and line feeds: escaped text
        max_references: 500             # distinct page ids / handles sent to each resolver per document
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

Lists, task lists, blockquotes, headings, links, images and the dialect nodes are always available.

## Markdown renderer

See the reference above. Hosts implement the resolver interfaces (see [USAGE.md](USAGE.md#rendering-markdown-in-php)):
`PageResolverInterface`, `UserResolverInterface`, `IconResolverInterface` (default: the configured allowlist) and
tagged `DirectiveRendererInterface` services.

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
| `upload_accept` | `list<string>` | profile | |
| `collaboration` | `?array{url, hub_url, topic, user?: {name, color}, update_delay_ms?: int, awareness_delay_ms?: int, max_update_bytes?: int}` | `null` | Opt-in Yjs over Mercure; send windows in ms and the largest update per POST (1.5.1, defaults 200 / 750 / 256 KiB, see [USAGE](USAGE.md#collaboration)) |
| `csp_nonce` | `?string` | `null` | Null: `CspNonceProviderInterface`; stamped on the module `<script>` and `<link>` only |
| `max_length` | `?int` | `markdown.max_input_length` | Bytes; adds a `Length` constraint when symfony/validator is installed (null: none) |

`disabled: true` makes the editor read-only.

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
