import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DOMParser as PmDOMParser, Slice } from '@milkdown/kit/prose/model';
import { NodeSelection, TextSelection } from '@milkdown/kit/prose/state';
import { editorViewCtx } from '@milkdown/kit/core';
import type { EditorView } from '@milkdown/kit/prose/view';
import { RESERVED, hostReference, hostUrl, isHostUrl, parseHostSchemes, targetUrl } from '../src/host';
import { cleanPasted, insertMarkdown, isSafePastedUrl, markdownIo, pasteCheckFor } from '../src/commands/markdown-clipboard';
import { imageAttributesPrefix, imageAlign, imageWidth, liftImageAttributes, serialiseImageAttributes } from '../src/dialect/image';
import { FILE_VIEWS, fileCard, fileIcon, fileKind, fileView, previewHeight, resetPreviewWatcher } from '../src/dialect/file-card';
import { fileAt, fileViewItems, setFileAttributes, setFileView } from '../src/commands/file-view';
import { imageAt, imageItems, imageSource } from '../src/nodes/image';
import { emptyLine, InsertButtonView } from '../src/plugins/insert-button';
import { DEFAULT_MAX_PREVIEWS, pageHostConfig, pageNonce, parseOptions, previewSandbox } from '../src/options';
import { fileHref, parseResult, resultNode } from '../src/upload';
import { GLYPHS } from '../src/ui/glyphs';
import { defaultRuntime } from '../src/runtime';
import { editor, keydown, tick } from './helpers';
import type { MdNode } from '../src/dialect/remark-dialect';
import type { MilkdownEditorHandle } from '../src/editor';

const schemes = { 'host-file': { image: '/f/{id}/view', file: '/f/{id}', preview: '/f/{id}/preview' }, bare: { image: null, file: null, preview: null } };

const view = (handle: MilkdownEditorHandle): EditorView => {
  let out!: EditorView;
  handle.builder.editor.action((ctx) => {
    out = ctx.get(editorViewCtx);
  });
  return out;
};

