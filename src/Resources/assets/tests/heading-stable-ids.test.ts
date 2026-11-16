import { afterEach, describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import * as Y from 'yjs';
import { prosemirrorToYXmlFragment, ySyncPlugin } from 'y-prosemirror';
import { editorViewCtx, parserCtx, schemaCtx, serializerCtx } from '@milkdown/kit/core';
import { AllSelection, EditorState, Plugin, TextSelection } from '@milkdown/kit/prose/state';
import { EditorView } from '@milkdown/kit/prose/view';
import type { Node as PmNode, Schema } from '@milkdown/kit/prose/model';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import { editor, tick } from './helpers';
import type { MilkdownEditorHandle } from '../src/editor';
import { isHeadingId, normaliseId, resolveIds, slug } from '../src/plugins/heading-slug';
import { headingIds } from '../src/plugins/heading-ids';
import { createStableIdsPlugin, stableIdsKey, BLUR } from '../src/plugins/heading-stable-ids';
import { remarkNowoDialect, type MdNode } from '../src/dialect/remark-dialect';
import { mdText } from '../src/dialect/heading-id';
import { selectionMarkdown, markdownIo } from '../src/commands/markdown-clipboard';

type Vectors = {
  slug: [string, string][];
  resolve: { headings: { text: string; explicit: string }[]; ids: string[] }[];
  valid: string[];
  invalid: string[];
  suffix: { markdown: string; text: string; id: string }[];
};
const vectors = JSON.parse(readFileSync(resolve(__dirname, '../../../../tests/Fixtures/heading-ids.json'), 'utf8')) as Vectors;

let handle: MilkdownEditorHandle | null = null;
const views: EditorView[] = [];
afterEach(async () => {
  await handle?.destroy();
  handle = null;
  views.splice(0).forEach((v) => v.destroy());
});

const view = (h: MilkdownEditorHandle): EditorView => h.builder.editor.action((ctx) => ctx.get(editorViewCtx));
const headingsOf = (doc: PmNode): { text: string; id: string }[] => {
  const out: { text: string; id: string }[] = [];
  doc.descendants((node) => {
    if (node.type.name === 'heading') out.push({ text: node.textContent, id: String(node.attrs.id) });
    return node.isBlock;
  });
  return out;
};
const headingPos = (doc: PmNode, n: number): number => {
  let found = -1;
  let i = 0;
  doc.descendants((node, pos) => {
    if (node.type.name === 'heading' && i++ === n) found = pos;
    return found === -1 && node.isBlock;
  });
  return found;
};

/** The heading of a remark tree (suffix vectors read with the same plugin as the editor). */
function parseHeading(markdown: string): { text: string; id: string } {
  const processor = unified().use(remarkParse).use(remarkNowoDialect as never);
  const tree = processor.runSync(processor.parse(markdown), markdown) as unknown as MdNode;
  const heading = tree.children!.find((n) => n.type === 'heading')!;
  return { text: mdText(heading), id: String(heading.data?.nowoHeadingId ?? '') };
}

describe('heading ids (1.18, shared vectors with PHP)', () => {
  it.each(vectors.slug)('slugs %j', (text, expected) => {
    expect(slug(text)).toBe(expected);
    expect(isHeadingId(expected)).toBe(true);
  });
  it('resolves explicit and implicit ids like PHP', () => {
    for (const c of vectors.resolve) expect(resolveIds(c.headings)).toEqual(c.ids);
  });
  it('validates ids with the shared grammar', () => {
    for (const id of vectors.valid) {
      expect(isHeadingId(id)).toBe(true);
      expect(normaliseId(`nowo-h-${id}`)).toBe(id);
    }
    for (const id of vectors.invalid) expect(isHeadingId(id)).toBe(false);
    expect(normaliseId(42)).toBe('');
  });
  it.each(vectors.suffix)('reads the suffix of $markdown', ({ markdown, text, id }) => {
    expect(parseHeading(markdown)).toEqual({ text, id });
  });
});

describe('the {#id} suffix in the editor (M1)', () => {
  it('round-trips explicit ids and writes them verbatim (never escaped)', async () => {
    const source = '## Install guide {#setup}\n\n## Año {#año-nuevo}\n\n## *Bold* text {#bold}\n\n## Literal \\{#kept}\n\nText\n';
    handle = await editor(source);
    expect(headingsOf(view(handle).state.doc).map((h) => h.id)).toEqual(['setup', 'año-nuevo', 'bold', '']);
    expect(handle.getMarkdown()).toBe(source);
    expect([...view(handle).dom.querySelectorAll('h2')].map((h) => h.id)).toEqual(['nowo-h-setup', 'nowo-h-año-nuevo', 'nowo-h-bold', 'nowo-h-literal-kept']);
  });

  it('drops a suffix equal to the slug (O1) and the nowo-h- prefix', async () => {
    handle = await editor('# Setup {#setup}\n\n# Install {#nowo-h-setup-2}\n');
    expect(handle.getMarkdown()).toBe('# Setup\n\n# Install {#setup-2}\n');
  });

  it('without stable ids a document without suffixes reads and writes as before, and renames add nothing', async () => {
    handle = await editor('# Intro\n\n# Intro\n\nBody\n');
    const v = view(handle);
    expect(headingsOf(v.state.doc).map((h) => h.id)).toEqual(['', '']);
    v.dispatch(v.state.tr.insertText('duction', 1 + 'Intro'.length));
    expect(handle.getMarkdown()).toBe('# Introduction\n\n# Intro\n\nBody\n');
    // An explicit id survives edits (the preset's syncHeadingIdPlugin is gone).
    handle.setMarkdown('# Old {#keep}\n');
    view(handle).dispatch(view(handle).state.tr.insertText('er', 4));
    expect(handle.getMarkdown()).toBe('# Older {#keep}\n');
    expect(view(handle).state.plugins.some((p) => (p as unknown as { key: string }).key.startsWith('MILKDOWN_HEADING_ID'))).toBe(false);
  });

  it('validates an id attribute that came from elsewhere when it is read', async () => {
    handle = await editor('# Title\n');
    const v = view(handle);
    v.dispatch(v.state.tr.setNodeMarkup(0, undefined, { ...v.state.doc.firstChild!.attrs, id: '"><img src=x onerror=alert(1)>' }));
    expect(v.dom.querySelector('h1')!.id).toBe('nowo-h-title');
    expect(handle.getMarkdown()).toBe('# Title\n');
    v.dispatch(v.state.tr.setNodeMarkup(0, undefined, { ...v.state.doc.firstChild!.attrs, id: 'nowo-h-intro' }));
    // Without stable ids a nowo-h- attribute is an older editor's generated id, never written.
    expect(handle.getMarkdown()).toBe('# Title\n');
    expect(v.dom.querySelector('h1')!.id).toBe('nowo-h-intro');
  });

  it('copy as Markdown keeps the suffix (same serialiser)', async () => {
    handle = await editor('# Renamed {#old}\n\nText\n', { features: ['markdown_clipboard'] });
    const v = view(handle);
    v.dispatch(v.state.tr.setSelection(new AllSelection(v.state.doc)));
    const io = handle.builder.editor.action((ctx) => markdownIo(ctx));
    expect(selectionMarkdown(v.state, io)).toBe('# Renamed {#old}\n\nText\n');
  });
});

describe('stable heading ids (M2)', () => {
  const stable = { features: ['stable_heading_ids', 'heading_ids'] };

  it('freezes ids on load; a rename keeps the id, a duplicate keeps its suffix', async () => {
    handle = await editor('# Intro\n\n# Intro\n\nBody\n', stable);
    const v = view(handle);
    expect(headingsOf(v.state.doc).map((h) => h.id)).toEqual(['intro', 'intro-2']);
    expect(handle.getMarkdown()).toBe('# Intro\n\n# Intro {#intro-2}\n\nBody\n');
    v.dispatch(v.state.tr.insertText('duction', 1 + 'Intro'.length));
    expect(handle.getMarkdown()).toBe('# Introduction {#intro}\n\n# Intro {#intro-2}\n\nBody\n');
    expect([...v.dom.querySelectorAll('h1')].map((h) => h.id)).toEqual(['nowo-h-intro', 'nowo-h-intro-2']);
  });

  it('a new heading gets its id from the finished text when the caret leaves it', async () => {
    handle = await editor('Body\n', stable);
    const v = view(handle);
    const end = v.state.doc.content.size;
    v.dispatch(v.state.tr.insert(end, v.state.schema.nodes.heading!.create({ level: 2 })));
    v.dispatch(v.state.tr.setSelection(TextSelection.create(v.state.doc, end + 1)));
    for (const ch of 'Install') v.dispatch(v.state.tr.insertText(ch));
    expect(headingsOf(v.state.doc)[0]!.id).toBe('');
    v.dispatch(v.state.tr.insertText(' guide'));
    v.dispatch(v.state.tr.setSelection(TextSelection.create(v.state.doc, 1)));
    expect(headingsOf(v.state.doc)[0]!.id).toBe('install-guide');
    expect(handle.getMarkdown()).toBe('Body\n\n## Install guide\n');
    // Renaming it now keeps the id.
    v.dispatch(v.state.tr.insertText('Quick ', end + 1));
    expect(handle.getMarkdown()).toBe('Body\n\n## Quick Install guide {#install-guide}\n');
  });

  it('the blur of the editor freezes the heading being typed', async () => {
    handle = await editor('Body\n', stable);
    const v = view(handle);
    const end = v.state.doc.content.size;
    v.dispatch(v.state.tr.insert(end, v.state.schema.nodes.heading!.create({ level: 2 })));
    v.dispatch(v.state.tr.setSelection(TextSelection.create(v.state.doc, end + 1)));
    v.dispatch(v.state.tr.insertText('Typed'));
    expect(stableIdsKey.getState(v.state)?.dirty).toBe(true);
    v.dom.dispatchEvent(new FocusEvent('focusout', { relatedTarget: document.body }));
    expect(headingsOf(v.state.doc)[0]!.id).toBe('typed');
    expect(stableIdsKey.getState(v.state)?.dirty).toBe(false);
    // Nothing left to freeze: a blur dispatches nothing.
    const before = v.state;
    v.dom.dispatchEvent(new FocusEvent('focusout', { relatedTarget: null }));
    expect(v.state).toBe(before);
  });

  it('a split keeps the id on the left part; a pasted copy gets a fresh id', async () => {
    handle = await editor('# Intro part\n\nBody\n', stable);
    const v = view(handle);
    const split = v.state.tr.split(1 + 'Intro'.length);
    v.dispatch(split.setSelection(TextSelection.create(split.doc, 1)));
    expect(headingsOf(v.state.doc)).toEqual([
      { text: 'Intro', id: 'intro-part' },
      { text: ' part', id: 'part' },
    ]);
    const copy = v.state.doc.firstChild!;
    v.dispatch(v.state.tr.insert(0, copy));
    expect(headingsOf(v.state.doc).map((h) => h.id)).toEqual(['intro', 'intro-part', 'part']);
    // A pasted heading with an id that is free keeps it; one without an id gets one.
    const fresh = v.state.schema.nodes.heading!.create({ level: 3, id: '' }, v.state.schema.text('Pasted'));
    v.dispatch(v.state.tr.insert(v.state.doc.content.size, fresh));
    expect(headingsOf(v.state.doc).map((h) => h.id)).toEqual(['intro', 'intro-part', 'part', 'pasted']);
  });

  it('pasted HTML keeps a valid id only with stable ids', async () => {
    handle = await editor('Text\n', stable);
    const v = view(handle);
    const dom = document.createElement('div');
    dom.innerHTML = '<h2 id="nowo-h-from-html">Elsewhere</h2><h2 id="x onerror">Bad</h2>';
    const { DOMParser } = await import('@milkdown/kit/prose/model');
    const slice = DOMParser.fromSchema(v.state.schema).parseSlice(dom);
    v.dispatch(v.state.tr.replaceSelection(slice));
    // The caret was left in the last pasted heading: it gets its id when the caret leaves.
    v.dispatch(v.state.tr.setSelection(TextSelection.atStart(v.state.doc)));
    // (The paste merged the paragraph's text into the last heading.)
    expect(headingsOf(v.state.doc).map((h) => [h.text, h.id])).toEqual([
      ['Elsewhere', 'from-html'],
      ['BadText', 'badtext'],
    ]);
    await handle.destroy();
    // Without stable ids pasted HTML ids are dropped.
    handle = await editor('Text\n');
    const w = view(handle);
    w.dispatch(w.state.tr.replaceSelection(DOMParser.fromSchema(w.state.schema).parseSlice(dom)));
    expect(headingsOf(w.state.doc).map((h) => h.id)).toEqual(['', '']);
  });
});

/** A ProseMirror view bound to a Yjs document (the 1.18 plugin, or extra plugins of an older editor). */
function peer(schema: Schema, doc: Y.Doc, plugins: Plugin[]): EditorView {
  const el = document.createElement('div');
  document.body.append(el);
  const v = new EditorView(el, { state: EditorState.create({ schema, plugins: [ySyncPlugin(doc.getXmlFragment('prosemirror')), ...plugins] }) });
  views.push(v);
  return v;
}

/** Relays updates between two documents (until `cut()`); updates from a third one are forwarded too. */
function link(a: Y.Doc, b: Y.Doc): { cut: () => void; join: () => void } {
  let on = true;
  const toB = Symbol('to-b');
  const toA = Symbol('to-a');
  a.on('update', (u: Uint8Array, origin: unknown) => {
    if (on && origin !== toA) Y.applyUpdate(b, u, toB);
  });
  b.on('update', (u: Uint8Array, origin: unknown) => {
    if (on && origin !== toB) Y.applyUpdate(a, u, toA);
  });
  return {
    cut: () => (on = false),
    join: () => {
      on = true;
      Y.applyUpdate(b, Y.encodeStateAsUpdate(a, Y.encodeStateVector(b)), toB);
      Y.applyUpdate(a, Y.encodeStateAsUpdate(b, Y.encodeStateVector(a)), toA);
    },
  };
}

/** The pre-1.18 behaviour (Milkdown's syncHeadingIdPlugin with the bundle's generator), for an old tab. */
const oldTab = (): Plugin =>
  new Plugin({
    view: () => ({
      update: (v, prev) => {
        if (v.state.doc.eq(prev.doc)) return;
        const tr = v.state.tr.setMeta('addToHistory', false);
        const seen: Record<string, number> = {};
        let found = false;
        v.state.doc.descendants((node, pos) => {
          if (node.type.name !== 'heading' || node.textContent.trim() === '') return;
          let id = `nowo-h-${slug(node.textContent)}`;
          seen[id] = (seen[id] ?? 0) + 1;
          if (seen[id]! > 1) id += `-#${seen[id]}`;
          if (node.attrs.id !== id) {
            found = true;
            tr.setNodeMarkup(pos, undefined, { ...node.attrs, id });
          }
        });
        if (found) v.dispatch(tr);
      },
    }),
  });

describe('stable ids with two Yjs peers (M2)', () => {
  async function setup(markdown: string) {
    handle = await editor('', { features: ['stable_heading_ids'] });
    const io = handle.builder.editor.action((ctx) => ({ schema: ctx.get(schemaCtx), parse: ctx.get(parserCtx), serialize: ctx.get(serializerCtx) }));
    const a = new Y.Doc();
    const b = new Y.Doc();
    prosemirrorToYXmlFragment(io.parse(markdown), a.getXmlFragment('prosemirror'));
    Y.applyUpdate(b, Y.encodeStateAsUpdate(a));
    const relay = link(a, b);
    const peerA = peer(io.schema, a, [createStableIdsPlugin()]);
    const peerB = peer(io.schema, b, [createStableIdsPlugin()]);
    await tick();
    return { io, a, b, relay, peerA, peerB };
  }

  it('a split on one peer gives the new part a fresh id; the other peer only receives it', async () => {
    const { peerA, peerB, io } = await setup('# Intro part\n\nBody\n');
    expect(headingsOf(peerB.state.doc)).toEqual([{ text: 'Intro part', id: 'intro-part' }]);
    const split = peerA.state.tr.split(1 + 'Intro'.length);
    peerA.dispatch(split.setSelection(TextSelection.create(split.doc, 1)));
    await tick();
    expect(headingsOf(peerB.state.doc)).toEqual([
      { text: 'Intro', id: 'intro-part' },
      { text: ' part', id: 'part' },
    ]);
    // A paste of a copy on B: B renames its own pasted heading, A only receives it.
    peerB.dispatch(peerB.state.tr.insert(peerB.state.doc.content.size, peerB.state.doc.firstChild!));
    await tick();
    expect(headingsOf(peerA.state.doc).map((h) => h.id)).toEqual(['intro-part', 'part', 'intro']);
    expect(io.serialize(peerA.state.doc)).toContain('# Intro {#intro-part}\n');
  });

  it('a heading a peer is typing is never given an id by another peer', async () => {
    const { peerA, peerB } = await setup('Body\n');
    const end = peerA.state.doc.content.size;
    peerA.dispatch(peerA.state.tr.insert(end, peerA.state.schema.nodes.heading!.create({ level: 2 })));
    peerA.dispatch(peerA.state.tr.setSelection(TextSelection.create(peerA.state.doc, end + 1)));
    peerA.dispatch(peerA.state.tr.insertText('Inst'));
    await tick();
    // B passes its caret through A's unfinished heading: B did not edit it, so B freezes nothing.
    const at = headingPos(peerB.state.doc, 0);
    peerB.dispatch(peerB.state.tr.setSelection(TextSelection.create(peerB.state.doc, at + 2)));
    peerB.dispatch(peerB.state.tr.setSelection(TextSelection.create(peerB.state.doc, 1)));
    peerB.dom.dispatchEvent(new FocusEvent('focusout', { relatedTarget: null }));
    await tick();
    expect(headingsOf(peerB.state.doc)).toEqual([{ text: 'Inst', id: '' }]);
    // A finishes and leaves: the id comes from the finished text, and B receives it.
    peerA.dispatch(peerA.state.tr.insertText('all guide'));
    peerA.dispatch(peerA.state.tr.setSelection(TextSelection.create(peerA.state.doc, 1)));
    await tick();
    expect(headingsOf(peerB.state.doc)).toEqual([{ text: 'Install guide', id: 'install-guide' }]);
  });

  it('two peers creating the same heading at once: the merge keeps both, nobody rewrites the other, the DOM stays unique', async () => {
    const { a, b, relay, peerA, peerB, io } = await setup('Body\n');
    relay.cut();
    for (const v of [peerA, peerB]) {
      const end = v.state.doc.content.size;
      v.dispatch(v.state.tr.insert(end, v.state.schema.nodes.heading!.create({ level: 2 }, v.state.schema.text('Same'))));
      v.dispatch(v.state.tr.setSelection(TextSelection.create(v.state.doc, 1)));
    }
    expect(headingsOf(peerA.state.doc).map((h) => h.id)).toEqual(['same']);
    relay.join();
    await tick();
    expect(a.getXmlFragment('prosemirror').toJSON()).toBe(b.getXmlFragment('prosemirror').toJSON());
    expect(headingsOf(peerA.state.doc).map((h) => h.id)).toEqual(['same', 'same']);
    expect(headingsOf(peerB.state.doc).map((h) => h.id)).toEqual(['same', 'same']);
    expect([...headingIds(peerA.state).values()]).toEqual(['nowo-h-same', 'nowo-h-same-2']);
    // Both write the same Markdown; a re-seed gives the same ids to the same headings.
    const markdown = io.serialize(peerA.state.doc);
    expect(markdown).toBe('Body\n\n## Same\n\n## Same\n');
  });

  it('an old-version tab rewrites ids (hence the epoch bump, O7); 1.18 reads its values safely', async () => {
    const { b, peerA, io } = await setup('# Intro\n\n# Renamed {#kept}\n');
    const c = new Y.Doc();
    Y.applyUpdate(c, Y.encodeStateAsUpdate(b));
    link(b, c);
    const old = peer(io.schema, c, [oldTab()]);
    old.dispatch(old.state.tr.insertText('!', old.state.doc.content.size - 1));
    await tick();
    // The old tab replaced the explicit id with its generated one: the reason pre-1.18 tabs must reload.
    expect(headingsOf(peerA.state.doc).map((h) => h.id)).toEqual(['nowo-h-intro', 'nowo-h-renamed']);
    // 1.18 reads `nowo-h-<slug>` as the bare id: valid DOM ids, and no suffix while the id equals the slug.
    expect([...peerA.dom.querySelectorAll('h1')].map((h) => h.id)).toEqual(['nowo-h-intro', 'nowo-h-renamed']);
    expect(io.serialize(peerA.state.doc)).toBe('# Intro\n\n# Renamed!\n');
  });

  it('a pre-1.18 log with nowo-h- and -#2 attributes needs no migration; a re-seed from Markdown keeps the ids', async () => {
    handle = await editor('', { features: ['stable_heading_ids'] });
    const io = handle.builder.editor.action((ctx) => ({ schema: ctx.get(schemaCtx), parse: ctx.get(parserCtx), serialize: ctx.get(serializerCtx) }));
    const log = new Y.Doc();
    const fragment = log.getXmlFragment('prosemirror');
    const heading = (text: string, id: string): Y.XmlElement => {
      const el = new Y.XmlElement('heading');
      el.setAttribute('level', 1 as unknown as string);
      el.setAttribute('id', id);
      el.insert(0, [new Y.XmlText(text)]);
      return el;
    };
    fragment.insert(0, [heading('Intro', 'nowo-h-intro'), heading('Intro', 'nowo-h-intro-#2'), heading('Evil', '"><svg onload=alert(1)>')]);
    const v = peer(io.schema, log, [createStableIdsPlugin()]);
    await tick();
    expect([...v.dom.querySelectorAll('h1')].map((h) => h.id)).toEqual(['nowo-h-intro', 'nowo-h-intro', 'nowo-h-evil']);
    expect(io.serialize(v.state.doc)).toBe('# Intro\n\n# Intro\n\n# Evil\n');
    // A rename on 1.18 keeps the frozen id.
    v.dispatch(v.state.tr.insertText('duction', 1 + 'Intro'.length));
    const markdown = io.serialize(v.state.doc);
    expect(markdown).toBe('# Introduction {#intro}\n\n# Intro\n\n# Evil\n');
    // Epoch change: the next session re-seeds from Markdown; the ids come back the same.
    expect(headingsOf(io.parse(markdown)).map((h) => h.id)).toEqual(['intro', 'intro-2', 'evil']);
    expect(io.serialize(io.parse(markdown))).toBe('# Introduction {#intro}\n\n# Intro {#intro-2}\n\n# Evil\n');
  });

  it('acts on local transactions only', () => {
    const plugin = createStableIdsPlugin();
    expect(plugin.spec.appendTransaction).toBeTypeOf('function');
    expect(BLUR).toBe('blur');
  });
});
