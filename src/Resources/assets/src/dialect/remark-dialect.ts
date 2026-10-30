/**
 * Remark plugin of the FR-075 dialect: directives (micromark-extension-directive) plus the inline tokens of
 * {@link splitText}. Parsing splits text nodes (never inside code, links or HTML); serialising writes every
 * dialect node verbatim, so Markdown stays the single source of truth and round trips are stable.
 */
import { directive } from 'micromark-extension-directive';
import { directiveFromMarkdown, directiveToMarkdown } from 'mdast-util-directive';
import { serialise, splitText } from './patterns';

export type MdNode = {
  type: string;
  value?: string;
  name?: string;
  attributes?: Record<string, string | null | undefined> | null;
  children?: MdNode[];
  data?: Record<string, unknown>;
  [key: string]: unknown;
};

const SKIP = new Set(['code', 'inlineCode', 'link', 'linkReference', 'html', 'math', 'inlineMath', 'definition']);
const DIRECTIVE_START = '[A-Za-z][\\w-]*[\\[{]';

/**
 * Escaping rules of `mdast-util-directive`, narrowed: its default escapes every `:` followed by a letter or a
 * digit (`10\:30`, `note\:`), which churns ordinary text. Only a colon that would really open a directive
 * (`:name[` or `:name{`) is escaped.
 */
export const DIRECTIVE_UNSAFE = [
  { character: '\r', inConstruct: ['leafDirectiveLabel', 'containerDirectiveLabel'] },
  { character: '\n', inConstruct: ['leafDirectiveLabel', 'containerDirectiveLabel'] },
  { character: ':', before: '[^:]', after: DIRECTIVE_START, inConstruct: ['phrasing'] },
  { atBreak: true, character: ':', after: DIRECTIVE_START },
  { afterNode: 'textDirective', character: ':', inConstruct: ['phrasing'] },
  { atBreak: true, before: ':+', character: ':' },
];

const isBareTextDirective = (node: MdNode): boolean =>
  node.type === 'textDirective' &&
  (node.children?.length ?? 0) === 0 &&
  Object.keys(node.attributes ?? {}).length === 0;

/** Walks the tree: bare `:name` text directives become text again, then text nodes are split into dialect nodes. */
export function transform(node: MdNode): void {
  if (!node.children || SKIP.has(node.type)) return;
  const merged: MdNode[] = [];
  for (const raw of node.children) {
    const child = isBareTextDirective(raw) ? { type: 'text', value: `:${raw.name ?? ''}` } : raw;
    const previous = merged[merged.length - 1];
    if (child.type === 'text' && previous?.type === 'text') previous.value = `${previous.value ?? ''}${child.value ?? ''}`;
    else merged.push(child.type === 'text' ? { ...child } : child);
  }
  const next: MdNode[] = [];
  for (const child of merged) {
    if (child.type === 'text' && typeof child.value === 'string') next.push(...(splitText(child.value) as MdNode[]));
    else {
      transform(child);
      next.push(child);
    }
  }
  node.children = next;
}

type Data = Record<string, unknown[] | undefined>;
type Processor = {
  data: () => Data;
  parser?: (doc: string, file: unknown) => unknown;
  compiler?: (tree: unknown, file: unknown) => unknown;
};

const FENCE = /^ {0,3}(`{3,}|~{3,})/;

/** Applies `fn` to every line outside fenced code blocks. */
function mapLinesOutsideCode(doc: string, fn: (line: string) => string): string {
  let fence: string | null = null;
  return doc
    .split('\n')
    .map((line) => {
      const m = FENCE.exec(line);
      if (fence !== null) {
        if (m && m[1]![0] === fence[0] && m[1]!.length >= fence.length && line.trim() === m[1]) fence = null;
        return line;
      }
      if (m) {
        fence = m[1]!;
        return line;
      }
      return fn(line);
    })
    .join('\n');
}

/**
 * `::: {align=center}` (a container without a name, as the dialect writes alignment) is not valid
 * `remark-directive` syntax: it is read as `:::align{…}` and written back in the short form.
 */
export const nameAlignContainers = (doc: string): string =>
  mapLinesOutsideCode(doc, (line) => line.replace(/^( {0,3}:{3,}) *(\{)/, '$1align$2'));
export const unnameAlignContainers = (doc: string): string =>
  mapLinesOutsideCode(doc, (line) => line.replace(/^( {0,3}:{3,})align\{/, '$1 {'));

/**
 * Milkdown writes an empty paragraph as a raw `<br />` line (to keep empty lines); raw HTML is escaped by every
 * renderer of the dialect, so the marker is dropped (an empty list item stays `*`, an empty line goes).
 */
export const dropEmptyLineMarkers = (doc: string): string =>
  mapLinesOutsideCode(doc, (line) =>
    line.replace(/^((?:[ \t]*>)*[ \t]*(?:(?:[*+-]|\d+[.)])[ \t]+(?:\[[ xX]\][ \t]+)?)?)<br \/>[ \t]*$/, (_, lead: string) => lead.trimEnd()),
  ).replace(/\n{3,}/g, '\n\n');

/** The remark plugin (works with plain `unified` for tests and through Milkdown's `$remark`). */
export function remarkNowoDialect(this: Processor): (tree: MdNode) => void {
  const data = this.data();
  const parser = this.parser;
  if (parser) this.parser = (doc, file) => parser(nameAlignContainers(doc), file);
  const compiler = this.compiler;
  if (compiler) {
    this.compiler = (tree, file) => {
      const out = compiler(tree, file);
      return typeof out === 'string' ? dropEmptyLineMarkers(unnameAlignContainers(out)) : out;
    };
  }
  const add = (field: string, value: unknown): void => {
    (data[field] ??= []).push(value);
  };
  const toMarkdown = directiveToMarkdown();
  add('micromarkExtensions', directive());
  add('fromMarkdownExtensions', directiveFromMarkdown());
  add('toMarkdownExtensions', {
    ...toMarkdown,
    unsafe: DIRECTIVE_UNSAFE,
    handlers: {
      ...toMarkdown.handlers,
      wikiRef: (n: { pageId: string; anchor?: string }) => serialise.wikiRef(n),
      mention: (n: { handle: string }) => serialise.mention(n),
      tablerIcon: (n: { name: string }) => serialise.tablerIcon(n),
    },
  });
  return (tree: MdNode) => transform(tree);
}