describe('host references (ME-5)', () => {
  it('parses only valid schemes and templates', () => {
    expect(parseHostSchemes(null)).toEqual({});
    expect(parseHostSchemes([])).toEqual({});
    expect(
      parseHostSchemes({
        ok: { image: '/i/{id}', file: 'https://x.example/{id}', preview: 'javascript:{id}' },
        javascript: { file: '/{id}' },
        https: { file: '/{id}' },
        UPPER: { file: '/{id}' },
        nothing: null,
        noid: { file: '/files' },
        proto: { file: '//evil/{id}' },
        authority: { image: 'https://{id}/x', file: 'https://x.example{id}/y', preview: 'https://u:{id}@x.example/y' },
        'view-source': { file: '/{id}' },
      }),
    ).toEqual({
      ok: { image: '/i/{id}', file: 'https://x.example/{id}', preview: null },
      noid: { image: null, file: null, preview: null },
      proto: { image: null, file: null, preview: null },
      authority: { image: null, file: null, preview: null },
    });
  });

  it('recognises references like the PHP side', () => {
    expect(isHostUrl('host-file:x', schemes)).toBe(true);
    expect(isHostUrl(' HOST-FILE:x', schemes)).toBe(true);
    expect(isHostUrl('https://x', schemes)).toBe(false);
    expect(isHostUrl(5, schemes)).toBe(false);
    expect(isHostUrl('constructor:x', schemes)).toBe(false);
    expect(hostReference('HOST-FILE:a.b-c_d~', schemes)).toBe('host-file:a.b-c_d~');
    expect(hostReference(5, schemes)).toBeNull();
    expect(hostReference('other:x', schemes)).toBeNull();
    for (const bad of ['host-file:..', 'host-file:.', 'host-file:...', 'host-file:.env', 'host-file:\u00a0x', 'host-file:a/b', 'host-file:a%2Fb', 'host-file:', `host-file:${'a'.repeat(201)}`]) {
      expect(hostReference(bad, schemes), bad).toBeNull();
      expect(hostUrl(bad, 'file', schemes), bad).toBeNull();
    }
  });

  it('builds URLs through the templates and the same URL checks', () => {
    expect(hostUrl('host-file:x', 'image', schemes)).toBe('/f/x/view');
    expect(hostUrl('host-file:x', 'preview', schemes)).toBe('/f/x/preview');
    expect(hostUrl('https://a/b', 'file', schemes)).toBeUndefined();
    expect(hostUrl('bare:x', 'image', schemes)).toBeNull();
    expect(hostUrl('a:x', 'image', { a: { image: null, file: '/f/{id}', preview: null } })).toBe('/f/x');
    expect(hostUrl('a:x', 'file', { a: { image: 'javascript:{id}', file: 'javascript:{id}', preview: null } })).toBeNull();
    expect(targetUrl('host-file:x', 'file', schemes)).toBe('/f/x');
    expect(targetUrl('bare:x', 'file', schemes)).toBe('');
    expect(targetUrl('javascript:alert(1)', 'file', schemes)).toBe('');
    expect(targetUrl('/plain', 'file', schemes)).toBe('/plain');
  });

  it('an image only loads from a safe source (raster data: images as before)', () => {
    expect(imageSource('host-file:x', schemes)).toBe('/f/x/view');
    expect(imageSource('data:image/png;base64,AA', {})).toBe('data:image/png;base64,AA');
    for (const bad of ['data:image/svg+xml,x', 'data:text/html,x', 'javascript:alert(1)', '//evil/x', 'host-file:..']) expect(imageSource(bad, schemes), bad).toBe('');
    expect(imageSource(null, schemes)).toBe('');
  });

  it('paste keeps the schemes of that editor only, never a browser scheme', () => {
    expect(isSafePastedUrl('host-file:x')).toBe(false);
    const own = pasteCheckFor(schemes);
    expect(own('host-file:x')).toBe(true);
    expect(own('/plain')).toBe(true);
    expect(own('javascript:x')).toBe(false);
    expect(own('other:x')).toBe(false);
    expect(own(5)).toBe(true);
    expect(pasteCheckFor({})('host-file:x')).toBe(false);
    // Even if a host's own createEditor() options name one.
    expect(pasteCheckFor({ javascript: { image: null, file: '/{id}', preview: null } })('javascript:x')).toBe(false);
    expect(RESERVED.has('view-source')).toBe(true);
  });

  it('uploads keep host references', () => {
    const file = new File(['x'], 'a.pdf', { type: 'application/pdf' });
    const options = { url: '/u', csrfToken: '', maxSize: 0, accept: [], hostSchemes: schemes };
    expect(parseResult({ url: 'host-file:abc' }, file, options)?.url).toBe('host-file:abc');
    expect(parseResult({ url: 'host-file:..' }, file, options)).toBeNull();
    expect(parseResult({ url: 'other:abc' }, file, options)).toBeNull();
    expect(parseResult({ url: 'host-file:abc' }, file, { ...options, hostSchemes: undefined })).toBeNull();
    expect(fileHref('host-file:abc', schemes)).toBe('host-file:abc');
    expect(fileHref('host-file:abc')).toBe('');
  });

  it('options: sandbox tokens and defaults', () => {
    expect(previewSandbox(undefined)).toBe('');
    expect(previewSandbox('ALLOW-downloads evil allow-downloads')).toBe('allow-downloads');
    expect(previewSandbox('allow-scripts allow-same-origin')).toBe('allow-scripts');
    expect(previewSandbox('allow-scripts allow-popups allow-popups-to-escape-sandbox')).toBe('allow-scripts allow-popups');
    expect(previewSandbox('allow-popups allow-popups-to-escape-sandbox')).toBe('allow-popups allow-popups-to-escape-sandbox');
    expect(previewSandbox('allow-downloads\tallow-popups')).toBe('');
  });

  describe('page configuration (audit GX-L2)', () => {
    const config = (json: string, nonce?: string, type = 'application/json'): HTMLScriptElement => {
      const element = document.createElement('script');
      element.type = type;
      element.dataset.nowoMilkdownConfig = '';
      if (nonce) element.setAttribute('nonce', nonce);
      element.textContent = json;
      document.head.append(element);
      return element;
    };
    const module = (nonce: string): void => {
      const element = document.createElement('script');
      element.type = 'text/plain';
      element.src = '/bundles/milkdown-editor.js';
      element.setAttribute('nonce', nonce);
      document.head.append(element);
    };
    afterEach(() => document.head.replaceChildren());
    const good = JSON.stringify({ hostSchemes: { a: { file: '/{id}' } }, previewSandbox: 'allow-downloads', maxPreviews: 3 });

    it('never reads host options from the JSON of a widget', async () => {
      const planted = parseOptions(JSON.stringify({ features: [], hostSchemes: { x: { file: 'https://attacker.test/{id}', preview: 'https://attacker.test/{id}/p' } }, previewSandbox: 'allow-scripts' }));
      expect(planted).toMatchObject({ hostSchemes: {}, previewSandbox: '', maxPreviews: DEFAULT_MAX_PREVIEWS });
      const handle = await editor('::file[a]{href="x:abc" view="preview"}', { features: ['file_cards'], hostSchemes: { x: { file: 'https://attacker.test/{id}', preview: 'https://attacker.test/{id}/p' } }, previewSandbox: 'allow-scripts' });
      expect(handle.options.hostSchemes).toEqual({});
      expect(handle.root.querySelector('iframe')).toBeNull();
      await handle.destroy();
    });

    it('takes them from the data block with the nonce of the page', () => {
      module('n0nce');
      config(good, 'other');
      expect(pageHostConfig().hostSchemes).toEqual({});
      config(good, 'n0nce');
      expect(pageNonce()).toBe('n0nce');
      expect(pageHostConfig()).toEqual({ hostSchemes: { a: { image: null, file: '/{id}', preview: null } }, hostUrlPatterns: [], hostUrlHosts: [], previewSandbox: 'allow-downloads', maxPreviews: 3, previewWrittenUrls: false, previewTypes: [] });
    });

    it('a page without nonces accepts the block; a data attribute alone never counts', () => {
      expect(pageHostConfig().hostSchemes).toEqual({});
      config('not json');
      expect(pageHostConfig().hostSchemes).toEqual({});
      config(JSON.stringify({ hostSchemes: { a: { file: '/{id}' } }, maxPreviews: -1 }));
      expect(pageHostConfig()).toMatchObject({ hostSchemes: { a: { file: '/{id}' } }, previewSandbox: '', maxPreviews: DEFAULT_MAX_PREVIEWS });
    });

    it('the block validates what it reads', () => {
      config(JSON.stringify({ hostSchemes: { javascript: { file: '/{id}' } }, previewSandbox: 'allow-scripts allow-same-origin' }));
      expect(pageHostConfig()).toMatchObject({ hostSchemes: {}, previewSandbox: 'allow-scripts' });
    });
  });
});

