/**
 * Optional comment thread component (1.6, D15; contract section 6): a `complementary` region beside (margin) or
 * below / beside (sidebar) the editor, built on the host endpoints. All text goes through `textContent`; comment
 * bodies through {@link sanitizeBody}. Hosts that draw their own UI use `panel: 'none'` and the events.
 */
import { t, type Runtime } from '../runtime';
import type { CommentsOptions } from '../types';
import { ID_PATTERN, type CommentAnchor } from './anchor';
import { avatarElement } from './avatar';
import { CommentsClient, type Thread, type ThreadComment } from './client';
import { emit, type ThreadRef } from './plugin';
import { sanitizeBody } from './sanitize';
import type { CommentsApi } from './index';

/** Quick reactions (the full picker comes with `emoji_picker`). */
export const REACTIONS = ['👍', '❤️', '😄', '🎉', '👀', '✅'];
/** Live update debounce (ms). */
export const LIVE_DELAY = 500;
/** At most this many ids per live message. */
export const LIVE_MAX_IDS = 100;

export type ThreadUiDeps = {
  root: HTMLElement;
  surface: HTMLElement;
  options: CommentsOptions & { url: string };
  runtime: Runtime;
  api: () => CommentsApi;
  announce: (key: string, params: Record<string, string | number>, error?: boolean) => void;
  /** Vertical offsets of attached highlights (margin layout). */
  tops: () => Map<string, number>;
  /** Mercure hub of co-editing (live updates), or null. */
  hubUrl: string | null;
  client?: CommentsClient;
  eventSource?: (url: string) => EventSource;
};

const el = <K extends keyof HTMLElementTagNameMap>(tag: K, className: string, text?: string): HTMLElementTagNameMap[K] => {
  const e = document.createElement(tag);
  e.className = className;
  if (text !== undefined) e.textContent = text;
  return e;
};

/** The thread component. */
export class ThreadPanel {
  readonly element: HTMLElement;
  private readonly list: HTMLUListElement;
  private readonly pageList: HTMLUListElement;
  private readonly truncated: HTMLElement;
  private readonly composer: HTMLFormElement;
  private readonly client: CommentsClient;
  private threads = new Map<string, ThreadRef>();
  private page = new Map<string, ThreadRef>();
  private details = new Map<string, Thread>();
  private open_: string | null = null;
  private pending: CommentAnchor | null | undefined = undefined;
  /** Replies being typed, per thread id. */
  private drafts = new Map<string, string>();
  private showResolved = false;
  private live: EventSource | null = null;
  private liveIds = new Set<string>();
  private liveTimer: ReturnType<typeof setTimeout> | null = null;
  /** Set by destroy(): answers that arrive later are dropped (the editor is gone). */
  private destroyed = false;
  private readonly onAnchors = (e: Event): void => void this.saveAnchors((e as CustomEvent<{ anchors: { id: string; anchor: CommentAnchor }[] }>).detail.anchors);
  private readonly onOrphaned = (): void => this.render();

  /** Rendered into a host container (drawer), without chrome of its own. */
  get host(): boolean {
    return this.deps.options.panel === 'container';
  }

  /**
   * Moves the component into a host container (`panel: 'container'`; e.g. a drawer rendered after the editor).
   *
   * @param container - The host element
   */
  mount(container: HTMLElement): void {
    container.append(this.element);
  }

  /** Asks the host to show the component (open its drawer) before it is focused or scrolled to. */
  private requestOpen(id: string | null): void {
    emit(this.deps.root, 'comments-open-requested', { id });
  }

