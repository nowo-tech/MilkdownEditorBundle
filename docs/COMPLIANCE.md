# Bundle standards compliance

Checklist of every `REQ-*` of the nowo bundle standards (`BUNDLES_FULL_SPECS_DETAILS.md` in the monorepo) for this
bundle: a form type with TypeScript assets, a Markdown renderer, Twig, translations and a FrankenPHP demo. No
Doctrine, database, controllers, Messenger or admin UI.

**Last audited:** 2026-10-31 · **Tooling:** `make release-check` (all gates below) and the monorepo
`.scripts/audit-bundles-checklist.py` checks run for this bundle only (81 / 81 pass or N/A, GitHub repository
settings included).

Legend: ✅ met · — not applicable (reason given) · ⏳ outside the repository (GitHub settings / monorepo records).

## Docker and demos

| REQ | Status | Evidence |
|-----|--------|----------|
| REQ-DOC-001 | ✅ | `Dockerfile`, `docker-compose.yml` (`name: milkdown-editor-bundle`, service `php`, `coverage-data` volume) |
| REQ-DOC-002 | ✅ | `demo/symfony8/docker-compose.yml` (`name: milkdown-editor-bundle-demo-symfony-8`) |
| REQ-DEMO-001 | ✅ | WebProfiler, DebugBundle, TwigInspectorBundle, HotReloadBundle in dev; `config/packages/dev/nowo_hot_reload.yaml` |
| REQ-DEMO-002 | ✅ | `docker/frankenphp/Caddyfile` (worker, Mercure, hot_reload), `Caddyfile.dev`, [DEMO-FRANKENPHP.md](DEMO-FRANKENPHP.md) |
| REQ-DEMO-003 / REQ-ENV-001 | ✅ | `.env.example` (commented), `.env.test`; `.env` ignored, created by `make up` |
| REQ-DEMO-004 | ✅ | Repository mounted at `/var/milkdown-editor-bundle`, Composer `path` repository |
| REQ-DEMO-005 | ✅ | `PORT=8187`; canonical `up` prints `Demo started at: http://localhost:8187` |
| REQ-DEMO-006 | — | No database container |
| REQ-DEMO-007 | ✅ | `update-bundle` (dump-autoload, assets:install, cache:clear) before demo tests |
| REQ-DEMO-008 | ✅ | README banner + worker mode statement |
| REQ-DEMO-009 | ✅ | `dns: [8.8.8.8, 8.8.4.4]` with comment |
| REQ-DEMO-010 | ✅ | `dunglas/frankenphp:1-php8.5-alpine`, `FRANKENPHP_MODE` in `.env.example`, entrypoint switch |
| REQ-DEMO-011 | — | No database |
| REQ-DEMO-012 | ✅ | `extra.symfony.require: 8.1.*`, Symfony `^8.1`, PHP `>=8.4.1` |
| REQ-DEMO-013 | ✅ | `demo/symfony8/e2e/` (Playwright + axe + CSP, 7 tests), `docs/images/demo/*.webp` in README |
| REQ-GITIGNORE-001 / 002 / 003 | ✅ | Archives block, `.php-cs-fixer.cache`, demo `/.pnpm-store` |

## Package, PHP, configuration

