/**
 * Upload hook (FR-045): dropped, pasted or picked files are POSTed (multipart field `file`) to the host's
 * upload URL with the CSRF token in the `X-CSRF-Token` header.
 *
 * Answer (1.8, ME-3): `{url, name?, size?, type?, kind?: 'image' | 'file', alt?}`; the older answers `{url}` and
 * `{url, name?, image?, alt?}` keep working. The **host decides the kind** (it sniffed the bytes): `kind`, else the
 * legacy `image` flag; only an answer without either falls back to the browser's guess (the file type, and the
 * per-kind accept lists). An image becomes `![alt](url)`; any other file a file card (`::file[name]{href size type}`,
 * `file_cards`) or a link `[name](url)`. Every URL goes through `safeUrl()` (relative or http(s) only); names lose
 * control and bidi-override characters (no right-to-left override hiding an `.exe` extension) and brackets, and are capped.
 * Progress and errors go to a live region.
 */
import type { Node as PmNode, Schema } from '@milkdown/kit/prose/model';
import { encodeAttributes } from './dialect/directives';
import { MAX_NAME, fileName } from './dialect/file-card';
import { safeUrl } from './link-titles';
import type { UploadOptions } from './types';

export type { UploadOptions };
export { MAX_NAME, fileName };
export type UploadKind = 'image' | 'file';
export type UploadResult = { url: string; name: string; size: number; type: string; kind: UploadKind; alt: string };
export type Announce = (key: string, params: Record<string, string | number>, error?: boolean) => void;

/** A MIME type as the host may report it. */
const MIME = /^[a-z0-9][a-z0-9!#$&^_.+-]{0,63}\/[a-z0-9][a-z0-9!#$&^_.+-]{0,126}$/i;

export class UploadError extends Error {
  constructor(readonly key: string) {
    super(key);
  }
}

/** Whether a file matches one of the `accept` rules (`image/*`, `application/pdf`, `.md`). */
export function matchesAccept(file: File, rules: readonly string[]): boolean {
  const name = file.name.toLowerCase();
  return rules.some((rule) => {
    const r = rule.toLowerCase();
    if (r.startsWith('.')) return name.endsWith(r);
    if (r.endsWith('/*')) return file.type.startsWith(r.slice(0, -1));
    return file.type === r;
  });
}

/** Checks size and type before any request (`accept` entries: `image/*`, `application/pdf`, `.md`). */
export function checkFile(file: File, options: UploadOptions): void {
  if (options.maxSize > 0 && file.size > options.maxSize) throw new UploadError('upload.too_large');
  if (options.accept.length === 0) return;
  if (!matchesAccept(file, options.accept)) throw new UploadError('upload.type');
}

/**
 * A link target for a file card: `safeUrl()` (relative or http(s)), with the characters that would end a quoted
 * directive attribute or an HTML attribute percent-encoded. '' when the URL is not allowed.
 */
export function fileHref(url: string): string {
  return safeUrl(url).replace(/["'<>`{}\s\\]/g, (c) => (c === "'" ? '%27' : encodeURIComponent(c)));
}

/** The kind of a stored file: the host's answer first, the browser's guess only when the host said nothing. */
function kindOf(body: Record<string, unknown>, file: File, options: UploadOptions): UploadKind {
  if (body.kind === 'image' || body.kind === 'file') return body.kind;
  if (body.image === true) return 'image';
  if (body.image === false) return 'file';
  if (options.acceptImages?.length && !matchesAccept(file, options.acceptImages)) return 'file';
  return file.type.startsWith('image/') ? 'image' : 'file';
}

/**
 * Validates an upload answer.
 *
 * @param body - The parsed JSON (anything)
 * @param file - The file that was sent
 * @param options - Upload options (the per-kind lists)
 * @returns The result, or null when the answer has no usable URL
 */
export function parseResult(body: unknown, file: File, options: UploadOptions): UploadResult | null {
  const b = body && typeof body === 'object' && !Array.isArray(body) ? (body as Record<string, unknown>) : {};
  const url = safeUrl(b.url);
  if (!url) return null;
  const name = fileName(typeof b.name === 'string' && b.name.trim() !== '' ? b.name : file.name);
  const size = typeof b.size === 'number' && Number.isSafeInteger(b.size) && b.size >= 0 ? b.size : file.size;
  const type = typeof b.type === 'string' && MIME.test(b.type) ? b.type.toLowerCase() : MIME.test(file.type) ? file.type.toLowerCase() : '';
  return {
    url,
    name,
    size,
    type,
    kind: kindOf(b, file, options),
    alt: typeof b.alt === 'string' ? (b.alt.trim() === '' ? '' : fileName(b.alt)) : name.replace(/\.[^.]+$/, ''),
  };
}

/**
 * POSTs one file with progress; resolves with the validated answer.
 *
 * @param file - The file to send
 * @param options - Upload URL, CSRF token and limits
 * @param onProgress - Called with the percentage sent
 * @param xhrFactory - Creates the request (tests)
 * @returns The URL, name, size, type and kind of the stored file
 */
export function sendFile(file: File, options: UploadOptions, onProgress: (percent: number) => void, xhrFactory: () => XMLHttpRequest = () => new XMLHttpRequest()): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    const xhr = xhrFactory();
    xhr.open('POST', options.url);
    xhr.withCredentials = true;
    xhr.setRequestHeader('Accept', 'application/json');
    if (options.csrfToken) xhr.setRequestHeader('X-CSRF-Token', options.csrfToken);
    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable && event.total > 0) onProgress(Math.round((event.loaded / event.total) * 100));
    });
    xhr.addEventListener('error', () => reject(new UploadError('upload.failed')));
    xhr.addEventListener('load', () => {
      if (xhr.status < 200 || xhr.status >= 300) {
        reject(new UploadError(xhr.status === 413 ? 'upload.too_large' : xhr.status === 415 ? 'upload.type' : 'upload.failed'));
        return;
      }
      let body: unknown;
      try {
        body = JSON.parse(xhr.responseText);
      } catch {
        body = {};
      }
      const result = parseResult(body, file, options);
      if (result) resolve(result);
      else reject(new UploadError('upload.failed'));
    });
    const form = new FormData();
    form.append('file', file, file.name);
    xhr.send(form);
  });
}

