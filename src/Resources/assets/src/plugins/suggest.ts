/**
 * Suggestion hook (FR-053 / FR-085): typed triggers open a listbox fed by an async source.
 *
 * ARIA: the ProseMirror editable keeps role="textbox" (multi-line: role="combobox" is single-line and does not
 * allow aria-multiline). While the list is open the editable gets aria-controls, aria-activedescendant and
 * aria-autocomplete="list"; the popup is role="listbox" with role="option" children and a polite live region
 * announces the number of results. Keys: Up / Down, Enter / Tab insert, Escape closes.
 *
 * Keys are read by a capture-phase listener on the editable: Crepe's keymaps (Enter splits a block, Tab
 * indents) run before a ProseMirror plugin added later would see the key.
 */
import { $prose } from '@milkdown/kit/utils';
import { Plugin, PluginKey, type EditorState } from '@milkdown/kit/prose/state';
import type { EditorView } from '@milkdown/kit/prose/view';
import type { Ctx } from '@milkdown/kit/ctx';
import { iconSvg, runtimeCtx, t, type Runtime } from '../runtime';

export type SuggestItem = {
  id: string;
  label: string;
  hint?: string;
  /** Emoji shown before the label. */
  emoji?: string;
  /** Allowlisted Tabler icon shown before the label. */
  icon?: string;
};

export type Range = { from: number; to: number };

export type SuggestTrigger = {
  name: 'mention' | 'page' | 'icon' | 'slash';
  /** Matched against the text before the cursor in the current textblock; group 1 is the query. */
  match: RegExp;
  /** Offset of the trigger inside match[0] (e.g. skip a leading space). */
  lead?: (m: RegExpExecArray) => number;
  source: (query: string, signal: AbortSignal) => Promise<SuggestItem[]>;
  /** Replaces the trigger and query (the range) with the picked item. */
  apply: (view: EditorView, range: Range, item: SuggestItem) => void;
};

export const MAX_ITEMS = 10;
export const DEBOUNCE_MS = 150;
export const suggestKey = new PluginKey('nowo-milkdown-suggest');

type Active = { trigger: SuggestTrigger; from: number; to: number; query: string };
let sequence = 0;
const views = new WeakMap<EditorView, SuggestView>();

/** True while a suggestion list is open for this editor (the Tab handler leaves the key to the list). */
export const isSuggestOpen = (view: EditorView): boolean => views.get(view)?.isOpen === true;

export function findActive(state: EditorState, triggers: SuggestTrigger[]): Active | null {
  const { selection } = state;
  if (!selection.empty) return null;
  const $from = selection.$from;
  if (!$from.parent.isTextblock || $from.parent.type.spec.code) return null;
  const before = $from.parent.textBetween(0, $from.parentOffset, undefined, '￼');
  for (const trigger of triggers) {
    trigger.match.lastIndex = 0;
    const m = trigger.match.exec(before);
    if (m) {
      const lead = trigger.lead?.(m) ?? 0;
      return { trigger, from: $from.pos - (m[0].length - lead), to: $from.pos, query: m[1] ?? '' };
    }
  }
  return null;
}

export class SuggestView {
  readonly listbox: HTMLUListElement;
  readonly live: HTMLDivElement;
  private active: Active | null = null;
  private items: SuggestItem[] = [];
  private index = 0;
  private abort: AbortController | null = null;
  private timer: number | undefined;
  private dismissedAt: number | null = null;
  private readonly id = `nowo-milkdown-suggest-${++sequence}`;
  private readonly onKeyCapture = (event: KeyboardEvent): void => {
    if (this.onKey(event)) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  };

  constructor(
    private readonly view: EditorView,
    private readonly triggers: SuggestTrigger[],
    private readonly runtime: Runtime,
  ) {
    views.set(view, this);
    this.listbox = document.createElement('ul');
    this.listbox.id = this.id;
    this.listbox.className = 'nowo-milkdown-suggest';
    this.listbox.setAttribute('role', 'listbox');
    this.listbox.hidden = true;
    this.listbox.addEventListener('mousedown', (event) => {
      const option = (event.target as HTMLElement).closest<HTMLLIElement>('[role="option"]');
      if (!option) return;
      event.preventDefault();
      this.index = Number(option.dataset.index);
      this.pick();
    });
    view.dom.addEventListener('keydown', this.onKeyCapture, true);
    this.live = document.createElement('div');
    this.live.className = 'nowo-milkdown-sr-only';
    this.live.setAttribute('aria-live', 'polite');
    const host = (view.dom.closest('.nowo-milkdown') as HTMLElement | null) ?? document.body;
    host.append(this.listbox, this.live);
  }

  get isOpen(): boolean {
    return this.active !== null && !this.listbox.hidden;
  }

  update(view: EditorView): void {
    const next = findActive(view.state, this.triggers);
    if (!next) {
      this.close();
      return;
    }
    const changed = !this.active || this.active.query !== next.query || this.active.trigger !== next.trigger;
    this.active = next;
    if (changed) this.schedule();
    this.position();
  }

  destroy(): void {
    this.close();
    this.view.dom.removeEventListener('keydown', this.onKeyCapture, true);
    this.listbox.remove();
    this.live.remove();
    views.delete(this.view);
  }

