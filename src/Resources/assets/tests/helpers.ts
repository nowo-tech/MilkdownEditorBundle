import { createEditor, type MilkdownEditorHandle } from '../src/editor';
import type { EditorOptions } from '../src/types';

export const ID = '0b6f4f0e-3c55-4d0a-9a43-1f7a2c9e8d10';

/** Builds a widget root like the form theme does. */
export function widget(markdown: string, options: Record<string, unknown> = {}, label = true): HTMLElement {
  document.body.replaceChildren();
  const form = document.createElement('form');
  if (label) {
    const l = document.createElement('label');
    l.htmlFor = 'f_body';
    l.textContent = 'Body';
    form.append(l);
  }
  const root = document.createElement('div');
  root.dataset.nowoMilkdownOptions = JSON.stringify({ features: [], ...options });
  const textarea = document.createElement('textarea');
  textarea.id = 'f_body';
  textarea.name = 'body';
  textarea.value = markdown;
  root.append(textarea);
  form.append(root);
  document.body.append(form);
  return root;
}

export async function editor(markdown: string, options: Record<string, unknown> = {}, overrides: Partial<EditorOptions> = {}): Promise<MilkdownEditorHandle> {
  return createEditor(widget(markdown, options), overrides);
}

export const tick = (ms = 0): Promise<void> => new Promise((r) => setTimeout(r, ms));

export function keydown(target: EventTarget, key: string, init: KeyboardEventInit = {}): KeyboardEvent {
  const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true, ...init });
  target.dispatchEvent(event);
  return event;
}