  constructor(private readonly deps: ThreadUiDeps) {
    const { runtime, options } = deps;
    this.client = deps.client ?? new CommentsClient(options.url, options.csrfToken);
    // `container` (drawer): a plain block inside the host's container; the host owns the landmark, heading, open / close,
    // Escape and the layout. Otherwise the component is its own named `complementary` region beside the editor.
    const host = this.host;
    const aside = el(host ? 'div' : 'aside', `nowo-milkdown-comments nowo-milkdown-comments--${options.panel}`);
    if (!host) aside.setAttribute('aria-label', t(runtime, 'comments.title'));
    const head = el('div', 'nowo-milkdown-comments__head');
    if (!host) head.append(el('h2', 'nowo-milkdown-comments__title', t(runtime, 'comments.title')));
    const toggle = el('label', 'nowo-milkdown-comments__toggle');
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.addEventListener('change', () => {
      this.showResolved = box.checked;
      deps.api().showResolved(box.checked);
      this.render();
    });
    toggle.append(box, document.createTextNode(` ${t(runtime, 'comments.show_resolved')}`));
    head.append(toggle);
    this.truncated = el('p', 'nowo-milkdown-comments__truncated', t(runtime, 'comments.truncated'));
    this.truncated.hidden = true;
    this.list = el('ul', 'nowo-milkdown-comments__list');
    this.pageList = el('ul', 'nowo-milkdown-comments__list nowo-milkdown-comments__list--page');
    this.composer = this.form(t(runtime, 'comments.new_label'), t(runtime, 'comments.send'), (body) => this.submitNew(body), () => this.closeComposer());
    this.composer.hidden = true;
    aside.append(head, this.truncated, this.composer, this.list, el('h3', 'nowo-milkdown-comments__subtitle', t(runtime, 'comments.page')), this.pageList);
    if (options.canCreate) {
      const add = el('button', 'nowo-milkdown__action nowo-milkdown-comments__add', t(runtime, 'comments.add_page'));
      add.type = 'button';
      add.addEventListener('click', () => this.create(null));
      aside.append(add);
    }
    this.element = aside;
    if (host) {
      const target = ((): HTMLElement | null => {
        try {
          return options.container ? document.querySelector<HTMLElement>(options.container) : null;
        } catch {
          return null; // an invalid selector: the host mounts the component with comments.mount()
        }
      })();
      target?.append(aside);
    } else {
      deps.root.classList.add('nowo-milkdown--with-comments');
      deps.surface.after(aside);
    }
    deps.root.addEventListener('nowo-milkdown:comment-anchors-changed', this.onAnchors);
    deps.root.addEventListener('nowo-milkdown:comment-orphaned', this.onOrphaned);
    this.connectLive();
  }

  /** Loads the thread list from the host. */
  async load(): Promise<void> {
    const r = await this.client.list();
    if (this.destroyed) return;
    if (!r.ok) {
      this.fail('list', r.status, 'comments.load_failed');
      return;
    }
    this.threads = r.value.threads;
    this.page = r.value.page;
    this.truncated.hidden = !r.value.truncated;
    // Page-level threads too: the counts (badge) include them; they have no highlight.
    this.deps.api().set([...this.threads.values(), ...this.page.values()]);
    this.render();
  }

  /** `comment-create` was not cancelled: opens the composer for this anchor (null: a page comment). */
  create(anchor: CommentAnchor | null): void {
    this.requestOpen(null);
    this.pending = anchor;
    const quote = this.composer.querySelector<HTMLElement>('.nowo-milkdown-comments__quote')!;
    quote.textContent = anchor ? anchor.quote.exact.slice(0, 200) : '';
    quote.hidden = !anchor;
    this.composer.hidden = false;
    const area = this.composer.querySelector('textarea')!;
    area.focus();
    // The shortcut runs inside the editor's keydown: ProseMirror may put focus back while it finishes the event.
    setTimeout(() => area.focus(), 0);
  }

  /**
   * Opens a thread view after a user action (a highlight, the list, the API): the host is asked to show the
   * component first (`comments-open-requested`), then the thread is scrolled into view and focused.
   */
  open(id: string): void {
    this.requestOpen(id);
    this.open_ = id;
    this.render();
    void this.refresh([id]).then(() => {
      if (this.destroyed) return;
      const section = this.element.querySelector<HTMLElement>(`[data-thread-id="${id}"] .nowo-milkdown-comments__thread`);
      section?.scrollIntoView({ block: 'nearest' });
      // Its first control (Beacon B-Q5), or the thread itself when it has none.
      (section?.querySelector<HTMLElement>('button, textarea, a[href]') ?? section)?.focus();
    });
  }

