import { afterEach, describe, expect, it, vi } from 'vitest';
import { DETACHED_CLASS, copyTokens, hideLayer, isLayerOpen, placeLayer, showLayer, supportsPopover } from '../src/ui/layer';
import { Menu } from '../src/ui/menu';
import { open as openPicker } from '../src/ui/icon-picker';
import { defaultRuntime } from '../src/runtime';

const proto = HTMLElement.prototype as unknown as Record<string, unknown>;
const saved = { show: proto.showPopover, hide: proto.hidePopover };

/** Runs `fn` as in a browser without the Popover API. */
function withoutPopover(fn: () => void): void {
  delete proto.showPopover;
  delete proto.hidePopover;
  try {
    fn();
  } finally {
    proto.showPopover = saved.show;
    proto.hidePopover = saved.hide;
  }
}

function widget(): HTMLElement {
  document.body.replaceChildren();
  const root = document.createElement('div');
  root.className = 'nowo-milkdown';
  root.style.setProperty('--nowo-milkdown-background', '#101010');
  root.style.setProperty('--nowo-milkdown-custom-token', '3px');
  document.body.append(root);
  return root;
}

afterEach(() => {
  vi.restoreAllMocks();
  document.body.replaceChildren();
});

describe('top layer (1.8, ME-1)', () => {
  it('shows a popup as a manual popover that stays inside its widget (theme tokens inherit)', () => {
    const root = widget();
    const show = vi.spyOn(HTMLElement.prototype, 'showPopover');
    const hide = vi.spyOn(HTMLElement.prototype, 'hidePopover');
    const el = document.createElement('div');
    el.hidden = true;
    expect(supportsPopover()).toBe(true);
    showLayer(el, root);
    expect(el.parentElement).toBe(root);
    expect(el.getAttribute('popover')).toBe('manual');
    expect(el.hidden).toBe(false);
    expect(isLayerOpen(el)).toBe(true);
    expect(el.classList.contains(DETACHED_CLASS)).toBe(false);
    expect(el.hasAttribute('style')).toBe(false);
    // Shown once: a second show (new position) does not throw InvalidStateError.
    showLayer(el, root);
    expect(show).toHaveBeenCalledTimes(1);
    hideLayer(el);
    expect(hide).toHaveBeenCalledTimes(1);
    expect(el.hidden).toBe(true);
    expect(isLayerOpen(el)).toBe(false);
    // Hiding twice is harmless.
    hideLayer(el);
    expect(hide).toHaveBeenCalledTimes(1);
    showLayer(el, root);
    expect(show).toHaveBeenCalledTimes(2);
  });

  it('without the Popover API: appended to <body> with the widget tokens copied through CSSOM', () => {
    const root = widget();
    withoutPopover(() => {
      expect(supportsPopover()).toBe(false);
      const el = document.createElement('div');
      root.append(el);
      showLayer(el, root);
      expect(el.parentElement).toBe(document.body);
      expect(el.classList.contains(DETACHED_CLASS)).toBe(true);
      expect(el.style.getPropertyValue('--nowo-milkdown-background')).toBe('#101010');
      expect(el.hasAttribute('popover')).toBe(false);
      expect(isLayerOpen(el)).toBe(true);
      hideLayer(el);
      expect(el.hidden).toBe(true);
    });
  });

  it('without the Popover API inside an open modal dialog: appended to the dialog (the rest of the page is inert)', () => {
    document.body.replaceChildren();
    const dialog = document.createElement('dialog');
    dialog.setAttribute('open', '');
    const root = document.createElement('div');
    root.className = 'nowo-milkdown';
    dialog.append(root);
    document.body.append(dialog);
    withoutPopover(() => {
      const el = document.createElement('div');
      showLayer(el, root);
      expect(el.parentElement).toBe(dialog);
    });
  });

  it('copies the declared tokens and any other --nowo-milkdown-* property the browser lists', () => {
    const root = widget();
    const to = document.createElement('div');
    vi.spyOn(window, 'getComputedStyle').mockReturnValue({
      length: 2,
      item: (i: number) => ['--nowo-milkdown-custom-token', 'color'][i]!,
      getPropertyValue: (name: string) => ({ '--nowo-milkdown-custom-token': '3px', '--nowo-milkdown-text': ' #fff ', 'font-family': 'Inter' })[name] ?? '',
    } as unknown as CSSStyleDeclaration);
    copyTokens(root, to);
    expect(to.style.getPropertyValue('--nowo-milkdown-custom-token')).toBe('3px');
    expect(to.style.getPropertyValue('--nowo-milkdown-text')).toBe('#fff');
    expect(to.style.getPropertyValue('font-family')).toBe('Inter');
    expect(to.style.getPropertyValue('color')).toBe('');
  });

  it('places in viewport coordinates, clamped, with the submenu flip', () => {
    vi.stubGlobal('innerWidth', 500);
    vi.stubGlobal('innerHeight', 400);
    const el = document.createElement('div');
    vi.spyOn(el, 'getBoundingClientRect').mockReturnValue({ width: 100, height: 50 } as DOMRect);
    placeLayer(el, 450, 390);
    expect([el.style.left, el.style.top]).toEqual(['396px', '346px']);
    placeLayer(el, 450, 10, 300);
    expect(el.style.left).toBe('200px');
    placeLayer(el, -20, -20);
    expect([el.style.left, el.style.top]).toEqual(['4px', '4px']);
    vi.unstubAllGlobals();
  });

  it('menus and submenus open in the top layer and close it again', () => {
    const root = widget();
    const show = vi.spyOn(HTMLElement.prototype, 'showPopover');
    const menu = new Menu(root, 'Editor actions', () => undefined);
    menu.open([[{ id: 'insert', label: 'Insert', items: [{ id: 'h1', label: 'Heading 1' }] }]], 10, 10);
    expect(menu.element.getAttribute('popover')).toBe('manual');
    expect(menu.element.parentElement).toBe(root);
    menu.onKey(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    const sub = [...root.querySelectorAll<HTMLElement>('[role="menu"]')].find((m) => m !== menu.element)!;
    expect(sub.getAttribute('popover')).toBe('manual');
    expect(show).toHaveBeenCalledTimes(2);
    menu.closeAll(false);
    expect(menu.isOpen).toBe(false);
    expect(sub.isConnected).toBe(false);
    menu.destroy();
    expect(menu.element.isConnected).toBe(false);
  });

  it('the icon picker opens in the top layer', async () => {
    const root = widget();
    const picker = openPicker({ host: root, runtime: defaultRuntime(), x: 5, y: 5, entries: async () => [], onPick: () => undefined, onClose: () => undefined });
    expect(picker.element.getAttribute('popover')).toBe('manual');
    expect(picker.element.parentElement).toBe(root);
    picker.close(false);
    expect(picker.element.isConnected).toBe(false);
  });
});
