/**
 * `comments` (1.6): highlight decorations of host threads, anchor resolution (Yjs relative positions, then the text
 * quote), orphan detection, anchor refresh, shortcuts and the `nowo-milkdown:comment-*` events. Comments are
 * decorations, never marks: the Markdown never contains them. The editor stores nothing.
 */
import { Plugin, PluginKey, TextSelection, type EditorState, type Transaction } from '@milkdown/kit/prose/state';
import { Decoration, DecorationSet, type EditorView } from '@milkdown/kit/prose/view';
import { keymap } from '@milkdown/kit/prose/keymap';
import { anchorOf, CanonicalText, findQuote, ID_PATTERN, parseCommentAnchor, type CommentAnchor } from './anchor';

/** One thread as the host gives it (contract section 4). */
export type ThreadRef = {
  id: string;
  anchor: CommentAnchor | null;
  resolved: boolean;
  count: number;
  label?: string;
  /** Host version of the thread (ISO 8601), echoed as `base` when the anchor is refreshed (contract v1.2). */
  updatedAt?: string;
};

export type ThreadStatus = 'attached' | 'orphaned' | 'page' | 'unknown';

/** Yjs relative positions, provided by the collaboration chunk while a session is bound. */
export type YjsAnchors = {
  encode: (pos: number, assoc: -1 | 0 | 1) => string | null;
  decode: (value: string) => number | null;
};

export type CommentsHost = {
  root: HTMLElement;
  /** Polite announcement in the editor's live region. */
  announce: (key: string, params: Record<string, string | number>) => void;
  /** The Yjs adapter, or null without collaboration. */
  yjs: () => YjsAnchors | null;
  /** Whether the viewer may start threads (`comments.can_create`). */
  canCreate: boolean;
};

/** At most this many threads are kept (the rest is ignored with a console warning). */
export const MAX_THREADS = 2000;
/** Debounce of the quote search after document changes (ms). */
export const RESOLVE_DELAY = 300;
/** Debounce of `comment-anchors-changed` (ms). */
export const REFRESH_DELAY = 2000;
/** Nodes whose inner selection belongs to another editor (CodeMirror, math): no comments there (Q3). */
const EXCLUDED = new Set(['code_block', 'math_block', 'math_inline']);

type Range = { from: number; to: number };
type State = {
  threads: Map<string, ThreadRef>;
  ranges: Map<string, Range | null>;
  active: string | null;
  /** Thread whose highlight flashes (revealed from the panel). */
  flash: string | null;
  showResolved: boolean;
  decorations: DecorationSet;
};
type Meta = Partial<Pick<State, 'threads' | 'ranges' | 'active' | 'flash' | 'showResolved'>>;

/** How long a revealed highlight flashes (ms). */
export const FLASH_MS = 1500;

/** Thread counts for a host badge (contract 1.6, drawer): open = not resolved, anchored or page-level. */
export type CommentCounts = { open: number; resolved: number; orphaned: number; page: number; total: number };

/**
 * Counts the threads of a state.
 *
 * @param state - The editor state
 * @returns The counts
 */
export function counts(state: EditorState): CommentCounts {
  const s = commentsKey.getState(state);
  const out: CommentCounts = { open: 0, resolved: 0, orphaned: 0, page: 0, total: 0 };
  if (!s) return out;
  for (const thread of s.threads.values()) {
    out.total++;
    if (thread.resolved) out.resolved++;
    else out.open++;
    if (!thread.anchor) out.page++;
    else if (!s.ranges.get(thread.id)) out.orphaned++;
  }
  return out;
}

/** ISO 8601 date-time as hosts send it (validated, never parsed into the DOM). */
export const ISO_DATE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d{1,6})?)?(Z|[+-]\d{2}:?\d{2})$/;

export const commentsKey = new PluginKey<State>('nowo-milkdown-comments');

/**
 * Validates host threads; invalid entries are skipped.
 *
 * @param value - Untrusted list
 * @returns Valid threads by id (first one wins)
 */
export function parseThreads(value: unknown): Map<string, ThreadRef> {
  const out = new Map<string, ThreadRef>();
  if (!Array.isArray(value)) return out;
  if (value.length > MAX_THREADS) console.warn(`nowo-milkdown: only the first ${MAX_THREADS} comment threads are shown`);
  for (const item of value.slice(0, MAX_THREADS)) {
    const thread = parseThread(item);
    if (thread && !out.has(thread.id)) out.set(thread.id, thread);
  }
  return out;
}

