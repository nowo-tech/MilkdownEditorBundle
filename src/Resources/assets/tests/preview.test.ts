import { afterEach, describe, expect, it, vi } from 'vitest';
import { MERMAID_CSS_KEYS, decodeCss, isLocalResource, mermaidLoader, parseSvg, renderMermaid, resetMermaid, sanitizeCss, stripImageShapes, stripStyleUrls, withStyleNonce } from '../src/preview/mermaid';
import { KATEX_OPTIONS, MAX_TEX_DEPTH, MAX_TEX_EXPAND, MAX_TEX_LENGTH, MAX_TEX_SCRIPTS, guardKatex, safeKatexOptions, katexLoader, renderRichContent, texWithinLimits, type Katex } from '../src/preview/render';
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
    expect(svg.querySelector('#s1')!.getAttribute('style')).toBe('fill:none');
    expect(svg.querySelector('#s2')!.getAttribute('style')).toBe('fill:url(#grad)');
    expect(href('a1')).toBe('https://example.test/');
    const allowed = parseSvg(REMOTE, '', 'D', true);
    expect(allowed.querySelector('#i1')!.getAttribute('href')).toBe('https://evil.test/mermaid-img-shape.png');
    expect(isLocalResource('')).toBe(true);
    expect(isLocalResource('http://[bad')).toBe(false);
  });

  // Re-verification L1: the auditor's URL spellings (bisect R1–R8) are all treated as remote.
  it.each([
    'https://evil.test/R1.png',
    '//evil.test/R2.png',
    '\\\\evil.test/R3.png',
    '/\\evil.test/R4.png',
    'HtTpS://evil.test/R6.png',
    'https:evil.test/R7.png',
    'ht\ttps://evil.test/R8.png',
    ' \x01//evil.test/R9.png',
  ])('%s is not a local resource', (url) => {
    expect(isLocalResource(url)).toBe(false);
  });

  it('removes image shapes from the source before Mermaid lays it out', () => {
    const src = 'flowchart TD\nA@{ img: "https://evil.test/R1.png", label: "x", pos: "t", w: 60, h: 60 }\nB@{ shape: rect, label: "ok" }\nC@{ IMG: //evil.test/R2.png }\nD@{ "\\x69mg": "x" }\nE@{ label: "a}b", img: \'//e\' }\nA --> B';
    const out = stripImageShapes(src);
    expect(out).not.toMatch(/img/i);
    expect(out).toContain('B@{ shape: rect, label: "ok" }');
    expect(out).toContain('A --> B');
    expect(stripImageShapes('graph TD\nA[img: text] --> B@{ label: "x')).toBe('graph TD\nA[img: text] --> B@{ label: "x');
  });

  // Final re-check L1 residual: classDiagram `style` and stateDiagram `classDef` were applied during layout.
  it('drops resource-loading declarations from style statements of every diagram type', () => {
    const src = [
      'classDiagram',
      'class A',
      'style A fill:url(https://evil.test/S9#a),stroke:\\75 rl(https://evil.test/S9b),stroke-width:2px',
      'stateDiagram-v2',
      'classDef bad background-image:url(https://evil.test/S10);color:rgb(1,2,3)',
      '[*] --> A:::bad',
      'linkStyle 0 stroke:#f00,background:u/**/rl(//evil.test/S11)',
      'cssClass "A" x',
      'classDef ok fill:#f9f,stroke:#333',
      'style B fill:image-set("https://evil.test/S12.png" 1x)',
      'classDef imp x:1;@import "https://evil.test/i.css"',
      'A[label with url(x) but no style statement]',
    ].join('\n');
    const out = stripStyleUrls(src).split('\n');
    expect(out[2]).toBe('style A stroke-width:2px');
    expect(out[4]).toBe('classDef bad color:rgb(1,2,3)');
    expect(out[6]).toBe('linkStyle 0 stroke:#f00');
    expect(out[7]).toBe('cssClass "A" x');
    expect(out[8]).toBe('classDef ok fill:#f9f,stroke:#333');
    expect(out[9]).toBe('style B');
    expect(out[10]).toBe('classDef imp x:1');
    expect(out[11]).toBe('A[label with url(x) but no style statement]');
    expect(stripStyleUrls(src)).not.toMatch(/evil/);
  });

  it('decodes CSS escapes and comments, then drops remote url(), image-set() and @import', () => {
    expect(decodeCss('a{b:\\75 rl(x)} /* c */ \\(\\0 \\110000')).toBe('a{b:url(x)}  (\ufffd\ufffd');
    expect(sanitizeCss('rect, path, g, svg { background-image: url(https://evil.test/C1); fill: url("//evil.test/C1fill") }')).toBe('rect, path, g, svg { background-image: none; fill: none }');
    expect(sanitizeCss('g{fill:\\75 rl(https://evil.test/C4)}')).toBe('g{fill:none}');
    expect(sanitizeCss('g{fill:U/**/RL(https://evil.test/C5)}')).toBe('g{fill:none}');
    expect(sanitizeCss("g{cursor:url('//evil.test/C6'),auto;mask:url(//evil.test/C7)}")).toBe('g{cursor:none,auto;mask:none}');
    // `\\\\host` in CSS unescapes to one backslash: a same-origin path, as the browser resolves it.
    expect(sanitizeCss('g{mask:url(\\\\evil.test/x)}')).toBe('g{mask:url(\\evil.test/x)}');
    expect(sanitizeCss('@import url(https://evil.test/i.css); g{x:image-set("https://evil.test/a.png" 1x)} @font-face{src:url(https://evil.test/f.woff)}')).toBe(' g{x:none} ');
    expect(sanitizeCss('.a{fill:url(#grad)} .b{background:url(data:image/png;base64,AA)} .c{background:url(/local.png)}')).toBe('.a{fill:url(#grad)} .b{background:url(data:image/png;base64,AA)} .c{background:url(/local.png)}');
    expect(sanitizeCss('g{x:url("https://evil.test/a)b")}')).toBe('g{x:none}');
    expect(sanitizeCss('g{x:url(https://evil.test/a"}')).toBe('');
    expect(sanitizeCss('g{x:image-set(}')).toBe('');
  });

  it('filters restored styles and SMIL href animations unless remote images are allowed', () => {
    const svg = '<svg xmlns="http://www.w3.org/2000/svg"><style>g{fill:\\75 rl(https://evil.test/C4)}</style><image id="i"><set attributeName="href" to="https://evil.test/s.png"/></image><animate id="a2" attributeName="x"/></svg>';
    const node = parseSvg(svg, 'n', 'D');
    expect(node.querySelector('style')?.textContent).toBe('g{fill:none}');
    expect(node.querySelector('set')).toBeNull();
    expect(node.querySelector('#a2')).not.toBeNull();
    const allowed = parseSvg(svg, 'n', 'D', true);
    expect(allowed.querySelector('style')?.textContent).toBe('g{fill:\\75 rl(https://evil.test/C4)}');
    expect(allowed.querySelector('set')).not.toBeNull();
  });

  it('keeps themeCSS / themeVariables / fontFamily out of %%{init}%% unless remote images are allowed', async () => {
    const initialize = vi.fn();
    const render = vi.fn(async (_id: string, _text: string) => ({ svg: SVG }));
    vi.spyOn(mermaidLoader, 'load').mockResolvedValue({ initialize, render });
    await renderMermaid('flowchart TD\nA@{ img: "https://evil.test/x.png" }', '', false, 'D');
    expect((initialize.mock.calls[0]![0] as { secure: string[] }).secure).toEqual(expect.arrayContaining(['secure', 'securityLevel', ...MERMAID_CSS_KEYS]));
    expect(render.mock.calls[0]![1]).toBe('flowchart TD\nA');
    await renderMermaid('stateDiagram-v2\nclassDef bad background-image:url(https://evil.test/S10)', '', false, 'D');
    expect(render.mock.calls[1]![1]).toBe('stateDiagram-v2\nclassDef bad');
    await renderMermaid('flowchart TD\nA@{ img: "https://evil.test/x.png" }\nstyle A fill:url(https://e.test/x)', '', false, 'D', true);
    expect((initialize.mock.calls[2]![0] as { secure: string[] }).secure).not.toContain('themeCSS');
    expect(render.mock.calls[2]![1]).toContain('img:');
    expect(render.mock.calls[2]![1]).toContain('url(https://e.test/x)');
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
    // Re-verification L5: 160 nested superscripts / 190 subscripts crashed the tab; \left and \begin nest too.
    expect(MAX_TEX_DEPTH).toBe(50);
    expect(texWithinLimits(`${'x^{'.repeat(160)}x${'}'.repeat(160)}`)).toBe(false);
    expect(texWithinLimits(`${'x_{'.repeat(190)}x${'}'.repeat(190)}`)).toBe(false);
    expect(texWithinLimits(`${'x^{'.repeat(50)}x${'}'.repeat(50)}`)).toBe(true);
    expect(texWithinLimits('\\left('.repeat(51))).toBe(false);
    expect(texWithinLimits('\\begin{matrix}'.repeat(51))).toBe(false);
    expect(texWithinLimits('\\left( x \\right) '.repeat(100) + '\\begin{a}\\end{a}'.repeat(100))).toBe(true);
    expect(texWithinLimits('\\leftarrow \\{ \\endash '.repeat(100))).toBe(true);
    // Final re-check L5 bypasses (auditor's r4-K10, K11, K15, K16): other group openers and macros.
    expect(texWithinLimits(`${'x^\\bgroup x'.repeat(160)}${'\\egroup'.repeat(160)}`)).toBe(false);
    expect(texWithinLimits(`${'x^\\begingroup x'.repeat(160)}${'\\endgroup'.repeat(160)}`)).toBe(false);
    expect(texWithinLimits(`${'x_\\bgroup x'.repeat(160)}`)).toBe(false);
    expect(texWithinLimits(`\\def\\o{^\\bgroup x}x${'\\o'.repeat(160)}`)).toBe(false);
    expect(texWithinLimits(`${'x^\\bgroup x'.repeat(50)}${'\\egroup'.repeat(50)}`)).toBe(true);
    for (const def of ['\\def', '\\gdef', '\\edef', '\\xdef', '\\let', '\\futurelet', '\\newcommand', '\\renewcommand', '\\providecommand', '\\global', '\\csname']) {
      expect(texWithinLimits(`${def}\\a{b} x`)).toBe(false);
    }
    expect(texWithinLimits('\\definecolor \\letter \\delta')).toBe(true);
    expect(texWithinLimits('a_1+'.repeat(MAX_TEX_SCRIPTS))).toBe(true);
    expect(texWithinLimits('a_1+'.repeat(MAX_TEX_SCRIPTS + 1))).toBe(false);
    expect(texWithinLimits('\\_ \\^{} '.repeat(300))).toBe(true);
  });

  it('guards KaTeX itself, so the editor\'s LaTeX is bounded too', () => {
    const inner: Katex = { render: vi.fn((tex: string, el: HTMLElement) => {
      if (tex === 'boom') throw new RangeError('stack');
      el.textContent = `K(${tex})`;
    }), renderToString: vi.fn((tex: string) => {
      if (tex === 'boom') throw new RangeError('stack');
      return `<b>${tex}</b>`;
    }) };
    const rawRender = inner.render as ReturnType<typeof vi.fn>;
    const katex = guardKatex(inner);
    katex.render('y', document.createElement('span'), { trust: true, macros: { '\\x': 'y' }, maxExpand: 1e9 });
    expect(rawRender.mock.calls[0]![2]).toEqual({ trust: false, macros: {}, maxExpand: MAX_TEX_EXPAND });
    expect(safeKatexOptions()).toEqual({ trust: false, macros: {}, maxExpand: MAX_TEX_EXPAND });
    expect(guardKatex(katex)).toBe(katex);
    const el = document.createElement('span');
    katex.render('x', el, {});
    expect(el.textContent).toBe('K(x)');
    const bg = document.createElement('span');
    katex.render(`\\def\\o{^\\bgroup x}x${'\\o'.repeat(160)}`, bg, {});
    expect(bg.dataset.mathError).toBe('true');
    for (const tex of ['boom', `${'x^{'.repeat(160)}x`]) {
      const bad = document.createElement('span');
      katex.render(tex, bad, {});
      expect(bad.dataset.mathError).toBe('true');
      expect(bad.textContent).toBe(tex);
      expect(katex.renderToString!(tex, {})).toMatch(/^<span data-math-error="true">/);
    }
    expect(katex.renderToString!('<x>', {})).toBe('<b><x></b>');
    expect(katex.renderToString!(`<i>${'{'.repeat(51)}`, {})).toBe(`<span data-math-error="true">&lt;i&gt;${'{'.repeat(51)}</span>`);
    expect(guardKatex({ render: () => undefined } as Katex).renderToString).toBeUndefined();
  });

  it('the real KaTeX loader returns a guarded module', async () => {
    const katex = await katexLoader.load();
    const el = document.createElement('span');
    katex.render(`${'x^{'.repeat(160)}x${'}'.repeat(160)}`, el, {});
    expect(el.dataset.mathError).toBe('true');
  });

  it('the real loaders return modules', async () => {
    const katex = await katexLoader.load();
    expect(typeof katex.render).toBe('function');
  });
});
