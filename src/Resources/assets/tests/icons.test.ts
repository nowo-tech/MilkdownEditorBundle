import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { editorViewCtx } from '@milkdown/kit/core';
import { TextSelection } from '@milkdown/kit/prose/state';
import type { EditorView } from '@milkdown/kit/prose/view';
import { editor, keydown, tick } from './helpers';
import type { MilkdownEditorHandle } from '../src/editor';
import { GLYPHS } from '../src/ui/glyphs';
import { ITEM_GLYPHS, glyph, glyphFor } from '../src/ui/icons';
import { Menu } from '../src/ui/menu';
import { IconPicker, MAX_OPTIONS, open } from '../src/ui/icon-picker';
import { mergeEntries, searchIcons, type IconEntry } from '../src/icons/search';
import { VERSION, catalog, hasIcon, parseCatalog } from '../src/icons/catalog';
import { catalogEntries, insertIcon, lazyIcons, openPickerAtCaret } from '../src/icons/open';
import { calloutIcon, isEmojiValue } from '../src/dialect/directives';
import { catalogShard, defaultRuntime, iconHref, iconSvg, pickerAvailable, type Runtime } from '../src/runtime';
import { parseOptions } from '../src/options';
import { assetUrl, setAssetBase } from '../src/assets';
import { calloutIconButton } from '../src/nodes/directives';
import { catalogText, iconNames, readTabler, spriteShards, tablerIcons, CATALOG_ID } from '../../../../vite.icons';

let handle: MilkdownEditorHandle | null = null;
afterEach(async () => {
  await handle?.destroy();
  handle = null;
  document.body.replaceChildren();
  vi.restoreAllMocks();
});

const view = (h: MilkdownEditorHandle): EditorView => h.builder.editor.action((ctx) => ctx.get(editorViewCtx));
const settle = async (): Promise<void> => {
  for (let i = 0; i < 6; i++) await tick(40);
};
const picker = (): HTMLDivElement | null => document.querySelector<HTMLDivElement>('.nowo-milkdown-picker[role="dialog"]');
const search = (): HTMLInputElement => picker()!.querySelector<HTMLInputElement>('input[role="combobox"]')!;
const options = (): HTMLLIElement[] => [...picker()!.querySelectorAll<HTMLLIElement>('[role="option"]')];
const typeQuery = (value: string): void => {
  const input = search();
  input.value = value;
  input.dispatchEvent(new Event('input', { bubbles: true }));
};
const caretAtEnd = (h: MilkdownEditorHandle): void => {
  const v = view(h);
  v.dispatch(v.state.tr.setSelection(TextSelection.create(v.state.doc, v.state.doc.content.size - 1)));
};
const runtime = (extra: Partial<Runtime> = {}): Runtime => ({ ...defaultRuntime(), ...extra });
const ENTRIES: IconEntry[] = [
  { name: 'alarm', keywords: 'system clock time' },
  { name: 'bug', keywords: 'development insect error' },
  { name: 'bug-off', keywords: 'development' },
  { name: 'ladybug', keywords: 'animals insect' },
  { name: 'bulb', keywords: 'system idea light' },
];

