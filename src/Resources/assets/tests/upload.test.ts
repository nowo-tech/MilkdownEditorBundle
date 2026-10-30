import { afterEach, describe, expect, it, vi } from 'vitest';
import { Schema } from '@milkdown/kit/prose/model';
import { UploadError, checkFile, createUploader, resultNode, sendFile } from '../src/upload';

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
    expect(await p).toEqual({ url: '/files/a.png', name: 'a.png', image: true, alt: 'a' });
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
    expect(await run((x) => { x.responseText = '{oops'; x.listeners.load!(); })).toBe('upload.failed');
    expect(await run((x) => { x.responseText = '{"url":"javascript:x"}'; x.listeners.load!(); })).toBe('upload.failed');
    expect(await run((x) => x.listeners.error!())).toBe('upload.failed');
    expect(await run((x) => { x.responseText = '{"url":"/f","name":"N","image":false,"alt":"A"}'; x.listeners.load!(); })).toEqual({ url: '/f', name: 'N', image: false, alt: 'A' });
  });

  it('turns answers into nodes and announces every step', async () => {
    const schema = new Schema({
      nodes: { doc: { content: 'inline*' }, text: { group: 'inline' }, image: { inline: true, group: 'inline', attrs: { src: {}, alt: {}, title: {} } } },
      marks: { link: { attrs: { href: {}, title: {} } } },
    });
    expect(resultNode(schema, { url: '/a.png', name: 'a', image: true, alt: 'A' })!.type.name).toBe('image');
    expect(resultNode(schema, { url: '/a.pdf', name: 'a.pdf', image: false, alt: '' })!.marks[0]!.attrs.href).toBe('/a.pdf');
    const bare = new Schema({ nodes: { doc: { content: 'text*' }, text: {} } });
    expect(resultNode(bare, { url: '/a', name: 'a', image: true, alt: '' })!.text).toBe('a');

    const said: string[] = [];
    const announce = (key: string, _p: Record<string, string | number>, error = false) => said.push(`${error ? '!' : ''}${key}`);
    const send = vi.fn(async (f: File, _o: unknown, onProgress: (n: number) => void) => {
      onProgress(100);
      if (f.name === 'boom.png') throw new Error('x');
      return { url: '/x', name: f.name, image: true, alt: '' };
    });
    const nodes = await createUploader(options, announce, send as never)([file('a.png', 'image/png'), file('big.png', 'image/png', 500), file('boom.png', 'image/png')], schema);
    expect(nodes).toHaveLength(1);
    expect(said).toEqual(['upload.uploading', 'upload.uploading', 'upload.done', '!upload.too_large', 'upload.uploading', 'upload.uploading', '!upload.failed']);
  });
});
