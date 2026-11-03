# Feature specification: Context menu

**Feature branch**: `feat/context-menu`  
**Created**: 2026-11-03  
**Status**: Implemented (1.3.0, unreleased)  
**Origin**: [ROADMAP](../../docs/ROADMAP.md) milestone 1.3 (user request 2026-11-03: "menu con click derecho").

## Summary

An opt-in (`context_menu` feature) right-click menu for the editor with clipboard, *Turn into*, table, link and block
actions and host-registered items, reachable from the keyboard (Shift+F10, ContextMenu key) and following the
WAI-ARIA menu pattern.

## User scenarios

### US-01 — Right click (P1)

**Given** a field with `context_menu`, **when** the author right clicks in the text, **then** a menu opens at the
pointer with the actions that apply there (clipboard; link actions in a link; table actions in a cell; block actions),
and the browser menu is not shown.

### US-02 — Keyboard (P1)

**Given** the caret in the editor, **when** the author presses Shift+F10 or the ContextMenu key, **then** the same menu
opens at the caret with focus on its first item; Up / Down / Home / End / type-ahead move, Right opens *Turn into*,
Enter runs an item, Escape or Tab close the menu and focus returns to the caret.

### US-03 — Native menu kept (P2)

**Given** Shift + right click, a right click in a code block or form field, or a touch long-press, **then** the
browser's own menu (spellcheck, selection handles) is used.

### US-04 — Host items (P2)

**Given** a host that registered items or listens to `nowo-milkdown:contextmenu`, **then** its items appear in a last
group (or the menu is changed / cancelled) and receive a narrow context, never the ProseMirror view.

## Functional requirements

- **FR-MENU-001** `context_menu` feature (PHP `Feature::ContextMenu`, TS `Feature`), lazy chunk; groups: clipboard
  (cut, copy via the browser's copy pipeline with a Clipboard API fallback; paste via ProseMirror's paste pipeline;
  paste as plain text without Markdown parsing), link (open with `noopener`, copy address, remove), table (rows,
  columns, delete table), block (turn into, duplicate, move up / down, delete); each action is one transaction.
- **FR-MENU-002** Menu component: `role="menu"` / `menuitem` buttons / `separator`, roving focus, keys as in US-02,
  `aria-haspopup` / `aria-expanded` / `aria-controls` on submenu items, `aria-disabled` items with a visible hint,
  `aria-keyshortcuts`, viewport clamping with CSSOM (no inline style attributes), closes on outside pointer down.
- **FR-MENU-003** Host API: `registerContextMenuItem()` / `window.NowoMilkdownEditor.contextMenu.register()` and the
  cancellable `nowo-milkdown:contextmenu` event with editable `detail.groups`.
- **FR-MENU-004** BC: fields without `context_menu` render the same widget JSON as 1.2 (the `menu.*` strings are only
  sent with the feature) and load no extra code.

## Success criteria

- **SC-001** Vitest covers the menu, the plugin and the block commands; PHP coverage stays 100 %.
- **SC-002** Demo e2e: menu opened by mouse and keyboard, axe 0 serious / critical with the menu and the submenu
  open, 0 CSP violations, focus returns to the editable.

## Non-goals

- Edit link (the link tooltip does it), copy link to heading (heading anchors, later in 1.3), comments (1.4), colour
  (block menu, 1.3), a custom menu on touch devices.
