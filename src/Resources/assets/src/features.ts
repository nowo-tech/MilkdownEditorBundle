/**
 * The reduced Crepe build (FR-072): only the features the form asks for; CodeMirror (+ language data), KaTeX
 * and Mermaid are separate chunks loaded when enabled. Crepe's list-item, image-block, block-edit, AI and
 * emoji features are never used (list semantics, remote images and alt-text rewriting, mouse-only handles).
 */
import type { CrepeBuilder } from '@milkdown/crepe/builder';
import { cursor } from '@milkdown/crepe/feature/cursor';
import { linkTooltip } from '@milkdown/crepe/feature/link-tooltip';
import { placeholder } from '@milkdown/crepe/feature/placeholder';
import { table } from '@milkdown/crepe/feature/table';
import { toolbar } from '@milkdown/crepe/feature/toolbar';
import { KATEX_STYLESHEET, ensureStylesheet } from './assets';
import { t, type Runtime } from './runtime';
import type { EditorOptions } from './types';

/** Lazy feature modules (separate chunks). */
export const lazyFeatures = {
  code: () => import('./features/code'),
  math: () => import('@milkdown/crepe/feature/latex'),
  topBar: () => import('@milkdown/crepe/feature/top-bar'),
};

export async function addFeatures(builder: CrepeBuilder, options: EditorOptions, runtime: Runtime): Promise<void> {
  const on = new Set(options.features);
  const [code, math, topBar] = await Promise.all([
    on.has('code_mirror') ? lazyFeatures.code() : null,
    on.has('math') ? lazyFeatures.math() : null,
    on.has('top_bar') ? lazyFeatures.topBar() : null,
  ]);
  if (on.has('cursor')) builder.addFeature(cursor);
  if (on.has('placeholder')) builder.addFeature(placeholder, { text: options.placeholder || t(runtime, 'editor.placeholder'), mode: 'doc' });
  if (on.has('link_tooltip')) builder.addFeature(linkTooltip);
  if (on.has('toolbar')) builder.addFeature(toolbar);
  if (on.has('table')) builder.addFeature(table);
  if (topBar) builder.addFeature(topBar.topBar);
  // CodeMirror before LaTeX: the LaTeX preview wraps the code block's renderPreview.
  if (code) code.addCodeMirror(builder, runtime, on.has('mermaid'));
  if (math) {
    ensureStylesheet(KATEX_STYLESHEET, runtime.nonce);
    builder.addFeature(math.latex, {
      katexOptions: { trust: false, strict: 'ignore', maxExpand: 1000, maxSize: 50 },
    });
  }
}
