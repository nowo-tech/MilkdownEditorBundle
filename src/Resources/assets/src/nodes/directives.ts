/**
 * Directive nodes of the FR-075 dialect: containers (callout, details, align and unknown names kept as is),
 * leaf directives (embedded host blocks such as `::beacon{type=issue …}`) and text directives (`:mark[…]`).
 */
import { $markSchema, $nodeSchema, $view } from '@milkdown/kit/utils';
import type { Mark, Node as PmNode } from '@milkdown/kit/prose/model';
import type { EditorView } from '@milkdown/kit/prose/view';
import {
  ALIGNMENTS,
  CALLOUT_TYPES,
  alignment,
  calloutType,
  cleanAttributes,
  decodeAttributes,
  encodeAttributes,
  isDirectiveName,
  markColor,
} from '../dialect/directives';
import type { MdNode } from '../dialect/remark-dialect';
import { runtimeCtx, t, type Runtime } from '../runtime';

const nameOf = (node: MdNode): string => (typeof node.name === 'string' && isDirectiveName(node.name) ? node.name : 'div');
const isLabel = (node: MdNode | undefined): boolean => node?.type === 'paragraph' && node.data?.directiveLabel === true;
const textOf = (node: MdNode): string =>
  typeof node.value === 'string' ? node.value : (node.children ?? []).map(textOf).join('');

export const containerDirectiveSchema = $nodeSchema('containerDirective', () => ({
  group: 'block',
  content: 'block+',
  defining: true,
  attrs: { name: { default: 'callout' }, label: { default: '' }, attributes: { default: '{}' } },
  parseDOM: [
    {
      tag: 'div[data-directive]',
      getAttrs: (dom) => {
        const el = dom as HTMLElement;
        const name = el.dataset.directive ?? '';
        return isDirectiveName(name) ? { name, label: '', attributes: encodeAttributes(decodeAttributes(el.dataset.attributes)) } : false;
      },
    },
  ],
  toDOM: (node: PmNode) => ['div', { 'data-directive': node.attrs.name, 'data-attributes': node.attrs.attributes }, 0],
  parseMarkdown: {
    match: ({ type }) => type === 'containerDirective',
    runner: (state, node, type) => {
      const children = [...(node.children ?? [])] as MdNode[];
      const label = isLabel(children[0]) ? textOf(children.shift()!) : '';
      if (children.length === 0) children.push({ type: 'paragraph', children: [] });
      state
        .openNode(type, { name: nameOf(node as MdNode), label, attributes: encodeAttributes(cleanAttributes(node.attributes)) })
        .next(children as never)
        .closeNode();
    },
  },
  toMarkdown: {
    match: (node) => node.type.name === 'containerDirective',
    runner: (state, node) => {
      state.openNode('containerDirective', undefined, { name: node.attrs.name, attributes: decodeAttributes(node.attrs.attributes) });
      if (node.attrs.label) state.addNode('paragraph', [{ type: 'text', value: node.attrs.label }], undefined, { data: { directiveLabel: true } });
      state.next(node.content).closeNode();
    },
  },
}));

export const leafDirectiveSchema = $nodeSchema('leafDirective', () => ({
  group: 'block',
  atom: true,
  selectable: true,
  attrs: { name: { default: 'block' }, label: { default: '' }, attributes: { default: '{}' } },
  parseDOM: [
    {
      tag: 'div[data-leaf-directive]',
      getAttrs: (dom) => {
        const el = dom as HTMLElement;
        const name = el.dataset.leafDirective ?? '';
        return isDirectiveName(name) ? { name, label: '', attributes: encodeAttributes(decodeAttributes(el.dataset.attributes)) } : false;
      },
    },
  ],
  toDOM: (node: PmNode) => ['div', { 'data-leaf-directive': node.attrs.name, 'data-attributes': node.attrs.attributes }],
  parseMarkdown: {
    match: ({ type }) => type === 'leafDirective',
    runner: (state, node, type) => {
      state.addNode(type, {
        name: nameOf(node as MdNode),
        label: textOf(node as MdNode),
        attributes: encodeAttributes(cleanAttributes(node.attributes)),
      });
    },
  },
  toMarkdown: {
    match: (node) => node.type.name === 'leafDirective',
    runner: (state, node) => {
      state.addNode('leafDirective', node.attrs.label ? [{ type: 'text', value: node.attrs.label }] : [], undefined, {
        name: node.attrs.name,
        attributes: decodeAttributes(node.attrs.attributes),
      });
    },
  },
}));

export const textDirectiveSchema = $markSchema('textDirective', () => ({
  attrs: { name: { default: 'mark' }, attributes: { default: '{}' } },
  inclusive: false,
  parseDOM: [
    {
      tag: 'mark[data-directive]',
      getAttrs: (dom) => {
        const el = dom as HTMLElement;
        const name = el.dataset.directive ?? '';
        return isDirectiveName(name) ? { name, attributes: encodeAttributes(decodeAttributes(el.dataset.attributes)) } : false;
      },
    },
  ],
  toDOM: (mark: Mark) => {
    const attributes = decodeAttributes(mark.attrs.attributes);
    const color = mark.attrs.name === 'mark' ? markColor(attributes) : 'none';
    return [
      'mark',
      {
        'data-directive': mark.attrs.name,
        'data-attributes': mark.attrs.attributes,
        class: `nowo-milkdown-mark nowo-milkdown-mark--${color}`,
      },
    ];
  },
  parseMarkdown: {
    match: (node) => node.type === 'textDirective',
    runner: (state, node, markType) => {
      state.openMark(markType, { name: nameOf(node as MdNode), attributes: encodeAttributes(cleanAttributes(node.attributes)) });
      state.next(node.children);
      state.closeMark(markType);
    },
  },
  toMarkdown: {
    match: (mark) => mark.type.name === 'textDirective',
    runner: (state, mark) => {
      state.withMark(mark, 'textDirective', undefined, { name: mark.attrs.name, attributes: decodeAttributes(mark.attrs.attributes) });
    },
  },
}));