describe('UI glyphs (1.7)', () => {
  it('are the Tabler outline paths of the package (no hand edits)', () => {
    const nodes = JSON.parse(readFileSync(resolve('node_modules/@tabler/icons/tabler-nodes-outline.json'), 'utf8')) as Record<string, [string, { d: string }][]>;
    for (const [name, paths] of Object.entries(GLYPHS)) expect(paths).toEqual(nodes[name]!.map(([, a]) => a.d));
    for (const name of Object.values(ITEM_GLYPHS)) expect(GLYPHS[name], name).toBeDefined();
  });

  it('build decorative SVGs with DOM APIs; unknown names give null', () => {
    const svg = glyph('copy', 'x')!;
    expect(svg.getAttribute('class')).toBe('nowo-milkdown-glyph x');
    expect(svg.getAttribute('aria-hidden')).toBe('true');
    expect(svg.getAttribute('focusable')).toBe('false');
    expect(svg.getAttribute('style')).toBeNull();
    expect(svg.querySelectorAll('path').length).toBe(GLYPHS.copy!.length);
    expect(glyph('copy')!.getAttribute('class')).toBe('nowo-milkdown-glyph');
    expect(glyph('nope')).toBeNull();
    expect(glyph('toString')).toBeNull();
    expect(glyphFor('turn_h1')).toBe('h-1');
    expect(glyphFor('insert_table')).toBe('table');
    expect(glyphFor('copy')).toBe('copy');
    expect(glyphFor('host:x')).toBeUndefined();
  });

  it('menus show a glyph column only with icons on; swatch items keep their swatch', () => {
    const host = document.createElement('div');
    document.body.append(host);
    const menu = new Menu(host, 'M', () => undefined);
    menu.icons = true;
    menu.open([[{ id: 'copy', label: 'Copy' }, { id: 'host:x', label: 'Host' }, { id: 'red', label: 'Red', swatch: 'nowo-milkdown-color--red' }, { id: 'y', label: 'Custom', icon: 'bulb' }]], 0, 0);
    expect(menu.element.classList.contains('nowo-milkdown-menu--icons')).toBe(true);
    const [copy, hostItem, red, custom] = [...menu.element.querySelectorAll('button')];
    expect(copy!.querySelector('svg.nowo-milkdown-menu__icon')?.getAttribute('aria-hidden')).toBe('true');
    expect(copy!.textContent).toBe('Copy');
    expect(hostItem!.querySelector('span.nowo-milkdown-menu__icon')?.getAttribute('aria-hidden')).toBe('true');
    expect(red!.querySelector('.nowo-milkdown-menu__icon')).toBeNull();
    expect((custom!.querySelector('svg') as SVGElement).dataset.glyph).toBe('bulb');
    menu.open([[{ id: 'red', label: 'Red', swatch: 's' }]], 0, 0);
    expect(menu.element.classList.contains('nowo-milkdown-menu--icons')).toBe(false);
    menu.icons = false;
    menu.open([[{ id: 'copy', label: 'Copy' }]], 0, 0);
    expect(menu.element.querySelector('svg')).toBeNull();
    menu.destroy();
  });
});

