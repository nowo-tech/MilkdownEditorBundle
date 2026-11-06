/**
 * Decorative icons of the editor UI (1.7, `menu_icons` / `toolbar_icons`): an inline SVG built with DOM APIs from the
 * bundled {@link GLYPHS} (no `innerHTML`, no fetch, no inline style), hidden from assistive technology — the label next
 * to it stays the accessible name.
 */
import { GLYPHS } from './glyphs';

const NS = 'http://www.w3.org/2000/svg';

/**
 * Glyph of each menu / slash / action id. Menu ids with a `turn_` or `insert_` prefix use the glyph of the block they
 * name (`turn_h1` → `h1`).
 */
export const ITEM_GLYPHS: Readonly<Record<string, string>> = {
  // Clipboard, links, tables, blocks (context menu and block menu)
  cut: 'cut',
  copy: 'copy',
  paste: 'clipboard',
  paste_plain: 'clipboard-text',
  paste_markdown: 'markdown',
  copy_markdown: 'markdown',
  insert: 'plus',
  link_open: 'external-link',
  link_copy: 'link',
  link_remove: 'unlink',
  row_above: 'row-insert-top',
  row_below: 'row-insert-bottom',
  column_left: 'column-insert-left',
  column_right: 'column-insert-right',
  delete_row: 'row-remove',
  delete_column: 'column-remove',
  delete_table: 'table-off',
  turn_into: 'transform',
  color: 'palette',
  duplicate: 'copy-plus',
  move_up: 'arrow-up',
  move_down: 'arrow-down',
  delete: 'trash',
  comment: 'message-plus',
  // Blocks of the `/` menu (also *Turn into* and *Insert*)
  text: 'pilcrow',
  h1: 'h-1',
  h2: 'h-2',
  h3: 'h-3',
  bullet_list: 'list',
  ordered_list: 'list-numbers',
  task_list: 'list-check',
  quote: 'quote',
  code: 'code',
  table: 'table',
  divider: 'separator-horizontal',
  callout: 'bulb',
  details: 'caret-right',
  mermaid: 'chart-dots-3',
  math: 'math-function',
  page_link: 'file-text',
  mention: 'at',
  icon: 'icons',
  file: 'file-upload',
  file_link: 'link',
  file_icon: 'file',
  file_preview: 'photo',
  file_view: 'file',
  file_height: 'arrow-down',
  image_edit: 'photo',
  // Pickers and actions
  browse_icons: 'search',
  upload: 'file-upload',
  no_icon: 'ban',
};

/**
 * The glyph name of a menu, slash or action id, or undefined.
 *
 * @param id - Item id (`copy`, `turn_h1`, `insert_table`, `h2`…)
 */
export function glyphFor(id: string): string | undefined {
  return ITEM_GLYPHS[id] ?? ITEM_GLYPHS[id.replace(/^(turn|insert)_/, '')];
}

/**
 * A decorative `<svg class="nowo-milkdown-glyph">` of a bundled glyph, or null for an unknown name.
 *
 * @param name - Glyph name (a key of {@link GLYPHS})
 * @param className - Extra class (e.g. `nowo-milkdown-menu__icon`)
 */
export function glyph(name: string, className = ''): SVGSVGElement | null {
  const paths = Object.hasOwn(GLYPHS, name) ? GLYPHS[name] : undefined;
  if (!paths) return null;
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('class', className ? `nowo-milkdown-glyph ${className}` : 'nowo-milkdown-glyph');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  svg.dataset.glyph = name;
  for (const d of paths) {
    const path = document.createElementNS(NS, 'path');
    path.setAttribute('d', d);
    svg.append(path);
  }
  return svg;
}
