/**
 * Block actions (`block_actions` feature, 1.3): a "⋮⋮" button beside the block under the pointer or the caret opens
 * the block menu — *Turn into*, *Color* (with the `colors` feature), *Duplicate*, *Move up* / *Move down*, *Delete*.
 *
 * Keyboard first (WCAG 2.1.1, 2.5.7): **Ctrl / ⌘ + /** opens the block menu at the caret, **Alt+Shift+↑ / ↓** move the
 * block, both announced in the widget's live region. The button is not in the tab order (Tab still leaves the editor,
 * WCAG 2.1.2); it is a real, named `<button>` for pointer and screen-reader users. With `block_drag` the button can
 * also be dragged to move the block (ProseMirror's own drag and drop, the drop cursor shows the target); dragging is
 * never the only way to move a block.
 */
import { $prose } from '@milkdown/kit/utils';
import { NodeSelection, Plugin, PluginKey, TextSelection, type EditorState, type Transaction } from '@milkdown/kit/prose/state';
import type { EditorView } from '@milkdown/kit/prose/view';
import { runtimeCtx, t, type Runtime } from '../runtime';
import { Menu, type MenuGroups, type MenuItem } from '../ui/menu';
import { TURN_INTO, deleteBlock, duplicateBlock, moveBlock, selectionRunner, turnInto } from '../commands/blocks';
import { colorItems } from '../commands/colors';
import { flushSelection } from './keyboard';

export const blockActionsKey = new PluginKey('nowo-milkdown-block-actions');
const views = new WeakMap<EditorView, BlockActionsView>();

type Command = (state: EditorState, dispatch?: (tr: Transaction) => void) => boolean;

/** Position of the top-level block that contains `pos`, or null. */
export function topLevelPos(state: EditorState, pos: number): number | null {
  if (state.doc.childCount === 0) return null;
  const $pos = state.doc.resolve(Math.min(Math.max(pos, 0), state.doc.content.size));
  if ($pos.depth >= 1) return $pos.before(1);
  const after = $pos.nodeAfter;
  return after ? $pos.pos : null;
}

export class BlockActionsView {
  readonly button: HTMLButtonElement;
  readonly menu: Menu;
  /** Top-level block the button points at. */
  private target: number | null = null;
  /** Element of that block, to find it again at dragstart (DB-I5 residual). */
  private targetDom: HTMLElement | null = null;
  /** A drag of the handle in progress, and the document it started on (DB-I5). */
  private dragDoc: unknown = null;
  /** True after the document changed during a drag: the drop is swallowed (no stale fragment is inserted). */
  dragCancelled = false;
  private readonly host: HTMLElement;
  private readonly onMove = (event: MouseEvent): void => {
    // The top-level block element under the pointer (DOM lookup: no coordinate mapping on every mouse move).
    let el = event.target instanceof Node ? (event.target as Node) : null;
    while (el && el.parentNode !== this.view.dom) el = el.parentNode;
    if (!el || this.view.state.doc.childCount === 0) return;
    try {
      this.show(topLevelPos(this.view.state, this.view.posAtDOM(el, 0)));
    } catch {
      // A node outside the document (a widget): keep the current target.
    }
  };
  private readonly onKey = (event: KeyboardEvent): void => this.handleKey(event);

