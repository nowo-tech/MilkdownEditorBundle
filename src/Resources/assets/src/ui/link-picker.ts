/**
 * 1.18 `link_picker` (a lazy chunk): one picker for the link button, `Mod-k` and `[[`, with two tabs:
 *
 * - **Wiki page**: a search field (`role="combobox"`, the focus stays there, `aria-activedescendant`) over a grouped
 *   `role="listbox"` — the current wiki first, then other wikis under their name (WAI-ARIA 1.2 combobox with a listbox
 *   popup). Picking a page goes to step 2, its sections, with *Top of page* first (only when the host gives a sections
 *   URL). The result is a `[[wiki:<uuid>#<id>]]` node.
 * - **External URL**: a URL field (and the link text when nothing is selected), checked as it is typed
 *   ({@link checkLinkUrl}); the preview shows the host (punycode for an internationalised name).
 *
 * Without a host candidates URL there is no *Wiki page* tab. Data comes from the host (see USAGE "Link picker"):
 *   GET <candidates>?q=  → {"here":[{id,label,url,icon?}],"others":[{"wiki":"<name>","pages":[…]}]}  (a plain array of
 *                          `{id,label,url}` is read as `here`, for hosts of the 1.0 `[[` contract)
 *   GET <sections with {id}> → {"sections":[{id,level,text}]}
 * Every answer is validated (UUIDs, ids, lengths, counts) and every label is rendered with `textContent` only.
 *
 * Keys: Up / Down (wrap), Home / End, Enter picks, Escape goes back from the sections or closes, Left / Right on the
 * tabs. Tab moves between the picker's controls; the picker closes when the focus or a click leaves it.
 */
import { isUuid } from '../dialect/patterns';
import { safeUrl } from '../link-titles';
import { normaliseId } from '../plugins/heading-slug';
import { t, type Runtime } from '../runtime';
import { glyph } from './icons';
import { hideLayer, placeLayer, showLayer } from './layer';
import { checkLinkUrl, type CheckedUrl } from './link-url';

/** Longest query sent to the host (characters; the host cuts it too). */
export const MAX_QUERY = 100;
/** Candidates kept: the current wiki, other wikis, pages per other wiki, in all. */
export const MAX_HERE = 10;
export const MAX_WIKIS = 5;
export const MAX_PER_WIKI = 3;
export const MAX_CANDIDATES = 10;
/** Sections kept per page. */
export const MAX_SECTIONS = 200;
/** Longest label or section text kept (characters). */
export const MAX_LABEL = 200;
/** Wait after a keystroke before asking the host (ms). */
export const DEBOUNCE = 150;

export type PageCandidate = { id: string; label: string; url: string };
export type CandidateGroups = { here: PageCandidate[]; others: { wiki: string; pages: PageCandidate[] }[] };
export type Section = { id: string; level: number; text: string };
export type FetchJson = (url: string, signal: AbortSignal) => Promise<unknown>;

export type PickResult =
  | { kind: 'page'; pageId: string; anchor: string; label: string; url: string; section: string }
  | { kind: 'url'; href: string; text: string };

/** How the picker opens (editing an existing link fills it). */
export type PickerInit = {
  tab?: 'page' | 'url';
  query?: string;
  pageId?: string;
  anchor?: string;
  href?: string;
  text?: string;
};

export type LinkPickerOptions = {
  host: HTMLElement;
  runtime: Runtime;
  x: number;
  y: number;
  /** Host candidates URL (`suggestions['[[']`); null: external URLs only. */
  candidatesUrl: string | null;
  /** Sections URL template with `{id}` (`link_sections`); null: no step 2. */
  sectionsUrl: string | null;
  schemes: readonly string[];
  /** Asks for the link text (nothing selected). */
  withText: boolean;
  init?: PickerInit;
  fetcher: FetchJson;
  onPick: (result: PickResult) => void;
  onClose: (restoreFocus: boolean) => void;
};

const str = (v: unknown, max = MAX_LABEL): string => (typeof v === 'string' ? [...v].slice(0, max).join('') : '');

function candidate(value: unknown): PageCandidate | null {
  if (!value || typeof value !== 'object') return null;
  const c = value as Record<string, unknown>;
  if (typeof c.id !== 'string' || !isUuid(c.id) || typeof c.label !== 'string') return null;
  return { id: c.id, label: str(c.label), url: safeUrl(c.url) };
}

