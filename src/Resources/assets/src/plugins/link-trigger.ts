/**
 * 1.18 `link_picker`: typing `[[` opens the link picker on its *Wiki page* tab (instead of the `[[` suggestion list).
 * The two brackets are taken out while the picker is open; closing it without a pick types them back, so a literal
 * `[[` stays possible. Never inside code, and only when the host gave a candidates URL.
 */
import { Plugin, PluginKey } from '@milkdown/kit/prose/state';
import { $prose } from '@milkdown/kit/utils';
import { runtimeCtx } from '../runtime';

export const linkTriggerKey = new PluginKey('nowo-milkdown-link-trigger');

export const linkTriggerPlugin = $prose(
  (ctx) =>
    new Plugin({
      key: linkTriggerKey,
      props: {
        handleTextInput: (view, from, to, text) => {
          const runtime = ctx.get(runtimeCtx.key);
          if (text !== '[' || !runtime.openLinkPicker || !runtime.linkPickerPages || from !== to || from < 1) return false;
          const $from = view.state.doc.resolve(from);
          if ($from.parent.type.spec.code || $from.marks().some((m) => m.type.spec.code)) return false;
          if (view.state.doc.textBetween(from - 1, from, '', '') !== '[') return false;
          view.dispatch(view.state.tr.delete(from - 1, from));
          const doc = view.state.doc;
          runtime.openLinkPicker(view, { tab: 'page' }, () => {
            if (view.isDestroyed) return;
            // Back where they were typed; after a change meanwhile (a peer's), at the caret, which the change mapped (RV-I5).
            const sel = view.state.selection;
            if (view.state.doc.eq(doc)) view.dispatch(view.state.tr.insertText('[[', from - 1));
            else if (sel.empty) view.dispatch(view.state.tr.insertText('[[', sel.from));
          });
          return true;
        },
      },
    }),
);
