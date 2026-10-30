import { afterEach, describe, expect, it, vi } from 'vitest';
import { mermaidLoader, parseSvg, renderMermaid, resetMermaid, withStyleNonce } from '../src/preview/mermaid';
import { KATEX_OPTIONS, katexLoader, renderRichContent } from '../src/preview/render';
import { codeMirrorConfig } from '../src/features/code';
import { defaultRuntime } from '../src/runtime';
import { tick } from './helpers';

const SVG = '<svg xmlns="http://www.w3.org/2000/svg" onload="x()"><style>.a{}</style><script>bad()</script><foreignObject></foreignObject><g onclick="y()"><text>A</text></g></svg>';

afterEach(() => {
  resetMermaid();
  vi.restoreAllMocks();
});

describe('mermaid', () => {
  it('stamps script-created styles with the nonce only while rendering', async () => {
    const seen = await withStyleNonce('n1', async () => [document.createElement('style'), document.createElementNS('http://www.w3.org/2000/svg', 'style'), document.createElement('div')]);
    expect(seen.map((el) => el.getAttribute('nonce'))).toEqual(['n1', 'n1', null]);
    expect(document.createElement('style').getAttribute('nonce')).toBeNull();
    expect(await withStyleNonce('', async () => 1)).toBe(1);
    const parsed = await withStyleNonce('n1', async () => new DOMParser().parseFromString('<p><style>b{}</style></p>', 'text/html'));
    expect(parsed.querySelector('style')).toBeNull();
    expect(parsed.querySelector('g[data-nowo-style]')).not.toBeNull();
    expect(new DOMParser().parseFromString('<p><style>b{}</style></p>', 'text/html').querySelector('style')).not.toBeNull();
  });

  it('parses the SVG without scripts, handlers or foreign objects', () => {
    const svg = parseSvg(SVG, 'n', 'Diagram');
    expect(svg.getAttribute('role')).toBe('img');
    expect(svg.getAttribute('aria-label')).toBe('Diagram');
    expect(svg.querySelector('script, foreignObject')).toBeNull();
    expect(svg.hasAttribute('onload')).toBe(false);
    expect(svg.querySelector('g')?.hasAttribute('onclick')).toBe(false);
    expect(svg.querySelector('style')?.getAttribute('nonce')).toBe('n');
    expect(svg.querySelector('style')?.textContent).toBe('.a{}');
    expect(svg.querySelector('[data-nowo-style]')).toBeNull();
    expect(parseSvg(SVG, '', 'D').querySelector('style, [data-nowo-style]')).toBeNull();
    expect(parseSvg('<svg xmlns="http://www.w3.org/2000/svg"><g data-nowo-style="99999"></g></svg>', 'n', 'D').querySelector('g')).toBeNull();
    expect(() => parseSvg('<div xmlns="http://www.w3.org/1999/xhtml"></div>', '', 'D')).toThrow('not an SVG');
  });

  it('renders with strict security and no HTML labels, loading Mermaid once', async () => {
    const initialize = vi.fn();
    const load = vi.spyOn(mermaidLoader, 'load').mockResolvedValue({ initialize, render: async () => ({ svg: SVG }) });
    const svg = await renderMermaid('graph TD', 'n', true, 'D');
    await renderMermaid('graph TD', 'n', false, 'D');
    expect(svg.localName).toBe('svg');
    expect(load).toHaveBeenCalledTimes(1);
    expect(initialize.mock.calls[0]![0]).toMatchObject({ securityLevel: 'strict', htmlLabels: false, theme: 'dark', startOnLoad: false });
    expect(initialize.mock.calls[1]![0]).toMatchObject({ theme: 'neutral' });
  });

  it('the code block preview renders Mermaid only', async () => {
    vi.spyOn(mermaidLoader, 'load').mockResolvedValue({ initialize: () => undefined, render: async (_id, text) => (text === 'bad' ? Promise.reject(new Error('Parse error')) : { svg: SVG }) });
    const config = codeMirrorConfig({ ...defaultRuntime(), nonce: 'n' }, true);
    expect(config.extensions).toHaveLength(3);
    expect(config.renderPreview('js', 'x', () => undefined)).toBeNull();
    expect(config.renderPreview('mermaid', '  ', () => undefined)).toBeNull();
    expect(codeMirrorConfig(defaultRuntime(), false).renderPreview('mermaid', 'graph', () => undefined)).toBeNull();
    const applied: (string | HTMLElement | null)[] = [];
    expect(config.renderPreview('Mermaid', 'graph', (v) => applied.push(v))).toBeUndefined();
    config.renderPreview('mermaid', 'bad', (v) => applied.push(v));
    await tick(5);
    expect((applied[0] as HTMLElement).querySelector('svg')).not.toBeNull();
    expect((applied[1] as HTMLElement).textContent).toBe('Parse error');
    vi.spyOn(mermaidLoader, 'load').mockResolvedValue({ initialize: () => undefined, render: () => Promise.reject('plain') });
    resetMermaid();
    config.renderPreview('mermaid', 'x', (v) => applied.push(v));
    await tick(5);
    expect((applied[2] as HTMLElement).textContent).toBe('plain');
  });
});

describe('renderRichContent', () => {
  it('replaces Mermaid blocks and renders math with safe KaTeX options', async () => {
    vi.spyOn(mermaidLoader, 'load').mockResolvedValue({ initialize: () => undefined, render: async (_id, text) => (text === 'bad' ? Promise.reject(new Error('x')) : { svg: SVG }) });
    const render = vi.fn((tex: string, el: HTMLElement, _options: Record<string, unknown>) => {
      el.textContent = `K(${tex})`;
    });
    vi.spyOn(katexLoader, 'load').mockResolvedValue({ render });
    const root = document.createElement('div');
    root.innerHTML = '<pre><code class="language-mermaid">graph</code></pre><pre><code class="language-mermaid">bad</code></pre><span data-math="inline">a</span><div data-math="block">b</div>';
    await renderRichContent(root, { nonce: 'n', dark: true, diagramLabel: 'D' });
    expect(root.querySelector('figure.nowo-md-mermaid svg')?.getAttribute('aria-label')).toBe('D');
    expect(root.querySelector('pre.nowo-md-mermaid--error')).not.toBeNull();
    expect(root.querySelector('[data-math="inline"]')?.textContent).toBe('K(a)');
    expect(render.mock.calls[1]![2]).toMatchObject({ ...KATEX_OPTIONS, displayMode: true, trust: false });
    await renderRichContent(root);
    expect(render).toHaveBeenCalledTimes(2);
  });

  it('the real loaders return modules', async () => {
    const katex = await katexLoader.load();
    expect(typeof katex.render).toBe('function');
  });
});
