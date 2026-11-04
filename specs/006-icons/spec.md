# Feature specification: Icons (UI icons, Tabler catalog, icon picker, callout icons)

**Feature branch**: `feat/icons`  
**Created**: 2026-11-04  
**Status**: Implemented (1.7.0, unreleased)  
**Origin**: owner request (Notion-style icons), contract reviewed by Beacon (2026-11-04). Numbered 006: 005 is left
to the concurrent 1.6 work.

## Summary

Decorative icons next to every UI action (`menu_icons`, `toolbar_icons`, on), the Tabler outline catalog
(`icon_catalog`, opt-in) with a searchable, keyboard-accessible icon picker, and a callout icon (Tabler or emoji)
stored in the Markdown.

## User scenarios

### US-01 — Icons next to actions (P1)

**Given** the defaults, **when** the author opens the context menu, the block menu, the `/` menu or looks at the action
bar, **then** each item shows a glyph before its label. Screen readers announce only the label.

### US-02 — Insert any Tabler icon (P1)

**Given** `icons` or `icon_catalog`, **when** the author picks *Insert → Icon…*, `/icon`, *Insert icon* or *Browse all
icons…* in the `:` list, **then** a picker opens with a search field; the chosen icon is inserted inline at the caret,
in the same paragraph.

### US-03 — Callout icon (P1)

**When** the author uses the callout's icon button, **then** a picker with *Icons* and *Emoji* tabs and *No icon* sets,
changes or removes `icon="…"` on the callout; read pages show it as a decorative icon.

## Requirements

- **FR-ICON-001**: glyphs are DOM-built inline SVG, `aria-hidden="true"`, `focusable="false"`, no inline style, no
  fetch; colours and size from tokens; `menu_icons` / `toolbar_icons` turn them off.
- **FR-ICON-002**: `icon_catalog` ships Tabler Icons 3.50.0 outline (MIT) as sprite shards by first character and a
  names list; the editor loads names and keywords as a lazy chunk; allowlisted names keep the host sprite.
- **FR-ICON-003**: the picker follows the APG combobox + listbox pattern (Up / Down, Page Up / Down, Enter, Escape),
  renders at most 60 options and announces the count politely.
- **FR-ICON-004**: every entry point inserts inline at the caret (fixes the 1.5 *Insert → Icon* new-paragraph bug);
  only a caret where inline nodes cannot go gets a paragraph after its block.
- **FR-ICON-005**: `:::callout{icon="NAME"}` (Tabler) or `{icon="EMOJI"}`: Extended_Pictographic emoji, flags or
  keycaps (skin tones, VS16, ZWJ sequences), at most 8 code points and 64 bytes, checked linearly with the same table
  in TS and PHP (audit DY-M1 / DY-I1); unresolved values stay in the Markdown and are not drawn; without `icon`
  nothing changes.
- **FR-ICON-006**: the PHP renderer escapes everything; an emoji icon is drawn by CSS from `data-emoji`, so the HTML
  text of a callout is its body only; no emoji images.
- **FR-BC-001**: `:tabler-NAME:` round-trips unchanged; the widget JSON options of default fields are unchanged (keys
  only when not default); `icon_catalog` off renders exactly as 1.5.

## Security

- Sprite shards are generated at build time from path data only (`d` attributes matching a numeric path grammar).
- `<use href>` targets are same-origin bundle files or the host sprite; names are validated before use.
- Callout icon values never reach the DOM as markup: Tabler names are validated, emoji go through `textContent` /
  escaped attributes.
