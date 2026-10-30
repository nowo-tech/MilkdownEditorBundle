/**
 * GFM task items rendered with a real, named checkbox (Crepe's list-item feature wraps `<li>` in a `<div>` and
 * breaks list semantics, so the bundle does not use it: lists stay `ul > li`).
 */
import { listItemSchema } from '@milkdown/kit/preset/commonmark';
import { $view } from '@milkdown/kit/utils';
import type { Node as PmNode } from '@milkdown/kit/prose/model';
import { runtimeCtx, t } from '../runtime';

export const taskListView = $view(listItemSchema.node, (ctx) => (initial, view, getPos) => {
  const runtime = ctx.get(runtimeCtx.key);
  const dom = document.createElement('li');
  const isTask = (node: PmNode): boolean => node.attrs.checked !== null && node.attrs.checked !== undefined;
  if (!isTask(initial)) return { dom, contentDOM: dom, update: (node: PmNode) => node.type === initial.type && !isTask(node) };

  dom.className = 'nowo-milkdown-task';
  dom.dataset.itemType = 'task';
  const box = document.createElement('input');
  box.type = 'checkbox';
  box.className = 'nowo-milkdown-task__box';
  box.setAttribute('aria-label', t(runtime, 'task.toggle'));
  box.contentEditable = 'false';
  const contentDOM = document.createElement('div');
  contentDOM.className = 'nowo-milkdown-task__content';
  const paint = (node: PmNode): void => {
    box.checked = node.attrs.checked === true;
    dom.dataset.checked = String(node.attrs.checked === true);
  };
  paint(initial);
  box.addEventListener('change', () => {
    const pos = getPos();
    if (pos === undefined || pos >= view.state.doc.content.size) return;
    const node = view.state.doc.nodeAt(pos);
    if (node) view.dispatch(view.state.tr.setNodeMarkup(pos, undefined, { ...node.attrs, checked: box.checked }));
  });
  dom.append(box, contentDOM);
  return {
    dom,
    contentDOM,
    update: (node: PmNode) => {
      if (node.type !== initial.type || !isTask(node)) return false;
      paint(node);
      return true;
    },
    stopEvent: (event: Event) => event.target === box,
    ignoreMutation: (mutation: { type: string; target: Node }) =>
      mutation.type !== 'selection' && (mutation.target === box || (mutation.target === dom && mutation.type === 'attributes')),
  };
});
