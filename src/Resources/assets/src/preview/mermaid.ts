/**
 * Mermaid previews (FR-086): loaded on demand, strict security level, no HTML labels. Mermaid writes a `<style>` into
 * every diagram; while it renders, style elements created by script get the page nonce and strings parsed with
 * `DOMParser` keep their styles as inert placeholders; the returned SVG is parsed (never `innerHTML`) and its styles
 * are restored as nonce-stamped elements. Renders run one at a time (the patches are global while they run) and the
 * style stash is emptied after each one. Unless remote images are allowed, `href`s of image / use / feImage /
 * pattern elements that leave the page's origin and inline styles with a remote `url(…)` are dropped.
 */
type Mermaid = {
  initialize: (config: Record<string, unknown>) => void;
  render: (id: string, text: string) => Promise<{ svg: string }>;
};

let loader: Promise<Mermaid> | null = null;
let counter = 0;
let queue: Promise<void> = Promise.resolve();

/** Overridable for tests. */
export const mermaidLoader = {
  load: (): Promise<Mermaid> => import('mermaid').then((m) => m.default as unknown as Mermaid),
};

/** CSS text of `<style>` elements taken out of strings parsed while Mermaid renders (index = placeholder id). */
const stash: string[] = [];
const STYLE_TAG = /<style\b[^>]*>([\s\S]*?)<\/style>/gi;

/**
 * Replaces every `<style>` of an SVG / HTML string with an inert `<g data-nowo-style="N">` placeholder: a style element
 * parsed by `DOMParser` (Mermaid's DOMPurify pass, our own parse) is reported as a CSP violation.
 *
 * @param markup - SVG or HTML source
 * @returns The source with placeholders
 */
export function stashStyles(markup: string): string {
  return markup.replace(STYLE_TAG, (_, css: string) => `<g data-nowo-style="${stash.push(css) - 1}"></g>`);
}

/**
 * Runs `fn` while every `<style>` created by script carries `nonce` and strings parsed with `DOMParser` keep their
 * styles as placeholders (CSP `style-src-elem` with a nonce).
 *
 * @param nonce - The page nonce ('' runs `fn` unchanged)
 * @param fn - The rendering to run
 * @returns What `fn` returns
 */
export async function withStyleNonce<T>(nonce: string, fn: () => Promise<T>): Promise<T> {
  if (!nonce) return fn();
  const create = Document.prototype.createElement;
  const createNS = Document.prototype.createElementNS;
  const parse = DOMParser.prototype.parseFromString;
  const stamp = <E extends Element>(el: E): E => {
    if (el.localName === 'style') el.setAttribute('nonce', nonce);
    return el;
  };
  Document.prototype.createElement = function (this: Document, ...args: Parameters<Document['createElement']>) {
    return stamp(create.apply(this, args));
  } as Document['createElement'];
  Document.prototype.createElementNS = function (this: Document, ...args: [string | null, string]) {
    return stamp(createNS.apply(this, args as never) as Element);
  } as Document['createElementNS'];
  DOMParser.prototype.parseFromString = function (this: DOMParser, markup: string, type: DOMParserSupportedType) {
    return parse.call(this, stashStyles(String(markup)), type);
  } as DOMParser['parseFromString'];
  try {
    return await fn();
  } finally {
    Document.prototype.createElement = create;
    Document.prototype.createElementNS = createNS;
    DOMParser.prototype.parseFromString = parse;
  }
}

/**
 * Parses Mermaid's SVG string into a node: scripts, `foreignObject` and handlers dropped, styles restored from their
 * placeholders as nonce-stamped elements (removed when there is no nonce).
 *
 * @param svg - Mermaid's output
 * @param nonce - The page nonce
 * @param label - Accessible name of the diagram
 * @param allowRemoteImages - Keep resource URLs on other origins (default: drop them)
 * @returns The SVG element, owned by the page document
 */
