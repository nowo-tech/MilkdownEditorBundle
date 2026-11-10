import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { parsePreviewTypes, previewUrl, withUrlPatterns } from '../src/host';
import { fileCard, isPreviewable, resetPreviewWatcher } from '../src/dialect/file-card';
import { pageHostConfig } from '../src/options';
import { editor } from './helpers';
import type { MilkdownEditorHandle } from '../src/editor';

// 1.16 (spec 212 block B): previews of `url: written` pattern cards and the types the host can preview.
const UUID = '0f8fad5b-d9cb-469f-a165-70867728950e';
const FILES = '^/files/(?<id>[0-9a-f-]{36})/(?:original|preview)$';
const schemes = { 'app-file': { image: '/files/{id}/preview', file: '/files/{id}/original', preview: '/files/{id}/frame' } };
const noPreview = { 'app-file': { image: '/files/{id}/preview', file: '/files/{id}/original', preview: null } };
const written = withUrlPatterns(schemes, [{ pattern: FILES, scheme: 'app-file', url: 'written' }]);
const href = `/files/${UUID}/original`;

/** A fake `IntersectionObserver` that reports every observed frame near the viewport at once. */
class NearObserver {
  constructor(private readonly callback: IntersectionObserverCallback) {}
  observe(target: Element): void {
    this.callback([{ target, isIntersecting: true } as unknown as IntersectionObserverEntry], this as unknown as IntersectionObserver);
  }
  unobserve(): void {}
  disconnect(): void {}
}

describe('previewUrl()', () => {
  it('keeps the 1.9 / 1.13 rules without the option', () => {
    expect(previewUrl('app-file:abc', schemes)).toBe('/files/abc/frame');
    expect(previewUrl('app-file:../x', schemes)).toBeNull();
    expect(previewUrl(href, written)).toBeNull();
    expect(previewUrl('https://example.com/a.csv', written)).toBeNull();
    const resolved = withUrlPatterns(schemes, [{ pattern: FILES, scheme: 'app-file', url: 'resolved' }]);
    expect(previewUrl(href, resolved)).toBe(`/files/${UUID}/frame`);
  });

  it('written patterns get the template URL of the matched id, never the written URL', () => {
    expect(previewUrl(href, written, true)).toBe(`/files/${UUID}/frame`);
    expect(previewUrl(`/files/${UUID.toUpperCase()}/preview?x=1#y`, written, true)).toBe(`/files/${UUID}/frame`);
    // Not a pattern URL: no frame, whatever it is.
    for (const value of ['https://evil.example/x', 'javascript:alert(1)', 'data:text/html,<b>', `/files/${UUID}/thumb`, `//evil.example/files/${UUID}/original`, 42, null]) {
      expect(previewUrl(value, written, true)).toBeNull();
    }
    // A scheme without a preview template, or a pattern-less schemes object.
    expect(previewUrl(href, withUrlPatterns(noPreview, [{ pattern: FILES, scheme: 'app-file' }]), true)).toBeNull();
    expect(previewUrl(href, schemes, true)).toBeNull();
    // A host value that cannot be resolved stays inert.
    expect(previewUrl('app-file:', written, true)).toBeNull();
  });
});

describe('file_preview_types', () => {
  it('parses MIME types, families and extensions only', () => {
    expect(parsePreviewTypes(['Text/CSV', 'text/*', '.CSV', ' .md ', 'text/csv', 'csv', '*/*', 'text/', '.toolongext', 42, 'a b/c'])).toEqual(['text/csv', 'text/*', '.csv', '.md']);
    expect(parsePreviewTypes('text/csv')).toEqual([]);
    expect(parsePreviewTypes(Array.from({ length: 150 }, (_, i) => `.e${i}`))).toHaveLength(100);
  });

  it('an empty list accepts every card; otherwise the extension or the MIME type must be listed', () => {
    expect(isPreviewable([], 'a.pdf')).toBe(true);
    const types = ['.csv', 'text/*', 'application/json'];
    expect(isPreviewable(types, 'data.csv', '', href)).toBe(true);
    expect(isPreviewable(types, 'x', '', '/files/a/data.CSV?v=1')).toBe(true);
    expect(isPreviewable(types, 'notes', 'text/plain; charset=utf-8', href)).toBe(true);
    expect(isPreviewable(types, 'a', 'application/json', href)).toBe(true);
    expect(isPreviewable(types, 'report.pdf', 'application/pdf', href)).toBe(false);
    expect(isPreviewable(types, 'report', '', href)).toBe(false);
    expect(isPreviewable(types, 'report', 'not a type', href)).toBe(false);
  });
});