/**
 * Validates one host thread.
 *
 * @param item - Untrusted value
 * @returns The thread, or null
 */
export function parseThread(item: unknown): ThreadRef | null {
  if (!item || typeof item !== 'object') return null;
  const t = item as Record<string, unknown>;
  if (typeof t.id !== 'string' || !ID_PATTERN.test(t.id)) return null;
  const anchor = t.anchor === null || t.anchor === undefined ? null : parseCommentAnchor(t.anchor);
  if (anchor === null && t.anchor !== null && t.anchor !== undefined) return null;
  const count = typeof t.count === 'number' && Number.isInteger(t.count) && t.count >= 0 ? Math.min(t.count, 1_000_000) : 0;
  const thread: ThreadRef = { id: t.id, anchor, resolved: t.resolved === true, count };
  if (typeof t.label === 'string' && t.label !== '') thread.label = t.label.slice(0, 200);
  if (typeof t.updatedAt === 'string' && ISO_DATE.test(t.updatedAt)) thread.updatedAt = t.updatedAt;
  return thread;
}

function decorate(doc: EditorState['doc'], s: Omit<State, 'decorations'>): DecorationSet {
  const list: Decoration[] = [];
  for (const [id, range] of s.ranges) {
    const thread = s.threads.get(id);
    if (!range || !thread || (thread.resolved && !s.showResolved)) continue;
    const cls = ['nowo-milkdown-comment'];
    if (thread.resolved) cls.push('nowo-milkdown-comment--resolved');
    if (s.active === id) cls.push('nowo-milkdown-comment--active');
    if (s.flash === id) cls.push('nowo-milkdown-comment--flash');
    list.push(Decoration.inline(range.from, range.to, { class: cls.join(' '), 'data-comment-id': id }, { id }));
  }
  return DecorationSet.create(doc, list);
}

/**
 * Attached threads in document order (resolved ones only when shown).
 *
 * @param state - The editor state
 * @returns Thread ids and ranges
 */
export function ordered(state: EditorState): { id: string; range: Range }[] {
  const s = commentsKey.getState(state);
  if (!s) return [];
  const out: { id: string; range: Range }[] = [];
  for (const [id, range] of s.ranges) {
    const thread = s.threads.get(id);
    if (range && thread && (!thread.resolved || s.showResolved)) out.push({ id, range });
  }
  return out.sort((a, b) => a.range.from - b.range.from || a.range.to - b.range.to);
}

/** Whether a range lies (partly) inside a node that owns its own selection (code, math). */
function inExcluded(state: EditorState, from: number, to: number): boolean {
  let excluded = false;
  state.doc.nodesBetween(from, to, (node) => {
    if (EXCLUDED.has(node.type.name)) excluded = true;
    return !excluded;
  });
  const $from = state.doc.resolve(from);
  for (let d = $from.depth; d > 0; d--) if (EXCLUDED.has($from.node(d).type.name)) return true;
  return excluded;
}

/**
 * Resolves one thread on the current document (contract section 3): Yjs first, then the quote.
 *
 * @param state - The editor state
 * @param canonical - Its canonical text
 * @param thread - The thread
 * @param yjs - The Yjs adapter, or null
 * @returns The range, or null when orphaned (page-level threads too)
 */
export function resolveThread(state: EditorState, canonical: CanonicalText, thread: ThreadRef, yjs: YjsAnchors | null): Range | null {
  const anchor = thread.anchor;
  if (!anchor) return null;
  if (yjs && anchor.yjs) {
    const from = yjs.decode(anchor.yjs.start);
    const to = yjs.decode(anchor.yjs.end);
    if (from !== null && to !== null && from < to && to <= state.doc.content.size) return { from, to };
  }
  const found = findQuote(canonical, anchor);
  return found ? { from: canonical.posAt(found.start), to: canonical.posAt(found.end, true) } : null;
}

/**
 * The anchor of a document range, with Yjs positions when collaborating.
 *
 * @param state - The editor state
 * @param from - Start position
 * @param to - End position
 * @param yjs - The Yjs adapter, or null
 * @param canonical - Precomputed canonical text (optional)
 * @returns The anchor, or null for an empty, oversized or excluded range
 */
