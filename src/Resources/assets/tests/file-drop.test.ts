import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { editorViewCtx } from '@milkdown/kit/core';
import type { EditorView } from '@milkdown/kit/prose/view';
import { TextSelection } from '@milkdown/kit/prose/state';
import type { MilkdownEditorHandle } from '../src/editor';
import { fileCard, fileKind, fileName, formatSize, hrefExtension } from '../src/dialect/file-card';
import { parseOptions } from '../src/options';
import { createFileDrop } from '../src/plugins/file-drop';
import { defaultRuntime } from '../src/runtime';
import { editor, keydown, tick } from './helpers';

type Answer = { status?: number; body: Record<string, unknown> };

/** XHR stand-in answering asynchronously by file name (the host's view of the file). */
class FakeXhr {
  static answers: Record<string, Answer> = {};
  static sent: string[] = [];
  status = 200;
  responseText = '';
  withCredentials = false;
  private listeners: Record<string, () => void> = {};
  private progress: ((e: ProgressEvent) => void) | null = null;
  upload = { addEventListener: (_t: string, f: (e: ProgressEvent) => void) => (this.progress = f) };
  open(): void {}
  setRequestHeader(): void {}
  addEventListener(t: string, f: () => void): void {
    this.listeners[t] = f;
  }
  send(body: FormData): void {
    const name = (body.get('file') as File).name;
    FakeXhr.sent.push(name);
    const answer = FakeXhr.answers[name] ?? { body: { url: `/files/${name}` } };
    setTimeout(() => {
      this.progress?.({ lengthComputable: true, loaded: 1, total: 2 } as ProgressEvent);
      this.status = answer.status ?? 200;
      this.responseText = JSON.stringify(answer.body);
      this.listeners.load!();
    }, 1);
  }
}

const file = (name: string, type: string, size = 4) => new File(['x'.repeat(size)], name, { type });
const view = (h: MilkdownEditorHandle): EditorView => h.builder.editor.action((ctx) => ctx.get(editorViewCtx));
const files = (list: File[]) => Object.assign(list, { item: (i: number) => list[i] ?? null });

function drop(target: Element, list: File[]): Event {
  const event = new Event('drop', { bubbles: true, cancelable: true });
  Object.defineProperty(event, 'dataTransfer', { value: { files: files(list), types: ['Files'], getData: () => '' } });
  Object.defineProperty(event, 'clientX', { value: 0 });
  Object.defineProperty(event, 'clientY', { value: 0 });
  target.dispatchEvent(event);
  return event;
}

function paste(target: Element, list: File[], html = ''): Event {
  const event = new Event('paste', { bubbles: true, cancelable: true });
  Object.defineProperty(event, 'clipboardData', {
    value: { files: files(list), types: html ? ['text/html', 'Files'] : ['Files'], getData: (t: string) => (t === 'text/html' ? html : '') },
  });
  target.dispatchEvent(event);
  return event;
}

/** Waits until every placeholder is gone (each upload answers after a tick). */
async function settle(h: MilkdownEditorHandle): Promise<void> {
  for (let i = 0; i < 200 && h.root.querySelector('.nowo-milkdown-upload:not(.nowo-milkdown-upload--error)'); i++) await tick(5);
}

const upload = { url: '/up', csrfToken: 't', maxSize: 1000, accept: [] as string[] };
let handle: MilkdownEditorHandle | null = null;

beforeEach(() => {
  FakeXhr.answers = {};
  FakeXhr.sent = [];
  vi.stubGlobal('XMLHttpRequest', FakeXhr);
});

afterEach(async () => {
  vi.unstubAllGlobals();
  await handle?.destroy();
  handle = null;
});