  /** Refetches threads (live updates, `comments.refresh()`): ids, or the whole list. */
  async refresh(ids?: string[]): Promise<void> {
    if (!ids) return this.load();
    for (const id of ids) {
      const r = await this.client.get(id);
      if (this.destroyed) return;
      if (!r.ok) {
        if (r.status === 404) this.drop(id);
        else this.fail('get', r.status, 'comments.load_failed');
        continue;
      }
      if (r.value) this.adopt(r.value, true);
    }
    this.render();
  }

  destroy(): void {
    this.destroyed = true;
    this.live?.close();
    if (this.liveTimer) clearTimeout(this.liveTimer);
    this.deps.root.removeEventListener('nowo-milkdown:comment-anchors-changed', this.onAnchors);
    this.deps.root.removeEventListener('nowo-milkdown:comment-orphaned', this.onOrphaned);
    this.deps.root.classList.remove('nowo-milkdown--with-comments');
    this.element.remove();
  }

  private fail(action: string, status: number, key: string): void {
    emit(this.deps.root, 'comment-error', { action, status });
    this.deps.announce(key, {}, true);
  }

  private drop(id: string): void {
    this.threads.delete(id);
    this.page.delete(id);
    this.details.delete(id);
    if (this.open_ === id) this.open_ = null;
    this.deps.api().remove(id);
  }

  /** Keeps a thread answer; announces new replies from others in an open thread. */
  private adopt(thread: Thread, announceNew = false): void {
    const before = this.details.get(thread.id);
    this.details.set(thread.id, thread);
    const ref: ThreadRef = { id: thread.id, anchor: thread.anchor, resolved: thread.resolved, count: thread.count, ...(thread.updatedAt ? { updatedAt: thread.updatedAt } : {}) };
    (thread.anchor ? this.threads : this.page).set(thread.id, ref);
    this.deps.api().upsert(ref);
    const last = thread.comments[thread.comments.length - 1];
    // Announced only while the component is shown (a closed host drawer is `hidden`): the badge carries the count.
    if (announceNew && before && last && !before.comments.some((c) => c.id === last.id) && !this.element.closest('[hidden]')) {
      this.deps.announce('comments.new_reply', { name: last.author.name });
    }
  }

  private async submitNew(body: string): Promise<void> {
    const anchor = this.pending ?? null;
    const r = await this.client.create(anchor, body);
    if (this.destroyed) return;
    if (!r.ok || !r.value) {
      this.fail('create', r.ok ? 0 : r.status, 'comments.failed');
      return;
    }
    this.adopt(r.value);
    this.closeComposer();
    emit(this.deps.root, 'comment-created', { thread: (anchor ? this.threads : this.page).get(r.value.id) });
    this.deps.announce('comments.sent', {});
    this.open(r.value.id);
  }

  private closeComposer(): void {
    this.pending = undefined;
    this.composer.reset();
    this.composer.hidden = true;
  }

  private async act(action: string, id: string, run: () => ReturnType<CommentsClient['get']>): Promise<void> {
    const r = await run();
    if (this.destroyed) return;
    if (!r.ok) {
      if (r.status === 404) this.drop(id);
      this.fail(action, r.status, 'comments.failed');
    } else if (r.value) this.adopt(r.value);
    else this.drop(id);
    // A resolved thread closes (as in Notion / Outline); it stays listed under *Show resolved*.
    if (r.ok && action === 'resolve' && this.open_ === id) this.open_ = null;
    emit(this.deps.root, 'comment-changed', { id, action });
    this.render();
  }

