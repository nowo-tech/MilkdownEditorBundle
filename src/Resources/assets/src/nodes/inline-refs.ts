/**
 * Inline dialect nodes: page links by id, mentions and Tabler icons (atoms; Markdown keeps their source text).
 */
import { $nodeSchema, $remark, $view } from '@milkdown/kit/utils';
import type { Node as PmNode } from '@milkdown/kit/prose/model';
import { remarkNowoDialect } from '../dialect/remark-dialect';
import { isAnchor, isHandle, isIconName, isUuid } from '../dialect/patterns';
import { iconSvg, runtimeCtx, t } from '../runtime';

export const dialectRemark = $remark('nowoDialect', () => remarkNowoDialect as never);

export const wikiRefSchema = $nodeSchema('wikiRef', () => ({
  group: 'inline',
  inline: true,
  atom: true,
  selectable: true,
  attrs: { pageId: { default: '' }, anchor: { default: '' } },
  parseDOM: [
    {
      tag: 'a[data-wiki-ref]',
      getAttrs: (dom) => {
        const el = dom as HTMLElement;
        const id = el.dataset.wikiRef ?? '';
        const anchor = el.dataset.anchor ?? '';
        return isUuid(id) && isAnchor(anchor) ? { pageId: id, anchor } : false;
      },
    },
  ],
  toDOM: (node: PmNode) => ['a', { 'data-wiki-ref': node.attrs.pageId, 'data-anchor': node.attrs.anchor }, `[[wiki:${node.attrs.pageId}]]`],
  parseMarkdown: {
    match: ({ type }) => type === 'wikiRef',
    runner: (state, node, type) => {
      state.addNode(type, { pageId: node.pageId as string, anchor: (node.anchor as string) ?? '' });
    },
  },
  toMarkdown: {
    match: (node) => node.type.name === 'wikiRef',
    runner: (state, node) => {
      state.addNode('wikiRef', undefined, undefined, { pageId: node.attrs.pageId, anchor: node.attrs.anchor });
    },
  },
}));

export const wikiRefView = $view(wikiRefSchema.node, (ctx) => (node) => {
  const runtime = ctx.get(runtimeCtx.key);
  const dom = document.createElement('a');
  dom.className = 'nowo-milkdown-ref';
  dom.contentEditable = 'false';
  dom.dataset.wikiRef = node.attrs.pageId;
  if (node.attrs.anchor) dom.dataset.anchor = node.attrs.anchor;
  const icon = iconSvg(runtime, 'file-text');
  if (icon) dom.append(icon);
  const label = document.createElement('span');
  label.className = 'nowo-milkdown-ref__label';
  label.textContent = t(runtime, 'ref.loading');
  dom.append(label);
  void runtime.resolvePage(node.attrs.pageId).then((info) => {
    if (info.visible) {
      label.textContent = info.title + (node.attrs.anchor ? ` › ${node.attrs.anchor}` : '');
      if (info.url) dom.href = info.url + (node.attrs.anchor ? `#${node.attrs.anchor}` : '');
    } else {
      dom.classList.add('nowo-milkdown-ref--hidden');
      label.textContent = t(runtime, 'ref.hidden');
      dom.removeAttribute('href');
    }
  });
  return { dom, ignoreMutation: () => true };
});

export const mentionSchema = $nodeSchema('mention', () => ({
  group: 'inline',
  inline: true,
  atom: true,
  selectable: true,
  attrs: { handle: { default: '' } },
  parseDOM: [
    {
      tag: 'span[data-mention]',
      getAttrs: (dom) => {
        const handle = (dom as HTMLElement).dataset.mention ?? '';
        return isHandle(handle) ? { handle } : false;
      },
    },
  ],
  toDOM: (node: PmNode) => ['span', { 'data-mention': node.attrs.handle, class: 'nowo-milkdown-mention' }, `@${node.attrs.handle}`],
  parseMarkdown: {
    match: ({ type }) => type === 'mention',
    runner: (state, node, type) => {
      state.addNode(type, { handle: node.handle as string });
    },
  },
  toMarkdown: {
    match: (node) => node.type.name === 'mention',
    runner: (state, node) => {
      state.addNode('mention', undefined, undefined, { handle: node.attrs.handle });
    },
  },
}));

export const tablerIconSchema = $nodeSchema('tablerIcon', () => ({
  group: 'inline',
  inline: true,
  atom: true,
  selectable: true,
  attrs: { name: { default: '' } },
  parseDOM: [
    {
      tag: 'span[data-tabler]',
      getAttrs: (dom) => {
        const name = (dom as HTMLElement).dataset.tabler ?? '';
        return isIconName(name) ? { name } : false;
      },
    },
  ],
  toDOM: (node: PmNode) => ['span', { 'data-tabler': node.attrs.name, class: 'nowo-milkdown-tabler' }, `:tabler-${node.attrs.name}:`],
  parseMarkdown: {
    match: ({ type }) => type === 'tablerIcon',
    runner: (state, node, type) => {
      state.addNode(type, { name: node.name as string });
    },
  },
  toMarkdown: {
    match: (node) => node.type.name === 'tablerIcon',
    runner: (state, node) => {
      state.addNode('tablerIcon', undefined, undefined, { name: node.attrs.name });
    },
  },
}));

export const tablerIconView = $view(tablerIconSchema.node, (ctx) => (node) => {
  const runtime = ctx.get(runtimeCtx.key);
  const dom = document.createElement('span');
  dom.className = 'nowo-milkdown-tabler';
  dom.dataset.tabler = node.attrs.name;
  const svg = iconSvg(runtime, node.attrs.name);
  if (svg) {
    dom.setAttribute('role', 'img');
    dom.setAttribute('aria-label', node.attrs.name);
    dom.append(svg);
  } else {
    // Unknown names stay text (FR-075): never a remote image, never markup from the name.
    dom.classList.add('nowo-milkdown-tabler--unknown');
    dom.title = t(runtime, 'icon.unknown');
    dom.textContent = `:tabler-${node.attrs.name}:`;
  }
  return { dom, ignoreMutation: () => true };
});

export const inlineRefs = [
  dialectRemark,
  wikiRefSchema,
  wikiRefView,
  mentionSchema,
  tablerIconSchema,
  tablerIconView,
].flat();
