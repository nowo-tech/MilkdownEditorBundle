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
import { MAX_TEX_EXPAND, guardKatex, type Katex } from './preview/render';
import { editorViewCtx } from '@milkdown/kit/core';
import { t, type Runtime } from './runtime';
import type { EditorOptions } from './types';

/** Lazy feature modules (separate chunks). */
export const lazyFeatures = {
  code: () => import('./features/code'),
  math: () => import('@milkdown/crepe/feature/latex'),
  katex: () => import('katex'),
  topBar: () => import('@milkdown/crepe/feature/top-bar'),
  colors: () => import('./commands/colors'),
};

/** Static icon of the toolbar's colour button ("A" over a bar); markup from the bundle, never from user data. */
export const COLOR_ICON =
  '<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 16l5-12 5 12"/><path d="M9 11h6"/><path d="M4 20h16"/></svg>';

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
  if (on.has('toolbar')) {
    // 1.4 `colors`: one more toolbar button opening the text / background colour menu (a lazy chunk).
    builder.addFeature(
      toolbar,
      on.has('colors')
        ? {
            buildToolbar: (group) => {
              group.addGroup('nowo-color', t(runtime, 'menu.color')).addItem('color', {
                icon: COLOR_ICON,
                label: t(runtime, 'menu.color'),
                active: () => false,
                onRun: (ctx) => {
                  const view = ctx.get(editorViewCtx);
                  void lazyFeatures.colors().then((m) => m.openColorMenu(view, runtime));
                },
              });
            },
          }
        : undefined,
    );
  }
  if (on.has('table')) builder.addFeature(table);
  if (topBar) builder.addFeature(topBar.topBar);
  // CodeMirror before LaTeX: the LaTeX preview wraps the code block's renderPreview.
  if (code) code.addCodeMirror(builder, runtime, on.has('mermaid'));
  if (math) {
    // Crepe's inline math and block preview call KaTeX directly: bound them like the read side (TeX length / depth).
    const katex = await lazyFeatures.katex();
    guardKatex((katex.default ?? katex) as unknown as Katex);
    ensureStylesheet(KATEX_STYLESHEET, runtime.nonce);
    builder.addFeature(math.latex, {
      katexOptions: { trust: false, strict: 'ignore', maxExpand: MAX_TEX_EXPAND, maxSize: 50, macros: {} },
    });
  }
}
