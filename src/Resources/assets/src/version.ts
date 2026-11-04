/**
 * `version_view` (1.6): the banner of a read-only mount on an old version. *Restore* and *Copy to new page* only
 * emit `nowo-milkdown:version-restore` / `nowo-milkdown:version-copy` (the host knows which version it rendered and
 * does the write itself); with `restore: false` / `copy: false` the buttons do not exist.
 */
import { t, type Runtime } from './runtime';
import type { VersionOptions } from './types';

/**
 * Builds the banner (text through `textContent` only).
 *
 * @param root - The widget root (events are dispatched on it)
 * @param version - The validated options
 * @param runtime - Messages
 * @returns The banner element (a named region)
 */
export function versionBanner(root: HTMLElement, version: VersionOptions, runtime: Runtime): HTMLElement {
  const banner = document.createElement('div');
  banner.className = 'nowo-milkdown__version';
  banner.setAttribute('role', 'region');
  banner.setAttribute('aria-label', t(runtime, 'version.region'));
  const text = document.createElement('p');
  text.className = 'nowo-milkdown__version-text';
  text.textContent = version.label ? t(runtime, 'version.viewing', { label: version.label }) : t(runtime, 'version.viewing_old');
  banner.append(text);
  const button = (name: 'restore' | 'copy'): void => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = `nowo-milkdown__action nowo-milkdown__version-${name}`;
    b.textContent = t(runtime, `version.${name}`);
    b.addEventListener('click', () => root.dispatchEvent(new CustomEvent(`nowo-milkdown:version-${name}`, { bubbles: true, detail: {} })));
    banner.append(b);
  };
  if (version.restore) button('restore');
  if (version.copy) button('copy');
  return banner;
}
