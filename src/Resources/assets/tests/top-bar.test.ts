import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { editorViewCtx } from '@milkdown/kit/core';
import { TextSelection } from '@milkdown/kit/prose/state';
import { editor, keydown, tick } from './helpers';
import type { MilkdownEditorHandle } from '../src/editor';
import { addFeatures, lazyFeatures } from '../src/features';
import {
  GROUPED_CLASS,
  OVERFLOW_ATTR,
  TOP_BAR_GROUP_MEDIA_QUERY,
  addTopBar,
  headingOptions,
  watchTopBar,
  type TopBarEntry,
} from '../src/features/top-bar';
import { defaultRuntime, runtimeCtx } from '../src/runtime';

let handle: MilkdownEditorHandle | null = null;
let narrow = true;
/** Right edge of the bar's inner row; its children are 40 px wide each, from 0. */
let innerRight = 200;
const queries: string[] = [];
const realRect = Element.prototype.getBoundingClientRect;

const rect = (left: number, right: number): DOMRect =>
  ({ x: left, y: 0, top: 0, left, right, bottom: 40, width: right - left, height: 40, toJSON: () => ({}) }) as DOMRect;

beforeEach(() => {
  narrow = true;
  innerRight = 200;
  queries.length = 0;
  vi.stubGlobal('matchMedia', (query: string) => {
    queries.push(query);
    return { matches: narrow, addEventListener: () => undefined, removeEventListener: () => undefined };
  });
  Element.prototype.getBoundingClientRect = function (this: Element): DOMRect {
    if (this.classList.contains('top-bar-inner')) return rect(0, innerRight);
    const parent = this.parentElement;
    if (parent?.classList.contains('top-bar-inner')) {
      const i = [...parent.children].indexOf(this);
      return rect(i * 40, i * 40 + 40);
    }
    return rect(0, 0);
  };
});

afterEach(async () => {
  Element.prototype.getBoundingClientRect = realRect;
  vi.unstubAllGlobals();
  await handle?.destroy();
  handle = null;
  document.body.replaceChildren();
});

const view = (h: MilkdownEditorHandle) => h.builder.editor.action((ctx) => ctx.get(editorViewCtx));
const bar = (h: MilkdownEditorHandle) => h.root.querySelector<HTMLElement>('.milkdown-top-bar')!;
const more = (h: MilkdownEditorHandle) => h.root.querySelector<HTMLButtonElement>('.nowo-milkdown-top-bar__more')!;
const openMenu = (h: MilkdownEditorHandle) => [...h.root.querySelectorAll<HTMLElement>('.nowo-milkdown-menu')].find((m) => !m.hidden);
const controls = (h: MilkdownEditorHandle) => [...bar(h).querySelectorAll<HTMLElement>('.top-bar-inner > :not(.top-bar-divider)')];
const keyboardClick = (el: Element) => el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, detail: 0 }));

async function topBarEditor(markdown = 'Hello', messages: Record<string, string> = {}): Promise<MilkdownEditorHandle> {
  handle = await editor(markdown, { features: ['top_bar', 'table'], messages });
  await tick();
  return handle;
}

describe('top bar headings (MUX-41)', () => {
  it('translates the heading selector (Crepe ships English only)', () => {
    const runtime = { ...defaultRuntime(), messages: { 'topbar.paragraph': 'Párrafo', 'topbar.h2': 'Título 2' } };
    const options = headingOptions(runtime);
    expect(options.map((o) => o.level)).toEqual([null, 1, 2, 3, 4, 5, 6]);
    expect(options[0]!.label).toBe('Párrafo');
    expect(options[2]!.label).toBe('Título 2');
    expect(headingOptions(defaultRuntime())[0]!.label).toBe('Paragraph');
  });

  it('collects the controls Crepe renders, in order, with their names', () => {
    const add = vi.fn();
    const entries = addTopBar({ addFeature: add } as never, { ...defaultRuntime(), messages: { 'topbar.bold': 'Negrita' } });
    const config = add.mock.calls[0]![1] as { headingOptions: { label: string }[]; buildTopBar: (b: unknown) => void };
    expect(config.headingOptions[0]!.label).toBe('Paragraph');
    const onRun = vi.fn();
    const activeLabel = vi.fn(() => 'Paragraph');
    config.buildTopBar({
      build: () => [
        { key: 'heading', items: [{ key: 'heading-selector', selector: { options: [{ label: 'Paragraph', onSelect: onRun }], activeLabel } }] },
        { key: 'formatting', items: [{ key: 'bold', onRun }, { key: 'skipped' }, { key: 'custom', onRun }] },
      ],
    });
    expect(entries.map((e) => [e.key, e.group, e.label, e.icon])).toEqual([
      ['heading-selector', 'heading', 'Text style', 'pilcrow'],
      ['bold', 'formatting', 'Negrita', 'bold'],
      ['custom', 'formatting', 'Editor action', undefined],
    ]);
    expect(entries[0]!.options![0]!.run).toBe(onRun);
    expect(entries[0]!.current!({} as never)).toBe('Paragraph');
    expect(entries[1]!.run).toBe(onRun);
  });

  it('the lazy feature module is the bundle wrapper', async () => {
    const add = vi.fn();
    const runtime = defaultRuntime();
    const spy = vi.spyOn(lazyFeatures, 'topBar');
    await addFeatures({ addFeature: add } as never, { features: ['top_bar'], placeholder: '' } as never, runtime);
    expect(spy).toHaveBeenCalled();
    expect(runtime.topBar).toEqual([]);
    expect(add).toHaveBeenCalledTimes(1);
  });
});

