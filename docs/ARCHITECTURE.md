# Architecture

```
Symfony form (MilkdownEditorType)                       PHP renderer (MilkdownMarkdownRenderer)
  └─ form theme: div.nowo-milkdown[data-nowo-milkdown-options] + textarea        CommonMark + GFM
       └─ <script type="module" nonce> milkdown-editor.js                        + MilkdownDialectExtension
            ├─ editor.ts      CrepeBuilder (reduced) + dialect nodes + plugins      ├─ DialectInlineParser / TextDirectiveParser / MathInlineParser
            ├─ dialect/       remark plugin (parse + stringify), directives         ├─ DirectiveBlockStartParser (containers, leaves, $$)
            ├─ nodes/         wikiRef, mention, tablerIcon, directives, tasks       ├─ DocumentProcessor (batched resolvers, remote images)
            ├─ plugins/       suggest (listbox), keyboard (Tab), a11y               └─ DialectRenderer (escaped HTML)
            ├─ upload.ts, link-titles.ts, triggers.ts
            └─ lazy chunks:   features/code (CodeMirror), latex (KaTeX), mermaid, collab (Yjs + Mercure)
```

- **Markdown is the source of truth.** The editor parses and writes the same dialect as the PHP renderer; dialect
  nodes keep their source text (`[[wiki:id]]`, `@handle`, `:tabler-x:`), titles are never stored.
- **Options travel as JSON** in one data attribute; `options.ts` validates them again in the browser.
- **Lazy loading:** the entry holds Milkdown, the reduced Crepe features and the dialect; CodeMirror (and each
  language), KaTeX, Mermaid and collaboration load only when a field enables them.
- **Host integration points:** candidate / title / upload / collaboration endpoints (HTTP), resolver interfaces and
  `DirectiveRendererInterface` (PHP), `CspNonceProviderInterface`, theme tokens and template overrides.
