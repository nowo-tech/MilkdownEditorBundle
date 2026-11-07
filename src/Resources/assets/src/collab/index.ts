/**
 * Collaboration entry, loaded only when the form enables it: Milkdown's collab plugin bound to a Yjs document
 * relayed by {@link MercureProvider}.
 */
import type { Editor } from '@milkdown/kit/core';
import { collab, collabServiceCtx } from '@milkdown/plugin-collab';
import * as Y from 'yjs';
import { absolutePositionToRelativePosition, relativePositionToAbsolutePosition, ySyncPluginKey } from 'y-prosemirror';
import { Plugin, type EditorState } from '@milkdown/kit/prose/state';
import type { YjsAnchors } from '../comments/plugin';
import { MercureProvider, fromBase64, toBase64, type Status } from './mercure-provider';
import type { CollaborationOptions } from '../types';

export { collab };

export type Collaboration = {
  provider: MercureProvider;
  /** Resolves when the editor stopped waiting (bound, or standalone); never rejects. */
  ready: Promise<void>;
  /** Whether the shared document is bound to the editor (false while waiting and while standalone). */
  bound: () => boolean;
  /** The document changed: a standalone session ends on the first edit (no presence, no claim, no late bind). */
  edited: () => void;
  stop: () => void;
};

type Peer = { name?: unknown; color?: unknown };

