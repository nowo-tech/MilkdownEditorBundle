/** jsdom gaps used by ProseMirror and the widget. */
if (!('elementFromPoint' in document)) {
  Object.defineProperty(document, 'elementFromPoint', { value: () => null, configurable: true });
}
Object.defineProperty(Element.prototype, 'scrollIntoView', { value: () => undefined, configurable: true, writable: true });
const rect = (): DOMRect => ({ x: 0, y: 0, top: 0, left: 0, right: 0, bottom: 0, width: 0, height: 0, toJSON: () => ({}) }) as DOMRect;
Range.prototype.getBoundingClientRect = rect;
Range.prototype.getClientRects = () => ({ length: 0, item: () => null, [Symbol.iterator]: [][Symbol.iterator] }) as unknown as DOMRectList;
if (!('ResizeObserver' in window)) {
  (window as unknown as { ResizeObserver: unknown }).ResizeObserver = class {
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
  };
}
if (!('IntersectionObserver' in window)) {
  (window as unknown as { IntersectionObserver: unknown }).IntersectionObserver = class {
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
    takeRecords(): unknown[] {
      return [];
    }
  };
}

/**
 * Popover API (1.8, ME-1): jsdom has none. A minimal stand-in so the menus take the top-layer path by default; tests
 * of the fallback delete it (see layer.test.ts).
 */
const shown = new WeakSet<Element>();
const popoverStub = {
  showPopover(this: HTMLElement): void {
    if (shown.has(this)) throw new DOMException('Already showing', 'InvalidStateError');
    shown.add(this);
  },
  hidePopover(this: HTMLElement): void {
    shown.delete(this);
  },
};
Object.defineProperty(HTMLElement.prototype, 'showPopover', { value: popoverStub.showPopover, configurable: true, writable: true });
Object.defineProperty(HTMLElement.prototype, 'hidePopover', { value: popoverStub.hidePopover, configurable: true, writable: true });
// jsdom's UA stylesheet hides `[popover]:not(:popover-open)` and never matches `:popover-open`: a shown popup (the
// layer clears `hidden`) is displayed, as in a browser after showPopover().
const popoverStyle = document.createElement('style');
popoverStyle.textContent = '[popover]:not([hidden]) { display: block !important; }';
document.head.append(popoverStyle);
