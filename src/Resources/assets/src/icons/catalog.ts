/**
 * The Tabler outline catalog (1.7, `icon_catalog`): a lazy chunk with every icon name and its search keywords,
 * generated at build time from `@tabler/icons` (MIT) by the `nowo-tabler-icons` Vite plugin. The SVGs themselves are
 * the sprite shards published under `icons/` (never part of this chunk).
 */
import data, { DICT, VERSION } from 'virtual:nowo-tabler-catalog';
import type { IconEntry } from './search';

export { VERSION };

let entries: IconEntry[] | null = null;
let names: Set<string> | null = null;

const CODES = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

/**
 * Parses the compact catalog: `name<TAB>codes<TAB>words` lines, where `codes` are two base-62 characters per word of
 * `dict` (space-separated, the words shared by several icons).
 *
 * @param source - The generated lines
 * @param dict - The generated dictionary
 */
export function parseCatalog(source: string, dict: string): IconEntry[] {
  const words = dict.split(' ');
  return source
    .split('\n')
    .filter(Boolean)
    .map((line) => {
      const [name = '', codes = '', rest = ''] = line.split('\t');
      const keywords: string[] = [];
      for (let i = 0; i + 1 < codes.length; i += 2) {
        const word = words[CODES.indexOf(codes[i]!) * 62 + CODES.indexOf(codes[i + 1]!)];
        if (word) keywords.push(word);
      }
      if (rest) keywords.push(rest);
      return { name, keywords: keywords.join(' ') };
    });
}

/** Every catalog icon, A–Z (parsed once). */
export function catalog(): IconEntry[] {
  entries ??= parseCatalog(data, DICT);
  return entries;
}

/** Whether `name` is a catalog icon. */
export function hasIcon(name: string): boolean {
  names ??= new Set(catalog().map((e) => e.name));
  return names.has(name);
}