describe('image attributes (image_block)', () => {
  it('has the same rules as ImageAttributes.php', () => {
    const cases: [string, { width: string; align: string } | null][] = [
      ['{width=50%}', { width: '50%', align: '' }],
      ['{width=120px align=center}', { width: '120px', align: 'center' }],
      ['{ align="right"  width="100%" }', { width: '100%', align: 'right' }],
      ['{width=50%\u00a0align=left}', null],
      ['{width=50%\nalign=left}', null],
      ['{width=33%}', null],
      ['{width=15px}', null],
      ['{width=2001px}', null],
      ['{align=justify}', null],
      ['{width="1;color:red"}', null],
      ['{width=50% foo=bar}', null],
      ['{width=50% align=left width=25%}', null],
      ['{}', null],
      [' {width=50%}', null],
    ];
    for (const [text, expected] of cases) {
      const read = imageAttributesPrefix(text);
      expect(read && { width: read.width, align: read.align }, text).toEqual(expected);
    }
    expect(imageWidth(5)).toBe('');
    expect(imageAlign('center')).toBe('center');
    expect(imageAlign('x')).toBe('');
    expect(serialiseImageAttributes({})).toBe('');
    expect(serialiseImageAttributes({ width: '25%', align: 'left' })).toBe('{width=25% align=left}');
    expect(serialiseImageAttributes({ width: 'evil' })).toBe('');
  });

  it('lifts the block after an image, anywhere', () => {
    const tree: MdNode = {
      type: 'root',
      children: [
        { type: 'paragraph', children: [{ type: 'image' }, { type: 'text', value: '{width=50%}' }] },
        { type: 'heading', children: [{ type: 'image' }, { type: 'text', value: '{align=left} rest' }] },
        { type: 'paragraph', children: [{ type: 'image' }, { type: 'text', value: '{nope=1}' }] },
        { type: 'paragraph', children: [{ type: 'text', value: '{width=50%}' }] },
      ],
    };
    liftImageAttributes(tree);
    const [a, b, c, d] = tree.children!;
    expect(a!.children).toHaveLength(1);
    expect(a!.children![0]!.data).toEqual({ nowoImage: { width: '50%', align: '' } });
    expect(b!.children![1]!.value).toBe(' rest');
    expect(c!.children![1]!.value).toBe('{nope=1}');
    expect(d!.children).toHaveLength(1);
  });
});

