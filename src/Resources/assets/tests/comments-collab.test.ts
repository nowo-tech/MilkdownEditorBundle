import { afterEach, describe, expect, it, vi } from 'vitest';
import * as Y from 'yjs';
import { editorViewCtx } from '@milkdown/kit/core';
import { TextSelection } from '@milkdown/kit/prose/state';
import { EditorState } from '@milkdown/kit/prose/state';
import { Schema } from '@milkdown/kit/prose/model';
import { editor, tick } from './helpers';
import { toBase64 } from '../src/collab/mercure-provider';
import { yjsAnchors } from '../src/collab/index';
import { CanonicalText } from '../src/comments/anchor';
import type { MilkdownEditorHandle } from '../src/editor';

class FakeEventSource {
  onopen: (() => void) | null = null;
  onerror: (() => void) | null = null;
  onmessage: ((e: MessageEvent<string>) => void) | null = null;
  constructor() {
    setTimeout(() => this.onopen?.(), 0);
  }
  close() {}
}

let handle: MilkdownEditorHandle | null = null;
afterEach(async () => {
  await handle?.destroy();
  handle = null;
  vi.unstubAllGlobals();
});

describe('comments while co-editing (1.6)', () => {
  it('anchors carry Yjs relative positions that follow edits before the quote', async () => {
    vi.stubGlobal('EventSource', FakeEventSource);
    vi.stubGlobal('fetch', vi.fn(async (url: string) => (url.endsWith('/state') ? new Response(JSON.stringify({ state: toBase64(Y.encodeStateAsUpdate(new Y.Doc())), seed: true })) : new Response(''))));
    handle = await editor('Alpha beta gamma.', {
      features: ['comments'],
      comments: {},
      collaboration: { url: '/c', hubUrl: '/hub', topic: 't', user: { name: 'Ada', color: '#123456' } },
    });
    await tick(20);
    const view = handle.builder.editor.action((ctx) => ctx.get(editorViewCtx));
    const c = new CanonicalText(view.state.doc);
    const at = c.text.indexOf('beta');
    view.dispatch(view.state.tr.setSelection(TextSelection.create(view.state.doc, c.posAt(at), c.posAt(at + 4, true))));
    const anchor = handle.comments!.selectionAnchor()!;
    expect(anchor.yjs?.start).toMatch(/^[A-Za-z0-9+/]+=*$/);
    // Change the quoted word itself: the quote no longer matches, the relative positions still do.
    handle.comments!.set([{ id: 't1', anchor, resolved: false, count: 1 }]);
    await tick(5);
    const from = c.posAt(at);
    view.dispatch(view.state.tr.insertText('BETA', from, from + 4));
    await tick(400);
    expect(handle.comments!.status('t1')).toBe('attached');
    expect(view.dom.querySelector('[data-comment-id="t1"]')?.textContent).toBe('BETA');
    const adapter = yjsAnchors(() => view.state);
    expect(adapter.decode('!!not base64')).toBeNull();
    expect(adapter.encode(1, 0)).toMatch(/^[A-Za-z0-9+/]+=*$/);
  });

  it('is inert without a bound document', () => {
    const state = EditorState.create({ schema: new Schema({ nodes: { doc: { content: 'text*' }, text: {} } }) });
    const adapter = yjsAnchors(() => state);
    expect(adapter.encode(1, 0)).toBeNull();
    expect(adapter.decode('AAAA')).toBeNull();
  });
});
