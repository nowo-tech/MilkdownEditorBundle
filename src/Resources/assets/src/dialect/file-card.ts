/**
 * File cards of the dialect (1.8, ME-3): `::file[name]{href="…" size="…" type="…"}`, a leaf directive written for
 * uploads that are not images (`file_cards`). The editor and the PHP renderer (`FileCard.php`) derive the same badge,
 * category and size text; both are tested against `tests/Fixtures/file-cards.json`.
 */
import { safeUrl } from '../link-titles';

/** Longest file name kept (characters). */
export const MAX_NAME = 200;

/**
 * A file name safe to show and to store in the Markdown: no control, bidi-override or isolate characters, no square
 * brackets (the directive label), single spaces, at most {@link MAX_NAME} characters; `file` when nothing is left.
 */
export function fileName(value: string): string {
  const clean = value
    .replace(/\s+/g, ' ')
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u001f\u007f-\u009f\u200e\u200f\u202a-\u202e\u2066-\u2069]/g, '')
    .replace(/\[/g, '(')
    .replace(/\]/g, ')')
    .trim();
  return Array.from(clean).slice(0, MAX_NAME).join('').trim() || 'file';
}

/** Categories (a CSS class each: `--pdf`, `--sheet`, …). */
export const FILE_CATEGORIES = ['pdf', 'image', 'audio', 'video', 'archive', 'sheet', 'doc', 'slides', 'text', 'code', 'other'] as const;
export type FileCategory = (typeof FILE_CATEGORIES)[number];

const BY_EXTENSION: Record<string, FileCategory> = {
  pdf: 'pdf',
  png: 'image', jpg: 'image', jpeg: 'image', gif: 'image', webp: 'image', avif: 'image', svg: 'image', bmp: 'image', heic: 'image',
  mp3: 'audio', wav: 'audio', ogg: 'audio', m4a: 'audio', flac: 'audio',
  mp4: 'video', mov: 'video', webm: 'video', mkv: 'video', avi: 'video',
  zip: 'archive', rar: 'archive', '7z': 'archive', tar: 'archive', gz: 'archive', tgz: 'archive', bz2: 'archive',
  csv: 'sheet', tsv: 'sheet', xls: 'sheet', xlsx: 'sheet', ods: 'sheet', numbers: 'sheet',
  doc: 'doc', docx: 'doc', odt: 'doc', rtf: 'doc', pages: 'doc',
  ppt: 'slides', pptx: 'slides', odp: 'slides', key: 'slides',
  txt: 'text', md: 'text', log: 'text',
  json: 'code', xml: 'code', yaml: 'code', yml: 'code', html: 'code', css: 'code', js: 'code', ts: 'code', php: 'code', sql: 'code',
};

/** The lower-case extension of a file name (letters and digits, at most 8), or ''. */
export function extensionOf(name: string): string {
  const m = /\.([a-z0-9]{1,8})$/i.exec(name.trim());
  return m ? m[1]!.toLowerCase() : '';
}

/** Category from the extension, else from the MIME type. */
export function fileCategory(name: string, type = ''): FileCategory {
  const byExt = BY_EXTENSION[extensionOf(name)];
  if (byExt) return byExt;
  const t = type.toLowerCase();
  if (t === 'application/pdf') return 'pdf';
  for (const prefix of ['image', 'audio', 'video', 'text'] as const) if (t.startsWith(`${prefix}/`)) return prefix;
  if (/zip|compressed|tar|gzip/.test(t)) return 'archive';
  if (/spreadsheet|excel|csv/.test(t)) return 'sheet';
  if (/presentation|powerpoint/.test(t)) return 'slides';
  if (/word|opendocument\.text|rtf/.test(t)) return 'doc';
  return 'other';
}

/** The badge text: the extension in capitals (at most 4 characters), else `FILE`. */
export function fileBadge(name: string): string {
  const ext = extensionOf(name);
  return ext ? ext.slice(0, 4).toUpperCase() : 'FILE';
}

/** A byte count as `512 B`, `1.5 KB`, `12 MB`, `3.4 GB` (1024 steps; one decimal under 10). '' for no size. */
export function formatSize(value: string | number | undefined): string {
  const text = String(value ?? '');
  if (!/^\d{1,15}$/.test(text)) return '';
  let size = Number(text);
  if (size < 1024) return `${size} B`;
  const units = ['KB', 'MB', 'GB', 'TB'];
  let unit = -1;
  while (size >= 1024 && unit < units.length - 1) {
    size /= 1024;
    unit++;
  }
  const rounded = size < 10 ? Math.round(size * 10) / 10 : Math.round(size);
  return `${rounded} ${units[unit]}`;
}

/**
 * The card of a `::file` directive, built with DOM APIs (no `innerHTML`): a link (when `href` is a safe URL) with a
 * decorative badge, the name and the size. In the editor the link opens in a new tab.
 *
 * @param label - The file name (the directive label)
 * @param attributes - `href`, `size`, `type`
 */
export function fileCard(label: string, attributes: Record<string, string>): HTMLElement {
  const name = fileName(label);
  const href = safeUrl(attributes.href ?? '');
  const card = document.createElement('div');
  card.className = `nowo-milkdown-file nowo-milkdown-file--${fileCategory(name, attributes.type ?? '')}`;
  const inner = document.createElement(href ? 'a' : 'span');
  inner.className = 'nowo-milkdown-file__link';
  if (inner instanceof HTMLAnchorElement) {
    inner.href = href;
    inner.rel = 'noopener noreferrer';
    inner.target = '_blank';
  }
  const badge = document.createElement('span');
  badge.className = 'nowo-milkdown-file__badge';
  badge.setAttribute('aria-hidden', 'true');
  badge.textContent = fileBadge(name);
  const title = document.createElement('span');
  title.className = 'nowo-milkdown-file__name';
  title.textContent = name;
  inner.append(badge, title);
  const size = formatSize(attributes.size);
  if (size) {
    const meta = document.createElement('span');
    meta.className = 'nowo-milkdown-file__size';
    meta.textContent = size;
    inner.append(meta);
  }
  card.append(inner);
  return card;
}
