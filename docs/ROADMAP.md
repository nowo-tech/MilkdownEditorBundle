# Roadmap

Feature roadmap of the Milkdown Editor Bundle after **1.18.0** (2026-11-17), refreshed on 2026-11-18 from a feature
gap review of the code (features, nodes, plugins, commands, dialect, PHP renderer, configuration) and of the
changelog. It replaces the roadmap of 2026-11-03, whose version numbers no longer matched the releases. It is a plan,
not a commitment: every item becomes a Spec Kit feature (`specs/NNN-*`) with its own spec, tasks and tests before it
is built, and versions may move.

**Goal.** The editor of a knowledge base that offers what people expect from a modern block editor: a block handle
and block menu, right-click and slash menus, inline comments, embeds, templates, presence, history and a database
block. What the bundle is built on does not move: **Markdown is the source of truth**, the PHP renderer, exports and
search read the same dialect as the editor, the editor is accessible (WCAG 2.1 AA, 2.2 where cheap) and works under
a strict nonce CSP. The knowledge-base side (page tree, trash, history, search, permissions, databases) is planned in
the [WikiBundle roadmap](https://github.com/nowo-tech/WikiBundle/blob/main/docs/ROADMAP.md); items marked **E + W**
need both bundles.

## Table of contents

- [Ground rules](#ground-rules)
- [Where we are (1.18.0)](#where-we-are-1180)
- [Feature status matrix](#feature-status-matrix)
- [Next](#next)
- [Later](#later)
- [Considering](#considering)
- [Deliberate gaps](#deliberate-gaps)
- [Design notes](#design-notes)
  - [Slash menu v2](#slash-menu-v2)
  - [Embeds and bookmarks](#embeds-and-bookmarks)
  - [Templates](#templates)
  - [Database block](#database-block)
  - [Find and replace](#find-and-replace)
- [Upstream pieces not used yet](#upstream-pieces-not-used-yet)
- [Done since the 2026-11-03 roadmap](#done-since-the-2026-11-03-roadmap)
- [Open decisions](#open-decisions)
- [Links](#links)

## Ground rules

1. **Backward compatible.** Every new capability is a new value of the profile / field `features` list (or a new
   option with a neutral default). Existing profiles render exactly as today until a host opts in. A 2.0 is only
   planned for an upstream break (Milkdown 8) or a change of defaults, never for a feature.
2. **Dialect first.** A feature that changes what is stored ships the TypeScript parse / stringify, the PHP parser /
   renderer, the reference extraction and round-trip tests in the same release. Anything the PHP renderer does not
   understand still renders as readable, escaped text.
3. **Nothing remote by default.** No CDN images, no third-party scripts, no iframes unless a host allow-lists them;
   remote fetches (link previews) happen on the host, never in the bundle's PHP.
4. **Keyboard parity.** Every pointer interaction (right click, drag, hover button) has a keyboard path and an ARIA
   pattern; WCAG 2.2 *Dragging movements* (2.5.7) is met by a non-drag alternative.
5. **Lazy by default.** New UI loads in its own chunk when its feature is enabled; the up-front budget stays
   **400 kB gzip** and each release may add at most **15 kB gzip** up front.
6. **Bundle vs host.** The bundle ships editor UI, the dialect, renderer hooks and JS / PHP extension points. Storage,
   permissions, notifications, page trees and remote fetches belong to the host or to WikiBundle.
7. **Runtime.** PHP services work in FrankenPHP worker mode with the kernel reset off (per-request memos reset at
   every boundary) and on both standard Symfony and DDD hosts.

## Where we are (1.18.0)

Shipped, by area (each opt-in through `features` unless noted; see [USAGE](USAGE.md)):

- **Blocks.** Paragraph, headings 1–6, bulleted / numbered / task lists, quote, code (CodeMirror, language picker,
  copy), table, divider, callout (four types, Tabler or emoji icon), collapsible section, Mermaid and
  math (hardened), image block (caption, width, alignment), file cards (link, icon, card, sandboxed preview),
  alignment containers, footnotes, host leaf directives.
- **Inline.** Floating toolbar, top bar (accessible names, translated, phone overflow), text and background colours
  (named palette, inline and per block), highlights, links with tooltip and the link picker (pages, sections, URLs,
  `Mod-k`), page links by id with per-viewer titles and section anchors, mentions, Tabler icons, emoji on `:`.
- **Menus.** Slash menu (up to 23 items, filtered, 10 rows shown), right-click menu (clipboard, turn into, table,
  link, comment, colour, *Insert*, host items through `contextMenu.register`), block handle with a block menu (turn
  into, duplicate, move up / down, delete, colour; Alt+Shift+↑ / ↓, Ctrl+/), optional pointer drag, "+" insert
  button on empty lines, action bar, menus in the top layer.
- **Headings.** Heading ids with one grammar in TS and PHP, explicit `{#id}` suffixes, stable ids while editing,
  section links on read pages.
- **Clipboard and files.** Markdown clipboard (paste / copy as Markdown), drop and paste of several files with
  placeholders, upload kinds decided by the host, host references and resolvers for files and images.
- **Comments.** Text-quote and Yjs anchors, highlights as decorations, orphans, next / previous, a thread component
  (replies, reactions, resolve, page comments), avatars.
- **History.** `version_view` (read-only old version with a banner), rendered diff (`nowo_milkdown_diff()`,
  `MarkdownDiffRendererInterface`).
- **Collaboration.** Yjs over Mercure: cursors with names and colours, state log with epochs, compaction, reset,
  offline queue and status, standalone mode, throttled updates.
- **Read pages.** `nowo_milkdown_view()` and read-only parity with the server render, *Copy as Markdown* button.
- **Platform.** Seven locales, nonce CSP, axe and CSP e2e, framework-free PHP ports.

## Feature status matrix

**Yes** = shipped, **Partial** = some of it, **No** = not started. *Owner*: **E** = this bundle, **W** = WikiBundle,
**H** = host.

| Area | Feature | Editor | Wiki | Owner | Plan |
|------|---------|--------|------|-------|------|
| Block menu | Block handle, block menu, keyboard moves, drag | Yes | — | — | Copy link to block: Considering |
| Block menu | "+" insert button | Yes | — | — | — |
| Context menu | Right-click menu with host items | Yes | — | — | — |
| Slash menu | Slash menu | Partial (flat, 10 rows, line start) | — | E | **Next** |
| Slash menu | Groups, keywords, aliases, recent items, full scrolling list | No | — | E | **Next** |
| Inline | Floating toolbar, colours, highlights, links | Yes | — | — | — |
| Inline | Keyboard shortcut help dialog | No | — | E | **Next** |
| Blocks | Callouts, collapsible sections, quotes, dividers | Yes | — | — | Collapsible headings: Later |
| Blocks | Code, Mermaid, math | Yes | — | — | Diagram zoom, side-by-side source: Later |
| Blocks | Columns | No | — | E | Later |
| Blocks | Table of contents block | No | Partial (`sections`) | E + W | **Next** |
| Blocks | Reusable section (read-only transclusion) | No | No | E + W | Later |
| Blocks | Dates and reminders | No | — | E + H | Later |
| Tables | Row / column actions, alignment | Yes | — | — | — |
| Tables | Table toolbar, header conversion, copy as CSV | No | — | E | Later |
| Embeds | Images with caption, size, alignment | Yes | Yes | — | Lightbox: **Next** |
| Embeds | Host file cards and previews | Yes | Yes | — | — |
| Embeds | External embeds from an allow-list | No | No | E + H | **Next** |
| Embeds | Bookmark cards with link previews | No | No | E + H | **Next** |
| Links | Page and section links by id, link picker | Yes | Yes | — | — |
| Links | Smart paste of page URLs as page links | Partial (host file URLs) | — | E | Later |
| Mentions | People mentions | Yes | Partial | — | Notifications: Wiki |
| Emoji | Full emoji picker with search and categories | Partial (short list on `:`) | — | E | Later |
| Comments | Inline and page threads | Yes | Yes | — | — |
| Comments | Comments on a whole block or image | No | No | E + W | Later |
| Comments | Mentions and emoji in the comment composer | No | — | E | Later |
| History | Version view, rendered diff | Yes | Partial (line diff) | W | Wiki **Next** |
| History | Suggested edits reviewed per block | No | No | E + W | Considering |
| Collaboration | Co-editing with cursors | Yes | Yes | — | — |
| Collaboration | Presence avatars, follow a collaborator | No | No | E + W | **Next** |
| Templates | Template picker, variable chips, repeatable insert block | No | No | E + W | **Next** |
| Databases | Database block (inline and linked views, cell editing) | No | No | E + W | **Next** (with the Wiki MVP) |
| Writing tools | Find and replace | No | — | E | **Next** |
| Writing tools | Word count and reading time | No | — | E | Later |
| Writing tools | Markdown source view | No | — | E | Later |
| Writing tools | Focus mode, typewriter scrolling | No (Wiki has focus mode) | Yes | E | Considering |
| Writing tools | Paste cleanup from office documents | Partial (schema parse) | — | E | Later |
| Writing tools | AI assistance through a host endpoint | No | Partial (Q&A) | E + H | Considering |
| Host API | Commands API for a host palette (`editor.commands`) | No | — | E | **Next** |
| Mobile | Phone top bar | Yes | — | — | — |
| Mobile | Touch-sized block button, bottom-sheet menus | No | — | E | Later |
| Accessibility | Menu and combobox patterns, axe, keyboard paths | Yes | Yes | — | Every new UI |

## Next

Ordered by value. One line each: what it is and why it helps.

| Area | Item | What and why | Owner |
|------|------|--------------|-------|
| Slash menu | **Slash menu v2** | Opens after `/` at a line start or after a space, groups, keywords and aliases, recent items first, the full list scrollable; today only 10 rows show and several blocks cannot be found by a synonym. See [Slash menu v2](#slash-menu-v2). | E |
| Templates | **Template picker, chips and insert block** | `editor.insertMarkdown()`, a searchable picker from a host URL, a *Template* slash group, variables shown as non-editable chips while editing a template, a repeatable insert block; the editor half of Wiki templates. See [Templates](#templates). | E + W |
| Embeds | **External embeds and bookmarks** | `::embed{url}` for allow-listed providers (sandboxed iframe, link otherwise) and `::bookmark{url}` cards from a host unfurl endpoint; pasting a lone URL offers *Link / Bookmark / Embed*. See [Embeds and bookmarks](#embeds-and-bookmarks). | E + H |
| Writing tools | **Find and replace** | A find bar inside the editor (`prosemirror-search`), case and regex options, replace one / all as one transaction, match count announced; also opens on a search hit from the Wiki. See [Find and replace](#find-and-replace). | E |
| Blocks | **Table of contents block** | `::toc{levels=2-3}` with a live preview in the editor and the same list in the PHP renderer and exports; long pages become navigable. The Wiki adds a side panel from the same ids. | E + W |
| Collaboration | **Presence avatars and follow** | An avatar stack of connected people (from awareness), *follow* to scroll with a collaborator, a clearer reconnecting state; people see who else is in the page. | E + W |
| Databases | **Database block** | `::database{id view}`: inline and linked views of Wiki databases (table, then board), cell editing with optimistic concurrency, a view switcher; nothing of the data in the Markdown. See [Database block](#database-block). | E + W |
| Host API | **Commands API and shortcut help** | `editor.commands.list()` / `run(id)` for the host's command palette, and a shortcut help dialog generated from the keymaps; makes every editor action discoverable from the keyboard. | E |
| Embeds | **Image lightbox** | A `<dialog>` with the full-size image on read pages, Escape and focus return; the last open part of the image block. | E |

## Later

| Area | Item | What and why | Owner |
|------|------|--------------|-------|
| Blocks | **Columns** | `::::columns` / `:::column` containers (2–4), keyboard and menu moves between columns, stacked on narrow screens, in print, search and exports. | E |
| Blocks | **Reusable sections** | A read-only `::include{page heading}` leaf directive resolved per viewer by WikiBundle, depth-limited; one section reused without copies. | E + W |
| Blocks | **Collapsible headings** | A collapsible section whose summary is a heading, so long documents fold by section. | E |
| Blocks | **Dates and reminders** | `:date[2026-11-03]` chips with an accessible date picker and *Today / Tomorrow* suggestions, `<time>` in the PHP render; reminders are host work. | E + H |
| Blocks | **Task assignees and due dates** | Mentions and dates inside task items shown as chips, so the host can index open tasks; no new syntax. | E + H |
| Blocks | **Diagram and math polish** | Side-by-side source and preview, diagram zoom and full screen, an inline math editor with preview. | E |
| Tables | **Table toolbar** | Insert, delete, align, *Convert first row to header*, *Copy as Markdown / CSV*, Ctrl+Alt+arrows, all announced. | E |
| Links | **Smart page-link paste** | A pasted URL that matches the host's page URL pattern becomes a page link by id; a URL over a selection becomes a link. | E |
| Emoji | **Full emoji picker** | A lazy Unicode dataset (names, keywords, categories, skin tones) behind `:` and a picker dialog, reusable by the Wiki for titles. | E |
| Comments | **Block and image comments** | Threads anchored to a whole block (image, embed, table, database view) without a text quote. | E + W |
| Comments | **Composer mentions and emoji, resolve all** | `@` and emoji in the comment composer, a count badge in the margin and *Resolve all* for page owners. | E |
| Writing tools | **Counts and reading time** | A status line with words, characters and reading time (`Intl.Segmenter`), announced on demand. | E |
| Writing tools | **Markdown source view** | A CodeMirror Markdown view of the same value, read-only while co-editing; for power users and odd Markdown. | E |
| Writing tools | **Paste cleanup** | Pre-processing of HTML from office documents and word processors (wrapper tags, fake bullets, font-weight spans) so lists, headings, tables and links survive; pasted images uploaded. | E |
| Mobile | **Touch polish** | Touch-sized block button, bottom-sheet menus, toolbars that stay above the virtual keyboard. | E |

## Considering

| Area | Item | What and why | Owner |
|------|------|--------------|-------|
| History | **Suggested edits** | A suggesting mode that produces a proposed Markdown reviewed per block with `@milkdown/plugin-diff` (accept / reject); stored by the host as a pending revision. | E + W |
| Writing tools | **AI assistance** | Rewrite, summarise, continue and translate through a **host endpoint only**, streamed and shown as a diff to accept; no keys, models or prompts in the browser. | E + H |
| Writing tools | **Focus mode and typewriter scrolling** | An editor-only distraction-free mode for hosts without the Wiki's focus mode; the caret line kept centred, respecting reduced motion. | E |
| Block menu | **Copy link to any block** | Block ids (`{#id}` on any block) for deep links beyond headings; decide after the TOC block (D7). | E |
| Blocks | **Definition lists** | Only if a host asks; not GFM, no Milkdown node. | E |
| Writing tools | **Spellcheck language per field** | A `lang` option, spellcheck off inside code and on chips. | E |

## Deliberate gaps

| Gap | Why | Instead |
|-----|-----|---------|
| Editing one block in many pages | Markdown has no shared nodes; permissions differ per page | Read-only reusable sections |
| Column widths and merged cells in tables | GFM stores neither; resizing would be lost on save | A view-only fit / wide toggle if asked |
| Character-level tracked changes in a live Yjs document | Conflicts with Markdown storage and Yjs | Suggested edits per block |
| Crepe's own block handle, slash menu, image block and AI feature | Pointer-only, remote loads, keys in the browser | The bundle's own accessible versions |

## Design notes

### Slash menu v2

- Triggers after `/` at the start of a line **or after a space**; Escape or a space closes it.
- Groups (*Basic*, *Lists*, *Media*, *Advanced*, *Host*), keywords and aliases (`todo` → task list, `hr` → divider),
  the shortcut shown per row, recent items first, the full list scrollable instead of `MAX_ITEMS = 10`.
- Every block the profile allows, including the ones each release adds (embed, bookmark, TOC, database, template,
  columns) and host leaf directives with the host's label and icon.
- Same combobox / listbox pattern as today (axe-tested); shares the menu component with the context and block menus.

### Embeds and bookmarks

- **Embeds:** providers from a host allow-list (D2); the bundle owns fixed URL → embed-URL transforms (no oEmbed
  fetch) and renders `<iframe sandbox referrerpolicy="no-referrer" loading="lazy" title>` only when the provider is
  allow-listed **and** the host CSP `frame-src` lists it; otherwise a link. Exports and search always see a link.
- **Bookmarks:** title, description and icon from a **host unfurl endpoint** (D3) that blocks private ranges,
  redirects to them, non-http(s) schemes and large bodies, with a cache; images proxied or omitted. Without the
  endpoint a bookmark renders as a link.
- **PHP:** embed and bookmark directive renderers with the same allow-list (`markdown.embeds.providers`) and a batched
  host `LinkPreviewResolverInterface`.

### Templates

- `editor.insertMarkdown(markdown, { at: 'cursor' | 'replace' })`, parsed with the dialect and within the limits.
- A template picker (searchable listbox from `templates_url`: title, icon, description; Markdown fetched on pick) for
  the empty-page state, the slash *Template* group and the host.
- A repeatable insert block `::template-button{template=<uuid> label="…"}` (a real `<button>`), rendered as nothing or
  a disabled label outside the editor.
- A template editing mode with `{{date}}`, `{{author}}`, … as non-editable chips; substitution happens on the server
  when a page is created, never in the browser. Variable names match `[a-z][a-z0-9_.]{0,40}`.

### Database block

- Leaf directive `::database{id=<uuid> view=<uuid>}`; no data in the page Markdown.
- Inline view fetched from `database_url`, paged; cell editing (text, number, select, date, checkbox, person) posting
  to the Wiki API with optimistic concurrency and the CSRF header; a view switcher; *Open as page*; slash items for a
  new inline database and a linked view.
- ARIA `grid` with arrow keys, Enter to edit, Escape to cancel; board moves with the keyboard.
- The PHP side only routes the directive: WikiBundle renders the view per viewer.

### Find and replace

- `prosemirror-search` decorations; `Ctrl+F` opens the bundle's bar **only while the editor has focus** (browser find
  elsewhere), `Ctrl+H` replace; "3 of 12" announced; Escape returns to the caret.
- Searches the visible text, not the Markdown, and skips chips' rendered titles; replace-all is one transaction (one
  undo step, one Yjs update).

## Upstream pieces not used yet

The bundle pins `@milkdown/crepe`, `@milkdown/kit` and `@milkdown/plugin-collab` 7.23. Unused upstream pieces that the
items above rely on:

| Upstream piece | Use |
|----------------|-----|
| `@milkdown/plugin-diff` (per-block diff, apply / reject) | Suggested edits; the client diff view |
| `@milkdown/plugin-streaming` | AI assistance through a host stream |
| `$pasteRule` | Smart page-link paste |
| Extensible block container types (`preset-commonmark`) | Columns |
| `prosemirror-search` (ProseMirror) | Find and replace |

## Done since the 2026-11-03 roadmap

Moved out of the plan because they shipped (version in brackets):

- Footnote rendering and mention names (1.2.1); context menu (1.3); block handle, block menu, keyboard moves, drag
  and colours (1.4); Markdown clipboard and the *Insert* group (1.5); collaboration request rate (1.5.1).
- Inline comments, `version_view`, rendered diff, `nowo_milkdown_view()`, heading ids (1.6).
- Icons in menus and toolbars, the icon catalog and picker, callout icons (1.7).
- Top-layer menus, action bar, several files per drop, file cards, `/file` (1.8).
- Host references and resolvers, image block (caption, width, alignment), "+" insert button, file views and previews
  (1.9); host URL patterns and contextual file resolvers (1.13–1.14); file preview options (1.16).
- Collaboration epochs, standalone mode and session saves (1.10–1.12).
- Top bar on phones, accessible and translated (1.15); read-only parity with the server render (1.17).
- Explicit and stable heading ids, the link picker with sections (1.18).

## Open decisions

Recommended answers are the defaults until the owner decides. D1, D5, D8, D9, D11, D12 and D15 were applied as
recommended in the shipped releases.

| # | Decision | Recommendation |
|---|----------|----------------|
| D2 | Which **embed providers** to allow (iframes need `frame-src` in the host CSP)? | A short host allow-list of video, design and document providers; everything else a link |
| D3 | **Bookmark previews** through a host unfurl endpoint? | Yes, host-side with private-range blocking and a cache; links otherwise |
| D4 | **Columns** as a dialect extension (`::::columns`)? | Yes, 2–4 columns, stacked in print and exports |
| D6 | **Reusable sections**: read-only transclusion or a gap? | Read-only `::include` resolved per viewer, no shared editing |
| D7 | **Copy link to any block** or headings only? | Headings only; revisit after the TOC block |
| D10 | **AI assistance** at all, and through what? | Opt-in host endpoint only; never browser providers |
| D13 | **Suggested edits** in scope? | Yes, later, as per-block proposals; no character-level tracking |
| D14 | Definition lists | A gap unless a host asks |
| D16 | **Slash menu trigger after a space** (may surprise people typing paths such as `a /b`)? | Yes, closed by a second space or Escape, opt-out per profile |

## Links

- [Baseline spec](../specs/001-baseline/spec.md) · [Architecture](ARCHITECTURE.md) · [Configuration](CONFIGURATION.md)
  · [Usage](USAGE.md) · [Security](SECURITY.md) · [Changelog](CHANGELOG.md)
- [WikiBundle roadmap](https://github.com/nowo-tech/WikiBundle/blob/main/docs/ROADMAP.md)
- Milkdown: [milkdown.dev](https://milkdown.dev/), [releases](https://github.com/Milkdown/milkdown/releases)
- WAI-ARIA APG: [menu](https://www.w3.org/WAI/ARIA/apg/patterns/menubar/),
  [combobox](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/),
  [grid](https://www.w3.org/WAI/ARIA/apg/patterns/grid/), [dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
