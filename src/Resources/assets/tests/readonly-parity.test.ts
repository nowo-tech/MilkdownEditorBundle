/**
 * 1.17 (Wiki UX review items 7 and 8): the read-only editor draws callouts like the server render (no header
 * controls) and task checkboxes disabled, and both follow the editor switching between read-only and editable.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { editorViewCtx } from '@milkdown/kit/core';
import type { EditorView } from '@milkdown/kit/prose/view';
import { editor, tick } from './helpers';
import type { MilkdownEditorHandle } from '../src/editor';
import { lazyIcons } from '../src/icons/open';
import { onEditableChange } from '../src/plugins/editable';

let handle: MilkdownEditorHandle | null = null;
afterEach(async () => {
  await handle?.destroy();
  handle = null;
  vi.restoreAllMocks();
});

const view = (h: MilkdownEditorHandle): EditorView => h.builder.editor.action((ctx) => ctx.get(editorViewCtx));
const q = <T extends Element = HTMLElement>(h: MilkdownEditorHandle, selector: string): T | null => h.root.querySelector<T>(selector);
const settle = async (): Promise<void> => {
  for (let i = 0; i < 6; i++) await tick(40);
};

describe('read-only callouts', () => {
  it('have no header and carry the server classes', async () => {
    handle = await editor(':::callout{type="warning"}\nText\n:::\n', { readonly: true });
    const callout = q(handle, '.nowo-milkdown-directive--callout')!;
    expect(callout.querySelector('.nowo-milkdown-directive__header')).toBeNull();
    expect(callout.querySelector('select, button, input')).toBeNull();
    expect(callout.classList.contains('nowo-md-callout')).toBe(true);
    expect(callout.classList.contains('nowo-md-callout--warning')).toBe(true);
    expect(callout.classList.contains('nowo-md-callout--icon')).toBe(false);
    expect(callout.getAttribute('role')).toBe('note');
    expect(callout.querySelector('.nowo-milkdown-directive__content')!.textContent).toBe('Text');
  });

  it('show an emoji icon as decoration before the body', async () => {
    handle = await editor(':::callout{icon="🚀" type="info"}\nText\n:::\n', { readonly: true });
    const callout = q(handle, '.nowo-milkdown-directive--callout')!;
    const icon = callout.firstElementChild!;
    expect(icon.className).toBe('nowo-md-callout__icon nowo-md-callout__emoji');
    expect(icon.getAttribute('data-emoji')).toBe('🚀');
    expect(icon.getAttribute('aria-hidden')).toBe('true');
    expect(icon.textContent).toBe('');
    expect(callout.classList.contains('nowo-md-callout--icon')).toBe(true);
    expect(callout.querySelector('.nowo-milkdown-directive__content')!.classList.contains('nowo-md-callout__body')).toBe(true);
  });

  it('show an allowlisted Tabler icon; an unknown catalog name is dropped', async () => {
    handle = await editor(':::callout{icon="bug" type="info"}\nA\n:::\n', { readonly: true, icons: ['bug'], iconSpriteUrl: '/s.svg' });
    const svg = q(handle, 'svg.nowo-md-callout__icon')!;
    expect(svg.getAttribute('class')).toBe('nowo-md-icon nowo-md-callout__icon');
    expect(svg.querySelector('use')!.getAttribute('href')).toBe('/s.svg#tabler-bug');
    await handle.destroy();

    handle = await editor(':::callout{icon="nope-nope" type="info"}\nA\n:::\n\n:::callout{icon="bulb" type="info"}\nB\n:::\n', { readonly: true, iconCatalog: true });
    await settle();
    const callouts = handle.root.querySelectorAll('.nowo-milkdown-directive--callout');
    expect(callouts[0]!.querySelector('svg')).toBeNull();
    expect(callouts[0]!.classList.contains('nowo-md-callout--icon')).toBe(false);
    expect(callouts[0]!.querySelector('.nowo-md-callout__body')).toBeNull();
    expect(callouts[1]!.querySelector('svg.nowo-md-callout__icon')).not.toBeNull();
    await handle.destroy();

    vi.spyOn(lazyIcons, 'catalog').mockRejectedValue(new Error('offline'));
    handle = await editor(':::callout{icon="bulb" type="info"}\nA\n:::\n', { readonly: true, iconCatalog: true });
    await settle();
    expect(q(handle, '.nowo-milkdown-directive--callout svg')).toBeNull();
  });

  it('an unresolvable icon draws nothing; details show the summary; align and others show nothing', async () => {
    handle = await editor(
      ':::callout{icon="rocket" type="nope"}\nA\n:::\n\n:::details{summary="More"}\nB\n:::\n\n:::details\nC\n:::\n\n::: {align="center"}\nD\n:::\n\n:::custom\nE\n:::\n',
      { readonly: true },
    );
    const callout = q(handle, '.nowo-milkdown-directive--callout')!;
    expect(callout.firstElementChild!.classList.contains('nowo-milkdown-directive__content')).toBe(true);
    expect(callout.classList.contains('nowo-md-callout--info')).toBe(true);
    const summaries = handle.root.querySelectorAll('.nowo-milkdown-directive__summary');
    expect([...summaries].map((s) => s.textContent)).toEqual(['More', '…']);
    expect(q(handle, '.nowo-milkdown-directive--details')!.classList.contains('nowo-md-details')).toBe(true);
    expect(handle.root.querySelector('.nowo-milkdown-directive__header')).toBeNull();
    expect(q(handle, '.nowo-milkdown-directive--align')!.firstElementChild!.classList.contains('nowo-milkdown-directive__content')).toBe(true);
  });

  it('switch to the header when the editor becomes editable, and back', async () => {
    handle = await editor(':::callout{icon="🚀" type="info"}\nText\n:::\n', { readonly: true });
    handle.builder.setReadonly(false);
    const callout = q(handle, '.nowo-milkdown-directive--callout')!;
    expect(callout.querySelector('.nowo-milkdown-directive__header select')).not.toBeNull();
    expect(callout.querySelector('.nowo-md-callout__icon')).toBeNull();
    expect(callout.classList.contains('nowo-md-callout')).toBe(false);
    const header = callout.querySelector('.nowo-milkdown-directive__header')!;
    expect(header.nextElementSibling!.classList.contains('nowo-milkdown-directive__content')).toBe(true);
    handle.builder.setReadonly(false);
    handle.builder.setReadonly(true);
    expect(callout.querySelector('.nowo-milkdown-directive__header')).toBeNull();
    expect(callout.firstElementChild!.className).toBe('nowo-md-callout__icon nowo-md-callout__emoji');
  });

  it('editing mode keeps the header', async () => {
    handle = await editor(':::callout{type="info"}\nText\n:::\n');
    expect(q(handle, '.nowo-milkdown-directive__header select')).not.toBeNull();
    expect(q(handle, '.nowo-md-callout')).toBeNull();
  });
});

describe('read-only task items', () => {
  it('have a disabled checkbox that follows the editable state', async () => {
    handle = await editor('* [x] done\n* [ ] todo\n', { readonly: true });
    const boxes = [...handle.root.querySelectorAll<HTMLInputElement>('li.nowo-milkdown-task > input.nowo-milkdown-task__box')];
    expect(boxes).toHaveLength(2);
    expect(boxes.every((b) => b.disabled)).toBe(true);
    expect(boxes[0]!.checked).toBe(true);
    expect(boxes[0]!.parentElement!.dataset.checked).toBe('true');
    expect(boxes[0]!.nextElementSibling!.className).toBe('nowo-milkdown-task__content');

    const v = view(handle);
    const before = v.state.doc;
    boxes[1]!.checked = true;
    boxes[1]!.dispatchEvent(new Event('change'));
    expect(v.state.doc.eq(before)).toBe(true);

    handle.builder.setReadonly(false);
    expect(boxes.every((b) => !b.disabled)).toBe(true);
    handle.builder.setReadonly(true);
    expect(boxes.every((b) => b.disabled)).toBe(true);
  });
});

describe('editable watch', () => {
  it('stops calling a watcher once it is removed', async () => {
    handle = await editor('x', { readonly: true });
    const v = view(handle);
    const seen: boolean[] = [];
    const stop = onEditableChange(v, () => seen.push(v.editable));
    handle.builder.setReadonly(false);
    stop();
    handle.builder.setReadonly(true);
    expect(seen).toEqual([true]);
  });
});
