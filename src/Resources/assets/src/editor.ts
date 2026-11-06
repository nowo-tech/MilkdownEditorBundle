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
import { headingIdGenerator } from '@milkdown/kit/preset/commonmark';
import { uploadConfig } from '@milkdown/kit/plugin/upload';
import { $prose, replaceAll } from '@milkdown/kit/utils';
import type { EditorView } from '@milkdown/kit/prose/view';
import { addFeatures } from './features';
import { createPageResolver } from './link-titles';
import { createUserResolver } from './user-names';
import { parseOptions } from './options';
import { directives } from './nodes/directives';
import { imageAttributesSchema, imageView } from './nodes/image';
import { inlineRefs, mentionNameView } from './nodes/inline-refs';
import { taskListView } from './nodes/task-list';
import { editableAttributes, watchControls } from './plugins/a11y';
import { keyboardPlugin } from './plugins/keyboard';
import { suggestPlugin } from './plugins/suggest';
import { defaultRuntime, pickerAvailable, runtimeCtx, t, type Runtime } from './runtime';
import { glyph } from './ui/icons';
import { assetUrl } from './assets';
import { openPickerAtCaret } from './icons/open';
import { buildTriggers, slashItems } from './triggers';
import { insertItems, type InsertItem } from './commands/insert';
import { createFileDrop } from './plugins/file-drop';
import { insertButtonPlugin } from './plugins/insert-button';
import { HEADING_PREFIX, slug } from './plugins/heading-slug';
import type { EditorOptions } from './types';
import type { MercureProvider } from './collab/mercure-provider';
import type { CommentsApi, CommentsHost, ThreadUi, YjsAnchors } from './comments/index';


/** Hidden field a save from a live collaborative session carries (the topic): the host keeps the shared log (1.2). */
export const SESSION_FIELD = '_nowo_milkdown_collab';
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
  /** `comments` API (1.6); undefined when the feature is off. */
  comments?: CommentsApi;
};

let sequence = 0;
/** How long a transient confirmation stays in the live region (ms, 1.5.1). */
export const STATUS_CLEAR_MS = 4000;
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
  // 1.5.1: confirmations ("Copied as Markdown") are transient: cleared after a few seconds and on the next action.
  let clearTimer: ReturnType<typeof setTimeout> | null = null;
  let transientText: string | null = null;
  const clearTransient = (): void => {
    if (clearTimer) clearTimeout(clearTimer);
    clearTimer = null;
    if (transientText !== null && status.textContent === transientText) status.textContent = '';
    transientText = null;
  };
  const announce = (key: string, params: Record<string, string | number>, error = false, transient = false): void => {
    clearTransient();
    const text = t(runtime, key, params);
    (error ? alert : status).textContent = text;
    if (!error) alert.textContent = '';
    if (transient && !error) {
      transientText = text;
      clearTimer = setTimeout(clearTransient, STATUS_CLEAR_MS);
    }
  };
  surface.addEventListener('keydown', clearTransient);
  surface.addEventListener('pointerdown', clearTransient);
  return { bar, surface, status, announce };
}