  constructor(
    private readonly view: EditorView,
    private readonly runtime: Runtime,
    private readonly drag: boolean,
  ) {
    this.host = (view.dom.closest('.nowo-milkdown') as HTMLElement | null) ?? document.body;
    this.button = document.createElement('button');
    this.button.type = 'button';
    this.button.tabIndex = -1;
    this.button.className = 'nowo-milkdown-block-handle';
    this.button.setAttribute('aria-label', t(runtime, 'block.actions'));
    this.button.setAttribute('aria-haspopup', 'menu');
    this.button.setAttribute('aria-expanded', 'false');
    this.button.setAttribute('aria-keyshortcuts', 'Control+/');
    this.button.textContent = '⋮⋮';
    this.button.hidden = true;
    this.button.addEventListener('mousedown', (event) => event.preventDefault());
    this.button.addEventListener('click', () => this.openFromButton());
    if (drag) {
      this.button.draggable = true;
      this.button.addEventListener('dragstart', (event) => this.dragStart(event));
      this.button.addEventListener('dragend', () => {
        this.view.dragging = null;
        this.dragDoc = null;
        this.dragCancelled = false;
      });
    }
    this.host.append(this.button);
    this.host.classList.add('nowo-milkdown--blocks');
    this.menu = new Menu(this.host, t(runtime, 'block.actions'), (restore) => {
      this.button.setAttribute('aria-expanded', 'false');
      if (restore) view.focus();
    });
    this.menu.icons = runtime.menuIcons;
    view.dom.addEventListener('mousemove', this.onMove);
    view.dom.addEventListener('keydown', this.onKey, true);
  }

  update(view: EditorView, previous?: EditorState): void {
    // A menu built for an older document closes (CZ-I9.2, as the context menu).
    if (this.menu.isOpen && previous && view.state.doc !== previous.doc) this.menu.closeAll(false);
    // DB-I5: the document changed during a drag of the handle: cancel it (the dragged slice is stale).
    if (this.dragDoc !== null && view.state.doc !== this.dragDoc) {
      this.dragDoc = null;
      this.dragCancelled = true;
      view.dragging = null;
    }
    if (view.hasFocus()) this.show(topLevelPos(view.state, view.state.selection.from));
    else if (this.target !== null && this.target >= view.state.doc.content.size) this.show(null);
  }

  destroy(): void {
    this.view.dom.removeEventListener('mousemove', this.onMove);
    this.view.dom.removeEventListener('keydown', this.onKey, true);
    this.menu.destroy();
    this.button.remove();
    this.host.classList.remove('nowo-milkdown--blocks');
  }

  /** Places the button beside the block at `pos` (CSSOM only), or hides it. */
  show(pos: number | null): void {
    this.target = pos;
    const dom = pos === null ? null : (this.view.nodeDOM(pos) as HTMLElement | null);
    this.targetDom = dom instanceof HTMLElement ? dom : null;
    if (!dom || typeof dom.getBoundingClientRect !== 'function') {
      this.button.hidden = true;
      return;
    }
    const box = dom.getBoundingClientRect();
    const base = this.host.getBoundingClientRect();
    this.button.hidden = false;
    this.button.style.top = `${Math.round(box.top - base.top)}px`;
    this.button.style.left = `${Math.round(Math.max(box.left - base.left - 32, 0))}px`;
  }

  private handleKey(event: KeyboardEvent): void {
    if (event.defaultPrevented || (event.target as HTMLElement | null)?.closest?.('.cm-editor')) return;
    if ((event.ctrlKey || event.metaKey) && !event.altKey && !event.shiftKey && event.key === '/') {
      event.preventDefault();
      event.stopPropagation();
      flushSelection(this.view);
      const coords = this.view.coordsAtPos(this.view.state.selection.from);
      this.open(coords.left, coords.bottom);
      return;
    }
    if (event.altKey && event.shiftKey && !event.ctrlKey && !event.metaKey && (event.key === 'ArrowUp' || event.key === 'ArrowDown')) {
      event.preventDefault();
      event.stopPropagation();
      this.move(event.key === 'ArrowUp' ? -1 : 1);
    }
  }

  /** Moves the current block and says so in the live region. */
  move(direction: -1 | 1): boolean {
    const moved = moveBlock(direction)(this.view.state, this.view.dispatch);
    const key = moved ? (direction === -1 ? 'block.moved_up' : 'block.moved_down') : direction === -1 ? 'block.first' : 'block.last';
    this.announce(t(this.runtime, key));
    return moved;
  }

