import { createHash } from 'node:crypto';
import { cpSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import { tablerIcons } from './vite.icons';

/**
 * Deterministic source hash: a hash of the TypeScript/CSS sources and pnpm-lock.yaml. It only changes when the code or
 * the dependencies change; it is the change detector of buildTimeLabel() below.
 */
function sourceBuildId(dir: string): string {
  const root = new URL(`${dir}/`, import.meta.url);
  const hash = createHash('sha256');
  const files = (readdirSync(root, { recursive: true }) as string[])
    .filter((file) => !file.includes('.test.') && statSync(new URL(file, root)).isFile())
    .sort();
  for (const file of files) {
    hash.update(file).update(readFileSync(new URL(file, root)));
  }
  hash.update(readFileSync(new URL('pnpm-lock.yaml', import.meta.url)));

  return hash.digest('hex').slice(0, 12);
}

/**
 * Readable, reproducible build time for the "script loaded" console line ("2026-11-23 14:05 UTC").
 * The committed `build-info.json` ({ sourceHash, builtAt }) keeps it stable: when the source hash equals the stored
 * one, the stored `builtAt` is reused (a rebuild of unchanged sources never rewrites the committed assets); when it
 * differs, the new hash is stored with the current UTC minute. Commit `build-info.json` with the rebuilt assets: a CI
 * dist-freshness rebuild of a clean checkout then reproduces the same bytes, and fails visibly if it was forgotten.
 */
function buildTimeLabel(dir: string): string {
  const sourceHash = sourceBuildId(dir);
  const file = new URL('build-info.json', import.meta.url);
  let info: { sourceHash?: string; builtAt?: string } = {};
  try {
    info = JSON.parse(readFileSync(file, 'utf8')) as typeof info;
  } catch {
    // Missing or unreadable: written below.
  }
  if (info.sourceHash !== sourceHash || typeof info.builtAt !== 'string') {
    info = { sourceHash, builtAt: `${new Date().toISOString().slice(0, 16)}Z` };
    writeFileSync(file, `${JSON.stringify(info, null, 2)}\n`);
    console.warn(`build-info.json updated (${info.builtAt}): commit it together with the rebuilt assets.`);
  }

  return (info.builtAt as string).replace('T', ' ').replace('Z', ' UTC');
}

/**
 * ES-module library for `assets:install` (REQ-ASSETS-001 / REQ-ASSETS-004).
 * Output: `src/Resources/public/milkdown-editor.js` + `milkdown-editor.css` + lazy `chunks/` (CodeMirror and its
 * languages, KaTeX, Mermaid, collaboration), served through the `nowo_milkdown_editor` asset package.
 */
/** KaTeX's stylesheet and fonts, published as files and linked only when math is used (not inlined in the CSS). */
const katexFiles = () => ({
  name: 'nowo-katex-files',
  closeBundle(): void {
    const from = resolve(__dirname, 'node_modules/katex/dist');
    const to = resolve(__dirname, 'src/Resources/public/katex');
    mkdirSync(to, { recursive: true });
    cpSync(resolve(from, 'katex.min.css'), resolve(to, 'katex.min.css'));
    cpSync(resolve(from, 'fonts'), resolve(to, 'fonts'), { recursive: true, filter: (src) => !/\.(ttf|woff)$/.test(src) });
  },
});

export default defineConfig({
  // 1.7: the Tabler catalog chunk and the sprite shards under icons/.
  plugins: [katexFiles(), tablerIcons(resolve(__dirname, 'src/Resources/public'))],
  // Library mode keeps `process.env.NODE_ENV` (Vue, used by Crepe): the browser has no `process`.
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
    __MILKDOWN_EDITOR_BUILD_TIME__: JSON.stringify(buildTimeLabel('src/Resources/assets/src')),
  },
  build: {
    outDir: 'src/Resources/public',
    emptyOutDir: true,
    cssCodeSplit: false,
    lib: {
      entry: resolve(__dirname, 'src/Resources/assets/src/index.ts'),
      formats: ['es'],
      fileName: () => 'milkdown-editor.js',
      cssFileName: 'milkdown-editor',
    },
    rollupOptions: {
      output: {
        chunkFileNames: 'chunks/[name]-[hash].js',
        // The stylesheet keeps a stable name (Twig links it); fonts and other assets are hashed.
        assetFileNames: (asset) => (asset.names.some((n) => n.endsWith('.css')) ? 'milkdown-editor.css' : 'assets/[name]-[hash][extname]'),
      },
    },
    minify: true,
    sourcemap: false,
    target: 'es2022',
    reportCompressedSize: true,
    chunkSizeWarningLimit: 4000,
  },
});
