import { afterEach, describe, expect, it, vi } from 'vitest';
import { editorViewCtx } from '@milkdown/kit/core';
import { TextSelection } from '@milkdown/kit/prose/state';
import { ID, editor, keydown, tick, widget } from './helpers';
import { createEditor, isDark, normaliseNewlines } from '../src/editor';
import type { MilkdownEditorHandle } from '../src/editor';

let handle: MilkdownEditorHandle | null = null;
afterEach(async () => {
  await handle?.destroy();
  handle = null;
});

const view = (h: MilkdownEditorHandle) => h.builder.editor.action((ctx) => ctx.get(editorViewCtx));

describe('createEditor', () => {
  it('round trips the dialect and GFM without churn', async () => {
    const md = [
      '# Title',
      '',
      `Ask @ada about [[wiki:${ID}#setup]] :tabler-bug: and :mark[this *bit*]{color="green"}.`,
      '',
      ':::callout{type="warning"}',
      'Careful.',
      ':::',
      '',
      ':::details{summary="More"}',
      'Hidden.',
      ':::',
      '',
      '::: {align="center"}',
      'Centred.',
      ':::',
      '',
      '::beacon{#42 type="issue"}',
      '',
      '* [ ] todo',
      '* [x] done',
      '',
      '| a | b |',
      '| - | - |',
      '| 1 | 2 |',
      '',
      'Meet at 10:30.',
      '',
    ].join('\n');
    handle = await editor(md, { icons: ['bug'], iconSpriteUrl: '/s.svg' });
    const first = handle.getMarkdown();
    handle.setMarkdown(first);
    expect(handle.getMarkdown()).toBe(first);
    for (const piece of [`[[wiki:${ID}#setup]]`, '@ada', ':tabler-bug:', ':mark[this *bit*]{color="green"}', ':::callout{type="warning"}', '::: {align="center"}', '::beacon{#42 type="issue"}', '10:30']) {
      expect(first).toContain(piece);
    }
    const dom = view(handle).dom;
    expect(dom.getAttribute('role')).toBe('textbox');
    expect(dom.getAttribute('aria-multiline')).toBe('true');
    expect(dom.getAttribute('aria-labelledby')).toBe('f_body_label');
    expect(dom.querySelector('.nowo-milkdown-mention')?.textContent).toBe('@ada');
    expect(dom.querySelector('.nowo-milkdown-tabler svg use')?.getAttribute('href')).toBe('/s.svg#tabler-bug');
    expect(dom.querySelector('.nowo-milkdown-directive--callout')?.getAttribute('role')).toBe('note');
    expect(dom.querySelector('.nowo-milkdown-directive--details input')).not.toBeNull();
    expect(dom.querySelector('.nowo-milkdown-leaf')?.textContent).toContain('beacon');
    expect(dom.querySelectorAll('li.nowo-milkdown-task input[type="checkbox"]')).toHaveLength(2);
    expect(dom.querySelector('ul > li')).not.toBeNull();
    expect(handle.textarea.hidden).toBe(true);
  });

  it('page links resolve per viewer (visible, hidden)', async () => {
    const fetchMock = vi.fn(async () => new Response(JSON.stringify([{ id: ID, title: 'Install', url: '/wiki/install', visible: true }])));
    vi.stubGlobal('fetch', fetchMock);
    const other = 'c0ffee00-1234-4abc-8def-001122334455';
    handle = await editor(`[[wiki:${ID}#a]] [[wiki:${other}]]`, { linkTitleUrl: '/titles' });
    await tick(10);
    const refs = view(handle).dom.querySelectorAll('.nowo-milkdown-ref');
    expect(refs[0]?.textContent).toBe('Install › a');
    expect(refs[0]?.getAttribute('href')).toBe('/wiki/install#a');
    expect(refs[1]?.textContent).toBe('Content not visible');
    expect(refs[1]?.hasAttribute('href')).toBe(false);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    vi.unstubAllGlobals();
  });

  it('writes the Markdown back to the textarea and on submit', async () => {
    handle = await editor('Hello', { readonly: false });
    const v = view(handle);
    v.dispatch(v.state.tr.insertText(' world', v.state.doc.content.size - 1));
    await tick(400);
    expect(handle.textarea.value).toContain('Hello world');
    handle.textarea.value = 'stale';
    handle.textarea.form!.dispatchEvent(new Event('submit'));
    expect(handle.textarea.value).toContain('Hello world');
  });

  it('Tab leaves the editor outside lists and nests inside them', async () => {
    handle = await editor('* one\n* two\n\nplain\n');
    const v = view(handle);
    const plain = v.state.doc.content.size - 2;
    v.dispatch(v.state.tr.setSelection(TextSelection.create(v.state.doc, plain)));
    expect(keydown(v.dom, 'Tab').defaultPrevented).toBe(false);
    let secondItem = 0;
    v.state.doc.descendants((node, pos) => {
      if (node.isTextblock && node.textContent === 'two') secondItem = pos + 1;
    });
    v.dispatch(v.state.tr.setSelection(TextSelection.create(v.state.doc, secondItem)));
    expect(keydown(v.dom, 'Tab').defaultPrevented).toBe(true);
    expect(handle.getMarkdown()).toMatch(/\* one\n {2,4}\* two/);
    expect(keydown(v.dom, 'Tab', { shiftKey: true }).defaultPrevented).toBe(true);
    expect(keydown(v.dom, 'Tab', { ctrlKey: true }).defaultPrevented).toBe(false);
  });

  it('readonly, dark theme, no label and the action buttons', async () => {
    const root = widget('x', { readonly: true, theme: 'dark', minHeight: '20rem', icons: ['bug'], upload: { url: '/up' } }, false);
    handle = await createEditor(root);
    expect(root.dataset.theme).toBe('dark');
    expect(isDark(root)).toBe(true);
    expect(root.style.getPropertyValue('--nowo-milkdown-min-height')).toBe('20rem');
    expect(view(handle).dom.getAttribute('aria-readonly')).toBe('true');
    expect(view(handle).dom.getAttribute('aria-label')).toBe('Content');
    expect(root.querySelector('.nowo-milkdown__actions')).toBeNull();
  });

  it('the icon button inserts the trigger and the upload button opens a picker', async () => {
    handle = await editor('word', { icons: ['bug'], upload: { url: '/up', accept: ['image/*'] } });
    const buttons = handle.root.querySelectorAll<HTMLButtonElement>('.nowo-milkdown__action');
    expect([...buttons].map((b) => b.textContent)).toEqual(['Insert file', 'Insert icon']);
    const v = view(handle);
    v.dispatch(v.state.tr.setSelection(TextSelection.create(v.state.doc, v.state.doc.content.size - 1)));
    buttons[1]!.click();
    expect(v.state.doc.textContent).toBe('word :');
    const click = vi.spyOn(HTMLInputElement.prototype, 'click').mockImplementation(() => undefined);
    buttons[0]!.click();
    expect(click).toHaveBeenCalled();
  });

  it('fails without a textarea, normalises newlines, auto theme', async () => {
    const root = document.createElement('div');
    await expect(createEditor(root)).rejects.toThrow('no textarea');
    expect(normaliseNewlines('a\r\nb\rc')).toBe('a\nb\nc');
    const auto = document.createElement('div');
    auto.dataset.theme = 'auto';
    const host = document.createElement('section');
    host.dataset.theme = 'dark';
    host.append(auto);
    expect(isDark(auto)).toBe(true);
    const light = document.createElement('div');
    light.dataset.theme = 'light';
    expect(isDark(light)).toBe(false);
    const lone = document.createElement('div');
    lone.dataset.theme = 'auto';
    vi.stubGlobal('matchMedia', () => ({ matches: true }));
    expect(isDark(lone)).toBe(true);
    vi.unstubAllGlobals();
  });
});
