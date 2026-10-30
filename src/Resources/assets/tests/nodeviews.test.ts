import { afterEach, describe, expect, it, vi } from 'vitest';
import { editorViewCtx } from '@milkdown/kit/core';
import type { Node as PmNode } from '@milkdown/kit/prose/model';
import type { EditorView, NodeView, NodeViewConstructor } from '@milkdown/kit/prose/view';
import { ID, editor } from './helpers';
import type { MilkdownEditorHandle } from '../src/editor';
import { lazyFeatures } from '../src/features';
import { katexLoader } from '../src/preview/render';
import { mermaidLoader } from '../src/preview/mermaid';
import { transform } from '../src/dialect/remark-dialect';
import { remarkNowoDialect } from '../src/dialect/remark-dialect';

let handle: MilkdownEditorHandle | null = null;
afterEach(async () => {
  await handle?.destroy();
  handle = null;
  vi.restoreAllMocks();
});

const view = (h: MilkdownEditorHandle): EditorView => h.builder.editor.action((ctx) => ctx.get(editorViewCtx));
const factory = (v: EditorView, name: string): NodeViewConstructor => {
  const views = v.someProp('nodeViews') as Record<string, NodeViewConstructor>;
  return views[name]!;
};
const find = (v: EditorView, predicate: (n: PmNode) => boolean): PmNode => {
  let found: PmNode | null = null;
  v.state.doc.descendants((n) => {
    if (!found && predicate(n)) found = n;
  });
  return found!;
};
const make = (v: EditorView, name: string, node: PmNode, pos: () => number | undefined = () => undefined): NodeView =>
  factory(v, name)(node, v, pos as () => number, [] as never, null as never);

describe('node view contracts', () => {
  it('containers: update, stopEvent and ignoreMutation', async () => {
    handle = await editor(':::callout{type="info"}\nA\n:::\n\n::: {align="center"}\nB\n:::\n\nplain\n');
    const v = view(handle);
    const callout = find(v, (n) => n.type.name === 'containerDirective' && n.attrs.name === 'callout');
    const align = find(v, (n) => n.type.name === 'containerDirective' && n.attrs.name === 'align');
    const paragraph = find(v, (n) => n.type.name === 'paragraph');
    const nv = make(v, 'containerDirective', callout);
    expect(nv.update!(paragraph, [] as never, null as never)).toBe(false);
    expect(nv.update!(align, [] as never, null as never)).toBe(false);
    expect(nv.update!(callout, [] as never, null as never)).toBe(true);
    const header = nv.dom!.querySelector('.nowo-milkdown-directive__header')!;
    expect(nv.stopEvent!({ target: header.firstChild } as unknown as Event)).toBe(true);
    expect(nv.stopEvent!({ target: nv.contentDOM } as unknown as Event)).toBe(false);
    expect(nv.ignoreMutation!({ target: header } as never)).toBe(true);
    expect(nv.ignoreMutation!({ target: nv.contentDOM } as never)).toBe(false);
    const select = header.querySelector('select')!;
    select.value = 'danger';
    select.dispatchEvent(new Event('change'));
    const detached = make(v, 'containerDirective', align, () => 99999);
    const alignSelect = detached.dom!.querySelector('select')!;
    alignSelect.dispatchEvent(new Event('change'));
    expect((detached.dom as HTMLElement).dataset.align).toBe('center');
  });

  it('task items: plain and task views', async () => {
    handle = await editor('* [ ] todo\n* plain\n');
    const v = view(handle);
    const task = find(v, (n) => n.type.name === 'list_item' && n.attrs.checked === false);
    const plain = find(v, (n) => n.type.name === 'list_item' && n.attrs.checked == null);
    const plainView = make(v, 'list_item', plain);
    expect(plainView.contentDOM).toBe(plainView.dom);
    expect(plainView.update!(plain, [] as never, null as never)).toBe(true);
    expect(plainView.update!(task, [] as never, null as never)).toBe(false);
    const taskView = make(v, 'list_item', task);
    expect(taskView.update!(plain, [] as never, null as never)).toBe(false);
    expect(taskView.update!(task, [] as never, null as never)).toBe(true);
    const box = (taskView.dom as HTMLElement).querySelector('input')!;
    expect(taskView.stopEvent!({ target: box } as unknown as Event)).toBe(true);
    expect(taskView.stopEvent!({ target: taskView.dom } as unknown as Event)).toBe(false);
    expect(taskView.ignoreMutation!({ type: 'selection', target: box } as never)).toBe(false);
    expect(taskView.ignoreMutation!({ type: 'attributes', target: box } as never)).toBe(true);
    expect(taskView.ignoreMutation!({ type: 'attributes', target: taskView.dom } as never)).toBe(true);
    expect(taskView.ignoreMutation!({ type: 'childList', target: taskView.contentDOM } as never)).toBe(false);
    box.dispatchEvent(new Event('change'));
    const detached = make(v, 'list_item', task, () => 99999);
    (detached.dom as HTMLElement).querySelector('input')!.dispatchEvent(new Event('change'));
  });

  it('chips without a resolver URL, anchors and unknown icons', async () => {
    handle = await editor(`[[wiki:${ID}]] :tabler-bug:`, { iconSpriteUrl: '/s.svg', icons: ['file-text', 'bug'] });
    const v = view(handle);
    await new Promise((r) => setTimeout(r, 5));
    const ref = v.dom.querySelector('.nowo-milkdown-ref')!;
    expect(ref.querySelector('svg')).not.toBeNull();
    expect(ref.textContent).toBe('Content not visible');
    const wiki = find(v, (n) => n.type.name === 'wikiRef');
    expect((make(v, 'wikiRef', wiki).ignoreMutation as () => boolean)()).toBe(true);
    const icon = find(v, (n) => n.type.name === 'tablerIcon');
    expect((make(v, 'tablerIcon', icon).ignoreMutation as () => boolean)()).toBe(true);
    const leaf = make(v, 'leafDirective', v.state.schema.nodes.leafDirective!.create({ name: 'x', label: '', attributes: '{}' }));
    expect((leaf.ignoreMutation as () => boolean)()).toBe(true);
    expect(leaf.dom!.textContent).toBe('x');
  });
});

