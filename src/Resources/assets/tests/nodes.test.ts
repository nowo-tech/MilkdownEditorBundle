import { afterEach, describe, expect, it, vi } from 'vitest';
import { editorViewCtx } from '@milkdown/kit/core';
import { TextSelection } from '@milkdown/kit/prose/state';
import { DOMParser as PmDomParser } from '@milkdown/kit/prose/model';
import { ID, editor, keydown, tick } from './helpers';
import type { MilkdownEditorHandle } from '../src/editor';
import { createStimulusController, instance, mount, mountAll, start, unmount } from '../src/index';
import { addFeatures, lazyFeatures } from '../src/features';
import { tabContext } from '../src/plugins/keyboard';

let handle: MilkdownEditorHandle | null = null;
afterEach(async () => {
  await handle?.destroy();
  handle = null;
  vi.restoreAllMocks();
});

const view = (h: MilkdownEditorHandle) => h.builder.editor.action((ctx) => ctx.get(editorViewCtx));

describe('node views', () => {
  it('container headers edit the attributes', async () => {
    handle = await editor(':::callout{type="info"}\nA\n:::\n\n:::details{summary="S"}\nB\n:::\n\n::: {align="left"}\nC\n:::\n\n:::foo\nD\n:::\n');
    const dom = view(handle).dom;
    const [type, align] = [...dom.querySelectorAll<HTMLSelectElement>('select')];
    type!.value = 'danger';
    type!.dispatchEvent(new Event('change'));
    align!.value = 'right';
    align!.dispatchEvent(new Event('change'));
    const summary = dom.querySelector<HTMLInputElement>('.nowo-milkdown-directive--details input')!;
    summary.value = 'New';
    summary.dispatchEvent(new Event('change'));
    const md = handle.getMarkdown();
    expect(md).toContain(':::callout{type="danger"}');
    expect(md).toContain(':::details{summary="New"}');
    expect(md).toContain('::: {align="right"}');
    expect(md).toContain(':::foo');
    expect(dom.querySelector('.nowo-milkdown-directive--callout')?.getAttribute('aria-label')).toBe('Danger');
    expect(dom.querySelector('.nowo-milkdown-directive--foo .nowo-milkdown-directive__header')?.textContent).toBe('foo');
  });

  it('task checkbox toggles the item; unknown icons stay text', async () => {
    handle = await editor('* [ ] todo\n* plain\n\n:tabler-nope: :mark[x]{color="nope"} :note[y]\n', { icons: ['bug'], iconSpriteUrl: '/s.svg' });
    const dom = view(handle).dom;
    const box = dom.querySelector<HTMLInputElement>('.nowo-milkdown-task__box')!;
    box.checked = true;
    box.dispatchEvent(new Event('change'));
    expect(handle.getMarkdown()).toContain('* [x] todo');
    expect(dom.querySelector('.nowo-milkdown-tabler--unknown')?.textContent).toBe(':tabler-nope:');
    expect(dom.querySelector('mark.nowo-milkdown-mark--yellow')).not.toBeNull();
    expect(dom.querySelector('mark.nowo-milkdown-mark--none')).not.toBeNull();
    expect(handle.getMarkdown()).toContain(':mark[x]{color="nope"}');
  });

  it('pasted HTML of the nodes is read back (parseDOM)', async () => {
    handle = await editor('');
    const v = view(handle);
    const html = document.createElement('div');
    html.innerHTML = `<p><a data-wiki-ref="${ID}" data-anchor="a">x</a><a data-wiki-ref="bad">y</a><span data-mention="ada">@ada</span><span data-mention="bad handle!">z</span><span data-tabler="bug"></span><span data-tabler="Bad"></span><mark data-directive="mark" data-attributes='{"color":"green"}'>m</mark><mark data-directive="Bad">n</mark></p><div data-directive="callout" data-attributes='{"type":"success"}'><p>c</p></div><div data-directive="Bad"><p>d</p></div><div data-leaf-directive="beacon" data-attributes='{"id":"1"}'></div><div data-leaf-directive="Bad"></div>`;
    const doc = PmDomParser.fromSchema(v.state.schema).parse(html);
    v.dispatch(v.state.tr.replaceWith(0, v.state.doc.content.size, doc.content));
    const md = handle.getMarkdown();
    expect(md).toContain(`[[wiki:${ID}#a]]`);
    expect(md).toContain('@ada');
    expect(md).toContain(':tabler-bug:');
    expect(md).toContain(':mark[m]{color="green"}');
    expect(md).toContain(':::callout{type="success"}');
    expect(md).toContain('::beacon{#1}');
  });

  it('tables: Tab moves between cells; tabContext', async () => {
    handle = await editor('| a | b |\n| - | - |\n| 1 | 2 |\n');
    const v = view(handle);
    let cell = 0;
    v.state.doc.descendants((node, pos) => {
      if (!cell && node.type.name === 'paragraph' && node.textContent === 'a') cell = pos + 1;
    });
    v.dispatch(v.state.tr.setSelection(TextSelection.create(v.state.doc, cell)));
    expect(tabContext(v.state)).toBe('table');
    expect(keydown(v.dom, 'Tab').defaultPrevented).toBe(true);
    expect(v.state.selection.$from.parent.textContent).toBe('b');
    const cm = document.createElement('div');
    cm.className = 'cm-editor';
    v.dom.append(cm);
    const reached = vi.fn();
    cm.addEventListener('keydown', reached);
    keydown(cm, 'Tab');
    expect(reached).toHaveBeenCalled();
  });
});

