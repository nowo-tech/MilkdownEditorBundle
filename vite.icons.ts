import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { Plugin } from 'vite';

/**
 * Tabler outline icons (1.7, `icon_catalog`), from the `@tabler/icons` package (MIT, © Paweł Kuna):
 *
 * - the virtual module `virtual:nowo-tabler-catalog` (lazy `icons/catalog` chunk): one `name<TAB>keywords` line per
 *   icon, keywords = category + Tabler tags not already in the name;
 * - at build time, `icons/tabler-<first character>.svg` sprite shards with `<symbol id="tabler-NAME">`, the names list
 *   `icons/tabler-outline.json` (read by the PHP renderer) and `icons/LICENSE-tabler.txt`, under the output directory.
 */
export const CATALOG_ID = 'virtual:nowo-tabler-catalog';
const RESOLVED = `\0${CATALOG_ID}`;
const NAME = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
/** Path data only (numbers, commands, separators): nothing else reaches the sprites. */
const PATH = /^[MmLlHhVvCcSsQqTtAaZz0-9 .,eE+-]+$/;

type IconNode = [string, Record<string, string>];
type IconMeta = { category?: string; tags?: (string | number)[] };

export type TablerData = { version: string; nodes: Record<string, IconNode[]>; meta: Record<string, IconMeta>; license: string };

/** Reads the installed `@tabler/icons` package (its `exports` only expose the SVG files, so by path). */
export function readTabler(dir: string = resolve(process.cwd(), 'node_modules/@tabler/icons')): TablerData {
  const read = (file: string): string => readFileSync(resolve(dir, file), 'utf8');
  return {
    version: (JSON.parse(read('package.json')) as { version: string }).version,
    nodes: JSON.parse(read('tabler-nodes-outline.json')) as Record<string, IconNode[]>,
    meta: JSON.parse(read('icons.json')) as Record<string, IconMeta>,
    license: read('LICENSE'),
  };
}

/** Valid icon names, sorted. */
export const iconNames = (data: TablerData): string[] => Object.keys(data.nodes).filter((n) => NAME.test(n)).sort();

/** The catalog text: `name<TAB>keywords` lines. */
export function catalogText(data: TablerData): string {
  return iconNames(data)
    .map((name) => {
      const meta = data.meta[name] ?? {};
      const inName = new Set(name.split('-'));
      const words = [meta.category ?? '', ...(meta.tags ?? []).map(String)]
        .map((w) => w.toLowerCase().replace(/[\t\n]/g, ' ').trim())
        .filter((w) => w !== '' && !inName.has(w));
      return `${name}\t${[...new Set(words)].join(' ')}`.trimEnd();
    })
    .join('\n');
}

/** One `<symbol>` with the icon's paths (the stroke attributes Tabler uses, so it renders without the stylesheet). */
function symbol(name: string, nodes: IconNode[]): string {
  const paths = nodes
    .filter(([tag, attrs]) => tag === 'path' && typeof attrs.d === 'string' && PATH.test(attrs.d))
    .map(([, attrs]) => `<path d="${attrs.d}"/>`)
    .join('');
  return `<symbol id="tabler-${name}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths}</symbol>`;
}

/** Sprite shards by first character of the name. */
export function spriteShards(data: TablerData): Map<string, string> {
  const shards = new Map<string, string[]>();
  for (const name of iconNames(data)) {
    const key = name.charAt(0);
    const list = shards.get(key) ?? [];
    list.push(symbol(name, data.nodes[name]!));
    shards.set(key, list);
  }
  return new Map([...shards].map(([key, symbols]) => [key, `<svg xmlns="http://www.w3.org/2000/svg">${symbols.join('')}</svg>\n`]));
}

/**
 * The Vite plugin.
 *
 * @param outDir - Build output directory (the shards go to `<outDir>/icons/`); null: no files (Vitest)
 */
export function tablerIcons(outDir: string | null = null): Plugin {
  let data: TablerData | null = null;
  const load = (): TablerData => (data ??= readTabler());
  return {
    name: 'nowo-tabler-icons',
    resolveId: (id) => (id === CATALOG_ID ? RESOLVED : null),
    load(id) {
      if (id !== RESOLVED) return null;
      const d = load();
      return `export const VERSION = ${JSON.stringify(d.version)};\nexport default ${JSON.stringify(catalogText(d))};\n`;
    },
    closeBundle() {
      if (!outDir) return;
      const d = load();
      const dir = resolve(outDir, 'icons');
      mkdirSync(dir, { recursive: true });
      for (const [key, svg] of spriteShards(d)) writeFileSync(resolve(dir, `tabler-${key}.svg`), svg);
      writeFileSync(resolve(dir, 'tabler-outline.json'), `${JSON.stringify({ version: d.version, names: iconNames(d) })}\n`);
      writeFileSync(resolve(dir, 'LICENSE-tabler.txt'), `Tabler Icons ${d.version} (outline), https://tabler.io/icons\n\n${d.license}`);
    },
  };
}