export function parseSvg(svg: string, nonce: string, label: string, allowRemoteImages = false): SVGSVGElement {
  const doc = new DOMParser().parseFromString(stashStyles(svg), 'image/svg+xml');
  const root = doc.documentElement;
  if (root.localName !== 'svg') throw new Error('mermaid: not an SVG');
  root.querySelectorAll('script, foreignObject').forEach((el) => el.remove());
  [root, ...root.querySelectorAll('*')].forEach((el) => {
    for (const attr of [...el.attributes]) if (/^on/i.test(attr.name)) el.removeAttribute(attr.name);
    if (!allowRemoteImages) dropRemoteResources(el);
  });
  const node = document.importNode(root, true) as unknown as SVGSVGElement;
  node.querySelectorAll('g[data-nowo-style]').forEach((holder) => {
    const css = stash[Number(holder.getAttribute('data-nowo-style'))];
    if (!nonce || css === undefined) {
      holder.remove();
      return;
    }
    const style = document.createElementNS('http://www.w3.org/2000/svg', 'style');
    style.setAttribute('nonce', nonce);
    style.textContent = allowRemoteImages ? css : sanitizeCss(css);
    holder.replaceWith(style);
  });
  node.setAttribute('role', 'img');
  node.setAttribute('aria-label', label);
  return node;
}

/** SVG elements whose `href` loads a resource (image shapes, external `<use>`, filters, patterns). */
const RESOURCE_ELEMENTS = new Set(['image', 'use', 'feimage', 'pattern']);

/** SMIL elements that could set an `href` after the diagram is inserted. */
const ANIMATION_ELEMENTS = new Set(['set', 'animate']);

/** Mermaid keys that are always fixed by `initialize()`, never by `%%{init}%%` or front matter. */
export const MERMAID_SECURE_KEYS = ['secure', 'securityLevel', 'startOnLoad', 'maxTextSize', 'suppressErrorRendering', 'maxEdges'];

/** Keys that put author CSS into the diagram (`themeCSS`, theme colours / fonts written into its `<style>`). */
export const MERMAID_CSS_KEYS = ['themeCSS', 'themeVariables', 'fontFamily', 'altFontFamily'];

/**
 * Removes image shapes from Mermaid source: every `@{ … }` shape metadata block that mentions `img` (in any case or
 * spelling, or with a YAML escape) is dropped, so Mermaid never lays out an `<image>` in the live document — the
 * browser would fetch it before the SVG is sanitised.
 *
 * @param source - Mermaid source
 * @returns The source without image shape metadata
 */
export function stripImageShapes(source: string): string {
  let out = '';
  let i = 0;
  while (i < source.length) {
    const start = source.indexOf('@{', i);
    if (start < 0) break;
    let end = start + 2;
    let quote = '';
    for (; end < source.length; end++) {
      const ch = source[end]!;
      if (quote) {
        if (ch === '\\') end++;
        else if (ch === quote) quote = '';
      } else if (ch === '"' || ch === "'") quote = ch;
      else if (ch === '}') break;
    }
    const block = source.slice(start, end + 1);
    out += source.slice(i, start) + (/img|\\/i.test(block) ? '' : block);
    i = end + 1;
  }
  return out + source.slice(i);
}

/**
 * CSS as the browser reads it: comments removed and escapes (`\75 rl(`, `\(`) decoded.
 *
 * @param css - CSS text
 * @returns The decoded text
 */
export function decodeCss(css: string): string {
  return css.replace(/\/\*[\s\S]*?(?:\*\/|$)/g, '').replace(/\\(?:([0-9a-f]{1,6})[ \t\n\r\f]?|(\r\n|[\n\r\f])|([\s\S]))/gi, (_m, hex?: string, _nl?: string, ch?: string) => {
    if (hex !== undefined) {
      const code = parseInt(hex, 16);
      return code > 0 && code <= 0x10ffff && (code < 0xd800 || code > 0xdfff) ? String.fromCodePoint(code) : '\ufffd';
    }
    return ch ?? '';
  });
}

/**
 * CSS without resource loads to other origins (`allow_remote_images: false`): escapes are decoded first, `@import`
 * and `@font-face` rules are removed, `image-set()` and every `url()` that is not local become `none`; anything still
 * naming a remote `url(` afterwards drops the whole text.
 *
 * @param css - A style block or a `style` attribute
 * @returns Safe CSS
 */
