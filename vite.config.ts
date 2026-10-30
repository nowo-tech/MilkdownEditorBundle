import { cpSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

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
  plugins: [katexFiles()],
  // Library mode keeps `process.env.NODE_ENV` (Vue, used by Crepe): the browser has no `process`.
  define: { 'process.env.NODE_ENV': JSON.stringify('production') },
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
