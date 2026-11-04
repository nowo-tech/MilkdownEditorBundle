/**
 * `comments` chunk (1.6): the Milkdown plugins and the `handle.comments` API (contract section 4).
 */
import type { Editor } from '@milkdown/kit/core';
import { editorViewCtx } from '@milkdown/kit/core';
import { $prose } from '@milkdown/kit/utils';
import type { EditorView } from '@milkdown/kit/prose/view';
import { CanonicalText, type CommentAnchor } from './anchor';
import {
  commentsKey,
  commentsPlugins,
  commentsView,
  counts,
  focusThread,
  ordered,
  parseThread,
  parseThreads,
  rangeAnchor,
  revealThread,
  setMeta,
  startComment,
  step,
  type CommentCounts,
  type CommentsHost,
  type ThreadRef,
  type ThreadStatus,
} from './plugin';

export { parseCommentAnchor, type CommentAnchor } from './anchor';
export type { ThreadRef, ThreadStatus, YjsAnchors, CommentsHost, CommentCounts } from './plugin';

export type CommentsApi = {
  set: (threads: ThreadRef[]) => void;
  upsert: (thread: ThreadRef) => void;
  remove: (id: string) => void;
  status: (id: string) => ThreadStatus;
  selectionAnchor: () => CommentAnchor | null;
  start: () => void;
  focus: (id: string) => boolean;
  next: () => boolean;
  previous: () => boolean;
  showResolved: (on: boolean) => void;
  snapshot: () => { id: string; anchor: CommentAnchor }[];
  refresh: (ids?: string[]) => Promise<void>;
  open: (id: string) => void;
  /** Scrolls to a thread's text and flashes it without moving focus (drawer → text). */
  reveal: (id: string) => boolean;
  /** Thread counts for a tab badge (also sent as `nowo-milkdown:comments-count`). */
  count: () => CommentCounts;
  /**
   * Moves the thread component into a host container (`panel: 'container'`); false without a component, after
   * destroy, or when the element is inside an editor, a read view or contenteditable.
   */
  mount: (container: HTMLElement) => boolean;
};

/** Hooks of the optional thread component (null: hooks-only mode). */
export type ThreadUi = {
  create: (detail: { anchor: CommentAnchor; text: string }) => void;
  open: (id: string) => void;
  refresh: (ids?: string[]) => Promise<void>;
  /** False when the element is inside an editor, a read view or contenteditable (it would be saved), or after destroy. */
  mount: (container: HTMLElement) => boolean;
};

/**
 * Vertical offsets (relative to `surface`) of attached highlights, for the margin layout.
 *
 * @param editor - The created editor
 * @param surface - The editor surface
 * @returns Thread id → top in px
 */
export function threadTops(editor: Editor, surface: HTMLElement): Map<string, number> {
  return editor.action((ctx) => {
    const view = ctx.get(editorViewCtx);
    const base = surface.getBoundingClientRect().top;
    const out = new Map<string, number>();
    for (const { id, range } of ordered(view.state)) {
      try {
        out.set(id, Math.max(0, view.coordsAtPos(range.from).top - base));
      } catch {
        out.set(id, 0);
      }
    }
    return out;
  });
}

/**
 * Registers the comment plugins on an editor (before `create()`).
 *
 * @param editor - The Milkdown editor
 * @param host - Root, announcer, Yjs adapter and permissions
 * @param ui - The thread component hooks, read lazily (it mounts after the editor)
 */
export function useComments(editor: Editor, host: CommentsHost, ui: () => ThreadUi | null): void {
  const [state, keys] = commentsPlugins(host, {
    create: (detail) => ui()?.create(detail),
    open: (id) => ui()?.open(id),
  });
  editor.use($prose(() => state!)).use($prose(() => keys!));
}

/**
 * The `handle.comments` API of a created editor. After the editor is destroyed every call is a no-op that returns an
 * empty value (`unknown`, `false`, `null`, zero counts) instead of throwing (audit DW-I5).
 *
 * @param editor - The created editor
 * @param host - Root, announcer, Yjs adapter and permissions
 * @param ui - The thread component hooks
 * @param alive - False once the editor is destroyed
 * @returns The API
 */
export function commentsApi(editor: Editor, host: CommentsHost, ui: () => ThreadUi | null, alive: () => boolean = () => true): CommentsApi {
  const withView = <T>(fallback: T, run: (view: EditorView) => T): T => (alive() ? editor.action((ctx) => run(ctx.get(editorViewCtx))) : fallback);
  const threads = (view: EditorView): Map<string, ThreadRef> => commentsKey.getState(view.state)?.threads ?? new Map();
  return {
    // Threads are resolved at once, so `status()` and a panel rendered right after `set()` see their ranges.
    set: (list) =>
      withView(undefined, (view) => {
        setMeta(view, { threads: parseThreads(list) });
        commentsView(view)?.resolveNow();
      }),
    upsert: (thread) =>
      withView(undefined, (view) => {
        const valid = parseThread(thread);
        if (!valid) return;
        const next = new Map(threads(view));
        next.set(valid.id, valid);
        setMeta(view, { threads: next });
        commentsView(view)?.resolveNow();
      }),
    remove: (id) =>
      withView(undefined, (view) => {
        const next = new Map(threads(view));
        if (next.delete(id)) setMeta(view, { threads: next });
      }),
    status: (id) => withView<ThreadStatus>('unknown', (view) => commentsView(view)?.status(id) ?? 'unknown'),
    selectionAnchor: () =>
      withView<CommentAnchor | null>(null, (view) => (host.canCreate ? rangeAnchor(view.state, view.state.selection.from, view.state.selection.to, host.yjs()) : null)),
    start: () =>
      withView(undefined, (view) => {
        const started = startComment(view, host);
        if (started && !started.cancelled) ui()?.create(started);
      }),
    focus: (id) => withView(false, (view) => focusThread(view, host, id)),
    next: () => withView(false, (view) => step(view, host, 1)),
    previous: () => withView(false, (view) => step(view, host, -1)),
    showResolved: (on) => withView(undefined, (view) => setMeta(view, { showResolved: on })),
    snapshot: () =>
      withView<{ id: string; anchor: CommentAnchor }[]>([], (view) => {
        const canonical = new CanonicalText(view.state.doc);
        const yjs = host.yjs();
        return ordered(view.state).flatMap(({ id, range }) => {
          const anchor = rangeAnchor(view.state, range.from, range.to, yjs, canonical);
          return anchor ? [{ id, anchor }] : [];
        });
      }),
    refresh: async (ids) => {
      if (alive()) await ui()?.refresh(ids);
    },
    open: (id) => {
      if (alive()) ui()?.open(id);
    },
    reveal: (id) => withView(false, (view) => revealThread(view, id)),
    count: () => withView<CommentCounts>({ open: 0, resolved: 0, orphaned: 0, page: 0, total: 0 }, (view) => counts(view.state)),
    mount: (container) => {
      const component = alive() ? ui() : null;
      return component ? component.mount(container) : false;
    },
  };
}