function actionButton(bar: HTMLElement, label: string, onClick: () => void, icon: string | null = null): HTMLButtonElement {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'nowo-milkdown__action';
  // 1.7 `toolbar_icons`: a decorative glyph before the label (the label stays the accessible name).
  const art = icon ? glyph(icon, 'nowo-milkdown__action-icon') : null;
  if (art) button.append(art);
  button.append(label);
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
  const users = createUserResolver(options.mentionDisplay === 'name' ? options.userTitleUrl : null);
  const runtime: Runtime = {
    ...defaultRuntime(),
    messages: options.messages,
    spriteUrl: options.iconSpriteUrl,
    icons: new Set(options.icons),
    catalogUrl: options.iconCatalog ? assetUrl('icons/') : null,
    menuIcons: options.menuIcons,
    resolvePage: pages.resolve,
    resolveUser: users.resolve,
    features: new Set(options.features),
    colors: options.colors,
    nonce: options.nonce,
    dark: () => isDark(root),
    hostSchemes: options.hostSchemes,
    previewSandbox: options.previewSandbox,
  };
  root.classList.add('nowo-milkdown');
  root.dataset.theme = options.theme;
  root.style.setProperty('--nowo-milkdown-min-height', options.minHeight);
  textarea.hidden = true;
  textarea.value = normaliseNewlines(textarea.value);
  const { bar, surface, status, announce } = chrome(root, runtime);
  if (options.version) root.insertBefore((await import('./version')).versionBanner(root, options.version, runtime), bar);
  const label = labelFor(textarea);
  const initial = textarea.value;
  // 1.9 (ME-5): an upload may answer with a host reference instead of a URL.
  if (options.upload) options.upload.hostSchemes = options.hostSchemes;
  // 1.8 (ME-3): drop / paste of several files with a placeholder each; also cancels file drops on read-only editors
  // and fields without uploads (a hint instead of the browser opening the file or Crepe inserting a blob: image).
  const fileDrop = createFileDrop({ upload: options.upload, cards: options.features.includes('file_cards'), runtime, announce });
  const upload = options.readonly ? null : options.upload;
  /** Opens the file picker and uploads the files at the caret (action bar, `/file`, *Insert*). */
  const pickFiles = (view: EditorView, fileView?: string): void => {
    if (!upload) return;
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    if (upload.accept.length) input.accept = upload.accept.join(',');
    input.addEventListener('change', () => {
      const files = Array.from(input.files ?? []);
      if (!files.length || view.isDestroyed) return;
      void fileDrop.uploadFiles(view, files, view.state.selection.from, fileView).then(() => {
        if (!view.isDestroyed) view.focus();
      });
    });
    input.click();
  };
  if (upload) runtime.pickFiles = pickFiles;

  const builder = new CrepeBuilder({ root: surface, defaultValue: options.collaboration ? '' : initial });
  const editor = builder.editor;
  const collabModule = options.collaboration ? await import('./collab/index') : null;
  // 1.3: the context menu is a lazy chunk, loaded only when the field enables it.
  const contextMenuModule = options.features.includes('context_menu') ? await import('./plugins/context-menu') : null;
  const blockActionsModule = options.features.includes('block_actions') ? await import('./plugins/block-actions') : null;
  const colorsModule = options.features.includes('colors') ? await import('./commands/colors') : null;
  // 1.5: smart paste and Paste / Copy as Markdown.
  const clipboardModule = options.features.includes('markdown_clipboard') ? await import('./commands/markdown-clipboard') : null;
  clipboardModule?.allowPastedHostSchemes(Object.keys(options.hostSchemes));
  // 1.6: comment highlights, anchors and events (a lazy chunk); the thread component is another chunk.
  const commentsModule = options.comments ? await import('./comments/index') : null;
  let yjs: YjsAnchors | null = null;
  let threadUi: ThreadUi | null = null;
  const commentsHost: CommentsHost | null = options.comments
    ? { root, announce: (key, params) => announce(key, params), yjs: () => yjs, canCreate: options.comments.canCreate }
    : null;
  editor
    .config((ctx) => {
      ctx.set(runtimeCtx.key, runtime);
      // Editor heading ids are always prefixed (`nowo-h-<slug>`): Milkdown's default id is the bare heading text, which
      // a heading could use to take over a host element id, e.g. the comments drawer (audit DW-M2).
      ctx.set(headingIdGenerator.key, (node) => HEADING_PREFIX + slug(node.textContent));
      ctx.update(editorViewOptionsCtx, (prev) => ({
        ...prev,
        attributes: { ...editableAttributes(options.label || t(runtime, 'editor.label'), label?.id ?? null, options.readonly), id: `nowo-milkdown-${++sequence}` },
      }));
      // Milkdown's own upload plugin never inserts anything (the file drop props above run first; this is a backstop).
      ctx.update(uploadConfig.key, (prev) => ({ ...prev, uploader: async () => [] }));
      ctx.update(editorViewOptionsCtx, (prev) => ({
        ...prev,
        handleDOMEvents: { ...prev.handleDOMEvents, ...fileDrop.props.handleDOMEvents },
        handlePaste: (view, event, slice) => fileDrop.props.handlePaste(view, event) || (prev.handlePaste?.(view, event, slice) ?? false),
      }));
      if (clipboardModule) {
        // A view prop runs before Milkdown's clipboard plugin (which would take the HTML path).
        const smart = clipboardModule.smartPaste(clipboardModule.markdownIo(ctx));
        ctx.update(editorViewOptionsCtx, (prev) => ({
          ...prev,
          handlePaste: (view, event, slice) => smart(view, event) || (prev.handlePaste?.(view, event, slice) ?? false),
          // DN-L1: every other paste path drops unsafe link and image targets the same way.
          transformPasted: (slice, view, plain) => clipboardModule.cleanPasted(prev.transformPasted ? prev.transformPasted(slice, view, plain) : slice),
        }));
      }
    })
    .use(runtimeCtx)
    .use(inlineRefs)
    .use(directives)
    .use(imageAttributesSchema)
    .use(taskListView)
    .use(suggestPlugin((ctx) => buildTriggers(ctx, { options, runtime, remember: pages.remember, rememberUser: users.remember })))
    .use(keyboardPlugin)
    .use($prose(() => fileDrop.plugin));
  if (options.mentionDisplay === 'name') editor.use(mentionNameView);
  // 1.9: other fields keep Milkdown's plain `<img>`.
  if (Object.keys(options.hostSchemes).length > 0 || options.features.includes('image_block')) editor.use(imageView);
  if (options.features.includes('insert_button') && !options.readonly) editor.use(insertButtonPlugin);
  if (collabModule) editor.use(collabModule.collab);
  if (contextMenuModule) editor.use(contextMenuModule.contextMenuPlugin);
  if (blockActionsModule) editor.use(blockActionsModule.blockActionsPlugin(options.features.includes('block_drag')));
  if (colorsModule) editor.use(colorsModule.colorMenuPlugin);
  if (clipboardModule) editor.use(clipboardModule.markdownClipboardPlugin((key, error) => announce(key, {}, error, true)));
  if (options.features.includes('heading_ids')) editor.use((await import('./plugins/heading-ids')).headingIdsPlugin);
  if (commentsModule && commentsHost) commentsModule.useComments(editor, commentsHost, () => threadUi);
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

  /**
   * *Insert icon* / *Icon…*: the picker at the caret (1.7, inline, never a new block) when the field has icons or the
   * catalog; otherwise types `:` at the caret (a space first after a word), which opens the icon suggestions.
   */
  const startIcon = (view: EditorView): void => {
    if (pickerAvailable(runtime)) {
      void openPickerAtCaret(view, runtime);
      return;
    }
    const { $from } = view.state.selection;
    const before = $from.parent.textBetween(0, $from.parentOffset, undefined, '￼');
    view.dispatch(view.state.tr.insertText(before === '' || /\s$/.test(before) ? ':' : ' :'));
    view.focus();
  };
  const iconsOffered = Boolean(options.suggestions[':'] || pickerAvailable(runtime));

  // 1.8 (ME-2) `action_bar_insert`: [] hides both buttons (`/file`, `/icon`, *Insert* and drop / paste stay).
  if (upload && options.actionBarInsert.includes('file')) {
    actionButton(bar, t(runtime, 'upload.button'), () => editor.action((ctx) => pickFiles(ctx.get(editorViewCtx))), options.toolbarIcons ? 'file-upload' : null);
  }
  if (iconsOffered && !options.readonly && options.actionBarInsert.includes('icon')) {
    actionButton(bar, t(runtime, 'icon.button'), () => editor.action((ctx) => startIcon(ctx.get(editorViewCtx))), options.toolbarIcons ? 'icons' : null);
  }
  // 1.5 `insert_menu`: the *Insert* group of the context menu (file, icon, the `/` blocks of the field).
  if (options.features.includes('insert_menu') && !options.readonly) {
    const actions: InsertItem[] = [];
    if (upload) actions.push({ id: 'file', label: t(runtime, 'menu.insert_file'), run: (view) => pickFiles(view) });
    if (iconsOffered) actions.push({ id: 'icon', label: t(runtime, 'slash.icon'), run: startIcon, inline: true });
    editor.action((ctx) => runtime.insert.push(...insertItems(slashItems(ctx, options, runtime), actions)));
  }
  if (!bar.childElementCount) bar.remove();

  let provider: MercureProvider | null = null;
  let stopCollaboration = (): void => undefined;
  if (collabModule && options.collaboration) {
    root.dataset.collab = 'connecting';
    const topic = options.collaboration.topic;
    const reloadModule = collabModule;
    const collaboration = await collabModule.startCollaboration(
      editor,
      options.collaboration,
      initial,
      (s) => {
        root.dataset.collab = s;
        announce(`collab.${s}`, {});
      },
      () => {
        // CX-L1: too many resets in a row — stay on the page, offer a manual reload.
        announce('collab.reset_paused', {});
        const reload = document.createElement('button');
        reload.type = 'button';
        reload.className = 'nowo-milkdown__reload';
        reload.textContent = t(runtime, 'collab.reload');
        reload.addEventListener('click', () => reloadModule.page.reload());
        status.after(reload);
      },
    );
    provider = collaboration.provider;
    if (commentsModule) yjs = collabModule.yjsAnchors(() => editor.action((ctx) => ctx.get(editorViewCtx).state));
    // 1.2: a save from the live session tells the host so (it keeps the shared log instead of resetting it).
    const live = provider;
    const markSession = (): void => {
      live.flush(true);
      let input = form?.querySelector<HTMLInputElement>(`input[name="${SESSION_FIELD}"]`) ?? null;
      if (live.status !== 'online') {
        input?.remove();
        return;
      }
      if (!input) {
        input = document.createElement('input');
        input.type = 'hidden';
        input.name = SESSION_FIELD;
        form?.append(input);
      }
      input.value = topic;
    };
    form?.addEventListener('submit', markSession, true);
    // 1.5.1: edits waiting in the send window go out when the editor loses focus.
    const flush = (): void => live.flush();
    surface.addEventListener('focusout', flush);
    stopCollaboration = () => {
      form?.removeEventListener('submit', markSession, true);
      surface.removeEventListener('focusout', flush);
      collaboration.stop();
    };
  }

  let destroyed = false;
  const comments = commentsModule && commentsHost ? commentsModule.commentsApi(editor, commentsHost, () => threadUi, () => !destroyed) : undefined;
  if (comments && commentsHost?.canCreate) runtime.comment = comments.start;
  // 1.6: the optional thread component (its own chunk), only with host endpoints and a panel.
  let stopThreads = (): void => undefined;
  const commentOptions = options.comments;
  if (comments && commentsModule && commentOptions?.url && commentOptions.panel !== 'none') {
    const url = commentOptions.url;
    const { mountThreadPanel } = await import('./comments/thread-ui');
    const panel = mountThreadPanel({
      root,
      surface,
      options: { ...commentOptions, url },
      runtime,
      api: () => comments,
      announce,
      tops: () => commentsModule.threadTops(editor, surface),
      hubUrl: options.collaboration?.hubUrl ?? null,
    });
    threadUi = { create: (d) => panel.create(d.anchor), open: (id) => panel.open(id), refresh: (ids) => panel.refresh(ids), mount: (el) => panel.mount(el) };
    stopThreads = () => panel.destroy();
  }

  return {
    root,
    textarea,
    options,
    builder,
    provider,
    ...(comments ? { comments } : {}),
    getMarkdown,
    setMarkdown: (markdown: string) => editor.action(replaceAll(normaliseNewlines(markdown))),
    focus,
    destroy: async () => {
      destroyed = true;
      stopThreads();
      unwatch();
      stopCollaboration();
      form?.removeEventListener('submit', sync, true);
      form?.removeEventListener('formdata', sync, true);
      label?.removeEventListener('click', focus);
      await builder.destroy();
      root.querySelectorAll('.nowo-milkdown__version, .nowo-milkdown__actions, .nowo-milkdown__surface, .nowo-milkdown__status, .nowo-milkdown__alert, .nowo-milkdown__reload').forEach((el) => el.remove());
      textarea.hidden = false;
    },
  };
}
