/**
 * Collaboration entry, loaded only when the form enables it: Milkdown's collab plugin bound to a Yjs document
 * relayed by {@link MercureProvider}.
 */
import type { Editor } from '@milkdown/kit/core';
import { collab, collabServiceCtx } from '@milkdown/plugin-collab';
import * as Y from 'yjs';
import { MercureProvider, type Status } from './mercure-provider';
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

export async function startCollaboration(editor: Editor, options: CollaborationOptions, template: string, onStatus: (s: Status) => void): Promise<Collaboration> {
  const doc = new Y.Doc();
  const provider = new MercureProvider(doc, options.url, options.hubUrl, options.topic);
  provider.awareness.setLocalStateField('user', options.user);
  provider.onStatus(onStatus);
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