  /** PATCHes drifted anchors with the thread's `updatedAt` as base; a 409 refetches the thread. */
  private async saveAnchors(anchors: { id: string; anchor: CommentAnchor }[]): Promise<void> {
    for (const { id, anchor } of anchors) {
      const base = this.threads.get(id)?.updatedAt ?? null;
      const r = await this.client.anchor(id, anchor, base);
      if (this.destroyed) return;
      if (r.ok && r.value) this.adopt(r.value);
      else if (!r.ok && r.status === 409) await this.refresh([id]);
      else if (!r.ok) emit(this.deps.root, 'comment-error', { action: 'anchor', status: r.status });
    }
  }

  private connectLive(): void {
    const { options, hubUrl } = this.deps;
    if (!options.topic || !hubUrl) return;
    const url = new URL(hubUrl, window.location.href);
    url.searchParams.append('topic', options.topic);
    this.live = this.deps.eventSource ? this.deps.eventSource(url.toString()) : new EventSource(url.toString(), { withCredentials: true });
    this.live.addEventListener('message', (event) => {
      let ids: unknown;
      try {
        ids = (JSON.parse(String((event as MessageEvent).data)) as { threads?: unknown }).threads;
      } catch {
        return;
      }
      if (!Array.isArray(ids)) return;
      for (const id of ids.slice(0, LIVE_MAX_IDS)) if (typeof id === 'string' && ID_PATTERN.test(id)) this.liveIds.add(id);
      if (this.liveIds.size && !this.liveTimer) {
        this.liveTimer = setTimeout(() => {
          this.liveTimer = null;
          const batch = [...this.liveIds];
          this.liveIds.clear();
          void this.refresh(batch);
        }, LIVE_DELAY);
      }
    });
  }

