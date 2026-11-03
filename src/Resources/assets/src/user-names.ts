/**
 * Display names of mentioned people (`mention_display: name`, 1.2.1): handles seen in one tick are resolved by one
 * `GET <url>?handles=a,b` (JSON `[{handle, name}]`); names picked from the `@` suggestions are remembered. A handle
 * without a name keeps showing `@handle`.
 */
import type { UserResolver } from './runtime';

const MAX_HANDLES = 50;

export function createUserResolver(url: string | null, fetchImpl: typeof fetch = (...a) => fetch(...a)): {
  resolve: UserResolver;
  remember: (handle: string, name: string) => void;
} {
  const cache = new Map<string, Promise<string | null>>();
  let queue = new Map<string, (name: string | null) => void>();
  let scheduled = false;

  async function flush(): Promise<void> {
    scheduled = false;
    const batch = queue;
    queue = new Map();
    const handles = [...batch.keys()];
    for (let i = 0; i < handles.length; i += MAX_HANDLES) {
      const chunk = handles.slice(i, i + MAX_HANDLES);
      let found: unknown = [];
      try {
        const sep = url!.includes('?') ? '&' : '?';
        const res = await fetchImpl(`${url}${sep}handles=${encodeURIComponent(chunk.join(','))}`, {
          credentials: 'same-origin',
          headers: { Accept: 'application/json' },
        });
        if (res.ok) found = await res.json();
      } catch {
        found = [];
      }
      const rows = Array.isArray(found) ? (found as { handle?: unknown; name?: unknown }[]) : [];
      for (const handle of chunk) {
        const row = rows.find((r) => r && r.handle === handle);
        const name = row && typeof row.name === 'string' && row.name.trim() !== '' ? row.name : null;
        batch.get(handle)!(name);
      }
    }
  }

  return {
    resolve(handle: string): Promise<string | null> {
      let p = cache.get(handle);
      if (!p && !url) return Promise.resolve(null);
      if (!p) {
        p = new Promise<string | null>((done) => queue.set(handle, done));
        cache.set(handle, p);
        if (!scheduled) {
          scheduled = true;
          queueMicrotask(() => void flush());
        }
      }
      return p;
    },
    remember(handle: string, name: string): void {
      if (name.trim() !== '') cache.set(handle, Promise.resolve(name));
    },
  };
}
