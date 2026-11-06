/**
 * File cards of the dialect (1.8, ME-3): `::file[name]{href="…" size="…" type="…"}`, a leaf directive written for
 * uploads that are not images (`file_cards`). The editor and the PHP renderer (`FileCard.php`) derive the same badge,
 * category (from the link target first, see {@link fileKind}) and size text; both are tested against `tests/Fixtures/file-cards.json`.
 */
import { safeUrl } from '../link-titles';

/** Longest file name kept (characters). */
export const MAX_NAME = 200;

/**
 * A file name safe to show and to store in the Markdown: no control or invisible format characters, no square
 * brackets (the directive label), single spaces, at most {@link MAX_NAME} characters; `file` when nothing is left.
 */
export function fileName(value: string): string {
  const clean = value
    // U+FEFF is whitespace for JavaScript's \s but not for PHP's: dropped first so both sides agree.
    .replace(/\uFEFF/g, '')
    .replace(/\s+/g, ' ')
    // Controls and every invisible format character (bidi overrides and isolates, ALM, zero-width, word joiner, BOM:
    // Unicode category Cf; audit GR-I2).
    .replace(/[\p{Cc}\p{Cf}]/gu, '')
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

/** The category a MIME type names, or null for an unknown or empty type. */
export function typeCategory(type: string): FileCategory | null {
  const t = type.toLowerCase();
  if (t === '') return null;
  if (t === 'application/pdf') return 'pdf';
  // Specific families first: `text/csv` is a sheet, `text/rtf` a document.
  if (/zip|compressed|tar|gzip/.test(t)) return 'archive';
  if (/spreadsheet|excel|csv/.test(t)) return 'sheet';
  if (/presentation|powerpoint/.test(t)) return 'slides';
  if (/word|opendocument\.text|rtf/.test(t)) return 'doc';
  for (const prefix of ['image', 'audio', 'video', 'text'] as const) if (t.startsWith(`${prefix}/`)) return prefix;
  return null;
}

/** The extension of the last path segment of a URL (query and fragment ignored), or ''. */
export function hrefExtension(href: string): string {
  const path = href.split(/[?#]/, 1)[0] ?? '';
  return extensionOf(path.slice(path.lastIndexOf('/') + 1));
}

/**
 * Category and badge of a card (1.8, audit GR-I1). The **target** decides, not the label (any editor writes the
 * label): the extension of the link's file when it has one, else the MIME type, else the label's extension. The badge
 * is the deciding extension in capitals (at most 4 characters); a label extension that disagrees with the type, or no
 * extension at all, gives `FILE`. So `::file[invoice.pdf]{href="/u/setup.exe" type="application/pdf"}` shows `EXE`.
 */
export function fileKind(name: string, type = '', href = ''): { category: FileCategory; badge: string } {
  const badge = (ext: string): string => ext.slice(0, 4).toUpperCase();
  const fromHref = hrefExtension(href);
  if (fromHref) return { category: BY_EXTENSION[fromHref] ?? 'other', badge: badge(fromHref) };
  const label = extensionOf(name);
  const byType = typeCategory(type);
  if (byType) return { category: byType, badge: label && BY_EXTENSION[label] === byType ? badge(label) : 'FILE' };
  return { category: BY_EXTENSION[label] ?? 'other', badge: label ? badge(label) : 'FILE' };
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
  const kind = fileKind(name, attributes.type ?? '', href);
  const card = document.createElement('div');
  card.className = `nowo-milkdown-file nowo-milkdown-file--${kind.category}`;
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
  badge.textContent = kind.badge;
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
