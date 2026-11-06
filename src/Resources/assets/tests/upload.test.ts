import { afterEach, describe, expect, it, vi } from 'vitest';
import { Schema } from '@milkdown/kit/prose/model';
import { UploadError, checkFile, createUploader, fileHref, fileName, parseResult, resultNode, sendFile, uploadOne } from '../src/upload';

const options = { url: '/up', csrfToken: 'tok', maxSize: 100, accept: ['image/*', 'application/pdf', '.md'] };
const file = (name: string, type: string, size = 10) => new File(['x'.repeat(size)], name, { type });

class FakeXhr {
  static last: FakeXhr;
  status = 200;
  responseText = '';
  withCredentials = false;
  headers: Record<string, string> = {};
  listeners: Record<string, () => void> = {};
  upload = { listeners: {} as Record<string, (e: ProgressEvent) => void>, addEventListener(t: string, f: (e: ProgressEvent) => void) { this.listeners[t] = f; } };
  method = '';
  url = '';
  body: unknown;
  constructor() {
    FakeXhr.last = this;
  }
  open(method: string, url: string) {
    this.method = method;
    this.url = url;
  }
  setRequestHeader(k: string, v: string) {
    this.headers[k] = v;
  }
  addEventListener(t: string, f: () => void) {
    this.listeners[t] = f;
  }
  send(body: unknown) {
    this.body = body;
  }
}

const xhr = () => new FakeXhr() as unknown as XMLHttpRequest;

afterEach(() => vi.restoreAllMocks());