describe('file drop and paste (1.8, ME-3)', () => {
  it('drops three files (PNG, PDF, CSV) in order: one image and two file cards, saved as Markdown', async () => {
    FakeXhr.answers = {
      'shot.png': { body: { url: '/files/1', name: 'shot.png', size: 4, type: 'image/png', kind: 'image' } },
      'q3.pdf': { body: { url: '/files/2', name: 'q3.pdf', size: 1258291, type: 'application/pdf', kind: 'file' } },
      'data.csv': { body: { url: '/files/3', name: 'data.csv', size: 512, type: 'text/csv', kind: 'file' } },
    };
    handle = await editor('Start', { features: ['file_cards'], upload });
    const v = view(handle);
    v.dispatch(v.state.tr.setSelection(TextSelection.create(v.state.doc, v.state.doc.content.size - 1)));
    const event = drop(v.dom, [file('shot.png', 'image/png'), file('q3.pdf', 'application/pdf'), file('data.csv', 'text/csv')]);
    expect(event.defaultPrevented).toBe(true);
    // A placeholder per file at the drop point, waiting in order.
    expect([...handle.root.querySelectorAll('.nowo-milkdown-upload__name')].map((e) => e.textContent)).toEqual(['shot.png', 'q3.pdf', 'data.csv']);
    await settle(handle);
    expect(FakeXhr.sent).toEqual(['shot.png', 'q3.pdf', 'data.csv']);
    expect(handle.root.querySelector('.nowo-milkdown-upload')).toBeNull();
    const md = handle.getMarkdown();
    expect(md).toContain('![shot](/files/1)');
    expect(md.indexOf('/files/1')).toBeLessThan(md.indexOf('/files/2'));
    expect(md.indexOf('/files/2')).toBeLessThan(md.indexOf('/files/3'));
    expect(md).toMatch(/::file\[q3\.pdf\]\{href="\/files\/2" size="1258291" type="application\/pdf"\}/);
    expect(md).toMatch(/::file\[data\.csv\]\{href="\/files\/3" size="512" type="text\/csv"\}/);
    // The editor shows the cards; the Markdown reloads to the same document.
    const cards = handle.root.querySelectorAll<HTMLElement>('.nowo-milkdown-file');
    expect([...cards].map((c) => c.className)).toEqual(['nowo-milkdown-file nowo-milkdown-file--pdf', 'nowo-milkdown-file nowo-milkdown-file--sheet']);
    expect(cards[0]!.querySelector('a')!.getAttribute('href')).toBe('/files/2');
    expect(cards[0]!.querySelector('a')!.rel).toBe('noopener noreferrer');
    expect(cards[0]!.textContent).toBe('PDFq3.pdf1.2 MB');
    handle.setMarkdown(md);
    expect(handle.getMarkdown()).toBe(md);
    // The card link is the card's own: a click opens it (new tab) instead of selecting the node; DOM changes inside the
    // card are not document changes.
    const link = handle.root.querySelector<HTMLAnchorElement>('.nowo-milkdown-file a')!;
    expect(link.target).toBe('_blank');
    link.addEventListener('click', (e) => e.preventDefault());
    link.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));
    link.click();
    link.dataset.touched = '1';
    await tick(5);
    expect(handle.getMarkdown()).toBe(md);
    // Milkdown's own upload plugin is a backstop that never inserts anything.
    const { uploadConfig } = await import('@milkdown/kit/plugin/upload');
    expect(await handle.builder.editor.action((ctx) => ctx.get(uploadConfig.key).uploader([] as unknown as FileList, v.state.schema, ctx, 0))).toEqual([]);
  });

  it('without file_cards other files become links (as before 1.8)', async () => {
    FakeXhr.answers = { 'a.pdf': { body: { url: '/files/a', name: 'a.pdf', image: false } } };
    handle = await editor('x', { upload });
    drop(view(handle).dom, [file('a.pdf', 'application/pdf')]);
    await settle(handle);
    expect(handle.getMarkdown()).toContain('[a.pdf](/files/a)');
  });

  it('a failed file leaves a dismissible notice in its place; the others still land', async () => {
    FakeXhr.answers = { 'bad.pdf': { status: 500, body: {} } };
    handle = await editor('x', { features: ['file_cards'], upload: { ...upload, accept: ['image/*', 'application/pdf'] } });
    const v = view(handle);
    drop(v.dom, [file('bad.pdf', 'application/pdf'), file('virus.exe', 'application/x-msdownload'), file('ok.png', 'image/png')]);
    await settle(handle);
    const notices = handle.root.querySelectorAll<HTMLElement>('.nowo-milkdown-upload--error');
    expect([...notices].map((n) => n.querySelector('.nowo-milkdown-upload__message')!.textContent)).toEqual([
      'bad.pdf could not be uploaded',
      'virus.exe is not an allowed file type',
    ]);
    expect(FakeXhr.sent).toEqual(['bad.pdf', 'ok.png']);
    expect(handle.getMarkdown()).toContain('/files/ok.png');
    expect(handle.getMarkdown()).not.toContain('bad.pdf');
    const dismiss = notices[0]!.querySelector<HTMLButtonElement>('button')!;
    expect(dismiss.getAttribute('aria-label')).toBe('Dismiss');
    // Events inside the notice stay with it (ProseMirror does not move the caret there).
    const down = new MouseEvent('mousedown', { bubbles: true, cancelable: true });
    dismiss.dispatchEvent(down);
    expect(down.defaultPrevented).toBe(false);
    dismiss.click();
    expect(handle.root.querySelectorAll('.nowo-milkdown-upload--error')).toHaveLength(1);
  });

  it('pastes a screenshot (files, no HTML) at the caret; HTML with files keeps the normal paste', async () => {
    handle = await editor('Hello', { upload });
    const v = view(handle);
    v.dispatch(v.state.tr.setSelection(TextSelection.create(v.state.doc, 1, 6)));
    const event = paste(v.dom, [file('image.png', 'image/png')]);
    expect(event.defaultPrevented).toBe(true);
    await settle(handle);
    expect(handle.getMarkdown().trim()).toBe('![image](/files/image.png)');
    const sent = FakeXhr.sent.length;
    paste(v.dom, [file('image.png', 'image/png')], '<b>Word</b>');
    await tick(10);
    expect(FakeXhr.sent.length).toBe(sent);
  });

  it('read-only or without upload_url: nothing is inserted and a hint says uploads are off', async () => {
    handle = await editor('x', { readonly: true, upload });
    let v = view(handle);
    const over = new Event('dragover', { bubbles: true, cancelable: true });
    Object.defineProperty(over, 'dataTransfer', { value: { files: files([]), types: ['Files'] } });
    v.dom.dispatchEvent(over);
    expect(over.defaultPrevented).toBe(true);
    expect(drop(v.dom, [file('a.png', 'image/png')]).defaultPrevented).toBe(true);
    expect(handle.root.querySelector('.nowo-milkdown__status')!.textContent).toBe('Uploads are off in this editor');
    expect(FakeXhr.sent).toEqual([]);
    await handle.destroy();

    handle = await editor('x', {});
    v = view(handle);
    expect(drop(v.dom, [file('a.png', 'image/png')]).defaultPrevented).toBe(true);
    expect(paste(v.dom, [file('a.png', 'image/png')]).defaultPrevented).toBe(true);
    await tick(5);
    expect(handle.getMarkdown().trim()).toBe('x');
    expect(handle.root.querySelector('.nowo-milkdown__status')!.textContent).toBe('Uploads are off in this editor');
  });

  it('lands at the caret without layout, drops nothing when its placeholder is gone, stops when destroyed', async () => {
    handle = await editor('Hello', { upload });
    const v = view(handle);
    const over = new Event('dragover', { bubbles: true, cancelable: true });
    Object.defineProperty(over, 'dataTransfer', { value: { files: files([]), types: ['Files'] } });
    v.dom.dispatchEvent(over); // editable with uploads: ProseMirror handles the drag
    vi.spyOn(v, 'posAtCoords').mockImplementation(() => {
      throw new Error('no layout');
    });
    v.dispatch(v.state.tr.setSelection(TextSelection.create(v.state.doc, 6)));
    drop(v.dom, [file('a.png', 'image/png')]);
    await settle(handle);
    expect(handle.getMarkdown().trim()).toBe('Hello![a](/files/a.png)');
    // The document is replaced while uploading: the placeholder went with it, nothing is inserted.
    drop(v.dom, [file('b.png', 'image/png')]);
    handle.setMarkdown('Fresh');
    await tick(20);
    expect(handle.getMarkdown().trim()).toBe('Fresh');
    // Destroyed while uploading: the answer is ignored.
    drop(v.dom, [file('c.png', 'image/png')]);
    await handle.destroy();
    handle = null;
    await tick(20);
    expect(FakeXhr.sent).toEqual(['a.png', 'b.png', 'c.png']);
  });

  it('/file and the action bar open the file picker; the picked files upload at the caret', async () => {
    const inputs: HTMLInputElement[] = [];
    vi.spyOn(HTMLInputElement.prototype, 'click').mockImplementation(function (this: HTMLInputElement) {
      inputs.push(this);
    });
    handle = await editor('', { features: ['slash_menu', 'file_cards'], upload: { ...upload, accept: ['image/*', '.pdf'] } });
    const v = view(handle);
    v.focus();
    v.dispatch(v.state.tr.insertText('/fil'));
    await tick(200);
    const option = [...document.querySelectorAll<HTMLElement>('[role="option"]')].find((o) => o.textContent?.includes('Image or file…'));
    expect(option).toBeDefined();
    keydown(v.dom, 'Enter');
    const input = inputs[0];
    expect(input).toBeDefined();
    expect(input!.accept).toBe('image/*,.pdf');
    expect(input!.multiple).toBe(true);
    Object.defineProperty(input!, 'files', { value: files([file('r.pdf', 'application/pdf')]) });
    input!.dispatchEvent(new Event('change'));
    await settle(handle);
    expect(handle.getMarkdown()).toContain('::file[r.pdf]{href="/files/r.pdf" size="4" type="application/pdf"}');
    // An empty pick does nothing.
    handle.root.querySelector<HTMLButtonElement>('.nowo-milkdown__action')!.click();
    expect(inputs).toHaveLength(2);
    inputs[1]!.dispatchEvent(new Event('change'));
    expect(FakeXhr.sent).toEqual(['r.pdf']);
  });
});

