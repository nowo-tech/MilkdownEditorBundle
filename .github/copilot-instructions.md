## AI contribution guidelines — Milkdown Editor Bundle

Follow these rules when contributing PHP, TypeScript, Twig, and documentation to this repository.

---

## Project scope

- **Type:** Standalone Symfony bundle (`nowo-tech/milkdown-editor-bundle`): a Markdown form type with Milkdown + a reduced Crepe build, and a league/commonmark renderer for the same dialect.
- **PHP:** `>=8.2 <8.6` with `declare(strict_types=1);` in every PHP file; no typed class constants (PHP 8.2).
- **Symfony:** **7.4**, **8.0**, and **8.1+** (`^7.4 || ^8.0`). Symfony 8 requires PHP 8.4+.
- **Code:** `src/` (`Nowo\MilkdownEditorBundle\`).
- **Frontend:** TypeScript + Vite + **pnpm** in `src/Resources/assets/`; published ES module `src/Resources/public/milkdown-editor.js` with lazy `chunks/`.
- **Language:** PHPDoc, inline comments, and user-facing docs in **English** only.

---

## PHP standards

- PSR-12 + Symfony coding standards; run `make cs-check` before finishing.
- Strict comparisons, constructor injection, `final` classes; keep BC on config keys, form options, Twig names and the dialect.
- Wire services in `src/Resources/config/services.php`; the DI alias is `nowo_milkdown_editor` (`default_profile` + `profiles`).
- The bundle has no controllers or routes; hosts own the endpoints.

---

## Bundle-specific conventions

- Twig namespace and translation domain: `NowoMilkdownEditorBundle`; form block prefix `milkdown_editor`.
- Asset package: `nowo_milkdown_editor` (`base_path: /bundles/nowomilkdowneditor`).
- CSS classes `.nowo-milkdown-*` (editor) and `.nowo-md-*` (rendered HTML), custom properties `--nowo-milkdown-*`.
- The Markdown dialect lives in two places (TS `dialect/`, PHP `Markdown/`): change both with tests.
- Strict CSP: no inline scripts or style elements without the nonce; no `innerHTML` with user data.
- No per-request state in services (FrankenPHP worker mode).

---

## Tests and quality

- PHPUnit: **100% line coverage** on `src/`.
- Vitest: `make test-ts` (≥ 90%); Playwright + axe + CSP: `make test-e2e`.
- Full gate: `make release-check`.

---

## Documentation

- Keep `README.md` badges and the **Documentation** section aligned with `docs/`.
- Update `docs/CHANGELOG.md` and `docs/UPGRADING.md` for user-visible changes; keep `specs/001-baseline/code-inventory.md` in step with `src/`.
- Flex recipe: `.symfony/recipe/nowo-tech/milkdown-editor-bundle/1.0/`.

---

## Do not

- Commit secrets, `.env` files or demo `var/` caches.
- Add `Co-Authored-By` trailers to commits.
- Use Crepe's list-item, image-block, block-edit, AI or emoji features.
