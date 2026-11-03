/**
 * Context menu (`context_menu` feature): right click, Shift+F10 or the ContextMenu key inside the editable open an
 * accessible menu with clipboard, *Turn into*, table, link and block actions, plus items registered by the host.
 *
 * Shift + right click, right clicks in CodeMirror code blocks or form fields and touch long-presses keep the browser
 * menu (spellcheck suggestions and the native selection handles live there). The host can add items with
 * `registerContextMenuItem()` or edit / cancel the menu through the cancellable `nowo-milkdown:contextmenu`
 * event dispatched on the widget root.
 */
import { $prose } from '@milkdown/kit/utils';
import { Plugin, PluginKey, TextSelection, type EditorState, type Transaction } from '@milkdown/kit/prose/state';
import type { EditorView } from '@milkdown/kit/prose/view';
import type { Mark, MarkType } from '@milkdown/kit/prose/model';
import { addColumnAfter, addColumnBefore, addRowAfter, addRowBefore, deleteColumn, deleteRow, deleteTable } from '@milkdown/kit/prose/tables';
import { runtimeCtx, t, type Runtime } from '../runtime';
import { Menu, type MenuGroups, type MenuItem } from '../ui/menu';
import { TURN_INTO, currentBlock, deleteBlock, duplicateBlock, insertPlainText, moveBlock, selectionRunner, turnInto } from '../commands/blocks';
import { tabContext } from './keyboard';
import { colorItems } from '../commands/colors';
import { safeUrl } from '../link-titles';
import { hostItems, type ContextMenuContext } from '../context-menu-registry';
import { copyMarkdown, markdownIo, pasteMarkdown, type MarkdownIo } from '../commands/markdown-clipboard';
import { prepareInsertPoint } from '../commands/insert';

export { registerContextMenuItem, type ContextMenuContext, type HostContextMenuItem } from '../context-menu-registry';

export const contextMenuKey = new PluginKey('nowo-milkdown-context-menu');

/** Detail of the `nowo-milkdown:contextmenu` event: groups may be edited; `preventDefault()` cancels the menu. */
export type ContextMenuEventDetail = { groups: MenuGroups; context: ContextMenuContext };

type Clipboard = Pick<globalThis.Clipboard, 'read' | 'readText' | 'writeText'>;
const clipboard = (): Partial<Clipboard> => (typeof navigator !== 'undefined' && navigator.clipboard ? navigator.clipboard : {});

/** The range of `type` marks around `pos` in its textblock (the whole link), or null. */
export function markRange(state: EditorState, pos: number, type: MarkType): { from: number; to: number; mark: Mark } | null {
  const $pos = state.doc.resolve(pos);
  const ranges: { from: number; to: number; mark: Mark }[] = [];
  let at = $pos.start();
  $pos.parent.forEach((child) => {
    const mark = type.isInSet(child.marks);
    const last = ranges[ranges.length - 1];
    if (mark && last && last.to === at && last.mark.eq(mark)) last.to = at + child.nodeSize;
    else if (mark) ranges.push({ from: at, to: at + child.nodeSize, mark });
    at += child.nodeSize;
  });
  return ranges.find((r) => r.from <= pos && pos <= r.to) ?? null;
}

export class ContextMenuView {
  readonly menu: Menu;
  private readonly onContextMenu = (event: MouseEvent): void => this.handleContextMenu(event);
  private readonly onKeyDown = (event: KeyboardEvent): void => {
    const isMenuKey = event.key === 'ContextMenu' || (event.key === 'F10' && event.shiftKey && !event.ctrlKey && !event.metaKey && !event.altKey);
    if (!isMenuKey || event.defaultPrevented) return;
    if ((event.target as HTMLElement | null)?.closest?.('.cm-editor')) return;
    event.preventDefault();
    const coords = this.view.coordsAtPos(this.view.state.selection.head);
    this.open(coords.left, coords.bottom);
  };

  constructor(
    private readonly view: EditorView,
    private readonly runtime: Runtime,
    /** 1.5 `markdown_clipboard`: the parser / serializer behind *Paste* / *Copy as Markdown* (null: no such items). */
    private readonly io: MarkdownIo | null = null,
  ) {
    const host = (view.dom.closest('.nowo-milkdown') as HTMLElement | null) ?? document.body;
    this.menu = new Menu(host, t(runtime, 'menu.label'), (restore) => {
      if (restore) view.focus();
    });
    view.dom.addEventListener('contextmenu', this.onContextMenu);
    view.dom.addEventListener('keydown', this.onKeyDown);
  }

