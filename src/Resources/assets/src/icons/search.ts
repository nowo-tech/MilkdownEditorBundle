/**
 * Search of the icon picker and the `:` suggestions (1.7): ranks icon names and their keywords (Tabler tags and
 * category) against a query. Pure functions, shared by the picker and catalog chunks.
 */

/** One searchable icon: its Tabler name and lower-case keywords separated by spaces. */
export type IconEntry = { name: string; keywords: string };

export type SearchResult = { names: string[]; total: number };

/** Lower-case words of a query (spaces, hyphens and underscores separate them). */
const terms = (query: string): string[] => query.toLowerCase().split(/[\s_-]+/).filter(Boolean);

function score(entry: IconEntry, joined: string, words: string[]): number {
  const { name } = entry;
  if (name === joined) return 0;
  if (name.startsWith(joined)) return 1;
  if (name.includes(`-${joined}`)) return 2;
  if (name.includes(joined)) return 3;
  const haystack = `${name.replace(/-/g, ' ')} ${entry.keywords}`;
  if (!words.every((w) => haystack.includes(w))) return -1;
  return words.every((w) => ` ${haystack}`.includes(` ${w}`)) ? 4 : 5;
}

/**
 * Ranks `entries` for `query`: exact name, name prefix, word prefix inside the name, name substring, then keyword
 * matches (every word must match). An empty query keeps the given order.
 *
 * @param entries - Candidates in their default order (allowlist first, then the catalog A–Z)
 * @param query - What the user typed
 * @param limit - Largest number of names returned
 * @returns The best names and the number of matches
 */
export function searchIcons(entries: readonly IconEntry[], query: string, limit: number): SearchResult {
  const words = terms(query);
  if (!words.length) return { names: entries.slice(0, limit).map((e) => e.name), total: entries.length };
  const joined = words.join('-');
  const ranked: { name: string; score: number; index: number }[] = [];
  entries.forEach((entry, index) => {
    const s = score(entry, joined, words);
    if (s >= 0) ranked.push({ name: entry.name, score: s, index });
  });
  ranked.sort((a, b) => a.score - b.score || a.index - b.index);
  return { names: ranked.slice(0, limit).map((r) => r.name), total: ranked.length };
}

/**
 * Merges the host allowlist and the catalog without duplicates (allowlisted names first, keeping catalog keywords).
 *
 * @param allowlist - The field's `icons`
 * @param catalog - Catalog entries (empty without `icon_catalog`)
 */
export function mergeEntries(allowlist: Iterable<string>, catalog: readonly IconEntry[]): IconEntry[] {
  const byName = new Map(catalog.map((e) => [e.name, e]));
  const out: IconEntry[] = [];
  const seen = new Set<string>();
  for (const name of allowlist) {
    if (seen.has(name)) continue;
    seen.add(name);
    out.push(byName.get(name) ?? { name, keywords: '' });
  }
  for (const entry of catalog) if (!seen.has(entry.name)) out.push(entry);
  return out;
}