describe('icon search and catalog (1.7)', () => {
  it('ranks exact, prefix, word prefix, substring, then keywords', () => {
    expect(searchIcons(ENTRIES, 'bug', 10)).toEqual({ names: ['bug', 'bug-off', 'ladybug'], total: 3 });
    expect(searchIcons(ENTRIES, 'insect', 10).names).toEqual(['bug', 'ladybug']);
    expect(searchIcons(ENTRIES, 'bug off', 10).names).toEqual(['bug-off']);
    expect(searchIcons(ENTRIES, 'off', 10).names).toEqual(['bug-off']);
    expect(searchIcons(ENTRIES, 'idea lig', 10).names).toEqual(['bulb']);
    expect(searchIcons(ENTRIES, 'ock', 10).names).toEqual(['alarm']);
    expect(searchIcons(ENTRIES, 'zzz', 10)).toEqual({ names: [], total: 0 });
    expect(searchIcons(ENTRIES, '  ', 2)).toEqual({ names: ['alarm', 'bug'], total: 5 });
  });

  it('merges the allowlist first, keeping catalog keywords and dropping duplicates', () => {
    expect(mergeEntries(['bulb', 'custom', 'bulb'], ENTRIES).map((e) => e.name)).toEqual(['bulb', 'custom', 'alarm', 'bug', 'bug-off', 'ladybug']);
    expect(mergeEntries(['bulb'], ENTRIES)[0]!.keywords).toContain('idea');
  });

  it('the generated catalog has every Tabler outline icon with keywords', () => {
    expect(parseCatalog('a\tb c\nd\n')).toEqual([{ name: 'a', keywords: 'b c' }, { name: 'd', keywords: '' }]);
    expect(VERSION).toMatch(/^3\.\d+\.\d+$/);
    expect(catalog().length).toBeGreaterThan(5000);
    expect(catalog()).toBe(catalog());
    expect(hasIcon('bulb')).toBe(true);
    expect(hasIcon('nope-nope')).toBe(false);
    expect(searchIcons(catalog(), 'idea', 5).names).toContain('bulb');
  });

  it('the Vite plugin builds the catalog module and sprite shards from the package', () => {
    const data = readTabler();
    const names = iconNames(data);
    expect(names.length).toBe(catalog().length);
    expect(catalogText(data).split('\n')[0]).toMatch(/^[a-z0-9-]+(\t.*)?$/);
    const shards = spriteShards(data);
    expect([...shards.keys()].every((k) => /^[a-z0-9]$/.test(k))).toBe(true);
    const a = shards.get('a')!;
    expect(a).toContain('<symbol id="tabler-alarm" viewBox="0 0 24 24" fill="none" stroke="currentColor"');
    expect(a).not.toMatch(/style=|<script|href=/);
    const plugin = tablerIcons();
    const resolveId = plugin.resolveId as unknown as (id: string) => string | null;
    const load = plugin.load as unknown as (id: string) => string | null;
    expect(resolveId(CATALOG_ID)).toBe(`\0${CATALOG_ID}`);
    expect(resolveId('x')).toBeNull();
    expect(load('x')).toBeNull();
    expect(load(`\0${CATALOG_ID}`)).toContain('export const VERSION');
    expect((plugin.closeBundle as unknown as () => void)()).toBeUndefined();
  });

  it('dialect helpers: callout icon values and emoji', () => {
    expect(calloutIcon({ icon: 'bulb' })).toEqual({ kind: 'tabler', name: 'bulb' });
    expect(calloutIcon({ icon: '💡' })).toEqual({ kind: 'emoji', value: '💡' });
    expect(calloutIcon({ icon: '👩‍💻' })).toEqual({ kind: 'emoji', value: '👩‍💻' });
    expect(calloutIcon({ icon: 'Bulb' })).toBeNull();
    expect(calloutIcon({ icon: '<b>' })).toBeNull();
    expect(calloutIcon({})).toBeNull();
    expect(isEmojiValue('é')).toBe(false);
    expect(isEmojiValue('💡 x')).toBe(false);
    expect(isEmojiValue('💡💡💡💡💡💡💡💡💡')).toBe(false);
    expect(isEmojiValue('⚠️')).toBe(true);
  });

  it('runtime: host sprite first, then catalog shards; picker availability', () => {
    const host = runtime({ spriteUrl: '/s.svg', icons: new Set(['bug']) });
    expect(iconHref(host, 'bug')).toBe('/s.svg#tabler-bug');
    expect(iconHref(host, 'bulb')).toBeNull();
    const both = runtime({ spriteUrl: '/s.svg', icons: new Set(['bug']), catalogUrl: '/b/icons/' });
    expect(iconHref(both, 'bulb')).toBe('/b/icons/tabler-b.svg#tabler-bulb');
    expect(iconHref(both, 'Bad"')).toBeNull();
    expect(iconSvg(both, 'bulb')!.querySelector('use')!.getAttribute('href')).toBe('/b/icons/tabler-b.svg#tabler-bulb');
    expect(catalogShard('3d-cube-sphere')).toBe('tabler-3.svg');
    expect(pickerAvailable(runtime())).toBe(false);
    expect(pickerAvailable(host)).toBe(true);
    expect(pickerAvailable(runtime({ catalogUrl: '/i/' }))).toBe(true);
  });

  it('options: icon flags only change with non-default values; asset URLs are module-relative', async () => {
    expect(parseOptions('{}')).toMatchObject({ iconCatalog: false, toolbarIcons: true, menuIcons: true });
    expect(parseOptions('{"iconCatalog":true,"toolbarIcons":false,"menuIcons":false}')).toMatchObject({ iconCatalog: true, toolbarIcons: false, menuIcons: false });
    setAssetBase('https://h.test/bundles/nowomilkdowneditor/');
    expect(assetUrl('icons/')).toBe('https://h.test/bundles/nowomilkdowneditor/icons/');
    setAssetBase('');
    expect(await catalogEntries(runtime())).toEqual([]);
    expect((await catalogEntries(runtime({ catalogUrl: '/i/' }))).length).toBeGreaterThan(5000);
  });
});

