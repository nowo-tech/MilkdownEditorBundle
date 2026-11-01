/**
 * Read-side rendering of server HTML (FR-086): `pre > code.language-mermaid` blocks become diagrams and
 * `[data-math]` elements (from the PHP renderer) become KaTeX; both libraries load only when needed.
 */
import { KATEX_STYLESHEET, ensureStylesheet } from '../assets';
import { renderMermaid } from './mermaid';

export type Katex = {
  render: (tex: string, el: HTMLElement, options: Record<string, unknown>) => void;
  renderToString?: (tex: string, options: Record<string, unknown>) => string;
};

export const katexLoader = {
  load: (): Promise<Katex> => import('katex').then((m) => guardKatex((m.default ?? m) as unknown as Katex)),
};

export type RenderOptions = { nonce?: string; dark?: boolean; diagramLabel?: string; allowRemoteImages?: boolean };

/** Longest TeX source rendered, in characters (longer formulas stay as text). */
export const MAX_TEX_LENGTH = 5000;

/**
 * Deepest nesting rendered: `{…}` groups (including `^{…}` / `_{…}` scripts and command arguments), `\left…\right`
 * and `\begin…\end`. KaTeX recurses per level; about 160 nested superscripts crash the browser tab outright.
 */
export const MAX_TEX_DEPTH = 50;

/**
 * Whether a formula is small enough to hand to KaTeX.
 *
 * @param tex - TeX source
 * @returns False when it is too long or nested too deeply
 */
export function texWithinLimits(tex: string): boolean {
  if (tex.length > MAX_TEX_LENGTH) return false;
  let depth = 0;
  for (const [token] of tex.matchAll(/\\(?:left|begin)(?![a-z])|\\(?:right|end)(?![a-z])|\\[\s\S]|[{}]/gi)) {
    if (token === '{' || /^\\(?:left|begin)$/i.test(token)) {
      if (++depth > MAX_TEX_DEPTH) return false;
    } else if (token === '}' || /^\\(?:right|end)$/i.test(token)) {
      depth = Math.max(0, depth - 1);
    }
  }
  return true;
}

const guarded = new WeakSet<object>();

/**
 * Makes `katex.render` / `renderToString` refuse formulas over the limits and swallow any error (a `RangeError`
 * escapes `throwOnError: false`). The module object is shared, so this also covers the editor's LaTeX (Crepe's inline
 * math and block preview call the same functions). A refused formula keeps its source as text with
 * `data-math-error`.
 *
 * @param katex - The KaTeX module object (patched in place, once)
 * @returns The same object
 */
export function guardKatex<K extends Katex>(katex: K): K {
  if (guarded.has(katex)) return katex;
  guarded.add(katex);
  const render = katex.render.bind(katex);
  katex.render = (tex, el, options) => {
    try {
      if (!texWithinLimits(tex)) throw new RangeError('formula too large');
      render(tex, el, options);
    } catch {
      el.textContent = tex;
      el.setAttribute('data-math-error', 'true');
    }
  };
  const toString = katex.renderToString?.bind(katex);
  if (toString) {
    katex.renderToString = (tex, options) => {
      try {
        if (!texWithinLimits(tex)) throw new RangeError('formula too large');
        return toString(tex, options);
      } catch {
        const span = document.createElement('span');
        span.setAttribute('data-math-error', 'true');
        span.textContent = tex;
        return span.outerHTML;
      }
    };
  }
  return katex;
}

/** Safe KaTeX options: no `\href` / `\url` (trust off), bounded macro expansion and sizes. */
export const KATEX_OPTIONS = { throwOnError: false, trust: false, strict: 'ignore', maxExpand: 1000, maxSize: 50, output: 'htmlAndMathml' };

/**
 * Renders Mermaid blocks and math in server-rendered Markdown.
 *
 * @param root - The element holding the rendered HTML
 * @param options - CSP nonce, dark theme, the diagrams' accessible name and whether diagrams may load remote images
 * @returns Resolves once every diagram and formula is rendered; a failing diagram or formula is marked as an error
 *   (`nowo-md-mermaid--error`, `data-math-error`) and keeps its source text
 */
export async function renderRichContent(root: ParentNode, options: RenderOptions = {}): Promise<void> {
  const diagrams = [...root.querySelectorAll<HTMLElement>('pre > code.language-mermaid')];
  const maths = [...root.querySelectorAll<HTMLElement>('[data-math]:not([data-math-rendered])')];
  const jobs: Promise<void>[] = diagrams.map(async (code) => {
    const pre = code.parentElement!;
    try {
      const svg = await renderMermaid(
        code.textContent ?? '',
        options.nonce ?? '',
        options.dark === true,
        options.diagramLabel ?? 'Diagram',
        options.allowRemoteImages === true,
      );
      const figure = document.createElement('figure');
      figure.className = 'nowo-md-mermaid';
      figure.append(svg);
      pre.replaceWith(figure);
    } catch {
      pre.classList.add('nowo-md-mermaid--error');
    }
  });
  if (maths.length) {
    ensureStylesheet(KATEX_STYLESHEET, options.nonce ?? '');
    jobs.push(
      katexLoader.load().then((katex) => {
        for (const el of maths) {
          const tex = el.textContent ?? '';
          try {
            if (!texWithinLimits(tex)) throw new RangeError('formula too large');
            katex.render(tex, el, { ...KATEX_OPTIONS, displayMode: el.dataset.math === 'block' });
          } catch {
            // One bad formula (e.g. a stack overflow KaTeX does not catch) must not stop the others.
            el.textContent = tex;
            el.dataset.mathError = 'true';
          }
          el.dataset.mathRendered = 'true';
        }
      }),
    );
  }
  await Promise.all(jobs);
}