  private announce(text: string): void {
    const status = this.host.querySelector('.nowo-milkdown__status');
    if (status) status.textContent = text;
  }

  /** The caret goes into the block the button points at, then the menu opens under the button. */
  private openFromButton(): void {
    if (this.target !== null) {
      const $inside = this.view.state.doc.resolve(Math.min(this.target + 1, this.view.state.doc.content.size));
      this.view.dispatch(this.view.state.tr.setSelection(TextSelection.near($inside)));
    }
    const rect = this.button.getBoundingClientRect();
    this.open(rect.left, rect.bottom);
  }

  /** Items of the block menu for the block around the selection. */
  groups(): MenuGroups {
    const { view, runtime } = this;
    const state = view.state;
    const run: (command: Command) => void = selectionRunner(view);
    const turn: MenuItem[] = TURN_INTO.filter((kind) => turnInto(kind)(state)).map((kind) => ({
      id: `turn_${kind}`,
      label: t(runtime, `slash.${kind}`),
      run: () => run(turnInto(kind)),
    }));
    const first: MenuItem[] = [];
    if (turn.length) first.push({ id: 'turn_into', label: t(runtime, 'menu.turn_into'), items: turn });
    if (runtime.features.has('colors')) first.push({ id: 'color', label: t(runtime, 'menu.color'), items: colorItems(state, runtime, false, run) });
    return [
      first,
      [
        { id: 'duplicate', label: t(runtime, 'menu.duplicate'), run: () => run(duplicateBlock) },
        { id: 'move_up', label: t(runtime, 'menu.move_up'), shortcut: 'Alt+Shift+ArrowUp', disabled: !moveBlock(-1)(state), run: () => run(() => this.move(-1)) },
        { id: 'move_down', label: t(runtime, 'menu.move_down'), shortcut: 'Alt+Shift+ArrowDown', disabled: !moveBlock(1)(state), run: () => run(() => this.move(1)) },
      ],
      [{ id: 'delete', label: t(runtime, 'menu.delete'), run: () => run(deleteBlock) }],
    ];
  }

  open(x: number, y: number): void {
    this.button.setAttribute('aria-expanded', 'true');
    this.menu.open(this.groups(), x, y);
  }

  private dragStart(event: DragEvent): void {
    const { view } = this;
    // DB-I5 residual: the block is resolved again from its element (the document may have changed since the hover).
    let target: number | null = null;
    const dom = this.targetDom;
    if (dom?.isConnected && dom.parentNode === view.dom) {
      try {
        target = topLevelPos(view.state, view.posAtDOM(dom, 0));
      } catch {
        target = null;
      }
    }
    if (target === null) {
      event.preventDefault();
      return;
    }
    this.target = target;
    const selection = NodeSelection.create(view.state.doc, this.target);
    view.dispatch(view.state.tr.setSelection(selection));
    const slice = selection.content();
    view.dragging = { slice, move: true };
    this.dragDoc = view.state.doc;
    this.dragCancelled = false;
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', view.state.doc.textBetween(selection.from, selection.to, '\n'));
      const dom = view.nodeDOM(this.target);
      if (dom instanceof HTMLElement) event.dataTransfer.setDragImage(dom, 0, 0);
    }
  }
}

/** The `block_actions` plugin; `drag` adds pointer drag of the handle (`block_drag`). */
export function blockActionsPlugin(drag: boolean) {
  return $prose(
    (ctx) =>
      new Plugin({
        key: blockActionsKey,
        view: (view) => {
          const actions = new BlockActionsView(view, ctx.get(runtimeCtx.key), drag);
          views.set(view, actions);
          return actions;
        },
        props: {
          // DB-I5: a drop after the document changed during the drag is swallowed.
          handleDrop: (view) => {
            const actions = views.get(view);
            if (!actions?.dragCancelled) return false;
            actions.dragCancelled = false;
            return true;
          },
        },
      }),
  );
}
