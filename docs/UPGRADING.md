# Upgrading

## Table of contents

- [General procedure](#general-procedure)
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

## 1.0.0

First release: nothing to migrate.

### Coming from TiptapEditorBundle

Tiptap stores HTML; this bundle stores Markdown. Convert stored values once (for example with
`league/html-to-markdown` or your own converter) into new revisions, then replace `TiptapEditorType` with
`MilkdownEditorType`. Tiptap 1.6 `suggestions` (`[{trigger, url}]`) become `['@' => url, '[[' => url]`;
`upload_url` and `upload_csrf_token` keep their names and the JSON answer format.
