/**
 * Notion / Outline style file drop and paste (1.8, ME-3).
 *
 * - Drop (or paste) **several files at once**: each one gets its own placeholder at the drop point (ProseMirror's drop
 *   cursor shows where they land) with its progress, and they upload one after the other so they land **in order**.
 * - An image becomes an image, any other file a file card (`file_cards`) or a link (see `upload.ts`).
 * - A failed file leaves a dismissible inline notice in place of its placeholder (the error is also announced in the
 *   alert region); the notice is a decoration, never part of the document.
 * - Read-only editors and fields without `upload_url` insert nothing: the drop is cancelled (the browser does not open
 *   the file) and the status region says uploads are off.
 * - Paste: a clipboard with files and no HTML (a screenshot, files copied in a file manager) behaves like a drop at
 *   the caret; HTML with files (Word, Excel, a copied web image) keeps the normal paste.
 *
 * The keyboard path is `/file`, *Insert → Image or file…* and the action bar (WCAG 2.5.7 alternative to dragging).
 */
import { Plugin, PluginKey, type EditorState, type Transaction } from '@milkdown/kit/prose/state';
import { Decoration, DecorationSet, type EditorView } from '@milkdown/kit/prose/view';
import { sendFile, uploadOne, type Announce } from '../upload';
import type { UploadOptions } from '../types';
import { t, type Runtime } from '../runtime';

type Add = { id: number; pos: number; name: string; index: number };
type Meta = { add?: Add[]; remove?: number; error?: { id: number; pos: number; message: string; index: number }; dismiss?: number };

export const fileDropKey = new PluginKey<DecorationSet>('nowo-milkdown-file-drop');

let sequence = 0;

export type FileDropOptions = {
  /** Upload options; null: uploads are off (a drop only shows the hint). */
  upload: UploadOptions | null;
  /** `file_cards`: other files become `::file` cards. */
  cards: boolean;
  runtime: Runtime;
  announce: Announce;
  /** The transport (tests). */
  send?: typeof sendFile;
};

/** Whether a drag or clipboard carries files. */
const hasFiles = (data: DataTransfer | null | undefined): boolean =>
  !!data && ((data.files?.length ?? 0) > 0 || Array.from(data.types ?? []).includes('Files'));

function placeholder(runtime: Runtime, name: string): HTMLElement {
  const el = document.createElement('span');
  el.className = 'nowo-milkdown-upload';
  el.contentEditable = 'false';
  el.dataset.state = 'waiting';
  // The live region announces the progress; the placeholder is visual only.
  el.setAttribute('aria-hidden', 'true');
  const label = document.createElement('span');
  label.className = 'nowo-milkdown-upload__name';
  label.textContent = name;
  const progress = document.createElement('span');
  progress.className = 'nowo-milkdown-upload__progress';
  progress.textContent = t(runtime, 'upload.waiting');
  el.append(label, progress);
  return el;
}

/**
 * The drop / paste handlers and the placeholder plugin of one editor.
 *
 * @param options - Upload options, `file_cards`, the runtime and the live regions
 * @returns `plugin` (placeholders), `props` (view props merged into the editor's own, so they run before Milkdown's
 *   upload plugin) and `uploadFiles` (the picker, `/file` and *Insert*)
 */
