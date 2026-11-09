/**
 * The `top_bar` feature (a lazy chunk): Crepe's fixed top bar with translated heading options and, on narrow viewports
 * (MUX-41), an accessible "⋮" overflow menu instead of a bar that wraps to several rows.
 *
 * Crepe renders the bar with Vue and gives its icon buttons no name; this module names them, and below
 * {@link TOP_BAR_GROUP_MEDIA_QUERY} keeps the bar on one row: the items that do not fit are hidden
 * (`data-nowo-overflow`) and offered by a menu button (`aria-haspopup="menu"`, `aria-expanded`) that opens the shared
 * {@link Menu} (arrow keys, Home / End, type-ahead, Esc closes and gives focus back to the button). Desktop keeps
 * Crepe's bar as it is. Crepe runs its controls on pointerdown only; Enter / Space run them too (the heading selector
 * opens the same menu with its options).
 */
import type { CrepeBuilder } from '@milkdown/crepe/builder';
import { topBar } from '@milkdown/crepe/feature/top-bar';
import type { Ctx } from '@milkdown/kit/ctx';
import { t, type Runtime } from '../runtime';
import { glyph } from '../ui/icons';
import { Menu, type MenuGroups, type MenuItem } from '../ui/menu';

/** Viewports where the top bar groups its overflow behind "⋮" (phones). */
export const TOP_BAR_GROUP_MEDIA_QUERY = '(max-width: 767.98px)';

/** Class of the bar while it groups its overflow. */
export const GROUPED_CLASS = 'nowo-milkdown-top-bar--grouped';

/** Attribute of the bar children hidden behind "⋮". */
export const OVERFLOW_ATTR = 'data-nowo-overflow';

/** One option of the heading selector. */
export type TopBarOption = { label: string; run: (ctx: Ctx) => void };

/** One control of the bar, in the order Crepe renders them (dividers excluded). */
export type TopBarEntry = {
  key: string;
  group: string;
  label: string;
  icon?: string;
  run?: (ctx: Ctx) => void;
  /** The heading selector: its options and the label of the current one. */
  options?: TopBarOption[];
  current?: (ctx: Ctx) => string;
};

/** Message key and glyph of Crepe's top-bar items. */
export const TOP_BAR_ITEMS: Readonly<Record<string, { key: string; icon?: string }>> = {
  'heading-selector': { key: 'topbar.heading', icon: 'pilcrow' },
  bold: { key: 'topbar.bold', icon: 'bold' },
  italic: { key: 'topbar.italic', icon: 'italic' },
  strikethrough: { key: 'topbar.strikethrough', icon: 'strikethrough' },
  code: { key: 'topbar.code', icon: 'code' },
  'bullet-list': { key: 'topbar.bullet_list', icon: 'list' },
  'ordered-list': { key: 'topbar.ordered_list', icon: 'list-numbers' },
  'task-list': { key: 'topbar.task_list', icon: 'list-check' },
  link: { key: 'topbar.link', icon: 'link' },
  image: { key: 'topbar.image', icon: 'photo' },
  table: { key: 'topbar.table', icon: 'table' },
  'code-block': { key: 'topbar.code_block', icon: 'file-code' },
  math: { key: 'topbar.math', icon: 'math-function' },
  quote: { key: 'topbar.quote', icon: 'quote' },
  hr: { key: 'topbar.hr', icon: 'separator-horizontal' },
};

/** The heading options of the selector, translated (Crepe's defaults are English only). */
export function headingOptions(runtime: Runtime): { label: string; level: number | null }[] {
  return [
    { label: t(runtime, 'topbar.paragraph'), level: null },
    ...[1, 2, 3, 4, 5, 6].map((level) => ({ label: t(runtime, `topbar.h${level}`), level })),
  ];
}

type CrepeTopBarItem = {
  key: string;
  icon?: string;
  onRun?: (ctx: Ctx) => void;
  selector?: { options: { label: string; onSelect: (ctx: Ctx) => void }[]; activeLabel: (ctx: Ctx) => string };
};

/**
 * Adds Crepe's top bar with translated headings; the returned list fills with the bar's controls when Crepe builds it.
 *
 * @param builder - The Crepe builder of the editor
 * @param runtime - The editor runtime (messages)
 * @returns The bar's controls, in render order
 */
