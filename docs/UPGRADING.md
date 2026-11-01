# Upgrading

## Table of contents

- [General procedure](#general-procedure)
- [1.0.1](#101)
- [1.0.0](#100)

## General procedure

1. Read the [CHANGELOG](CHANGELOG.md) entries between your version and the target.
2. `composer update nowo-tech/milkdown-editor-bundle` then `php bin/console assets:install` (the editor module and its
   chunks change with every release).
3. If you override `Form/milkdown_editor_theme.html.twig`, compare your copy with the bundle's (freeze rule in
   [USAGE.md](USAGE.md#overriding-templates)).
4. Clear the cache.

Public API covered by Semantic Versioning: the configuration tree, profile keys, form options, Twig filter / function
names, the form theme block, the `--nowo-milkdown-*` tokens, the Markdown dialect, the resolver and directive
interfaces and `window.NowoMilkdownEditor`.

## 1.0.1

Security release (independent audit, Appendix CE). Check these if you store long documents:

- **`nowo_milkdown_editor.markdown.max_input_length` defaults to `100000` bytes (was `1000000`).** Longer documents
  now render as escaped plain text. A new `max_inline_markers` limit (default `10000`) does the same for documents
  with more inline delimiter characters. If your documents are longer, raise both (and `memory_limit`); see
  [CONFIGURATION](CONFIGURATION.md#renderer-limits).
- **`MilkdownEditorType` adds a `Length` constraint** (bytes, default `max_input_length`) when symfony/validator is
  installed. Saving a longer document now fails validation. Set the field option `'max_length' => null` to keep the
  old behaviour, or another value per field.
- **The CSP nonce is no longer written into `data-nowo-milkdown-options`.** The editor reads it from its
  `<script nonce>` element. If you override `Form/milkdown_editor_theme.html.twig`, keep the
  `nowo_milkdown_editor_assets(milkdown_nonce|default(null))` call (or load the module with a nonce yourself).
- `renderRichContent()` drops remote images in Mermaid diagrams; pass `{ allowRemoteImages: true }` to keep them.

## 1.0.0

First release: nothing to migrate.

### Coming from TiptapEditorBundle

Tiptap stores HTML; this bundle stores Markdown. Convert stored values once (for example with
`league/html-to-markdown` or your own converter) into new revisions, then replace `TiptapEditorType` with
`MilkdownEditorType`. Tiptap 1.6 `suggestions` (`[{trigger, url}]`) become `['@' => url, '[[' => url]`;
`upload_url` and `upload_csrf_token` keep their names and the JSON answer format.