describe('top bar overflow on phones (MUX-41)', () => {
  it('keeps one row and hides what does not fit behind an accessible "⋮" button', async () => {
    const h = await topBarEditor();
    expect(queries).toContain(TOP_BAR_GROUP_MEDIA_QUERY);
    expect(bar(h).classList.contains(GROUPED_CLASS)).toBe(true);
    const button = more(h);
    expect(button.hidden).toBe(false);
    expect(button.getAttribute('aria-haspopup')).toBe('menu');
    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(button.getAttribute('aria-label')).toBe('More tools');
    // Children 0..4 fit in 200 px (heading, divider, bold, italic, strikethrough); the rest is hidden.
    const children = [...bar(h).querySelector('.top-bar-inner')!.children];
    expect(children.slice(0, 5).some((el) => el.hasAttribute(OVERFLOW_ATTR))).toBe(false);
    expect(children.slice(5).every((el) => el.hasAttribute(OVERFLOW_ATTR))).toBe(true);
    // Crepe's icon buttons get their names.
    expect(controls(h)[1]!.getAttribute('aria-label')).toBe('Bold');
    expect(controls(h)[1]!.getAttribute('title')).toBe('Bold');
    expect(controls(h)[0]!.querySelector('button')!.getAttribute('aria-haspopup')).toBe('menu');
  });

  it('opens the menu with the hidden controls; Esc closes it and gives the focus back', async () => {
    const h = await topBarEditor();
    more(h).click();
    const menu = openMenu(h)!;
    expect(menu).toBeDefined();
    expect(more(h).getAttribute('aria-expanded')).toBe('true');
    expect(more(h).getAttribute('aria-controls')).toBe(menu.id);
    const ids = [...menu.querySelectorAll<HTMLElement>('[role="menuitem"]')].map((b) => b.dataset.id);
    expect(ids).toContain('top_bar_hr');
    expect(ids).toContain('top_bar_table');
    expect(ids).not.toContain('top_bar_bold');
    expect(menu.querySelectorAll('[role="separator"]').length).toBeGreaterThan(0);
    expect(document.activeElement).toBe(menu.querySelector('[role="menuitem"]'));
    keydown(document.activeElement!, 'Escape');
    expect(openMenu(h)).toBeUndefined();
    expect(more(h).getAttribute('aria-expanded')).toBe('false');
    expect(more(h).hasAttribute('aria-controls')).toBe(false);
    expect(document.activeElement).toBe(more(h));
    // ArrowDown on the button opens it too; a second click closes it.
    keydown(more(h), 'ArrowDown');
    expect(openMenu(h)).toBeDefined();
    keydown(more(h), 'ArrowDown');
    more(h).click();
    expect(openMenu(h)).toBeUndefined();
  });

  it('runs a hidden control from the menu', async () => {
    const h = await topBarEditor();
    const v = view(h);
    v.dispatch(v.state.tr.setSelection(TextSelection.create(v.state.doc, 3)));
    more(h).click();
    openMenu(h)!.querySelector<HTMLButtonElement>('[data-id="top_bar_quote"]')!.click();
    expect(h.getMarkdown()).toContain('> Hello');
    expect(openMenu(h)).toBeUndefined();
  });

  it('offers the heading options when the selector itself overflows', async () => {
    innerRight = 30;
    const h = await topBarEditor('Hello', { 'topbar.h2': 'Título 2', 'topbar.heading': 'Estilo de texto' });
    expect(controls(h)[0]!.hasAttribute(OVERFLOW_ATTR)).toBe(true);
    more(h).click();
    const menu = openMenu(h)!;
    const heading = menu.querySelector<HTMLButtonElement>('[data-id="top_bar_heading-selector"]')!;
    expect(heading.textContent).toContain('Estilo de texto');
    heading.click();
    const sub = document.getElementById(heading.getAttribute('aria-controls')!)!;
    const radios = [...sub.querySelectorAll<HTMLButtonElement>('[role="menuitemradio"]')];
    expect(radios.map((r) => r.getAttribute('aria-checked'))[0]).toBe('true');
    radios.find((r) => r.textContent?.includes('Título 2'))!.click();
    expect(h.getMarkdown()).toContain('## Hello');
  });

  it('a press on the open button closes the menu without reopening it', async () => {
    const h = await topBarEditor();
    more(h).click();
    more(h).dispatchEvent(new Event('pointerdown', { bubbles: true }));
    expect(openMenu(h)).toBeUndefined();
    more(h).click();
    expect(openMenu(h)).toBeUndefined();
    await tick();
    more(h).dispatchEvent(new Event('pointerdown', { bubbles: true }));
    more(h).click();
    expect(openMenu(h)).toBeDefined();
  });

  it('shows no button when everything fits, and Enter / Space run the controls', async () => {
    innerRight = 2000;
    const h = await topBarEditor();
    expect(more(h).hidden).toBe(true);
    expect(bar(h).querySelector(`[${OVERFLOW_ATTR}]`)).toBeNull();
    const v = view(h);
    v.dispatch(v.state.tr.setSelection(TextSelection.create(v.state.doc, 3)));
    // A pointer click (detail 1) is Crepe's own business; a keyboard click runs the control.
    const hr = controls(h).at(-1)!;
    hr.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }));
    expect(h.getMarkdown()).not.toContain('***');
    keyboardClick(hr);
    expect(h.getMarkdown()).toContain('***');
    // The heading selector opens the menu with its options; Esc gives the focus back to it.
    const headingButton = controls(h)[0]!.querySelector('button')!;
    keyboardClick(headingButton);
    const menu = openMenu(h)!;
    expect(headingButton.getAttribute('aria-expanded')).toBe('true');
    expect(menu.querySelectorAll('[role="menuitemradio"]').length).toBe(7);
    keydown(document.activeElement!, 'Escape');
    expect(headingButton.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(headingButton);
    // A keyboard click elsewhere in the bar (the hidden "⋮") does nothing.
    keyboardClick(more(h));
    expect(openMenu(h)).toBeUndefined();
  });

  it('keeps the desktop bar as it is', async () => {
    narrow = false;
    const h = await topBarEditor();
    expect(bar(h).classList.contains(GROUPED_CLASS)).toBe(false);
    expect(more(h).hidden).toBe(true);
    expect(bar(h).querySelector(`[${OVERFLOW_ATTR}]`)).toBeNull();
    expect(controls(h)[1]!.getAttribute('aria-label')).toBe('Bold');
  });

  it('lays out again when Crepe re-renders and cleans up on destroy', async () => {
    const h = await topBarEditor();
    innerRight = 2000;
    view(h).dispatch(view(h).state.tr.insertText('!'));
    bar(h).querySelector('.top-bar-inner')!.append(document.createElement('span'));
    await tick();
    expect(more(h).hidden).toBe(true);
    await handle!.destroy();
    handle = null;
    expect(document.querySelector('.nowo-milkdown-top-bar__more')).toBeNull();
  });

  it('closes an open menu when nothing is hidden any more', async () => {
    const h = await topBarEditor();
    more(h).click();
    expect(openMenu(h)).toBeDefined();
    innerRight = 2000;
    bar(h).querySelector('.top-bar-inner')!.append(document.createElement('span'));
    await tick();
    expect(openMenu(h)).toBeUndefined();
    more(h).click();
    expect(openMenu(h)).toBeUndefined();
  });

  it('does nothing without a bar, and treats a missing matchMedia as desktop', () => {
    const runtime = defaultRuntime();
    const hostRun = { run: vi.fn(), focusEditor: vi.fn() };
    const empty = document.createElement('div');
    watchTopBar(empty, empty, [], runtime, hostRun)();
    vi.stubGlobal('matchMedia', undefined);
    const surface = document.createElement('div');
    const topBar = document.createElement('div');
    topBar.className = 'milkdown-top-bar';
    surface.append(topBar);
    const stop = watchTopBar(surface, surface, [] as TopBarEntry[], runtime, hostRun);
    expect(topBar.classList.contains(GROUPED_CLASS)).toBe(false);
    stop();
    expect(topBar.querySelector('button')).toBeNull();
  });

  it('the runtime of a field without the top bar has none', async () => {
    handle = await editor('x', { features: [] });
    expect(handle.builder.editor.action((ctx) => ctx.get(runtimeCtx.key).topBar)).toBeNull();
    expect(handle.root.querySelector('.nowo-milkdown-top-bar__more')).toBeNull();
  });
});