export function sanitizeCss(css: string): string {
  const out = decodeCss(css)
    .replace(/@import\b[^;]*;?/gi, '')
    .replace(/@font-face\s*\{[^}]*\}?/gi, '')
    .replace(/(?:-webkit-)?image-set\((?:[^()]|\([^()]*\))*\)/gi, 'none')
    .replace(/url\(\s*(?:"([^"]*)"|'([^']*)'|([^)]*?))\s*\)/gi, (m, dq?: string, sq?: string, bare?: string) =>
      isLocalResource(dq ?? sq ?? bare ?? '') ? m : 'none',
    );
  for (const m of out.matchAll(/url\(\s*['"]?([^'")]*)/gi)) if (!isLocalResource(m[1] ?? '')) return '';
  return /@import|image-set\(/i.test(out) ? '' : out;
}

/**
 * Whether `value` may be loaded: a fragment, an inline `data:image/(png|gif|jpeg|webp)` or a same-origin URL.
 *
 * @param value - An `href` value
 * @returns True when no other origin is contacted
 */
export function isLocalResource(value: string): boolean {
  // eslint-disable-next-line no-control-regex
  const url = value.replace(/[\t\n\r]/g, '').replace(/^[\u0000-\u0020]+/, '');
  if (url === '' || url.startsWith('#')) return true;
  if (/^data:image\/(?:png|gif|jpeg|webp)[;,]/i.test(url)) return true;
  try {
    return new URL(url, document.baseURI).origin === new URL(document.baseURI).origin;
  } catch {
    return false;
  }
}

/**
 * Removes resource loads to other origins from one SVG element (`allow_remote_images: false`, the default): tracking
 * pixels through Mermaid image shapes or `<use href>`, `<set>` / `<animate>` of an `href`, and `url(…)` in styles.
 *
 * @param el - An element of the parsed diagram
 */
function dropRemoteResources(el: Element): void {
  const name = el.localName.toLowerCase();
  if (RESOURCE_ELEMENTS.has(name)) {
    for (const attr of [...el.attributes]) {
      if (attr.localName === 'href' && !isLocalResource(attr.value)) el.removeAttributeNode(attr);
    }
  }
  if (ANIMATION_ELEMENTS.has(name) && /href/i.test(el.getAttribute('attributeName') ?? '')) {
    el.remove();
    return;
  }
  const style = el.getAttribute('style');
  if (style !== null) {
    const safe = sanitizeCss(style);
    if (safe !== style) el.setAttribute('style', safe);
  }
}

/**
 * Renders one diagram; rejects with Mermaid's error for invalid source. Mermaid lays the diagram out in the live
 * document, so unless remote images are allowed the source is filtered first: image shapes are removed and the CSS
 * keys (`themeCSS`, `themeVariables`, `fontFamily`) cannot be set from `%%{init}%%` or front matter.
 */
export async function renderMermaid(source: string, nonce: string, dark: boolean, label: string, allowRemoteImages = false): Promise<SVGSVGElement> {
  const mermaid = await (loader ??= mermaidLoader.load());
  mermaid.initialize({
    startOnLoad: false,
    securityLevel: 'strict',
    htmlLabels: false,
    flowchart: { htmlLabels: false },
    theme: dark ? 'dark' : 'neutral',
    fontFamily: 'inherit',
    secure: allowRemoteImages ? MERMAID_SECURE_KEYS : [...MERMAID_SECURE_KEYS, ...MERMAID_CSS_KEYS],
  });
  const text = allowRemoteImages ? source : stripImageShapes(source);
  const run = queue.then(async () => {
    try {
      const { svg } = await withStyleNonce(nonce, () => mermaid.render(`nowo-mermaid-${++counter}`, text));
      return parseSvg(svg, nonce, label, allowRemoteImages);
    } finally {
      stash.length = 0; // placeholders are resolved: keep the page from accumulating diagram CSS
    }
  });
  queue = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

/** Test hook: forget the loaded module. */
export const resetMermaid = (): void => {
  loader = null;
};
