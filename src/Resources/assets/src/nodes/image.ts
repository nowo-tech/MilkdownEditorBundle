/**
 * Images (1.9): host references (ME-5) and the `image_block` feature.
 *
 * - The commonmark `image` node gains `width` and `align` attributes, read from and written to the attribute block
 *   `![alt](src "caption"){width=50% align=center}` (`dialect/image.ts`); the title is the caption. Markdown round trips
 *   whatever the feature: without `image_block` the attributes are kept but not shown.
 * - The node view (only with host schemes or `image_block`; other fields keep Milkdown's `<img>`) resolves host
 *   references (`host-file:<id>`) through the scheme's `image` template. A value of an allow-listed scheme that cannot be
 *   resolved, an unsafe URL or an image that fails to load shows *Image not available*.
 * - With `image_block`: caption under the image, width (classes, or CSSOM for px) and alignment, and — while the image
 *   is selected — a toolbar with the alt text, the caption, width and alignment buttons. *Edit image…* in the block and
 *   context menus selects the image and moves the focus to the toolbar (the keyboard path); Escape returns to the text.
 */
import { imageSchema } from '@milkdown/kit/preset/commonmark';
import { $view } from '@milkdown/kit/utils';
import { NodeSelection, type EditorState } from '@milkdown/kit/prose/state';
import type { Node as PmNode } from '@milkdown/kit/prose/model';
import type { EditorView } from '@milkdown/kit/prose/view';
import { IMAGE_ALIGNMENTS, IMAGE_PERCENTS, imageAlign, imageWidth, serialiseImageAttributes } from '../dialect/image';
import { targetUrl, type HostSchemes } from '../host';
import { runtimeCtx, t, type Runtime } from '../runtime';
import type { MenuItem } from '../ui/menu';

/** Raster `data:` images the renderer also keeps (never SVG). */
const DATA_IMAGE = /^data:image\/(?:png|gif|jpe?g|webp)[;,]/i;

/** The URL an image loads, or '' when it must not load. */
export function imageSource(src: unknown, schemes: HostSchemes): string {
  return typeof src === 'string' && DATA_IMAGE.test(src) ? src : targetUrl(src, 'image', schemes);
}

/** The image schema with `width` and `align` (1.9). */
export const imageAttributesSchema = imageSchema.extendSchema((prev) => (ctx) => {
  const base = prev(ctx);
  return {
    ...base,
    attrs: { ...base.attrs, width: { default: '', validate: 'string' }, align: { default: '', validate: 'string' } },
    // The serialised HTML (clipboard) stays as Milkdown's: width and align are not HTML attributes of the source here.
    toDOM: (node) => {
      const [tag, attrs] = base.toDOM!(node) as [string, Record<string, unknown>];
      const { width: _width, align: _align, ...rest } = attrs;
      return [tag, rest];
    },
    parseMarkdown: {
      match: base.parseMarkdown.match,
      runner: (state, node, type) => {
        const data = (node.data ?? {}) as { nowoImage?: { width?: string; align?: string } };
        state.addNode(type, {
          src: node.url as string,
          alt: (node.alt as string | null) ?? '',
          title: (node.title as string | null) ?? '',
          width: imageWidth(data.nowoImage?.width),
          align: imageAlign(data.nowoImage?.align),
        });
      },
    },
    toMarkdown: {
      match: base.toMarkdown.match,
      runner: (state, node) => {
        state.addNode('image', undefined, undefined, { title: node.attrs.title, url: node.attrs.src, alt: node.attrs.alt });
        const block = serialiseImageAttributes({ width: node.attrs.width as string, align: node.attrs.align as string });
        if (block) state.addNode('text', undefined, block);
      },
    },
  };
});

function field(label: string, onChange: (v: string) => void, leave: () => void): { wrap: HTMLLabelElement; input: HTMLInputElement } {
  const wrap = document.createElement('label');
  wrap.className = 'nowo-milkdown-image__field';
  const caption = document.createElement('span');
  caption.textContent = label;
  const input = document.createElement('input');
  input.type = 'text';
  input.maxLength = 500;
  input.addEventListener('change', () => onChange(input.value));
  input.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      leave();
    } else if (event.key === 'Enter') {
      event.preventDefault();
      onChange(input.value);
    }
  });
  wrap.append(caption, input);
  return { wrap, input };
}

function toggles(label: string, values: readonly string[], text: (v: string) => string, onPick: (v: string) => void, leave: () => void): { group: HTMLElement; press: (current: string) => void } {
  const group = document.createElement('span');
  group.className = 'nowo-milkdown-image__group';
  group.setAttribute('role', 'group');
  group.setAttribute('aria-label', label);
  const buttons = values.map((value) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'nowo-milkdown-image__toggle';
    button.textContent = text(value);
    button.addEventListener('click', () => onPick(value));
    button.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        leave();
      }
    });
    group.append(button);
    return { button, value };
  });
  return {
    group,
    press: (current) => buttons.forEach(({ button, value }) => button.setAttribute('aria-pressed', String(value === current))),
  };
}

