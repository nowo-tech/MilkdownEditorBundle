# MilkdownEditorBundle Constitution

## Core Principles

### I. Documented integrator contract
Product behavior lives in `specs/001-baseline/spec.md`, `docs/SPEC-DRIVEN-DEVELOPMENT.md`, and integrator docs (`USAGE.md`, `CONFIGURATION.md`, `ARCHITECTURE.md`, `SECURITY.md`). The demo is illustrative unless promoted in the spec.

### II. Spec-first, test-proven
PHPUnit, PHPStan, Vitest and the demo's Playwright suite are the mechanical proof. Behavioral changes require tests.

### III. 100% code inventory traceability
Every production unit under `src/` (PHP, Twig, translation YAML, TypeScript sources, the stylesheet) appears in `specs/001-baseline/code-inventory.md`. The Vite output under `src/Resources/public/` is documented as `FR-BUILD-*`, not extra rows. New files require inventory updates in the same PR.

### IV. Markdown is the source of truth
Values are stored as Markdown of one dialect, shared by the TypeScript editor and the PHP renderer. References (pages, people, icons) are stored by id, handle or name and resolved per viewer; titles are never stored. Both implementations change together.

### V. Safe by default
Raw HTML is escaped, unsafe links dropped, remote images not loaded; hidden pages never leak titles; the editor works under a strict nonce-based CSP and never inserts user data as HTML. The host owns endpoints and permission checks.

### VI. Accessible by default
WCAG 2.1 AA: named controls, list semantics, contrast, visible focus, no keyboard trap. axe reports no serious or critical violation in the demo.

### VII. Cursor + Spec Kit
GitHub Spec Kit is initialized with **Cursor Agent** (`cursor-agent`). Skills live in `.cursor/skills/speckit-*`.

### VIII. Symfony compatibility
Follow declared PHP/Symfony ranges in `composer.json` and README badges. FrankenPHP worker mode: no per-request state in services. See `docs/FRANKENPHP-WORKER-AUDIT.md`.

## Governance
Amendments update this file, the baseline spec when principles affect behavior, and `CHANGELOG.md` when consumer-visible.

Versioning (SemVer): **MAJOR** when a principle is removed or redefined incompatibly; **MINOR** when a principle or section is added or materially expanded; **PATCH** for clarifications and factual corrections that do not change intent.

**Version**: 1.0.0 | **Ratified**: 2026-10-30 | **Last Amended**: 2026-10-30
