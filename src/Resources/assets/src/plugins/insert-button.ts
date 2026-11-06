/**
 * Insert button (1.9, `insert_button`, Notion's "+"): beside the empty paragraph that holds the caret, a "+" button
 * types `/` there, which opens the `/` menu (needs `slash_menu`). It is a pointer shortcut: keyboard users type `/`
 * (the same list), so the button stays out of the tab order (Tab still leaves the editor, WCAG 2.1.2); it is a real,
 * named `<button>`. Positioned with CSSOM inside the widget.
 */
import { $prose } from '@milkdown/kit/utils';
import { Plugin, PluginKey, TextSelection } from '@milkdown/kit/prose/state';
import type { EditorView } from '@milkdown/kit/prose/view';
import { runtimeCtx, t, type Runtime } from '../runtime';

export const insertButtonKey = new PluginKey('nowo-milkdown-insert-button');

/** Position of the empty top-level paragraph around the caret, or null. */
export function emptyLine(view: EditorView): number | null {
  const { selection } = view.state;
  if (!selection.empty || !(selection instanceof TextSelection)) return null;
  const $from = selection.$from;
  if ($from.depth !== 1 || $from.parent.type.name !== 'paragraph' || $from.parent.content.size !== 0) return null;
  return $from.before(1);
}

export class InsertButtonView {
  readonly button: HTMLButtonElement;
  private readonly host: HTMLElement;
  private target: number | null = null;

  constructor(
    private readonly view: EditorView,
    runtime: Runtime,
  ) {
    this.host = (view.dom.closest('.nowo-milkdown') as HTMLElement | null) ?? document.body;
    this.button = document.createElement('button');
    this.button.type = 'button';
    this.button.tabIndex = -1;
    this.button.className = 'nowo-milkdown-insert-button';
    this.button.setAttribute('aria-label', t(runtime, 'insert.button'));
    this.button.textContent = '+';
    this.button.hidden = true;
    this.button.addEventListener('mousedown', (event) => event.preventDefault());
    this.button.addEventListener('click', () => this.insert());
    this.host.append(this.button);
    // The button follows the caret only while the editor has the focus (no state change tells that).
    view.dom.addEventListener('focus', this.refresh);
    view.dom.addEventListener('blur', this.refresh);
    this.update(view);
  }

  update(view: EditorView): void {
    this.target = view.editable && view.hasFocus() ? emptyLine(view) : null;
    const dom = this.target === null ? null : (view.nodeDOM(this.target) as HTMLElement | null);
    if (!dom || typeof dom.getBoundingClientRect !== 'function') {
      this.button.hidden = true;
      return;
    }
    const box = dom.getBoundingClientRect();
    const base = this.host.getBoundingClientRect();
    this.button.hidden = false;
    this.button.style.top = `${Math.round(box.top - base.top)}px`;
    // Left of the block handle (at -32) when there is room; on top of it when there is not.
    this.button.style.left = `${Math.round(Math.max(box.left - base.left - 60, 0))}px`;
  }

  /** Types `/` in the empty line: the `/` menu opens there. */
  insert(): void {
    const { view } = this;
    if (this.target === null || !view.editable) return;
    view.focus();
    const pos = this.target + 1;
    view.dispatch(view.state.tr.setSelection(TextSelection.create(view.state.doc, pos)).insertText('/', pos).scrollIntoView());
  }

  private readonly refresh = (): void => this.update(this.view);

  destroy(): void {
    this.view.dom.removeEventListener('focus', this.refresh);
    this.view.dom.removeEventListener('blur', this.refresh);
    this.button.remove();
  }
}

export const insertButtonPlugin = $prose(
  (ctx) =>
    new Plugin({
      key: insertButtonKey,
      view: (view) => new InsertButtonView(view, ctx.get(runtimeCtx.key)),
    }),
);
