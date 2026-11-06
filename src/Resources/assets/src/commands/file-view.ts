/**
 * File views (1.9, ME-6): *View* (link, icon link, card, preview) and *Preview height* (S / M / L) of the file under
 * the selection, for the block menu and the context menu (radio items, keyboard like every menu). The choice is stored
 * in the dialect: `::file[name]{… view="preview" height="480"}`.
 */
import { NodeSelection, type EditorState, type Transaction } from '@milkdown/kit/prose/state';
import type { Node as PmNode } from '@milkdown/kit/prose/model';
import { decodeAttributes, encodeAttributes } from '../dialect/directives';
import { FILE_VIEWS, PREVIEW_HEIGHT, fileView, previewHeight, type FileView } from '../dialect/file-card';
import { t, type Runtime } from '../runtime';
import type { MenuItem } from '../ui/menu';

type Command = (state: EditorState, dispatch?: (tr: Transaction) => void) => boolean;

/** The file card the actions apply to: a selected one, or the top-level block around the caret. */
export function fileAt(state: EditorState): { pos: number; node: PmNode } | null {
  const { selection } = state;
  const isFile = (node: PmNode | null | undefined): node is PmNode => node?.type.name === 'leafDirective' && node.attrs.name === 'file';
  if (selection instanceof NodeSelection && isFile(selection.node)) return { pos: selection.from, node: selection.node };
  const $from = selection.$from;
  if ($from.depth >= 1 && isFile($from.node(1))) return { pos: $from.before(1), node: $from.node(1) };
  return null;
}

/** Sets attributes of the file card (`null` removes one). */
export function setFileAttributes(changes: Record<string, string | null>): Command {
  return (state, dispatch) => {
    const file = fileAt(state);
    if (!file) return false;
    const attributes = decodeAttributes(file.node.attrs.attributes);
    for (const [key, value] of Object.entries(changes)) {
      if (value === null) delete attributes[key];
      else attributes[key] = value;
    }
    dispatch?.(state.tr.setNodeMarkup(file.pos, undefined, { ...file.node.attrs, attributes: encodeAttributes(attributes) }));
    return true;
  };
}

/** The view command: `card` is the default and removes the attribute (Markdown stays as in 1.8). */
export const setFileView = (view: FileView): Command =>
  setFileAttributes(view === 'card' ? { view: null, height: null } : { view, ...(view === 'preview' ? {} : { height: null }) });

/**
 * The *View* submenu (and *Preview height* for a preview) of the file under the selection, or none.
 *
 * @param state - The editor state
 * @param runtime - Labels
 * @param run - Runs a command on the selection
 */
export function fileViewItems(state: EditorState, runtime: Runtime, run: (command: Command) => void): MenuItem[] {
  const file = fileAt(state);
  if (!file) return [];
  const attributes = decodeAttributes(file.node.attrs.attributes);
  const current = fileView(attributes);
  const items: MenuItem[] = [
    {
      id: 'file_view',
      label: t(runtime, 'menu.file_view'),
      items: FILE_VIEWS.map((view) => ({ id: `file_view_${view}`, label: t(runtime, `file.view.${view}`), checked: view === current, run: () => run(setFileView(view)) })),
    },
  ];
  if (current === 'preview') {
    const height = previewHeight(attributes.height);
    items.push({
      id: 'file_height',
      label: t(runtime, 'menu.file_height'),
      items: (Object.entries(PREVIEW_HEIGHT.presets) as [string, number][]).map(([size, px]) => ({
        id: `file_height_${size}`,
        label: t(runtime, `file.height.${size}`),
        checked: height === px,
        run: () => run(setFileAttributes({ height: String(px) })),
      })),
    });
  }
  return items;
}
