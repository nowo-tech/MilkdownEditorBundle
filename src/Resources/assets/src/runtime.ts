/**
 * Per-editor runtime settings shared with node views and plugins through a Milkdown ctx slice.
 */
import { $ctx } from '@milkdown/kit/utils';
import { DEFAULT_MESSAGES, translate } from './i18n';
import type { Messages } from './types';

export type PageInfo = { id: string; title: string; url: string; visible: boolean };
export type PageResolver = (id: string) => Promise<PageInfo>;

export type Runtime = {
  messages: Messages;
  spriteUrl: string | null;
  icons: ReadonlySet<string>;
  resolvePage: PageResolver;
  nonce: string;
  /** Dark rendering of previews (Mermaid theme). */
  dark: () => boolean;
};

export const defaultRuntime = (): Runtime => ({
  messages: DEFAULT_MESSAGES,
  spriteUrl: null,
  icons: new Set<string>(),
  resolvePage: async (id) => ({ id, title: '', url: '', visible: false }),
  nonce: '',
  dark: () => false,
});

export const runtimeCtx = $ctx<Runtime, 'nowoMilkdownRuntime'>(defaultRuntime(), 'nowoMilkdownRuntime');

export const t = (runtime: Runtime, key: string, params: Record<string, string | number> = {}): string =>
  translate(runtime.messages, key, params);

/** `<svg><use href="sprite#tabler-NAME"/></svg>`, built with DOM APIs from an allowlisted name only. */
export function iconSvg(runtime: Runtime, name: string): SVGSVGElement | null {
  if (!runtime.spriteUrl || !runtime.icons.has(name)) return null;
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('class', 'nowo-milkdown-icon');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  const use = document.createElementNS(ns, 'use');
  use.setAttribute('href', `${runtime.spriteUrl}#tabler-${name}`);
  svg.append(use);
  return svg;
}
