/**
 * Per-viewer page titles for `[[wiki:<uuid>]]` chips: ids seen in one tick are resolved by one
 * `GET <url>?ids=a,b` (JSON `[{id, title, url, visible}]`); ids the answer leaves out are not visible.
 */
import type { PageInfo, PageResolver } from './runtime';

const MAX_IDS = 50;

export function createPageResolver(url: string | null, fetchImpl: typeof fetch = (...a) => fetch(...a)): {
  resolve: PageResolver;
  remember: (info: PageInfo) => void;
} {
  const cache = new Map<string, Promise<PageInfo>>();
  let queue = new Map<string, (info: PageInfo) => void>();
  let scheduled = false;

  const hidden = (id: string): PageInfo => ({ id, title: '', url: '', visible: false });

  async function flush(): Promise<void> {
    scheduled = false;
    const batch = queue;
    queue = new Map();
    const ids = [...batch.keys()];
    for (let i = 0; i < ids.length; i += MAX_IDS) {
      const chunk = ids.slice(i, i + MAX_IDS);
      let found: PageInfo[] = [];
      try {
        const sep = url!.includes('?') ? '&' : '?';
        const res = await fetchImpl(`${url}${sep}ids=${encodeURIComponent(chunk.join(','))}`, {
          credentials: 'same-origin',
          headers: { Accept: 'application/json' },
        });
        if (res.ok) found = (await res.json()) as PageInfo[];
      } catch {
        found = [];
      }
      for (const id of chunk) {
        const info = Array.isArray(found) ? found.find((p) => p && p.id === id) : undefined;
        batch.get(id)!(
          info && info.visible === true && typeof info.title === 'string'
            ? { id, title: info.title, url: safeUrl(info.url), visible: true }
            : hidden(id),
        );
      }
    }
  }

  return {
    resolve(id: string): Promise<PageInfo> {
      let p = cache.get(id);
      if (!p && !url) return Promise.resolve(hidden(id));
      if (!p) {
        p = new Promise<PageInfo>((done) => queue.set(id, done));
        cache.set(id, p);
        if (!scheduled) {
          scheduled = true;
          queueMicrotask(() => void flush());
        }
      }
      return p;
    },
    remember(info: PageInfo): void {
      cache.set(info.id, Promise.resolve({ ...info, url: safeUrl(info.url) }));
    },
  };
}

/**
 * Keeps relative and http(s) URLs only (never `javascript:` or `data:`).
 *
 * @param value - A URL from an endpoint answer
 * @returns The URL, or '' when it is not safe
 */
export function safeUrl(value: unknown): string {
  if (typeof value !== 'string' || value === '') return '';
  // Protocol-relative forms (`//host`, `/\host`, `\\host`) point at another origin.
  if (/^[\\/][\\/]/.test(value)) return '';
  if (/^(?:\/|\.{1,2}\/|#|\?)/.test(value)) return value;
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:' ? value : '';
  } catch {
    return /^[^:]*$/.test(value) ? value : '';
  }
}