/**
 * Validates a candidates answer.
 *
 * @param data - The JSON answer
 * @returns The groups, within the limits
 */
export function parseCandidates(data: unknown): CandidateGroups {
  if (Array.isArray(data)) return { here: data.map(candidate).filter((c): c is PageCandidate => c !== null).slice(0, MAX_HERE), others: [] };
  const v = data && typeof data === 'object' ? (data as Record<string, unknown>) : {};
  const here = (Array.isArray(v.here) ? v.here : []).map(candidate).filter((c): c is PageCandidate => c !== null).slice(0, MAX_HERE);
  const others: CandidateGroups['others'] = [];
  let total = 0;
  for (const group of Array.isArray(v.others) ? v.others : []) {
    if (others.length >= MAX_WIKIS || total >= MAX_CANDIDATES) break;
    const g = group && typeof group === 'object' ? (group as Record<string, unknown>) : {};
    const wiki = str(g.wiki, 100).trim();
    const pages = (Array.isArray(g.pages) ? g.pages : [])
      .map(candidate)
      .filter((c): c is PageCandidate => c !== null)
      .slice(0, Math.min(MAX_PER_WIKI, MAX_CANDIDATES - total));
    if (wiki === '' || pages.length === 0) continue;
    total += pages.length;
    others.push({ wiki, pages });
  }
  return { here, others };
}

/**
 * Validates a sections answer.
 *
 * @param data - The JSON answer
 * @returns Valid sections, at most {@link MAX_SECTIONS}
 */
export function parseSections(data: unknown): Section[] {
  const list = data && typeof data === 'object' ? (data as Record<string, unknown>).sections : null;
  const out: Section[] = [];
  const seen = new Set<string>();
  for (const s of Array.isArray(list) ? list : []) {
    if (out.length >= MAX_SECTIONS) break;
    const v = s && typeof s === 'object' ? (s as Record<string, unknown>) : {};
    const id = normaliseId(v.id);
    const level = typeof v.level === 'number' && Number.isInteger(v.level) && v.level >= 1 && v.level <= 6 ? v.level : 0;
    const text = str(v.text).trim();
    if (id === '' || level === 0 || text === '' || seen.has(id)) continue;
    seen.add(id);
    out.push({ id, level, text });
  }
  return out;
}

const withQuery = (url: string, q: string): string => `${url}${url.includes('?') ? '&' : '?'}q=${encodeURIComponent(q)}`;
/** Control and bidi characters never go to the host. */
// eslint-disable-next-line no-control-regex
const cleanQuery = (q: string): string => [...q.replace(/[\u{0}-\u{1f}\u{7f}-\u{9f}\u{200e}\u{200f}\u{202a}-\u{202e}\u{2066}-\u{2069}]/gu, '')].slice(0, MAX_QUERY).join('').trim();

type Row =
  | { kind: 'page'; page: PageCandidate; group: number }
  | { kind: 'top' }
  | { kind: 'section'; section: Section };

let sequence = 0;
let current: LinkPicker | null = null;

export class LinkPicker {
  readonly element: HTMLDivElement;
  readonly tabs: HTMLButtonElement[] = [];
  readonly input: HTMLInputElement;
  readonly listbox: HTMLDivElement;
  readonly live: HTMLDivElement;
  readonly urlInput: HTMLInputElement;
  readonly textInput: HTMLInputElement | null;
  readonly preview: HTMLParagraphElement;
  readonly insert: HTMLButtonElement;
  readonly back: HTMLButtonElement;
  tab: 'page' | 'url';
  /** The page whose sections are listed (step 2), or null. */
  page: PageCandidate | null = null;
  private rows: Row[] = [];
  private index = 0;
  private sections: Section[] = [];
  private groups: CandidateGroups = { here: [], others: [] };
  private closed = false;
  private timer: ReturnType<typeof setTimeout> | null = null;
  private abort: AbortController | null = null;
  private readonly id = `nowo-milkdown-link-${++sequence}`;
  private readonly pagePanel: HTMLDivElement;
  private readonly urlPanel: HTMLDivElement;
  private readonly heading: HTMLParagraphElement;
  private readonly onOutside = (event: Event): void => {
    if (!this.element.contains(event.target as Node)) this.close(false);
  };
  private readonly onFocusOut = (event: FocusEvent): void => {
    const next = event.relatedTarget as Node | null;
    if (next && !this.element.contains(next)) this.close(false);
  };

