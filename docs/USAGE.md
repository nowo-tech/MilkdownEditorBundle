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
'upload_accept'     => ['image/*', 'application/pdf'],
```

Dropped, pasted or picked (*Insert file*) files are POSTed as multipart field `file` with the token in the
`X-CSRF-Token` header. Answer with `{"url": "/files/…", "name": "a.png", "image": true, "alt": "…"}`; images become
`![alt](url)`, other files `[name](url)`. HTTP 413 shows *too large*; other errors *could not be uploaded*. The
endpoint must validate the token, the size and the type again.

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
state). Readers without edit rights must not get the options at all. The collaboration requests are JSON POSTs with
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

Implement and alias the resolvers:

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
`allow_remote_images` is on. A resolver that throws is logged (`warning`, no content) and its references render as
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

## JavaScript API and Stimulus

The module mounts every widget on load, on `turbo:load` and when one is added to the page. Add
`data-nowo-milkdown-manual` on `<html>` to disable auto-mounting. `window.NowoMilkdownEditor` exposes `mount(el)`,
`unmount(el)`, `mountAll(scope)`, `instance(el)` (a promise of `{getMarkdown, setMarkdown, focus, destroy, …}`),
`renderRichContent(root, options)` and `createStimulusController(Controller)`:

```js
import { Controller } from '@hotwired/stimulus';
application.register('nowo--milkdown-editor', window.NowoMilkdownEditor.createStimulusController(Controller));
```

The widget root already carries `data-controller="nowo--milkdown-editor"`; mounting is idempotent. A
`nowo-milkdown:ready` event bubbles from the root once the editor is ready.

## Keyboard and accessibility

- The editable is a named multi-line textbox; the suggestion list follows the listbox pattern with
  `aria-activedescendant`, and a polite live region announces the number of results.
- **Tab** / **Shift+Tab** nest and un-nest list items, move between table cells and indent in code blocks
  (**Escape** then **Tab** leaves a code block); anywhere else Tab moves focus out of the editor.
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