  /** A menu built for an older document closes (its items point at positions that no longer exist, CZ-I9.2). */
  update(view: EditorView, previous: EditorState): void {
    if (this.menu.isOpen && view.state.doc !== previous.doc) this.menu.closeAll(false);
  }

  destroy(): void {
    this.view.dom.removeEventListener('contextmenu', this.onContextMenu);
    this.view.dom.removeEventListener('keydown', this.onKeyDown);
    this.menu.destroy();
  }

  private handleContextMenu(event: MouseEvent): void {
    if (event.shiftKey || event.defaultPrevented) return;
    if ((event as PointerEvent).pointerType === 'touch') return;
    const target = event.target as HTMLElement | null;
    if (target?.closest?.('.cm-editor, input, textarea, select')) return;
    const { view } = this;
    const at = view.posAtCoords({ left: event.clientX, top: event.clientY });
    const { from, to } = view.state.selection;
    // Like the native menu: a click outside the selection moves the caret there first.
    if (at && (at.pos < from || at.pos > to)) {
      view.dispatch(view.state.tr.setSelection(TextSelection.near(view.state.doc.resolve(at.pos))));
    }
    event.preventDefault();
    this.open(event.clientX, event.clientY);
  }

  context(): ContextMenuContext {
    const { view } = this;
    const { from, to, empty } = view.state.selection;
    return {
      root: (view.dom.closest('.nowo-milkdown') as HTMLElement | null) ?? view.dom,
      selection: { from, to, empty },
      text: view.state.doc.textBetween(from, to, '\n'),
      blockType: currentBlock(view.state)?.node.type.name ?? 'doc',
      readonly: !view.editable,
      insertText: (text: string) => {
        if (view.editable) view.dispatch(view.state.tr.insertText(text).scrollIntoView());
      },
    };
  }

  /** Builds the item groups for the current selection. */
  groups(): MenuGroups {
    const { view, runtime } = this;
    const state = view.state;
    const editable = view.editable;
    const runner = selectionRunner(view);
    const command = (fn: (s: EditorState, d?: (tr: Transaction) => void) => boolean) => () => runner(fn);
    const item = (id: string, run: () => void, extra: Partial<MenuItem> = {}): MenuItem => ({ id, label: t(runtime, `menu.${id}`), run, ...extra });
    const cb = clipboard();
    const empty = state.selection.empty;

    const clip: MenuItem[] = [];
    if (editable) clip.push(item('cut', () => this.exec('cut'), { shortcut: 'Control+X', disabled: empty }));
    clip.push(item('copy', () => this.exec('copy'), { shortcut: 'Control+C', disabled: empty }));
    if (editable) {
      clip.push(item('paste', () => void this.paste(), { shortcut: 'Control+V', disabled: !cb.read, hint: t(runtime, 'menu.paste_hint') }));
      clip.push(item('paste_plain', () => void this.pastePlain(), { shortcut: 'Control+Shift+V', disabled: !cb.readText, hint: t(runtime, 'menu.paste_hint') }));
    }
    const io = this.io;
    if (io) {
      if (editable) clip.push(item('paste_markdown', () => void pasteMarkdown(view, io, cb), { shortcut: 'Control+Alt+V', disabled: !cb.readText, hint: t(runtime, 'menu.paste_hint') }));
      clip.push(
        item('copy_markdown', () => void copyMarkdown(state, io, cb).then((ok) => this.announce(ok ? 'clipboard.copied_markdown' : 'clipboard.copy_failed')), {
          shortcut: 'Control+Alt+Shift+C',
          disabled: empty || !cb.writeText,
        }),
      );
    }

    const groups: MenuGroups = [clip];
    // 1.5 `insert_menu`: file, icon and the `/` blocks, each at a new block after the current one.
    if (editable && runtime.insert.length) {
      groups.push([
        {
          id: 'insert',
          label: t(runtime, 'menu.insert'),
          items: runtime.insert.map((entry) => ({
            id: `insert_${entry.id}`,
            label: entry.label,
            run: () =>
              runner(() => {
                prepareInsertPoint(view);
                entry.run(view);
                return true;
              }),
          })),
        },
      ]);
    }
    if (editable) {
      const link = state.schema.marks.link ? markRange(state, state.selection.head, state.schema.marks.link) : null;
      if (link) {
        const href = safeUrl(String(link.mark.attrs.href ?? ''));
        groups.push([
          item('link_open', () => window.open(href, '_blank', 'noopener,noreferrer'), { disabled: href === '' }),
          item('link_copy', () => void cb.writeText?.(href), { disabled: href === '' || !cb.writeText }),
          // On the state the runner restores, never on positions computed when the menu opened (CZ-I9.1).
          item(
            'link_remove',
            command((s, d) => {
              const type = s.schema.marks.link!;
              const range = markRange(s, s.selection.head, type);
              if (!range) return false;
              d?.(s.tr.removeMark(range.from, range.to, type));
              return true;
            }),
          ),
        ]);
      }
      if (tabContext(state) === 'table') {
        groups.push([
          item('row_above', command(addRowBefore)),
          item('row_below', command(addRowAfter)),
          item('column_left', command(addColumnBefore)),
          item('column_right', command(addColumnAfter)),
          item('delete_row', command(deleteRow)),
          item('delete_column', command(deleteColumn)),
          item('delete_table', command(deleteTable)),
        ]);
      }
      const turn: MenuItem[] = TURN_INTO.filter((kind) => turnInto(kind)(state)).map((kind) => ({
        id: `turn_${kind}`,
        label: t(runtime, `slash.${kind}`),
        run: command(turnInto(kind)),
      }));
      const block: MenuItem[] = [];
      if (turn.length) block.push({ id: 'turn_into', label: t(runtime, 'menu.turn_into'), items: turn });
      // 1.4 `colors`: the selected text when there is a selection, otherwise the block.
      if (runtime.features.has('colors')) {
        block.push({ id: 'color', label: t(runtime, 'menu.color'), items: colorItems(state, runtime, !empty, (cmd) => command(cmd)()) });
      }
      block.push(
        item('duplicate', command(duplicateBlock)),
        item('move_up', command(moveBlock(-1)), { disabled: !moveBlock(-1)(state) }),
        item('move_down', command(moveBlock(1)), { disabled: !moveBlock(1)(state) }),
        item('delete', command(deleteBlock)),
      );
      groups.push(block);
    }

    const context = this.context();
    const host = [...hostItems.values()]
      .filter((h) => !h.when || h.when(context))
      .map((h): MenuItem => ({ id: `host:${h.id}`, label: h.label, shortcut: h.shortcut, run: () => h.run(this.context()) }));
    groups.push(host);
    return groups;
  }