| REQ | Status | Evidence |
|-----|--------|----------|
| REQ-RUNTIME-001 | — | No remote HTTP or processes in the bundle; demo Caddy / PHP timeouts documented |
| REQ-PKG-001 / 002 / 003 / 004 | ✅ | `LICENSE`, `archive.exclude`, attributes only, Packagist metadata; `composer validate --strict` |
| REQ-PHP-001 | ✅ | Typed APIs, `final` / `readonly`, enums `Feature` / `Theme`; PHP 8.2 (no typed class constants) |
| REQ-CFG-001 / 002 | ✅ | `default_profile` + `profiles`, `ProfileRegistry`, [CONFIGURATION.md § Profiles](CONFIGURATION.md#profiles), tests |
| REQ-SF-001 / 002 | ✅ | `php >=8.2 <8.6`, `^7.4 \|\| ^8.0`; CI matrix 7.4 / 8.0 / 8.1 |
| REQ-SF-003 | ✅ | `#[AsTwigFilter]` / `#[AsTwigFunction]`, no ContainerAware |
| REQ-SF-004 | — | No controllers or routes in the bundle (hosts own the endpoints) |
| REQ-SF-005 | ✅ | `SYMFONY_DEPRECATIONS_HELPER=max[direct]=0`, [UPGRADING.md](UPGRADING.md) |
| REQ-SF-006 | ✅ | Strict tree with validation, safe renderer defaults, invalid-config tests |
| REQ-DI-001 | ✅ | Constructor injection, optional `LoggerInterface` |
| REQ-ORM-001 / 002, REQ-MSG-001, REQ-PERF-001 | — | No Doctrine, Messenger or lists |
| REQ-OBS-001 | ✅ | No dumps; resolver failures logged without content |
| REQ-BC-001 | ✅ | Public API listed in [UPGRADING.md](UPGRADING.md) |

## Quality

| REQ | Status | Evidence |
|-----|--------|----------|
| REQ-CS-001 / 002 / 003 / 004 | ✅ | `.php-cs-fixer.dist.php` (src + tests), `rector.php` (PHP 8.2), `phpstan.neon.dist`, `declare(strict_types=1)` |
| REQ-CS-005 / 006 | ✅ | phpstan-frankenphp rulesets, level max, `ignoreErrors: []` — 0 errors |
| REQ-CS-007 | ✅ | [PSR.md](PSR.md) |
| REQ-CS-008 | ✅ | `igor.json`, `make igor` — 0 dangerous services |
| REQ-TEST-001 / 002 / 010 | ✅ | `tests/Unit`, `tests/Integration`, PHPUnit 11 attributes |
| REQ-TEST-003 / 006 | ✅ | PHP 100% lines (`make test-coverage-100`), [COVERAGE.md](COVERAGE.md) |
| REQ-TEST-004 / 005 | — | No Python, no database |
| REQ-TEST-007 / 008 / 009 | ✅ | README: PHP 100%, TS/JS 90.66%, Python N/A; `.scripts/php-coverage-percent.sh`, `.scripts/ts-coverage-percent.sh` |
| REQ-TEST-011 | ✅ | `make demo-smoke`, `.github/workflows/demo-smoke.yml` |

## Makefile and Git

| REQ | Status | Evidence |
|-----|--------|----------|
| REQ-MAKE-001 / 002 | ✅ | Root `Makefile`, `release-check` chain in spec order (+ `lint-ts`, `test-ts`, `bundle-size`) |
| REQ-MAKE-003 / 004 / 006 / 008 / 009 / 010 | ✅ | Demo Makefiles, `validate-translations`, `setup-hooks`, soft `update-deps` include, Compose V2 detection |
| REQ-MAKE-005 / 007 | — | No PoC, no extra dev mode |
| REQ-GIT-001 | ✅ | `.githooks/commit-msg`, `.scripts/check-no-*-coauthor.sh`, CI `git-hygiene`, no AI trailers in history |

## Documentation and Twig

| REQ | Status | Evidence |
|-----|--------|----------|
| REQ-DOCS-001 – 005 | ✅ | Root README + CODE_OF_CONDUCT only, canonical Documentation list, base docs, badges, TOCs |
| REQ-DOCS-008 – 017 | ✅ | ENGRAM, `Found this useful?`, issue / PR templates, CODEOWNERS, spec-driven docs, PascalCase URLs, CoC, English, FrankenPHP banner |
| REQ-DOCS-018 | ✅ | GitHub About set: description, Packagist website, 12 topics (see [RELEASE.md](RELEASE.md)) |
| REQ-DOCS-019 | ✅ | README section order |
| REQ-TWIG-001 / 002 | ✅ | `TwigPathsPass` (override dir first, `@!` namespace), [USAGE.md § Overriding templates](USAGE.md#overriding-templates) |
| REQ-TWIG-003 / 005 | ✅ | Demo renders forms with the child loop; `check-no-raw-html-form` |
| REQ-TWIG-004 | ✅ | `twig/extra-bundle`, `twig/string-extra`, `check-twig-extra` |
| REQ-UI-001 | ✅ | Form theme registered automatically; selection documented |
| REQ-UI-002 / 003 | — | No admin / CRUD pages |
| REQ-I18N-001 / 002 / 003 | ✅ | `NowoMilkdownEditorBundle` domain in en, es, de, fr, it, nl, pt (68 keys, parity checked) |

## Spec Kit, assets, CI, security, IDE

| REQ | Status | Evidence |
|-----|--------|----------|
| REQ-SPECKIT-001 / 002 / 003 | ✅ | `.specify/`, `.cursor/skills/speckit-*`, `specs/001-baseline/` (78/78 units), [SPEC-KIT.md](SPEC-KIT.md) |
| REQ-ASSETS-001 – 004 | ✅ | Vite ES module + lazy chunks in `src/Resources/public/`, English JSDoc, kebab-case files, `nowo_milkdown_editor` asset package |
| REQ-UX-001 | ✅ | Auto-mount + `createStimulusController()`, no `innerHTML` with user data (ESLint rule), listeners cleaned on destroy |
| REQ-CI-001 / 002 | ✅ | `.github/workflows/ci.yml` (tests, coverage 100%, PHPStan, Rector, Igor, Twig, TS lint / tests / size, git-hygiene), `.scrutinizer.yml` |
| REQ-CI-003 | ✅ | CI green on `main`; v1.0.0 released by `release.yml` (Create Release, Demo smoke, Sync Missing Releases green) |
| REQ-REL-001 / 002 / 003 | ✅ | `release.yml`, `sync-releases.yml`, `check-open-prs` (runs once `origin` exists) |
| REQ-RECIPE-001 | ✅ | `.symfony/recipe/nowo-tech/milkdown-editor-bundle/1.0/` |
| REQ-SEC-001 / 002 / 003 / 005 | ✅ | [SECURITY.md](SECURITY.md) (12.4.1 checklist, CSRF N/A), `.github/SECURITY.md` |
| REQ-SEC-004 | ✅ | Pass (good) after fixes ([SECURITY.md § AI security audit](SECURITY.md#ai-security-audit)); row in the monorepo `BUNDLES_SECURITY_ANALYSIS.md` |
| REQ-IDE-001 – 006 | ✅ | `.cursor/mcp.json`, `.cursorignore`, `.cursor/rules/*`, sandbox ignored, CONTRIBUTING Cursor Agent section |
| REQ-GH-001 – 005 | ✅ | Copilot instructions, Dependabot (+ asset rebuild workflow), PR lint, stale |
| REQ-GH-006 – 011 | — | Optional / not used (tag releases, Markdown docs, no backports) |
