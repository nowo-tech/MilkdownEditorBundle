# PSR evaluation (REQ-CS-007)

| PSR | Status | Notes |
|-----|--------|-------|
| PSR-1 / PSR-12 | ✅ | Enforced by PHP-CS-Fixer (`@PSR12`, `@Symfony`). |
| PSR-4 | ✅ | `Nowo\MilkdownEditorBundle\` → `src/`, tests → `tests/`. |
| PSR-3 | ✅ | `Psr\Log\LoggerInterface` (optional) for resolver failures in the renderer. |
| PSR-11 | N/A | No container access; constructor injection only. |
| PSR-6 / PSR-16 | N/A | No caching in the bundle (the Markdown environment is built once per service). |
| PSR-7 / PSR-15 / PSR-17 / PSR-18 | N/A | No HTTP messages or clients; Symfony HttpFoundation in the host. |
| PSR-14 | N/A | league/commonmark's own event dispatcher is used internally. |
| PSR-20 | N/A | No time-dependent logic. |