describe('file drop handlers without an editor (audit GR-I5)', () => {
  const said: string[] = [];
  const make = (withUpload: boolean) =>
    createFileDrop({ upload: withUpload ? upload : null, cards: true, runtime: defaultRuntime(), announce: (key) => said.push(key) });
  const event = (type: string, data: unknown) => {
    const e = new Event(type, { cancelable: true });
    Object.defineProperty(e, type === 'paste' ? 'clipboardData' : 'dataTransfer', { value: data });
    return e as DragEvent & ClipboardEvent;
  };
  const view = (extra: Record<string, unknown> = {}) => ({ editable: true, dragging: null, ...extra }) as unknown as EditorView;

  it('leaves internal drags, empty drops and missing data to ProseMirror', async () => {
    const drop = make(true);
    const files1 = { files: files([file('a.png', 'image/png')]), types: ['Files'] };
    // A drag of editor content (ProseMirror moves it) is never an upload.
    expect(drop.props.handleDOMEvents.drop(view({ dragging: { slice: null, move: true } }), event('drop', files1))).toBe(false);
    expect(drop.props.handleDOMEvents.drop(view(), event('drop', null))).toBe(false);
    expect(drop.props.handleDOMEvents.dragover(view(), event('dragover', null))).toBe(false);
    expect(drop.props.handleDOMEvents.dragover(view({ editable: false }), event('dragover', null))).toBe(false);
    expect(drop.props.handlePaste(view(), event('paste', null))).toBe(false);
    expect(drop.props.handlePaste(view(), event('paste', { files: files([]), types: [], getData: () => '' }))).toBe(false);
    // Nothing to upload, or uploads off: no transaction at all.
    const dispatch = vi.fn();
    await drop.uploadFiles(view({ dispatch }), [], 0);
    await make(false).uploadFiles(view({ dispatch }), [file('a.png', 'image/png')], 0);
    expect(dispatch).not.toHaveBeenCalled();
    expect(said).toEqual([]);
  });
});