export function rangeAnchor(state: EditorState, from: number, to: number, yjs: YjsAnchors | null, canonical = new CanonicalText(state.doc)): CommentAnchor | null {
  if (from >= to || inExcluded(state, from, to)) return null;
  const anchor = anchorOf(canonical, canonical.offsetAt(from), canonical.offsetAt(to));
  if (!anchor || anchor.quote.exact.trim() === '') return null;
  if (yjs) {
    const start = yjs.encode(from, 0);
    const end = yjs.encode(to, -1);
    if (start && end) anchor.yjs = { start, end };
  }
  return anchor;
}

const sameAnchor = (a: CommentAnchor, b: CommentAnchor): boolean =>
  a.quote.exact === b.quote.exact && a.quote.prefix === b.quote.prefix && a.quote.suffix === b.quote.suffix && a.position.start === b.position.start && a.block.index === b.block.index;

/** Dispatches a `nowo-milkdown:<name>` event on the widget root. */
export function emit<T>(root: HTMLElement, name: string, detail: T, cancelable = false): boolean {
  return root.dispatchEvent(new CustomEvent<T>(`nowo-milkdown:${name}`, { bubbles: true, cancelable, detail }));
}

/** Sets plugin meta on a transaction (no document change, not added to history). */
export function setMeta(view: EditorView, meta: Meta): void {
  view.dispatch(view.state.tr.setMeta(commentsKey, meta).setMeta('addToHistory', false));
}

/** Plugin view: resolution after changes, orphan / anchor events. */
export class CommentsView {
  private resolveTimer: ReturnType<typeof setTimeout> | null = null;
  private refreshTimer: ReturnType<typeof setTimeout> | null = null;
  private orphaned = new Set<string>();
  private drifted = new Map<string, CommentAnchor>();
  private lastCounts = '';

  constructor(
    private readonly view: EditorView,
    private readonly host: CommentsHost,
  ) {}

  update(view: EditorView, prev: EditorState): void {
    const s = commentsKey.getState(view.state);
    const p = commentsKey.getState(prev);
    if (!s) return;
    // Never dispatch from inside an update: resolve on a timer (0 ms for a new thread list).
    if (s.threads !== p?.threads) this.schedule(0);
    else if (!view.state.doc.eq(prev.doc)) this.schedule(RESOLVE_DELAY);
  }

  /** Resolves every thread after `delay` ms (a pending run is replaced). */
  schedule(delay: number): void {
    if (this.resolveTimer) clearTimeout(this.resolveTimer);
    this.resolveTimer = setTimeout(() => this.resolveNow(), delay);
  }

  /** Resolves every thread now, updates the decorations and reports orphans and drifted anchors. */
  resolveNow(): void {
    if (this.resolveTimer) clearTimeout(this.resolveTimer);
    this.resolveTimer = null;
    const state = this.view.state;
    const s = commentsKey.getState(state);
    if (!s) return;
    const canonical = new CanonicalText(state.doc);
    const yjs = this.host.yjs();
    const ranges = new Map<string, Range | null>();
    const orphaned: string[] = [];
    const attached: string[] = [];
    for (const thread of s.threads.values()) {
      const range = resolveThread(state, canonical, thread, yjs);
      ranges.set(thread.id, range);
      if (!thread.anchor) continue;
      if (!range && !this.orphaned.has(thread.id)) {
        this.orphaned.add(thread.id);
        orphaned.push(thread.id);
      } else if (range && this.orphaned.delete(thread.id)) attached.push(thread.id);
      if (range) {
        const now = rangeAnchor(state, range.from, range.to, yjs, canonical);
        if (now && (!sameAnchor(now, thread.anchor) || (yjs !== null && thread.anchor.yjs === null && now.yjs !== null))) this.drifted.set(thread.id, now);
      }
    }
    for (const id of this.orphaned) if (!s.threads.has(id)) this.orphaned.delete(id);
    setMeta(this.view, { ranges });
    if (orphaned.length || attached.length) emit(this.host.root, 'comment-orphaned', { orphaned, attached });
    const now = counts(this.view.state);
    const key = JSON.stringify(now);
    if (key !== this.lastCounts) {
      this.lastCounts = key;
      emit(this.host.root, 'comments-count', now);
    }
    if (this.drifted.size && !this.refreshTimer) this.refreshTimer = setTimeout(() => this.flushDrift(), REFRESH_DELAY);
  }

