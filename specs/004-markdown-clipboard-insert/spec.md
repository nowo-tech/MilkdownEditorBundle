# Feature specification: Markdown clipboard and the Insert group

**Feature branch**: `feat/markdown-clipboard`  
**Created**: 2026-11-03  
**Status**: Implemented (1.5.0, unreleased)  
**Origin**: owner requests through Beacon (2026-11-03), coordinator plan B.

## Summary

Two opt-in features: `markdown_clipboard` (smart paste of Markdown, *Paste as Markdown*, *Copy as Markdown*) and
`insert_menu` (an *Insert* group in the context menu), plus a read-view "Copy as Markdown" button for PHP pages
(`nowo_milkdown_copy_markdown()`).

## User scenarios

### US-01 — Markdown pasted from a code editor (P1)

**Given** `markdown_clipboard`, **when** the author pastes text whose `text/html` only wraps text (`pre`, `code`, `div`,
`p`, `br`, `span`) and whose `text/plain` uses Markdown syntax, **then** the text is parsed as Markdown of the dialect.
Rich HTML (formatting, links, lists, headings in the HTML) keeps the sanitising HTML path; nothing is parsed inside a
code block.

### US-02 — Paste / Copy as Markdown (P1)

**Given** `markdown_clipboard`, **when** the author uses **Ctrl / ⌘ + Alt + V** or *Paste as Markdown*, **then** the
clipboard text is parsed as Markdown. **When** they use **Ctrl / ⌘ + Alt + Shift + C** or *Copy as Markdown*, **then**
the selection, serialised to the dialect, is written as plain text and the live region says so (or that it failed).
Ctrl / ⌘ + Alt + C stays Milkdown's code block shortcut.

### US-03 — Insert from the context menu (P1)

**Given** `context_menu` and `insert_menu`, **when** the author opens the context menu, **then** an *Insert* submenu
offers *Image or file…* (with uploads), *Icon or emoji* (with icons or `:` suggestions) and the blocks of the `/` menu
the field has (headings 1–3, lists, task list, table, code, callout, divider, math, Mermaid). A block goes after the
current one (an empty paragraph is reused); the current block is never turned into something else.

### US-04 — Copy the source of a read page (P2)

**Given** a PHP page rendering Markdown, **when** it prints `nowo_milkdown_copy_markdown(markdown)`, **then** readers
get a button that copies that Markdown as plain text, announced in a status region.

## Requirements

- **FR-CLIP-001**: smart paste only for text-only HTML wrappers and Markdown-looking text; a view prop that runs before
  Milkdown's clipboard plugin; single paragraphs paste inline, other blocks as blocks.
- **FR-CLIP-002**: Paste / Copy as Markdown through the Clipboard API (`readText` / `writeText`); items disabled
  without it; readers get *Copy as Markdown* only.
- **FR-INSERT-001**: `insert_menu` needs `context_menu` (config, form option and browser); items follow the field's
  features, uploads and icons; nothing in a readonly view.
- **FR-COPY-001**: `nowo_milkdown_copy_markdown(markdown, {label?, class?})` escapes the source into a `<template>`
  (inert, no script), translated labels, a polite status region; the host passes only Markdown the viewer may read.
- **FR-BC-001**: without the two features the widget JSON, the menus and the paste behaviour are unchanged.

## Security

- The pasted Markdown goes through the dialect parser and the sanitiser of the render, like typed text.
- `DOMParser` is only used to inspect clipboard HTML (inert, no script runs); nothing of it is inserted on the smart
  path.
- The read-view button puts the source into the page: pages must only print it for viewers who may read the page,
  with the Markdown they may read (it carries page ids, not titles, for `[[page]]` links).
