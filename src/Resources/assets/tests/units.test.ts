import { describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { DEFAULT_MESSAGES, translate } from '../src/i18n';
import { DEFAULT_FEATURES, normaliseFeatures, parseOptions } from '../src/options';
import { createPageResolver, safeUrl } from '../src/link-titles';
import { CONTROL_NAMES, editableAttributes, nameControls, watchControls } from '../src/plugins/a11y';
import { defaultRuntime, iconSvg } from '../src/runtime';
import { calloutType, cleanAttributes, decodeAttributes, encodeAttributes, markColor, alignment, isDirectiveName } from '../src/dialect/directives';
import { tick } from './helpers';

describe('i18n', () => {
  it('replaces placeholders and falls back to English, then to the key', () => {
    expect(translate({}, 'suggest.count', { count: 3 })).toBe('3 results');
    expect(translate({ 'suggest.count': '{count} resultados' }, 'suggest.count', { count: 2 })).toBe('2 resultados');
    expect(translate({}, 'upload.uploading', { name: 'a' })).toBe('Uploading a… {percent}%');
    expect(translate({}, 'nope')).toBe('nope');
  });

  it('has exactly the keys of the PHP catalogue', () => {
    const yaml = readFileSync(resolve(process.cwd(), 'src/Resources/translations/NowoMilkdownEditorBundle.en.yaml'), 'utf8');
    const keys = yaml.split('\n').filter((l) => /^[a-z]/.test(l)).map((l) => l.slice(0, l.indexOf(':')));
    expect(Object.keys(DEFAULT_MESSAGES).sort()).toEqual(keys.sort());
    for (const line of yaml.split('\n').filter((l) => /^[a-z]/.test(l))) {
      const key = line.slice(0, line.indexOf(':'));
      expect(JSON.parse(line.slice(line.indexOf(':') + 2))).toBe(DEFAULT_MESSAGES[key]);
    }
  });
});

describe('options', () => {
  it('parses and validates the widget JSON', () => {
    const o = parseOptions(JSON.stringify({
      features: ['toolbar', 'math', 'nope'],
      theme: 'pink',
      minHeight: '10%',
      suggestions: { '@': '/u', '#': '/x', '[[': '' },
      icons: ['bug', 'Bad', 3],
      upload: { url: '/up', csrfToken: 't', maxSize: -1, accept: ['image/*', 1] },
      collaboration: { url: '/c', hubUrl: '/h', topic: 't', user: { name: 'Ada', color: 'red' } },
      messages: { a: 'b', c: 1 },
      readonly: true,
    }));
    expect(o.features).toEqual(['toolbar']);
    expect(o.theme).toBe('auto');
    expect(o.minHeight).toBe('12rem');
    expect(o.suggestions).toEqual({ '@': '/u' });
    expect(o.icons).toEqual(['bug']);
    expect(o.upload).toEqual({ url: '/up', csrfToken: 't', maxSize: 0, accept: ['image/*'] });
    expect(o.collaboration).toEqual({ url: '/c', hubUrl: '/h', topic: 't', user: { name: 'Ada', color: '#1f6f54' } });
    expect(o.messages).toEqual({ a: 'b' });
    expect(o.readonly).toBe(true);
  });

  it('defaults for broken or missing JSON', () => {
    const o = parseOptions('{oops');
    expect(o.features).toEqual(DEFAULT_FEATURES);
    expect(o.upload).toBeNull();
    expect(o.collaboration).toBeNull();
    expect(parseOptions(undefined).theme).toBe('auto');
    expect(parseOptions('[1]').features).toEqual(DEFAULT_FEATURES);
    expect(parseOptions(JSON.stringify({ collaboration: { url: '/c', hubUrl: '/h', topic: 't' }, theme: 'dark', minHeight: '3.5rem' })).collaboration?.user.name).toBe('Anonymous');
    expect(normaliseFeatures(['code_mirror', 'mermaid', 'math'])).toEqual(['code_mirror', 'math', 'mermaid']);
  });
});

describe('link titles', () => {
  it('batches ids of one tick, keeps safe URLs, hides missing and failed ids', async () => {
    const fetchMock = vi.fn(async (_url: string) => new Response(JSON.stringify([{ id: 'a', title: 'A', url: 'javascript:x', visible: true }, { id: 'b', title: 'B', url: '/b', visible: false }])));
    const r = createPageResolver('/t?x=1', fetchMock as unknown as typeof fetch);
    const [a, b, c] = await Promise.all([r.resolve('a'), r.resolve('b'), r.resolve('c'), r.resolve('a')]);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0]![0]).toBe('/t?x=1&ids=a%2Cb%2Cc');
    expect(a).toEqual({ id: 'a', title: 'A', url: '', visible: true });
    expect(b.visible).toBe(false);
    expect(c.visible).toBe(false);
    r.remember({ id: 'd', title: 'D', url: '/d', visible: true });
    expect((await r.resolve('d')).title).toBe('D');

    const failing = createPageResolver('/t', (async () => {
      throw new Error('net');
    }) as unknown as typeof fetch);
    expect((await failing.resolve('x')).visible).toBe(false);
    const notOk = createPageResolver('/t', (async () => new Response('', { status: 500 })) as unknown as typeof fetch);
    expect((await notOk.resolve('x')).visible).toBe(false);
    expect((await createPageResolver(null).resolve('x')).visible).toBe(false);
    const many = vi.fn(async () => new Response('{}'));
    const big = createPageResolver('/t', many as unknown as typeof fetch);
    await Promise.all(Array.from({ length: 60 }, (_, i) => big.resolve(`id${i}`)));
    expect(many).toHaveBeenCalledTimes(2);
  });

  it('safeUrl keeps relative and http(s) only', () => {
    expect(safeUrl('/a')).toBe('/a');
    expect(safeUrl('#x')).toBe('#x');
    expect(safeUrl('https://x.example/a')).toBe('https://x.example/a');
    expect(safeUrl('javascript:alert(1)')).toBe('');
    expect(safeUrl('data:text/html,x')).toBe('');
    expect(safeUrl('page/sub')).toBe('page/sub');
    expect(safeUrl(5)).toBe('');
    expect(safeUrl('')).toBe('');
    expect(safeUrl('not a url:x')).toBe('');
    expect(safeUrl('//evil.example')).toBe('');
    expect(safeUrl('/\\evil.example')).toBe('');
    expect(safeUrl('../up')).toBe('../up');
  });
});