describe('file cards with written previews', () => {
  beforeEach(() => {
    resetPreviewWatcher();
    vi.stubGlobal('IntersectionObserver', NearObserver);
  });
  afterEach(() => {
    resetPreviewWatcher();
    vi.unstubAllGlobals();
  });

  it('shows only the card without the option (as 1.15)', () => {
    expect(fileCard('a.csv', { href, view: 'preview' }, { hostSchemes: written, previewSandbox: '' }).querySelector('iframe')).toBeNull();
  });

  it('frames the template URL, sandboxed, lazy and without referrer; links keep the written URL', () => {
    const card = fileCard('a.csv', { href, view: 'preview', type: 'text/csv' }, { hostSchemes: written, previewSandbox: 'allow-downloads', previewWrittenUrls: true });
    const frame = card.querySelector('iframe')!;
    expect(frame.getAttribute('src')).toBe(`/files/${UUID}/frame`);
    expect(frame.getAttribute('sandbox')).toBe('allow-downloads');
    expect(frame.getAttribute('loading')).toBe('lazy');
    expect(frame.getAttribute('referrerpolicy')).toBe('no-referrer');
    expect(card.querySelector('.nowo-milkdown-file__open')?.getAttribute('href')).toBe(href);
  });

  it('a type the host cannot preview stays a card', () => {
    const context = { hostSchemes: written, previewSandbox: '', previewWrittenUrls: true, previewTypes: ['text/csv', '.md'] };
    expect(fileCard('report.pdf', { href, view: 'preview', type: 'application/pdf' }, context).querySelector('iframe')).toBeNull();
    expect(fileCard('notes.md', { href, view: 'preview' }, context).querySelector('iframe')).not.toBeNull();
    // Also for host references.
    expect(fileCard('report.pdf', { href: 'app-file:abc', view: 'preview' }, { ...context, hostSchemes: schemes }).querySelector('iframe')).toBeNull();
  });
});

describe('page configuration (1.16)', () => {
  let handle: MilkdownEditorHandle | null = null;
  beforeEach(() => {
    resetPreviewWatcher();
    vi.stubGlobal('IntersectionObserver', NearObserver);
  });
  afterEach(async () => {
    await handle?.destroy();
    handle = null;
    resetPreviewWatcher();
    vi.unstubAllGlobals();
    document.head.querySelectorAll('script[data-nowo-milkdown-config]').forEach((el) => el.remove());
  });

  const block = (data: Record<string, unknown>): void => {
    const el = document.createElement('script');
    el.type = 'application/json';
    el.setAttribute('data-nowo-milkdown-config', '');
    el.textContent = JSON.stringify(data);
    document.head.append(el);
  };

  it('reads the options from the page block only', () => {
    block({ hostSchemes: schemes, previewWrittenUrls: true, previewTypes: ['text/csv', 'bad'] });
    expect(pageHostConfig()).toMatchObject({ previewWrittenUrls: true, previewTypes: ['text/csv'] });
    document.head.querySelector('script[data-nowo-milkdown-config]')!.textContent = JSON.stringify({ hostSchemes: schemes, previewWrittenUrls: 'yes' });
    expect(pageHostConfig()).toMatchObject({ previewWrittenUrls: false, previewTypes: [] });
  });

  it('the editor previews a written card of the page configuration', async () => {
    const md = `::file[data.csv]{href="${href}" type="text/csv" view="preview"}`;
    block({ hostSchemes: schemes, hostUrlPatterns: [{ pattern: FILES, scheme: 'app-file', url: 'written' }], previewWrittenUrls: true, previewTypes: ['text/csv'] });
    handle = await editor(md);
    expect(handle.root.querySelector('iframe.nowo-milkdown-file__frame')?.getAttribute('src')).toBe(`/files/${UUID}/frame`);
    expect(handle.getMarkdown()).toContain(href);
  });

  it('options in the widget JSON are ignored (audit GX-L2)', async () => {
    const md = `::file[data.csv]{href="${href}" type="text/csv" view="preview"}`;
    block({ hostSchemes: schemes, hostUrlPatterns: [{ pattern: FILES, scheme: 'app-file', url: 'written' }] });
    handle = await editor(md, { previewWrittenUrls: true });
    expect(handle.root.querySelector('iframe')).toBeNull();
  });
});
