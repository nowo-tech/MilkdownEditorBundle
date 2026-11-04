# Usage

## Table of contents

- [The form field](#the-form-field)
- [Markdown dialect](#markdown-dialect)
- [Suggestions](#suggestions)
- [Page titles per viewer](#page-titles-per-viewer)
- [Uploads](#uploads)
- [Collaboration](#collaboration)
- [Rendering Markdown in PHP](#rendering-markdown-in-php)
- [Rendering Mermaid and math on read pages](#rendering-mermaid-and-math-on-read-pages)
- [JavaScript API and Stimulus](#javascript-api-and-stimulus)
- [Context menu](#context-menu)
- [Markdown clipboard](#markdown-clipboard)
- [Block actions and colours](#block-actions-and-colours)
- [Comments](#comments)
- [Version view and diff](#version-view-and-diff)
- [Heading ids](#heading-ids)
- [Keyboard and accessibility](#keyboard-and-accessibility)
- [Forms in Twig](#forms-in-twig)
- [Overriding templates](#overriding-templates)
- [Overriding translations](#overriding-translations)

## The form field

```php
use Nowo\MilkdownEditorBundle\Form\MilkdownEditorType;

$builder->add('body', MilkdownEditorType::class, [
    'label'   => 'Content',
    'profile' => 'wiki',
]);
```

The field's value is Markdown (`\n` line endings). The rendered widget is the field's `<textarea>` inside a
`div.nowo-milkdown[data-nowo-milkdown-options]`; without JavaScript users edit the Markdown in the textarea. The
editor writes back to the textarea on every change and before the form submits. The field's label names the editor
(`aria-labelledby`).

With symfony/validator installed the field gets a `Length` constraint of `max_length` **bytes** (default: the
renderer's `markdown.max_input_length`, 100 000), added to your own `constraints`, so a document the renderer would
show as plain text is rejected when it is saved. `'max_length' => null` removes it; raise
`nowo_milkdown_editor.markdown.max_input_length` for longer documents (see
[CONFIGURATION](CONFIGURATION.md#renderer-limits)).

## Markdown dialect

| Syntax | Meaning |
|--------|---------|
| `[[wiki:<uuid>]]`, `[[wiki:<uuid>#anchor]]` | Link to a page by id; shown with its current title, or *Content not visible* |
| `@handle` | Mention (needs start of text, a space or `(` before it — never inside an e-mail) |
| `:tabler-<name>:` | Icon from the sprite when the name is allowlisted, text otherwise |
| `:::callout{type=info\|success\|warning\|danger}` … `:::` | Callout |
| `:::details{summary="…"}` … `:::` | Collapsible section |
| `::: {align=center}` … `:::` | Alignment (`left`, `center`, `right`) |
| `:mark[text]{color=green}` | Highlight (colour tokens from `markdown.mark_colors`) |
| `::name{key=value}` | Leaf directive for host blocks (e.g. `::beacon{type=issue id=…}`) |
| `$tex$`, `$$` … `$$` | Math (feature `math`) |
| ```` ```mermaid ```` | Diagram (feature `mermaid`) |

Emoji are plain Unicode text. Unknown directives are kept as they are. A container nested in another uses more
colons on the outer one (`::::callout` … `::::`).

## Suggestions

```php
'suggestions' => [
    '[[' => '/api/pages',   // pages the author may read
    '@'  => '/api/users',   // people who may read the document
    ':'  => '/api/icons',   // optional: without it, the allowlisted icons and a built-in emoji list are offered
],
```

The editor calls `GET <url>?q=<query>` (debounced, cancelled when the query changes) and expects a JSON array of at
most 10 candidates:

```json
[{"id": "0b6f4f0e-3c55-4d0a-9a43-1f7a2c9e8d10", "label": "Installation guide", "hint": "Docs", "url": "/wiki/install"}]
```

`id` is the page UUID (`[[`), the handle (`@`), or `tabler-<name>` / an emoji (`:`). Rows with an invalid id are
dropped. Keys: **Up / Down** move, **Enter / Tab** insert, **Escape** closes. The `/` menu (feature `slash_menu`)
offers headings, lists, task lists, quote, code, table, divider, callout, details, Mermaid, math and the other
triggers.

Candidate endpoints must check permissions themselves (only pages the author may read, only people who may read the
document) and rate-limit.

## Page titles per viewer

```php
'link_title_url' => '/api/pages/titles',
```

Chips call `GET <url>?ids=<id>,<id>` once per batch (at most 50 ids) and expect
`[{"id": "…", "title": "…", "url": "/…", "visible": true}]`. Ids missing from the answer, or with `visible: false`,
show *Content not visible* and no link. URLs other than relative or http(s) are dropped.

## Uploads

```php
'upload_url'        => $this->generateUrl('app_upload'),
'upload_csrf_token' => $csrfTokenManager->getToken('upload')->getValue(),
'upload_max_size'   => 5 * 1024 * 1024,
'upload_accept'     => ['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'application/pdf'],
```

Dropped, pasted or picked (*Insert file*) files are POSTed as multipart field `file` with the token in the
`X-CSRF-Token` header. Answer with `{"url": "/files/…", "name": "a.png", "image": true, "alt": "…"}`; images become
`![alt](url)`, other files `[name](url)`. HTTP 413 shows *too large*; other errors *could not be uploaded*.

The browser checks are a convenience only: a direct POST skips them. The endpoint must validate the token and the
size again, detect the type from the content (do not trust the client's type or name) and **never accept
`image/svg+xml` or HTML** (`image/*` includes SVG, which can carry script). Serve stored files with
`X-Content-Type-Options: nosniff`, `Content-Disposition: attachment` for non-images and
`Content-Security-Policy: sandbox`, or from a separate cookie-less origin (see
[SECURITY](SECURITY.md#permissions)).

## Collaboration

```php
'collaboration' => [
    'url'     => '/wiki/pages/'.$page->getId().'/collab',   // POST /token, GET /state, POST /update, POST /awareness
    'hub_url' => '/.well-known/mercure',
    'topic'   => 'https://example.com/wiki/pages/'.$page->getId().'/collab',
    'user'    => ['name' => $user->getName(), 'color' => '#1f6f54'],
],
```

The browser subscribes to the private topic with the `mercureAuthorization` cookie your `POST <url>/token` sets
after checking edit rights; updates are sent to your endpoints, which apply them to the stored Yjs state and publish
them. `GET <url>/state` answers `{"state": "<base64 Yjs update>", "seed": true|false}`; the client told to seed fills
an empty document from the field's Markdown. The client that saves still submits Markdown (the server never reads Y
state). Readers without edit rights must not get the options at all.

**Request rate (1.5.1).** Local edits are merged (`Y.mergeUpdates`) and posted at most once per **200 ms**
(`update_delay_ms`, 0–2000), one request at a time so their order is kept; presence is posted at most once per
**750 ms** (`awareness_delay_ms`, 0–5000, trailing edge). Pending edits are sent at once when the editor loses focus,
on form submit, when the tab is hidden or closed (`keepalive`) and on destroy. A typist at 15 keys/s therefore costs
about 6 requests/s (5 updates + 1–2 presence) instead of 30. Answer **429** with `Retry-After` when a limiter trips:
the client keeps the merged edits, waits at least its exponential backoff (1 s doubling up to 30 s) or a longer
`Retry-After` (seconds or a date, honoured between 1 and 60 s), retries and stays online. One POST never carries more
than `max_update_bytes` (default 256 KiB of Yjs data; set it to your endpoint's limit): a larger backlog is split. **Use separate limiters** for `/update` and `/awareness` (and `/token`, `/state`), sized
for these windows (e.g. 600/min per user and page for updates, 120/min for presence).

```php
'collaboration' => [/* … */, 'update_delay_ms' => 200, 'awareness_delay_ms' => 750, 'max_update_bytes' => 262144],
```

**State as a log (1.2).** A host that cannot merge Yjs updates on the server (PHP) may answer `GET <url>/state` with
the stored log instead of one merged update: `{"state": "<base64 snapshot or empty>", "updates": ["<base64>", …],
"seq": 128, "compact": true, "seed": false}`. The client applies `state` then every update in order (Yjs updates are
idempotent). With `compact: true` and an integer `seq` it then posts `POST <url>/compact` with
`{"c": clientId, "d": "<base64 full state>", "s": seq}`: the host may replace the log entries up to `seq` with that
snapshot (the client has applied all of them). The endpoint follows the same rules as `/update` (edit rights, JSON,
`Origin`, size and rate limits); a failed compaction changes nothing. Hosts that answer only `state` are unaffected.

**Saves from the live session (1.2).** When the session is online, the client adds a hidden
`_nowo_milkdown_collab` field (the topic) to the form on submit; an offline editor does not. A host can keep its log for
such saves and reset it for any other save.

**One seeding tab (1.2).** Token and state requests carry `X-Nowo-Collab-Client` (the tab's Yjs client id) so the
host can tell two tabs of the same user apart when it decides who seeds.

**Corrupt state (1.2).** When the state or an update cannot be applied, the client posts once
`POST <url>/corrupt` (`{"c": clientId, "s": seq}`, the `seq` of the state answer) and stays offline. The host may drop
the log and publish the reset below (it should cap such resets); the client never retries, so nothing loops.

**Reset (1.2).** When the host replaces the document outside the session (a restore, an import, a conversion) it
drops its log and publishes `{"t": "r"}` on the topic: every editor stops its session (no more posts, no reconnect),
announces `collab.reset` and reloads the page after 1.5 s, so it shows the replaced content. Edits typed after the
reset are not sent. Automatic reloads are capped at 3 per topic per 5 minutes (sessionStorage); beyond that the
editor stays on the page, announces `collab.reset_paused` and shows a **Reload** button. Malformed hub messages and
broken presence updates are ignored. The collaboration requests are JSON POSTs with
the session cookie: require `Content-Type: application/json` and check the `Origin` header (or SameSite cookies) on
those endpoints.

## Rendering Markdown in PHP

```twig
{{ page.body|milkdown_markdown }}
```

```php
use Nowo\MilkdownEditorBundle\Markdown\MarkdownRendererInterface;

public function __construct(private MarkdownRendererInterface $markdown) {}
$html = $this->markdown->render($page->getBody());
```

Implement and alias the resolvers. They get every distinct page id / handle of a document in one call (at most
`markdown.max_references`, 500 by default) — chunk your queries if your storage needs it:

```php
use Nowo\MilkdownEditorBundle\Markdown\Resolver\{PageResolverInterface, ResolvedPage};

final class WikiPageResolver implements PageResolverInterface
{
    public function resolvePages(array $ids): array   // one call per document
    {
        $out = [];
        foreach ($this->pages->findReadableByIds($ids, $this->security->getUser()) as $page) {
            $out[$page->getId()] = new ResolvedPage($page->getTitle(), $this->urls->generate('wiki_page', ['slug' => $page->getSlug()]));
        }

        return $out;
    }
}
```

```yaml
services:
    Nowo\MilkdownEditorBundle\Markdown\Resolver\PageResolverInterface: '@App\Wiki\WikiPageResolver'
    Nowo\MilkdownEditorBundle\Markdown\Resolver\UserResolverInterface: '@App\Wiki\MentionResolver'
```

Leaf directives (`::beacon{type=issue id=…}`) are rendered by autoconfigured `DirectiveRendererInterface` services:
`supports()`, `prepare()` (every node of a document, for one query per type) and `render()` (escape everything).
Unknown leaf directives render as an empty placeholder `div`.

Raw HTML is escaped (or stripped), unsafe link schemes are dropped and remote images become links unless
`allow_remote_images` is on. Documents over `max_input_length` bytes or with more than `max_inline_markers` inline
delimiters render as escaped plain text (a parser-cost bound, see [SECURITY](SECURITY.md#parser-cost)). A resolver that throws is logged (`warning`, no content) and its references render as
not visible.

## Rendering Mermaid and math on read pages

The PHP renderer outputs ```` <pre><code class="language-mermaid"> ```` and `[data-math]` elements. To draw them:

```twig
{{ nowo_milkdown_editor_assets() }}
<article class="nowo-md" id="page-body">{{ page.body|milkdown_markdown }}</article>
```

```js
// in your module script (nonce-aware)
await window.NowoMilkdownEditor.renderRichContent(document.getElementById('page-body'), { nonce: cspNonce });
```

Diagrams do not load images from other origins: Mermaid image shapes (`A@{ img: … }`) are removed before rendering,
`themeCSS` / `themeVariables` / `fontFamily` cannot be set from `%%{init}%%`, `style` / `classDef` / `linkStyle`
lines lose `url(…)` declarations, and remote `href`s and `url(…)` are removed from the SVG. Pass
`allowRemoteImages: true` only when the renderer's `allow_remote_images` is on as well. A formula KaTeX cannot
render, or one over 5 000 characters, 50 nesting levels or 200 scripts, or one that defines macros, keeps its source
and gets `data-math-error`; the others still render.

## JavaScript API and Stimulus

The module mounts every widget on load, on `turbo:load` and when one is added to the page. Add
`data-nowo-milkdown-manual` on `<html>` to disable auto-mounting — recommended on pages that also show untrusted
HTML through a sanitizer that keeps `data-*` attributes (see [SECURITY](SECURITY.md#permissions)). The editor
reads the CSP nonce from its `<script nonce>` element. `window.NowoMilkdownEditor` exposes `mount(el)`,
`unmount(el)`, `mountAll(scope)`, `instance(el)` (a promise of `{getMarkdown, setMarkdown, focus, destroy, …}`),
`renderRichContent(root, options)` and `createStimulusController(Controller)`:

```js
import { Controller } from '@hotwired/stimulus';
application.register('nowo--milkdown-editor', window.NowoMilkdownEditor.createStimulusController(Controller));
```

The widget root already carries `data-controller="nowo--milkdown-editor"`; mounting is idempotent. A
`nowo-milkdown:ready` event bubbles from the root once the editor is ready.

## Context menu

Add `context_menu` to a profile's (or field's) `features` (1.3). Right click, **Shift+F10** or the **ContextMenu** key
inside the editable open a menu with the actions that apply where the caret is:

| Group | Items |
|-------|-------|
| Clipboard | Cut, Copy, Paste, Paste as plain text (the paste items need the browser's clipboard permission; otherwise they are disabled with a "Use Ctrl+V" hint) |
| Link (caret in a link) | Open link (new tab, `noopener`), Copy link address, Remove link |
| Table (caret in a cell) | Insert row above / below, Insert column left / right, Delete row / column / table |
| Block | Turn into (text, headings 1–3, bulleted / numbered / task list, quote, code), Duplicate, Move up, Move down, Delete |
| Host | Items registered by the page (below) |

Read-only editors show *Copy* and host items only. **Shift** + right click, right clicks inside code blocks or form
fields and touch long-presses keep the browser's menu (spellcheck suggestions live there).

Add host items once per page (they appear in every editor's menu):

```js
const remove = window.NowoMilkdownEditor.contextMenu.register({
  id: 'ask-ai',
  label: 'Ask the team',
  shortcut: 'Alt+A',                                   // shown, and exposed as aria-keyshortcuts
  when: (context) => !context.selection.empty,          // optional
  run: (context) => openDialog(context.text),           // {root, selection, text, blockType, readonly, insertText}
});
```

Or change the menu per editor with the cancellable `nowo-milkdown:contextmenu` event (bubbles from the widget root):
`event.detail.groups` is the list of item groups (`{id, label, shortcut?, disabled?, items?, run?}`) and
`event.detail.context` the same context as above; `event.preventDefault()` cancels the menu.

## Markdown clipboard

Add `markdown_clipboard` to a field's `features` (1.5).

- **Smart paste.** Text copied from a code editor, a terminal or a plain text field reaches the clipboard with HTML
  that only wraps the text (`pre`, `code`, `div`, `p`, `br`, `span`). When that text looks like Markdown (headings,
  lists, `**`, links, fences, tables, quotes), it is parsed as Markdown of the dialect instead of pasted as a code-ish
  paragraph. Copies from web pages and documents (real formatting, links, lists in the HTML) keep the sanitising HTML
  path. Nothing is parsed inside a code block. A single paragraph joins the text at the caret; anything else is
  inserted as blocks.
- **Paste as Markdown** (**Ctrl / ⌘ + Alt + V**, and in the context menu) parses the clipboard text as Markdown
  whatever it looks like. It needs the browser's clipboard permission (`readText`).
- **Copy as Markdown** (**Ctrl / ⌘ + Alt + Shift + C**, and in the context menu, also for readers) writes the selection
  as Markdown of the dialect, as plain text, and says so in the live region.
- **Read pages.** `{{ nowo_milkdown_copy_markdown(page.markdown) }}` prints a "Copy as Markdown" button (options:
  `label`, `class`, e.g. `{class: 'btn btn-outline-secondary btn-sm'}`, and since 1.5.1 `icon`: `true` for an icon and
  the label, `'only'` for an icon-only button named by a visually hidden label and its `title`). It needs `nowo_milkdown_editor_assets()` on
  the page. The source travels in the page HTML: print it only for viewers who may read the page, and pass the
  Markdown they may read (page links carry ids, not titles).

  **Markup (public API since 1.5.1, stable within 1.x):**

  ```html
  <span class="nowo-milkdown-copy" data-nowo-milkdown-copy>
    <button type="button" class="nowo-milkdown-copy__button [nowo-milkdown-copy__button--icon] [your classes]"
            data-nowo-milkdown-copy-markdown data-copied="…" data-failed="…" [title="…"]>
      [<svg class="nowo-milkdown-copy__icon" aria-hidden="true" …>…</svg>]
      Label | <span class="nowo-milkdown-copy__label">Label</span> | <span class="nowo-milkdown-sr-only">Label</span>
    </button>
    <template>the escaped Markdown source</template>
    <span class="nowo-milkdown-copy__status" role="status"></span>
  </span>
  ```

  The editor module binds any `[data-nowo-milkdown-copy-markdown]` button inside a `[data-nowo-milkdown-copy]`
  wrapper: it copies the `<template>`'s text and writes `data-copied` / `data-failed` into the `role="status"` span,
  cleared after 4 s and on the next click.

The *Insert* group (`insert_menu`, with `context_menu`) adds *Image or file…* (when the field has uploads), *Icon or
emoji* (with icons or `:` suggestions) and the `/` blocks of the field. A new block goes after the current one; an
empty paragraph is reused.

## Block actions and colours

`block_actions` (1.4) adds a "⋮⋮" button beside the block under the pointer or the caret. It opens the block menu:
*Turn into*, *Color* (with `colors`), *Duplicate*, *Move up*, *Move down*, *Delete*. From the keyboard: **Ctrl / ⌘ + /**
opens the same menu at the caret and **Alt+Shift+↑ / ↓** move the block (announced in the widget's live region). The
button is not in the tab order, so Tab still leaves the editor. `block_drag` also lets pointer users drag the button to
move the block (ProseMirror's drop cursor shows where it lands).

`colors` (1.4) adds *Color* to the block menu, to the context menu (the selected text, or the block without a
selection) and a colour button to the selection toolbar. The palette is Notion's: gray, brown, orange, yellow, green,
blue, purple, pink, red, each as a text colour and a background, plus *Default*. The Markdown stays portable:

```markdown
:mark[selected words]{text="red"}          text colour
:mark[selected words]{bg="yellow"}         background (1.0–1.2 wrote color="yellow": still read as the background)
::: {bg="blue" text="red"}                 a whole block (the container that also carries align=)
Paragraphs, lists or headings.
:::
```

Only names from `markdown.mark_colors` are rendered (as classes `nowo-md-text--NAME`, `nowo-md-bg--NAME`,
`nowo-md-mark--NAME`); anything else keeps the text without colour. Plain Markdown viewers show the directives as
text. Each colour is a token (`--nowo-milkdown-color-NAME`, `--nowo-milkdown-mark-NAME`) with WCAG AA contrast in light
and dark. When a text colour and a background are both set, the text uses the background's paired text colour, so
every combination stays AA (the text colour is kept in the Markdown). The menus offer the names of
`markdown.mark_colors`; text inside another text directive (`:note[…]`) is left without colour (one text directive
per character). **Colour is never the only
carrier of meaning**: use a callout, an icon or words for status.

## Comments

`comments` (1.6) lets people comment on a selection. Comments are **not** in the Markdown: the editor draws them as
highlights (decorations) from threads the host gives it, and **stores nothing**. The full host contract (anchor
format, endpoints, events, security) is the 1.6 comments contract; the essentials:

```php
$builder->add('body', MilkdownEditorType::class, [
    'features' => [...$features, 'comments'],
    'comments' => ['url' => $commentsUrl, 'csrf_token' => $token, 'can_create' => $canComment, 'panel' => 'margin'],
]);
```

```twig
{# Readers with the comment right but not the edit right: a read-only mount #}
{{ nowo_milkdown_view(page.body, {features: ['comments'], comments: {url: comments_url, can_create: true}}) }}
```

- **Start a comment:** select text, then the toolbar's *Comment* button, *Comment* in the context menu, or
  **Ctrl / ⌘ + Alt + M**. The editor emits `nowo-milkdown:comment-create` (cancelable) with `{anchor, text}`; without
  cancellation the built-in composer opens (when `url` is set). Not inside code blocks or math.
- **Anchors** (`v: 1`): a text quote (`exact`, `prefix`, `suffix`), offsets, a block hint and, while co-editing, Yjs
  relative positions. Validate them on the host with `Nowo\MilkdownEditorBundle\Comment\CommentAnchor::fromJson()`
  (it throws `InvalidCommentAnchorException`; answer 422) and store the normalised `toJson()`.
- **Resolution:** Yjs positions first, then the exact quote (context ranks duplicates); text that is gone makes the
  thread **orphaned** (`comment-orphaned`), never attached elsewhere. When an anchor drifts the editor emits
  `comment-anchors-changed`; the thread component PATCHes it with `base: updatedAt` (answer 409 when stale).
- **API:** `handle.comments.set(threads)`, `upsert`, `remove`, `status`, `selectionAnchor`, `start`, `focus`, `next`,
  `previous`, `showResolved`, `snapshot`, `refresh`, `open`, `reveal`, `count`, `mount`. Events: `comment-create`,
  `comment-created`, `comment-open`, `comment-changed`, `comment-orphaned`, `comment-anchors-changed`, `comment-error`,
  `comments-open-requested`, `comments-count` (all prefixed
  `nowo-milkdown:` and dispatched on the widget root).
- **Thread component** (with `url` and `panel` other than `none`): a *Comments* landmark beside the editor (`margin`
  aligns cards with their text on wide screens) or `sidebar`; threads with replies, reactions, resolve / reopen,
  edit / delete own, *Show resolved*, page-level comments. Endpoints under `url`: `GET /threads`,
  `GET|POST /threads[/{id}]`, `POST /threads/{id}/comments`, `PATCH /threads/{id}`, `PATCH|DELETE /comments/{cid}`,
  `PUT|DELETE /comments/{cid}/reactions/{emoji}`. Comment bodies are HTML rendered by the host with this bundle's
  renderer; the component copies an allow-list of it with DOM APIs.
- **In a host drawer** (`panel: 'container'`, `container: '#wiki-comments'`, or `handle.comments.mount(el)` later): the
  threads render into your element with no landmark, heading, layout or Escape handling of their own. Listen to
  `nowo-milkdown:comments-open-requested` (`{id}`, `null` for a new comment) to open the drawer before the thread is
  focused, and to `nowo-milkdown:comments-count` (`{open, resolved, orphaned, page, total}`, also
  `handle.comments.count()`) for the tab badge. A thread card scrolls to its text and flashes it
  (`handle.comments.reveal(id)`) without taking focus from the drawer; `handle.comments.focus(id)` instead selects
  the text and moves focus into the editor. Opening a thread focuses its first control (a new comment: the composer's
  textarea). A reply from someone else is announced only while the component is visible (not inside a `hidden`
  drawer); the count is never announced. The component is `width: 100%` with no positioning or fixed heights, so it
  fits a full-height drawer on phones; the host owns scrolling, Escape and focus restoration.
- **Live updates:** with `topic` and co-editing, the component listens to the hub for `{"threads": [ids]}` and
  refetches those threads; otherwise call `handle.comments.refresh(ids)`.
- **Keyboard:** **Ctrl / ⌘ + Alt + PageDown / PageUp** next / previous comment (selected and announced), **Enter**
  opens it, **Escape** leaves it. Highlights have a dotted underline as well as a background.

## Version view and diff

`version_view` (1.6) mounts an old version read-only with a banner:

```twig
{{ nowo_milkdown_view(revision.body, {features: ['version_view'], version: {label: revision.createdAt|date, restore: false, copy: false}}) }}
```

*Restore this version* and *Copy to a new page* only emit `nowo-milkdown:version-restore` / `version-copy` (the host
does the write); `restore: false` / `copy: false` remove them. Collaboration, uploads and comments are off.

`nowo_milkdown_diff(old, new)` (or the `Nowo\MilkdownEditorBundle\Diff\MarkdownDiffRendererInterface` service, whose
`render()` returns `MarkdownDiff {html, changes, fallback}`) renders a diff of two **Markdown** versions with the
bundle's renderer (per-viewer resolvers, nothing cached): blocks are matched (LCS), changed paragraphs get a word-level
diff. Stable markup, for sanitiser allow-lists:

| Element | Meaning |
|---------|---------|
| `div.nowo-md.nowo-md-diff[data-nowo-milkdown-diff]` | Wrapper |
| `h2.nowo-md-diff-summary` | *N changes* / *No changes* |
| `div.nowo-md-diff-block[data-change=added\|removed\|changed]` | A changed block |
| `ins.nowo-md-diff-ins`, `del.nowo-md-diff-del` | Inserted / deleted content |
| `span.nowo-md-diff-sr` | Visually hidden labels (*Inserted:*, *Deleted:*, *End of change.*) |
| `pre.nowo-md-diff-raw` | Fallback (`fallback: true`): an escaped line diff when a version is over `max_input_length`, has more than 2000 blocks or more than 500 changed blocks |

Blocks render one by one, so a footnote or reference-style link whose definition is in another block renders as
text in the diff, and heading ids are only unique per block.

## Heading ids

`markdown.heading_ids: true` (renderer) and the `heading_ids` feature (editor) give headings the same ids:
`nowo-h-` + a slug (lower case, runs of anything but letters, marks and digits become `-`, at most 80 characters,
`section` when empty; repeats get `-2`, `-3`, …). The prefix keeps a heading from clobbering a host element id or a
global. Only text and inline code count (mentions, page links, icons and raw HTML do not).

## Keyboard and accessibility

- The editable is a named multi-line textbox; the suggestion list follows the listbox pattern with
  `aria-activedescendant`, and a polite live region announces the number of results.
- **Tab** / **Shift+Tab** nest and un-nest list items, move between table cells and indent in code blocks
  (**Escape** then **Tab** leaves a code block); anywhere else Tab moves focus out of the editor.
- The context menu (`context_menu`) follows the WAI-ARIA menu pattern: Up / Down (wrap), Home / End, type-ahead,
  Right / Enter opens a submenu, Left / Escape closes it, Escape or Tab closes the menu and focus returns to the
  caret.
- Comments (1.6): **Ctrl / ⌘ + Alt + M** comments on the selection, **Ctrl / ⌘ + Alt + PageDown / PageUp** move
  between comments (selected and announced), **Enter** opens one, **Escape** returns; the thread list is a named
  `complementary` region.
- Every control is named (table handles, code-block buttons); task items are real checkboxes; focus rings are
  visible; token colours meet WCAG AA in light and dark.

## Forms in Twig

Never write raw `<form>`, `<input>`, `<textarea>` or `<select>` in templates (REQ-TWIG-005): render the form with
`form_start` / `form_row` / `form_end`. The widget's textarea comes from the form theme.

## Overriding templates

| Template | Purpose |
|----------|---------|
| `Form/milkdown_editor_theme.html.twig` | The `milkdown_editor_widget` block |

Copy it to `templates/bundles/NowoMilkdownEditorBundle/<subpath>` and edit. The override directory is registered
before the bundle's views; extend the original with `@!NowoMilkdownEditorBundle/<subpath>`. **Freeze rule:** an
override is your copy — compare it with the bundle's template after each upgrade (see [UPGRADING.md](UPGRADING.md)).
Keep the `data-nowo-milkdown-options` root and the textarea.

## Overriding translations

Add `translations/NowoMilkdownEditorBundle.<locale>.yaml` to your application:

```yaml
ref.hidden: 'Private page'
editor.placeholder: 'Write the page…'
```