  /** Emits `comment-anchors-changed` and adopts the new anchors (each drift is reported once). */
  flushDrift(): void {
    this.refreshTimer = null;
    const s = commentsKey.getState(this.view.state);
    if (!s || !this.drifted.size) return;
    const anchors: { id: string; anchor: CommentAnchor }[] = [];
    const threads = new Map(s.threads);
    for (const [id, anchor] of this.drifted) {
      const thread = threads.get(id);
      if (!thread || this.orphaned.has(id)) continue;
      threads.set(id, { ...thread, anchor });
      anchors.push({ id, anchor });
    }
    this.drifted.clear();
    if (!anchors.length) return;
    setMeta(this.view, { threads });
    emit(this.host.root, 'comment-anchors-changed', { anchors });
  }

  /** Current status of a thread. */
  status(id: string): ThreadStatus {
    const s = commentsKey.getState(this.view.state);
    const thread = s?.threads.get(id);
    if (!s || !thread) return 'unknown';
    if (!thread.anchor) return 'page';
    return s.ranges.get(id) ? 'attached' : 'orphaned';
  }

  destroy(): void {
    if (this.resolveTimer) clearTimeout(this.resolveTimer);
    if (this.refreshTimer) clearTimeout(this.refreshTimer);
  }
}

const views = new WeakMap<EditorView, CommentsView>();

/** The plugin view of an editor (API and tests). */
export const commentsView = (view: EditorView): CommentsView | undefined => views.get(view);

/**
 * Moves to the next / previous attached thread, selects its text and marks it active.
 *
 * @param view - The editor view
 * @param host - Root and announcer
 * @param step - 1 (next) or -1 (previous)
 * @returns Whether a thread was focused
 */
export function step(view: EditorView, host: CommentsHost, step: 1 | -1): boolean {
  const list = ordered(view.state);
  if (!list.length) return false;
  const s = commentsKey.getState(view.state)!;
  const current = list.findIndex((t) => t.id === s.active);
  const head = view.state.selection.from;
  let index: number;
  if (current !== -1) index = (current + step + list.length) % list.length;
  else if (step === 1) index = Math.max(0, list.findIndex((t) => t.range.from >= head));
  else {
    const before = list.filter((t) => t.range.from < head);
    index = before.length ? list.indexOf(before[before.length - 1]!) : list.length - 1;
  }
  return focusThread(view, host, list[index]!.id, list);
}

/**
 * Selects a thread's text, scrolls to it and announces it.
 *
 * @param view - The editor view
 * @param host - Root and announcer
 * @param id - Thread id
 * @param list - Ordered attached threads (computed when omitted)
 * @returns False when the thread is not attached
 */
export function focusThread(view: EditorView, host: CommentsHost, id: string, list = ordered(view.state)): boolean {
  const index = list.findIndex((t) => t.id === id);
  if (index === -1) return false;
  const { range } = list[index]!;
  const thread = commentsKey.getState(view.state)!.threads.get(id)!;
  view.dispatch(
    view.state.tr
      .setSelection(TextSelection.create(view.state.doc, range.from, range.to))
      .setMeta(commentsKey, { active: id } satisfies Meta)
      .setMeta('addToHistory', false)
      .scrollIntoView(),
  );
  view.focus();
  host.announce(thread.label ? 'comments.position_label' : 'comments.position', { index: index + 1, count: list.length, label: thread.label ?? '' });
  return true;
}

/**
 * Scrolls a thread's text into view and flashes it, **without** moving focus (the panel keeps it: contract 1.6,
 * drawer). Reduced-motion users get a static outline instead of the animation (CSS).
 *
 * @param view - The editor view
 * @param id - Thread id
 * @returns False when the thread is not attached
 */
export function revealThread(view: EditorView, id: string): boolean {
  const s = commentsKey.getState(view.state);
  const range = s?.ranges.get(id);
  if (!s || !range) return false;
  setMeta(view, { active: id, flash: id });
  const at = view.domAtPos(range.from);
  const node = at.node instanceof Element ? at.node : at.node.parentElement;
  (view.dom.querySelector(`[data-comment-id="${CSS.escape(id)}"]`) ?? node)?.scrollIntoView({ block: 'center' });
  setTimeout(() => {
    if (!view.isDestroyed && commentsKey.getState(view.state)?.flash === id) setMeta(view, { flash: null });
  }, FLASH_MS);
  return true;
}

/**
 * Starts a comment on the selection: emits `comment-create` (cancelable).
 *
 * @param view - The editor view
 * @param host - Root and Yjs adapter
 * @returns The event detail, or null when the selection cannot be commented
 */
