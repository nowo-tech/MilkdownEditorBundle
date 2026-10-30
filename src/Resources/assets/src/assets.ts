/**
 * URLs of files published next to the module (`assets:install`): KaTeX's stylesheet and fonts live in `katex/` and are
 * linked only when math is used (a `<link>` to the same origin passes `style-src-elem 'self'`).
 */
let base = '';

/** Called once by the entry with its own URL. */
export const setAssetBase = (url: string): void => {
  base = url;
};

/** Adds `<link rel="stylesheet">` for `path` (relative to the module) once per page. */
export function ensureStylesheet(path: string, nonce = ''): HTMLLinkElement {
  const existing = document.querySelector<HTMLLinkElement>(`link[data-nowo-milkdown="${path}"]`);
  if (existing) return existing;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = new URL(path, base || document.baseURI).href;
  link.dataset.nowoMilkdown = path;
  if (nonce) link.nonce = nonce;
  document.head.append(link);
  return link;
}

export const KATEX_STYLESHEET = 'katex/katex.min.css';
