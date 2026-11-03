/**
 * Markdown clipboard (1.5, `markdown_clipboard`).
 *
 * - **Smart paste**: when the clipboard has `text/html` that only wraps text (a code editor, a terminal or a plain
 *   text field copies `pre` / `code` / `div` / `p` / `br` / `span`, no inline formatting, links or lists) and its
 *   `text/plain` looks like Markdown (headings, lists, emphasis, links, fences, tables, quotes), the text is parsed
 *   as Markdown of the dialect. Real rich HTML (a web page, a document) keeps the sanitising HTML path.
 * - **Paste as Markdown** (Ctrl / ⌘ + Alt + V): parses the clipboard text as Markdown, whatever it looks like.
 * - **Copy as Markdown** (Ctrl / ⌘ + Alt + Shift + C; Ctrl / ⌘ + Alt + C stays Milkdown's code block): writes the
 *   selection, serialised to the dialect, as plain text.
 *
 * Inside a code block nothing is parsed: the text is inserted as is.
 */
import { parserCtx, serializerCtx } from '@milkdown/kit/core';
import type { Ctx } from '@milkdown/kit/ctx';
import { keymap } from '@milkdown/kit/prose/keymap';
import { DOMParser as PmDOMParser, DOMSerializer, Fragment, Node as PmNode, Slice, type Mark } from '@milkdown/kit/prose/model';
import type { EditorState } from '@milkdown/kit/prose/state';
import type { EditorView } from '@milkdown/kit/prose/view';
import { $prose } from '@milkdown/kit/utils';

/** Parses and serialises Markdown of the dialect (Milkdown's parser and serializer of the editor). */
export type MarkdownIo = { parse: (text: string) => PmNode | null; serialize: (doc: PmNode) => string };

export type MarkdownClipboard = Pick<globalThis.Clipboard, 'readText' | 'writeText'>;

/** Elements that only wrap text: HTML of a code editor, a terminal or a plain text field. */
const WRAPPERS = new Set(['HTML', 'HEAD', 'BODY', 'META', 'TITLE', 'STYLE', 'DIV', 'P', 'BR', 'PRE', 'CODE', 'SPAN']);