  /** A textarea form (composer, reply, edit). */
  private form(label: string, submit: string, onSubmit: (body: string) => Promise<void> | void, onCancel: () => void, value = '', draft: string | null = null): HTMLFormElement {
    const { runtime } = this.deps;
    const form = el('form', 'nowo-milkdown-comments__form');
    const quote = el('blockquote', 'nowo-milkdown-comments__quote');
    quote.hidden = true;
    const field = el('label', 'nowo-milkdown-comments__label', label);
    const area = el('textarea', 'nowo-milkdown-comments__input');
    area.rows = 3;
    area.maxLength = 10_000;
    area.value = draft !== null ? (this.drafts.get(draft) ?? value) : value;
    // A reply being typed survives re-renders (live updates, the refetch after opening a thread).
    if (draft !== null) {
      area.dataset.draft = draft;
      area.addEventListener('input', () => this.drafts.set(draft, area.value));
    }
    field.append(area);
    const send = el('button', 'nowo-milkdown__action', submit);
    send.type = 'submit';
    const cancel = el('button', 'nowo-milkdown__action', t(runtime, 'comments.cancel'));
    cancel.type = 'button';
    cancel.addEventListener('click', onCancel);
    form.append(quote, field, send, cancel);
    const go = (): void => {
      const body = area.value.trim();
      if (body !== '') void onSubmit(body);
    };
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      go();
    });
    area.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        go();
      } else if (e.key === 'Escape' && !this.host) {
        e.preventDefault();
        onCancel();
      }
    });
    return form;
  }

  /** Re-renders the lists (cheap: at most a few hundred items). */
  render(): void {
    // Keep the focus in a reply being typed across the re-render.
    const typing = document.activeElement instanceof HTMLTextAreaElement && this.element.contains(document.activeElement) ? (document.activeElement.dataset.draft ?? null) : null;
    this.renderLists();
    if (typing !== null) {
      const area = this.element.querySelector<HTMLTextAreaElement>(`textarea[data-draft="${CSS.escape(typing)}"]`);
      area?.focus();
      area?.setSelectionRange(area.value.length, area.value.length);
    }
  }

  private renderLists(): void {
    const api = this.deps.api();
    // Only the margin layout aligns cards with their text; sidebar and host (drawer, phones) make no layout assumption.
    const tops = this.deps.options.panel === 'margin' ? this.deps.tops() : new Map<string, number>();
    const attached = [...this.threads.values()].filter((th) => !th.resolved || this.showResolved);
    const order = (th: ThreadRef): number => tops.get(th.id) ?? (api.status(th.id) === 'orphaned' ? Number.MAX_SAFE_INTEGER : 0);
    attached.sort((a, b) => order(a) - order(b));
    this.list.replaceChildren(...attached.map((th) => this.item(th, api.status(th.id) === 'orphaned')));
    let bottom = 0;
    for (const li of this.list.children) {
      const top = tops.get((li as HTMLElement).dataset.threadId ?? '');
      if (top === undefined) continue;
      const y = Math.max(top, bottom);
      (li as HTMLElement).style.marginTop = `${Math.max(0, y - bottom)}px`;
      bottom = y + (li as HTMLElement).offsetHeight;
    }
    this.pageList.replaceChildren(...[...this.page.values()].filter((th) => !th.resolved || this.showResolved).map((th) => this.item(th, false)));
  }

  private item(th: ThreadRef, orphaned: boolean): HTMLLIElement {
    const { runtime } = this.deps;
    const li = el('li', 'nowo-milkdown-comments__item');
    li.dataset.threadId = th.id;
    if (th.resolved) li.classList.add('nowo-milkdown-comments__item--resolved');
    const card = el('button', 'nowo-milkdown-comments__card');
    card.type = 'button';
    card.setAttribute('aria-expanded', String(this.open_ === th.id));
    const detail = this.details.get(th.id);
    const first = detail?.comments.find((c) => !c.deleted);
    const quote = th.anchor ? th.anchor.quote.exact.slice(0, 120) : '';
    if (quote) card.append(el('span', 'nowo-milkdown-comments__card-quote', quote));
    card.append(el('span', 'nowo-milkdown-comments__card-text', th.label ?? (first ? `${first.author.name}` : t(runtime, 'comments.open'))));
    card.append(el('span', 'nowo-milkdown-comments__count', t(runtime, 'comments.count', { count: th.count })));
    card.addEventListener('click', () => {
      if (this.open_ === th.id) {
        this.open_ = null;
        this.render();
        return;
      }
      // The panel keeps focus: the text is scrolled to and flashed, not focused.
      if (th.anchor && !orphaned) this.deps.api().reveal(th.id);
      if (emit(this.deps.root, 'comment-open', { id: th.id }, true)) this.open(th.id);
    });
    li.append(card);
    if (orphaned) li.append(el('p', 'nowo-milkdown-comments__orphaned', t(runtime, 'comments.orphaned')));
    if (this.open_ === th.id && detail) li.append(this.thread(detail));
    return li;
  }

  private thread(th: Thread): HTMLElement {
    const { runtime } = this.deps;
    const section = el('section', 'nowo-milkdown-comments__thread');
    section.tabIndex = -1;
    section.setAttribute('aria-label', t(runtime, 'comments.thread'));
    section.addEventListener('keydown', (e) => {
      // In a host drawer, Escape belongs to the host (it closes the drawer and restores focus).
      if (this.host || e.key !== 'Escape' || (e.target as HTMLElement).tagName === 'TEXTAREA') return;
      e.preventDefault();
      this.open_ = null;
      this.render();
      if (th.anchor && this.deps.api().status(th.id) === 'attached') this.deps.api().focus(th.id);
    });
    const list = el('ol', 'nowo-milkdown-comments__comments');
    for (const c of th.comments) list.append(this.comment(th, c));
    section.append(list);
    if (th.resolved && th.resolvedBy) {
      const resolved = el('p', 'nowo-milkdown-comments__resolved');
      resolved.append(avatarElement(th.resolvedBy.name, null, th.resolvedBy.avatarUrl), ` ${t(runtime, 'comments.resolved_by', { name: th.resolvedBy.name })}`);
      section.append(resolved);
    }
    const actions = el('div', 'nowo-milkdown-comments__actions');
    if (th.can.resolve) {
      const b = el('button', 'nowo-milkdown__action', t(runtime, th.resolved ? 'comments.reopen' : 'comments.resolve'));
      b.type = 'button';
      b.addEventListener('click', () => void this.act(th.resolved ? 'reopen' : 'resolve', th.id, () => this.client.resolve(th.id, !th.resolved)));
      actions.append(b);
    }
    section.append(actions);
    if (th.can.reply) {
      section.append(
        this.form(
          t(runtime, 'comments.reply'),
          t(runtime, 'comments.send'),
          async (body) => {
            this.drafts.delete(th.id);
            await this.act('reply', th.id, () => this.client.reply(th.id, body));
          },
          () => section.querySelector('textarea')?.blur(),
          '',
          th.id,
        ),
      );
    }
    return section;
  }

  private comment(th: Thread, c: ThreadComment): HTMLLIElement {
    const { runtime } = this.deps;
    const li = el('li', 'nowo-milkdown-comments__comment');
    if (c.deleted) {
      li.append(el('p', 'nowo-milkdown-comments__deleted', t(runtime, 'comments.deleted')));
      return li;
    }
    const meta = el('p', 'nowo-milkdown-comments__meta');
    meta.append(avatarElement(c.author.name, c.author.color, c.author.avatarUrl));
    meta.append(el('strong', 'nowo-milkdown-comments__author', c.author.name));
    if (c.createdAt) {
      const time = el('time', 'nowo-milkdown-comments__time', formatDate(c.createdAt));
      time.dateTime = c.createdAt;
      meta.append(' ', time);
    }
    if (c.editedAt) meta.append(' ', el('span', 'nowo-milkdown-comments__edited', t(runtime, 'comments.edited')));
    const body = el('div', 'nowo-milkdown-comments__body nowo-md');
    body.append(sanitizeBody(c.html));
    li.append(meta, body);
    if (th.can.react || c.reactions.length) {
      const bar = el('div', 'nowo-milkdown-comments__reactions');
      const shown = new Map(c.reactions.map((r) => [r.emoji, r]));
      const choices = th.can.react ? [...new Set([...c.reactions.map((r) => r.emoji), ...REACTIONS])] : [...shown.keys()];
      for (const emojiValue of choices) {
        const r = shown.get(emojiValue);
        const b = el('button', 'nowo-milkdown-comments__reaction', r ? `${emojiValue} ${r.count}` : emojiValue);
        b.type = 'button';
        b.setAttribute('aria-pressed', String(r?.mine === true));
        b.setAttribute('aria-label', t(runtime, 'comments.react', { emoji: emojiValue, count: r?.count ?? 0 }));
        b.disabled = !th.can.react;
        b.addEventListener('click', () => void this.act('react', th.id, () => this.client.react(c.id, emojiValue, r?.mine !== true)));
        bar.append(b);
      }
      li.append(bar);
    }
    const own = el('div', 'nowo-milkdown-comments__own');
    if (c.can.edit) {
      const b = el('button', 'nowo-milkdown__action', t(runtime, 'comments.edit'));
      b.type = 'button';
      b.addEventListener('click', () => {
        const form = this.form(t(runtime, 'comments.edit'), t(runtime, 'comments.save'), (text) => this.act('edit', th.id, () => this.client.edit(c.id, text)), () => this.render());
        body.replaceWith(form);
        form.querySelector('textarea')!.focus();
      });
      own.append(b);
    }
    if (c.can.delete) {
      const b = el('button', 'nowo-milkdown__action', t(runtime, 'comments.delete'));
      b.type = 'button';
      b.addEventListener('click', () => void this.act('delete', th.id, () => this.client.remove(c.id)));
      own.append(b);
    }
    if (own.childElementCount) li.append(own);
    return li;
  }
}

/** Local date and time of an ISO string (the `<time datetime>` keeps the exact value). */
export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  try {
    return new Intl.DateTimeFormat(document.documentElement.lang || undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(d);
  } catch {
    return d.toISOString();
  }
}

/**
 * Mounts the component and loads the threads.
 *
 * @param deps - Root, surface, options and the comments API
 * @returns The component
 */
export function mountThreadPanel(deps: ThreadUiDeps): ThreadPanel {
  const panel = new ThreadPanel(deps);
  void panel.load();
  return panel;
}