describe('icon picker (1.7)', () => {
  const openPicker = (extra: Partial<Parameters<typeof open>[0]> = {}) => {
    const host = document.createElement('div');
    document.body.append(host);
    const onPick = vi.fn();
    const onClose = vi.fn();
    const p = open({ host, runtime: runtime({ icons: new Set(['bug']), spriteUrl: '/s.svg', catalogUrl: '/i/' }), x: 10, y: 20, entries: async () => ENTRIES, onPick, onClose, ...extra });
    return { p, onPick, onClose, host };
  };

  it('follows the combobox + listbox pattern; Up / Down / Page keys move, Enter picks', async () => {
    const { p, onPick } = openPicker();
    await settle();
    const dialog = picker()!;
    expect(dialog.getAttribute('aria-label')).toBe('Choose an icon');
    const input = search();
    expect(document.activeElement).toBe(input);
    expect(input.getAttribute('aria-expanded')).toBe('true');
    expect(input.getAttribute('aria-autocomplete')).toBe('list');
    const list = dialog.querySelector('[role="listbox"]')!;
    expect(input.getAttribute('aria-controls')).toBe(list.id);
    expect(list.getAttribute('aria-label')).toBe('Icons');
    expect(options().map((o) => o.textContent)).toEqual(['bug', 'alarm', 'bug-off', 'ladybug', 'bulb']);
    expect(options()[0]!.querySelector('svg')!.getAttribute('aria-hidden')).toBe('true');
    expect(input.getAttribute('aria-activedescendant')).toBe(options()[0]!.id);
    expect(dialog.querySelector('[aria-live]')!.textContent).toBe('5 results');
    keydown(input, 'ArrowUp');
    expect(options()[4]!.getAttribute('aria-selected')).toBe('true');
    keydown(input, 'ArrowDown');
    expect(options()[0]!.getAttribute('aria-selected')).toBe('true');
    keydown(input, 'PageDown');
    expect(options()[4]!.getAttribute('aria-selected')).toBe('true');
    keydown(input, 'PageUp');
    expect(options()[0]!.getAttribute('aria-selected')).toBe('true');
    expect(keydown(input, 'a').defaultPrevented).toBe(false);
    typeQuery('insect');
    expect(options().map((o) => o.dataset.value)).toEqual(['bug', 'ladybug']);
    keydown(input, 'ArrowDown');
    keydown(input, 'Enter');
    expect(onPick).toHaveBeenCalledWith('ladybug');
    expect(picker()).toBeNull();
    expect(p.isOpen).toBe(false);
  });

  it('says when nothing matches and when results are cut; Escape and Tab close with focus restore', async () => {
    const many = Array.from({ length: MAX_OPTIONS + 5 }, (_, i): IconEntry => ({ name: `i${i}`, keywords: '' }));
    const first = openPicker({ entries: async () => many, runtime: runtime({ catalogUrl: '/i/' }) });
    await settle();
    expect(picker()!.querySelector('[aria-live]')!.textContent).toBe(`Showing ${MAX_OPTIONS} of ${MAX_OPTIONS + 5} results`);
    typeQuery('zzz');
    expect(picker()!.querySelector('.nowo-milkdown-picker__empty')?.textContent).toBe('No icons match');
    expect(search().hasAttribute('aria-activedescendant')).toBe(false);
    keydown(search(), 'ArrowDown');
    keydown(search(), 'Enter');
    expect(first.onPick).not.toHaveBeenCalled();
    keydown(search(), 'Escape');
    expect(first.onClose).toHaveBeenCalledWith(true);
    first.p.close(true);
    expect(first.onClose).toHaveBeenCalledTimes(1);
    const second = openPicker();
    keydown(search(), 'Tab');
    expect(second.onClose).toHaveBeenCalledWith(true);
  });

  it('a click on an option picks it; a click outside closes; a new picker replaces the open one', async () => {
    const one = openPicker();
    await settle();
    const two = openPicker();
    expect(one.onClose).toHaveBeenCalledWith(false);
    await settle();
    options()[1]!.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));
    expect(two.onPick).toHaveBeenCalledWith('alarm');
    const three = openPicker();
    await settle();
    picker()!.querySelector('[role="listbox"]')!.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    expect(picker()).not.toBeNull();
    document.body.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    expect(three.onClose).toHaveBeenCalledWith(false);
    const four = openPicker({ entries: async () => Promise.reject(new Error('x')) });
    await settle();
    expect(options().map((o) => o.textContent)).toEqual(['bug']);
    four.p.close(false);
  });

  it('callout mode: Icons / Emoji tabs, No icon, current value selected', async () => {
    const { onPick } = openPicker({ emoji: true, allowNone: true, current: 'bulb' });
    await settle();
    const tabs = [...picker()!.querySelectorAll<HTMLButtonElement>('[role="tab"]')];
    expect(tabs.map((b) => [b.textContent, b.getAttribute('aria-selected')])).toEqual([['Icons', 'true'], ['Emoji', 'false']]);
    expect(picker()!.querySelector('[role="tablist"]')).not.toBeNull();
    const list = picker()!.querySelector('[role="listbox"]')!;
    expect(list.getAttribute('aria-labelledby')).toBe(tabs[0]!.id);
    expect(options()[0]!.textContent).toBe('No icon');
    expect(options().find((o) => o.getAttribute('aria-selected') === 'true')?.dataset.value).toBe('bulb');
    // Shift+Tab to the tabs, arrows switch, Tab back to the field.
    keydown(search(), 'Tab', { shiftKey: true });
    expect(document.activeElement).toBe(tabs[0]);
    keydown(tabs[0]!, 'ArrowRight');
    expect(document.activeElement).toBe(tabs[1]);
    expect(tabs[1]!.getAttribute('aria-selected')).toBe('true');
    expect(options()[1]!.querySelector('.nowo-milkdown-picker__emoji')?.getAttribute('aria-hidden')).toBe('true');
    expect(keydown(tabs[1]!, 'Enter').defaultPrevented).toBe(false);
    expect(keydown(tabs[1]!, 'ArrowDown').defaultPrevented).toBe(false);
    expect(keydown(tabs[1]!, 'ArrowUp').defaultPrevented).toBe(false);
    keydown(tabs[1]!, 'ArrowLeft');
    keydown(document.activeElement!, 'ArrowLeft');
    expect(tabs[1]!.getAttribute('aria-selected')).toBe('true');
    keydown(tabs[1]!, 'Tab');
    expect(document.activeElement).toBe(search());
    typeQuery('rock');
    keydown(search(), 'ArrowDown');
    keydown(search(), 'Enter');
    expect(onPick).toHaveBeenCalledWith('🚀');
    // Click on a tab; Tab from the tabs backwards closes.
    const next = openPicker({ emoji: true, allowNone: true });
    await settle();
    const nextTabs = [...picker()!.querySelectorAll<HTMLButtonElement>('[role="tab"]')];
    nextTabs[1]!.click();
    expect(document.activeElement).toBe(search());
    expect(options()[0]!.textContent).toBe('No icon');
    keydown(search(), 'Enter');
    expect(next.onPick).toHaveBeenCalledWith(null);
    const last = openPicker({ emoji: true });
    keydown(search(), 'Tab', { shiftKey: true });
    keydown(document.activeElement!, 'Tab', { shiftKey: true });
    expect(last.onClose).toHaveBeenCalledWith(true);
  });

  it('emoji only without icons; an emoji current value opens the Emoji tab', async () => {
    openPicker({ emoji: true, icons: false });
    await settle();
    expect(picker()!.querySelector('[role="tablist"]')).toBeNull();
    expect(picker()!.querySelector('[role="listbox"]')!.getAttribute('aria-label')).toBe('Emoji');
    expect(options()[0]!.textContent).toBe('😄smile');
    const p = new IconPicker({ host: document.body, runtime: runtime({ menuIcons: false }), x: 0, y: 0, emoji: true, current: '🚀', entries: async () => [], onPick: () => undefined, onClose: () => undefined });
    expect(p.tab).toBe('emoji');
    expect(p.element.querySelector('.nowo-milkdown-picker__search-icon')).toBeNull();
  });
});

