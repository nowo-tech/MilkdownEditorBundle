import { afterEach, describe, expect, it, vi } from 'vitest';
import { editorViewCtx } from '@milkdown/kit/core';
import { TextSelection } from '@milkdown/kit/prose/state';
import { editor, keydown } from './helpers';
import type { MilkdownEditorHandle } from '../src/editor';
import { STATUS_CLEAR_MS } from '../src/editor';
import { COPY_STATUS_MS, copySource } from '../src/index';
import { Menu } from '../src/ui/menu';

let handle: MilkdownEditorHandle | null = null;
afterEach(async () => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  await handle?.destroy();
  handle = null;
  document.body.replaceChildren();
});

const status = (h: MilkdownEditorHandle) => h.root.querySelector('.nowo-milkdown__status')!;

describe('1.5.1 Beacon fixes', () => {
  it('"Copied as Markdown" clears after a few seconds and on the next action', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('navigator', { ...navigator, clipboard: { writeText } });
    handle = await editor('Some text', { features: ['markdown_clipboard'] });
    const view = handle.builder.editor.action((ctx) => ctx.get(editorViewCtx));
    view.dispatch(view.state.tr.setSelection(TextSelection.create(view.state.doc, 1, 5)));
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    keydown(view.dom, 'C', { ctrlKey: true, altKey: true, shiftKey: true });
    await vi.advanceTimersByTimeAsync(0);
    expect(status(handle).textContent).toBe('Copied as Markdown');
    await vi.advanceTimersByTimeAsync(STATUS_CLEAR_MS);
    expect(status(handle).textContent).toBe('');
    keydown(view.dom, 'C', { ctrlKey: true, altKey: true, shiftKey: true });
    await vi.advanceTimersByTimeAsync(0);
    expect(status(handle).textContent).toBe('Copied as Markdown');
    handle.root.querySelector('.nowo-milkdown__surface')!.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    expect(status(handle).textContent).toBe('');
    // A persistent message (not transient) is not cleared by the next action.
    status(handle).textContent = 'Live';
    keydown(view.dom, 'ArrowLeft');
    expect(status(handle).textContent).toBe('Live');
  });

  it('the read-view copy status clears itself and on the next click', async () => {
    vi.stubGlobal('navigator', { ...navigator, clipboard: { writeText: vi.fn().mockResolvedValue(undefined) } });
    document.body.innerHTML =
      '<span data-nowo-milkdown-copy><button data-nowo-milkdown-copy-markdown data-copied="Copied">Copy</button><template>x</template><span role="status"></span></span>';
    const button = document.querySelector('button')!;
    const region = document.querySelector('[role="status"]')!;
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    await copySource(button);
    expect(region.textContent).toBe('Copied');
    await vi.advanceTimersByTimeAsync(COPY_STATUS_MS - 1);
    expect(region.textContent).toBe('Copied');
    const again = copySource(button);
    expect(region.textContent).toBe(''); // cleared at once, so the repeat is announced again
    await again;
    expect(region.textContent).toBe('Copied');
    await vi.advanceTimersByTimeAsync(COPY_STATUS_MS);
    expect(region.textContent).toBe('');
  });

  it('a submenu that would overflow the right edge opens to the left of its menu', () => {
    vi.stubGlobal('innerWidth', 800);
    vi.stubGlobal('innerHeight', 600);
    const rect = (x: number, w: number) => ({ x, y: 0, left: x, top: 0, right: x + w, bottom: 20, width: w, height: 20, toJSON: () => ({}) }) as DOMRect;
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
      if (this.getAttribute('role') === 'menu') {
        const left = parseFloat(this.style.left || '0');
        return rect(left, 200);
      }
      // Menu items: span the menu.
      const menu = this.closest<HTMLElement>('[role="menu"]');
      return rect(parseFloat(menu?.style.left || '0'), 200);
    });
    const host = document.createElement('div');
    document.body.append(host);
    const run = vi.fn();
    const menu = new Menu(host, 'Editor actions', () => undefined);
    menu.open([[{ id: 'insert', label: 'Insert', items: [{ id: 'h1', label: 'Heading 1', run }] }]], 590, 10);
    expect(menu.element.style.left).toBe('590px');
    menu.onKey(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    const sub = [...document.querySelectorAll<HTMLElement>('[role="menu"]')].find((m) => m !== menu.element)!;
    // Right of the menu (790) would overflow 800: it opens at 590 - 200 = 390 instead of being pushed over the menu.
    expect(sub.style.left).toBe('390px');
    expect(document.activeElement?.textContent).toContain('Heading 1');
    menu.closeAll(false);
    // With room on the right it still opens on the right.
    menu.open([[{ id: 'insert', label: 'Insert', items: [{ id: 'h1', label: 'Heading 1', run }] }]], 100, 10);
    menu.onKey(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    const right = [...document.querySelectorAll<HTMLElement>('[role="menu"]')].find((m) => m !== menu.element && !m.hidden)!;
    expect(right.style.left).toBe('300px');
    menu.closeAll(false);
    // No room on either side: clamped inside the viewport as before.
    vi.stubGlobal('innerWidth', 300);
    menu.open([[{ id: 'insert', label: 'Insert', items: [{ id: 'h1', label: 'Heading 1', run }] }]], 100, 10);
    menu.onKey(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    const clamped = [...document.querySelectorAll<HTMLElement>('[role="menu"]')].find((m) => m !== menu.element && !m.hidden)!;
    expect(clamped.style.left).toBe('96px');
    menu.closeAll(false);
  });
});
