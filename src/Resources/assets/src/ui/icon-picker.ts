/**
 * Icon picker (1.7, lazy chunk): a non-modal `role="dialog"` popup with a search field (`role="combobox"`, focus stays
 * there, `aria-activedescendant` points at the active option) and a `role="listbox"` of icons — the WAI-ARIA APG
 * *combobox with listbox popup* pattern. With `emoji: true` (callout icons) a `role="tablist"` switches between the
 * Tabler icons and the emoji list.
 *
 * Keys in the search field: Up / Down (wrap), Page Up / Page Down (8), Enter picks, Escape closes. Tab moves between
 * the tabs and the search field when there are tabs and closes the picker when it leaves them. Icons in options are
 * decorative (`aria-hidden`); the visible name is the option's accessible name. Built with DOM APIs only.
 */
import { EMOJI } from '../emoji';
import { iconSvg, t, type Runtime } from '../runtime';
import { glyph } from './icons';
import { mergeEntries, searchIcons, type IconEntry } from '../icons/search';

/** Options rendered at most (the live region says how many match). */
export const MAX_OPTIONS = 60;
/** Longest search query (characters). */
export const MAX_QUERY = 64;
const PAGE = 8;

export type PickerTab = 'icons' | 'emoji';

export type PickerOptions = {
  /** Element the picker is appended to (inside the widget, for its theme tokens). */
  host: HTMLElement;
  runtime: Runtime;
  /** Viewport position of the top-left corner. */
  x: number;
  y: number;
  query?: string;
  /** Current value (a Tabler name or an emoji): selected first when it is listed. */
  current?: string | null;
  /** Adds the *Emoji* tab (callout icons). */
  emoji?: boolean;
  /** False: emoji only, no tabs (a field without icons; default true). */
  icons?: boolean;
  /** Adds a first *No icon* option (picked as null). */
  allowNone?: boolean;
  /** Catalog entries (loaded lazily; the host allowlist is merged in front). */
  entries: () => Promise<IconEntry[]>;
  onPick: (value: string | null) => void;
  /** Called once the picker closed without a pick; `restoreFocus` is false for a click outside. */
  onClose: (restoreFocus: boolean) => void;
};

type Option = { value: string | null; label: string; kind: 'none' | 'icon' | 'emoji' };

let sequence = 0;
let current: IconPicker | null = null;

export class IconPicker {
  readonly element: HTMLDivElement;
  readonly input: HTMLInputElement;
  readonly listbox: HTMLUListElement;
  readonly live: HTMLDivElement;
  readonly tabs: HTMLButtonElement[] = [];
  tab: PickerTab = 'icons';
  private options: Option[] = [];
  private index = 0;
  private catalog: IconEntry[] = [];
  private closed = false;
  private readonly id = `nowo-milkdown-picker-${++sequence}`;
  private readonly onOutside = (event: Event): void => {
    if (!this.element.contains(event.target as Node)) this.close(false);
  };

  constructor(private readonly opts: PickerOptions) {
    const { runtime } = opts;
    this.element = document.createElement('div');
    this.element.id = this.id;
    this.element.className = 'nowo-milkdown-picker';
    this.element.setAttribute('role', 'dialog');
    this.element.setAttribute('aria-label', t(runtime, 'picker.label'));
    this.element.addEventListener('keydown', (event) => this.onKey(event));

    if (opts.emoji && opts.icons !== false) {
      const list = document.createElement('div');
      list.className = 'nowo-milkdown-picker__tabs';
      list.setAttribute('role', 'tablist');
      list.setAttribute('aria-label', t(runtime, 'picker.label'));
      for (const tab of ['icons', 'emoji'] as const) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'nowo-milkdown-picker__tab';
        button.id = `${this.id}-tab-${tab}`;
        button.setAttribute('role', 'tab');
        button.setAttribute('aria-controls', `${this.id}-list`);
        button.dataset.tab = tab;
        button.textContent = t(runtime, `picker.tab_${tab}`);
        button.addEventListener('click', () => this.select(tab, true));
        this.tabs.push(button);
        list.append(button);
      }
      this.element.append(list);
    }

