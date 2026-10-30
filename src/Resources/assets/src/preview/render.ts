/**
 * Read-side rendering of server HTML (FR-086): `pre > code.language-mermaid` blocks become diagrams and
 * `[data-math]` elements (from the PHP renderer) become KaTeX; both libraries load only when needed.
 */
import { KATEX_STYLESHEET, ensureStylesheet } from '../assets';
import { renderMermaid } from './mermaid';

type Katex = { render: (tex: string, el: HTMLElement, options: Record<string, unknown>) => void };

export const katexLoader = {
  load: (): Promise<Katex> => import('katex').then((m) => (m.default ?? m) as unknown as Katex),
};

export type RenderOptions = { nonce?: string; dark?: boolean; diagramLabel?: string };

/** Safe KaTeX options: no `\href` / `\url` (trust off), bounded macro expansion and sizes. */
export const KATEX_OPTIONS = { throwOnError: false, trust: false, strict: 'ignore', maxExpand: 1000, maxSize: 50, output: 'htmlAndMathml' };

/**
 * Renders Mermaid blocks and math in server-rendered Markdown.
 *
 * @param root - The element holding the rendered HTML
 * @param options - CSP nonce, dark theme and the diagrams' accessible name
 * @returns Resolves once every diagram and formula is rendered
 */
export async function renderRichContent(root: ParentNode, options: RenderOptions = {}): Promise<void> {
  const diagrams = [...root.querySelectorAll<HTMLElement>('pre > code.language-mermaid')];
  const maths = [...root.querySelectorAll<HTMLElement>('[data-math]:not([data-math-rendered])')];
  const jobs: Promise<void>[] = diagrams.map(async (code) => {
    const pre = code.parentElement!;
    try {
      const svg = await renderMermaid(code.textContent ?? '', options.nonce ?? '', options.dark === true, options.diagramLabel ?? 'Diagram');
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
          katex.render(el.textContent ?? '', el, { ...KATEX_OPTIONS, displayMode: el.dataset.math === 'block' });
          el.dataset.mathRendered = 'true';
        }
      }),
    );
  }
  await Promise.all(jobs);
}