describe('action_bar_insert (1.8, ME-2)', () => {
  const labels = (h: MilkdownEditorHandle) => [...h.root.querySelectorAll('.nowo-milkdown__action')].map((b) => b.textContent);

  it('parses action_bar_insert and the per-kind accept lists', () => {
    expect(parseOptions(JSON.stringify({ actionBarInsert: ['icon', 'bogus', 'file'] })).actionBarInsert).toEqual(['file', 'icon']);
    expect(parseOptions('{}').actionBarInsert).toEqual(['file', 'icon']);
    expect(parseOptions(JSON.stringify({ actionBarInsert: [] })).actionBarInsert).toEqual([]);
    expect(parseOptions(JSON.stringify({ upload: { url: '/u', accept: ['a', 1], acceptImages: ['image/png'], acceptFiles: ['.pdf', null] } })).upload).toEqual({
      url: '/u', csrfToken: null, maxSize: 0, accept: ['a'], acceptImages: ['image/png'], acceptFiles: ['.pdf'],
    });
    expect(parseOptions(JSON.stringify({ upload: { url: '/u' } })).upload).toEqual({ url: '/u', csrfToken: null, maxSize: 0, accept: [] });
    expect(parseOptions(JSON.stringify({ upload: { url: '' } })).upload).toBeNull();
  });

  it('shows both buttons by default, one or none on request; the keyboard paths stay', async () => {
    handle = await editor('x', { icons: ['bug'], upload });
    expect(labels(handle)).toEqual(['Insert file', 'Insert icon']);
    await handle.destroy();
    handle = await editor('x', { icons: ['bug'], upload, actionBarInsert: ['icon'] });
    expect(labels(handle)).toEqual(['Insert icon']);
    await handle.destroy();
    handle = await editor('x', { icons: ['bug'], upload, actionBarInsert: [], features: ['slash_menu', 'context_menu', 'insert_menu'] });
    expect(handle.root.querySelector('.nowo-milkdown__actions')).toBeNull();
    const v = view(handle);
    v.focus();
    const options = async (text: string) => {
      v.dispatch(v.state.tr.insertText(text, 1, v.state.selection.from));
      await tick(200);
      return [...document.querySelectorAll<HTMLElement>('[role="option"]')].map((o) => o.textContent);
    };
    expect(await options('/fil')).toEqual(['Image or file…']);
    expect(await options('/ico')).toEqual(['Icon…']);
  });
});