    const search = document.createElement('div');
    search.className = 'nowo-milkdown-picker__field';
    const icon = runtime.menuIcons ? glyph('search', 'nowo-milkdown-picker__search-icon') : null;
    if (icon) search.append(icon);
    this.input = document.createElement('input');
    this.input.type = 'search';
    this.input.className = 'nowo-milkdown-picker__search';
    this.input.autocomplete = 'off';
    // A long pasted query only slows the search down (audit DY-I2).
    this.input.maxLength = MAX_QUERY;
    this.input.spellcheck = false;
    this.input.value = (opts.query ?? '').slice(0, MAX_QUERY);
    this.input.placeholder = t(runtime, 'picker.search');
    this.input.setAttribute('aria-label', t(runtime, 'picker.search'));
    this.input.setAttribute('role', 'combobox');
    this.input.setAttribute('aria-expanded', 'true');
    this.input.setAttribute('aria-autocomplete', 'list');
    this.input.setAttribute('aria-controls', `${this.id}-list`);
    this.input.addEventListener('input', () => this.render());
    search.append(this.input);

    this.listbox = document.createElement('ul');
    this.listbox.id = `${this.id}-list`;
    this.listbox.className = 'nowo-milkdown-picker__list';
    this.listbox.setAttribute('role', 'listbox');
    this.listbox.addEventListener('mousedown', (event) => {
      const option = (event.target as HTMLElement).closest<HTMLLIElement>('[role="option"]');
      if (!option) return;
      event.preventDefault();
      this.index = Number(option.dataset.index);
      this.pick();
    });