  constructor(private readonly opts: LinkPickerOptions) {
    const { runtime } = opts;
    const init = opts.init ?? {};
    const pages = opts.candidatesUrl !== null;
    this.tab = pages && init.tab !== 'url' ? 'page' : 'url';
    this.element = document.createElement('div');
    this.element.id = this.id;
    this.element.className = 'nowo-milkdown-picker nowo-milkdown-link-picker';
    this.element.setAttribute('role', 'dialog');
    this.element.setAttribute('aria-label', t(runtime, 'link.picker'));
    this.element.addEventListener('keydown', (event) => this.onKey(event));
    this.element.addEventListener('focusout', this.onFocusOut);

    if (pages) {
      const list = document.createElement('div');
      list.className = 'nowo-milkdown-picker__tabs';
      list.setAttribute('role', 'tablist');
      list.setAttribute('aria-label', t(runtime, 'link.picker'));
      for (const tab of ['page', 'url'] as const) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'nowo-milkdown-picker__tab';
        button.id = `${this.id}-tab-${tab}`;
        button.setAttribute('role', 'tab');
        button.setAttribute('aria-controls', `${this.id}-panel-${tab}`);
        button.dataset.tab = tab;
        button.textContent = t(runtime, `link.tab_${tab}`);
        button.addEventListener('click', () => this.select(tab, true));
        this.tabs.push(button);
        list.append(button);
      }
      this.element.append(list);
    }

    // Wiki page panel: search, then sections.
    this.pagePanel = document.createElement('div');
    this.pagePanel.id = `${this.id}-panel-page`;
    this.pagePanel.className = 'nowo-milkdown-link-picker__panel';
    this.pagePanel.setAttribute('role', pages ? 'tabpanel' : 'group');
    if (pages) this.pagePanel.setAttribute('aria-labelledby', `${this.id}-tab-page`);
    const step = document.createElement('div');
    step.className = 'nowo-milkdown-link-picker__step';
    this.back = document.createElement('button');
    this.back.type = 'button';
    this.back.className = 'nowo-milkdown-link-picker__back';
    this.back.textContent = t(runtime, 'link.back');
    this.back.hidden = true;
    this.back.addEventListener('click', () => this.leaveSections(true));
    this.heading = document.createElement('p');
    this.heading.className = 'nowo-milkdown-link-picker__page';
    this.heading.hidden = true;
    step.append(this.back, this.heading);
    const field = document.createElement('div');
    field.className = 'nowo-milkdown-picker__field';
    const icon = runtime.menuIcons ? glyph('search', 'nowo-milkdown-picker__search-icon') : null;
    if (icon) field.append(icon);
    this.input = document.createElement('input');
    this.input.type = 'search';
    this.input.className = 'nowo-milkdown-picker__search';
    this.input.autocomplete = 'off';
    this.input.spellcheck = false;
    this.input.maxLength = MAX_QUERY;
    this.input.value = str(init.query, MAX_QUERY);
    this.input.setAttribute('role', 'combobox');
    this.input.setAttribute('aria-expanded', 'true');
    this.input.setAttribute('aria-autocomplete', 'list');
    this.input.setAttribute('aria-controls', `${this.id}-list`);
    this.input.addEventListener('input', () => (this.page ? this.render() : this.schedule()));
    field.append(this.input);
    this.listbox = document.createElement('div');
    this.listbox.id = `${this.id}-list`;
    this.listbox.className = 'nowo-milkdown-picker__list nowo-milkdown-link-picker__list';
    this.listbox.setAttribute('role', 'listbox');
    this.listbox.addEventListener('mousedown', (event) => {
      const option = (event.target as HTMLElement).closest<HTMLElement>('[role="option"]');
      if (!option) return;
      event.preventDefault();
      this.index = Number(option.dataset.index);
      this.choose();
    });
    this.pagePanel.append(step, field, this.listbox);

