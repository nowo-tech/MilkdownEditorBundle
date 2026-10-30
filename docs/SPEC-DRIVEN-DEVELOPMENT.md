# Spec-driven development

This bundle is specified in three layers:

1. **GitHub Spec Kit baseline** — [`specs/001-baseline/spec.md`](../specs/001-baseline/spec.md) and the code inventory
   [`specs/001-baseline/code-inventory.md`](../specs/001-baseline/code-inventory.md) (every production file mapped).
2. **Product behaviour** — the user stories and scope below, the docs ([USAGE](USAGE.md), [CONFIGURATION](CONFIGURATION.md)).
3. **`REQ-*` anchors** — the nowo bundle standards (`BUNDLES_FULL_SPECS_DETAILS.md` in the monorepo) mapped to files.

## Table of contents

- [User stories](#user-stories)
- [Bundle functional scope](#bundle-functional-scope)
- [Validating the functional spec](#validating-the-functional-spec)
- [Requirement identifiers (`REQ-*`)](#requirement-identifiers-req-)
- [Suggested workflow for contributors](#suggested-workflow-for-contributors)
- [Relationship to Engram / external checklists](#relationship-to-engram--external-checklists)
- [GitHub Spec Kit (summary)](#github-spec-kit-summary)
- [See also](#see-also)

## User stories

| ID | Story | Priority |
|----|-------|----------|
| US-01 | Install and edit Markdown in a form field | P1 |
| US-02 | Named profiles with per-field overrides | P1 |
| US-03 | Link pages, mention people, insert icons with suggestions | P1 |
| US-04 | Per-viewer page titles (*Content not visible*) | P1 |
| US-05 | Rich content: callouts, details, highlights, tables, tasks, Mermaid, math | P2 |
| US-06 | Uploads with progress and errors | P2 |
| US-07 | Accessibility and strict CSP | P1 |
| US-08 | Real-time collaboration (opt-in) | P3 |
| US-09 | Theme tokens and 7 locales | P3 |

## Bundle functional scope

In scope: the form type and widget, the TypeScript editor and its lazy chunks, the Markdown dialect in TS and PHP,
resolver and directive interfaces, Twig filter / function, theme tokens, translations.

Out of scope (non-goals): host endpoints and permission checks, file storage, server-side Yjs, HTML storage. The
`demo/` application illustrates integration and is **not** public API.

## Validating the functional spec

```bash
make test          # PHPUnit (unit + integration)
make test-ts       # Vitest (real editor in jsdom)
make test-e2e      # Playwright + axe + CSP on the demo
make release-check # the full gate
```

## Requirement identifiers (`REQ-*`)

| REQ | Where |
|-----|-------|
| REQ-CFG-001 / 002 | `src/DependencyInjection/Configuration.php`, `src/ProfileRegistry.php`, [CONFIGURATION.md](CONFIGURATION.md#profiles) |
| REQ-TWIG-001 / 002 | `src/DependencyInjection/Compiler/TwigPathsPass.php`, [USAGE.md](USAGE.md#overriding-templates) |
| REQ-TWIG-005 | `.scripts/check-no-raw-html-form.sh`, demo templates |
| REQ-ASSETS-001 / 004 | `vite.config.ts`, `src/Resources/public/`, `NowoMilkdownEditorExtension::prepend()` |
| REQ-UX-001 | `src/Resources/assets/src/index.ts` (`createStimulusController`), ESLint `innerHTML` rule |
| REQ-I18N-001 / 002 / 003 | `src/Resources/translations/`, `.scripts/check-translation-key-parity.py` |
| REQ-TEST-003 / 006 / 008 / 009 | `phpunit.xml.dist`, `vitest.config.ts`, `.scripts/*coverage*` |
| REQ-CS-005 / 006 / 008 | `phpstan.neon.dist`, `igor.json` |
| REQ-SEC-001 / 002 | [SECURITY.md](SECURITY.md) |
| REQ-DEMO-013 | `demo/symfony8/e2e/` |
| REQ-GIT-001 | `.githooks/commit-msg`, `.scripts/check-no-*-coauthor.sh` |

## Suggested workflow for contributors

1. Describe the change as a user story or FR in a new `specs/NNN-*/spec.md` (Spec Kit `/speckit.specify`).
2. Plan and break into tasks (`/speckit.plan`, `/speckit.tasks`).
3. Implement with tests (PHP 100%, TS ≥ 90%), update docs and the code inventory.
4. Run `make release-check`.

## Relationship to Engram / external checklists

[ENGRAM.md](ENGRAM.md) covers the persistent agent memory; the monorepo checklist (`BUNDLES_FULL_SPECS_CHECKLIST.md`)
tracks `REQ-*` compliance across bundles. This file links them to local files instead of repeating them.

## GitHub Spec Kit (summary)

The repository is initialised with Spec Kit for Cursor (`.specify/`, `.cursor/skills/speckit-*`). See
[SPEC-KIT.md](SPEC-KIT.md) for the full manual.

```bash
# Install Specify CLI (once per machine) — see SPEC-KIT.md
uv tool install specify-cli --from git+https://github.com/github/spec-kit.git
```

## See also

- [SPEC-KIT.md](SPEC-KIT.md)
- [ENGRAM.md](ENGRAM.md)
- [specs/001-baseline/spec.md](../specs/001-baseline/spec.md)