export function addTopBar(builder: CrepeBuilder, runtime: Runtime): TopBarEntry[] {
  const entries: TopBarEntry[] = [];
  builder.addFeature(topBar, {
    headingOptions: headingOptions(runtime),
    buildTopBar: (groups) => {
      entries.length = 0;
      for (const group of groups.build()) {
        for (const item of group.items as unknown as CrepeTopBarItem[]) {
          // Crepe renders only selectors and items with an action (the same filter as its component).
          if (!item.selector && !item.onRun) continue;
          const known = TOP_BAR_ITEMS[item.key];
          const entry: TopBarEntry = {
            key: item.key,
            group: group.key,
            label: known ? t(runtime, known.key) : t(runtime, 'editor.button'),
            ...(known?.icon ? { icon: known.icon } : {}),
          };
          if (item.selector) {
            const selector = item.selector;
            entry.options = selector.options.map((o) => ({ label: o.label, run: o.onSelect }));
            entry.current = (ctx) => selector.activeLabel(ctx);
          } else {
            entry.run = item.onRun;
          }
          entries.push(entry);
        }
      }
    },
  });
  return entries;
}

/** What the overflow watcher needs from the editor. */
export type TopBarHost = {
  /** Runs a command of the bar with the editor ctx. */
  run: (fn: (ctx: Ctx) => void) => void;
  /** Gives the focus back to the editable. */
  focusEditor: () => void;
};

const isDivider = (el: Element): boolean => el.classList.contains('top-bar-divider');

/**
 * Names the bar's controls and groups its overflow behind "⋮" on narrow viewports.
 *
 * @param surface - The editor surface (holds Crepe's `.milkdown-top-bar`)
 * @param menuHost - The widget root the menu is appended to (theme tokens)
 * @param entries - The bar's controls from {@link addTopBar}
 * @param runtime - The editor runtime (messages, menu icons)
 * @param host - Runs commands and focuses the editor
 * @returns Stops watching and removes the menu button
 */
