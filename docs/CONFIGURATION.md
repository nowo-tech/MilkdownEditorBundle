# Configuration

## Table of contents

- [Reference](#reference)
- [Profiles](#profiles)
- [Features](#features)
- [Markdown renderer](#markdown-renderer)
  - [Renderer limits](#renderer-limits)
- [Form options](#form-options)
- [Theme tokens](#theme-tokens)
- [Locales](#locales)

## Reference

```yaml
nowo_milkdown_editor:
    # Profile used when a field does not set the `profile` option. Must exist under `profiles`.
    default_profile: default
    profiles:
        default:
            # toolbar, top_bar, link_tooltip, table, code_mirror, math, mermaid, placeholder, cursor, slash_menu
            features: [toolbar, link_tooltip, table, code_mirror, placeholder, cursor, slash_menu]
            theme: auto                 # light | dark | auto
            min_height: 12rem           # CSS length: px, rem, em or vh
            icon_sprite_url: ~          # SVG sprite with <symbol id="tabler-NAME"> (null: icons stay text)
            icons: []                   # allowlisted icon names offered by the `:` trigger
            upload_max_size: 10485760   # bytes, checked in the browser before uploading (0: no limit)
            upload_accept: []           # MIME types, `type/*` or `.ext` (empty: any)
    markdown:
        html_input: escape              # escape | strip — raw HTML in Markdown is never rendered
        allow_unsafe_links: false       # javascript:, vbscript:, file:, data: links are dropped
        allow_remote_images: false      # images from other hosts become links
        math: true                      # $inline$ and $$block$$ math
        max_nesting_level: 50
        max_input_length: 100000        # bytes; longer input renders as escaped text (also the form's max_length)
        max_inline_markers: 10000       # more [ ] * _ ` ! < & @ : $ ~ | \ characters render as escaped text
        icon_sprite_url: ~
        icons: []
        mark_colors: [yellow, green, blue, red, purple, gray]
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

Lists, task lists, blockquotes, headings, links, images and the dialect nodes are always available.

## Markdown renderer

See the reference above. Hosts implement the resolver interfaces (see [USAGE.md](USAGE.md#rendering-markdown-in-php)):
`PageResolverInterface`, `UserResolverInterface`, `IconResolverInterface` (default: the configured allowlist) and
tagged `DirectiveRendererInterface` services.

### Renderer limits

league/commonmark allocates about **1.5 KB of memory per inline delimiter** (`[ ] * _ ` ` ! < & @ : $ ~ | \`) while
it parses a paragraph, and the dialect parsers add CPU on top (about 5 s per MB of delimiter-dense input). Two limits
keep a hostile document within PHP's default `memory_limit` (128M):

| Option | Default | Over the limit |
|--------|---------|----------------|
| `max_input_length` | `100000` bytes | Rendered as escaped plain text; `MilkdownEditorType` rejects it on save (`Length`, bytes) |
| `max_inline_markers` | `10000` | Rendered as escaped plain text |

With the defaults the worst input measured peaks at about 35 MB and 0.7 s (PHP 8.4); see
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
| `icon_sprite_url` | `?string` | profile | |
| `icons` | `list<string>` | profile | Allowlisted names |
| `upload_url` | `?string` | `null` | POST target (multipart `file`) |
| `upload_csrf_token` | `?string` | `null` | Sent as `X-CSRF-Token` |
| `upload_max_size` | `int` | profile | Bytes |
| `upload_accept` | `list<string>` | profile | |
| `collaboration` | `?array{url, hub_url, topic, user?: {name, color}}` | `null` | Opt-in Yjs over Mercure |
| `csp_nonce` | `?string` | `null` | Null: `CspNonceProviderInterface`; stamped on the module `<script>` and `<link>` only |
| `max_length` | `?int` | `markdown.max_input_length` | Bytes; adds a `Length` constraint when symfony/validator is installed (null: none) |

`disabled: true` makes the editor read-only.

## Theme tokens

The widget reads `--nowo-milkdown-*` custom properties (defined on `.nowo-milkdown` and `.nowo-md`): `text`, `muted`,
`background`, `surface`, `border`, `accent`, `accent-text`, `accent-soft`, `focus`, `selection`, `info`, `success`,
`warning`, `danger`, `radius`, `radius-control`, `shadow`, `mark-*`, `code-*`, `font`, `font-code`, `font-size`,
`min-height`. Dark values apply with `data-theme="dark"` on the widget, or with `theme: auto` under a
`[data-theme="dark"]` ancestor or a dark colour scheme. Override them in your stylesheet:

```css
.nowo-milkdown { --nowo-milkdown-accent: #4338ca; --nowo-milkdown-accent-text: #3730a3; }
```

## Locales

UI strings ship in **en, es, de, fr, it, nl, pt** (`NowoMilkdownEditorBundle` domain). Override any key in
`translations/NowoMilkdownEditorBundle.<locale>.yaml` of your application.