export function createFileDrop(options: FileDropOptions) {
  const { runtime, announce } = options;
  const elements = new Map<number, HTMLElement>();

  const plugin = new Plugin<DecorationSet>({
    key: fileDropKey,
    state: {
      init: () => DecorationSet.empty,
      apply(tr: Transaction, set: DecorationSet): DecorationSet {
        let next = set.map(tr.mapping, tr.doc);
        const meta = tr.getMeta(fileDropKey) as Meta | undefined;
        if (!meta) return next;
        if (meta.add) {
          next = next.add(
            tr.doc,
            meta.add.map((a) => {
              const el = placeholder(runtime, a.name);
              elements.set(a.id, el);
              // Ordered by `side` at the same position; positive: content inserted here goes before the later ones.
              return Decoration.widget(a.pos, el, { id: a.id, side: a.index + 1, ignoreSelection: true });
            }),
          );
        }
        const drop = (id: number | undefined): void => {
          if (id === undefined) return;
          next = next.remove(next.find(undefined, undefined, (spec) => spec.id === id));
          elements.delete(id);
        };
        drop(meta.remove);
        drop(meta.dismiss);
        if (meta.error) {
          const { id, pos, message, index } = meta.error;
          drop(id);
          const el = notice(message, () => dismiss(id));
          // Negative side: files that land here later go after the notice, which keeps the drop order.
          next = next.add(tr.doc, [Decoration.widget(pos, el, { id, side: -1000 + index, ignoreSelection: true, stopEvent: () => true })]);
        }
        return next;
      },
    },
    props: {
      decorations: (state: EditorState) => fileDropKey.getState(state),
    },
  });

  let view: EditorView | null = null;
  const dismiss = (id: number): void => {
    if (view && !view.isDestroyed) view.dispatch(view.state.tr.setMeta(fileDropKey, { dismiss: id } satisfies Meta));
  };
  const notice = (message: string, onDismiss: () => void): HTMLElement => {
    const el = document.createElement('span');
    el.className = 'nowo-milkdown-upload nowo-milkdown-upload--error';
    el.contentEditable = 'false';
    el.dataset.state = 'error';
    const text = document.createElement('span');
    text.className = 'nowo-milkdown-upload__message';
    text.textContent = message;
    const close = document.createElement('button');
    close.type = 'button';
    close.className = 'nowo-milkdown-upload__dismiss';
    close.setAttribute('aria-label', t(runtime, 'upload.dismiss'));
    close.textContent = '×';
    close.addEventListener('click', (event) => {
      event.preventDefault();
      onDismiss();
      view?.focus();
    });
    el.append(text, close);
    return el;
  };
  const find = (state: EditorState, id: number): number | null => {
    const found = fileDropKey.getState(state)?.find(undefined, undefined, (spec) => spec.id === id) ?? [];
    return found.length ? found[0]!.from : null;
  };

  /**
   * Uploads files one after the other into the document at `pos`, each with its own placeholder.
   *
   * @param target - The editor
   * @param files - Files in drop order
   * @param pos - Document position where they land
   * @param fileView - 1.9: view of new file cards (`/file` variants)
   */
  async function uploadFiles(target: EditorView, files: File[], pos: number, fileView = 'card'): Promise<void> {
    view = target;
    const upload = options.upload;
    if (!upload || !files.length) return;
    const jobs = files.map((file, index) => ({ file, index, id: ++sequence }));
    target.dispatch(target.state.tr.setMeta(fileDropKey, { add: jobs.map((j) => ({ id: j.id, pos, name: j.file.name, index: j.index })) } satisfies Meta));
    for (const job of jobs) {
      const el = elements.get(job.id);
      const { node, error } = await uploadOne(job.file, upload, announce, target.state.schema, options.cards, options.send, (percent) => {
        if (!el) return;
        el.dataset.state = 'uploading';
        el.lastElementChild!.textContent = `${percent}%`;
      }, fileView);
      if (target.isDestroyed) return;
      const at = find(target.state, job.id);
      if (at === null) continue;
      const tr = target.state.tr;
      if (error !== null) {
        tr.setMeta(fileDropKey, { error: { id: job.id, pos: at, index: job.index, message: t(runtime, error, { name: job.file.name }) } } satisfies Meta);
      } else {
        tr.setMeta(fileDropKey, { remove: job.id } satisfies Meta);
        if (node) tr.replaceRangeWith(at, at, node);
      }
      target.dispatch(tr);
    }
  }

  const off = (): boolean => {
    announce('upload.off', {});
    return true;
  };

  const props = {
    handleDOMEvents: {
      dragover: (target: EditorView, event: DragEvent): boolean => {
        // Read-only or no uploads: accept the drag so the drop below can cancel it (the browser would open the file).
        if ((!target.editable || !options.upload) && hasFiles(event.dataTransfer)) {
          event.preventDefault();
          return true;
        }
        return false;
      },
      drop: (target: EditorView, event: DragEvent): boolean => {
        const files = Array.from(event.dataTransfer?.files ?? []);
        if (!files.length || target.dragging) return false;
        event.preventDefault();
        if (!target.editable || !options.upload) return off();
        let pos: number | undefined;
        try {
          pos = target.posAtCoords({ left: event.clientX, top: event.clientY })?.pos;
        } catch {
          pos = undefined; // no layout (e.g. a detached or hidden editor): the caret
        }
        void uploadFiles(target, files, pos ?? target.state.selection.from);
        return true;
      },
    },
    handlePaste: (target: EditorView, event: ClipboardEvent): boolean => {
      const data = event.clipboardData;
      const files = Array.from(data?.files ?? []);
      // HTML with files (Word, Excel, a copied web image): the normal paste keeps the text and structure.
      if (!files.length || data?.getData('text/html')) return false;
      event.preventDefault();
      if (!options.upload) return off();
      const tr = target.state.tr.deleteSelection();
      target.dispatch(tr);
      void uploadFiles(target, files, target.state.selection.from);
      return true;
    },
  };

  return { plugin, props, uploadFiles };
}