describe('icons in the editor (1.7)', () => {
  const OPTS = { icons: ['bug', 'bulb'], iconSpriteUrl: '/s.svg' };

  it('the slash /icon opens the picker and inserts inline in the same paragraph', async () => {
    handle = await editor('', { ...OPTS, features: ['slash_menu'] });
    const v = view(handle);
    v.dispatch(v.state.tr.insertText('/icon'));
    await settle();
    const options = [...handle.root.querySelectorAll('.nowo-milkdown-suggest [role="option"]')];
    expect(options[0]!.textContent).toBe('Icon…');
    expect(options[0]!.querySelector('svg.nowo-milkdown-suggest__glyph')?.getAttribute('aria-hidden')).toBe('true');
    keydown(v.dom, 'Enter');
    await settle();
    typeQuery('bulb');
    keydown(search(), 'Enter');
    expect(handle.getMarkdown().trimEnd()).toBe(':tabler-bulb:');
    expect(v.state.doc.childCount).toBe(1);
  });

  it('the slash menu glyphs follow menu_icons', async () => {
    handle = await editor('', { ...OPTS, features: ['slash_menu'], menuIcons: false });
    const v = view(handle);
    v.dispatch(v.state.tr.insertText('/'));
    await settle();
    expect(handle.root.querySelector('.nowo-milkdown-suggest svg')).toBeNull();
  });

  it('Insert → Icon… puts the icon at the caret, inline, never in a new block (owner bug)', async () => {
    handle = await editor('Hello world', { ...OPTS, features: ['context_menu', 'insert_menu'] });
    const v = view(handle);
    v.dispatch(v.state.tr.setSelection(TextSelection.create(v.state.doc, 7)));
    // Shift+F10 opens the menu at the caret (a right click would first move the caret to the pointer).
    keydown(v.dom, 'F10', { shiftKey: true });
    const root = handle.root.querySelector<HTMLElement>('.nowo-milkdown-menu[role="menu"]')!;
    expect(root.classList.contains('nowo-milkdown-menu--icons')).toBe(true);
    expect(root.querySelector('[data-id="copy"] svg')?.getAttribute('aria-hidden')).toBe('true');
    root.querySelector<HTMLElement>('[data-id="insert"]')!.click();
    const sub = [...handle.root.querySelectorAll<HTMLElement>('.nowo-milkdown-menu')].find((m) => m !== root && !m.hidden)!;
    const icon = sub.querySelector<HTMLElement>('[data-id="insert_icon"]')!;
    expect(icon.textContent).toBe('Icon…');
    icon.click();
    await settle();
    typeQuery('bug');
    keydown(search(), 'Enter');
    expect(handle.getMarkdown()).toBe('Hello :tabler-bug: world\n');
    expect(v.state.doc.childCount).toBe(1);
  });

  it('the action bar button and Browse all icons… from : insert at the caret', async () => {
    handle = await editor('word', OPTS);
    const buttons = [...handle.root.querySelectorAll<HTMLButtonElement>('.nowo-milkdown__action')];
    expect(buttons[0]!.textContent).toBe('Insert icon');
    expect(buttons[0]!.querySelector('svg.nowo-milkdown__action-icon')?.getAttribute('aria-hidden')).toBe('true');
    caretAtEnd(handle);
    buttons[0]!.click();
    await settle();
    keydown(search(), 'Enter');
    expect(handle.getMarkdown().trimEnd()).toBe('word:tabler-bug:');
    const v = view(handle);
    caretAtEnd(handle);
    v.dispatch(v.state.tr.insertText(' :bul'));
    await settle();
    const opts = [...handle.root.querySelectorAll<HTMLElement>('.nowo-milkdown-suggest [role="option"]')];
    expect(opts.at(-1)!.textContent).toBe('Browse all icons…');
    keydown(v.dom, 'ArrowUp');
    keydown(v.dom, 'Enter');
    await settle();
    expect(search().value).toBe('bul');
    keydown(search(), 'Enter');
    expect(handle.getMarkdown().trimEnd()).toBe('word:tabler-bug:  :tabler-bulb:');
    expect(v.state.doc.childCount).toBe(1);
  });

  it('toolbar_icons off: plain text buttons', async () => {
    handle = await editor('word', { ...OPTS, toolbarIcons: false });
    expect(handle.root.querySelector('.nowo-milkdown__action svg')).toBeNull();
  });

  it('without icons or catalog the icon entry still types : (remote suggestions only)', async () => {
    handle = await editor('', { suggestions: { ':': '/icons' } });
    const button = handle.root.querySelector<HTMLButtonElement>('.nowo-milkdown__action')!;
    button.click();
    expect(view(handle).state.doc.textContent).toBe(':');
    expect(picker()).toBeNull();
  });

  it('with the catalog: : searches it, catalog icons render from the shards, unknown names become text', async () => {
    setAssetBase('https://h.test/b/');
    handle = await editor(':tabler-bulb: :tabler-nope-nope:', { iconCatalog: true });
    await settle();
    const [ok, bad] = [...handle.root.querySelectorAll<HTMLElement>('.nowo-milkdown-tabler')];
    expect(ok!.querySelector('use')!.getAttribute('href')).toBe('https://h.test/b/icons/tabler-b.svg#tabler-bulb');
    expect(ok!.getAttribute('role')).toBe('img');
    expect(bad!.classList.contains('nowo-milkdown-tabler--unknown')).toBe(true);
    expect(bad!.textContent).toBe(':tabler-nope-nope:');
    expect(bad!.hasAttribute('role')).toBe(false);
    const v = view(handle);
    caretAtEnd(handle);
    v.dispatch(v.state.tr.insertText(' :idea'));
    await settle();
    const opts = [...handle.root.querySelectorAll<HTMLElement>('.nowo-milkdown-suggest [role="option"]')].map((o) => o.textContent);
    expect(opts).toContain('bulb');
    expect(handle.getMarkdown()).toContain(':tabler-bulb: :tabler-nope-nope:');
    setAssetBase('');
  });

  it('a catalog chunk that fails to load leaves catalog-only icons as text', async () => {
    vi.spyOn(lazyIcons, 'catalog').mockRejectedValue(new Error('offline'));
    handle = await editor(':tabler-bulb:', { iconCatalog: true });
    await settle();
    expect(handle.root.querySelector('.nowo-milkdown-tabler--unknown')?.textContent).toBe(':tabler-bulb:');
  });

  it('insertIcon falls back to a new paragraph only where inline nodes cannot go', async () => {
    handle = await editor('```\ncode\n```\n', OPTS);
    const v = view(handle);
    v.dispatch(v.state.tr.setSelection(TextSelection.create(v.state.doc, 2)));
    const blocks = v.state.doc.childCount;
    insertIcon(v, 'bug');
    expect(handle.getMarkdown()).toMatch(/```\n+:tabler-bug:/);
    expect(v.state.doc.childCount).toBe(blocks + 1);
    expect(v.state.doc.child(1).firstChild?.type.name).toBe('tablerIcon');
    await openPickerAtCaret(v, defaultRuntime());
    keydown(search(), 'Escape');
    expect(picker()).toBeNull();
  });

  it('a picker opened at a caret that moved restores it before inserting', async () => {
    handle = await editor('abc def', OPTS);
    const v = view(handle);
    v.dispatch(v.state.tr.setSelection(TextSelection.create(v.state.doc, 4)));
    await openPickerAtCaret(v, { ...defaultRuntime(), icons: new Set(['bug']), spriteUrl: '/s.svg' });
    await settle();
    v.dispatch(v.state.tr.setSelection(TextSelection.create(v.state.doc, 1)));
    keydown(search(), 'Enter');
    expect(handle.getMarkdown()).toBe('abc:tabler-bug:  def\n');
  });
});

describe('callout icons (1.7)', () => {
  const button = (h: MilkdownEditorHandle) => h.root.querySelector<HTMLButtonElement>('.nowo-milkdown-directive__icon')!;

  it('round-trips Tabler and emoji icons; callouts without icon are unchanged', async () => {
    const md = ':::callout{icon="bulb" type="info"}\nIdea.\n:::\n\n:::callout{icon="💡" type="warning"}\nCareful.\n:::\n\n:::callout{type="danger"}\nPlain.\n:::\n';
    handle = await editor(md, { icons: ['bulb'], iconSpriteUrl: '/s.svg' });
    expect(handle.getMarkdown()).toBe(md);
    const buttons = [...handle.root.querySelectorAll<HTMLButtonElement>('.nowo-milkdown-directive__icon')];
    expect(buttons.map((b) => b.getAttribute('aria-label'))).toEqual(['Callout icon: bulb', 'Callout icon: 💡', 'Choose a callout icon']);
    expect(buttons[0]!.querySelector('use')!.getAttribute('href')).toBe('/s.svg#tabler-bulb');
    expect(buttons[1]!.querySelector('.nowo-milkdown-directive__emoji')!.getAttribute('aria-hidden')).toBe('true');
    expect(buttons[2]!.querySelector('svg')!.getAttribute('aria-hidden')).toBe('true');
    expect(buttons.every((b) => b.getAttribute('aria-haspopup') === 'dialog')).toBe(true);
  });

  it('picks a Tabler icon, an emoji and No icon; focus returns to the button', async () => {
    handle = await editor(':::callout{type="info"}\nText\n:::\n', { icons: ['bulb'], iconSpriteUrl: '/s.svg' });
    button(handle).click();
    await settle();
    typeQuery('bulb');
    keydown(search(), 'ArrowDown');
    keydown(search(), 'Enter');
    expect(handle.getMarkdown()).toBe(':::callout{icon="bulb" type="info"}\nText\n:::\n');
    expect(document.activeElement).toBe(button(handle));
    button(handle).click();
    await settle();
    const tabs = [...picker()!.querySelectorAll<HTMLButtonElement>('[role="tab"]')];
    tabs[1]!.click();
    typeQuery('tada');
    keydown(search(), 'ArrowDown');
    keydown(search(), 'Enter');
    expect(handle.getMarkdown()).toBe(':::callout{icon="🎉" type="info"}\nText\n:::\n');
    button(handle).click();
    await settle();
    expect(picker()!.querySelector('[role="tablist"]')!.querySelector('[aria-selected="true"]')!.textContent).toBe('Emoji');
    keydown(search(), 'Home');
    typeQuery('');
    options()[0]!.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));
    expect(handle.getMarkdown()).toBe(':::callout{type="info"}\nText\n:::\n');
    button(handle).click();
    await settle();
    keydown(search(), 'Escape');
    expect(document.activeElement).toBe(button(handle));
    button(handle).click();
    await settle();
    document.body.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    expect(picker()).toBeNull();
  });

  it('works with emoji only without icons; unresolved names show as text; readonly disables it', async () => {
    handle = await editor(':::callout{icon="rocket" type="info"}\nText\n:::\n');
    expect(button(handle).querySelector('.nowo-milkdown-directive__icon-name')?.textContent).toBe('rocket');
    button(handle).click();
    await settle();
    expect(picker()!.querySelector('[role="tablist"]')).toBeNull();
    keydown(search(), 'Escape');
    await handle.destroy();
    handle = await editor(':::callout{type="info"}\nText\n:::\n', { readonly: true });
    expect(button(handle).disabled).toBe(true);
    const v = view(handle);
    const node = v.state.doc.firstChild!;
    const b = calloutIconButton(defaultRuntime(), {}, v, () => 0);
    b.click();
    await settle();
    expect(picker()).toBeNull();
    expect(node.type.name).toBe('containerDirective');
  });
});
