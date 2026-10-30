#!/usr/bin/env node
// Gzip size of the published editor: the entry plus every chunk it imports statically (what a page loads up front),
// then the lazy chunks (CodeMirror + languages, KaTeX, Mermaid, collaboration) loaded only when a feature needs them.
// Fails when the up-front JavaScript exceeds BUDGET_KB (SC-015: 400 kB gzip).
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { dirname, join, resolve } from 'node:path';

const root = resolve(process.argv[2] ?? 'src/Resources/public');
const budget = Number(process.env.BUDGET_KB ?? 400);
const gz = (file) => gzipSync(readFileSync(file), { level: 9 }).length;
const kb = (n) => `${(n / 1024).toFixed(1)} kB`;

const staticImports = (file) => {
  const src = readFileSync(file, 'utf8');
  const out = new Set();
  for (const m of src.matchAll(/(?:^|[;}\s])import\s*(?:[\w${},*\s]+from\s*)?["'](\.{1,2}\/[^"']+)["']/g)) out.add(resolve(dirname(file), m[1]));
  for (const m of src.matchAll(/export\s*[{*][^;]*?from\s*["'](\.{1,2}\/[^"']+)["']/g)) out.add(resolve(dirname(file), m[1]));
  return out;
};

const entry = join(root, 'milkdown-editor.js');
if (!existsSync(entry)) {
  console.error(`missing ${entry}: run make assets`);
  process.exit(1);
}
const upfront = new Set([entry]);
const queue = [entry];
while (queue.length) {
  for (const dep of staticImports(queue.pop())) {
    if (!upfront.has(dep) && existsSync(dep)) {
      upfront.add(dep);
      queue.push(dep);
    }
  }
}
const chunks = readdirSync(join(root, 'chunks')).map((f) => join(root, 'chunks', f));
const lazy = chunks.filter((f) => !upfront.has(f));
const upfrontGz = [...upfront].reduce((t, f) => t + gz(f), 0);
const lazyGz = lazy.reduce((t, f) => t + gz(f), 0);
const css = join(root, 'milkdown-editor.css');
console.log(`entry + static chunks: ${upfront.size} files, ${kb(upfrontGz)} gzip`);
console.log(`stylesheet: ${kb(existsSync(css) ? gz(css) : 0)} gzip`);
console.log(`lazy chunks: ${lazy.length} files, ${kb(lazyGz)} gzip (loaded per feature)`);
const pick = (pattern) => lazy.filter((f) => pattern.test(f)).reduce((t, f) => t + gz(f), 0);
console.log(`  code (CodeMirror): ${kb(pick(/chunks\/(code|code-block)-/))}, KaTeX: ${kb(pick(/chunks\/katex-/))}, collaboration: ${kb(pick(/chunks\/(collab|index)-/))}`);
if (upfrontGz / 1024 > budget) {
  console.error(`ERROR: up-front JavaScript ${kb(upfrontGz)} exceeds the ${budget} kB budget`);
  process.exit(1);
}
console.log(`OK: within the ${budget} kB budget`);