    // External URL panel.
    this.urlPanel = document.createElement('div');
    this.urlPanel.id = `${this.id}-panel-url`;
    this.urlPanel.className = 'nowo-milkdown-link-picker__panel nowo-milkdown-link-picker__url';
    this.urlPanel.setAttribute('role', pages ? 'tabpanel' : 'group');
    if (pages) this.urlPanel.setAttribute('aria-labelledby', `${this.id}-tab-url`);
    else this.urlPanel.setAttribute('aria-label', t(runtime, 'link.tab_url'));
    this.urlInput = this.textField(this.urlPanel, 'url', t(runtime, 'link.url'), str(init.href, 2048));
    this.urlInput.type = 'url';
    this.urlInput.addEventListener('input', () => this.check());
    this.textInput = opts.withText ? this.textField(this.urlPanel, 'text', t(runtime, 'link.text'), str(init.text)) : null;
    this.preview = document.createElement('p');
    this.preview.id = `${this.id}-preview`;
    this.preview.className = 'nowo-milkdown-link-picker__preview';
    this.preview.setAttribute('aria-live', 'polite');
    this.urlInput.setAttribute('aria-describedby', this.preview.id);
    this.insert = document.createElement('button');
    this.insert.type = 'button';
    this.insert.className = 'nowo-milkdown-link-picker__insert';
    this.insert.textContent = t(runtime, 'link.insert');
    this.insert.addEventListener('click', () => this.submitUrl());
    this.urlPanel.append(this.preview, this.insert);

