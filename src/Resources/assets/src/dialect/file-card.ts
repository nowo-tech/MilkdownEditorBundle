/**
 * File cards of the dialect (1.8, ME-3): `::file[name]{href="…" size="…" type="…"}`, a leaf directive written for
 * uploads that are not images (`file_cards`). The editor and the PHP renderer (`FileCard.php`) derive the same badge,
 * category (from the link target first, see {@link fileKind}) and size text; both are tested against `tests/Fixtures/file-cards.json`.
 */
import { glyph } from '../ui/icons';
import { hostUrl, targetUrl, type HostSchemes } from '../host';

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

/** Views of a file (1.9, ME-6); `card` is the default and the fallback. */
export const FILE_VIEWS = ['link', 'icon', 'card', 'preview'] as const;
export type FileView = (typeof FILE_VIEWS)[number];
/** Preview heights (px): default, bounds and the S / M / L presets of the menus. */
export const PREVIEW_HEIGHT = { default: 480, min: 160, max: 1200, presets: { s: 320, m: 480, l: 720 } } as const;

/** The view of a card: `view=` when known, else `card` (the PHP `FileCard::view()`). */
export const fileView = (attributes: Record<string, string>): FileView =>
  (FILE_VIEWS as readonly string[]).includes(attributes.view ?? '') ? (attributes.view as FileView) : 'card';

/** A preview height: digits within the bounds, else the default (the PHP `FileCard::height()`). */
export function previewHeight(value: string | undefined): number {
  if (!/^\d{1,4}$/.test(value ?? '')) return PREVIEW_HEIGHT.default;
  const h = Number(value);
  return h >= PREVIEW_HEIGHT.min && h <= PREVIEW_HEIGHT.max ? h : PREVIEW_HEIGHT.default;
}

/** The glyph of the `icon` view: per category, `CSV` has its own (the PHP `FileCard::icon()`). */
const FILE_ICONS: Record<FileCategory | 'csv', string> = {
  pdf: 'file-type-pdf',
  image: 'photo',
  audio: 'music',
  video: 'movie',
  archive: 'file-zip',
  sheet: 'file-type-xls',
  csv: 'file-type-csv',
  doc: 'file-type-doc',
  slides: 'file-type-ppt',
  text: 'file-type-txt',
  code: 'file-code',
  other: 'file',
};
export const fileIcon = (kind: { category: FileCategory; badge: string }): string => FILE_ICONS[kind.badge === 'CSV' ? 'csv' : kind.category];

/** What a card needs from the editor: host references, the preview sandbox and translated labels. */
export type FileCardContext = {
  hostSchemes: HostSchemes;
  previewSandbox: string;
  label?: (key: 'open' | 'download') => string;
};

const DEFAULT_CONTEXT: FileCardContext = { hostSchemes: {}, previewSandbox: '' };

/**
 * A `::file` directive in its view, built with DOM APIs (no `innerHTML`; 1.9: `view="link|icon|card|preview"`). The
 * target is the host reference resolved through its `file` template or a safe URL; without one there is no link. A
 * preview needs the scheme's `preview` template (the host endpoint checks the viewer); without it the card is shown.
 * Links open in a new tab from the editor.
 *
 * @param label - The file name (the directive label)
 * @param attributes - `href`, `size`, `type`, `view`, `height`
 * @param context - Host references, preview sandbox, labels
 */
export function fileCard(label: string, attributes: Record<string, string>, context: FileCardContext = DEFAULT_CONTEXT): HTMLElement {
  const name = fileName(label);
  const href = targetUrl(attributes.href ?? '', 'file', context.hostSchemes);
  const kind = fileKind(name, attributes.type ?? '', href);
  const view = fileView(attributes);
  const anchor = (className: string): HTMLElement => {
    const el = document.createElement(href ? 'a' : 'span');
    el.className = className;
    if (el instanceof HTMLAnchorElement) {
      el.href = href;
      el.rel = 'noopener noreferrer';
      el.target = '_blank';
    }
    return el;
  };
  const nameSpan = (): HTMLSpanElement => {
    const title = document.createElement('span');
    title.className = 'nowo-milkdown-file__name';
    title.textContent = name;
    return title;
  };

  if (view === 'link' || view === 'icon') {
    const p = document.createElement('p');
    p.className = `nowo-milkdown-file nowo-milkdown-file--${view}-view nowo-milkdown-file--${kind.category}`;
    p.dataset.view = view;
    const a = anchor(view === 'link' ? 'nowo-milkdown-file__text' : 'nowo-milkdown-file__inline');
    if (view === 'icon') {
      const icon = glyph(fileIcon(kind), 'nowo-milkdown-file__icon');
      if (icon) a.append(icon);
      a.append(nameSpan());
    } else {
      a.textContent = name;
    }
    p.append(a);
    return p;
  }

  const inner = anchor('nowo-milkdown-file__link');
  const badge = document.createElement('span');
  badge.className = 'nowo-milkdown-file__badge';
  badge.setAttribute('aria-hidden', 'true');
  badge.textContent = kind.badge;
  inner.append(badge, nameSpan());
  const size = formatSize(attributes.size);
  if (size) {
    const meta = document.createElement('span');
    meta.className = 'nowo-milkdown-file__size';
    meta.textContent = size;
    inner.append(meta);
  }

  const preview = view === 'preview' && href ? hostUrl(attributes.href ?? '', 'preview', context.hostSchemes) : null;
  if (preview) {
    const figure = document.createElement('figure');
    figure.className = `nowo-milkdown-file nowo-milkdown-file--preview-view nowo-milkdown-file--${kind.category}`;
    figure.dataset.view = 'preview';
    const head = document.createElement('div');
    head.className = 'nowo-milkdown-file__head';
    const actions = document.createElement('span');
    actions.className = 'nowo-milkdown-file__actions';
    const open = document.createElement('a');
    open.className = 'nowo-milkdown-file__open';
    open.href = href;
    open.target = '_blank';
    open.rel = 'noopener noreferrer';
    open.textContent = context.label?.('open') ?? 'Open';
    const download = document.createElement('a');
    download.className = 'nowo-milkdown-file__download';
    download.href = href;
    download.rel = 'noopener noreferrer';
    download.setAttribute('download', '');
    download.textContent = context.label?.('download') ?? 'Download';
    actions.append(open, download);
    head.append(inner, actions);
    const frame = document.createElement('iframe');
    frame.className = 'nowo-milkdown-file__frame';
    frame.title = name;
    // The strictest sandbox plus the host's tokens (never allow-scripts with allow-same-origin: options.ts). Set before
    // the source, like every restriction of the frame.
    frame.setAttribute('sandbox', context.previewSandbox);
    frame.setAttribute('loading', 'lazy');
    frame.setAttribute('referrerpolicy', 'no-referrer');
    frame.height = String(previewHeight(attributes.height));
    frame.src = preview;
    figure.append(head, frame);
    return figure;
  }

  const card = document.createElement('div');
  card.className = `nowo-milkdown-file nowo-milkdown-file--${kind.category}`;
  if (view !== 'card') card.dataset.view = view;
  card.append(inner);
  return card;
}
