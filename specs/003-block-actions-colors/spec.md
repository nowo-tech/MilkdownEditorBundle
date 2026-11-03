# Feature specification: Block actions and colours

**Feature branch**: `feat/block-menu`  
**Created**: 2026-11-03  
**Status**: Implemented (1.3.0, unreleased)  
**Origin**: [ROADMAP](../../docs/ROADMAP.md) milestone 1.3; user decisions 2026-11-03 (block menu with text colour in
scope, colours as in Notion).

## Summary

Opt-in Notion-style block actions (`block_actions`, `block_drag`) and named text / background colours (`colors`) that
round trip through Markdown and render in PHP as token classes.

## User scenarios

### US-01 — Block menu (P1)

**Given** `block_actions`, **when** the author hovers a block or puts the caret in it, **then** a named "⋮⋮" button
appears; a click or **Ctrl / ⌘ + /** opens the block menu (Turn into, Color, Duplicate, Move up / down, Delete).

### US-02 — Move without dragging (P1)

**Given** the caret in a block, **when** the author presses **Alt+Shift+↑ / ↓**, **then** the block moves one place and
the live region says so (or that it is already first / last). With `block_drag` the button can also be dragged.

### US-03 — Colours (P1)

**Given** `colors`, **when** the author picks a colour for a selection or a block (block menu, context menu, toolbar),
**then** the Markdown gets `:mark[…]{text=… bg=…}` or `::: {text=… bg=…}` and the PHP render shows the same colour
with classes; *Default* removes it; `:mark{color=…}` of earlier versions stays a background.

## Functional requirements

- **FR-BLOCK-001** Handle: `<button>` named *Block actions*, `aria-haspopup="menu"`, `aria-expanded`,
  `aria-keyshortcuts`, `tabindex="-1"` (Tab still leaves the editor), placed with CSSOM; block menu on the shared APG
  menu component; Ctrl / ⌘ + / and Alt+Shift+arrows (not inside CodeMirror); `block_drag` needs `block_actions`
  (validated in PHP config, form options and the browser).
- **FR-COLOR-001** Palette gray, brown, orange, yellow, green, blue, purple, pink, red (text and background) + default;
  inline: one `:mark` per selection keeping the other colour, removed when no colour is left; block: the nameless
  container (`align`) gains / loses `text` / `bg`, unwrapped when nothing is left; menu items `menuitemradio` with
  the current colour checked and decorative swatches.
- **FR-COLOR-002** PHP: classes `nowo-md-mark--BG`, `nowo-md-text--TEXT`, `nowo-md-bg--BG` only for names in
  `markdown.mark_colors` (default nine names); no inline styles; unknown names drop the colour.
- **FR-COLOR-003** Tokens `--nowo-milkdown-color-NAME` (text) and `--nowo-milkdown-mark-NAME` (background) with WCAG AA
  contrast (≥ 4.5:1) on background and surface in light and dark; axe in the demo e2e with coloured content.
- **FR-BC-001** Fields without the new features render the same widget JSON (strings only sent with the feature);
  documents without the new attributes render as before.

## Success criteria

- **SC-001** Vitest: dialect round trip, commands, handle, keys, drag, menus; PHP coverage 100 %.
- **SC-002** Demo e2e: axe 0 serious with the block menu and the Color submenu open (light / dark runs cover coloured
  content), keyboard flow, 0 CSP violations, colours in the PHP render.

## Non-goals

- Copy link to block / heading (heading anchors, next 1.3 PR), Comment (1.4), colour combinations contrast-checked,
  arbitrary CSS colours.
