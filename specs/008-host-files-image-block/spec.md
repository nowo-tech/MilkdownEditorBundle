# Feature specification: host references, image block, insert button, file views and previews

**Feature branch**: `feat/1.9-host-files-image-block`  
**Created**: 2026-11-06  
**Status**: Implemented (1.9, unreleased)  
**Origin**: Beacon request `docs/ops/BUNDLES-REQUESTS/2026-11-06-milkdown-file-views-and-previews.md` (ME-5, ME-6);
roadmap D9 (`image_block`), row 1.3 (`insert_button`). The preview endpoint is the host's.

## User scenarios

### US-01 — Images always preview (P1, ME-5)

**Given** a host that stores `![alt](app-file:<id>)` and declares `app-file`, **then** the editor and the PHP renderer
show the image. **When** the viewer may not read the file, or the resolver fails, **then** a neutral placeholder shows and
nothing of the file is disclosed.

### US-02 — Images with caption, width and alignment (P2, D9)

**Given** `image_block`, **when** the author selects an image, **then** a toolbar edits alt, caption, width and alignment;
the Markdown stays readable elsewhere, and the read page draws a figure. The toolbar can be reached without a pointer.

### US-03 — One file, several views (P1, ME-6)

**When** the author picks *View → Link / Link with icon / Card / Preview*, **then** the choice is stored in the dialect and
the renderer draws the same. A preview embeds the host's page in a sandboxed frame, and falls back to the card when the host
has no preview for the viewer.

### US-04 — A "+" on empty lines (P3)

**Given** `insert_button`, **when** the caret is on an empty line, **then** a "+" beside it opens the `/` menu.

## Requirements

- **FR-HOST-001**: schemes are configured (`markdown.host_schemes`), with no host name in the bundle; only those are resolved.
- **FR-HOST-002**: an id is `[A-Za-z0-9._~-]{1,200}`, not only dots; other values of the scheme are inert.
- **FR-HOST-003**: references resolve in one batch per document through `HostFileResolverInterface`, capped by
  `max_references`; the default uses the templates.
- **FR-HOST-004**: every resolved URL passes the renderer's URL check, and images the remote-image policy
  (`host_image_origins` is the host's exception, never available to authors).
- **FR-HOST-005**: a missing answer, an exception or a wrong type renders safely and discloses nothing.
- **FR-HOST-006**: uploads may answer with a reference; paste keeps allow-listed references.
- **FR-IMG-001**: `{width=… align=…}` follows an image; only valid blocks count, others stay text; values never reach `style`.
- **FR-IMG-002**: Markdown round trips with or without the feature.
- **FR-FILE-001**: `view` is `link`, `icon`, `card` or `preview`; others are `card`. `height` is 160–1200, else 480.
- **FR-FILE-002**: the bundle never fetches a file; a preview is a host URL in a frame with `sandbox`, `loading="lazy"`,
  `referrerpolicy="no-referrer"`, a title, *Open* and *Download*.
- **FR-FILE-003**: `allow-scripts` with `allow-same-origin` is refused.
- **FR-BC-001**: with the defaults the renderer's output, the widget JSON and the editor's image element do not change.

## Success criteria

- PHP line coverage 100%; TypeScript coverage not below 1.8; up-front JavaScript within the 400 kB budget.
- Playwright: images by reference, figure, "+" button, file views, preview frame with its attributes, axe serious 0 and no
  CSP violation.