export function startComment(view: EditorView, host: CommentsHost): { anchor: CommentAnchor; text: string; cancelled: boolean } | null {
  if (!host.canCreate) return null;
  const { from, to } = view.state.selection;
  const anchor = rangeAnchor(view.state, from, to, host.yjs());
  if (!anchor) {
    host.announce('comments.no_selection', {});
    return null;
  }
  const detail = { anchor, text: anchor.quote.exact };
  const cancelled = !emit(host.root, 'comment-create', detail, true);
  return { ...detail, cancelled };
}

/** Opens a thread: emits `comment-open` (cancelable); `onOpen` runs when not cancelled (built-in component). */
export function openThread(host: CommentsHost, id: string, onOpen: ((id: string) => void) | null): void {
  if (emit(host.root, 'comment-open', { id }, true)) onOpen?.(id);
}

/**
 * The `comments` ProseMirror plugin.
 *
 * @param host - Root, announcer, Yjs adapter and permissions
 * @param hooks - `create` / `open` of the built-in thread component (null: hooks only)
 * @returns The plugins (state + view, keymap)
 */
export function commentsPlugins(host: CommentsHost, hooks: { create: ((detail: { anchor: CommentAnchor; text: string }) => void) | null; open: ((id: string) => void) | null }): Plugin[] {
  const start = (_state: EditorState, _dispatch: unknown, view?: EditorView): boolean => {
    if (!view) return false;
    const started = startComment(view, host);
    if (started && !started.cancelled) hooks.create?.(started);
    return started !== null || !view.state.selection.empty;
  };
  const state = new Plugin<State>({
    key: commentsKey,
    state: {
      init: (_config, editorState) => {
        const s = { threads: new Map<string, ThreadRef>(), ranges: new Map<string, Range | null>(), active: null, flash: null, showResolved: false };
        return { ...s, decorations: decorate(editorState.doc, s) };
      },
      apply(tr: Transaction, prev: State, _old, next): State {
        const meta = tr.getMeta(commentsKey) as Meta | undefined;
        let ranges = prev.ranges;
        if (tr.docChanged) {
          ranges = new Map();
          for (const [id, range] of prev.ranges) {
            if (!range) {
              ranges.set(id, null);
              continue;
            }
            const from = tr.mapping.map(range.from, 1);
            const to = tr.mapping.map(range.to, -1);
            ranges.set(id, from < to ? { from, to } : null);
          }
        }
        if (!meta && !tr.docChanged) return prev;
        const s = {
          threads: meta?.threads ?? prev.threads,
          ranges: meta?.ranges ?? ranges,
          active: meta && 'active' in meta ? (meta.active ?? null) : prev.active,
          flash: meta && 'flash' in meta ? (meta.flash ?? null) : prev.flash,
          showResolved: meta?.showResolved ?? prev.showResolved,
        };
        if (s.active && !s.ranges.get(s.active)) s.active = null;
        return { ...s, decorations: decorate(next.doc, s) };
      },
    },
    props: {
      decorations: (editorState) => commentsKey.getState(editorState)?.decorations ?? DecorationSet.empty,
      handleClick(view, _pos, event) {
        const target = (event.target as Element | null)?.closest?.('[data-comment-id]');
        const id = target?.getAttribute('data-comment-id');
        if (!id || !commentsKey.getState(view.state)?.threads.has(id)) return false;
        setMeta(view, { active: id });
        openThread(host, id, hooks.open);
        return false;
      },
    },
    view(view) {
      const plugin = new CommentsView(view, host);
      views.set(view, plugin);
      return plugin;
    },
  });
  const keys = keymap({
    'Mod-Alt-m': start,
    'Mod-Alt-PageDown': (_s, _d, view) => (view ? step(view, host, 1) : false),
    'Mod-Alt-PageUp': (_s, _d, view) => (view ? step(view, host, -1) : false),
    Enter: (editorState, _d, view) => {
      const s = commentsKey.getState(editorState);
      const range = s?.active ? s.ranges.get(s.active) : null;
      if (!view || !s?.active || !range) return false;
      const { from, to } = editorState.selection;
      if (from !== range.from || to !== range.to) return false;
      openThread(host, s.active, hooks.open);
      return true;
    },
    Escape: (editorState, _d, view) => {
      if (!view || !commentsKey.getState(editorState)?.active) return false;
      setMeta(view, { active: null });
      return true;
    },
  });
  return [state, keys];
}