/** Markdown syntax that plain text hardly ever has by chance. */
const MARKDOWN = [
  /^ {0,3}#{1,6}[ \t]+\S/m, // heading
  /^ {0,3}(?:[-*+]|\d{1,9}[.)])[ \t]+\S/m, // list item (task items too)
  /\*\*[^*\n]+\*\*|__[^_\n]+__/, // strong emphasis
  /\[[^\]\n]+\]\([^)\s]+\)/, // link or image
  /^ {0,3}(?:`{3,}|~{3,})/m, // fence
  /^ {0,3}\|?(?:[ \t]*:?-{3,}:?[ \t]*\|)+/m, // table delimiter row
  /^ {0,3}>[ \t]?\S/m, // blockquote
];

/**
 * Whether the HTML only wraps text (no element beyond {@link WRAPPERS}). Parsed inertly (no script runs).
 *
 * @param html - The `text/html` of the clipboard
 */
export function isTextWrapper(html: string): boolean {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return [...doc.querySelectorAll('*')].every((el) => WRAPPERS.has(el.tagName));
}

/**
 * Whether the text uses Markdown syntax.
 *
 * @param text - The `text/plain` of the clipboard
 */
export function looksLikeMarkdown(text: string): boolean {
  return MARKDOWN.some((re) => re.test(text));
}

/** The parser and serializer of the editor `ctx`; a document the parser rejects is null. */
export function markdownIo(ctx: Ctx): MarkdownIo {
  return {
    parse: (text) => {
      try {
        const doc = ctx.get(parserCtx)(text);
        return doc instanceof PmNode ? doc : null;
      } catch {
        return null;
      }
    },
    serialize: (doc) => ctx.get(serializerCtx)(doc),
  };
}

/**
 * The parsed document through the schema's DOM round trip, as the plain-text and HTML paste paths do (audit DN-L1):
 * the marks and nodes keep only what their `parseDOM` rules accept, so unsafe link and image targets (`javascript:`,
 * `data:`) are dropped exactly as on the other paths and the stored Markdown is the same whichever path pasted it.
 */
export function throughSchema(doc: PmNode): PmNode {
  const container = document.createElement('div');
  container.append(DOMSerializer.fromSchema(doc.type.schema).serializeFragment(doc.content, { document }));
  return PmDOMParser.fromSchema(doc.type.schema).parse(container);
}

/** Schemes a pasted link or image may keep; any other (`javascript:`, `data:`, `vbscript:`…) is emptied. */
const SAFE_SCHEMES = new Set(['http', 'https', 'mailto', 'tel']);

/**
 * Whether a pasted link or image target is safe: relative, an anchor, or one of {@link SAFE_SCHEMES} (controls and
 * spaces the URL parser would ignore are ignored here too, so `java\tscript:` is still `javascript:`).
 */
export function isSafePastedUrl(value: unknown): boolean {
  if (typeof value !== 'string') return true;
  // eslint-disable-next-line no-control-regex
  const url = value.replace(/[\u0000-\u0020]+/g, '');
  const scheme = /^([a-z][a-z0-9+.-]*):/i.exec(url)?.[1];
  return scheme === undefined || SAFE_SCHEMES.has(scheme.toLowerCase());
}

const cleanMark = (mark: Mark): Mark => (isSafePastedUrl(mark.attrs.href) ? mark : mark.type.create({ ...mark.attrs, href: '' }));

/**
 * Empties every unsafe `href` (link marks) and `src` (images) of pasted content (audit DN-L1): the same for the smart
 * paste, Paste as Markdown and (through `transformPasted`) the plain-text and HTML paste paths, so a paste never
 * stores `javascript:` or `data:` targets whichever path it took.
 */
export function cleanFragment(fragment: Fragment): Fragment {
  const nodes: PmNode[] = [];
  fragment.forEach((node) => {
    const marks = node.marks.map(cleanMark);
    if (node.isText) {
      nodes.push(node.mark(marks));
      return;
    }
    const attrs = isSafePastedUrl(node.attrs.src) ? node.attrs : { ...node.attrs, src: '' };
    nodes.push(node.type.create(attrs, cleanFragment(node.content), marks));
  });
  return Fragment.from(nodes);
}

/** `transformPasted` of the view (with `markdown_clipboard`): {@link cleanFragment} on every pasted slice. */
export const cleanPasted = (slice: Slice): Slice => new Slice(cleanFragment(slice.content), slice.openStart, slice.openEnd);

const inCode = (state: EditorState): boolean => state.selection.$from.parent.type.spec.code === true;

/**
 * Replaces the selection with the text parsed as Markdown (as text inside a code block). A single paragraph is
 * pasted inline; blocks are inserted as blocks (a heading pasted in the middle of a paragraph splits it).
 *
 * @returns False when nothing was inserted
 */
export function insertMarkdown(view: EditorView, io: MarkdownIo, text: string): boolean {
  if (text === '') return false;
  if (inCode(view.state)) {
    view.dispatch(view.state.tr.insertText(text).scrollIntoView());
    return true;
  }
  const parsed = io.parse(text);
  if (!parsed || parsed.content.size === 0) return false;
  const doc = parsed.type.create(parsed.attrs, cleanFragment(throughSchema(parsed).content));
  // One paragraph joins the text around the caret; anything else (headings, lists, several blocks) stays blocks.
  const inline = doc.childCount === 1 && doc.firstChild!.type.name === 'paragraph';
  view.dispatch(view.state.tr.replaceSelection(inline ? Slice.maxOpen(doc.content) : new Slice(doc.content, 0, 0)).scrollIntoView());
  return true;
}

/** The selection serialised to the dialect ('' for an empty selection). */
export function selectionMarkdown(state: EditorState, io: MarkdownIo): string {
  const { from, to, empty } = state.selection;
  return empty ? '' : io.serialize(state.doc.cut(from, to));
}

/**
 * `handlePaste` of the smart paste (an editor view prop, so it runs before Milkdown's clipboard plugin). It also takes
 * plain-text pastes, which Milkdown parses as Markdown as well, so both store the same cleaned document (DN-L1).
 */
export function smartPaste(io: MarkdownIo) {
  return (view: EditorView, event: ClipboardEvent): boolean => {
    const data = event.clipboardData;
    if (!data || !view.editable || inCode(view.state)) return false;
    const html = data.getData('text/html');
    const text = data.getData('text/plain');
    // Plain text only: Milkdown parses it as Markdown too; taken here so the same cleaning applies (DN-L1).
    if (html === '') return text !== '' && insertMarkdown(view, io, text);
    if (!looksLikeMarkdown(text) || !isTextWrapper(html)) return false;
    return insertMarkdown(view, io, text);
  };
}

/** Pastes the clipboard text as Markdown. */
export async function pasteMarkdown(view: EditorView, io: MarkdownIo, clipboard: Partial<MarkdownClipboard>): Promise<boolean> {
  const text = (await clipboard.readText?.()) ?? '';
  const done = view.editable && insertMarkdown(view, io, text);
  view.focus();
  return done;
}

/** Copies the selection as Markdown; false when there is nothing to copy or the clipboard refused. */
export async function copyMarkdown(state: EditorState, io: MarkdownIo, clipboard: Partial<MarkdownClipboard>): Promise<boolean> {
  const markdown = selectionMarkdown(state, io);
  if (markdown === '' || !clipboard.writeText) return false;
  try {
    await clipboard.writeText(markdown);
    return true;
  } catch {
    return false;
  }
}

/** The browser clipboard API, or nothing (insecure context, old browser). */
export const browserClipboard = (): Partial<MarkdownClipboard> => (typeof navigator !== 'undefined' && navigator.clipboard ? navigator.clipboard : {});

/**
 * The keys: Ctrl / ⌘ + Alt + V pastes as Markdown, Ctrl / ⌘ + Alt + Shift + C copies as Markdown; the copy is announced in
 * the widget's live region.
 *
 * @param announce - Says a message key in the live region (`error`: the alert region)
 * @param clipboard - The clipboard (tests)
 */
export function markdownClipboardPlugin(announce: (key: string, error?: boolean) => void, clipboard: () => Partial<MarkdownClipboard> = browserClipboard) {
  return $prose((ctx) => {
    const io = markdownIo(ctx);
    const copy = (state: EditorState): boolean => {
      if (state.selection.empty) return false;
      void copyMarkdown(state, io, clipboard()).then((ok) => announce(ok ? 'clipboard.copied_markdown' : 'clipboard.copy_failed', !ok));
      return true;
    };
    return keymap({
      'Mod-Alt-v': (_state, _dispatch, view) => {
        if (!view?.editable) return false;
        void pasteMarkdown(view, io, clipboard());
        return true;
      },
      // With Shift the key is "C" (most layouts) or, on macOS with Alt, found through its key code ("c").
      'Mod-Alt-Shift-C': copy,
      'Mod-Alt-Shift-c': copy,
    });
  });
}
