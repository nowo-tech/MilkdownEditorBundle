/**
 * Upload hook (FR-045): dropped, pasted or picked files are POSTed (multipart field `file`) to the host's
 * upload URL with the CSRF token in the `X-CSRF-Token` header. The JSON answer `{url, name?, image?, alt?}`
 * becomes an image (`![alt](url)`) or a link (`[name](url)`). Progress and errors go to a live region.
 */
import type { Node as PmNode, Schema } from '@milkdown/kit/prose/model';
import { safeUrl } from './link-titles';
import type { EditorOptions } from './types';

export type UploadResult = { url: string; name: string; image: boolean; alt: string };
export type UploadOptions = NonNullable<EditorOptions['upload']>;
export type Announce = (key: string, params: Record<string, string | number>, error?: boolean) => void;

export class UploadError extends Error {
  constructor(readonly key: string) {
    super(key);
  }
}

/** Checks size and type before any request (`accept` entries: `image/*`, `application/pdf`, `.md`). */
export function checkFile(file: File, options: UploadOptions): void {
  if (options.maxSize > 0 && file.size > options.maxSize) throw new UploadError('upload.too_large');
  if (options.accept.length === 0) return;
  const name = file.name.toLowerCase();
  const ok = options.accept.some((rule) => {
    const r = rule.toLowerCase();
    if (r.startsWith('.')) return name.endsWith(r);
    if (r.endsWith('/*')) return file.type.startsWith(r.slice(0, -1));
    return file.type === r;
  });
  if (!ok) throw new UploadError('upload.type');
}

/**
 * POSTs one file with progress; resolves with the validated answer.
 *
 * @param file - The file to send
 * @param options - Upload URL, CSRF token and limits
 * @param onProgress - Called with the percentage sent
 * @param xhrFactory - Creates the request (tests)
 * @returns The URL, name and kind of the stored file
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
        reject(new UploadError(xhr.status === 413 ? 'upload.too_large' : 'upload.failed'));
        return;
      }
      let body: Record<string, unknown>;
      try {
        body = JSON.parse(xhr.responseText) as Record<string, unknown>;
      } catch {
        body = {};
      }
      const url = safeUrl(body.url);
      if (!url) {
        reject(new UploadError('upload.failed'));
        return;
      }
      const name = typeof body.name === 'string' && body.name !== '' ? body.name : file.name;
      resolve({
        url,
        name,
        image: body.image === true || (body.image === undefined && file.type.startsWith('image/')),
        alt: typeof body.alt === 'string' ? body.alt : name.replace(/\.[^.]+$/, ''),
      });
    });
    const form = new FormData();
    form.append('file', file, file.name);
    xhr.send(form);
  });
}

/** Turns an answer into the node to insert: an inline image or a linked file name. */
export function resultNode(schema: Schema, result: UploadResult): PmNode | null {
  if (result.image && schema.nodes.image) return schema.nodes.image.create({ src: result.url, alt: result.alt, title: '' });
  const link = schema.marks.link;
  return link ? schema.text(result.name, [link.create({ href: result.url, title: null })]) : schema.text(result.name);
}

/** The uploader given to Milkdown's upload plugin (drop and paste) and to the *Insert file* button. */
export function createUploader(options: UploadOptions, announce: Announce, send: typeof sendFile = sendFile) {
  return async (files: FileList | File[], schema: Schema): Promise<PmNode[]> => {
    const nodes: PmNode[] = [];
    for (const file of Array.from(files)) {
      try {
        checkFile(file, options);
        announce('upload.uploading', { name: file.name, percent: 0 });
        const result = await send(file, options, (percent) => announce('upload.uploading', { name: file.name, percent }));
        const node = resultNode(schema, result);
        if (node) nodes.push(node);
        announce('upload.done', { name: file.name });
      } catch (error) {
        announce(error instanceof UploadError ? error.key : 'upload.failed', { name: file.name }, true);
      }
    }
    return nodes;
  };
}
