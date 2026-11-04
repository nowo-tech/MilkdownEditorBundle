/**
 * The Tabler outline catalog (1.7, `icon_catalog`): a lazy chunk with every icon name and its search keywords,
 * generated at build time from `@tabler/icons` (MIT) by the `nowo-tabler-icons` Vite plugin. The SVGs themselves are
 * the sprite shards published under `icons/` (never part of this chunk).
 */
import data, { VERSION } from 'virtual:nowo-tabler-catalog';
import type { IconEntry } from './search';

export { VERSION };

let entries: IconEntry[] | null = null;
let names: Set<string> | null = null;

/**
 * Parses `name<TAB>keywords` lines.
 *
 * @param source - The generated catalog text
 */
export function parseCatalog(source: string): IconEntry[] {
  return source
    .split('\n')
    .filter(Boolean)
    .map((line) => {
      const tab = line.indexOf('\t');
      return tab < 0 ? { name: line, keywords: '' } : { name: line.slice(0, tab), keywords: line.slice(tab + 1) };
    });
}

/** Every catalog icon, A–Z (parsed once). */
export function catalog(): IconEntry[] {
  entries ??= parseCatalog(data);
  return entries;
}

/** Whether `name` is a catalog icon. */
export function hasIcon(name: string): boolean {
  names ??= new Set(catalog().map((e) => e.name));
  return names.has(name);
}