describe('editor: images', () => {
  let handle: MilkdownEditorHandle;
  afterEach(async () => {
    await handle?.destroy();
    vi.restoreAllMocks();
  });

  it('without image_block the block is text, as in 1.8', async () => {
    handle = await editor('![a](/a.png){width=50%}');
    expect(handle.root.querySelector('.ProseMirror')?.textContent).toContain('{width=50%}');
    expect(handle.getMarkdown().trim()).toBe('![a](/a.png){width=50%}');
  });

  it('round trips the attribute block, whatever the feature', async () => {
    for (const features of [[], ['image_block']]) {
      for (const md of ['![a](/a.png "cap"){width=50% align=center}', 'x ![a](/a.png){width=120px} y', '![a](/a.png){nope=1}', '![a](/a.png)']) {
        handle = await editor(md, { features });
        expect(handle.getMarkdown().trim()).toBe(md);
        await handle.destroy();
      }
    }
  });

  it('fields without schemes or the feature keep the plain img', async () => {
    handle = await editor('![a](/a.png)');
    expect(handle.root.querySelector('.nowo-milkdown-image')).toBeNull();
    const img = handle.root.querySelector('img[src]')!;
    expect(img.getAttribute('src')).toBe('/a.png');
    // Milkdown's own element: no attribute of the 1.9 schema shows up.
    expect(img.hasAttribute('width')).toBe(false);
    expect(img.hasAttribute('align')).toBe(false);
  });

  it('resolves host images; what cannot be resolved or fails shows the placeholder', async () => {
    handle = await editor('![a](host-file:x) ![b](host-file:..) ![c](javascript:alert)', { messages: { 'image.hidden': 'Gone' } }, { hostSchemes: schemes });
    const imgs = handle.root.querySelectorAll<HTMLImageElement>('.nowo-milkdown-image img');
    expect(imgs).toHaveLength(1);
    expect(imgs[0]!.getAttribute('src')).toBe('/f/x/view');
    expect(imgs[0]!.getAttribute('loading')).toBe('lazy');
    expect(handle.root.querySelectorAll('.nowo-milkdown-image__hidden')).toHaveLength(2);
    expect(handle.root.querySelector('.nowo-milkdown-image__hidden')?.textContent).toBe('Gone');
    expect(handle.getMarkdown()).toContain('![a](host-file:x)');

    imgs[0]!.dispatchEvent(new Event('error'));
    expect(handle.root.querySelectorAll('.nowo-milkdown-image img')).toHaveLength(0);
    expect(handle.root.querySelectorAll('.nowo-milkdown-image__hidden')).toHaveLength(3);
  });

  it('image_block: caption, width and alignment classes, px through CSSOM', async () => {
    handle = await editor('![a](/a.png "Cap <b>"){width=50% align=right}\n\n![b](/b.png){width=200px}', { features: ['image_block'] });
    const [first, second] = handle.root.querySelectorAll<HTMLElement>('.nowo-milkdown-image');
    expect(first!.className).toContain('nowo-milkdown-image--right');
    expect(first!.className).toContain('nowo-milkdown-image--w50');
    expect(first!.querySelector('.nowo-milkdown-image__caption')?.textContent).toBe('Cap <b>');
    expect(first!.querySelector('.nowo-milkdown-image__caption b')).toBeNull();
    expect(second!.querySelector('img')!.style.width).toBe('200px');
    expect(second!.querySelector('img')!.getAttribute('style')).toContain('width');
  });

  it('without the feature the attributes are kept but not shown; the title stays a tooltip', async () => {
    handle = await editor('![a](host-file:x "T"){width=50%}', {}, { hostSchemes: schemes });
    const box = handle.root.querySelector<HTMLElement>('.nowo-milkdown-image')!;
    expect(box.className).toBe('nowo-milkdown-image');
    expect(box.querySelector('img')!.title).toBe('T');
    expect(box.querySelector('.nowo-milkdown-image__caption')).toBeNull();
  });

  it('the toolbar edits alt, caption, width and alignment and keeps focus', async () => {
    handle = await editor('![a](/a.png "cap")', { features: ['image_block'] });
    const v = view(handle);
    v.dispatch(v.state.tr.setSelection(NodeSelection.create(v.state.doc, 1)));
    const bar = handle.root.querySelector<HTMLElement>('.nowo-milkdown-image__toolbar')!;
    expect(bar).not.toBeNull();
    const [alt, caption] = bar.querySelectorAll('input');
    expect([alt!.value, caption!.value]).toEqual(['a', 'cap']);
    alt!.value = 'new alt';
    alt!.dispatchEvent(new Event('change'));
    caption!.value = 'new cap';
    caption!.focus();
    caption!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    const groups = bar.querySelectorAll('[role="group"]');
    const pick = (group: Element, name: string) => [...group.querySelectorAll('button')].find((b) => b.textContent === name)!;
    pick(groups[0]!, '50%').click();
    pick(groups[1]!, 'Center').click();
    expect(handle.getMarkdown().trim()).toBe('![new alt](/a.png "new cap"){width=50% align=center}');
    // The same toolbar stays (focus is not lost) and shows the state.
    expect(handle.root.querySelector('.nowo-milkdown-image__toolbar')).toBe(bar);
    expect(pick(groups[0]!, '50%').getAttribute('aria-pressed')).toBe('true');
    pick(groups[0]!, 'Original').click();
    expect(handle.getMarkdown().trim()).toBe('![new alt](/a.png "new cap"){align=center}');
    expect(handle.root.querySelector<HTMLElement>('.nowo-milkdown-image')!.classList.contains('ProseMirror-selectednode')).toBe(true);

    // Escape returns to the text; Tab order is the DOM order.
    const focus = vi.spyOn(v, 'focus');
    alt!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    pick(groups[0]!, '50%').dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    alt!.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', bubbles: true }));
    pick(groups[0]!, '50%').dispatchEvent(new KeyboardEvent('keydown', { key: 'a', bubbles: true }));
    expect(focus).toHaveBeenCalledTimes(2);

    v.dispatch(v.state.tr.setSelection(TextSelection.create(v.state.doc, 0 + 1)));
    expect(handle.root.querySelector('.nowo-milkdown-image__toolbar')).toBeNull();
  });

  it('read-only images have no toolbar', async () => {
    handle = await editor('![a](/a.png)', { features: ['image_block'], readonly: true });
    const v = view(handle);
    v.dispatch(v.state.tr.setSelection(NodeSelection.create(v.state.doc, 1)));
    expect(handle.root.querySelector('.nowo-milkdown-image__toolbar')).toBeNull();
    expect(imageItems(v, { ...defaultRuntime(), features: new Set(['image_block']) })).toEqual([]);
  });

  it('*Edit image…* selects the image and focuses the toolbar', async () => {
    handle = await editor('![a](/a.png)\n\ntext', { features: ['image_block'] });
    const v = view(handle);
    const runtime = { ...defaultRuntime(), features: new Set(['image_block']) };
    v.dispatch(v.state.tr.setSelection(TextSelection.create(v.state.doc, 1)));
    expect(imageAt(v.state)?.node.attrs.src).toBe('/a.png');
    const [item] = imageItems(v, runtime);
    expect(item!.id).toBe('image_edit');
    item!.run!();
    await tick();
    expect(v.state.selection).toBeInstanceOf(NodeSelection);
    expect(document.activeElement).toBe(handle.root.querySelector('.nowo-milkdown-image__toolbar input'));
    expect(imageAt(v.state)?.node.type.name).toBe('image');
    // Not on other blocks, nor without the feature.
    v.dispatch(v.state.tr.setSelection(TextSelection.create(v.state.doc, v.state.doc.content.size - 1)));
    expect(imageAt(v.state)).toBeNull();
    expect(imageItems(v, runtime)).toEqual([]);
    expect(imageItems(v, defaultRuntime())).toEqual([]);
  });
});

