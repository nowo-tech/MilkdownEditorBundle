/**
 * Accessibility fixes over Crepe (FR-073): every button and button-like control in the editor gets a name,
 * the editable is a named multi-line textbox. Crepe renders some controls later (table handles, code-block
 * toolbars), so a MutationObserver keeps naming them.
 */
import { t, type Runtime } from '../runtime';

/** Selector → message key for Crepe controls that ship without a name. */
export const CONTROL_NAMES: ReadonlyArray<readonly [string, string]> = [
  ['[data-role="x-line-drag-handle"] .add-button', 'table.add_column'],
  ['[data-role="y-line-drag-handle"] .add-button', 'table.add_row'],
  ['[data-role="col-drag-handle"]', 'table.drag_column'],
  ['[data-role="row-drag-handle"]', 'table.drag_row'],
  ['[data-role="col-drag-handle"] [data-type="delete_col"]', 'table.delete_column'],
  ['[data-role="row-drag-handle"] [data-type="delete_row"]', 'table.delete_row'],
  ['[data-type="align_col_left"]', 'table.align_left'],
  ['[data-type="align_col_center"]', 'table.align_center'],
  ['[data-type="align_col_right"]', 'table.align_right'],
  ['.language-button', 'code.language'],
  ['.copy-button', 'code.copy'],
  ['.preview-toggle-button', 'code.preview'],
  ['.search-box input', 'code.language'],
];

const hasName = (el: Element): boolean =>
  !!(el.getAttribute('aria-label') || el.getAttribute('aria-labelledby') || el.getAttribute('title') || el.textContent?.trim());

/** Names the unnamed controls under `root`; returns how many it named. */
export function nameControls(root: ParentNode, runtime: Runtime): number {
  let named = 0;
  for (const [selector, key] of CONTROL_NAMES) {
    root.querySelectorAll(selector).forEach((el) => {
      // A visible label is the name (WCAG 2.5.3 label in name): only unnamed controls get one.
      if (el.getAttribute('aria-label') || el.textContent?.trim()) return;
      el.setAttribute('aria-label', t(runtime, key));
      if (el.tagName !== 'BUTTON' && el.tagName !== 'INPUT' && !el.getAttribute('role')) el.setAttribute('role', 'button');
      named++;
    });
  }
  root.querySelectorAll('button, [role="button"]').forEach((el) => {
    if (hasName(el)) return;
    el.setAttribute('aria-label', t(runtime, 'editor.button'));
    named++;
  });
  return named;
}

/** Keeps naming controls as Crepe adds them; returns the disconnect function. */
export function watchControls(root: HTMLElement, runtime: Runtime): () => void {
  nameControls(root, runtime);
  let queued = false;
  const observer = new MutationObserver(() => {
    if (queued) return;
    queued = true;
    queueMicrotask(() => {
      queued = false;
      nameControls(root, runtime);
    });
  });
  observer.observe(root, { childList: true, subtree: true });
  return () => observer.disconnect();
}

/** Attributes of the ProseMirror editable: a named, multi-line textbox. */
export function editableAttributes(label: string, labelledBy: string | null, readonly: boolean): Record<string, string> {
  const attrs: Record<string, string> = { role: 'textbox', 'aria-multiline': 'true' };
  if (labelledBy) attrs['aria-labelledby'] = labelledBy;
  else attrs['aria-label'] = label;
  if (readonly) attrs['aria-readonly'] = 'true';
  return attrs;
}