describe('file cards (dialect, shared fixture with PHP)', () => {
  const fixture = JSON.parse(readFileSync(resolve(__dirname, '../../../../tests/Fixtures/file-cards.json'), 'utf8')) as {
    cards: { name: string; type: string; href: string; size: string; category: string; badge: string; sizeText: string }[];
    names: [string, string][];
  };

  it.each(fixture.cards)('$name ($type, $href, $size)', (c) => {
    expect(fileKind(c.name, c.type, c.href)).toEqual({ category: c.category, badge: c.badge });
    expect(formatSize(c.size)).toBe(c.sizeText);
  });

  it.each(fixture.names)('name %j', (input, output) => {
    expect(fileName(input)).toBe(output);
  });

  it('drops unsafe links and keeps the name as text', () => {
    const card = fileCard('x.pdf', { href: 'javascript:alert(1)', size: 'nope' });
    expect(card.querySelector('a')).toBeNull();
    expect(card.querySelector('.nowo-milkdown-file__size')).toBeNull();
    expect(card.textContent).toBe('PDFx.pdf');
    expect(formatSize(undefined)).toBe('');
    expect(fileKind('x')).toEqual({ category: 'other', badge: 'FILE' });
    expect(hrefExtension('/a/b')).toBe('');
    // Audit GR-I1: the link decides.
    const exe = fileCard('invoice.pdf', { href: '/u/setup.exe', type: 'application/pdf' });
    expect(exe.className).toBe('nowo-milkdown-file nowo-milkdown-file--other');
    expect(exe.querySelector('.nowo-milkdown-file__badge')!.textContent).toBe('EXE');
  });
});
