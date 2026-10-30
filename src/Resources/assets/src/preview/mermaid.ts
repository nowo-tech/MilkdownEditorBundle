/**
 * Mermaid previews (FR-086): loaded on demand, strict security level, no HTML labels. Mermaid writes a `<style>` into
 * every diagram; while it renders, style elements created by script get the page nonce and strings parsed with
 * `DOMParser` keep their styles as inert placeholders; the returned SVG is parsed (never `innerHTML`) and its styles
 * are restored as nonce-stamped elements. Renders run one at a time (the patches are global while they run).
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
 * @returns The SVG element, owned by the page document
 */
export function parseSvg(svg: string, nonce: string, label: string): SVGSVGElement {
  const doc = new DOMParser().parseFromString(stashStyles(svg), 'image/svg+xml');
  const root = doc.documentElement;
  if (root.localName !== 'svg') throw new Error('mermaid: not an SVG');
  root.querySelectorAll('script, foreignObject').forEach((el) => el.remove());
  [root, ...root.querySelectorAll('*')].forEach((el) => {
    for (const attr of [...el.attributes]) if (/^on/i.test(attr.name)) el.removeAttribute(attr.name);
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
    style.textContent = css;
    holder.replaceWith(style);
  });
  node.setAttribute('role', 'img');
  node.setAttribute('aria-label', label);
  return node;
}

/** Renders one diagram; rejects with Mermaid's error for invalid source. */
export async function renderMermaid(source: string, nonce: string, dark: boolean, label: string): Promise<SVGSVGElement> {
  const mermaid = await (loader ??= mermaidLoader.load());
  mermaid.initialize({
    startOnLoad: false,
    securityLevel: 'strict',
    htmlLabels: false,
    flowchart: { htmlLabels: false },
    theme: dark ? 'dark' : 'neutral',
    fontFamily: 'inherit',
  });
  const run = queue.then(() => withStyleNonce(nonce, () => mermaid.render(`nowo-mermaid-${++counter}`, source)));
  queue = run.then(
    () => undefined,
    () => undefined,
  );
  const { svg } = await run;
  return parseSvg(svg, nonce, label);
}

/** Test hook: forget the loaded module. */
export const resetMermaid = (): void => {
  loader = null;
};
