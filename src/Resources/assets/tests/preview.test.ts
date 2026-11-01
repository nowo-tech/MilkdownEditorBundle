import { afterEach, describe, expect, it, vi } from 'vitest';
import { isLocalResource, mermaidLoader, parseSvg, renderMermaid, resetMermaid, withStyleNonce } from '../src/preview/mermaid';
import { KATEX_OPTIONS, MAX_TEX_DEPTH, MAX_TEX_LENGTH, katexLoader, renderRichContent, texWithinLimits } from '../src/preview/render';
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

  // Appendix CE L1: the auditor's PoC `A@{ img: "https://evil.test/…" }` becomes an SVG <image href>.
  const REMOTE = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <image id="i1" href="https://evil.test/mermaid-img-shape.png"/>
    <image id="i2" xlink:href="//evil.test/p.png"/>
    <use id="u1" href="https://evil.test/sprite.svg#a"/>
    <filter><feImage id="f1" href="http://evil.test/f.png"/></filter>
    <pattern id="p1" href="&#9; //evil.test/p"/>
    <image id="ok1" href="data:image/png;base64,AA"/>
    <image id="bad1" href="data:image/svg+xml,&lt;svg/&gt;"/>
    <use id="ok2" href="#shape"/>
    <image id="ok3" href="/local.png"/>
    <g id="s1" style="fill:url(https://evil.test/x.png)"/>
    <g id="s2" style="fill:url(#grad)"/>
    <a id="a1" href="https://example.test/"/>
  </svg>`;

  it('drops resource URLs on other origins unless remote images are allowed', () => {
    const svg = parseSvg(REMOTE, '', 'D');
    const href = (id: string): string | null => svg.querySelector(`#${id}`)!.getAttribute('href') ?? svg.querySelector(`#${id}`)!.getAttributeNS('http://www.w3.org/1999/xlink', 'href');
    for (const id of ['i1', 'i2', 'u1', 'f1', 'p1', 'bad1']) expect(href(id)).toBeNull();
    expect(href('ok1')).toBe('data:image/png;base64,AA');
    expect(href('ok2')).toBe('#shape');
    expect(href('ok3')).toBe('/local.png');
    expect(svg.querySelector('#s1')!.hasAttribute('style')).toBe(false);
    expect(svg.querySelector('#s2')!.getAttribute('style')).toBe('fill:url(#grad)');
    expect(href('a1')).toBe('https://example.test/');
    const allowed = parseSvg(REMOTE, '', 'D', true);
    expect(allowed.querySelector('#i1')!.getAttribute('href')).toBe('https://evil.test/mermaid-img-shape.png');
    expect(isLocalResource('')).toBe(true);
    expect(isLocalResource('http://[bad')).toBe(false);
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

  // Appendix CE L2: `{`×6000 overflowed KaTeX's stack (RangeError) and stopped every later formula.
  it('one failing or oversized formula does not stop the others', async () => {
    const render = vi.fn((tex: string, el: HTMLElement) => {
      if (tex === 'boom') throw new RangeError('Maximum call stack size exceeded');
      el.textContent = `K(${tex})`;
    });
    vi.spyOn(katexLoader, 'load').mockResolvedValue({ render });
    const root = document.createElement('div');
    const deep = `${'{'.repeat(6000)}x${'}'.repeat(6000)}`;
    root.innerHTML = `<span data-math="inline">boom</span><span data-math="inline"></span><span data-math="inline">x^2</span>`;
    root.children[1]!.textContent = deep;
    await expect(renderRichContent(root)).resolves.toBeUndefined();
    const [boom, nested, ok] = [...root.children] as HTMLElement[];
    expect(boom!.dataset.mathError).toBe('true');
    expect(boom!.textContent).toBe('boom');
    expect(nested!.dataset.mathError).toBe('true');
    expect(nested!.textContent).toBe(deep);
    expect(ok!.textContent).toBe('K(x^2)');
    expect(ok!.dataset.mathError).toBeUndefined();
    expect(render).toHaveBeenCalledTimes(2); // the nested formula never reaches KaTeX
  });

  it('bounds TeX length and brace depth', () => {
    expect(texWithinLimits('x'.repeat(MAX_TEX_LENGTH))).toBe(true);
    expect(texWithinLimits('x'.repeat(MAX_TEX_LENGTH + 1))).toBe(false);
    expect(texWithinLimits('{'.repeat(MAX_TEX_DEPTH) + '}'.repeat(MAX_TEX_DEPTH))).toBe(true);
    expect(texWithinLimits('{'.repeat(MAX_TEX_DEPTH + 1))).toBe(false);
    expect(texWithinLimits('}}{x}'.repeat(300))).toBe(true);
  });

  it('the real loaders return modules', async () => {
    const katex = await katexLoader.load();
    expect(typeof katex.render).toBe('function');
  });
});
