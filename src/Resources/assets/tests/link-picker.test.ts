import { afterEach, describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { editorViewCtx } from '@milkdown/kit/core';
import { NodeSelection, TextSelection } from '@milkdown/kit/prose/state';
import type { EditorView } from '@milkdown/kit/prose/view';
import { ID, editor, keydown, tick } from './helpers';
import type { MilkdownEditorHandle } from '../src/editor';
import { checkLinkUrl, linkSchemes } from '../src/ui/link-url';
import { MAX_CANDIDATES, MAX_SECTIONS, parseCandidates, parseSections } from '../src/ui/link-picker';
import { parseOptions } from '../src/options';

const vectors = JSON.parse(readFileSync(resolve(__dirname, '../../../../tests/Fixtures/link-urls.json'), 'utf8')) as {
  accepted: { input: string; href: string; host: string }[];
  refused: string[];
};
const OTHER = 'c0ffee00-1234-4abc-8def-001122334455';

let handle: MilkdownEditorHandle | null = null;
afterEach(async () => {
  await handle?.destroy();
  handle = null;
  document.querySelectorAll('.nowo-milkdown-link-picker').forEach((el) => el.remove());
  vi.unstubAllGlobals();
});

describe('link URL check (shared vectors with PHP LinkUrl)', () => {
  it.each(vectors.accepted)('accepts $input', ({ input, href, host }) => {
    expect(checkLinkUrl(input)).toEqual({ href, host });
  });
  it.each(vectors.refused)('refuses %j', (input) => {
    expect(checkLinkUrl(input)).toBeNull();
  });
  it('lets a field narrow the schemes, never widen them', () => {
    expect(checkLinkUrl('mailto:ada@example.com', ['http', 'https'])).toBeNull();
    expect(checkLinkUrl('example.com', ['mailto'])).toBeNull();
    expect(checkLinkUrl('tel:1', ['tel'])).toBeNull();
    expect(linkSchemes(['https', 'tel'])).toEqual(['https']);
    expect(linkSchemes('https')).toEqual(['http', 'https', 'mailto']);
    expect(linkSchemes([])).toEqual(['http', 'https', 'mailto']);
  });
  it('reads the options only with the feature', () => {
    expect(parseOptions(JSON.stringify({ linkSections: '/s/{id}' })).linkSections).toBeNull();
    const on = parseOptions(JSON.stringify({ features: ['link_picker'], linkSections: '/s/{id}', linkSchemes: ['https'] }));
    expect(on.linkSections).toBe('/s/{id}');
    expect(on.linkSchemes).toEqual(['https']);
    expect(parseOptions(JSON.stringify({ features: ['link_picker'], linkSections: 'https://evil.example/{id}' })).linkSections).toBeNull();
    expect(parseOptions(JSON.stringify({ features: ['link_picker'], linkSections: '/s/no-placeholder' })).linkSections).toBeNull();
  });
});

describe('host answers are validated', () => {
  it('candidates: the 1.0 array, groups, limits, ids and URLs', () => {
    expect(parseCandidates([{ id: ID, label: 'A', url: 'javascript:alert(1)' }, { id: 'nope', label: 'B' }, null])).toEqual({ here: [{ id: ID, label: 'A', url: '' }], others: [] });
    const many = Array.from({ length: 8 }, () => ({ id: OTHER, label: 'x'.repeat(500), url: '/p' }));
    const parsed = parseCandidates({ here: many, others: [{ wiki: 'Ops', pages: many }, { wiki: '', pages: many }, { wiki: 'Empty', pages: [] }, ...Array.from({ length: 8 }, (_, i) => ({ wiki: `W${i}`, pages: many }))] });
    expect(parsed.here).toHaveLength(8);
    expect(parsed.here[0]!.label).toHaveLength(200);
    expect(parsed.others.map((o) => o.wiki)).toEqual(['Ops', 'W0', 'W1', 'W2']);
    expect(parsed.others.reduce((n, o) => n + o.pages.length, 0)).toBe(MAX_CANDIDATES);
    expect(parseCandidates('x')).toEqual({ here: [], others: [] });
  });
  it('sections: valid ids only (prefix dropped), levels 1-6, no repeats, at most 200', () => {
    expect(
      parseSections({
        sections: [
          { id: 'nowo-h-setup', level: 2, text: ' Set up ' },
          { id: 'Bad Id', level: 2, text: 'x' },
          { id: 'ok', level: 7, text: 'x' },
          { id: 'setup', level: 3, text: 'again' },
          { id: 'empty', level: 1, text: '  ' },
        ],
      }),
    ).toEqual([{ id: 'setup', level: 2, text: 'Set up' }]);
    expect(parseSections({ sections: Array.from({ length: 300 }, (_, i) => ({ id: `s${i}`, level: 2, text: `S${i}` })) })).toHaveLength(MAX_SECTIONS);
    expect(parseSections(null)).toEqual([]);
  });
});

const view = (h: MilkdownEditorHandle): EditorView => h.builder.editor.action((ctx) => ctx.get(editorViewCtx));
const picker = (): HTMLElement | null => document.querySelector<HTMLElement>('.nowo-milkdown-link-picker');
const optionTexts = (): string[] => [...picker()!.querySelectorAll('[role="option"]')].map((o) => o.textContent ?? '');

function host(): ReturnType<typeof vi.fn> {
  const fetchMock = vi.fn(async (url: string) => {
    if (url.startsWith('/c?')) {
      return new Response(JSON.stringify({ here: [{ id: ID, label: 'Install <b>guide</b>', url: '/wiki/install' }], others: [{ wiki: 'Ops', pages: [{ id: OTHER, label: 'Runbook', url: '/ops/runbook' }] }] }));
    }
    if (url.startsWith('/s/')) return new Response(JSON.stringify({ sections: [{ id: 'setup', level: 2, text: 'Set up' }, { id: 'faq', level: 3, text: 'FAQ' }] }));
    if (url.startsWith('/titles')) return new Response(JSON.stringify([{ id: ID, title: 'Install', url: '/wiki/install', visible: true }]));
    return new Response('[]');
  });
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

const PICKER = { features: ['link_picker', 'heading_ids'], suggestions: { '[[': '/c' }, linkSections: '/s/{id}', linkTitleUrl: '/titles' };

/** Waits (at most 2 s) until `ready()` holds: lazy chunks and fetches take longer under coverage. */
async function until(ready: () => boolean): Promise<void> {
  for (let i = 0; i < 200 && !ready(); i++) await tick(10);
}

async function open(target: HTMLElement): Promise<void> {
  keydown(target, 'k', { ctrlKey: true });
  await until(() => picker() !== null && picker()!.querySelector('[role="option"], .nowo-milkdown-picker__empty, input[name="url"]:not([hidden])') !== null);
  await tick(10);
}

describe('the link picker (M3)', () => {
  it('Mod-k opens a page search grouped by wiki; a page and a section give [[wiki:<uuid>#<id>]]', async () => {
    const fetchMock = host();
    handle = await editor('Text', PICKER);
    const v = view(handle);
    const picked = vi.fn();
    handle.root.addEventListener('nowo-milkdown:link-picked', (e) => picked((e as CustomEvent).detail));
    await open(v.dom);
    const dialog = picker()!;
    expect(dialog.getAttribute('role')).toBe('dialog');
    expect([...dialog.querySelectorAll('[role="tab"]')].map((t) => [t.textContent, t.getAttribute('aria-selected')])).toEqual([
      ['Wiki page', 'true'],
      ['External URL', 'false'],
    ]);
    const input = dialog.querySelector<HTMLInputElement>('[role="combobox"]')!;
    expect(document.activeElement).toBe(input);
    expect(input.getAttribute('aria-controls')).toBe(dialog.querySelector('[role="listbox"]')!.id);
    expect(fetchMock).toHaveBeenCalledWith('/c?q=', expect.anything());
    // Grouped listbox: the current wiki first, then the others under their name; labels are text only.
    expect([...dialog.querySelectorAll('[role="group"]')].map((g) => document.getElementById(g.getAttribute('aria-labelledby')!)!.textContent)).toEqual(['This wiki', 'Ops']);
    expect(optionTexts()).toEqual(['Install <b>guide</b>', 'Runbook']);
    expect(dialog.querySelector('b')).toBeNull();
    expect(input.getAttribute('aria-activedescendant')).toBe(dialog.querySelector('[role="option"]')!.id);
    // Typing asks again (debounced), control and bidi characters never go to the host.
    input.value = `inst${String.fromCharCode(0x202e)}`;
    input.dispatchEvent(new Event('input'));
    await until(() => fetchMock.mock.calls.some(([u]) => u === '/c?q=inst'));
    await tick(10);
    expect(fetchMock).toHaveBeenCalledWith('/c?q=inst', expect.anything());
    // Step 2: the sections, Top of page first.
    keydown(input, 'Enter');
    await until(() => optionTexts().includes('FAQ'));
    expect(fetchMock).toHaveBeenCalledWith(`/s/${ID}`, expect.anything());
    expect(dialog.querySelector('.nowo-milkdown-link-picker__page')!.textContent).toBe('Install <b>guide</b>');
    expect(optionTexts()).toEqual(['Top of page', 'Set up', 'FAQ']);
    keydown(input, 'ArrowDown');
    keydown(input, 'Enter');
    await tick(10);
    expect(picker()).toBeNull();
    expect(handle.getMarkdown()).toContain(`[[wiki:${ID}#setup]]`);
    expect(picked).toHaveBeenCalledWith({ kind: 'page', pageId: ID, anchor: 'setup' });
    // The chip shows the section text the picker showed, and points at the heading.
    await until(() => v.dom.querySelector('.nowo-milkdown-ref')?.textContent === 'Install › Set up');
    const chip = v.dom.querySelector<HTMLAnchorElement>('.nowo-milkdown-ref')!;
    expect(chip.textContent).toBe('Install › Set up');
    expect(chip.getAttribute('href')).toBe('/wiki/install#nowo-h-setup');
  });

  it('Escape goes back from the sections, then closes; a click outside closes too', async () => {
    host();
    handle = await editor('Text', PICKER);
    await open(view(handle).dom);
    const input = picker()!.querySelector<HTMLInputElement>('[role="combobox"]')!;
    keydown(input, 'ArrowDown');
    keydown(input, 'ArrowUp');
    keydown(input, 'Enter');
    await until(() => optionTexts()[0] === 'Top of page');
    expect(optionTexts()[0]).toBe('Top of page');
    keydown(input, 'Escape');
    await until(() => optionTexts().includes('Runbook'));
    expect(optionTexts()).toEqual(['Install <b>guide</b>', 'Runbook']);
    keydown(input, 'Escape');
    expect(picker()).toBeNull();
    await open(view(handle).dom);
    document.body.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    expect(picker()).toBeNull();
    expect(handle.getMarkdown()).toBe('Text\n');
  });

  it('External URL: schemes are checked as typed, a bare host becomes https, the selection becomes the link text', async () => {
    host();
    handle = await editor('Read the docs', PICKER);
    const v = view(handle);
    v.dispatch(v.state.tr.setSelection(TextSelection.create(v.state.doc, 10, 14)));
    await open(v.dom);
    const dialog = picker()!;
    dialog.querySelector<HTMLButtonElement>('[role="tab"][data-tab="url"]')!.click();
    const url = dialog.querySelector<HTMLInputElement>('input[name="url"]')!;
    expect(document.activeElement).toBe(url);
    expect(dialog.querySelector('input[name="text"]')).toBeNull();
    const insert = dialog.querySelector<HTMLButtonElement>('.nowo-milkdown-link-picker__insert')!;
    expect(insert.disabled).toBe(true);
    url.value = 'javascript:alert(1)';
    url.dispatchEvent(new Event('input'));
    expect(insert.disabled).toBe(true);
    expect(url.getAttribute('aria-invalid')).toBe('true');
    keydown(url, 'Enter');
    expect(picker()).not.toBeNull();
    url.value = 'bücher.example/docs';
    url.dispatchEvent(new Event('input'));
    expect(dialog.querySelector('.nowo-milkdown-link-picker__preview')!.textContent).toBe('Opens xn--bcher-kva.example');
    keydown(url, 'Enter');
    await tick(5);
    expect(handle.getMarkdown()).toBe('Read the [docs](https://bücher.example/docs)\n');
  });

  it('with nothing selected the URL tab asks for the text; Mod-k in a link edits it', async () => {
    host();
    handle = await editor('Hi', { ...PICKER, suggestions: {} });
    const v = view(handle);
    v.dispatch(v.state.tr.setSelection(TextSelection.atEnd(v.state.doc)));
    await open(v.dom);
    const dialog = picker()!;
    // Without candidates there is no page tab.
    expect(dialog.querySelector('[role="tablist"]')).toBeNull();
    const field = dialog.querySelector<HTMLInputElement>('input[name="url"]')!;
    field.value = 'mailto:ada@example.com';
    field.dispatchEvent(new Event('input'));
    dialog.querySelector<HTMLInputElement>('input[name="text"]')!.value = 'Ada';
    dialog.querySelector<HTMLButtonElement>('.nowo-milkdown-link-picker__insert')!.click();
    await tick(5);
    expect(handle.getMarkdown()).toBe('Hi[Ada](mailto:ada@example.com)\n');
    v.dispatch(v.state.tr.setSelection(TextSelection.create(v.state.doc, 5)));
    await open(v.dom);
    const url = picker()!.querySelector<HTMLInputElement>('input[name="url"]')!;
    expect(url.value).toBe('mailto:ada@example.com');
    url.value = 'https://example.com/ada';
    url.dispatchEvent(new Event('input'));
    keydown(url, 'Enter');
    await tick(5);
    expect(handle.getMarkdown()).toBe('Hi[Ada](https://example.com/ada)\n');
  });

  it('a selected page link opens on its sections with the current one active', async () => {
    const fetchMock = host();
    handle = await editor(`See [[wiki:${ID}#faq]]`, PICKER);
    const v = view(handle);
    await tick(10);
    let at = -1;
    v.state.doc.descendants((node, pos) => {
      if (node.type.name === 'wikiRef') at = pos;
    });
    v.dispatch(v.state.tr.setSelection(NodeSelection.create(v.state.doc, at)));
    await open(v.dom);
    await until(() => optionTexts().includes('FAQ'));
    expect(fetchMock).not.toHaveBeenCalledWith('/c?q=', expect.anything());
    const dialog = picker()!;
    expect(dialog.querySelector('.nowo-milkdown-link-picker__page')!.textContent).toBe('Install');
    const input = dialog.querySelector<HTMLInputElement>('[role="combobox"]')!;
    expect(document.getElementById(input.getAttribute('aria-activedescendant')!)!.textContent).toBe('FAQ');
    keydown(input, 'ArrowUp');
    keydown(input, 'Enter');
    await tick(5);
    expect(handle.getMarkdown()).toBe(`See [[wiki:${ID}#setup]]\n`);
  });

  it('typing [[ opens the picker on the page tab; closing it types the brackets back', async () => {
    host();
    handle = await editor('A', PICKER);
    const v = view(handle);
    v.dispatch(v.state.tr.setSelection(TextSelection.atEnd(v.state.doc)).insertText('['));
    const from = v.state.selection.from;
    const handled = v.someProp('handleTextInput', (f) => f(v, from, from, '[', () => v.state.tr.insertText('[')));
    expect(handled).toBe(true);
    await until(() => picker() !== null);
    expect(picker()).not.toBeNull();
    expect(handle.getMarkdown()).toBe('A\n');
    keydown(picker()!.querySelector<HTMLInputElement>('[role="combobox"]')!, 'Escape');
    expect(v.state.doc.textContent).toBe('A[[');
    // RV-I5: closed after another change (a peer's), the brackets go back at the caret.
    v.dispatch(v.state.tr.setSelection(TextSelection.atEnd(v.state.doc)).insertText('['));
    const again = v.state.selection.from;
    v.someProp('handleTextInput', (f) => f(v, again, again, '[', () => v.state.tr.insertText('[')));
    await until(() => picker() !== null);
    v.dispatch(v.state.tr.insertText('Z', 1));
    keydown(picker()!.querySelector<HTMLInputElement>('[role="combobox"]')!, 'Escape');
    expect(v.state.doc.textContent).toBe('ZA[[[[');
    // Not inside code.
    handle.setMarkdown('`[x`');
    const w = view(handle);
    expect(w.someProp('handleTextInput', (f) => f(w, 2, 2, '[', () => w.state.tr.insertText('[')))).toBeFalsy();
  });

  it('the top bar link button opens the picker (Crepe toggles a link without the feature)', async () => {
    host();
    handle = await editor('Text', { ...PICKER, features: ['top_bar', 'link_picker'] });
    await until(() => handle!.root.querySelector('.milkdown-top-bar .top-bar-inner') !== null);
    const controls = [...handle.root.querySelectorAll<HTMLElement>('.milkdown-top-bar .top-bar-inner > :not(.top-bar-divider)')];
    const link = controls.find((el) => (el.matches('button') ? el : el.querySelector('button'))?.getAttribute('aria-label') === 'Link')!;
    expect(link).toBeTruthy();
    link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, detail: 0 }));
    await until(() => picker() !== null);
    expect(picker()).not.toBeNull();
  });

  it('is off without the feature and in a read-only field', async () => {
    host();
    handle = await editor('Text', { suggestions: { '[[': '/c' } });
    keydown(view(handle).dom, 'k', { ctrlKey: true });
    await tick(30);
    expect(picker()).toBeNull();
    await handle.destroy();
    handle = await editor('Text', { ...PICKER, readonly: true });
    keydown(view(handle).dom, 'k', { ctrlKey: true });
    await tick(30);
    expect(picker()).toBeNull();
  });
});
