import { afterEach, describe, expect, it, vi } from 'vitest';
import { editorViewCtx } from '@milkdown/kit/core';
import { editor, tick } from './helpers';
import type { MilkdownEditorHandle } from '../src/editor';
import { createUserResolver } from '../src/user-names';
import { parseOptions } from '../src/options';

let handle: MilkdownEditorHandle | null = null;
afterEach(async () => {
  await handle?.destroy();
  handle = null;
  vi.unstubAllGlobals();
});

const dom = (h: MilkdownEditorHandle) => h.builder.editor.action((ctx) => ctx.get(editorViewCtx)).dom;

describe('mention_display: name (1.2.1)', () => {
  it('options: off by default, name and the title URL when set', () => {
    expect(parseOptions('{}')).toMatchObject({ mentionDisplay: 'handle', userTitleUrl: null });
    expect(parseOptions('{"mentionDisplay":"name","userTitleUrl":"/u"}')).toMatchObject({ mentionDisplay: 'name', userTitleUrl: '/u' });
    expect(parseOptions('{"mentionDisplay":"email"}').mentionDisplay).toBe('handle');
  });

  it('default: chips keep @handle (no request)', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    handle = await editor('Hi @ada', { userTitleUrl: '/u' });
    await tick();
    expect(dom(handle).querySelector('.nowo-milkdown-mention')?.textContent).toBe('@ada');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('name: chips show the resolved name, the handle stays in data-mention / title and in the Markdown', async () => {
    const fetchMock = vi.fn(async () => new Response(JSON.stringify([{ handle: 'ada', name: 'Ada <b>Lovelace</b>' }, { handle: 'x', name: 5 }])));
    vi.stubGlobal('fetch', fetchMock);
    handle = await editor('Hi @ada and @bob', { mentionDisplay: 'name', userTitleUrl: '/u?x=1' });
    await vi.waitFor(() => expect(dom(handle!).querySelector('[data-mention="ada"]')?.textContent).toBe('Ada <b>Lovelace</b>'));
    const ada = dom(handle).querySelector('[data-mention="ada"]')!;
    expect(ada.querySelector('b')).toBeNull();
    expect(ada.getAttribute('title')).toBe('@ada');
    expect(dom(handle).querySelector('[data-mention="bob"]')?.textContent).toBe('@bob');
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(String((fetchMock.mock.calls[0] as unknown[])[0])).toBe('/u?x=1&handles=ada%2Cbob');
    expect(handle.getMarkdown()).toBe('Hi @ada and @bob\n');
  });

  it('resolver: batches, remembers suggestion names, survives failures', async () => {
    const failing = createUserResolver('/u', vi.fn(async () => {
      throw new Error('down');
    }));
    expect(await failing.resolve('a')).toBeNull();
    const notOk = createUserResolver('/u', vi.fn(async () => new Response('x', { status: 500 })));
    expect(await notOk.resolve('a')).toBeNull();
    const notArray = createUserResolver('/u', vi.fn(async () => new Response('{}')));
    expect(await notArray.resolve('a')).toBeNull();
    const none = createUserResolver(null);
    none.remember('ada', 'Ada');
    none.remember('blank', ' ');
    expect(await none.resolve('ada')).toBe('Ada');
    expect(await none.resolve('blank')).toBeNull();
    const many = vi.fn(async (url: string) => new Response(JSON.stringify(decodeURIComponent(url.split('handles=')[1]!).split(',').map((h) => ({ handle: h, name: h.toUpperCase() })))));
    const big = createUserResolver('/u', many as unknown as typeof fetch);
    const names = await Promise.all(Array.from({ length: 60 }, (_, i) => big.resolve(`u${i}`)));
    expect(names[59]).toBe('U59');
    expect(many).toHaveBeenCalledTimes(2);
    expect(await big.resolve('u1')).toBe('U1');
  });

  it('a pick from the @ suggestions shows the name at once', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify([{ id: 'grace', label: 'Grace Hopper' }]))));
    handle = await editor('', { mentionDisplay: 'name', suggestions: { '@': '/people' } });
    const v = handle.builder.editor.action((ctx) => ctx.get(editorViewCtx));
    v.dispatch(v.state.tr.insertText('@gr'));
    await vi.waitFor(() => expect(handle!.root.querySelector('[role="option"]')).not.toBeNull());
    v.dom.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }));
    await vi.waitFor(() => expect(dom(handle!).querySelector('[data-mention="grace"]')?.textContent).toBe('Grace Hopper'));
  });
});
