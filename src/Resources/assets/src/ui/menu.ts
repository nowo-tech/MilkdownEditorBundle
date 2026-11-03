/**
 * Accessible popup menu (WAI-ARIA APG menu pattern) shared by the context menu and the block menu.
 *
 * `role="menu"` with `role="menuitem"` buttons, groups separated by `role="separator"`; one item is focused at a
 * time (roving focus). Keys: Up / Down (wrap), Home / End, Right or Enter / Space on an item with a submenu opens
 * it, Left or Escape in a submenu returns to its item, Escape on the root menu and Tab close everything and give
 * focus back to the caller, printable characters jump to the next item starting with them (type-ahead). Disabled
 * items stay focusable (`aria-disabled`) and show their hint. Built with DOM APIs only (no `innerHTML`).
 */

export type MenuItem = {
  id: string;
  label: string;
  /** Shortcut shown after the label and exposed as `aria-keyshortcuts` (e.g. "Control+C"). */
  shortcut?: string;
  /** Visible text after a disabled item explaining why (e.g. "Use Ctrl+V"). */
  hint?: string;
  disabled?: boolean;
  /** Submenu items. */
  items?: MenuItem[];
  run?: () => void;
};

/** Items separated into groups (a separator between non-empty groups). */
export type MenuGroups = MenuItem[][];

let sequence = 0;

const KEY_LABELS: Record<string, string> = { Control: 'Ctrl', Meta: '⌘', Shift: 'Shift', Alt: 'Alt', ArrowUp: '↑', ArrowDown: '↓' };
/** Visible form of an `aria-keyshortcuts` value ("Control+Shift+V" → "Ctrl+Shift+V"). */
export const shortcutLabel = (shortcut: string): string =>
  shortcut
    .split('+')
    .map((k) => KEY_LABELS[k] ?? k)
    .join('+');

export class Menu {
  readonly element: HTMLDivElement;
  private buttons: HTMLButtonElement[] = [];
  private items: MenuItem[] = [];
  private child: Menu | null = null;
  private typed = '';
  private typedAt = 0;
  private readonly onOutside = (event: Event): void => {
    if (!this.contains(event.target as Node)) this.closeAll(false);
  };

  /**
   * @param host - Element the menu is appended to (inside the widget, for its theme tokens)
   * @param label - Accessible name of the menu
   * @param onClose - Called once the root menu closed; `restoreFocus` is false for a click outside
   * @param parent - The parent menu of a submenu
   */
  constructor(
    private readonly host: HTMLElement,
    label: string,
    private readonly onClose: (restoreFocus: boolean) => void,
    private readonly parent: Menu | null = null,
  ) {
    this.element = document.createElement('div');
    this.element.id = `nowo-milkdown-menu-${++sequence}`;
    this.element.className = 'nowo-milkdown-menu';
    this.element.setAttribute('role', 'menu');
    this.element.setAttribute('aria-label', label);
    this.element.tabIndex = -1;
    this.element.hidden = true;
    this.element.addEventListener('keydown', (event) => this.onKey(event));
    this.element.addEventListener('click', (event) => {
      const button = (event.target as HTMLElement).closest<HTMLButtonElement>('[role="menuitem"]');
      if (button && this.element.contains(button)) this.activate(this.buttons.indexOf(button));
    });
    this.element.addEventListener('mousemove', (event) => {
      const button = (event.target as HTMLElement).closest<HTMLButtonElement>('[role="menuitem"]');
      const index = button ? this.buttons.indexOf(button) : -1;
      if (index >= 0 && document.activeElement !== button) this.focus(index);
    });
  }

  get isOpen(): boolean {
    return !this.element.hidden;
  }

  /**
   * Opens the menu at viewport coordinates and focuses its first item.
   *
   * @param groups - Item groups (empty groups are skipped)
   * @param x - Left edge (viewport px)
   * @param y - Top edge (viewport px)
   */
  open(groups: MenuGroups, x: number, y: number): void {
    this.closeChild();
    this.element.replaceChildren();
    this.items = [];
    this.buttons = [];
    for (const group of groups.filter((g) => g.length)) {
      if (this.items.length) {
        const sep = document.createElement('div');
        sep.setAttribute('role', 'separator');
        sep.className = 'nowo-milkdown-menu__separator';
        this.element.append(sep);
      }
      for (const item of group) this.addItem(item);
    }
    if (!this.element.isConnected) this.host.append(this.element);
    this.element.hidden = false;
    this.place(x, y);
    if (!this.parent) document.addEventListener('pointerdown', this.onOutside, true);
    this.focus(0);
  }