    this.live = document.createElement('div');
    this.live.className = 'nowo-milkdown-sr-only';
    this.live.setAttribute('aria-live', 'polite');
    this.element.append(this.pagePanel, this.urlPanel, this.live);
  }

  private textField(panel: HTMLElement, name: string, text: string, value: string): HTMLInputElement {
    const label = document.createElement('label');
    label.className = 'nowo-milkdown-link-picker__label';
    const span = document.createElement('span');
    span.textContent = text;
    const input = document.createElement('input');
    input.type = 'text';
    input.name = name;
    input.className = 'nowo-milkdown-link-picker__input';
    input.autocomplete = 'off';
    input.spellcheck = false;
    input.value = value;
    label.append(span, input);
    panel.append(label);
    return input;
  }

  get isOpen(): boolean {
    return !this.closed;
  }

  /** Shows the picker on its first tab (or on the sections of the page being edited). */
  show(): void {
    showLayer(this.element, this.opts.host);
    placeLayer(this.element, this.opts.x, this.opts.y);
    document.addEventListener('pointerdown', this.onOutside, true);
    this.check();
    const init = this.opts.init ?? {};
    if (this.tab === 'page' && this.opts.sectionsUrl && init.pageId && isUuid(init.pageId)) {
      // Editing a page link: straight to its sections, the current one active.
      void this.enterSections({ id: init.pageId, label: str(init.text) || init.pageId, url: '' }, normaliseId(init.anchor));
      this.select('page', false);
    } else {
      this.select(this.tab, true);
    }
  }

  /** Switches the tab. */
  select(tab: 'page' | 'url', focus: boolean): void {
    this.tab = this.tabs.length ? tab : 'url';
    for (const button of this.tabs) {
      const on = button.dataset.tab === this.tab;
      button.setAttribute('aria-selected', String(on));
      button.tabIndex = on ? 0 : -1;
    }
    this.pagePanel.hidden = this.tab !== 'page';
    this.urlPanel.hidden = this.tab !== 'url';
    if (this.tab === 'page' && !this.page && this.rows.length === 0 && !this.closed && this.element.isConnected) void this.load();
    if (focus) (this.tab === 'page' ? this.input : this.urlInput).focus();
  }

  private schedule(): void {
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => void this.load(), DEBOUNCE);
  }

  /** Asks the host for candidates of the current query. */
  async load(): Promise<void> {
    const url = this.opts.candidatesUrl;
    if (!url || this.closed) return;
    this.abort?.abort();
    const abort = new AbortController();
    this.abort = abort;
    this.input.setAttribute('placeholder', t(this.opts.runtime, 'link.search'));
    this.input.setAttribute('aria-label', t(this.opts.runtime, 'link.search'));
    try {
      this.groups = parseCandidates(await this.opts.fetcher(withQuery(url, cleanQuery(this.input.value)), abort.signal));
    } catch {
      if (abort.signal.aborted) return;
      this.groups = { here: [], others: [] };
      this.live.textContent = t(this.opts.runtime, 'link.failed');
    }
    if (this.closed || abort.signal.aborted || this.page) return;
    this.render();
  }

  private async enterSections(page: PageCandidate, anchor = ''): Promise<void> {
    const { runtime } = this.opts;
    if (!this.opts.sectionsUrl) {
      this.finishPage(page, null);
      return;
    }
    this.page = page;
    this.sections = [];
    this.back.hidden = false;
    this.heading.hidden = false;
    this.heading.textContent = page.label;
    this.input.value = '';
    this.input.setAttribute('placeholder', t(runtime, 'link.search_sections'));
    this.input.setAttribute('aria-label', t(runtime, 'link.search_sections'));
    this.render();
    this.input.focus();
    this.abort?.abort();
    const abort = new AbortController();
    this.abort = abort;
    try {
      this.sections = parseSections(await this.opts.fetcher(this.opts.sectionsUrl.replace('{id}', encodeURIComponent(page.id)), abort.signal));
    } catch {
      if (abort.signal.aborted) return;
      this.sections = [];
    }
    if (this.closed || abort.signal.aborted || this.page !== page) return;
    this.render();
    if (anchor) {
      const at = this.rows.findIndex((r) => r.kind === 'section' && r.section.id === anchor);
      if (at >= 0) {
        this.index = at;
        this.highlight();
      }
    }
  }

  private leaveSections(focus: boolean): void {
    this.page = null;
    this.sections = [];
    this.back.hidden = true;
    this.heading.hidden = true;
    this.input.value = '';
    if (focus) this.input.focus();
    void this.load();
  }

  /** Rebuilds the options. */
  render(): void {
    const { runtime } = this.opts;
    this.listbox.replaceChildren();
    this.rows = [];
    const option = (parent: HTMLElement, row: Row, label: string, extra = ''): void => {
      const i = this.rows.push(row) - 1;
      const el = document.createElement('div');
      el.id = `${this.id}-opt-${i}`;
      el.className = `nowo-milkdown-picker__option nowo-milkdown-link-picker__option${extra}`;
      el.setAttribute('role', 'option');
      el.dataset.index = String(i);
      const name = document.createElement('span');
      name.className = 'nowo-milkdown-picker__name';
      name.textContent = label;
      el.append(name);
      parent.append(el);
    };
    const group = (label: string, i: number): HTMLElement => {
      const el = document.createElement('div');
      el.setAttribute('role', 'group');
      el.className = 'nowo-milkdown-link-picker__group';
      const title = document.createElement('div');
      title.id = `${this.id}-group-${i}`;
      title.className = 'nowo-milkdown-link-picker__group-label';
      title.setAttribute('role', 'presentation');
      title.textContent = label;
      el.setAttribute('aria-labelledby', title.id);
      el.append(title);
      this.listbox.append(el);
      return el;
    };
    if (this.page) {
      const q = this.input.value.trim().toLowerCase();
      this.listbox.setAttribute('aria-label', t(runtime, 'link.sections'));
      if (q === '') option(this.listbox, { kind: 'top' }, t(runtime, 'link.section_top'));
      for (const section of this.sections) {
        if (q !== '' && !section.text.toLowerCase().includes(q)) continue;
        option(this.listbox, { kind: 'section', section }, section.text, ` nowo-milkdown-link-picker__option--l${section.level}`);
      }
    } else {
      this.listbox.setAttribute('aria-label', t(runtime, 'link.pages'));
      const here = this.groups.others.length ? group(t(runtime, 'link.here'), 0) : this.listbox;
      for (const page of this.groups.here) option(here, { kind: 'page', page, group: 0 }, page.label);
      this.groups.others.forEach((other, g) => {
        const el = group(other.wiki, g + 1);
        for (const page of other.pages) option(el, { kind: 'page', page, group: g + 1 }, page.label);
      });
    }
    if (!this.rows.length) {
      const empty = document.createElement('div');
      empty.className = 'nowo-milkdown-picker__empty';
      empty.setAttribute('role', 'presentation');
      empty.textContent = t(runtime, 'link.empty');
      this.listbox.append(empty);
    }
    this.live.textContent = t(runtime, 'link.count', { count: this.rows.length });
    this.index = 0;
    this.highlight();
  }

  private highlight(): void {
    this.listbox.querySelectorAll('[role="option"]').forEach((el, i) => el.setAttribute('aria-selected', String(i === this.index)));
    if (this.rows.length) this.input.setAttribute('aria-activedescendant', `${this.id}-opt-${this.index}`);
    else this.input.removeAttribute('aria-activedescendant');
    this.listbox.querySelector('[aria-selected="true"]')?.scrollIntoView?.({ block: 'nearest' });
  }

  private move(delta: number): void {
    const n = this.rows.length;
    if (!n) return;
    this.index = (this.index + delta + n) % n;
    this.highlight();
  }

  /** Checks the URL field and updates the preview and the button. */
  check(): CheckedUrl | null {
    const { runtime } = this.opts;
    const value = this.urlInput.value.trim();
    const result = value === '' ? null : checkLinkUrl(value, this.opts.schemes);
    this.insert.disabled = result === null;
    this.urlInput.setAttribute('aria-invalid', String(value !== '' && result === null));
    if (value === '') this.preview.textContent = '';
    else if (!result) this.preview.textContent = t(runtime, 'link.invalid');
    else this.preview.textContent = result.host ? t(runtime, 'link.preview', { host: result.host }) : t(runtime, 'link.preview_relative');
    return result;
  }

  private submitUrl(): void {
    const result = this.check();
    if (!result) {
      this.urlInput.focus();
      return;
    }
    this.finish({ kind: 'url', href: result.href, text: this.textInput?.value.trim() ?? '' });
  }

  private finishPage(page: PageCandidate, section: Section | null): void {
    if (section) this.opts.runtime.rememberSection(page.id, section.id, section.text);
    this.finish({ kind: 'page', pageId: page.id, anchor: section?.id ?? '', label: page.label, url: page.url, section: section?.text ?? '' });
  }

  private choose(): void {
    const row = this.rows[this.index];
    if (!row) return;
    if (row.kind === 'page') void this.enterSections(row.page);
    else if (this.page) this.finishPage(this.page, row.kind === 'section' ? row.section : null);
  }

  onKey(event: KeyboardEvent): void {
    const target = event.target as HTMLElement;
    const onTab = this.tabs.includes(target as HTMLButtonElement);
    const inSearch = target === this.input;
    let handled = true;
    switch (event.key) {
      case 'ArrowDown':
        if (inSearch) this.move(1);
        else handled = false;
        break;
      case 'ArrowUp':
        if (inSearch) this.move(-1);
        else handled = false;
        break;
      case 'Home':
      case 'End':
        if (inSearch && event.ctrlKey) {
          this.index = event.key === 'Home' ? 0 : Math.max(0, this.rows.length - 1);
          this.highlight();
        } else handled = false;
        break;
      case 'ArrowLeft':
      case 'ArrowRight':
        if (onTab) {
          const tab = this.tab === 'page' ? 'url' : 'page';
          this.select(tab, false);
          this.tabs.find((b) => b.dataset.tab === tab)?.focus();
        } else handled = false;
        break;
      case 'Enter':
        if (inSearch) this.choose();
        else if (target === this.urlInput || target === this.textInput) this.submitUrl();
        else handled = false;
        break;
      case 'Escape':
        if (this.page && this.tab === 'page') this.leaveSections(true);
        else this.close(true);
        break;
      default:
        handled = false;
    }
    if (handled) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  private finish(result: PickResult): void {
    this.teardown();
    this.opts.onPick(result);
  }

  /** Closes without a pick. */
  close(restoreFocus: boolean): void {
    if (this.closed) return;
    this.teardown();
    this.opts.onClose(restoreFocus);
  }

  private teardown(): void {
    this.closed = true;
    if (this.timer) clearTimeout(this.timer);
    this.abort?.abort();
    document.removeEventListener('pointerdown', this.onOutside, true);
    this.element.removeEventListener('focusout', this.onFocusOut);
    hideLayer(this.element);
    this.element.remove();
    if (current === this) current = null;
  }
}

/**
 * Opens a picker (closing one already open on the page).
 *
 * @param opts - Where, the data sources and the callbacks
 * @returns The picker, shown
 */
export function openLinkPickerUi(opts: LinkPickerOptions): LinkPicker {
  current?.close(false);
  const picker = new LinkPicker(opts);
  current = picker;
  picker.show();
  return picker;
}