  /**
   * Opens the menu at viewport coordinates (after the host had its say through the DOM event).
   *
   * @returns False when the host cancelled the menu
   */
  open(x: number, y: number): boolean {
    const detail: ContextMenuEventDetail = { groups: this.groups(), context: this.context() };
    const event = new CustomEvent<ContextMenuEventDetail>('nowo-milkdown:contextmenu', { bubbles: true, cancelable: true, detail });
    if (!detail.context.root.dispatchEvent(event)) return false;
    this.menu.open(detail.groups, x, y);
    return true;
  }

  /** Cut / copy through the browser (ProseMirror serialises the selection as Markdown and HTML). */
  exec(command: 'cut' | 'copy'): void {
    const { view } = this;
    view.focus();
    let done: boolean;
    try {
      done = document.execCommand(command);
    } catch {
      done = false;
    }
    if (done) return;
    const { from, to } = view.state.selection;
    const text = view.state.doc.textBetween(from, to, '\n');
    void clipboard().writeText?.(text);
    if (command === 'cut' && view.editable) view.dispatch(view.state.tr.deleteSelection().scrollIntoView());
  }

  /** Says a message in the widget's live region. */
  private announce(key: string): void {
    const status = this.view.dom.closest('.nowo-milkdown')?.querySelector('.nowo-milkdown__status');
    if (status) status.textContent = t(this.runtime, key);
  }

  async paste(): Promise<void> {
    const { view } = this;
    const items = (await clipboard().read?.()) ?? [];
    for (const entry of items) {
      if (entry.types.includes('text/html')) {
        view.pasteHTML(await (await entry.getType('text/html')).text());
        view.focus();
        return;
      }
      if (entry.types.includes('text/plain')) {
        view.pasteText(await (await entry.getType('text/plain')).text());
        view.focus();
        return;
      }
    }
  }

  async pastePlain(): Promise<void> {
    const { view } = this;
    const text = (await clipboard().readText?.()) ?? '';
    if (text !== '') insertPlainText(text, view.state.schema)(view.state, view.dispatch);
    view.focus();
  }
}

export const contextMenuPlugin = $prose(
  (ctx) =>
    new Plugin({
      key: contextMenuKey,
      view: (view) => {
        const runtime = ctx.get(runtimeCtx.key);
        return new ContextMenuView(view, runtime, runtime.features.has('markdown_clipboard') ? markdownIo(ctx) : null);
      },
    }),
);