/**
 * Turns an answer into the node to insert: an inline image, a file card (`cards`, 1.8) or a linked file name.
 *
 * @param schema - The editor schema
 * @param result - The validated answer
 * @param cards - Whether non-image files become `::file` cards (`file_cards`)
 */
export function resultNode(schema: Schema, result: UploadResult, cards = false): PmNode | null {
  if (result.kind === 'image' && schema.nodes.image) return schema.nodes.image.create({ src: result.url, alt: result.alt, title: '' });
  const href = fileHref(result.url);
  if (cards && href && schema.nodes.leafDirective) {
    const attributes: Record<string, string> = { href, size: String(result.size) };
    if (result.type) attributes.type = result.type;
    return schema.nodes.leafDirective.create({ name: 'file', label: result.name, attributes: encodeAttributes(attributes) });
  }
  const link = schema.marks.link;
  return link ? schema.text(result.name, [link.create({ href: result.url, title: null })]) : schema.text(result.name);
}

/**
 * Uploads one file and reports progress; resolves with the node to insert (null after an announced error).
 *
 * @param file - The file
 * @param options - Upload options
 * @param announce - Live-region messages
 * @param schema - The editor schema
 * @param cards - `file_cards`
 * @param send - The transport (tests)
 * @param onProgress - Also called with the percentage (the drop placeholder)
 */
export async function uploadOne(
  file: File,
  options: UploadOptions,
  announce: Announce,
  schema: Schema,
  cards: boolean,
  send: typeof sendFile = sendFile,
  onProgress: (percent: number) => void = () => undefined,
): Promise<{ node: PmNode | null; error: string | null }> {
  try {
    checkFile(file, options);
    announce('upload.uploading', { name: file.name, percent: 0 });
    onProgress(0);
    const result = await send(file, options, (percent) => {
      announce('upload.uploading', { name: file.name, percent });
      onProgress(percent);
    });
    const node = resultNode(schema, result, cards);
    announce('upload.done', { name: file.name });
    return { node, error: null };
  } catch (error) {
    const key = error instanceof UploadError ? error.key : 'upload.failed';
    announce(key, { name: file.name }, true);
    return { node: null, error: key };
  }
}

/** The uploader of the *Insert file* button, `/file` and the context menu (one file after the other). */
export function createUploader(options: UploadOptions, announce: Announce, send: typeof sendFile = sendFile, cards = false) {
  return async (files: FileList | File[], schema: Schema): Promise<PmNode[]> => {
    const nodes: PmNode[] = [];
    for (const file of Array.from(files)) {
      const { node } = await uploadOne(file, options, announce, schema, cards, send);
      if (node) nodes.push(node);
    }
    return nodes;
  };
}
