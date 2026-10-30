/**
 * Entry of `milkdown-editor.js` (ES module, `assets:install` → /bundles/nowomilkdowneditor/).
 *
 * Every `[data-nowo-milkdown-options]` widget is mounted on load, on `turbo:load` and when added to the page later
 * (MutationObserver). Hosts using Stimulus can register {@link createStimulusController} instead; mounting is
 * idempotent, so both may coexist. `renderRichContent()` renders Mermaid / math in server-rendered Markdown.
 */
import './styles/milkdown-editor.css';
import { createEditor, type MilkdownEditorHandle } from './editor';
import { renderRichContent } from './preview/render';
import { setAssetBase } from './assets';

// Directory of this module (string form: Vite would turn `new URL('./', import.meta.url)` into an inlined asset).
setAssetBase(import.meta.url.replace(/[^/]*$/, ''));

const SELECTOR = '[data-nowo-milkdown-options]';
const instances = new WeakMap<HTMLElement, Promise<MilkdownEditorHandle>>();

/**
 * Mounts one widget (once).
 *
 * @param root - The widget root (`[data-nowo-milkdown-options]`)
 * @returns The editor handle, shared by every later call for the same root
 */
export function mount(root: HTMLElement): Promise<MilkdownEditorHandle> {
  let handle = instances.get(root);
  if (!handle) {
    handle = createEditor(root);
    instances.set(root, handle);
    handle.then(
      () => root.dispatchEvent(new CustomEvent('nowo-milkdown:ready', { bubbles: true })),
      (error: unknown) => {
        instances.delete(root);
        console.error('nowo-milkdown', error instanceof Error ? (error.stack ?? error.message) : error);
      },
    );
  }
  return handle;
}

/**
 * Destroys a mounted widget (the textarea is shown again).
 *
 * @param root - The widget root
 * @returns Resolves once the editor is destroyed
 */
export async function unmount(root: HTMLElement): Promise<void> {
  const handle = instances.get(root);
  if (!handle) return;
  instances.delete(root);
  await (await handle).destroy();
}

/**
 * The handle of a mounted widget.
 *
 * @param root - The widget root
 * @returns The handle promise, or undefined when the root is not mounted
 */
export const instance = (root: HTMLElement): Promise<MilkdownEditorHandle> | undefined => instances.get(root);

/**
 * Mounts every widget under `scope`.
 *
 * @param scope - Where to look (default: the document)
 * @returns One handle promise per widget
 */
export function mountAll(scope: ParentNode = document): Promise<MilkdownEditorHandle>[] {
  return [...scope.querySelectorAll<HTMLElement>(SELECTOR)].map(mount);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- TypeScript requires `any[]` for mixin constructors.
type ControllerBase = new (...args: any[]) => { element: Element };

/**
 * A Stimulus controller class for hosts that register controllers:
 * `application.register('nowo--milkdown-editor', createStimulusController(Controller))`.
 *
 * @param Base - Stimulus' `Controller` class
 * @returns A controller that mounts on connect and unmounts on disconnect
 */
export function createStimulusController<T extends ControllerBase>(Base: T) {
  return class extends Base {
    connect(): void {
      void mount(this.element as HTMLElement);
    }

    disconnect(): void {
      void unmount(this.element as HTMLElement);
    }
  };
}

let observer: MutationObserver | null = null;

/**
 * Starts auto-mounting (called once when the module loads in a browser).
 *
 * @param doc - The document to watch
 */
export function start(doc: Document = document): void {
  const run = (): void => void mountAll(doc);
  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', run, { once: true });
  else run();
  doc.addEventListener('turbo:load', run);
  observer?.disconnect();
  observer = new MutationObserver((records) => {
    for (const record of records) {
      record.addedNodes.forEach((node) => {
        if (!(node instanceof HTMLElement)) return;
        if (node.matches(SELECTOR)) void mount(node);
        mountAll(node);
      });
    }
  });
  observer.observe(doc.documentElement, { childList: true, subtree: true });
}

export { createEditor, renderRichContent };

const api = { mount, unmount, mountAll, instance, renderRichContent, createStimulusController, start };
declare global {
  interface Window {
    NowoMilkdownEditor?: typeof api;
  }
}

if (typeof window !== 'undefined' && !window.NowoMilkdownEditor) {
  window.NowoMilkdownEditor = api;
  if (!document.documentElement.hasAttribute('data-nowo-milkdown-manual')) start();
}