/** A labelled `<select>` (callout type, alignment) for the container header. */
function select(label: string, values: readonly string[], current: string, text: (v: string) => string, onChange: (v: string) => void): HTMLLabelElement {
  const wrap = document.createElement('label');
  wrap.className = 'nowo-milkdown-directive__field';
  const caption = document.createElement('span');
  caption.textContent = label;
  const el = document.createElement('select');
  for (const value of values) {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = text(value);
    option.selected = value === current;
    el.append(option);
  }
  el.addEventListener('change', () => onChange(el.value));
  wrap.append(caption, el);
  return wrap;
}

function setAttribute(view: EditorView, getPos: () => number | undefined, key: string, value: string): void {
  const pos = getPos();
  if (pos === undefined || pos >= view.state.doc.content.size) return;
  const node = view.state.doc.nodeAt(pos);
  if (!node) return;
  const attributes = { ...decodeAttributes(node.attrs.attributes), [key]: value };
  view.dispatch(view.state.tr.setNodeMarkup(pos, undefined, { ...node.attrs, attributes: encodeAttributes(attributes) }));
}

/** Header controls of a container: type of a callout, summary of a details block, alignment. */
export function buildHeader(runtime: Runtime, node: PmNode, view: EditorView, getPos: () => number | undefined): HTMLElement {
  const header = document.createElement('div');
  header.className = 'nowo-milkdown-directive__header';
  header.contentEditable = 'false';
  const attributes = decodeAttributes(node.attrs.attributes);
  const name = node.attrs.name as string;
  if (name === 'callout') {
    header.append(
      select(t(runtime, 'directive.callout_type'), CALLOUT_TYPES, calloutType(attributes), (v) => t(runtime, `directive.callout.${v}`), (v) =>
        setAttribute(view, getPos, 'type', v),
      ),
    );
  } else if (name === 'details') {
    const wrap = document.createElement('label');
    wrap.className = 'nowo-milkdown-directive__field';
    const caption = document.createElement('span');
    caption.textContent = t(runtime, 'directive.summary');
    const input = document.createElement('input');
    input.type = 'text';
    input.value = attributes.summary ?? '';
    input.addEventListener('change', () => setAttribute(view, getPos, 'summary', input.value));
    wrap.append(caption, input);
    header.append(wrap);
  } else if (name === 'align') {
    header.append(select(t(runtime, 'directive.align'), ALIGNMENTS, alignment(attributes), (v) => t(runtime, `directive.align.${v}`), (v) => setAttribute(view, getPos, 'align', v)));
  } else {
    header.textContent = name;
  }
  return header;
}

export const containerDirectiveView = $view(containerDirectiveSchema.node, (ctx) => (initial, view, getPos) => {
  const runtime = ctx.get(runtimeCtx.key);
  const dom = document.createElement('div');
  const contentDOM = document.createElement('div');
  contentDOM.className = 'nowo-milkdown-directive__content';
  let header = buildHeader(runtime, initial, view, getPos);
  const paint = (node: PmNode): void => {
    const attributes = decodeAttributes(node.attrs.attributes);
    const name = node.attrs.name as string;
    dom.className = `nowo-milkdown-directive nowo-milkdown-directive--${name}`;
    dom.dataset.directive = name;
    if (name === 'callout') {
      dom.dataset.type = calloutType(attributes);
      dom.setAttribute('role', 'note');
      dom.setAttribute('aria-label', t(runtime, `directive.callout.${calloutType(attributes)}`));
    } else if (name === 'align') {
      dom.dataset.align = alignment(attributes);
    }
  };
  paint(initial);
  dom.append(header, contentDOM);
  return {
    dom,
    contentDOM,
    update: (node: PmNode) => {
      if (node.type.name !== 'containerDirective' || node.attrs.name !== initial.attrs.name) return false;
      paint(node);
      const next = buildHeader(runtime, node, view, getPos);
      header.replaceWith(next);
      header = next;
      return true;
    },
    stopEvent: (event: Event) => header.contains(event.target as Node),
    ignoreMutation: (mutation: { target: Node }) => !contentDOM.contains(mutation.target),
  };
});

export const leafDirectiveView = $view(leafDirectiveSchema.node, (ctx) => (node) => {
  const runtime = ctx.get(runtimeCtx.key);
  const dom = document.createElement('div');
  dom.className = 'nowo-milkdown-leaf';
  dom.contentEditable = 'false';
  dom.dataset.leafDirective = node.attrs.name;
  dom.setAttribute('role', 'group');
  dom.setAttribute('aria-label', t(runtime, 'directive.block'));
  const attributes = decodeAttributes(node.attrs.attributes);
  const name = document.createElement('strong');
  name.textContent = node.attrs.name;
  const detail = document.createElement('span');
  detail.textContent = [node.attrs.label, ...Object.entries(attributes).map(([k, v]) => `${k}=${v}`)].filter(Boolean).join(' · ');
  dom.append(name, detail);
  return { dom, ignoreMutation: () => true };
});

export const directives = [
  containerDirectiveSchema,
  containerDirectiveView,
  leafDirectiveSchema,
  leafDirectiveView,
  textDirectiveSchema,
].flat();