    this.live = document.createElement('div');
    this.live.className = 'nowo-milkdown-sr-only';
    this.live.setAttribute('aria-live', 'polite');
    this.element.append(search, this.listbox, this.live);
    if (opts.emoji && (opts.icons === false || (opts.current && !/^[a-z0-9-]+$/.test(opts.current)))) this.tab = 'emoji';
  }

  get isOpen(): boolean {
    return !this.closed;
  }

  /** Shows the picker, focuses the search field and loads the catalog. */
  async show(): Promise<void> {
    this.opts.host.append(this.element);
    this.place();
    document.addEventListener('pointerdown', this.onOutside, true);
    this.select(this.tab, false);
    this.input.focus();
    try {
      this.catalog = await this.opts.entries();
    } catch {
      this.catalog = [];
    }
    if (!this.closed) this.render();
  }

  private place(): void {
    this.element.style.left = '0px';
    this.element.style.top = '0px';
    const rect = this.element.getBoundingClientRect();
    const maxX = Math.max(4, window.innerWidth - (rect.width || 0) - 4);
    const maxY = Math.max(4, window.innerHeight - (rect.height || 0) - 4);
    this.element.style.left = `${Math.round(Math.min(Math.max(4, this.opts.x), maxX))}px`;
    this.element.style.top = `${Math.round(Math.min(Math.max(4, this.opts.y), maxY))}px`;
  }

  /** Switches the tab (callout picker) and re-renders. */
  select(tab: PickerTab, focusInput: boolean): void {
    this.tab = tab;
    for (const button of this.tabs) {
      const on = button.dataset.tab === tab;
      button.setAttribute('aria-selected', String(on));
      button.tabIndex = on ? 0 : -1;
    }
    if (this.tabs.length) this.listbox.setAttribute('aria-labelledby', `${this.id}-tab-${tab}`);
    else this.listbox.setAttribute('aria-label', t(this.opts.runtime, tab === 'emoji' ? 'picker.tab_emoji' : 'picker.list'));
    this.render();
    if (focusInput) this.input.focus();
  }

  private candidates(): { options: Option[]; total: number } {
    const query = this.input.value.trim();
    const none: Option[] = this.opts.allowNone ? [{ value: null, label: t(this.opts.runtime, 'picker.none'), kind: 'none' }] : [];
    if (this.tab === 'emoji') {
      const q = query.toLowerCase();
      const hits = EMOJI.filter(([name]) => name.includes(q));
      return { options: [...none, ...hits.map(([name, ch]): Option => ({ value: ch, label: name, kind: 'emoji' }))], total: hits.length };
    }
    const entries = mergeEntries(this.opts.runtime.icons, this.catalog);
    const { names, total } = searchIcons(entries, query, MAX_OPTIONS);
    return { options: [...none, ...names.map((name): Option => ({ value: name, label: name, kind: 'icon' }))], total };
  }

  /** Rebuilds the options for the current query and tab. */
  render(): void {
    const { runtime } = this.opts;
    const { options, total } = this.candidates();
    this.options = options;
    const selected = options.findIndex((o) => o.value === (this.opts.current ?? null) && (o.kind !== 'none' || this.opts.allowNone));
    this.index = this.input.value.trim() === '' && selected >= 0 ? selected : 0;
    this.listbox.replaceChildren();
    options.forEach((option, i) => {
      const li = document.createElement('li');
      li.id = `${this.id}-opt-${i}`;
      li.className = `nowo-milkdown-picker__option nowo-milkdown-picker__option--${option.kind}`;
      li.setAttribute('role', 'option');
      li.dataset.index = String(i);
      if (option.value !== null) li.dataset.value = option.value;
      let art: Element | null;
      if (option.kind === 'icon') art = iconSvg(runtime, option.value!);
      else if (option.kind === 'none') art = glyph('ban', 'nowo-milkdown-picker__art');
      else {
        art = document.createElement('span');
        art.className = 'nowo-milkdown-picker__emoji';
        art.setAttribute('aria-hidden', 'true');
        art.textContent = option.value;
      }
      if (art) li.append(art);
      const label = document.createElement('span');
      label.className = 'nowo-milkdown-picker__name';
      label.textContent = option.label;
      li.append(label);
      this.listbox.append(li);
    });
    const shown = options.filter((o) => o.kind !== 'none').length;
    if (!shown) {
      const li = document.createElement('li');
      li.className = 'nowo-milkdown-picker__empty';
      li.setAttribute('role', 'presentation');
      li.textContent = t(runtime, 'picker.empty');
      this.listbox.append(li);
    }
    this.live.textContent = shown < total ? t(runtime, 'picker.more', { shown, count: total }) : t(runtime, 'picker.count', { count: total });
    this.highlight();
  }

  private highlight(): void {
    this.listbox.querySelectorAll('[role="option"]').forEach((el, i) => el.setAttribute('aria-selected', String(i === this.index)));
    if (this.options.length) this.input.setAttribute('aria-activedescendant', `${this.id}-opt-${this.index}`);
    else this.input.removeAttribute('aria-activedescendant');
    this.listbox.querySelector('[aria-selected="true"]')?.scrollIntoView?.({ block: 'nearest' });
  }

  private move(delta: number, wrap: boolean): void {
    const n = this.options.length;
    if (!n) return;
    const next = this.index + delta;
    this.index = wrap ? (next + n) % n : Math.min(Math.max(next, 0), n - 1);
    this.highlight();
  }

  onKey(event: KeyboardEvent): void {
    const onTab = this.tabs.includes(event.target as HTMLButtonElement);
    let handled = true;
    switch (event.key) {
      case 'ArrowDown':
        if (onTab) handled = false;
        else this.move(1, true);
        break;
      case 'ArrowUp':
        if (onTab) handled = false;
        else this.move(-1, true);
        break;
      case 'ArrowLeft':
      case 'ArrowRight':
        if (onTab) {
          const tab: PickerTab = this.tab === 'icons' ? 'emoji' : 'icons';
          this.select(tab, false);
          this.tabs.find((b) => b.dataset.tab === tab)?.focus();
        } else handled = false;
        break;
      case 'PageDown':
        this.move(PAGE, false);
        break;
      case 'PageUp':
        this.move(-PAGE, false);
        break;
      case 'Enter':
        if (onTab) handled = false;
        else this.pick();
        break;
      case 'Escape':
        this.close(true);
        break;
      case 'Tab': {
        const active = this.tabs.find((b) => b.dataset.tab === this.tab);
        if (active && !event.shiftKey && onTab) this.input.focus();
        else if (active && event.shiftKey && !onTab) active.focus();
        else this.close(true);
        break;
      }
      default:
        handled = false;
    }
    if (handled) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  private pick(): void {
    const option = this.options[this.index];
    if (!option) return;
    this.teardown();
    this.opts.onPick(option.value);
  }

  /** Closes without a pick. */
  close(restoreFocus: boolean): void {
    if (this.closed) return;
    this.teardown();
    this.opts.onClose(restoreFocus);
  }

  private teardown(): void {
    this.closed = true;
    document.removeEventListener('pointerdown', this.onOutside, true);
    this.element.remove();
    if (current === this) current = null;
  }
}

/**
 * Opens a picker (closing one already open on the page).
 *
 * @param opts - Where, what and the callbacks
 * @returns The picker (shown; the catalog loads in the background)
 */
export function open(opts: PickerOptions): IconPicker {
  current?.close(false);
  const picker = new IconPicker(opts);
  current = picker;
  void picker.show();
  return picker;
}
