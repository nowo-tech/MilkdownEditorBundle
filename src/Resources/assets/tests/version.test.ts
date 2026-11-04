import { afterEach, describe, expect, it } from 'vitest';
import { editor } from './helpers';
import type { MilkdownEditorHandle } from '../src/editor';
import { parseOptions } from '../src/options';

let handle: MilkdownEditorHandle | null = null;
afterEach(async () => {
  await handle?.destroy();
  handle = null;
  document.body.replaceChildren();
});

describe('version_view (1.6)', () => {
  it('forces read-only, drops collaboration, uploads and comments', () => {
    const o = parseOptions(
      JSON.stringify({
        features: ['version_view', 'comments'],
        version: { label: 'x'.repeat(300), copy: false },
        comments: { url: '/c' },
        upload: { url: '/u' },
        collaboration: { url: '/c', hubUrl: '/h', topic: 't' },
      }),
    );
    expect(o.readonly).toBe(true);
    expect(o.collaboration).toBeNull();
    expect(o.upload).toBeNull();
    expect(o.comments).toBeNull();
    expect(o.features).toEqual(['version_view']);
    expect(o.version).toEqual({ label: 'x'.repeat(200), restore: true, copy: false });
    expect(parseOptions('{}').version).toBeNull();
  });

  it('shows a named banner whose buttons only emit events', async () => {
    handle = await editor('Old text', { features: ['version_view'], version: { label: '<img src=x onerror=alert(1)>' } });
    const banner = handle.root.querySelector<HTMLElement>('.nowo-milkdown__version')!;
    expect(banner.getAttribute('role')).toBe('region');
    expect(banner.getAttribute('aria-label')).toBe('Version');
    expect(banner.textContent).toContain('Viewing the version of <img src=x onerror=alert(1)>');
    expect(banner.querySelector('img')).toBeNull();
    const events: string[] = [];
    handle.root.addEventListener('nowo-milkdown:version-restore', () => events.push('restore'));
    handle.root.addEventListener('nowo-milkdown:version-copy', () => events.push('copy'));
    banner.querySelector<HTMLButtonElement>('.nowo-milkdown__version-restore')!.click();
    banner.querySelector<HTMLButtonElement>('.nowo-milkdown__version-copy')!.click();
    expect(events).toEqual(['restore', 'copy']);
    expect(handle.root.querySelector('[contenteditable="true"]')).toBeNull();
    await handle.destroy();
    expect(handle.root.querySelector('.nowo-milkdown__version')).toBeNull();
    handle = null;
  });

  it('removes hidden actions and uses a generic text without a label', async () => {
    handle = await editor('Old', { features: ['version_view'], version: { restore: false, copy: false } });
    const banner = handle.root.querySelector<HTMLElement>('.nowo-milkdown__version')!;
    expect(banner.querySelectorAll('button')).toHaveLength(0);
    expect(banner.textContent).toBe('Viewing an earlier version');
  });
});