export function watchTopBar(surface: HTMLElement, menuHost: HTMLElement, entries: TopBarEntry[], runtime: Runtime, host: TopBarHost): () => void {
  const bar = surface.querySelector<HTMLElement>('.milkdown-top-bar');
  if (!bar) return () => undefined;
  const media = typeof matchMedia === 'function' ? matchMedia(TOP_BAR_GROUP_MEDIA_QUERY) : null;

  const more = document.createElement('button');
  more.type = 'button';
  more.className = 'nowo-milkdown-top-bar__more';
  more.setAttribute('aria-label', t(runtime, 'topbar.more'));
  more.title = t(runtime, 'topbar.more');
  more.setAttribute('aria-haspopup', 'menu');
  more.setAttribute('aria-expanded', 'false');
  more.hidden = true;
  const dots = glyph('dots-vertical', 'nowo-milkdown-top-bar__more-icon');
  if (dots) more.append(dots);
  else more.textContent = '⋮';

  let hidden: TopBarEntry[] = [];
  let controls: Element[] = [];
  let anchor: HTMLElement = more;
  let suppressClick = false;
  /** True from the opening until the task after the closing: a press that closed the menu still sees it open. */
  let wasOpen = false;
  const menu = new Menu(menuHost, t(runtime, 'topbar.more'), (restore) => {
    anchor.setAttribute('aria-expanded', 'false');
    anchor.removeAttribute('aria-controls');
    setTimeout(() => {
      wasOpen = menu.isOpen;
    }, 0);
    if (restore) anchor.focus();
  });
  menu.icons = runtime.menuIcons;

  const optionItems = (entry: TopBarEntry): MenuItem[] => {
    let current = '';
    host.run((ctx) => {
      current = entry.current?.(ctx) ?? '';
    });
    return entry.options!.map((option, i) => ({
      id: `top_bar_heading_${i}`,
      label: option.label,
      checked: option.label === current,
      run: () => {
        host.run(option.run);
        host.focusEditor();
      },
    }));
  };

  const groups = (): MenuGroups => {
    const out: MenuGroups = [];
    let last: string | null = null;
    for (const entry of hidden) {
      if (entry.group !== last) out.push([]);
      last = entry.group;
      const item: MenuItem = { id: `top_bar_${entry.key}`, label: entry.label, ...(entry.icon ? { icon: entry.icon } : {}) };
      if (entry.options) {
        item.items = optionItems(entry);
      } else {
        const run = entry.run!;
        item.run = () => {
          host.run(run);
          host.focusEditor();
        };
      }
      out[out.length - 1]!.push(item);
    }
    return out;
  };

  const openAt = (target: HTMLElement, items: MenuGroups): void => {
    if (menu.isOpen) menu.closeAll(false);
    anchor = target;
    const rect = target.getBoundingClientRect();
    menu.open(items, rect.left, rect.bottom);
    target.setAttribute('aria-expanded', 'true');
    target.setAttribute('aria-controls', menu.element.id);
    wasOpen = true;
  };
  const open = (): void => {
    if (hidden.length) openAt(more, groups());
  };
  // A press on the button while the menu is open closes it (outside press) and must not reopen it on click.
  more.addEventListener('pointerdown', () => {
    suppressClick = wasOpen && !menu.isOpen;
  });
  more.addEventListener('mousedown', (event) => event.preventDefault());
  more.addEventListener('click', () => {
    if (suppressClick) {
      suppressClick = false;
      return;
    }
    if (menu.isOpen) menu.closeAll(true);
    else open();
  });
  more.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (!menu.isOpen) open();
    }
  });

  // Crepe runs its controls on pointerdown only: Enter / Space (a click with no pointer, detail 0) run them too.
  const onKeyboardClick = (event: MouseEvent): void => {
    if (event.detail !== 0) return;
    const control = controls.find((el) => el.contains(event.target as Node));
    const entry = control ? entries[controls.indexOf(control)] : undefined;
    if (!control || !entry) return;
    event.preventDefault();
    if (entry.options) {
      const button = control.matches('button') ? (control as HTMLElement) : control.querySelector<HTMLElement>('button');
      if (button) openAt(button, [optionItems(entry)]);
      return;
    }
    host.run(entry.run!);
  };
  bar.addEventListener('click', onKeyboardClick);
  bar.append(more);

  /** Crepe's controls (no dividers) mapped to their entries; the a11y watcher may have given them a generic name. */
  const name = (): void => {
    controls.forEach((el, i) => {
      const entry = entries[i];
      const button = entry && (el.matches('button') ? el : el.querySelector('button'));
      if (!entry || !button) return;
      if (entry.options) {
        // The heading selector shows its current option: that visible text stays its name (WCAG 2.5.3).
        button.setAttribute('aria-haspopup', 'menu');
        if (!button.hasAttribute('aria-expanded')) button.setAttribute('aria-expanded', 'false');
        return;
      }
      button.setAttribute('aria-label', entry.label);
      button.setAttribute('title', entry.label);
    });
  };

  const overflowing = (children: Element[], limit: number): number =>
    children.findIndex((el) => !isDivider(el) && el.getBoundingClientRect().right > limit + 0.5);

  const layout = (): void => {
    const inner = bar.querySelector<HTMLElement>('.top-bar-inner');
    const children = inner ? [...inner.children] : [];
    children.forEach((el) => el.removeAttribute(OVERFLOW_ATTR));
    controls = children.filter((el) => !isDivider(el));
    name();
    const grouped = media?.matches === true;
    bar.classList.toggle(GROUPED_CLASS, grouped);
    hidden = [];
    more.hidden = true;
    if (!grouped || !inner) {
      if (menu.isOpen) menu.closeAll(false);
      return;
    }
    let from = overflowing(children, inner.getBoundingClientRect().right);
    if (from >= 0) {
      // Measure again with the button shown: it takes room from the bar.
      more.hidden = false;
      from = overflowing(children, inner.getBoundingClientRect().right);
      if (from < 0) from = children.length - 1;
      if (from > 0 && isDivider(children[from - 1]!)) from--;
      children.slice(from).forEach((el) => el.setAttribute(OVERFLOW_ATTR, ''));
      hidden = controls.filter((el) => el.hasAttribute(OVERFLOW_ATTR)).map((el) => entries[controls.indexOf(el)]).filter((e): e is TopBarEntry => !!e);
      more.hidden = hidden.length === 0;
    }
    if (!hidden.length && menu.isOpen) menu.closeAll(false);
  };

  // Crepe re-renders the bar on every editor update: lay it out again once per burst of changes.
  let queued = false;
  const schedule = (): void => {
    if (queued) return;
    queued = true;
    queueMicrotask(() => {
      queued = false;
      layout();
    });
  };
  const observer = new MutationObserver((records) => {
    if (records.some((r) => r.target !== bar || [...r.addedNodes, ...r.removedNodes].some((n) => n !== more))) schedule();
  });
  observer.observe(bar, { childList: true, subtree: true });
  const resize = typeof ResizeObserver === 'function' ? new ResizeObserver(schedule) : null;
  resize?.observe(bar);
  media?.addEventListener?.('change', schedule);
  layout();

  return () => {
    observer.disconnect();
    resize?.disconnect();
    bar.removeEventListener('click', onKeyboardClick);
    media?.removeEventListener?.('change', schedule);
    menu.destroy();
    more.remove();
    bar.classList.remove(GROUPED_CLASS);
  };
}