  onKey(event: KeyboardEvent): boolean {
    if (!this.isOpen) return false;
    switch (event.key) {
      case 'ArrowDown':
        this.move(1);
        return true;
      case 'ArrowUp':
        this.move(-1);
        return true;
      case 'Enter':
      case 'Tab':
        if (!this.items.length) return false;
        this.pick();
        return true;
      case 'Escape':
        this.close(true);
        return true;
      default:
        return false;
    }
  }

  private schedule(): void {
    if (this.dismissedAt === this.active?.from) return;
    this.dismissedAt = null;
    window.clearTimeout(this.timer);
    this.timer = window.setTimeout(() => void this.fetch(), DEBOUNCE_MS);
  }

  private async fetch(): Promise<void> {
    const active = this.active;
    if (!active) return;
    this.abort?.abort();
    const ctrl = new AbortController();
    this.abort = ctrl;
    let failed = false;
    let items: SuggestItem[] = [];
    try {
      items = (await active.trigger.source(active.query, ctrl.signal)).slice(0, MAX_ITEMS);
    } catch (error) {
      if ((error as Error).name === 'AbortError') return;
      failed = true;
    }
    if (ctrl.signal.aborted || this.active !== active) return;
    this.items = items;
    this.index = 0;
    this.render(failed);
  }

  private render(failed: boolean): void {
    const active = this.active!;
    this.listbox.replaceChildren();
    this.listbox.setAttribute('aria-label', t(this.runtime, `suggest.label.${active.trigger.name}`));
    this.items.forEach((item, i) => {
      const li = document.createElement('li');
      li.id = `${this.id}-opt-${i}`;
      li.setAttribute('role', 'option');
      li.dataset.index = String(i);
      li.className = 'nowo-milkdown-suggest__option';
      if (item.emoji) {
        const glyph = document.createElement('span');
        glyph.className = 'nowo-milkdown-suggest__emoji';
        glyph.textContent = item.emoji;
        glyph.setAttribute('aria-hidden', 'true');
        li.append(glyph);
      }
      const svg = item.icon ? iconSvg(this.runtime, item.icon) : null;
      if (svg) li.append(svg);
      const label = document.createElement('span');
      label.className = 'nowo-milkdown-suggest__label';
      label.textContent = item.label;
      li.append(label);
      if (item.hint) {
        const hint = document.createElement('span');
        hint.className = 'nowo-milkdown-suggest__hint';
        hint.textContent = item.hint;
        li.append(hint);
      }
      this.listbox.append(li);
    });
    if (!this.items.length) {
      const li = document.createElement('li');
      li.className = 'nowo-milkdown-suggest__empty';
      li.setAttribute('role', 'presentation');
      li.textContent = t(this.runtime, failed ? 'suggest.failed' : 'suggest.empty');
      this.listbox.append(li);
    }
    this.listbox.hidden = false;
    const dom = this.view.dom;
    dom.setAttribute('aria-controls', this.id);
    dom.setAttribute('aria-autocomplete', 'list');
    this.live.textContent = failed ? t(this.runtime, 'suggest.failed') : t(this.runtime, 'suggest.count', { count: this.items.length });
    this.highlight();
    this.position();
  }

  private move(delta: number): void {
    if (!this.items.length) return;
    this.index = (this.index + delta + this.items.length) % this.items.length;
    this.highlight();
  }

  private highlight(): void {
    this.listbox.querySelectorAll('[role="option"]').forEach((el, i) => el.setAttribute('aria-selected', String(i === this.index)));
    if (this.items.length) this.view.dom.setAttribute('aria-activedescendant', `${this.id}-opt-${this.index}`);
    else this.view.dom.removeAttribute('aria-activedescendant');
    this.listbox.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: 'nearest' });
  }

  private position(): void {
    if (!this.active || this.listbox.hidden) return;
    const host = this.listbox.offsetParent as HTMLElement | null;
    const base = host?.getBoundingClientRect() ?? { left: -window.scrollX, top: -window.scrollY };
    const c = this.view.coordsAtPos(this.active.from);
    // CSSOM (element.style.x = …) is not an inline style attribute: allowed by a strict style-src-attr.
    this.listbox.style.left = `${Math.round(c.left - base.left)}px`;
    this.listbox.style.top = `${Math.round(c.bottom - base.top + 4)}px`;
  }

  private pick(): void {
    const active = this.active;
    const item = this.items[this.index];
    if (!active || !item) return;
    this.close();
    active.trigger.apply(this.view, { from: active.from, to: active.to }, item);
    this.view.focus();
  }

  private close(dismissed = false): void {
    if (dismissed && this.active) this.dismissedAt = this.active.from;
    window.clearTimeout(this.timer);
    this.abort?.abort();
    this.active = null;
    this.items = [];
    this.listbox.hidden = true;
    const dom = this.view.dom;
    dom.removeAttribute('aria-controls');
    dom.removeAttribute('aria-activedescendant');
    dom.removeAttribute('aria-autocomplete');
  }
}

/** Milkdown plugin; `triggers` is built per editor (options, schema and commands are known by then). */
export function suggestPlugin(triggers: (ctx: Ctx) => SuggestTrigger[]) {
  return $prose(
    (ctx) =>
      new Plugin({
        key: suggestKey,
        view: (view) => new SuggestView(view, triggers(ctx), ctx.get(runtimeCtx.key)),
      }),
  );
}
