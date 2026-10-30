# Coverage policy

## PHP

- Target and gate: **100%** line coverage of `src/` (`make test-coverage-100`; `make coverage-check` is the ≥ 99%
  gate of REQ-TEST-003).
- Excluded: `src/Resources/` (configuration, templates, translations, built assets) — covered by the integration
  tests that boot a kernel and render the widget.
- Coverage runs on Xdebug (`XDEBUG_MODE=coverage` in the Docker image).

## TypeScript

- Vitest with the V8 provider over `src/Resources/assets/src/**/*.ts` (excluding `types.ts`).
- Gate: ≥ 90% lines, statements and functions, ≥ 85% branches (`vitest.config.ts`); the reported figure is the
  minimum of the four (REQ-TEST-009, `.scripts/ts-coverage-percent.sh`).
- The editor tests run the real Milkdown editor in jsdom; browser-only behaviour (layout, CSP, axe, real keyboard
  focus) is covered by the demo's Playwright suite.
