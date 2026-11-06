/**
 * Per-editor runtime settings shared with node views and plugins through a Milkdown ctx slice.
 */
import { $ctx } from '@milkdown/kit/utils';
import { DEFAULT_MESSAGES, translate } from './i18n';
import type { Messages } from './types';
import { isIconName } from './dialect/patterns';
import type { InsertItem } from './commands/insert';

export type PageInfo = { id: string; title: string; url: string; visible: boolean };
export type PageResolver = (id: string) => Promise<PageInfo>;
/** Display name of a mentioned handle, or null when unknown (1.2.1). */
export type UserResolver = (handle: string) => Promise<string | null>;

export type Runtime = {
  messages: Messages;
  spriteUrl: string | null;
  icons: ReadonlySet<string>;
  /** 1.7 `icon_catalog`: directory of the bundled Tabler sprite shards (`…/icons/`), or null without the catalog. */
  catalogUrl: string | null;
  /** 1.7 `menu_icons`: glyphs before the labels of menus and the `/` list. */
  menuIcons: boolean;
  resolvePage: PageResolver;
  resolveUser: UserResolver;
  /** Enabled features of the field (1.4: plugins read it, e.g. the *Color* items). */
  features: ReadonlySet<string>;
  /** Colours offered by the colour menus (1.4: `markdown.mark_colors`); empty: the whole palette. */
  colors: readonly string[];
  nonce: string;
  /** 1.6 `comments`: starts a comment on the selection (null without the feature or the create right). */
  comment: (() => void) | null;
  /** Dark rendering of previews (Mermaid theme). */
  dark: () => boolean;
  /** 1.5 `insert_menu`: the *Insert* group of the context menu, filled once the editor is created. */
  insert: InsertItem[];
  /** 1.8: opens the file picker and uploads at the caret (`/file`); null without uploads or when read-only. */
  pickFiles: ((view: import('@milkdown/kit/prose/view').EditorView) => void) | null;
};

export const defaultRuntime = (): Runtime => ({
  messages: DEFAULT_MESSAGES,
  spriteUrl: null,
  icons: new Set<string>(),
  catalogUrl: null,
  menuIcons: true,
  resolvePage: async (id) => ({ id, title: '', url: '', visible: false }),
  resolveUser: async () => null,
  features: new Set<string>(),
  colors: [],
  nonce: '',
  comment: null,
  dark: () => false,
  insert: [],
  pickFiles: null,
});

export const runtimeCtx = $ctx<Runtime, 'nowoMilkdownRuntime'>(defaultRuntime(), 'nowoMilkdownRuntime');

export const t = (runtime: Runtime, key: string, params: Record<string, string | number> = {}): string =>
  translate(runtime.messages, key, params);

/** Sprite shard of a catalog icon: one file per first character (`tabler-a.svg`, `tabler-3.svg`). */
export const catalogShard = (name: string): string => `tabler-${name.charAt(0)}.svg`;

/**
 * Where the symbol `tabler-NAME` lives: the host sprite for an allowlisted name, else the bundled catalog shard (1.7,
 * `icon_catalog`, name syntax only: node views check the catalog itself), else null (the shortcode stays text).
 */
export function iconHref(runtime: Runtime, name: string): string | null {
  if (runtime.spriteUrl && runtime.icons.has(name)) return `${runtime.spriteUrl}#tabler-${name}`;
  if (runtime.catalogUrl && isIconName(name)) return `${runtime.catalogUrl}${catalogShard(name)}#tabler-${name}`;
  return null;
}

/** Whether the icon picker has anything to offer (1.7): allowlisted icons or the catalog. */
export const pickerAvailable = (runtime: Runtime): boolean => runtime.icons.size > 0 || runtime.catalogUrl !== null;

/** `<svg><use href="sprite#tabler-NAME"/></svg>`, built with DOM APIs from an allowlisted or catalog name only. */
export function iconSvg(runtime: Runtime, name: string): SVGSVGElement | null {
  const href = iconHref(runtime, name);
  if (!href) return null;
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('class', 'nowo-milkdown-icon');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  const use = document.createElementNS(ns, 'use');
  use.setAttribute('href', href);
  svg.append(use);
  return svg;
}