  private addItem(item: MenuItem): void {
    const button = document.createElement('button');
    button.type = 'button';
    button.tabIndex = -1;
    button.className = 'nowo-milkdown-menu__item';
    button.setAttribute('role', 'menuitem');
    button.dataset.id = item.id;
    const label = document.createElement('span');
    label.className = 'nowo-milkdown-menu__label';
    label.textContent = item.label;
    button.append(label);
    if (item.disabled) {
      button.setAttribute('aria-disabled', 'true');
      if (item.hint) {
        const hint = document.createElement('span');
        hint.className = 'nowo-milkdown-menu__hint';
        hint.textContent = item.hint;
        button.append(hint);
      }
    }
    if (item.shortcut) {
      button.setAttribute('aria-keyshortcuts', item.shortcut);
      const keys = document.createElement('span');
      keys.className = 'nowo-milkdown-menu__shortcut';
      keys.setAttribute('aria-hidden', 'true');
      keys.textContent = shortcutLabel(item.shortcut);
      button.append(keys);
    }
    if (item.items?.length) {
      button.setAttribute('aria-haspopup', 'menu');
      button.setAttribute('aria-expanded', 'false');
      const arrow = document.createElement('span');
      arrow.className = 'nowo-milkdown-menu__arrow';
      arrow.setAttribute('aria-hidden', 'true');
      arrow.textContent = '›';
      button.append(arrow);
    }
    this.items.push(item);
    this.buttons.push(button);
    this.element.append(button);
  }

  /** Keeps the menu inside the viewport (CSSOM: allowed under a strict `style-src-attr`). */
  private place(x: number, y: number): void {
    this.element.style.left = '0px';
    this.element.style.top = '0px';
    const rect = this.element.getBoundingClientRect();
    const width = rect.width || 0;
    const height = rect.height || 0;
    const maxX = Math.max(0, window.innerWidth - width - 4);
    const maxY = Math.max(0, window.innerHeight - height - 4);
    this.element.style.left = `${Math.round(Math.min(Math.max(4, x), maxX))}px`;
    this.element.style.top = `${Math.round(Math.min(Math.max(4, y), maxY))}px`;
  }

  /** Focuses the item at `index` (wrapping). */
  focus(index: number): void {
    if (!this.buttons.length) {
      this.element.focus();
      return;
    }
    const i = (index + this.buttons.length) % this.buttons.length;
    this.buttons[i]!.focus();
  }

  private current(): number {
    return this.buttons.indexOf(document.activeElement as HTMLButtonElement);
  }

  onKey(event: KeyboardEvent): void {
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    const index = this.current();
    let handled = true;
    switch (event.key) {
      case 'ArrowDown':
        this.focus(index + 1);
        break;
      case 'ArrowUp':
        this.focus(index < 0 ? -1 : index - 1);
        break;
      case 'Home':
        this.focus(0);
        break;
      case 'End':
        this.focus(-1);
        break;
      case 'ArrowRight':
        if (index >= 0 && this.items[index]?.items?.length && !this.items[index]?.disabled) this.openChild(index);
        break;
      case 'ArrowLeft':
        if (this.parent) this.parent.closeChild(true);
        else handled = false;
        break;
      case 'Escape':
        if (this.parent) this.parent.closeChild(true);
        else this.closeAll(true);
        break;
      case 'Tab':
        this.root().closeAll(true);
        break;
      case 'Enter':
      case ' ':
        if (index >= 0) this.activate(index);
        break;
      default:
        handled = event.key.length === 1 && this.typeahead(event.key, index);
    }
    if (handled) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  private typeahead(char: string, index: number): boolean {
    const now = Date.now();
    this.typed = now - this.typedAt < 700 ? this.typed + char.toLowerCase() : char.toLowerCase();
    this.typedAt = now;
    const n = this.items.length;
    for (let step = this.typed.length > 1 ? 0 : 1; step <= n; step++) {
      const i = (Math.max(index, 0) + step) % n;
      if (this.items[i]!.label.toLowerCase().startsWith(this.typed)) {
        this.focus(i);
        return true;
      }
    }
    return true;
  }

  private activate(index: number): void {
    const item = this.items[index];
    if (!item || item.disabled) return;
    if (item.items?.length) {
      this.openChild(index);
      return;
    }
    const run = item.run;
    this.root().closeAll(true);
    run?.();
  }

  private openChild(index: number): void {
    this.closeChild();
    const item = this.items[index]!;
    const button = this.buttons[index]!;
    const child = new Menu(this.host, item.label, () => undefined, this);
    this.child = child;
    button.setAttribute('aria-expanded', 'true');
    button.setAttribute('aria-controls', child.element.id);
    const rect = button.getBoundingClientRect();
    child.open([item.items!], rect.right, rect.top);
  }

  /** Closes the open submenu; `refocus` puts focus back on its item. */
  closeChild(refocus = false): void {
    if (!this.child) return;
    const child = this.child;
    this.child = null;
    child.destroy();
    const button = this.buttons.find((b) => b.getAttribute('aria-expanded') === 'true');
    button?.setAttribute('aria-expanded', 'false');
    button?.removeAttribute('aria-controls');
    if (refocus) button?.focus();
  }

  private root(): Menu {
    return this.parent ? this.parent.root() : this;
  }

  private contains(node: Node): boolean {
    return this.element.contains(node) || (this.child?.contains(node) ?? false);
  }

  /** Closes the menu tree. */
  closeAll(restoreFocus: boolean): void {
    if (this.element.hidden) return;
    this.closeChild();
    this.element.hidden = true;
    document.removeEventListener('pointerdown', this.onOutside, true);
    this.onClose(restoreFocus);
  }

  destroy(): void {
    this.closeChild();
    document.removeEventListener('pointerdown', this.onOutside, true);
    this.element.remove();
  }
}
