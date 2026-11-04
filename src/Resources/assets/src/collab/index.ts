/**
 * Collaboration entry, loaded only when the form enables it: Milkdown's collab plugin bound to a Yjs document
 * relayed by {@link MercureProvider}.
 */
import type { Editor } from '@milkdown/kit/core';
import { collab, collabServiceCtx } from '@milkdown/plugin-collab';
import * as Y from 'yjs';
import { absolutePositionToRelativePosition, relativePositionToAbsolutePosition, ySyncPluginKey } from 'y-prosemirror';
import type { EditorState } from '@milkdown/kit/prose/state';
import type { YjsAnchors } from '../comments/plugin';
import { MercureProvider, fromBase64, toBase64, type Status } from './mercure-provider';
import type { CollaborationOptions } from '../types';

export { collab };

export type Collaboration = { provider: MercureProvider; stop: () => void };

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

export async function startCollaboration(
  editor: Editor,
  options: CollaborationOptions,
  template: string,
  onStatus: (s: Status) => void,
  onReloadPaused: () => void = () => undefined,
): Promise<Collaboration> {
  const doc = new Y.Doc();
  const provider = new MercureProvider(doc, options.url, options.hubUrl, options.topic, { updateDelay: options.updateDelay, awarenessDelay: options.awarenessDelay, maxUpdateBytes: options.maxUpdateBytes });
  provider.awareness.setLocalStateField('user', options.user);
  provider.onStatus((s) => {
    onStatus(s);
    // 1.2: the host replaced the document (restore, import, conversion): show the notice, then load the new content.
    if (s !== 'reset') return;
    if (allowReload(options.topic)) window.setTimeout(() => page.reload(), RESET_RELOAD_DELAY);
    else onReloadPaused();
  });
  await provider.connect();
  editor.action((ctx) => {
    const service = ctx.get(collabServiceCtx);
    service.setOptions({ yCursorOpts: { cursorBuilder, selectionBuilder } });
    service.bindDoc(doc).setAwareness(provider.awareness);
    if (provider.seed) service.applyTemplate(template);
    service.connect();
  });
  return {
    provider,
    stop: () => {
      editor.action((ctx) => ctx.get(collabServiceCtx).disconnect());
      provider.disconnect();
    },
  };
}