describe('mounting', () => {
  it('mounts once, unmounts, auto-mounts added widgets and offers a Stimulus controller', async () => {
    document.body.innerHTML = '<div data-nowo-milkdown-options="{&quot;features&quot;:[]}"><textarea>Hi</textarea></div><div data-nowo-milkdown-options="{}"></div>';
    const errors = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const roots = [...document.querySelectorAll<HTMLElement>('[data-nowo-milkdown-options]')];
    const ready = vi.fn();
    document.addEventListener('nowo-milkdown:ready', ready);
    const [first, broken] = mountAll();
    expect(mount(roots[0]!)).toBe(first);
    await first;
    await expect(broken).rejects.toThrow();
    await tick(0);
    expect(errors).toHaveBeenCalled();
    expect(instance(roots[1]!)).toBeUndefined();
    expect(ready).toHaveBeenCalledTimes(1);
    await unmount(roots[0]!);
    await unmount(roots[0]!);
    expect(roots[0]!.querySelector('textarea')!.hidden).toBe(false);

    class Base {
      constructor(public element: Element) {}
    }
    const Controller = createStimulusController(Base);
    const c = new Controller(roots[0]!);
    c.connect();
    await instance(roots[0]!);
    c.disconnect();
    await tick(0);

    start(document);
    const added = document.createElement('section');
    added.innerHTML = '<div data-nowo-milkdown-options="{&quot;features&quot;:[]}"><textarea>Later</textarea></div>';
    document.body.append(added);
    const direct = document.createElement('div');
    direct.dataset.nowoMilkdownOptions = '{"features":[]}';
    direct.append(document.createElement('textarea'));
    document.body.append(direct, document.createTextNode('x'));
    await tick(50);
    const later = instance(added.firstElementChild as HTMLElement);
    expect(later).toBeDefined();
    await (await later!).destroy();
    await (await instance(direct)!).destroy();
    document.dispatchEvent(new Event('turbo:load'));
    start(document);
    expect(window.NowoMilkdownEditor?.mount).toBeTypeOf('function');
  });

  it('lazy features load in parallel and the top bar is added', async () => {
    const add = vi.fn();
    const spy = vi.spyOn(lazyFeatures, 'topBar').mockResolvedValue({ topBar: 'TB' } as never);
    await addFeatures({ addFeature: add } as never, { features: ['top_bar', 'cursor'], placeholder: '' } as never, { messages: {} } as never);
    expect(spy).toHaveBeenCalled();
    expect(add.mock.calls.map((c) => c[0])).toContain('TB');
  });
});
