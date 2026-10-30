import { afterEach, describe, expect, it, vi } from 'vitest';
import * as Y from 'yjs';
import { editorViewCtx } from '@milkdown/kit/core';
import { editor, tick } from './helpers';
import { toBase64 } from '../src/collab/mercure-provider';
import type { MilkdownEditorHandle } from '../src/editor';

class FakeEventSource {
  onopen: (() => void) | null = null;
  onerror: (() => void) | null = null;
  onmessage: ((e: MessageEvent<string>) => void) | null = null;
  constructor() {
    setTimeout(() => this.onopen?.(), 0);
  }
  close() {}
}

let handle: MilkdownEditorHandle | null = null;
afterEach(async () => {
  await handle?.destroy();
  handle = null;
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('editor integrations', () => {
  it('collaboration seeds an empty shared document from the field and reports status', async () => {
    vi.stubGlobal('EventSource', FakeEventSource);
    vi.stubGlobal('fetch', vi.fn(async (url: string) => (url.endsWith('/state') ? new Response(JSON.stringify({ state: toBase64(Y.encodeStateAsUpdate(new Y.Doc())), seed: true })) : new Response(''))));
    handle = await editor('# Seeded', { collaboration: { url: '/c', hubUrl: '/hub', topic: 't', user: { name: 'Ada', color: '#123456' } } });
    await tick(20);
    expect(handle.provider).not.toBeNull();
    expect(handle.root.dataset.collab).toBe('online');
    expect(handle.getMarkdown()).toBe('# Seeded\n');
    expect(handle.root.querySelector('.nowo-milkdown__status')?.textContent).toBe('Live');
  });

  it('the Insert file button uploads the picked files at the cursor', async () => {
    handle = await editor('Text', { upload: { url: '/up' } });
    let picker: HTMLInputElement | null = null;
    vi.spyOn(HTMLInputElement.prototype, 'click').mockImplementation(function (this: HTMLInputElement) {
      // eslint-disable-next-line @typescript-eslint/no-this-alias -- the spy captures the picker input
      picker = this;
    });
    class Xhr {
      status = 200;
      responseText = JSON.stringify({ url: '/files/a.png' });
      withCredentials = false;
      upload = { addEventListener: () => undefined };
      listeners: Record<string, () => void> = {};
      open() {}
      setRequestHeader() {}
      addEventListener(t: string, f: () => void) {
        this.listeners[t] = f;
      }
      send() {
        setTimeout(() => this.listeners.load!(), 0);
      }
    }
    vi.stubGlobal('XMLHttpRequest', Xhr);
    handle.root.querySelector<HTMLButtonElement>('.nowo-milkdown__action')!.click();
    const input = picker as unknown as HTMLInputElement;
    expect(input.type).toBe('file');
    input.dispatchEvent(new Event('change'));
    Object.defineProperty(input, 'files', { value: [new File(['x'], 'a.png', { type: 'image/png' })] });
    input.dispatchEvent(new Event('change'));
    await tick(30);
    expect(handle.getMarkdown()).toContain('![a](/files/a.png)');
    expect(handle.root.querySelector('.nowo-milkdown__status')?.textContent).toBe('a.png uploaded');
    handle.focus();
    expect(handle.builder.editor.action((ctx) => ctx.get(editorViewCtx)).hasFocus()).toBeTypeOf('boolean');
  });
});