describe('remaining branches', () => {
  it('lazy loaders resolve the real modules', async () => {
    expect(typeof (await lazyFeatures.math()).latex).toBe('function');
    expect(typeof (await lazyFeatures.topBar()).topBar).toBe('function');
    expect(typeof (await lazyFeatures.code()).addCodeMirror).toBe('function');
    const mermaid = await mermaidLoader.load();
    expect(typeof mermaid.render).toBe('function');
  });

  it('render: empty elements and a KaTeX module without default export', async () => {
    const render = vi.fn();
    vi.spyOn(katexLoader, 'load').mockResolvedValue({ render });
    const root = document.createElement('div');
    const span = document.createElement('span');
    span.dataset.math = 'inline';
    root.append(span);
    const { renderRichContent } = await import('../src/preview/render');
    await renderRichContent(root);
    expect(render).toHaveBeenCalledWith('', span, expect.objectContaining({ displayMode: false }));
  });

  it('remark plugin without parser / compiler, bare nameless directives and non-string output', () => {
    const data: Record<string, unknown[] | undefined> = {};
    const plugin = remarkNowoDialect.call({ data: () => data });
    expect(typeof plugin).toBe('function');
    const proc = { data: () => ({}) as Record<string, unknown[] | undefined>, compiler: (_tree: unknown, _file: unknown) => ({ not: 'a string' }) as unknown };
    remarkNowoDialect.call(proc as never);
    expect(proc.compiler({}, {})).toEqual({ not: 'a string' });
    const node = { type: 'paragraph', children: [{ type: 'text' }, { type: 'text', value: 'a' }, { type: 'textDirective', name: 'x', attributes: { a: '1' }, children: [] }] };
    transform(node as never);
    expect(node.children[0]).toEqual({ type: 'text', value: 'a' });
  });
});
