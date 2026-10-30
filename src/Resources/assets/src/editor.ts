/**
 * Builds one editor on a widget root rendered by `MilkdownEditorType`:
 *
 *   <div class="nowo-milkdown" data-nowo-milkdown-options="{…}">
 *     <textarea hidden>Markdown</textarea>
 *   </div>
 *
 * The textarea keeps the Markdown (the form value); the editor writes back on every change and on submit.
 */
import { CrepeBuilder } from '@milkdown/crepe/builder';
import { editorViewCtx, editorViewOptionsCtx } from '@milkdown/kit/core';
import { uploadConfig } from '@milkdown/kit/plugin/upload';
import { replaceAll } from '@milkdown/kit/utils';
import type { Schema } from '@milkdown/kit/prose/model';
import { addFeatures } from './features';
import { createPageResolver } from './link-titles';
import { parseOptions } from './options';
import { directives } from './nodes/directives';
import { inlineRefs } from './nodes/inline-refs';
import { taskListView } from './nodes/task-list';
import { editableAttributes, watchControls } from './plugins/a11y';
import { keyboardPlugin } from './plugins/keyboard';
import { suggestPlugin } from './plugins/suggest';
import { defaultRuntime, runtimeCtx, t, type Runtime } from './runtime';
import { buildTriggers } from './triggers';
import { createUploader } from './upload';
import type { EditorOptions } from './types';
import type { MercureProvider } from './collab/mercure-provider';

export type MilkdownEditorHandle = {
  root: HTMLElement;
  textarea: HTMLTextAreaElement;
  options: EditorOptions;
  builder: CrepeBuilder;
  getMarkdown: () => string;
  setMarkdown: (markdown: string) => void;
  focus: () => void;
  destroy: () => Promise<void>;
  provider: MercureProvider | null;
};

let sequence = 0;
export const normaliseNewlines = (value: string): string => value.replace(/\r\n?/g, '\n');

/**
 * Whether the widget currently renders dark (explicit theme, or `auto` and a dark colour scheme).
 *
 * @param root - The widget root
 * @returns True for dark rendering
 */
export function isDark(root: HTMLElement): boolean {
  const theme = root.dataset.theme;
  if (theme === 'dark') return true;
  if (theme === 'light') return false;
  const host = root.parentElement?.closest<HTMLElement>('[data-theme]');
  if (host) return host.dataset.theme === 'dark';
  return typeof matchMedia === 'function' && matchMedia('(prefers-color-scheme: dark)').matches;
}

/** The form label of the textarea becomes the editable's name (`aria-labelledby`); a click on it focuses the editor. */
function labelFor(textarea: HTMLTextAreaElement): HTMLLabelElement | null {
  if (!textarea.id) return null;
  const label = document.querySelector<HTMLLabelElement>(`label[for="${CSS.escape(textarea.id)}"]`);
  if (label && !label.id) label.id = `${textarea.id}_label`;
  return label;
}

function chrome(root: HTMLElement, runtime: Runtime) {
  const bar = document.createElement('div');
  bar.className = 'nowo-milkdown__actions';
  const surface = document.createElement('div');
  surface.className = 'nowo-milkdown__surface';
  const status = document.createElement('div');
  status.className = 'nowo-milkdown__status';
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');
  const alert = document.createElement('div');
  alert.className = 'nowo-milkdown__alert';
  alert.setAttribute('role', 'alert');
  root.append(bar, surface, status, alert);
  const announce = (key: string, params: Record<string, string | number>, error = false): void => {
    (error ? alert : status).textContent = t(runtime, key, params);
    if (!error) alert.textContent = '';
  };
  return { bar, surface, status, announce };
}

function actionButton(bar: HTMLElement, label: string, onClick: () => void): HTMLButtonElement {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'nowo-milkdown__action';
  button.textContent = label;
  button.addEventListener('click', onClick);
  bar.append(button);
  return button;
}

/**
 * Builds the editor of one widget root.
 *
 * @param root - The widget root holding the textarea and the options JSON
 * @param overrides - Options that replace the parsed ones (tests, programmatic use)
 * @returns The editor handle once Milkdown is created (and collaboration connected)
 */
