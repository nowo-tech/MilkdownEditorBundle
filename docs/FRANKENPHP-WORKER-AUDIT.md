# FrankenPHP worker-mode audit

The bundle is safe in FrankenPHP worker mode (one kernel serving many requests). This page records how.

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
| Host resolvers | ⚠️ host | `PageResolverInterface`, `UserResolverInterface` and `DirectiveRendererInterface` implementations belong to the host: keep them stateless or reset them (`ResetInterface`). |

## Tools

- `make igor` — Igor PHP worker-state audit (`igor.json`), must report 0 dangerous services.
- `make phpstan` — includes the `nowo-tech/phpstan-frankenphp` classic and worker rulesets.

## Rules for contributors

- No static or instance properties written during a request in services.
- Per-request memoization goes on the `Request` or in a service implementing `ResetInterface`.
- New `// @igor-ignore` comments need a reason on the same line.
