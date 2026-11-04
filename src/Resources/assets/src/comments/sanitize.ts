/**
 * Comment bodies (1.6): the host renders them with the bundle's safe renderer and returns HTML. The editor never
 * assigns it with `innerHTML`: it parses it in an inert document and copies an allow-list with DOM APIs (contract
 * section 9). Everything else becomes text.
 */
import { safeUrl } from '../link-titles';

const TAGS = new Set(['P', 'BR', 'STRONG', 'EM', 'DEL', 'S', 'CODE', 'PRE', 'BLOCKQUOTE', 'UL', 'OL', 'LI', 'A', 'SPAN', 'MARK', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'TABLE', 'THEAD', 'TBODY', 'TR', 'TH', 'TD']);
/** Tags whose content is dropped with them (never shown as text either). */
const DROP = new Set(['SCRIPT', 'STYLE', 'TEMPLATE', 'IFRAME', 'OBJECT', 'EMBED', 'NOSCRIPT', 'SVG', 'MATH']);
const CLASS = /^nowo-md-[a-z0-9-]{1,60}$/;
/** At most this many nodes are copied (a hostile host answer cannot freeze the page). */
export const MAX_NODES = 5000;

/**
 * Copies host HTML into a fragment of allowed elements and attributes.
 *
 * @param html - HTML from the host
 * @param doc - The document that owns the result
 * @returns A fragment safe to append
 */
export function sanitizeBody(html: string, doc: Document = document): DocumentFragment {
  const source = new DOMParser().parseFromString(`<body>${html}</body>`, 'text/html').body;
  const out = doc.createDocumentFragment();
  let budget = MAX_NODES;
  const copy = (from: Node, to: Node): void => {
    for (const child of [...from.childNodes]) {
      if (--budget < 0) return;
      if (child.nodeType === Node.TEXT_NODE) {
        to.appendChild(doc.createTextNode(child.textContent ?? ''));
        continue;
      }
      if (!(child instanceof Element) || DROP.has(child.tagName.toUpperCase())) continue;
      const tag = child.tagName.toUpperCase();
      if (!TAGS.has(tag)) {
        copy(child, to);
        continue;
      }
      const el = doc.createElement(tag.toLowerCase());
      const classes = (child.getAttribute('class') ?? '').split(/\s+/).filter((c) => CLASS.test(c));
      if (classes.length) el.className = classes.join(' ');
      for (const name of ['title', 'datetime', 'lang']) {
        const value = child.getAttribute(name);
        if (value !== null) el.setAttribute(name, value.slice(0, 500));
      }
      if (tag === 'A') {
        const href = safeUrl(child.getAttribute('href') ?? '');
        if (href !== '') el.setAttribute('href', href);
        el.setAttribute('rel', 'noopener noreferrer nofollow');
      }
      to.appendChild(el);
      copy(child, el);
    }
  };
  copy(source, out);
  return out;
}
