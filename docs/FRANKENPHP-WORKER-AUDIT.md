# FrankenPHP worker-mode audit

The bundle is safe in FrankenPHP worker mode (one kernel serving many requests), also with the kernel kept alive and
not reset (`FRANKENPHP_RESET_KERNEL=false`) and where the services resetter does not run. This page records how.

## Table of contents

- [Checks](#checks)
- [Tools](#tools)
- [Rules for contributors](#rules-for-contributors)

## Checks

| Area | Result | Notes |
|------|--------|-------|
| Mutable state in shared services | ✅ | Services hold constructor-injected collaborators and configuration only (`final readonly` where possible). |
| Markdown environment | ✅ | `MilkdownMarkdownRenderer` builds its league/commonmark environment once from configuration; per-document data (resolved pages and users) lives on the parsed nodes, never on the service. |
| Translations | ✅ | *Content not visible* is translated at render time, so the request locale is respected. |
| CSP nonce | ✅ | Read from the main request (`RequestAttributeCspNonceProvider`), never cached. |
| Parser objects | ✅ | `MathBlockParser` and `TextDirectiveParser` hold per-document / build-time state (documented `@igor-ignore`). |
| Footnote counters | ✅ | `FootnoteSalt::$renders` / `$salt` (per-page counters that keep footnote ids unique on a page and stable per document) are cleared by `EventListener\WorkerBoundaryResetListener` at the main `kernel.request` and `kernel.terminate`, Messenger `WorkerMessageReceived` / `Handled` / `Failed` and `console.command` / `console.terminate` (1.16.1), and by `kernel.reset`. Up to 1.16.0 only `kernel.reset` cleared them, so where the services resetter does not run (host that removes or bypasses `services_resetter` or drives `http_kernel` directly, `messenger:consume --no-reset`, long console commands; stock `Kernel::handle()` runs the resetter before every request, also with `FRANKENPHP_RESET_KERNEL=false`) a document got other ids on each later render and the map grew. Worker test: `tests/Integration/KeptAliveWorkerTest.php` (one kernel, `http_kernel` handle / terminate without the resetter, N = 1,000 requests alternating two users' notes, ids identical per note, memory margin 2 MiB; N = 500 Messenger / console units; a boundary never builds the renderer). Fails on 1.16.0. |
| Host resolvers | ⚠️ host | `PageResolverInterface`, `UserResolverInterface` and `DirectiveRendererInterface` implementations belong to the host: keep them stateless or reset them (`ResetInterface`). |

## Tools

- `make igor` — Igor PHP worker-state audit (`igor.json`), must report 0 dangerous services.
- `make phpstan` — includes the `nowo-tech/phpstan-frankenphp` classic and worker rulesets.

## Rules for contributors

- No static or instance properties written during a request in services.
- Per-request memoization goes on the `Request` or in a service implementing `ResetInterface` **and** cleared at the
  request / Messenger / console boundaries (`WorkerBoundaryResetListener`): `kernel.reset` alone is not enough
  (REQ-RUNTIME-002).
- New `// @igor-ignore` comments need a reason on the same line.