/** A fake `IntersectionObserver`: `nearby()` says the given frames came near the viewport. */
class FakeObserver {
  static instances: FakeObserver[] = [];
  observed = new Set<Element>();
  constructor(private readonly callback: IntersectionObserverCallback) {
    FakeObserver.instances.push(this);
  }
  observe(target: Element): void {
    this.observed.add(target);
  }
  unobserve(target: Element): void {
    this.observed.delete(target);
  }
  disconnect(): void {
    this.observed.clear();
  }
  static nearby(targets: Element[], isIntersecting = true): void {
    for (const observer of FakeObserver.instances) {
      observer.callback(targets.map((target) => ({ target, isIntersecting }) as IntersectionObserverEntry), observer as unknown as IntersectionObserver);
    }
  }
}

describe('file views (ME-6)', () => {
  beforeEach(() => {
    FakeObserver.instances = [];
    resetPreviewWatcher();
    vi.stubGlobal('IntersectionObserver', FakeObserver);
  });
  afterEach(() => {
    resetPreviewWatcher();
    vi.unstubAllGlobals();
  });
  const context = { hostSchemes: schemes, previewSandbox: 'allow-downloads', label: (key: 'open' | 'download') => key.toUpperCase() };
  let handle: MilkdownEditorHandle;
  afterEach(async () => {
    await handle?.destroy();
  });

  it('rules like FileCard.php', () => {
    expect(FILE_VIEWS).toEqual(['link', 'icon', 'card', 'preview']);
    expect(fileView({})).toBe('card');
    expect(fileView({ view: 'embed' })).toBe('card');
    expect(fileView({ view: 'icon' })).toBe('icon');
    expect(previewHeight(undefined)).toBe(480);
    expect(previewHeight('10')).toBe(480);
    expect(previewHeight('12px')).toBe(480);
    expect(previewHeight('320')).toBe(320);
  });

  it('link and icon views', () => {
    const link = fileCard('<b>.pdf', { href: 'host-file:x', view: 'link' }, context);
    expect(link.tagName).toBe('P');
    expect(link.dataset.view).toBe('link');
    expect(link.querySelector('a')!.getAttribute('href')).toBe('/f/x');
    expect(link.querySelector('a')!.textContent).toBe('<b>.pdf');
    expect(link.querySelector('b')).toBeNull();
    const icon = fileCard('r.pdf', { href: '/r.pdf', view: 'icon' });
    expect(icon.querySelector('a svg')?.getAttribute('data-glyph')).toBe('file-type-pdf');
    expect(icon.querySelector('.nowo-milkdown-file__name')?.textContent).toBe('r.pdf');
    expect(fileCard('x', { href: 'javascript:alert(1)', view: 'icon' }).querySelector('a')).toBeNull();
  });

  it('each type has its icon, and every icon exists', () => {
    for (const [name, glyphName] of [['a.pdf', 'file-type-pdf'], ['a.docx', 'file-type-doc'], ['a.xlsx', 'file-type-xls'], ['a.csv', 'file-type-csv'], ['a.pptx', 'file-type-ppt'], ['a.txt', 'file-type-txt'], ['a.zip', 'file-zip'], ['a.png', 'photo'], ['a.mp3', 'music'], ['a.mp4', 'movie'], ['a.json', 'file-code'], ['a.bin', 'file']] as const) {
      expect(fileIcon(fileKind(name)), name).toBe(glyphName);
      expect(GLYPHS[glyphName], glyphName).toBeDefined();
    }
  });

  it('a preview is a sandboxed frame with a title, Open and Download', () => {
    const figure = fileCard('a"<.pdf', { href: 'host-file:x', view: 'preview', height: '320' }, context);
    const frame = figure.querySelector('iframe')!;
    expect(frame.hasAttribute('src')).toBe(false);
    FakeObserver.nearby([frame], false);
    expect(frame.hasAttribute('src')).toBe(false);
    FakeObserver.nearby([frame]);
    expect(frame.getAttribute('src')).toBe('/f/x/preview');
    FakeObserver.nearby([frame]);
    expect(frame.title).toBe('a"<.pdf');
    expect(frame.getAttribute('sandbox')).toBe('allow-downloads');
    expect(frame.getAttribute('loading')).toBe('lazy');
    expect(frame.getAttribute('referrerpolicy')).toBe('no-referrer');
    expect(frame.height).toBe('320');
    expect(figure.querySelector('.nowo-milkdown-file__open')?.textContent).toBe('OPEN');
    expect(figure.querySelector('.nowo-milkdown-file__open')?.getAttribute('href')).toBe('/f/x');
    expect(figure.querySelector('.nowo-milkdown-file__download')?.hasAttribute('download')).toBe(true);
    expect(fileCard('a.pdf', { href: 'host-file:x', view: 'preview' }, { ...context, previewSandbox: '' }).querySelector('iframe')!.getAttribute('sandbox')).toBe('');
  });

  it('no preview without a host preview: the card', () => {
    for (const attributes of [{ href: '/plain.pdf', view: 'preview' }, { href: 'bare:x', view: 'preview' }, { href: 'host-file:..', view: 'preview' }]) {
      const card = fileCard('a.pdf', attributes, context);
      expect(card.querySelector('iframe')).toBeNull();
      expect(card.dataset.view).toBe('preview');
    }
    expect(fileCard('a.pdf', { href: 'host-file:..' }, context).querySelector('a')).toBeNull();
  });

  it('stores the view in the dialect; the menus are radio items', async () => {
    handle = await editor('::file[a.pdf]{href="host-file:x"}\n\ntext', { features: ['file_cards'], messages: { 'file.view.preview': 'Vista' } }, { hostSchemes: schemes });
    const v = view(handle);
    const runtime = { ...defaultRuntime() };
    v.dispatch(v.state.tr.setSelection(NodeSelection.create(v.state.doc, 0)));
    expect(fileAt(v.state)?.node.attrs.name).toBe('file');
    const run = (command: ReturnType<typeof setFileView>): void => {
      command(v.state, v.dispatch);
    };
    const items = fileViewItems(v.state, runtime, run);
    expect(items.map((i) => i.id)).toEqual(['file_view']);
    expect(items[0]!.items!.map((i) => [i.id, i.checked])).toEqual([
      ['file_view_link', false],
      ['file_view_icon', false],
      ['file_view_card', true],
      ['file_view_preview', false],
    ]);
    items[0]!.items![3]!.run!();
    expect(handle.getMarkdown()).toContain('view="preview"');
    const shown = handle.root.querySelector('iframe')!;
    FakeObserver.nearby([shown]);
    expect(shown.getAttribute('src')).toBe('/f/x/preview');

    v.dispatch(v.state.tr.setSelection(NodeSelection.create(v.state.doc, 0)));
    const withHeight = fileViewItems(v.state, runtime, run);
    expect(withHeight.map((i) => i.id)).toEqual(['file_view', 'file_height']);
    expect(withHeight[1]!.items!.map((i) => i.checked)).toEqual([false, true, false]);
    withHeight[1]!.items![2]!.run!();
    expect(handle.getMarkdown()).toContain('height="720"');

    v.dispatch(v.state.tr.setSelection(NodeSelection.create(v.state.doc, 0)));
    run(setFileView('icon'));
    expect(handle.getMarkdown()).toContain('view="icon"');
    expect(handle.getMarkdown()).not.toContain('height=');
    v.dispatch(v.state.tr.setSelection(NodeSelection.create(v.state.doc, 0)));
    run(setFileView('card'));
    expect(handle.getMarkdown().split('\n')[0]).toBe('::file[a.pdf]{href="host-file:x"}');

    // Nothing to do elsewhere.
    v.dispatch(v.state.tr.setSelection(TextSelection.create(v.state.doc, v.state.doc.content.size - 1)));
    expect(fileAt(v.state)).toBeNull();
    expect(fileViewItems(v.state, runtime, run)).toEqual([]);
    expect(setFileAttributes({ view: 'link' })(v.state)).toBe(false);
  });

  it('an upload keeps the host reference and the chosen view', async () => {
    handle = await editor('x', { features: ['file_cards'] }, { hostSchemes: schemes });
    const v = view(handle);
    const result = { url: 'host-file:abc', name: 'a.pdf', size: 4, type: 'application/pdf', kind: 'file' as const, alt: 'a' };
    const node = resultNode(v.state.schema, result, true, 'preview', schemes)!;
    expect(JSON.parse(node.attrs.attributes as string)).toMatchObject({ href: 'host-file:abc', view: 'preview', size: '4' });
    expect(JSON.parse(resultNode(v.state.schema, result, true, 'card', schemes)!.attrs.attributes as string).view).toBeUndefined();
    expect(JSON.parse(resultNode(v.state.schema, result, true, 'evil', schemes)!.attrs.attributes as string).view).toBeUndefined();
    expect(resultNode(v.state.schema, { ...result, kind: 'image' }, true, 'card', schemes)!.attrs.src).toBe('host-file:abc');
  });

  it('many previews: no request until near the viewport, and a cap per editor (audit GX-L1)', async () => {
    const cards = Array.from({ length: 600 }, (_, i) => `::file[f${i}.csv]{href="host-file:f${i}" view="preview"}`).join('\n\n');
    handle = await editor(cards, { features: ['file_cards'], readonly: true }, { hostSchemes: schemes, maxPreviews: 50 });
    const frames = [...handle.root.querySelectorAll('iframe')];
    expect(frames).toHaveLength(50);
    expect(frames.filter((f) => f.hasAttribute('src'))).toHaveLength(0);
    expect(handle.root.querySelectorAll('.nowo-milkdown-file')).toHaveLength(600);
    FakeObserver.nearby(frames.slice(0, 3));
    expect(frames.filter((f) => f.hasAttribute('src'))).toHaveLength(3);
    // The same file again takes no new place, and redrawing keeps its place.
    await handle.destroy();
    handle = await editor('::file[a]{href="host-file:a" view="preview"}\n\n::file[a]{href="host-file:a" view="preview"}\n\n::file[b]{href="host-file:b" view="preview"}', { features: ['file_cards'] }, { hostSchemes: schemes, maxPreviews: 1 });
    expect(handle.root.querySelectorAll('iframe')).toHaveLength(2);
  });

  it('without IntersectionObserver a preview stays empty, under Open', () => {
    resetPreviewWatcher();
    vi.unstubAllGlobals();
    const figure = fileCard('a.pdf', { href: 'host-file:x', view: 'preview' }, context);
    expect(figure.querySelector('iframe')!.hasAttribute('src')).toBe(false);
    expect(figure.querySelector('.nowo-milkdown-file__open')).not.toBeNull();
  });

  it('host links open through the template and keep the reference (audit GX-I4)', async () => {
    handle = await editor('[doc](host-file:y) [bad](host-file:..) [plain](/p)', { features: ['markdown_clipboard'] }, { hostSchemes: schemes });
    const links = [...handle.root.querySelectorAll<HTMLAnchorElement>('.ProseMirror a')];
    expect(links[0]!.getAttribute('href')).toBe('/f/y');
    expect(links[0]!.dataset.nowoHostRef).toBe('host-file:y');
    expect(links[1]!.hasAttribute('href')).toBe(false);
    expect(links[2]!.getAttribute('href')).toBe('/p');
    expect(handle.getMarkdown()).toContain('[doc](host-file:y)');
    // Paste as Markdown goes through the DOM round trip.
    const v = view(handle);
    v.dispatch(v.state.tr.setSelection(TextSelection.atEnd(v.state.doc)));
    handle.builder.editor.action((ctx) => insertMarkdown(v, markdownIo(ctx), ' [new](host-file:z) [evil](javascript:alert)'));
    expect(handle.getMarkdown()).toContain('[new](host-file:z)');
    expect(handle.getMarkdown()).not.toContain('javascript:');
    // A forged reference of another scheme is not one.
    const anchor = document.createElement('div');
    anchor.innerHTML = '<a data-nowo-host-ref="other:x" href="/safe">x</a>';
    const parsed = PmDOMParser.fromSchema(v.state.schema).parse(anchor);
    expect(parsed.firstChild!.firstChild!.marks[0]!.attrs.href).toBe('/safe');
    expect(cleanPasted(Slice.empty, schemes)).toEqual(Slice.empty);
  });

  it('without labels the actions are in English', () => {
    const figure = fileCard('a.pdf', { href: 'host-file:x', view: 'preview' }, { hostSchemes: schemes, previewSandbox: '' });
    expect(figure.querySelector('.nowo-milkdown-file__open')?.textContent).toBe('Open');
    expect(figure.querySelector('.nowo-milkdown-file__download')?.textContent).toBe('Download');
  });

  it('the block and context menus offer the view of the file; a host link opens through its template', async () => {
    handle = await editor('::file[a.pdf]{href="host-file:x"}\n\n![i](/a.png)\n\n[doc](host-file:y)', { features: ['file_cards', 'image_block', 'context_menu', 'block_actions'] }, { hostSchemes: schemes });
    const v = view(handle);
    const menuIds = (): string[] => [...handle.root.querySelectorAll<HTMLElement>('.nowo-milkdown-menu:not([hidden]) [data-id]')].map((b) => b.dataset.id!);
    const rightClick = (): void => {
      v.dom.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true, clientX: 1, clientY: 1 }));
    };
    const at = (name: string, offset = 0): number => {
      let found = -1;
      v.state.doc.descendants((node, pos) => {
        if (found < 0 && (node.type.name === name || node.text === name)) found = pos + offset;
      });
      return found;
    };
    // The pointer is on the node: the file card or the image gets selected, wherever the caret was.
    const under = (pos: number, inside: number): void => {
      vi.spyOn(v, 'posAtCoords').mockReturnValue({ pos, inside });
    };
    v.dispatch(v.state.tr.setSelection(TextSelection.create(v.state.doc, at('doc', 1))));
    under(at('leafDirective'), at('leafDirective'));
    rightClick();
    expect(v.state.selection).toBeInstanceOf(NodeSelection);
    expect(menuIds()).toContain('file_view');
    v.dispatch(v.state.tr.setSelection(TextSelection.create(v.state.doc, at('doc', 1))));
    under(at('image'), at('image'));
    rightClick();
    expect(v.state.selection).toBeInstanceOf(NodeSelection);
    expect(menuIds()).toContain('image_edit');
    v.dispatch(v.state.tr.setSelection(TextSelection.create(v.state.doc, at('doc', 1))));
    under(at('doc', 1), -1);
    rightClick();
    const open = vi.fn();
    vi.stubGlobal('open', open);
    [...handle.root.querySelectorAll<HTMLElement>('[data-id="link_open"]')].pop()!.click();
    expect(open).toHaveBeenCalledWith('/f/y', '_blank', 'noopener,noreferrer');
    vi.unstubAllGlobals();
  });

  it('the block button selects a file card, so its menu offers the view', async () => {
    handle = await editor('::file[a.pdf]{href="/a.pdf"}\n\ntext', { features: ['file_cards', 'block_actions'] });
    const v = view(handle);
    const button = handle.root.querySelector<HTMLButtonElement>('.nowo-milkdown-block-handle')!;
    v.dispatch(v.state.tr.setSelection(TextSelection.create(v.state.doc, v.state.doc.content.size - 1)));
    v.focus();
    v.dom.querySelector('[data-leaf-directive="file"]')!.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
    v.dom.querySelector('[data-leaf-directive="file"]')!.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
    button.click();
    expect(v.state.selection).toBeInstanceOf(NodeSelection);
    expect((v.state.selection as NodeSelection).node.attrs.name).toBe('file');
  });

  it('/file variants pick files in that view', async () => {
    const inputs: HTMLInputElement[] = [];
    const click = vi.spyOn(HTMLInputElement.prototype, 'click').mockImplementation(function (this: HTMLInputElement) {
      inputs.push(this);
    });
    handle = await editor('', { features: ['slash_menu', 'file_cards'], upload: { url: '/u', csrfToken: '', maxSize: 0, accept: [] } }, { hostSchemes: schemes });
    expect(handle.options.upload?.hostSchemes).toEqual(handle.options.hostSchemes);
    const v = view(handle);
    v.focus();
    v.dispatch(v.state.tr.insertText('/preview'));
    await tick(200);
    expect([...document.querySelectorAll('[role="option"]')].some((o) => o.textContent?.includes('File with preview…'))).toBe(true);
    keydown(v.dom, 'Enter');
    expect(inputs).toHaveLength(1);
    click.mockRestore();
  });

  it('/file variants need file_cards', async () => {
    const upload = { url: '/u', csrfToken: '', maxSize: 0, accept: [] };
    handle = await editor('', { features: ['slash_menu', 'file_cards'], upload });
    const { slashItems } = await import('../src/triggers');
    let ids: string[] = [];
    handle.builder.editor.action((ctx) => {
      ids = slashItems(ctx, handle.options, { ...defaultRuntime(), pickFiles: () => undefined }).map((b) => b.item.id);
    });
    expect(ids).toEqual(expect.arrayContaining(['file', 'file_link', 'file_icon', 'file_preview']));
    handle.builder.editor.action((ctx) => {
      ids = slashItems(ctx, { ...handle.options, features: ['slash_menu'] }, { ...defaultRuntime(), pickFiles: () => undefined }).map((b) => b.item.id);
    });
    expect(ids).toContain('file');
    expect(ids).not.toContain('file_preview');
  });
});