/** The editing toolbar of a selected image (`image_block`); it stays in place across updates, so focus is kept. */
function toolbar(runtime: Runtime, view: EditorView, getPos: () => number | undefined): { el: HTMLElement; sync: (node: PmNode) => void; focus: () => void } {
  const set = (attrs: Record<string, string>): void => {
    const pos = getPos();
    const node = pos === undefined ? null : view.state.doc.nodeAt(pos);
    if (pos === undefined || !node || node.type.name !== 'image') return;
    const tr = view.state.tr.setNodeMarkup(pos, undefined, { ...node.attrs, ...attrs });
    view.dispatch(tr.setSelection(NodeSelection.create(tr.doc, pos)));
  };
  const leave = (): void => view.focus();
  const el = document.createElement('span');
  el.className = 'nowo-milkdown-image__toolbar';
  el.contentEditable = 'false';
  const alt = field(t(runtime, 'image.alt'), (value) => set({ alt: value }), leave);
  const caption = field(t(runtime, 'image.caption'), (value) => set({ title: value }), leave);
  const width = toggles(t(runtime, 'image.width'), ['', ...IMAGE_PERCENTS], (v) => (v === '' ? t(runtime, 'image.width_original') : v), (v) => set({ width: v }), leave);
  const align = toggles(t(runtime, 'image.align'), IMAGE_ALIGNMENTS, (v) => t(runtime, `image.align_${v}`), (v) => set({ align: v }), leave);
  el.append(alt.wrap, caption.wrap, width.group, align.group);
  return {
    el,
    focus: () => alt.input.focus(),
    sync: (node) => {
      if (document.activeElement !== alt.input) alt.input.value = node.attrs.alt as string;
      if (document.activeElement !== caption.input) caption.input.value = node.attrs.title as string;
      width.press(imageWidth(node.attrs.width));
      align.press(imageAlign(node.attrs.align));
    },
  };
}

export const imageView = $view(imageAttributesSchema.node, (ctx) => (initial, view, getPos) => {
  const runtime = ctx.get(runtimeCtx.key);
  const blocks = runtime.features.has('image_block');
  const dom = document.createElement('span');
  const content = document.createElement('span');
  content.className = 'nowo-milkdown-image__content';
  dom.append(content);
  let node = initial;
  let bar: ReturnType<typeof toolbar> | null = null;

  const hidden = (): void => {
    const note = document.createElement('span');
    note.className = 'nowo-milkdown-image__hidden';
    note.textContent = t(runtime, 'image.hidden');
    content.querySelector('img')?.replaceWith(note);
    if (!content.contains(note)) content.prepend(note);
  };
  const paint = (): void => {
    content.replaceChildren();
    const src = imageSource(node.attrs.src, runtime.hostSchemes);
    const width = blocks ? imageWidth(node.attrs.width) : '';
    const align = blocks ? imageAlign(node.attrs.align) : '';
    dom.className = ['nowo-milkdown-image', align ? `nowo-milkdown-image--${align}` : '', width.endsWith('%') ? `nowo-milkdown-image--w${width.slice(0, -1)}` : '', dom.classList.contains('ProseMirror-selectednode') ? 'ProseMirror-selectednode' : '']
      .filter(Boolean)
      .join(' ');
    if (src) {
      const img = document.createElement('img');
      img.alt = node.attrs.alt as string;
      if (node.attrs.title && !blocks) img.title = node.attrs.title as string;
      img.setAttribute('loading', 'lazy');
      // CSSOM, not an inline style attribute: allowed under a strict style-src-attr.
      if (width.endsWith('px')) img.style.width = width;
      img.addEventListener('error', hidden);
      img.src = src;
      content.append(img);
    } else {
      hidden();
    }
    if (blocks && node.attrs.title) {
      const caption = document.createElement('span');
      caption.className = 'nowo-milkdown-image__caption';
      caption.textContent = node.attrs.title as string;
      content.append(caption);
    }
    bar?.sync(node);
  };
  paint();

  return {
    dom,
    update: (next: PmNode) => {
      if (next.type !== initial.type) return false;
      const changed = !next.sameMarkup(node);
      node = next;
      if (changed) paint();
      return true;
    },
    selectNode: () => {
      dom.classList.add('ProseMirror-selectednode');
      if (blocks && view.editable && !bar) {
        bar = toolbar(runtime, view, getPos);
        bar.sync(node);
        dom.append(bar.el);
      }
    },
    deselectNode: () => {
      dom.classList.remove('ProseMirror-selectednode');
      bar?.el.remove();
      bar = null;
    },
    stopEvent: (event: Event) => !!bar && bar.el.contains(event.target as Node),
    ignoreMutation: () => true,
  };
});

/** The image a block action applies to: the selected one, or the only content of the paragraph around the caret. */
export function imageAt(state: EditorState): { pos: number; node: PmNode } | null {
  const { selection } = state;
  if (selection instanceof NodeSelection && selection.node.type.name === 'image') return { pos: selection.from, node: selection.node };
  const { $from } = selection;
  const only = $from.parent.childCount === 1 ? $from.parent.firstChild : null;
  return only?.type.name === 'image' ? { pos: $from.start(), node: only } : null;
}

/**
 * *Edit image…* of the block and context menus (`image_block`): selects the image and focuses its toolbar.
 *
 * @param view - The editor
 * @param runtime - Labels and features
 */
export function imageItems(view: EditorView, runtime: Runtime): MenuItem[] {
  if (!view.editable || !runtime.features.has('image_block')) return [];
  const image = imageAt(view.state);
  if (!image) return [];
  return [
    {
      id: 'image_edit',
      label: t(runtime, 'menu.image_edit'),
      run: () => {
        view.dispatch(view.state.tr.setSelection(NodeSelection.create(view.state.doc, image.pos)));
        queueMicrotask(() => view.dom.querySelector<HTMLInputElement>('.nowo-milkdown-image__toolbar input')?.focus());
      },
    },
  ];
}
