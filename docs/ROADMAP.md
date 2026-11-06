# Roadmap

Feature roadmap of the Milkdown Editor Bundle after **1.2.0** (2026-11-02), written on 2026-11-03. It is a plan, not a
commitment: every item becomes a Spec Kit feature (`specs/NNN-*`) with its own spec, tasks and tests before it is
built, and versions may move.

**Goal.** The editor of a wiki that is as close as possible to **Notion** and **Outline**, while keeping what the
bundle is built on: **Markdown is the source of truth**, the PHP renderer, exports and search read the same dialect as
the editor, the editor is accessible (WCAG 2.1 AA, 2.2 where cheap) and works under a strict nonce CSP. The knowledge-base side
(page tree, trash, history, search, permissions, databases) is planned in the
[WikiBundle roadmap](https://github.com/nowo-tech/WikiBundle/blob/main/docs/ROADMAP.md); task ids (T0xx) refer to
symfony-beacon `specs/178-wiki/tasks.md`.

## Table of contents

- [Ground rules](#ground-rules)
- [Where we are (1.2.0)](#where-we-are-120)
- [Upstream: Milkdown 7.23 and what we do not use yet](#upstream-milkdown-723-and-what-we-do-not-use-yet)
- [Notion / Outline parity matrix](#notion--outline-parity-matrix)
  - [Parity summary](#parity-summary)
  - [Notion features that fight Markdown](#notion-features-that-fight-markdown)
- [Milestones](#milestones)
  - [Progress](#progress)
  - [Shipped versus planned (2026-11-06)](#shipped-versus-planned-2026-11-06)
- [Feature assessments](#feature-assessments)
  - [Context menu (right click)](#context-menu-right-click)
  - [Block actions, block handle and drag and drop](#block-actions-block-handle-and-drag-and-drop)
  - [Slash menu, insert button, templates and shortcut help](#slash-menu-insert-button-templates-and-shortcut-help)
  - [Headings: anchors, copy link, TOC and outline panel](#headings-anchors-copy-link-toc-and-outline-panel)
  - [Tables](#tables)
  - [Images](#images)
  - [Embeds and bookmarks](#embeds-and-bookmarks)
  - [Footnotes, definition lists, dates and tasks](#footnotes-definition-lists-dates-and-tasks)
  - [Text and background colour](#text-and-background-colour)
  - [Columns and synced blocks](#columns-and-synced-blocks)
  - [Database block](#database-block)
  - [Version view and diff](#version-view-and-diff)
  - [Emoji picker](#emoji-picker)
  - [Inline comments](#inline-comments)
  - [Suggestions and track changes](#suggestions-and-track-changes)
  - [Collaboration polish and version diff](#collaboration-polish-and-version-diff)
  - [Paste handling](#paste-handling)
  - [Find and replace, counts and reading time](#find-and-replace-counts-and-reading-time)
  - [Source view, focus mode, typewriter scrolling, spellcheck](#source-view-focus-mode-typewriter-scrolling-spellcheck)
  - [AI assistance hooks](#ai-assistance-hooks)
  - [Cross-cutting: accessibility, i18n, performance, print](#cross-cutting-accessibility-i18n-performance-print)
- [Proposed (not yet requested)](#proposed-not-yet-requested)
- [Open decisions](#open-decisions)
- [WikiBundle and host companion roadmap](#wikibundle-and-host-companion-roadmap)
- [Links](#links)

## Ground rules

1. **Backward compatible.** Every new capability is a new value of the profile / field `features` list (or a new
   option with a neutral default). Existing profiles render exactly as today until a host opts in. A 2.0 is only
   planned for an upstream break (Milkdown 8) or a change of defaults, never for a feature.
2. **Dialect first.** A feature that changes what is stored ships the TypeScript parse / stringify, the PHP parser /
   renderer, the reference extraction and round-trip tests in the same release. Anything the PHP renderer does not
   understand must still render as readable, escaped text.
3. **Nothing remote by default.** No CDN images, no third-party scripts, no iframes unless a host allow-lists them;
   remote fetches (link previews) happen on the host, never in the bundle's PHP.
4. **Keyboard parity.** Every pointer interaction (right click, drag, hover button) has a keyboard path and an ARIA
   pattern; WCAG 2.2 *Dragging movements* (2.5.7) is met by a non-drag alternative.
5. **Lazy by default.** New UI loads in its own chunk when its feature is enabled; the up-front budget stays
   **400 kB gzip** (today 269 kB: entry and static chunks) and each milestone may add at most **15 kB gzip** up front.
6. **Bundle vs host.** The bundle ships editor UI, the dialect, renderer hooks and JS / PHP extension points. Storage,
   permissions, notifications, page trees and remote fetches belong to the host or to WikiBundle.

## Where we are (1.2.0)

- Crepe features used: `toolbar`, `top_bar`, `link_tooltip`, `table`, `code_mirror` (language picker, copy button),
  `latex`, `placeholder`, `cursor`. Not used: `block-edit` (block handle, Crepe's slash menu), `image-block`,
  `list-item`, `ai`, and the `@milkdown/plugin-emoji` plugin.
- Own features: the `/` block menu (16 block types, filtered by id / label, only at the start of an empty
  paragraph, first 10 results), `[[` / `@` / `:` suggestions, dialect nodes (page links, mentions, Tabler icons,
  callouts, details, alignment, highlights, host leaf directives), uploads, Mermaid and KaTeX with hardened filters,
  Yjs collaboration over Mercure (cursors with names and colours, state log, compaction).
- PHP renderer: CommonMark + GFM + the dialect. **Gap found while writing this roadmap:** the editor's GFM preset
  (from Crepe) parses footnotes (`[^1]` / `[^1]: …`) but the PHP renderer does not enable league/commonmark's
  `FootnoteExtension`, so footnotes written in the editor render as literal text on read pages. Fixed in 1.2.1 (PR #11).

## Upstream: Milkdown 7.23 and what we do not use yet

The bundle pins `@milkdown/crepe`, `@milkdown/kit` and `@milkdown/plugin-collab` **7.23.0**, the latest release
(2026-10-27). There is no upgrade to wait for; these upstream pieces are available and unused:

| Upstream piece | Since | Use in this roadmap |
|----------------|-------|---------------------|
| `@milkdown/plugin-block` (`BlockProvider`) | 7.x | Positioning of our own block actions button (1.3); Crepe's `block-edit` UI itself stays off |
| Drop indicator plugin | 7.16 | Drop line while dragging blocks (1.3, if drag is enabled) |
| `$pasteRule` | 7.17 | Smart link paste (1.7) |
| Upload plugin integrated in Crepe, `image-block` `maxWidth` / `maxHeight`, `onImageLoadError` | 7.19–7.20 | Reference for our own image block (1.4); Crepe's `image-block` stays off (alt rewriting, remote loads) |
| `@milkdown/plugin-diff` (per-block diff, LCS matching, apply / reject) | 7.21 | Version diff view (1.4), suggestion mode (1.8) |
| `@milkdown/plugin-streaming` (insert-at-cursor, replace-selection) | 7.21 | AI hooks (1.8), host-provided streams only |
| Crepe `ai` feature (OpenAI / Anthropic providers in the browser) | 7.21 | **Not used**: keys and prompts must not live in the browser |
| Toolbar accessible names, shortcuts derived from keymaps, `--crepe-base-font-size` | 7.22 | Audit our toolbar against them (1.3); shortcut help dialog reads the same keymaps |
| Slash menu root / floating options | 7.22 | Not needed (own menu) |
| Extensible block container types (`preset-commonmark`) | 7.22.2 | Figure / columns containers (1.5, 1.8) |
| Code block theme switch at runtime | 7.23 | Follow `theme: auto` changes without reload (1.3) |
| `prosemirror-search` (ProseMirror, not Milkdown) | — | Find and replace (1.7) |

## Notion / Outline parity matrix

Status: **Yes**, **Partial**, **No**. *Owner* says who builds the missing part: **E** = this bundle (editor +
dialect + renderer), **W** = WikiBundle, **H** = host (symfony-beacon), with the spec 178 task when one exists.

| # | Feature | Notion | Outline | Milkdown upstream | Us (1.2) | Owner | Target |
|---|---------|--------|---------|-------------------|----------|-------|--------|
| 1 | Block handle with drag reordering | Yes | Yes | Crepe `block-edit` (mouse only) | No | E | 1.3 (decision D1) |
| 2 | "⋮⋮" block menu: turn into, duplicate, delete, copy link, move, comment, colour | Yes | Partial | No (handle only) | No | E | **1.3** |
| 3 | Right-click / context menu | Yes | Partial (browser menu + toolbar) | No | No | E (+ H items) | **1.3** |
| 4 | Slash menu with every block type | Yes | Yes | Crepe `block-edit` slash menu | Partial (16 types) | E | 1.3, grows each milestone |
| 5 | Outline-style `/` menu with search, groups, keywords | Yes | Yes | Partial | Partial (filter, line start only, 10 rows) | E | 1.3 |
| 6 | Inline "+" button on empty lines | Yes | Yes | Crepe `block-edit` | No | E | 1.3 |
| 7 | Toggle / details | Yes | Yes | No | **Yes** (`:::details`) | — | — |
| 8 | Callouts | Yes | Yes (notices) | No | **Yes** (`:::callout`) | — | — |
| 9 | Columns and layout | Yes | No | No | No (alignment only) | E | 1.8 (decision D4) |
| 10 | Synced blocks | Yes | No | No | No | E + W | Deliberate gap; read-only transclusion 1.8 (D6) |
| 11 | Page mentions / links by id | Yes | Yes | No | **Yes** (`[[wiki:…]]`, per-viewer titles) | — | — |
| 12 | Backlinks | Yes | Yes | No | Partial (WikiBundle reference extractor) | W + H (T050, T059) | Wiki |
| 13 | `@`-date and `@`-reminder | Yes | Partial (`/date`) | No | No | E (date), H (reminder) | 1.7 |
| 14 | Inline comments (anchored threads, replies, reactions, resolve) | Yes | Yes | No | No | E (anchors, thread UI) + W (T064) | **1.4** |
| 15 | Suggestions / track changes | Yes | No | `plugin-diff` (building block) | No | E + W | 1.8 (decision D13) |
| 16 | Inline emoji | Yes | Yes | `plugin-emoji` (CDN images) | Partial (40-emoji list on `:`) | E | 1.5 |
| 17 | Page icons and covers | Yes | Icon only | No | No | W + H (T063) | Wiki |
| 18 | Tables (alignment, header, resize, toolbar) | Yes | Yes | Crepe `table` (handles, add / move / delete) | Partial | E | 1.5 |
| 19 | Embeds and bookmarks with link previews | Yes | Yes | No | No (host leaf directives exist) | E (directives) + H (unfurl) | 1.5 (D2, D3) |
| 20 | Images with caption, resize, alignment | Yes | Yes | Crepe `image-block` | Partial (inline image, upload, alt) | E + H (spec 183) | 1.5 (D9) |
| 21 | Math | Yes | Yes | Crepe `latex` | **Yes** | — | — |
| 22 | Mermaid | Yes | Yes | No (preview hook) | **Yes** (hardened) | — | — |
| 23 | Code blocks: language picker, copy | Yes | Yes | Crepe `code-mirror` | **Yes** | — | — |
| 24 | TOC block | Yes | Yes (sidebar) | No | No | E (block) + W (sidebar, T051) | 1.7 |
| 25 | Heading anchors and copy link | Yes | Yes | No | No | E | **1.3** |
| 26 | Find and replace | Partial (find) | Yes | No (`prosemirror-search`) | No (browser find only) | E | 1.7 |
| 27 | Markdown shortcuts | Yes | Yes | Yes (input rules) | **Yes** | — | — |
| 28 | Paste (Markdown, HTML, Word / Docs, smart links) | Yes | Yes | Partial (clipboard plugin) | Partial (Markdown / HTML via schema) | E | 1.7 |
| 29 | Page templates (picker, template button, variables) | Yes | Yes | No | No | E (picker, chips) + W (templates, T069) | **1.5** |
| 30 | Multi-cursor presence (avatars, follow) | Yes | Yes | `plugin-collab` | Partial (cursors with names) | E | 1.4 |
| 31 | Version history: view a version, diff | Yes | Yes | `plugin-diff` | Partial (WikiBundle line diff, not in the editor) | E + W | 1.4 |
| 32 | Keyboard-first navigation (move blocks, menus) | Yes | Yes | Partial | Partial (Tab leaves, combobox keys) | E | 1.3 |
| 33 | Floating formatting toolbar (Outline style) | Yes | Yes | Crepe `toolbar` | **Yes** | — | — |
| 34 | Text and background colour (inline and whole block) | Yes | Highlight only | No | Partial (`:mark` highlight, 6 colours) | E | **1.3** |
| 35 | Database block (inline / linked views, cell editing) | Yes | No | No | No | E + W (databases) | 1.6 |
| 36 | Trash, page tree, search, permissions, public links | Yes | Yes | — | See the WikiBundle roadmap | W | Wiki 1.14–1.20 |

### Parity summary

Rows 1–35 are editor rows (row 36 points to the WikiBundle roadmap). Counting **Yes = 1** and **Partial = ½**:
8 Yes and 11 Partial, **13.5 / 35 ≈ 39 %** today. About 85 % of the missing points are editor-bundle work, the rest
WikiBundle / host (backlinks, page icons, databases). After each milestone, with the recommended answers to the open
decisions:

| After | Parity | Mainly closes |
|-------|--------|---------------|
| 1.2 (today) | ≈ 39 % | — |
| 1.3 | ≈ 59 % | rows 1–6, 25, 32, 34 |
| 1.4 | ≈ 64 % | rows 14, 30, 31 |
| 1.5 | ≈ 74 % | rows 16, 18–20, 29 |
| 1.6 | ≈ 77 % | row 35 |
| 1.7 | ≈ 87 % | rows 13, 24, 26, 28 |
| 1.8 | ≈ 94 % | rows 9, 15 (10 stays partial by design) |

**Biggest gaps** (most visible for a Notion / Outline user): (1) block actions — handle, "⋮⋮" menu with colour, "+",
right click, moving blocks; (2) inline comments; (3) templates; (4) images with caption, size and alignment, and
embeds / bookmarks; (5) headings with anchors and copy link, TOC and find / replace.

### Notion features that fight Markdown

| Notion feature | Problem | Proposal |
|----------------|---------|----------|
| Synced blocks | One block edited in many pages: Markdown has no shared nodes; permissions differ per page | **Deliberate gap** for editing. Offer a read-only **transclusion** leaf directive `::include{page=<uuid> heading=<slug>}`, resolved per viewer by WikiBundle (like page links), edited at the source |
| True columns | No Markdown construct; exports and search must still read top to bottom | **Dialect extension** (if D4 = yes): `::::columns` with nested `:::column` containers; renders as a CSS grid that collapses to one column on narrow screens and in print / exports |
| Coloured text and backgrounds | No Markdown construct | **Dialect extension, in scope (user decision 2026-11-03):** `text=` / `bg=` on `:mark`, `::: {text=… bg=…}` for whole blocks, named colours only (see [Text and background colour](#text-and-background-colour)) |
| Copy link to any block | Markdown blocks have no ids | Headings get stable slugs (1.3). Block ids for other blocks only with D7 = yes (`{#id}` attribute) |
| Column widths in tables, merged cells | GFM tables have neither | **Deliberate gap** (see [Tables](#tables)) |
| Database views | Not a document feature | Out of scope for the editor; host / WikiBundle |

## Milestones

Ordered so the most visible Notion / Outline gaps come first; each milestone still ships with the dialect in PHP and
TypeScript, axe and CSP e2e, and a security note in [SECURITY.md](SECURITY.md).

| Version | Theme | Features (all opt-in through `features`) | Effort |
|---------|-------|-------------------------------------------|--------|
| **1.3** | Blocks feel like Notion | `context_menu` (right click, Shift+F10, ContextMenu key); `block_actions` (keyboard-accessible "⋮⋮" button and block menu: turn into, duplicate, delete, copy link, move up / down, comment, **colour**; Alt+Shift+↑ / ↓); `insert_button` ("+" on empty lines); optional pointer drag (`block_drag`, D1); **text and background colour** (inline and whole block, named palette, dialect + PHP); slash menu v2 (anywhere after a space, groups, keywords, scrolling list, every block type); `shortcut_help` dialog; `editor.commands` API for the host palette (T066); heading anchors + *Copy link* (TS and PHP, same slugs); footnote rendering fix in PHP; toolbar a11y audit vs Crepe 7.22; runtime code theme switch | L |
| **1.4** | Comments and history | `comments`: selection → comment API, anchor resolution (Yjs relative positions + text quote), highlight decorations, optional thread component, events (T064, with WikiBundle 1.16); page-level comment hooks; `version_view` read-only mode and `diff` component (`plugin-diff`, with WikiBundle 1.15); presence avatars, follow user, offline indicator | L |
| **1.5** | Templates, media and tables | Template picker, slash *Template* group, "template button" block, variable chips (with WikiBundle 1.17); `image_block` (caption, alt editor, width, alignment, lightbox), image source resolver for host schemes (spec 183); table toolbar; `embed` / `bookmark` directives (D2, D3); full emoji picker (T063 reuse); print styles | L |
| **1.6** | Database block | `::database{id view}` block: inline / linked views of WikiBundle databases, cell editing, view switcher (with WikiBundle 1.19) | L |
| **1.7** | Writing and navigation tools | `find_replace`; `toc` block + outline panel; counts and reading time; Markdown source toggle / split view; focus mode, typewriter scrolling, `lang` / spellcheck; paste cleanup and smart link paste; `:date[…]`; task due dates and assignees | L |
| **1.8** | Layout and review | Columns (D4), read-only transclusion (D6), suggestion mode / track changes (D13), AI assistance hooks (D10) | L |
| **2.0** | Upstream break only | Milkdown 8 migration, removal of deprecated options, possibly new default features | — |

Recommended order inside 1.3: footnote fix (S, a correctness bug) → heading anchors → shared menu component →
context menu → block actions → colour (dialect, PHP, toolbar, block menu) → slash menu v2 and "+" → shortcut help →
drag (if D1).

### Progress

Ticked when the PR is open and green; the version is the one the change ships in. Defaults taken for open decisions
are marked *default pending user confirmation*.

- [x] Footnote rendering fix (`markdown.footnotes`) — 1.2.1, PR #11
- [x] Mention names for apps without user names (`mention_display: name`, Beacon request) — 1.2.1, PR #11
- [x] Context menu (`context_menu`: right click, Shift+F10, ContextMenu key, host items) — 1.3, PR #10. D11 (*Paste*
  kept, disabled with a hint) and D12 (native menu on touch): *default pending user confirmation*.
- [x] Block handle and "⋮⋮" block menu (`block_actions`), Alt+Shift+↑/↓, Ctrl+/, drag (`block_drag`; D1 default
  *pending user confirmation*: opt-in) and text / background colours (`colors`; D5 syntax as recommended) — 1.4,
  PR #13
- [x] Markdown clipboard (`markdown_clipboard`: smart paste, Paste / Copy as Markdown), *Insert* group of the context
  menu (`insert_menu`) and the read-view "Copy as Markdown" button (owner requests, Beacon) — 1.5, PR #14
- [x] Collaboration request rate (coalesced updates, throttled presence, 429 backoff; Beacon audit High), submenu
  flip at the right edge, transient copy status, icon variants of `nowo_milkdown_copy_markdown()` — 1.5.1 patch
- [x] Comments (`comments`: anchors v1, highlights, orphans, anchor refresh, next / previous, thread component,
  `CommentAnchor`), `version_view`, rendered diff (`MarkdownDiffRendererInterface`, `nowo_milkdown_diff()`),
  `nowo_milkdown_view()` and heading ids (`heading_ids`, `markdown.heading_ids`) — 1.6 (the roadmap's "1.4 Comments and
  history" row). Host contract agreed with WikiBundle 1.15 / 1.16 (contract v1.2). Presence avatars / follow user
  moved to 1.6.x.
- [x] Icons (owner request): decorative icons in menus, `/` and the action bar (`menu_icons`, `toolbar_icons`, on), the
  Tabler outline catalog (`icon_catalog`, opt-in) with a searchable icon picker, and the **callout icon picker**
  (`:::callout{icon=…}`, Tabler or emoji) — 1.7, PR #17
- [x] Beacon request 2026-11-06: menus in the top layer (`popover="manual"`, fallback without the Popover API),
  `action_bar_insert`, drop / paste of several files with per-file placeholders, `file_cards`
  (`::file[name]{href size type}`, TS + PHP), upload answer `{url, name, size, type, kind}`,
  `upload_accept_images` / `upload_accept_files`, `/file` — 1.8 (unreleased), PR #19

### Shipped versus planned (2026-11-06)

The version numbers of the milestone table above are the plan of 2026-11-03; releases followed the owner's and
Beacon's requests instead, so the numbers no longer match:

| Release | Shipped | Roadmap row it came from |
|---------|---------|--------------------------|
| 1.3.0 | `context_menu` | 1.3 |
| 1.4.0 | `block_actions`, `block_drag`, `colors` | 1.3 |
| 1.5.0 / 1.5.1 | `markdown_clipboard`, `insert_menu`, read-view *Copy as Markdown* | owner requests (not in the table) |
| 1.6.0 | `comments`, `version_view`, diff, `heading_ids` | 1.4 |
| 1.7.0 | `menu_icons`, `toolbar_icons`, `icon_catalog`, icon picker, callout icons | owner request (callout icon picker was a 1.5 proposal) |
| 1.8 (unreleased) | top-layer menus, `action_bar_insert`, file drop and `file_cards` | Beacon request 2026-11-06 |

Still open from the table, in Beacon's order: **`image_block`** (caption, alt, width, alignment, lightbox, image
source resolver — row 1.5), **`toc` / outline panel** and **`find_replace`** (row 1.7) and **`insert_button`** ("+" on
empty lines — row 1.3, never built). Proposed next milestones (*pending owner confirmation*): **1.9** `image_block`
(D9 syntax, resolver for host schemes, spec 183) and `insert_button`; **1.10** `toc` block + `outline_panel` and
`find_replace` (+ `counts`).

## Feature assessments

Each item: **value**, **upstream**, **dialect / renderer**, **security**, **a11y**, **effort**, **dependencies**,
**version**.

### Context menu (right click)

- **Value.** The action the user asked for first: everything a block or selection can do, where the pointer already
  is, without hunting in the toolbar. Notion and Outline users expect it.
- **Upstream.** Nothing in Milkdown or Crepe. Custom, on the bundle's own menu component (shared with block actions
  and the slash menu).
- **Items** (shown when they apply): *Cut*, *Copy*, *Paste*, *Paste as plain text*; *Turn into* (paragraph, H1–H3,
  lists, task list, quote, code, callout, details); inside a table: *Insert row above / below*, *Insert column left /
  right*, *Delete row / column / table*, *Align column*, *Toggle header row*; on a link: *Edit link*, *Open link*,
  *Copy link*, *Remove link*; on a heading: *Copy link to heading*; on a selection: *Comment* (the 1.4 comment
  API, only when the host enabled comments); *Color* (text / background); *Duplicate block*, *Delete block*,
  *Move up / down*; then **host items**.
- **Host-extensible.** JS API `NowoMilkdownEditor.contextMenu.register({ id, label, group, when(ctx), run(ctx) })`
  and a cancellable `nowo-milkdown:contextmenu` DOM event whose `detail.items` the host can edit; profile option
  `context_menu: { items: [...] }` to hide built-in groups. `run` gets a narrow context (selection range, block type,
  Markdown of the selection), not the raw `EditorView`.
- **Clipboard.** *Cut* / *Copy* use `navigator.clipboard.write` with `text/plain` (Markdown) and `text/html`
  (rendered). *Paste* needs `navigator.clipboard.read`, which prompts or is unavailable in some browsers: the item is
  shown disabled with a "use Ctrl+V" hint when the permission is not granted (decision D11 to drop it entirely).
  *Paste as plain text* uses `readText()` and inserts text without Markdown parsing.
- **Native menu.** Shift + right click (and right click inside CodeMirror, inputs and on a selection the browser
  needs for spellcheck suggestions) keeps the browser menu; spellcheck suggestions only exist there.
- **Keyboard and ARIA.** Opens with **Shift+F10** and the **ContextMenu** key at the caret; WAI-ARIA *menu* pattern
  (`role="menu"`, `menuitem`, submenus with `aria-haspopup` / `aria-expanded`, Up / Down / Home / End, Right / Left
  for submenus, type-ahead, Escape closes and returns focus to the caret, disabled items `aria-disabled`); shortcut
  hints with `aria-keyshortcuts`; positioned with floating-ui (already in the bundle) and kept on screen.
- **Mobile.** Android fires `contextmenu` on long-press, but it would hide the native selection handles: on coarse
  pointers the custom menu does **not** replace long-press; the block actions button (below) is the touch path, and
  iOS (no `contextmenu`) works the same way.
- **Dialect / renderer.** None (commands only).
- **Security.** Menu labels from the host are text (`textContent`); host `run` callbacks run in the page anyway.
  Clipboard HTML is generated by our serializer, never from raw input.
- **Effort** M. **Dependencies:** shared menu component, table commands (`@milkdown/kit/preset/gfm`).
  **Version 1.3.**

### Block actions, block handle and drag and drop

- **Why the handle is off today.** Crepe's `block-edit` handle is pointer-only (no focusable control, no keyboard
  move), it brings Crepe's own slash menu (duplicating ours) and its "+" inserts without our dialect blocks.
- **Value.** The most visible Notion / Outline affordance: hover a block, get "⋮⋮" and "+", reorder by dragging.
- **Proposal (accessible first).**
  - `block_actions`: a real `<button>` (named *Block actions for <type>*) positioned with `@milkdown/plugin-block`'s
    `BlockProvider` next to the block under the pointer **or the caret**, so keyboard users get it too; it opens the
    **block menu** (turn into, duplicate, delete, copy link, move up / down, comment, **Color** → text / background,
    see [Text and background colour](#text-and-background-colour)); the context menu shows the same block group.
    Keyboard: **Ctrl+/** (or Ctrl+Alt+/, final key in the spec) opens it for the current block.
  - **Move block**: Alt+Shift+↑ / ↓ moves the current top-level block (and list items inside their list), announced
    in the live region ("Moved below *Heading*"). This is the WCAG 2.5.7 alternative to dragging.
  - `insert_button`: "+" beside empty paragraphs opens the slash menu at that line.
  - `block_drag` (D1): pointer drag of the "⋮⋮" button with the upstream drop indicator; never the only way to move.
- **Tab.** Unchanged: the buttons are not in the editor's tab order (roving: reachable through the shortcut and
  Escape returns to the caret), so **Tab still leaves the editor** (WCAG 2.1.2 promise of 1.0).
- **Collaboration.** Moves are one ProseMirror transaction (delete + insert), which Yjs syncs as such; concurrent
  edits inside a moved block may be lost on the mover's side — the same as Notion; documented.
- **Dialect / renderer.** None.
- **Security.** None beyond the menu.
- **Effort** M (actions + keys), M (drag). **Version 1.3.**

### Slash menu, insert button, templates and shortcut help

- **Slash menu v2 (Outline style).** Opens after `/` at the start of a line **or after a space**; groups (*Basic*,
  *Lists*, *Media*, *Advanced*, *Host*), keywords and aliases (`todo` → task list, `hr` → divider), the full list
  scrollable (not cut at 10), the shortcut shown per row, recent items first. Every block type the profile allows,
  including the ones each milestone adds (image, embed, bookmark, TOC, date, columns) and host blocks from leaf
  directives (`::beacon{type=issue}` for T069 *live blocks*, label and icon from the host's directive config).
  Same listbox / combobox pattern as today (already axe-tested). Upstream: Crepe's slash menu is not used (no
  dialect blocks, different a11y). Effort M, **1.3**, then grows.
- **Command palette (T066).** The `Ctrl / ⌘ + K` palette is a host feature; the bundle exposes
  `editor.commands.list()` / `run(id)` so the host palette can show editor commands. Effort S, **1.3**.
- **Page templates (user request, 1.5).** Template data, variables, permissions and seeds are WikiBundle 1.17. The
  editor part:
  - `editor.insertMarkdown(markdown, { at: 'cursor' | 'replace' })` (parsed with the dialect, within the limits);
  - a **template picker** component (searchable listbox from a host URL, `templates_url`: title, icon,
    description; Markdown fetched on pick) used by the empty-page state, the slash *Template* group and the host;
  - a **template button** block (Notion's): leaf directive `::template-button{template=<uuid> label="…"}` that
    inserts the template at the cursor each time it is activated (a real `<button>`); rendered as nothing (or a
    disabled label) by the PHP renderer outside the editor;
  - a **template editing mode** that shows `{{date}}`, `{{author}}`, … as non-editable chips with a name, so
    variables cannot be half-deleted; substitution happens on the server when a page is created, never in the
    browser.
  - Security: inserted Markdown goes through the same parser as typed text; variable names match
    `[a-z][a-z0-9_.]{0,40}`; nothing executes. Effort M.
- **Shortcut help.** `?`-style dialog (`Ctrl+/` conflicts — final key in the spec, e.g. `Ctrl+Shift+/`) listing
  formatting, block and navigation shortcuts generated from the keymaps (the way Crepe 7.22 derives toolbar
  shortcuts), as a modal `<dialog>` with a table, localised key names, Mac / PC variants. Effort S, **1.3**.

### Headings: anchors, copy link, TOC and outline panel

- **Value.** Deep links into long pages (page links already support `#anchor`), a TOC like Outline's sidebar and
  Notion's TOC block.
- **Upstream.** None.
- **Heading anchors (1.3).** One slug algorithm in TS and PHP (GitHub-style: lowercase, strip punctuation,
  `-` for spaces, `-1`, `-2` for duplicates), golden-tested on both sides with the same fixture file; PHP adds
  `id` to headings (league/commonmark `HeadingPermalinkExtension` configured with our slugger, or our own renderer),
  the editor shows a *Copy link* button on heading hover / focus and in the context menu. Anchors are **not stored**
  in Markdown (derived), so renaming a heading breaks old anchors — the `[[wiki:…#anchor]]` picker should offer
  headings by slug, and WikiBundle may warn on broken anchors. Security: slugs are `[a-z0-9-]` only; ids get a
  prefix (`h-`) to avoid DOM clobbering of globals. Effort S–M.
- **TOC block (1.7).** Leaf directive `::toc{levels=2-3}`; the editor shows a live preview, the PHP renderer builds
  it from the same headings (and exports keep it as a list of links). **Outline panel**: optional side panel
  (`outline_panel` feature) with the heading tree, `nav` landmark and `aria-current`; in the wiki the sidebar TOC
  is WikiBundle (T051). Effort M.

### Tables

- **Value.** Tables are frequent in wikis; Notion / Outline offer alignment, header toggle, resize and a toolbar.
- **Upstream.** Crepe `table` (in use): row / column handles with add, move, delete and column alignment.
- **Proposal (1.5).** A table toolbar / context menu group: insert row / column, delete, alignment (GFM `:---:`
  stores it), **header row toggle** (GFM tables always have a header row: "off" would mean an empty header —
  instead offer *Convert first row to header* only), *Delete table*, *Copy as Markdown / CSV*; keyboard: Tab / Shift+
  Tab between cells (today), Ctrl+Alt+arrows for insert, all announced.
- **Deliberate gaps.** **Column widths** (resize) and **merged cells**: GFM cannot store them; `prosemirror-tables`
  column resizing would be lost on save. Resize is offered only as a view-only "fit / wide" table toggle if wanted
  later. Multi-line cells (lists inside cells) are also not GFM.
- **Dialect / renderer.** None (GFM). **Security** none. **A11y:** header cells `th scope="col"`, the toolbar a
  `toolbar` role with arrow keys. **Effort** M. **Version 1.5.**

### Images

- **Value.** Captions, size and alignment are expected; uploads already exist.
- **Upstream.** Crepe `image-block` (caption, resize, `maxWidth` / `maxHeight`, upload) — kept **off**: it rewrites
  alt text into the caption, loads remote images and its resize handle is pointer-only.
- **Proposal (1.5).** Own `image_block` node:
  - **Syntax (D9, recommended):** `![alt](src "caption")` keeps working everywhere (the title becomes the caption),
    plus an optional attribute block on standalone images `{width=50% align=center}` (width in `%` or px from a
    short list, align left / center / right / full). Other Markdown tools show a plain image and literal braces.
    Alternative: a leaf directive `::image{src=… alt=… width=…}[caption]` (cleaner to parse, worse in other tools).
  - **Editor:** alt text field (required, or *Decorative* which stores `alt=""`), caption field, size presets with
    buttons and keys (not only a drag handle), alignment buttons; the upload flow inserts an image block.
  - **Host schemes (spec 183):** images are stored as `![alt](beacon-file:<uuid>)`. The bundle adds an **image source
    resolver**: `image_url_template` / a JS resolver and a PHP `ImageResolverInterface` (batched like pages) turn a
    host scheme into the viewer's URL, with *not visible* for files the viewer may not read; `safeUrl()` gets an
    allow-list of host schemes instead of dropping them. Width / height from the resolver avoid layout shift.
  - **Lightbox** on read pages (`renderRichContent`): `<dialog>` with the full-size variant, Escape / focus return.
- **Renderer.** PHP renders `<figure><img alt width loading="lazy"><figcaption>`; `allow_remote_images: false` still
  turns remote images into links; exports (WikiBundle) follow spec 183 FR-008.
- **Security.** Only resolver URLs or same-origin / allow-listed sources render as `<img>`; attribute values are
  validated (`width` pattern, enum align); no `style` from Markdown (classes only, CSP-friendly); SVG uploads stay
  excluded (SECURITY.md).
- **Effort** L. **Dependencies:** spec 183 FR-002 / FR-003 on the host. **Version 1.5.**

### Embeds and bookmarks

- **Value.** Notion / Outline paste a URL and offer *Embed* / *Bookmark* / *Link*.
- **Upstream.** None.
- **Proposal (1.5).** Two leaf directives in the existing grammar: `::embed{url=…}` and `::bookmark{url=…}`.
  - **Embeds:** only providers in a host allow-list (D2, e.g. YouTube via `youtube-nocookie.com`, Vimeo, Loom,
    Figma, Miro, Google Docs / Sheets / Slides, CodePen). The bundle owns URL → embed-URL transforms (a fixed regex
    per provider, no oEmbed fetch), renders `<iframe sandbox="allow-scripts allow-same-origin allow-popups"
    referrerpolicy="no-referrer" loading="lazy" title=…>` only on read pages and in the editor preview, and only if
    the provider is allow-listed **and** the host's CSP `frame-src` lists it. Otherwise it renders a link. Exports
    and search always see a link.
  - **Bookmarks:** a card with title, description and favicon from a **host unfurl endpoint** (D3) — the bundle
    never fetches remote URLs (no SSRF in the bundle). The host must block private ranges, redirects to them, non-
    http(s) schemes, large bodies and time out, and cache results. The card's image is proxied by the host or
    omitted (no tracking pixels). Without the endpoint the bookmark renders as a link with its URL.
  - **Paste:** pasting a lone URL offers *Link / Bookmark / Embed* in a small accessible menu (see Paste handling).
- **Renderer.** PHP `EmbedDirectiveRenderer` / `BookmarkDirectiveRenderer` with the same allow-list (config
  `markdown.embeds.providers`), batch unfurl through a host `LinkPreviewResolverInterface`.
- **A11y.** iframes titled ("YouTube video: <title or URL>"), cards are links with a real accessible name.
- **Effort** M–L. **Version 1.5.**

### Footnotes, definition lists, dates and tasks

- **Footnotes (1.3, bug fix).** Editor already parses GFM footnotes (Crepe's GFM preset); enable league/commonmark
  `FootnoteExtension` in the PHP renderer, check ids are prefixed (`fn-`), count them in `max_inline_markers`, add
  round-trip and render tests and a slash item *Footnote*. Effort S.
- **Definition lists (1.8, if ever).** `DescriptionListExtension` exists in league/commonmark, but there is no Milkdown node
  and the syntax (`Term\n: definition`) is not GFM; low value for a wiki. Recommend a **deliberate gap** unless a host
  asks. Effort M.
- **`:date[2026-11-03]` (1.7).** Text directive in the existing grammar; the editor shows a localised chip and an
  accessible date picker (native `<input type="date">` in a popover), `@` suggestions offer *Today*, *Tomorrow*,
  *Next week* like Notion; the PHP renderer prints `<time datetime>` in the viewer's locale. **Reminders** are host
  work (notifications, T068-style). Effort M.
- **Task due dates and assignees (1.7).** Reuse existing dialect inside task items: `- [ ] Ship docs @alice
  :date[2026-11-10]` — no new syntax; the editor shows them as chips, WikiBundle / host may index open tasks with
  assignee and due date (a host feature, like Notion's task database). Effort S in the bundle.

### Text and background colour

User decision (2026-11-03): **in scope**, with the block menu.

- **Value.** Notion's *Color* menu: coloured text and backgrounds for emphasis and visual structure.
- **Palette.** Notion's named set: *default*, gray, brown, orange, yellow, green, blue, purple, pink, red — each as a
  **text** colour and a **background** colour. Tokens `--nowo-milkdown-color-<name>` and
  `--nowo-milkdown-color-<name>-bg` in light and dark (the current `--nowo-milkdown-mark-*` tokens become aliases of
  the matching `-bg` tokens). Never raw CSS values from Markdown.
- **UI.** The block menu (handle and right click) has a *Color* submenu with two groups (*Text*, *Background*) and
  *Default* to clear; it applies to the whole block. The floating toolbar gets the same submenu for inline
  selections. Items are named ("Red text", "Yellow background") with a swatch, never swatches alone; recent colour
  first.
- **Dialect — inline.** `:mark[text]{bg=yellow}` (background) and `:mark[text]{text=red}` (text), combinable
  (`{text=red bg=yellow}`). The existing `:mark[text]{color=yellow}` keeps its current meaning (**background**):
  it is read as `bg=` and written back as `bg=` on the next save (round trip stable after the first save, as the
  dialect already promises). Using `color=` for the text colour, as first suggested, would silently recolour every
  existing highlight, so it is not proposed (D5).
- **Dialect — block.** Reuse the nameless container that already carries alignment (`::: {align=center}`):
  `::: {text=red bg=yellow}` … `:::` around one or more blocks (headings, paragraphs, lists, quotes), combinable with
  `align`. Trailing heading attributes (`## Title {bg=…}`) were rejected: they would show up in heading text and
  slugs in other tools and only cover some block types.
- **Degradation.** Plain Markdown viewers show `:mark[text]{…}` and the `::: {…}` fence lines literally; the text
  stays readable. WikiBundle Markdown exports keep the directives (lossless round trip into the bundle); Notion /
  Outline exports strip them (configurable); HTML and PDF exports keep the classes; search and the plain-text
  extraction strip them, consistently in TS and PHP.
- **Renderer.** PHP emits classes only (`nowo-md-color--red`, `nowo-md-bg--yellow`) after checking each name
  against the allow-list (`markdown.colors`, defaulting to the full palette; `mark_colors` stays as a BC alias);
  unknown names drop the colour, keep the text. No inline styles, so CSP and XSS stay as today.
- **Accessibility.** A contrast test checks every text colour on the page background and every background with the
  default text in both themes (WCAG AA 4.5:1; e2e + a unit test of the token table). Colour is never the only
  carrier of meaning: the docs tell authors to use callouts, icons or words for status, and the editor does not
  announce colours by default (an optional `aria-description` on coloured spans can be enabled).
- **Effort** M. **Version 1.3.**

### Columns and synced blocks

See [Notion features that fight Markdown](#notion-features-that-fight-markdown). If accepted:

- **Columns (D4, 1.8):** `::::columns` / `:::column` containers (2–4 columns), keyboard and menu moves between
  columns, CSS grid collapsing under 40rem and in print; PHP renders `div.nowo-md-columns`; search and exports read
  columns top to bottom. Uses the 7.22.2 extensible block container types. Effort L.
- **Synced blocks (D6, 1.8):** read-only `::include{page=<uuid> heading=<slug>}` resolved per viewer by WikiBundle,
  depth-limited (no recursion), counted in `max_references`. Effort M (bundle) + M (Wiki).

### Database block

User decision (2026-11-03): Notion-style databases are **in scope**; the model, API, permissions and server render
belong to WikiBundle (see its roadmap). The editor part:

- **Dialect.** Leaf directive `::database{id=<uuid> view=<uuid>}` (existing grammar). Nothing of the data is stored in
  the page Markdown; other Markdown tools show the directive line.
- **Editor (`database` feature).** Inline view of a WikiBundle database (table first, board next) fetched from a host
  URL (`database_url`), paged; cell editing (text, number, select, date, checkbox, person) posting to the Wiki API
  with optimistic concurrency; a view switcher; *Open as page*; slash items *Database – inline* (creates one through
  the host) and *Linked view* (picks an existing database). Grid keyboard pattern (ARIA `grid`, arrow keys, Enter to
  edit, Escape to cancel), board with keyboard moves.
- **Renderer.** WikiBundle's `DirectiveRendererInterface` renders the view per viewer, server-side, as an accessible
  table or list; the bundle only routes the directive.
- **Security.** Ids validated as UUIDs; every row and cell from the host is rendered as text; edits carry the CSRF
  header like uploads; permissions are the host's.
- **Effort** L. **Dependencies** WikiBundle 1.19. **Version 1.6.**

### Version view and diff

- **Value.** Notion / Outline history: look at an old version, compare two. WikiBundle 1.15 owns the timeline,
  restore and the server-side rendered diff.
- **Editor.** `version_view`: mount the editor read-only on an old revision's Markdown with a banner (*Viewing the
  version of …*, *Restore*, *Copy to new page* emitted as events); `diff`: a component that renders two Markdown
  versions with `@milkdown/plugin-diff` (per-block, then inline), keyboard navigation between changes, insertions
  and deletions marked with text (not colour only).
- **Security.** Both versions go through the normal parser; page links resolve per viewer as everywhere.
- **Effort** M. **Version 1.4.**

### Emoji picker

- **T063** wants a picker beside page titles; the editor has a 40-emoji offline list on `:`.
- **Upstream** `@milkdown/plugin-emoji` turns `:name:` into Twemoji images from a CDN — **not used** (remote
  images, CSP `img-src`, Markdown stays `:name:` which the PHP renderer would have to map).
- **Proposal (1.5).** A full Unicode emoji dataset (names, keywords, categories, skin tones) in a **lazy chunk**
  (budget ≤ 60 kB gzip), used by the `:` suggestions and by an `emoji_picker` dialog (search field + ARIA grid, arrow
  keys, recent emoji); exported as `NowoMilkdownEditor.emojiPicker(anchor): Promise<string>` so WikiBundle / Beacon
  reuse it for titles (T063). Emoji stay **Unicode text** in Markdown (no dialect change, renders everywhere).
  Locale names from CLDR where small enough, otherwise English keywords plus the 7 locales for categories.
  Effort M. **Version 1.5.**

### Inline comments

User request (T064): a full plan, early. Storage, permissions and notifications are WikiBundle 1.16 (see its
roadmap); the editor part ships in **1.4**.

- **UX (Notion / Outline-like).**
  - Start a comment from the selection toolbar, the context menu, the block menu or **Ctrl / ⌘ + Alt + M**.
  - The anchored text is highlighted; threads appear in a margin / sidebar list with replies, @-mentions, emoji
    reactions, resolve / reopen, edit / delete own and a *Show resolved* filter.
  - Page-level comments (no anchor) use the same thread UI.
- **Bundle (`comments` feature).**
  - **Selection → comment API:** emits `nowo-milkdown:comment-create` with an anchor: Yjs `RelativePosition`s (start,
    end; base64) when collaborating, plus a W3C *TextQuoteSelector* (`exact`, `prefix`, `suffix`) and a block fallback
    (heading slug or block index + offset).
  - **Anchor resolution in the browser:** `editor.comments.set([{ id, anchor, resolved, count }])` resolves relative
    positions first, then quote + context, then the block fallback; a thread whose text is gone is reported as
    **orphaned** (`comment-orphaned` event) and never attached elsewhere. Re-anchoring after the 1.13 log resets /
    compactions uses the quote.
  - **Decorations, not marks:** highlights live outside the document, so Markdown, exports and search never contain
    comments.
  - **Thread component (optional):** a margin list and thread view (replies, reactions, resolve) built on host JSON
    endpoints (WikiBundle's), or hooks only for hosts that render their own sidebar.
  - **Accessibility:** the thread list is a `complementary` region with a name; highlights are focusable through
    *Next / previous comment* shortcuts (Alt+Ctrl+↓ / ↑, final keys in the spec), Enter opens the thread, Escape
    returns to the text; new replies announced politely; the highlight is also marked with an icon / underline, not
    colour only.
  - **Live updates:** thread changes arrive over the 1.13 Mercure infrastructure (ids only); the editor refetches.
- **WikiBundle:** thread / comment / reaction entities, endpoints with a `comment` right, notifications and
  subscriptions, per-viewer mention filtering, trash / purge, exclusion from exports and AI, privacy erasure, counts in
  the tree. **Beacon:** notification channels.
- **Security.** Anchors and ids from the host are validated (base64, length caps); comment bodies are Markdown
  rendered by the safe renderer; size and rate limits on the host.
- **Later:** suggestions / track changes (below, 1.8).
- **Effort** L (bundle M–L). **Dependencies** collaboration for robust anchors, WikiBundle 1.16. **Version 1.4.**

### Suggestions and track changes

- **Value.** Notion's *suggested edits*; Outline has none. High complexity with Markdown + Yjs.
- **Upstream.** `@milkdown/plugin-diff` renders per-block diffs with apply / reject (built for AI suggestions).
- **Proposal (D13, 1.8).** A *suggesting* mode that does not edit the document but produces a proposed Markdown,
  shown with `plugin-diff` to the owner for per-block accept / reject; stored by the host as a pending revision
  (WikiBundle drafts, T055). Character-level tracked changes inside a live Yjs document are a **deliberate gap**.
  Effort L.

### Collaboration polish and version diff

- **Presence (1.4).** Avatar stack of connected users (from awareness: name, colour, optional avatar URL passing
  `safeUrl()`; initials otherwise), **follow user** (scroll to their cursor, stop on own scroll / Escape), colours
  validated `#rrggbb` (as today) and contrast-checked against the theme, a visible **offline / reconnecting**
  indicator (today only a live-region announcement and `data-collab`). A11y: the avatar list is a `list` with names,
  status changes announced once. Effort M.
- **Version diff (1.4).** See [Version view and diff](#version-view-and-diff).

### Paste handling

- **Today.** Markdown text and HTML go through ProseMirror's schema parser; unknown formatting is dropped.
- **Proposal (1.7).**
  - **Word / Google Docs / HTML cleanup:** pre-process the HTML (Docs `b id="docs-internal-guid"` wrappers, Word
    `mso-` lists, `<o:p>`, fake bullets, font-weight spans → strong) before parsing, so lists, headings, tables and
    links survive; images from the clipboard are **uploaded** through the upload hook (data / blob URLs), remote
    images become links unless allowed. Tests with fixture clipboards from Word, Docs, Notion, Outline, Confluence.
  - **Smart link paste** (`$pasteRule`): a URL matching the host's page URL pattern (`page_url_pattern` option or
    a host resolver endpoint) becomes `[[wiki:<uuid>]]`; a URL over a selection becomes a link; a lone URL offers
    *Link / Bookmark / Embed*.
  - **Paste Markdown from Notion / Outline** exports: map `> [!NOTE]` / Outline notices to `:::callout`, toggles to
    `:::details` where detectable.
- **Security.** HTML is never inserted raw; parsed into the schema only; size cap per paste (same as
  `max_input_length`). **Effort** M. **Version 1.7.**

### Find and replace, counts and reading time

- **Find and replace (1.7).** `prosemirror-search` (decorations, regex / case options, replace one / all as one
  transaction): `Ctrl+F` opens the bundle's find bar **only when the editor has focus** (browser find stays
  available outside), `Ctrl+H` / `Ctrl+Alt+F` replace; match count announced ("3 of 12"), Escape returns to the
  caret. Searches the visible text, not the Markdown source, and skips chips' rendered titles (they are not
  content). Effort M.
- **Word / character count and reading time (1.7).** Status line under the editor (`counts` feature), from the
  document text, debounced, `aria-live="off"` with an on-demand announce shortcut; `Intl.Segmenter` for word
  boundaries in all locales. Also exposed as `editor.stats()`. Effort S.

### Source view, focus mode, typewriter scrolling, spellcheck

- **Markdown source toggle / split view (1.7).** A `source` feature switching the surface to a CodeMirror Markdown
  editor (already a lazy chunk) on the same textarea value; split view shows both, synced on idle. With
  collaboration on, source mode is read-only or disabled (Yjs binds to ProseMirror). Value for power users and for
  fixing odd Markdown. Effort M.
- **Focus / zen mode.** Full-viewport `<dialog>`-like mode hiding host chrome, Escape exits; **typewriter scrolling**
  keeps the caret line centred (respects `prefers-reduced-motion`). Effort S.
- **Spellcheck / `lang`.** `lang` option (default: the form locale) on the editable, `spellcheck` on by default and
  off inside code; dialect chips marked `spellcheck="false"`. Effort S, could ship in **1.3**.

### AI assistance hooks

- **Value.** Summarise, rewrite, continue, translate — Notion AI style.
- **Upstream.** Crepe `ai` feature (7.21) with OpenAI / Anthropic **browser** providers and `plugin-streaming` +
  `plugin-diff` for streaming and accept / reject.
- **Proposal (D10, 1.8).** `ai` feature **off by default**, host-provided only: the bundle posts the selection (or
  block) and an action id to a **host endpoint** (CSRF header like uploads) and streams the answer back
  (`plugin-streaming`), showing it as a diff to accept / reject (`plugin-diff`). No API keys, model names or
  prompts in the browser; the host decides provider, retention and which spaces may use AI (WikiBundle already has
  an optional Symfony AI integration and filters hidden pages from AI).
- **Security / privacy.** Prompt injection from document text cannot run tools in the bundle (no tool calls, text
  only); streamed output goes through the Markdown parser (no raw HTML); the UI says content is sent to the host's
  AI provider; per-field opt-in; rate limits on the host. **Effort** M (bundle). **Version 1.8.**

### Cross-cutting: accessibility, i18n, performance, print

- **Accessibility.** One menu component (menu pattern) and one listbox component (combobox pattern) for every
  popup; every milestone adds axe scans with the new UI open (context menu, block menu, find bar, dialogs) in light
  and dark, keyboard-only Playwright journeys (T066 asks for it), and `prefers-reduced-motion`. WCAG 2.2 targets
  for new UI: 2.4.11 *Focus not obscured*, 2.5.7 *Dragging movements*, 2.5.8 *Target size* (24 px).
- **i18n.** Every new string in the 7 locales with the same keys in TS and the `NowoMilkdownEditorBundle` domain;
  key names in shortcut help localised (Ctrl / ⌘, Alt / ⌥); RTL check of menus and the block button (logical CSS
  properties).
- **Performance.** Budget per [Ground rules](#ground-rules); new chunks: `menus` (context + block + help), `image`,
  `embed`, `comments`, `find`, `emoji-data`, `source`, `ai`. Measure with `make bundle-size` in CI; large documents
  (100 KB Markdown) keep < 50 ms per keystroke with decorations on (comments, find).
- **Print styles (1.5).** `@media print` for read pages: no UI chrome, callouts / details expanded, links with URLs
  in print, embeds as links, columns stacked, images within the page width.

## Proposed (not yet requested)

Further features found while writing this roadmap. They are **proposals**: accept or drop each one. Several are
already assessed above; this list gives them a milestone.

| Proposal | Value | Effort | Milestone |
|----------|-------|--------|-----------|
| TOC block `::toc` and outline panel | Outline / Notion TOC inside the page; deep links | M | 1.7 |
| `:date[…]` chips and `@`-date suggestions (reminders by the host) | Notion `@today` / `@remind` | M | 1.7 |
| Bookmarks with link previews (host unfurl) | Rich link cards like Notion / Outline | M | 1.5 |
| Columns (`::::columns`) | Notion layouts; stacked in exports | L | 1.8 |
| Read-only transclusion as a light "synced block" | Reuse one section in many pages | M | 1.8 |
| Mermaid / KaTeX polish: side-by-side source and preview, diagram zoom and full screen, math inline editor with preview | Fewer round trips for technical writers | M | 1.7 |
| Presence: follow user, "jump to" a collaborator | Notion / Outline multiplayer parity | S | 1.4 |
| Offline editing indicator and queued saves when the connection drops | Trust while editing on flaky networks | M | 1.4 |
| AI assistance hooks (host endpoint, diff accept / reject) | Notion AI-style rewrite / summarise, no keys in the browser | M | 1.8 |
| Mobile editing: touch-sized block button, bottom-sheet menus, virtual-keyboard-safe toolbars | Usable on phones | M | 1.5 |
| Print styles of read pages | Clean printing / PDF via the browser | S | 1.5 |
| Callout and toggle polish: ~~callout icon picker~~ (done in 1.7, Tabler or emoji), toggle headings (`:::details` with a heading summary) | Closer to Notion blocks | S | 1.5 |
| Markdown import of Notion / Outline pastes (callouts, toggles) | Smooth migration | S | 1.7 |
| Comments on a whole block or an image (block anchors, no text quote) | Notion comments on images, embeds and databases | S | 1.6.x |
| `@` mentions and emoji picker in the comment composer | Notion / Outline composer parity | S | 1.6.1 |
| Comment count badge in the margin and "Resolve all" for page owners | Outline margin badges; tidy reviews | S | 1.6.x |
| Client-side diff view in the editor (`plugin-diff`, accept / reject per block) | Notion page history "Compare"; base for suggestion mode | M | 1.8 |

## Open decisions

Recommended answers are used as defaults ("default pending user confirmation") until the user decides.

| # | Decision | Recommendation |
|---|----------|----------------|
| D1 | Enable pointer **drag handles** (`block_drag`) in addition to keyboard / menu moves? | Yes, opt-in, in 1.3, only together with Alt+Shift+↑ / ↓ and *Move up / down* |
| D2 | Which **embed providers** to allow (iframes need `frame-src` in the host CSP)? | Start with YouTube (nocookie), Vimeo, Loom, Figma, Google Docs / Sheets / Slides; everything else a link |
| D3 | **Bookmark previews** through a host unfurl endpoint (SSRF surface on the host)? | Yes, host-side with private-range blocking and cache; links otherwise |
| D4 | **Columns** as a dialect extension (`::::columns`)? | Yes in 1.8, 2–4 columns, stacked in print / exports |
| D5 | **Colour syntax**: `:mark{text=… bg=…}` with legacy `color=` read as background, block colour as `::: {text=… bg=…}` | Yes (keeps existing highlights unchanged) |
| D6 | **Synced blocks**: read-only transclusion or deliberate gap? | Read-only `::include` resolved per viewer (WikiBundle), no synced editing |
| D7 | **Copy link to any block** (block ids `{#id}` in Markdown) or headings only? | Headings only; revisit after 1.7 |
| D8 | Inline comments when collaboration is off: text-quote anchors acceptable? | Yes as the fallback; Beacon wiki should run with collaboration on |
| D9 | **Image size / alignment syntax**: `![alt](src "caption"){width=… align=…}` or `::image{…}[caption]`? | The attribute block (degrades best in other Markdown tools and Notion / Outline exports) |
| D10 | **AI hooks** at all, and with which host provider? | Opt-in host endpoint only, 1.8; never Crepe's browser providers |
| D11 | Context menu *Paste* item (clipboard permission prompt) or only *Paste as plain text* / Ctrl+V? | Keep both, disabled with a hint when not permitted |
| D12 | Custom menu on mobile long-press, or native selection menu + block button? | Native long-press + block button |
| D13 | **Suggestion mode** (per-block proposals) in scope? | Yes in 1.8 as proposals reviewed with `plugin-diff`; no character-level tracked changes |
| D14 | Definition lists | Deliberate gap unless a host asks |
| D15 | Ship the optional **comment thread component** in the bundle, or hooks only? | Ship it (hosts may replace it) |

## WikiBundle and host companion roadmap

The knowledge-base side has its own roadmap: [WikiBundle `docs/ROADMAP.md`](https://github.com/nowo-tech/WikiBundle/blob/main/docs/ROADMAP.md)
(page tree, trash, version history, comments storage, templates, search, permissions, public links, databases).
Cross-dependencies:

| WikiBundle | Needs from this bundle | Spec 178 |
|------------|------------------------|----------|
| 1.14 Page tree, icons, emoji titles | Heading slugs + *Copy link* (1.3); emoji picker API (1.5, Wiki can start with a plain picker) | T049, T062, T063 |
| 1.15 Trash and version history | `version_view` and `diff` component (1.4, optional: the Wiki diff is server-side) | T065 |
| 1.16 Inline comments | `comments` anchors, decorations, thread component (1.4) | T064 |
| 1.17 Templates, drafts, review dates | Template picker, template button, variable chips (1.5) | T055, T068, T069 |
| 1.18 Search and palette | Find-next / highlight of search terms (1.7); `editor.commands` (1.3) | T046, T066 |
| 1.19 Databases MVP | `::database` block (1.6) | — |
| 1.20 Permissions and public links | Read-only render (done); per-viewer resolvers (done) | T056 |
| Host (Beacon) live blocks | Leaf directives (done), slash *Host* group (1.3) | T069 |
| Host images on object storage | Image source resolver (1.5) | spec 183 |

## Links

- [Baseline spec](../specs/001-baseline/spec.md) · [Architecture](ARCHITECTURE.md) · [Configuration](CONFIGURATION.md)
  · [Security](SECURITY.md) · [Changelog](CHANGELOG.md)
- Milkdown: [milkdown.dev](https://milkdown.dev/), [releases](https://github.com/Milkdown/milkdown/releases),
  [kit changelog](https://github.com/Milkdown/milkdown/blob/main/packages/kit/CHANGELOG.md)
- WAI-ARIA APG: [menu](https://www.w3.org/WAI/ARIA/apg/patterns/menubar/), [combobox](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/),
  [dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