/** A peer's colour, accepted only as `#rrggbb` (awareness states come from other clients). */
export const safeColor = (color: unknown): string => (typeof color === 'string' && /^#[0-9a-f]{6}$/i.test(color) ? color : '#6b7280');

/**
 * Remote caret built with DOM APIs and CSSOM (y-prosemirror's default writes the peer's colour into a style string).
 *
 * @param user - The peer's awareness `user` field
 * @returns The caret element
 */
export function cursorBuilder(user: Peer): HTMLElement {
  const cursor = document.createElement('span');
  cursor.className = 'ProseMirror-yjs-cursor';
  cursor.style.borderColor = safeColor(user.color);
  const label = document.createElement('div');
  label.style.backgroundColor = safeColor(user.color);
  label.textContent = typeof user.name === 'string' ? user.name.slice(0, 40) : '';
  cursor.append(document.createTextNode('\u2060'), label, document.createTextNode('\u2060'));
  return cursor;
}

/**
 * Remote selection highlight with a validated colour.
 *
 * @param user - The peer's awareness `user` field
 * @returns Decoration attributes
 */
export const selectionBuilder = (user: Peer): { style: string; class: string } => ({
  style: `background-color: ${safeColor(user.color)}70`,
  class: 'ProseMirror-yjs-selection',
});

type SyncState = { type: Y.XmlFragment; doc: Y.Doc; binding: { mapping: Map<unknown, unknown> } | null } | undefined;

/**
 * Yjs relative positions for comment anchors (1.6): base64 of `Y.encodeRelativePosition`, decoded in a try / catch
 * and only ever handed to Yjs. Null while no document is bound.
 *
 * @param state - Returns the current editor state
 * @returns The adapter
 */
export function yjsAnchors(state: () => EditorState): YjsAnchors {
  const sync = (): SyncState => ySyncPluginKey.getState(state()) as SyncState;
  return {
    encode: (pos) => {
      const s = sync();
      if (!s?.binding) return null;
      try {
        return toBase64(Y.encodeRelativePosition(absolutePositionToRelativePosition(pos, s.type, s.binding.mapping as never)));
      } catch {
        return null;
      }
    },
    decode: (value) => {
      const s = sync();
      if (!s?.binding) return null;
      try {
        return relativePositionToAbsolutePosition(s.doc, s.type, Y.decodeRelativePosition(fromBase64(value)), s.binding.mapping as never);
      } catch {
        return null;
      }
    },
  };
}

/** Delay before an editor whose document was replaced on the server reloads the page (ms). */
export const RESET_RELOAD_DELAY = 1500;

/** How the page is reloaded after a reset (replaceable in tests). */
export const page = { reload: (): void => window.location.reload() };

/** At most this many automatic reloads per topic and window (CX-L1); then the editor waits for a manual reload. */
export const RELOAD_CAP = 3;
export const RELOAD_WINDOW = 5 * 60 * 1000;

const sessionStore = (): Storage | null => {
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
};

/**
 * Records an automatic reload of the topic in sessionStorage; false once {@link RELOAD_CAP} reloads happened within
 * {@link RELOAD_WINDOW} (a host resetting again and again must not trap the tab in a reload loop).
 */
export function allowReload(topic: string, storage: Storage | null = sessionStore(), now: number = Date.now()): boolean {
  const key = `nowo-milkdown-reloads:${topic}`;
  let times: unknown;
  try {
    times = JSON.parse(storage?.getItem(key) ?? '[]');
  } catch {
    times = [];
  }
  const recent = (Array.isArray(times) ? times : []).filter((t): t is number => typeof t === 'number' && now - t < RELOAD_WINDOW);
  if (recent.length >= RELOAD_CAP) return false;
  try {
    storage?.setItem(key, JSON.stringify([...recent, now]));
  } catch {
    // Storage full or blocked: the reload still happens.
  }
  return true;
}

/** How long the editor waits for the shared document before it offers editing without collaboration (ms, 1.10). */
export const DEFAULT_CONNECT_TIMEOUT = 5000;
export const MAX_CONNECT_TIMEOUT = 60_000;
/**
 * A client waiting on another client's seed asks again this often (ms), unless its tab is hidden. Its request also claims the seed once the claim
 * has gone stale, so a holder that left does not leave the document unseeded (WikiBundle's `seed_timeout` is 30 s).
 */
export const SEED_RECHECK = 31_000;

/** `standalone` (1.10): no shared document; the editor holds the field's content and edits it like any other field. */
export type SessionStatus = Status | 'standalone';

export type CollaborationHooks = {
  /** What the person should see: never `online` before the document is bound. */
  onStatus: (status: SessionStatus) => void;
  /** Automatic reloads are capped: the person reloads by hand. */
  onReloadPaused: () => void;
  /** 1.12: the log was replaced and this tab holds the person's own edits: it stays, with them, and says so. */
  onReplaced?: () => void;
  /** The wait is over (about to bind, or standalone): the editor can be edited. May run again on a late bind. */
  onReady: () => void;
  /** False once the person changed the content while standalone: a late bind would replace it. */
  isUntouched: () => boolean;
};

const isEmptyParagraph = (node: unknown): boolean =>
  node instanceof Y.XmlElement && node.nodeName === 'paragraph' && node.toArray().every((child) => child instanceof Y.XmlText && child.toString().trim() === '');

/**
 * Whether the shared document shows nothing: no blocks, or only paragraphs without text. The text is what counts: a log
 * whose text was deleted keeps its paragraph and an empty text child, and an editor bound to an empty document writes an
 * empty paragraph. Anything else (an image, a rule) is content.
 *
 * @param fragment - The document's root fragment
 * @returns True when there is nothing to show
 */
export function isBlank(fragment: Y.XmlFragment): boolean {
  return fragment.toArray().every(isEmptyParagraph);
}

/**
 * Refuses document changes while the editor waits for the shared document: a backstop for what `editable: false` does
 * not stop (buttons, menus, plugins that dispatch). It also reports changes, so a standalone session ends on the first edit.
 *
 * @param locked - Whether the editor is waiting
 * @param changed - Called after the document changed
 * @returns The ProseMirror plugin
 */
export const waitPlugin = (locked: () => boolean, changed: () => void = () => undefined): Plugin =>
  new Plugin({
    filterTransaction: (tr) => !tr.docChanged || !locked(),
    view: () => ({
      update: (view, previous) => {
        if (!view.state.doc.eq(previous.doc)) changed();
      },
    }),
  });

/**
 * Connects and binds the shared document (1.10: time-bound, and only when binding cannot lose anything).
 *
 * The editor stays locked until one of these happens, at most `connectTimeout` ms later:
 * - **bound**: the state is applied and shows content, or this client seeds it, or the field is empty too.
 * - **standalone**: the deadline passed, the host refused (token, state), the state is unusable or the log is corrupt. The
 *   person edits the field's content without collaboration.
 *
 * A standalone editor binds later only if the connection arrives and the content is untouched. Once the person changed
 * it the session ends: nothing is sent, nothing replaces their text, and the form saves it as any save outside a session.
 *
 * @param editor - The Milkdown editor (already created)
 * @param options - The collaboration options
 * @param template - The field's Markdown (the seed)
 * @param hooks - What the editor does on each change
 * @returns The session; `ready` resolves when the wait is over and never rejects
 */
export function startCollaboration(editor: Editor, options: CollaborationOptions, template: string, hooks: CollaborationHooks): Collaboration {
  const doc = new Y.Doc();
  const fragment = doc.getXmlFragment('prosemirror');
  const provider = new MercureProvider(doc, options.url, options.hubUrl, options.topic, { updateDelay: options.updateDelay, awarenessDelay: options.awarenessDelay, maxUpdateBytes: options.maxUpdateBytes });
  provider.awareness.setLocalStateField('user', options.user);
  // No presence and no compaction until this client is in the session.
  provider.quiet = true;
  let phase: 'waiting' | 'bound' | 'standalone' = 'waiting';
  let ended = false;
  let binding = false;
  let recheck = 0;
  let reloadTimer = 0;
  let settle = (): void => undefined;
  const ready = new Promise<void>((resolve) => {
    settle = resolve;
  });
  const end = (): void => {
    if (ended) return;
    ended = true;
    window.clearTimeout(recheck);
    doc.off('update', onDocument);
    provider.disconnect();
  };
  const fallback = (): void => {
    if (phase !== 'waiting') return;
    phase = 'standalone';
    window.clearTimeout(deadline);
    hooks.onReady();
    hooks.onStatus('standalone');
    settle();
  };
  const waitingOnSeed = (): boolean => !provider.seed && isBlank(fragment) && template.trim() !== '';
  const askAgain = (): void => {
    window.clearTimeout(recheck);
    recheck = window.setTimeout(() => {
      if (phase === 'bound' || ended) return;
      // Not from a hidden tab: nobody is there to join.
      if (provider.status === 'online' && waitingOnSeed() && !document.hidden) void provider.connect().catch(() => undefined);
      askAgain();
    }, SEED_RECHECK);
  };
  const tryBind = (): void => {
    if (phase === 'bound' || ended || provider.status !== 'online') return;
    // An empty state with no order to seed: another client holds the seed, or the host lost its log. Binding would show
    // nothing and save nothing over the field's content, so wait for the content to arrive.
    if (waitingOnSeed()) {
      if (!recheck) askAgain();
      return;
    }
    if (phase === 'standalone' && !hooks.isUntouched()) {
      end();
      return;
    }
    // Before the bind: what follows it (heading ids) must not be refused as an edit.
    hooks.onReady();
    binding = true;
    try {
      editor.action((ctx) => {
        const service = ctx.get(collabServiceCtx);
        service.setOptions({ yCursorOpts: { cursorBuilder, selectionBuilder } });
        service.bindDoc(doc).setAwareness(provider.awareness);
        // Only a blank document is seeded (the default condition looks at the text, so it replaces an image-only one).
        if (provider.seed) service.applyTemplate(template, () => isBlank(fragment));
        service.connect();
      });
    } catch (error) {
      console.error('nowo-milkdown', error);
      binding = false;
      fallback();
      end();
      return;
    }
    binding = false;
    phase = 'bound';
    window.clearTimeout(deadline);
    window.clearTimeout(recheck);
    doc.off('update', onDocument);
    provider.join();
    hooks.onStatus(provider.status);
    settle();
  };
  // Runs inside Yjs's update event: bind after it.
  const onDocument = (): void => queueMicrotask(tryBind);
  doc.on('update', onDocument);
  provider.onStatus((s) => {
    // 1.2: the host replaced the document (restore, import, conversion): show the notice, then load the new content.
    if (s === 'reset') {
      // Text typed without collaboration is not given up for a reload: the person saves it.
      if (phase === 'standalone' && !hooks.isUntouched()) {
        end();
        return;
      }
      // 1.12, with a host that names its logs: a reload would lose what the person wrote here. A save asks instead.
      const holdsEdits = (): boolean => phase === 'bound' && provider.epoch !== null && provider.hasLocalEdits && !hooks.isUntouched();
      const keep = (): void => {
        end();
        hooks.onReplaced?.();
      };
      if (holdsEdits()) {
        keep();
        return;
      }
      hooks.onStatus(s);
      if (allowReload(options.topic)) {
        reloadTimer = window.setTimeout(() => {
          // Again now: the person may have typed since the notice.
          if (phase === 'standalone' && !hooks.isUntouched()) {
            end();
            hooks.onStatus('standalone');
            return;
          }
          if (holdsEdits()) {
            keep();
            return;
          }
          page.reload();
        }, RESET_RELOAD_DELAY);
      } else {
        fallback();
        hooks.onReloadPaused();
      }
      return;
    }
    if (phase === 'bound') {
      hooks.onStatus(s);
      return;
    }
    if (provider.failed) {
      fallback();
      end();
      return;
    }
    // A corrupt log: no document to bind. The hub stays open for the host's reset, which reloads an untouched editor.
    if (provider.corrupt) {
      fallback();
      return;
    }
    if (s === 'online') tryBind();
    else if (phase === 'waiting') hooks.onStatus('connecting');
  });
  const timeout = typeof options.connectTimeout === 'number' && Number.isFinite(options.connectTimeout) ? Math.min(MAX_CONNECT_TIMEOUT, Math.max(0, Math.round(options.connectTimeout))) : DEFAULT_CONNECT_TIMEOUT;
  const deadline = window.setTimeout(fallback, timeout);
  void provider.connect().catch(() => undefined);
  return {
    provider,
    ready,
    bound: () => phase === 'bound',
    edited: () => {
      if (phase === 'standalone' && !binding && !hooks.isUntouched()) end();
    },
    stop: () => {
      window.clearTimeout(deadline);
      window.clearTimeout(reloadTimer);
      if (phase === 'bound') editor.action((ctx) => ctx.get(collabServiceCtx).disconnect());
      end();
      settle();
    },
  };
}