describe('a11y helpers', () => {
  it('names Crepe controls and unnamed buttons, also when added later', async () => {
    const root = document.createElement('div');
    root.innerHTML = '<div data-role="x-line-drag-handle"><button class="add-button"></button></div><div data-role="col-drag-handle"></div><button></button><button aria-label="Named"></button><span class="copy-button"></span><button class="language-button">mermaid</button>';
    const runtime = { ...defaultRuntime(), messages: { 'table.add_column': 'Añadir columna' } };
    expect(nameControls(root, runtime)).toBe(4);
    expect(root.querySelector('.add-button')?.getAttribute('aria-label')).toBe('Añadir columna');
    expect(root.querySelector('[data-role="col-drag-handle"]')?.getAttribute('role')).toBe('button');
    expect(root.querySelector('.copy-button')?.getAttribute('aria-label')).toBe('Copy code');
    expect(root.querySelectorAll('button')[1]?.getAttribute('aria-label')).toBe('Editor action');
    expect(root.querySelector('.language-button')?.hasAttribute('aria-label')).toBe(false);
    const stop = watchControls(root, runtime);
    root.append(document.createElement('button'));
    root.append(document.createElement('span'));
    await tick(0);
    expect(root.lastElementChild?.previousElementSibling?.getAttribute('aria-label')).toBe('Editor action');
    stop();
    expect(CONTROL_NAMES.length).toBeGreaterThan(5);
  });

  it('editable attributes', () => {
    expect(editableAttributes('Body', null, false)).toEqual({ role: 'textbox', 'aria-multiline': 'true', 'aria-label': 'Body' });
    expect(editableAttributes('Body', 'l', true)).toEqual({ role: 'textbox', 'aria-multiline': 'true', 'aria-labelledby': 'l', 'aria-readonly': 'true' });
  });

  it('icon SVGs only for allowlisted names with a sprite', () => {
    expect(iconSvg(defaultRuntime(), 'bug')).toBeNull();
    const svg = iconSvg({ ...defaultRuntime(), spriteUrl: '/s.svg', icons: new Set(['bug']) }, 'bug')!;
    expect(svg.getAttribute('aria-hidden')).toBe('true');
    expect(svg.querySelector('use')?.getAttribute('href')).toBe('/s.svg#tabler-bug');
    expect(iconSvg({ ...defaultRuntime(), spriteUrl: '/s.svg', icons: new Set(['bug']) }, 'x')).toBeNull();
  });
});

describe('directive helpers', () => {
  it('cleans, encodes and reads attributes', () => {
    expect(cleanAttributes(null)).toEqual({});
    expect(cleanAttributes({ type: 'x', 'Bad key': 'y', n: null, num: 3 })).toEqual({ type: 'x', num: '3' });
    expect(Object.keys(cleanAttributes(Object.fromEntries(Array.from({ length: 30 }, (_, i) => [`k${i}`, 'v'])))).length).toBe(20);
    expect(encodeAttributes({ b: '1', a: '2' })).toBe('{"a":"2","b":"1"}');
    expect(decodeAttributes('{"a":"2"}')).toEqual({ a: '2' });
    expect(decodeAttributes('{oops')).toEqual({});
    expect(decodeAttributes(3)).toEqual({});
    expect(decodeAttributes('')).toEqual({});
    expect(calloutType({ type: 'danger' })).toBe('danger');
    expect(calloutType({ type: 'x' })).toBe('info');
    expect(markColor({ color: 'blue' })).toBe('blue');
    expect(markColor({})).toBe('yellow');
    expect(alignment({ align: 'right' })).toBe('right');
    expect(alignment({})).toBe('left');
    expect(isDirectiveName('callout')).toBe(true);
    expect(isDirectiveName('Call out')).toBe(false);
  });
});

describe('published assets', () => {
  it('links a stylesheet once, relative to the module, with the nonce', async () => {
    const { ensureStylesheet, setAssetBase } = await import('../src/assets');
    setAssetBase('https://app.example/bundles/nowomilkdowneditor/');
    const link = ensureStylesheet('katex/katex.min.css', 'n1');
    expect(link.href).toBe('https://app.example/bundles/nowomilkdowneditor/katex/katex.min.css');
    expect(link.nonce).toBe('n1');
    expect(ensureStylesheet('katex/katex.min.css')).toBe(link);
    setAssetBase('');
    expect(ensureStylesheet('x.css').href).toContain('x.css');
  });
});
