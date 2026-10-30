# Demo with FrankenPHP (development and production)

The demo under `demo/symfony8` runs Symfony 8.1 on [FrankenPHP](https://frankenphp.dev/) (PHP 8.5) with Caddy, in
**worker mode** by default. It shows the editor exactly as an integrator ships it: the form theme renders the widget,
the bundle's ES module and stylesheet come from `public/bundles/nowomilkdowneditor/` (`assets:install`), and every
response carries a strict, nonce-based Content Security Policy.

## Table of contents

- [What the demo contains](#what-the-demo-contains)
- [Start in development](#start-in-development)
- [Worker or classic mode (FRANKENPHP_MODE)](#worker-or-classic-mode-frankenphp_mode)
- [Production-like run](#production-like-run)
- [Smoke check and e2e](#smoke-check-and-e2e)
- [Troubleshooting](#troubleshooting)

## What the demo contains

- `/` — a form with a title, a **wiki** field (profile `wiki`: CodeMirror, math, Mermaid, slash menu, tables,
  `[[` page links, `@` mentions, `:` icons, uploads) and a **comment** field (profile `comment`). *Save* renders the
  stored Markdown with the PHP renderer (`milkdown_markdown` filter) next to the source.
- `/api/pages`, `/api/pages/titles`, `/api/users`, `/api/upload` — the JSON endpoints the editor calls; one page is
  "forbidden" for the viewer and always shows *Content not visible*.
- `src/EventSubscriber/ContentSecurityPolicySubscriber.php` — the strict policy (`script-src 'self' 'nonce-…'`,
  `style-src-elem 'self' 'nonce-…'`) and the nonce on the `csp_nonce` request attribute, which the bundle's default
  `RequestAttributeCspNonceProvider` reads.
- WebProfiler, Debug, [TwigInspectorBundle](https://github.com/nowo-tech/TwigInspectorBundle) and
  [HotReloadBundle](https://github.com/nowo-tech/HotReloadBundle) in `dev`.

## Start in development

```bash
make -C demo up          # or: cd demo/symfony8 && make up
```

`make up` copies `.env.example` to `.env` when missing, starts the container, runs `composer install` (the bundle
comes from the mounted repository through a Composer `path` repository at `/var/milkdown-editor-bundle`), publishes
the assets and prints `Demo started at: http://localhost:8187`. Change `PORT` in `.env` when 8187 is taken.

After changing the bundle's PHP, Twig or built assets:

```bash
make -C demo/symfony8 update-bundle   # dump-autoload + assets:install + cache:clear
```

Rebuild the TypeScript with `make assets` at the bundle root first.

## Worker or classic mode (FRANKENPHP_MODE)

`FRANKENPHP_MODE` in `.env` selects the Caddyfile at container start (no rebuild needed, recreate the container with
`docker compose up -d`):

| Value | Caddyfile | Behaviour |
|-------|-----------|-----------|
| `worker` (default) | `docker/frankenphp/Caddyfile` | The kernel boots once; workers restart when PHP, Twig, YAML or bundle files change (`watch`). |
| `classic` | `docker/frankenphp/Caddyfile.dev` | One PHP process per request; simplest for debugging. |

Any other value stops the entrypoint with an error. Both Caddyfiles enable `mercure` and `hot_reload`. The bundle
keeps no request state in services (see [FRANKENPHP-WORKER-AUDIT.md](FRANKENPHP-WORKER-AUDIT.md)).

## Production-like run

Set `APP_ENV=prod` and `APP_DEBUG=0` in `.env`, then:

```bash
cd demo/symfony8
docker compose up -d
docker compose exec php php bin/console cache:clear --env=prod
```

The CSP stays the same in both environments; in `dev` the WebProfiler adds its own nonces to the policy.

## Smoke check and e2e

```bash
make -C demo/symfony8 verify     # HTTP 200 on http://127.0.0.1:$PORT/ (REQ-TEST-011)
make demo-smoke                  # from the bundle root: up → 200 → down
make test-e2e                    # Playwright + axe + CSP against the running demo
make -C demo/symfony8 demo-screenshots   # refresh docs/images/demo/*.webp
```

## Troubleshooting

### Browser console: 404 on `milkdown-editor.js`

The module is served from `public/bundles/nowomilkdowneditor/` (symlink created by `assets:install`). Run
`make -C demo/symfony8 assets-install`; at the bundle root, `make assets` must have built
`src/Resources/public/milkdown-editor.js`.

### CSP violations in the console

The editor needs the response nonce for CodeMirror and Mermaid styles. Check that the page sets the `csp_nonce`
request attribute (or that `CspNonceProviderInterface` is aliased to your provider) and that the widget's
`<script type="module">` carries the same nonce.

### Composer cannot reach Packagist

The demo's `docker-compose.yml` sets public DNS servers for the PHP service; on restricted networks configure your
proxy or mirror in `~/.composer/config.json`.