describe('upload', () => {
  it('checks size and type before sending', () => {
    expect(() => checkFile(file('a.png', 'image/png', 200), options)).toThrow(UploadError);
    expect(() => checkFile(file('a.exe', 'application/x-msdownload'), options)).toThrow('upload.type');
    expect(() => checkFile(file('a.png', 'image/png'), options)).not.toThrow();
    expect(() => checkFile(file('notes.MD', ''), options)).not.toThrow();
    expect(() => checkFile(file('a.pdf', 'application/pdf'), options)).not.toThrow();
    expect(() => checkFile(file('a.bin', ''), { ...options, accept: [], maxSize: 0 })).not.toThrow();
  });

  it('posts multipart with the CSRF header and reports progress', async () => {
    const progress: number[] = [];
    const p = sendFile(file('a.png', 'image/png'), options, (n) => progress.push(n), xhr);
    const x = FakeXhr.last;
    expect(x.method).toBe('POST');
    expect(x.headers['X-CSRF-Token']).toBe('tok');
    expect(x.withCredentials).toBe(true);
    expect((x.body as FormData).get('file')).toBeInstanceOf(File);
    x.upload.listeners.progress!({ lengthComputable: true, loaded: 5, total: 10 } as ProgressEvent);
    x.upload.listeners.progress!({ lengthComputable: false, loaded: 5, total: 0 } as ProgressEvent);
    x.responseText = JSON.stringify({ url: '/files/a.png' });
    x.listeners.load!();
    expect(await p).toEqual({ url: '/files/a.png', name: 'a.png', size: 10, type: 'image/png', kind: 'image', alt: 'a' });
    expect(progress).toEqual([50]);
  });

  it('maps errors: status, 413, bad JSON, unsafe URL, network', async () => {
    const run = async (setup: (x: FakeXhr) => void) => {
      const p = sendFile(file('a.txt', 'text/plain'), { ...options, csrfToken: null }, () => undefined, xhr);
      setup(FakeXhr.last);
      return p.then(
        (r) => r,
        (e: UploadError) => e.key,
      );
    };
    expect(await run((x) => { x.status = 500; x.listeners.load!(); })).toBe('upload.failed');
    expect(await run((x) => { x.status = 413; x.listeners.load!(); })).toBe('upload.too_large');
    expect(await run((x) => { x.status = 415; x.listeners.load!(); })).toBe('upload.type');
    expect(await run((x) => { x.responseText = '{oops'; x.listeners.load!(); })).toBe('upload.failed');
    expect(await run((x) => { x.responseText = '{"url":"javascript:x"}'; x.listeners.load!(); })).toBe('upload.failed');
    expect(await run((x) => x.listeners.error!())).toBe('upload.failed');
    expect(await run((x) => { x.responseText = '{"url":"/f","name":"N","image":false,"alt":"A"}'; x.listeners.load!(); })).toEqual({ url: '/f', name: 'N', size: 10, type: 'text/plain', kind: 'file', alt: 'A' });
  });

  it('turns answers into nodes and announces every step', async () => {
    const schema = new Schema({
      nodes: { doc: { content: 'inline*' }, text: { group: 'inline' }, image: { inline: true, group: 'inline', attrs: { src: {}, alt: {}, title: {} } } },
      marks: { link: { attrs: { href: {}, title: {} } } },
    });
    const r = (kind: 'image' | 'file', url = '/a.pdf') => ({ url, name: 'a.pdf', size: 3, type: 'application/pdf', kind, alt: 'A' });
    expect(resultNode(schema, r('image', '/a.png'))!.type.name).toBe('image');
    expect(resultNode(schema, r('file'))!.marks[0]!.attrs.href).toBe('/a.pdf');
    // file_cards without the leaf directive node: still a link.
    expect(resultNode(schema, r('file'), true)!.marks[0]!.attrs.href).toBe('/a.pdf');
    const bare = new Schema({ nodes: { doc: { content: 'text*' }, text: {} } });
    expect(resultNode(bare, r('image'))!.text).toBe('a.pdf');

    const said: string[] = [];
    const announce = (key: string, _p: Record<string, string | number>, error = false) => said.push(`${error ? '!' : ''}${key}`);
    const send = vi.fn(async (f: File, _o: unknown, onProgress: (n: number) => void) => {
      onProgress(100);
      if (f.name === 'boom.png') throw new Error('x');
      return { url: '/x', name: f.name, size: 1, type: 'image/png', kind: 'image' as const, alt: '' };
    });
    const nodes = await createUploader(options, announce, send as never)([file('a.png', 'image/png'), file('big.png', 'image/png', 500), file('boom.png', 'image/png')], schema);
    expect(nodes).toHaveLength(1);
    expect(said).toEqual(['upload.uploading', 'upload.uploading', 'upload.done', '!upload.too_large', 'upload.uploading', 'upload.uploading', '!upload.failed']);
  });

  it('validates the 1.8 answer {url, name, size, type, kind}: the host decides the kind, names and types are cleaned', () => {
    const pdf = file('scan.pdf', 'application/pdf', 7);
    const png = file('shot.png', 'image/png', 7);
    expect(parseResult({ url: '/f/1', name: 'Q3.pdf', size: 1234, type: 'Application/PDF', kind: 'file' }, pdf, options)).toEqual({
      url: '/f/1', name: 'Q3.pdf', size: 1234, type: 'application/pdf', kind: 'file', alt: 'Q3',
    });
    // A file the browser calls an image is a file when the host says so (never trust the client type), and back.
    expect(parseResult({ url: '/f/2', kind: 'file' }, png, options)!.kind).toBe('file');
    expect(parseResult({ url: '/f/3', kind: 'image' }, pdf, options)!.kind).toBe('image');
    // Legacy flag, then the browser's guess, then the per-kind lists.
    expect(parseResult({ url: '/f', image: true }, pdf, options)!.kind).toBe('image');
    expect(parseResult({ url: '/f' }, png, options)!.kind).toBe('image');
    expect(parseResult({ url: '/f' }, pdf, options)!.kind).toBe('file');
    expect(parseResult({ url: '/f' }, png, { ...options, acceptImages: ['image/jpeg'], acceptFiles: ['image/png'] })!.kind).toBe('file');
    expect(parseResult({ url: '/f' }, png, { ...options, acceptImages: ['image/png'] })!.kind).toBe('image');
    // Bad sizes and types fall back to the file; unusable answers are null.
    expect(parseResult({ url: '/f', size: -1, type: 'not a type', name: '  ' }, pdf, options)).toMatchObject({ size: 7, type: 'application/pdf', name: 'scan.pdf' });
    expect(parseResult({ url: '/f', size: 1.5, type: 42 }, file('x', ''), options)).toMatchObject({ size: 10, type: '' });
    expect(parseResult({ url: '/f', alt: '' }, png, options)!.alt).toBe('');
    expect(parseResult({ url: 'data:text/html,x' }, pdf, options)).toBeNull();
    expect(parseResult([], pdf, options)).toBeNull();
    expect(parseResult(null, pdf, options)).toBeNull();
  });

  it('cleans file names and card links (control, bidi override, brackets, quotes)', () => {
    expect(fileName('  invoice\u202efdp.exe ')).toBe('invoicefdp.exe');
    expect(fileName('a [b]\n c')).toBe('a (b) c');
    expect(fileName('\u0000')).toBe('file');
    expect(fileName('x'.repeat(300))).toHaveLength(200);
    expect(fileHref('/files/a b"c\'<d>`{e}\\')).toBe('/files/a%20b%22c%27%3Cd%3E%60%7Be%7D%5C');
    expect(fileHref('javascript:alert(1)')).toBe('');
    expect(fileHref('https://cdn.example/x.pdf')).toBe('https://cdn.example/x.pdf');
  });

  it('uploadOne reports the progress to the placeholder and the error key', async () => {
    const schema = new Schema({ nodes: { doc: { content: 'text*' }, text: {} }, marks: { link: { attrs: { href: {}, title: {} } } } });
    const progress: number[] = [];
    const send = vi.fn(async (_f: File, _o: unknown, onProgress: (n: number) => void) => {
      onProgress(40);
      return { url: '/x.pdf', name: 'x.pdf', size: 1, type: 'application/pdf', kind: 'file' as const, alt: '' };
    });
    const ok = await uploadOne(file('x.pdf', 'application/pdf'), options, () => undefined, schema, true, send as never, (n) => progress.push(n));
    expect(ok.error).toBeNull();
    expect(ok.node!.text).toBe('x.pdf');
    expect(progress).toEqual([0, 40]);
    const bad = await uploadOne(file('x.exe', 'application/x-msdownload'), options, () => undefined, schema, true, send as never);
    expect(bad).toEqual({ node: null, error: 'upload.type' });
  });
});