describe('insert button', () => {
  let handle: MilkdownEditorHandle;
  afterEach(async () => {
    await handle?.destroy();
  });

  it('shows beside the empty line only and types /', async () => {
    handle = await editor('text\n\n', { features: ['insert_button', 'slash_menu'] });
    const v = view(handle);
    const button = handle.root.querySelector<HTMLButtonElement>('.nowo-milkdown-insert-button')!;
    expect(button.hidden).toBe(true);
    expect(button.tabIndex).toBe(-1);
    expect(button.getAttribute('aria-label')).toBe('Insert a block');
    v.dispatch(v.state.tr.insert(v.state.doc.content.size, v.state.schema.nodes.paragraph!.create()));
    const end = v.state.doc.content.size - 1;
    v.dispatch(v.state.tr.setSelection(TextSelection.create(v.state.doc, end)));
    expect(emptyLine(v)).toBe(end - 1);
    vi.spyOn(v, 'hasFocus').mockReturnValue(true);
    v.dom.dispatchEvent(new FocusEvent('focus'));
    expect(button.hidden).toBe(false);
    expect(button.style.top).toMatch(/px$/);
    const down = new MouseEvent('mousedown', { cancelable: true });
    button.dispatchEvent(down);
    expect(down.defaultPrevented).toBe(true);
    button.click();
    expect(v.state.doc.lastChild!.textContent).toBe('/');
    expect(button.hidden).toBe(true);
    // Elsewhere: nothing.
    v.dispatch(v.state.tr.setSelection(TextSelection.create(v.state.doc, 2)));
    expect(emptyLine(v)).toBeNull();
    button.click();
    expect(v.state.doc.textContent.startsWith('text')).toBe(true);
    vi.restoreAllMocks();
    v.dom.dispatchEvent(new FocusEvent('blur'));
    expect(button.hidden).toBe(true);
  });

  it('is not there on read-only editors nor without the feature; destroy removes it', async () => {
    handle = await editor('', { features: ['insert_button'], readonly: true });
    expect(handle.root.querySelector('.nowo-milkdown-insert-button')).toBeNull();
    await handle.destroy();
    handle = await editor('', {});
    expect(handle.root.querySelector('.nowo-milkdown-insert-button')).toBeNull();
    await handle.destroy();
    handle = await editor('', { features: ['insert_button'] });
    const v = view(handle);
    const plugin = new InsertButtonView(v, defaultRuntime());
    expect(plugin.button.isConnected).toBe(true);
    plugin.destroy();
    expect(plugin.button.isConnected).toBe(false);
  });
});