export async function createEditor(root: HTMLElement, overrides: Partial<EditorOptions> = {}): Promise<MilkdownEditorHandle> {
  const textarea = root.querySelector<HTMLTextAreaElement>('textarea');
  if (!textarea) throw new Error('nowo-milkdown: the widget has no textarea');
  const options: EditorOptions = { ...parseOptions(root.dataset.nowoMilkdownOptions), ...overrides };
  const pages = createPageResolver(options.linkTitleUrl);
  const runtime: Runtime = {
    ...defaultRuntime(),
    messages: options.messages,
    spriteUrl: options.iconSpriteUrl,
    icons: new Set(options.icons),
    resolvePage: pages.resolve,
    nonce: options.nonce,
    dark: () => isDark(root),
  };
  root.classList.add('nowo-milkdown');
  root.dataset.theme = options.theme;
  root.style.setProperty('--nowo-milkdown-min-height', options.minHeight);
  textarea.hidden = true;
  textarea.value = normaliseNewlines(textarea.value);
  const { bar, surface, announce } = chrome(root, runtime);
  const label = labelFor(textarea);
  const initial = textarea.value;

  const builder = new CrepeBuilder({ root: surface, defaultValue: options.collaboration ? '' : initial });
  const editor = builder.editor;
  const collabModule = options.collaboration ? await import('./collab/index') : null;
  editor
    .config((ctx) => {
      ctx.set(runtimeCtx.key, runtime);
      ctx.update(editorViewOptionsCtx, (prev) => ({
        ...prev,
        attributes: { ...editableAttributes(options.label || t(runtime, 'editor.label'), label?.id ?? null, options.readonly), id: `nowo-milkdown-${++sequence}` },
      }));
      if (options.upload) {
        const uploader = createUploader(options.upload, announce);
        ctx.update(uploadConfig.key, (prev) => ({ ...prev, uploader: (files: FileList, schema: Schema) => uploader(files, schema) }));
      }
    })
    .use(runtimeCtx)
    .use(inlineRefs)
    .use(directives)
    .use(taskListView)
    .use(suggestPlugin((ctx) => buildTriggers(ctx, { options, runtime, remember: pages.remember })))
    .use(keyboardPlugin);
  if (collabModule) editor.use(collabModule.collab);
  await addFeatures(builder, options, runtime);

  builder.on((api) =>
    api.markdownUpdated((_ctx, markdown) => {
      if (textarea.value === markdown) return;
      textarea.value = markdown;
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
      textarea.dispatchEvent(new Event('change', { bubbles: true }));
    }),
  );
  if (options.readonly) builder.setReadonly(true);
  await builder.create();

  const getMarkdown = (): string => builder.getMarkdown();
  const sync = (): void => {
    textarea.value = getMarkdown();
  };
  const form = textarea.form;
  form?.addEventListener('submit', sync, true);
  form?.addEventListener('formdata', sync, true);
  const focus = (): void => editor.action((ctx) => ctx.get(editorViewCtx).focus());
  label?.addEventListener('click', focus);
  const unwatch = watchControls(surface, runtime);

  if (options.upload && !options.readonly) {
    const upload = options.upload;
    actionButton(bar, t(runtime, 'upload.button'), () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.multiple = true;
      if (upload.accept.length) input.accept = upload.accept.join(',');
      input.addEventListener('change', () => {
        if (!input.files?.length) return;
        const uploader = createUploader(upload, announce);
        void editor.action(async (ctx) => {
          const view = ctx.get(editorViewCtx);
          const nodes = await uploader(input.files!, view.state.schema);
          let tr = view.state.tr;
          for (const node of nodes) tr = tr.replaceSelectionWith(node, false);
          if (nodes.length) view.dispatch(tr.scrollIntoView());
          view.focus();
        });
      });
      input.click();
    });
  }
  if ((options.suggestions[':'] || options.icons.length > 0) && !options.readonly) {
    actionButton(bar, t(runtime, 'icon.button'), () =>
      editor.action((ctx) => {
        const view = ctx.get(editorViewCtx);
        const { $from } = view.state.selection;
        const before = $from.parent.textBetween(0, $from.parentOffset, undefined, '￼');
        view.dispatch(view.state.tr.insertText(before === '' || /\s$/.test(before) ? ':' : ' :'));
        view.focus();
      }),
    );
  }
  if (!bar.childElementCount) bar.remove();

  let provider: MercureProvider | null = null;
  let stopCollaboration = (): void => undefined;
  if (collabModule && options.collaboration) {
    root.dataset.collab = 'connecting';
    const collaboration = await collabModule.startCollaboration(editor, options.collaboration, initial, (s) => {
      root.dataset.collab = s;
      announce(`collab.${s}`, {});
    });
    provider = collaboration.provider;
    stopCollaboration = collaboration.stop;
  }

  return {
    root,
    textarea,
    options,
    builder,
    provider,
    getMarkdown,
    setMarkdown: (markdown: string) => editor.action(replaceAll(normaliseNewlines(markdown))),
    focus,
    destroy: async () => {
      unwatch();
      stopCollaboration();
      form?.removeEventListener('submit', sync, true);
      form?.removeEventListener('formdata', sync, true);
      label?.removeEventListener('click', focus);
      await builder.destroy();
      root.querySelectorAll('.nowo-milkdown__actions, .nowo-milkdown__surface, .nowo-milkdown__status, .nowo-milkdown__alert').forEach((el) => el.remove());
      textarea.hidden = false;
    },
  };
}
