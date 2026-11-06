/**
 * Top layer for the editor's popups (1.8, ME-1): the context menu and its submenus, the block menu, the `/` and
 * suggestion lists and the icon picker.
 *
 * With the Popover API (`popover="manual"`, `showPopover()` / `hidePopover()`) the popup stays inside the widget —
 * so it inherits the `--nowo-milkdown-*` theme tokens, the font and the `data-theme` of its ancestors — but renders in
 * the browser's top layer: a sticky header, a drawer, a modal `<dialog>` opened earlier, or an ancestor that creates
 * a containing block for fixed elements (`transform`, `filter`, `contain`, `container-type`, `will-change`) can no
 * longer cover it or move it off screen. `manual` keeps the bundle's own dismissal (click outside, Escape, Tab) and
 * focus handling; several manual popovers (a menu and its submenu) stay open together, the last one on top.
 *
 * Without the Popover API the popup moves to `document.body` (or to the open modal `<dialog>` around the widget, the
 * only part of the page that is not inert) with the computed theme tokens copied onto it through CSSOM
 * (`style.setProperty`), never an inline `style` attribute written as markup.
 */

/** Marker class of a popup rendered outside its widget (fallback without the Popover API). */
export const DETACHED_CLASS = 'nowo-milkdown-layer--detached';

/** Prefix of the theme tokens copied onto a detached popup. */
const TOKEN_PREFIX = '--nowo-milkdown-';

/** Tokens declared by the bundle stylesheet: copied even when the browser does not enumerate custom properties. */
export const THEME_TOKENS = [
  'font',
  'font-code',
  'font-size',
  'text',
  'muted',
  'background',
  'surface',
  'border',
  'accent',
  'accent-text',
  'accent-soft',
  'focus',
  'selection',
  'info',
  'success',
  'warning',
  'danger',
  'radius',
  'radius-control',
  'shadow',
  'icon-size',
  'icon-color',
  'mark-text',
  'mark-yellow',
  'mark-green',
  'mark-blue',
  'mark-red',
  'mark-purple',
  'mark-gray',
  'mark-brown',
  'mark-orange',
  'mark-pink',
  'color-gray',
  'color-brown',
  'color-orange',
  'color-yellow',
  'color-green',
  'color-blue',
  'color-purple',
  'color-pink',
  'color-red',
].map((name) => TOKEN_PREFIX + name);

const open = new WeakSet<HTMLElement>();

/** Whether this browser has the Popover API. */
export function supportsPopover(): boolean {
  return typeof HTMLElement !== 'undefined' && typeof HTMLElement.prototype.showPopover === 'function';
}

/**
 * Copies the computed theme tokens (and the font) of `from` onto `to` through CSSOM.
 *
 * @param from - The widget root (or any element inside it)
 * @param to - The detached popup
 */
export function copyTokens(from: HTMLElement, to: HTMLElement): void {
  const style = getComputedStyle(from);
  const names = new Set(THEME_TOKENS);
  for (let i = 0; i < style.length; i++) {
    const name = style.item(i);
    if (name.startsWith(TOKEN_PREFIX)) names.add(name);
  }
  for (const name of names) {
    const value = style.getPropertyValue(name).trim();
    if (value !== '') to.style.setProperty(name, value);
  }
  const family = style.getPropertyValue('font-family');
  if (family) to.style.setProperty('font-family', family);
}

/**
 * Shows a popup above everything else.
 *
 * @param element - The popup (a menu, listbox or picker)
 * @param host - The widget element it belongs to (its theme)
 */
export function showLayer(element: HTMLElement, host: HTMLElement): void {
  element.hidden = false;
  if (supportsPopover()) {
    if (element.parentElement !== host) {
      // Moving (or re-adding) an element hides a showing popover: show it again below.
      open.delete(element);
      host.append(element);
    }
    if (element.getAttribute('popover') !== 'manual') element.setAttribute('popover', 'manual');
    if (!open.has(element)) element.showPopover();
    open.add(element);
    return;
  }
  // Fallback: out of every stacking context and containing block of the page (inside an open modal dialog, the only
  // part of the page that is not inert), with the widget's tokens.
  const dialog = host.closest<HTMLElement>('dialog[open]');
  const container = dialog ?? document.body;
  if (element.parentElement !== container) container.append(element);
  element.classList.add(DETACHED_CLASS);
  copyTokens(host.closest<HTMLElement>('.nowo-milkdown') ?? host, element);
  open.add(element);
}

/**
 * Hides a popup shown with {@link showLayer} (it stays in the DOM for the next time).
 *
 * @param element - The popup
 */
export function hideLayer(element: HTMLElement): void {
  if (open.has(element)) {
    open.delete(element);
    // A popover removed from the document was already hidden by the browser.
    if (supportsPopover() && element.getAttribute('popover') === 'manual' && element.isConnected) element.hidePopover();
  }
  element.hidden = true;
}

/** Whether the popup is shown. */
export const isLayerOpen = (element: HTMLElement): boolean => open.has(element) && !element.hidden;

/**
 * Places a popup at viewport coordinates, kept inside the viewport (CSSOM: allowed under a strict `style-src-attr`).
 *
 * @param element - The popup (shown)
 * @param x - Left edge
 * @param y - Top edge
 * @param flipX - For a submenu: the parent's left edge; when the popup would overflow the right edge it opens to the
 *   left of the parent instead of covering it
 */
export function placeLayer(element: HTMLElement, x: number, y: number, flipX?: number): void {
  element.style.left = '0px';
  element.style.top = '0px';
  const rect = element.getBoundingClientRect();
  const width = rect.width || 0;
  const height = rect.height || 0;
  const maxX = Math.max(0, window.innerWidth - width - 4);
  if (flipX !== undefined && x > maxX && flipX - width >= 4) x = flipX - width;
  const maxY = Math.max(0, window.innerHeight - height - 4);
  element.style.left = `${Math.round(Math.min(Math.max(4, x), maxX))}px`;
  element.style.top = `${Math.round(Math.min(Math.max(4, y), maxY))}px`;
}
