# Feature specification: menus in the top layer, optional action-bar insert buttons, file drop and file cards

**Feature branch**: `feat/menu-top-layer-file-drop`  
**Created**: 2026-11-06  
**Status**: Implemented (1.8, unreleased)  
**Origin**: Beacon request `docs/ops/BUNDLES-REQUESTS/2026-11-06-milkdown-menu-layer-and-file-drop.md` (ME-1 … ME-4);
the WikiBundle part (page files list, purge hook) is in WikiBundle.

## User scenarios

### US-01 — Menus are always on top (P1, ME-1)

**Given** the editor inside a transformed ancestor, under a sticky header with `z-index: 100` or in a modal
`<dialog>`, **when** the author right-clicks (or presses Shift+F10), **then** the menu and its submenus are fully
visible, on top of everything, at the pointer; keyboard, type-ahead and focus return are unchanged.

### US-02 — No duplicate insert buttons (P2, ME-2)

**Given** `action_bar_insert: []`, **then** the action bar shows neither *Insert file* nor *Insert icon*; `/file`,
`/icon`, the context menu *Insert* group and drop / paste still work.

### US-03 — Drop several files like Notion (P1, ME-3)

**When** the author drops a PNG, a PDF and a CSV at once, **then** each shows a placeholder with its progress at the
drop point and they land in order as one image and two file cards; after saving and reloading the same cards are shown
and the read page renders them. A refused file leaves a dismissible notice. `/file` is the keyboard path.

## Requirements

- **FR-LAYER-001**: menus, submenus, the block menu, the `/` and suggestion lists and the icon picker use
  `popover="manual"` and `showPopover()` / `hidePopover()`, stay children of the widget (tokens inherit), are placed in
  viewport coordinates through CSSOM and keep their own dismissal and focus handling.
- **FR-LAYER-002**: without the Popover API the popup is appended to `<body>` (or the open modal dialog around the
  editor) with the computed `--nowo-milkdown-*` tokens copied through `style.setProperty()`.
- **FR-BAR-001**: `action_bar_insert` (profile and form option): list of `file` / `icon`, default both, `[]` hides
  both; sent in the widget JSON only when not the default.
- **FR-DROP-001**: drop / paste of N files: N placeholders (decorations) at the drop point, sequential uploads, nodes
  inserted in drop order; errors replace the placeholder with a dismissible notice; nothing is inserted (and a hint is
  announced) on read-only editors or without `upload_url`; HTML with files keeps the normal paste.
- **FR-DROP-002**: upload answer `{url, name?, size?, type?, kind?: image|file, alt?}`; `kind` (else legacy `image`)
  decides the node; only an answer with neither uses the browser's guess. 415 → type error.
- **FR-DROP-003**: `upload_accept_images` / `upload_accept_files`; BC: empty lists keep `upload_accept` as is.
- **FR-CARD-001**: `file_cards`: non-image uploads become `::file[name]{href size type}`; the editor and the PHP renderer
  draw the same card (badge, name, size; category and size text from a shared fixture); a host directive renderer that
  supports `file` wins in PHP.
- **FR-SEC-001**: names lose control / bidi / isolate characters and brackets (≤ 200 chars); links pass `safeUrl()`
  (relative or http(s), also with `allow_unsafe_links`), quotes and brackets are percent-encoded; no link when unsafe.

## Tests

- Vitest: `layer.test.ts` (popover path, fallback to body / dialog, token copy, placement, menus, picker),
  `file-drop.test.ts` (3 files in order, links without `file_cards`, notices, paste, read-only / no upload, `/file`,
  `action_bar_insert`, fixture), `upload.test.ts` (answer parsing, names, hrefs).
- PHPUnit: `FileCardTest` (fixture, escaping, unsafe links, host override), configuration and form type tests.
- Playwright (demo): `layers.spec.ts` (transformed, sticky header, dialog: on top, at the pointer, keyboard, axe, CSP;
  `action_bar_insert: []`), `files.spec.ts` (PNG + PDF + CSV, save, reload, read side; refused type; `/file`).
