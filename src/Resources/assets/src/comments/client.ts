/**
 * Host endpoints of the comment thread component (1.6, contract section 6.1) and validation of their answers.
 * Requests go only to `comments.url` (same origin, checked by `parseOptions()`), with the CSRF header on writes.
 */
import { safeUrl } from '../link-titles';
import { ID_PATTERN, type CommentAnchor } from './anchor';
import { ISO_DATE, parseThread, parseThreads, type ThreadRef } from './plugin';

export type Reaction = { emoji: string; count: number; mine: boolean };
export type ThreadComment = {
  id: string;
  author: { name: string; avatarUrl: string | null; color: string | null };
  html: string;
  createdAt: string;
  editedAt: string | null;
  reactions: Reaction[];
  can: { edit: boolean; delete: boolean };
  deleted: boolean;
};
export type Thread = ThreadRef & {
  comments: ThreadComment[];
  can: { reply: boolean; resolve: boolean; react: boolean };
  resolvedBy: { name: string } | null;
  resolvedAt: string | null;
};
export type ThreadList = { threads: Map<string, ThreadRef>; page: Map<string, ThreadRef>; truncated: boolean };
export type Result<T> = { ok: true; value: T } | { ok: false; status: number };

export const MAX_COMMENTS = 500;
export const MAX_HTML = 200_000;
export const MAX_REACTIONS = 20;
/** Upper bound of a comment body sent to the host (the host enforces its own limit too). */
export const MAX_BODY = 10_000;

const rec = (v: unknown): Record<string, unknown> => (v && typeof v === 'object' && !Array.isArray(v) ? (v as Record<string, unknown>) : {});
const name = (v: unknown): string => (typeof v === 'string' && v.trim() !== '' ? v.slice(0, 80) : '?');
const date = (v: unknown): string | null => (typeof v === 'string' && ISO_DATE.test(v) ? v : null);
const flag = (v: unknown): boolean => v === true;
const emoji = (v: unknown): v is string => typeof v === 'string' && v.length > 0 && v.length <= 16 && !/[\s<>&"'`]/.test(v) && !/^[\x20-\x7e]+$/.test(v);

/**
 * Validates one comment of a thread answer.
 *
 * @param value - Untrusted value
 * @returns The comment, or null
 */
export function parseComment(value: unknown): ThreadComment | null {
  const c = rec(value);
  if (typeof c.id !== 'string' || !ID_PATTERN.test(c.id)) return null;
  const author = rec(c.author);
  const deleted = flag(c.deleted);
  const can = rec(c.can);
  const reactions = Array.isArray(c.reactions)
    ? c.reactions.slice(0, MAX_REACTIONS).flatMap((r): Reaction[] => {
        const x = rec(r);
        return emoji(x.emoji) && typeof x.count === 'number' && Number.isInteger(x.count) && x.count > 0 ? [{ emoji: x.emoji, count: Math.min(x.count, 1_000_000), mine: flag(x.mine) }] : [];
      })
    : [];
  return {
    id: c.id,
    author: {
      name: name(author.name),
      avatarUrl: typeof author.avatarUrl === 'string' && safeUrl(author.avatarUrl) !== '' ? safeUrl(author.avatarUrl) : null,
      color: typeof author.color === 'string' && /^#[0-9a-f]{6}$/i.test(author.color) ? author.color : null,
    },
    html: !deleted && typeof c.html === 'string' ? c.html.slice(0, MAX_HTML) : '',
    createdAt: date(c.createdAt) ?? '',
    editedAt: date(c.editedAt),
    reactions: deleted ? [] : reactions,
    can: deleted ? { edit: false, delete: false } : { edit: flag(can.edit), delete: flag(can.delete) },
    deleted,
  };
}

/**
 * Validates a thread answer (`GET /threads/{id}` and every write).
 *
 * @param value - Untrusted value
 * @returns The thread, or null
 */
export function parseThreadDetail(value: unknown): Thread | null {
  const base = parseThread(value);
  if (!base) return null;
  const t = rec(value);
  const can = rec(t.can);
  const resolvedBy = rec(t.resolvedBy);
  const comments = Array.isArray(t.comments) ? t.comments.slice(0, MAX_COMMENTS).flatMap((c) => parseComment(c) ?? []) : [];
  return {
    ...base,
    count: base.count || comments.filter((c) => !c.deleted).length,
    comments,
    can: { reply: flag(can.reply), resolve: flag(can.resolve), react: flag(can.react) },
    resolvedBy: typeof resolvedBy.name === 'string' ? { name: name(resolvedBy.name) } : null,
    resolvedAt: date(t.resolvedAt),
  };
}

/** Client of the host endpoints. */
export class CommentsClient {
  constructor(
    private readonly base: string,
    private readonly csrfToken: string | null,
    private readonly fetcher: typeof fetch = (...args) => fetch(...args),
  ) {}

  private async request(method: string, path: string, body?: unknown): Promise<Result<unknown>> {
    const headers: Record<string, string> = { Accept: 'application/json' };
    if (method !== 'GET') {
      headers['Content-Type'] = 'application/json';
      if (this.csrfToken) headers['X-CSRF-Token'] = this.csrfToken;
    }
    try {
      const response = await this.fetcher(this.base.replace(/\/+$/, '') + path, {
        method,
        headers,
        credentials: 'same-origin',
        redirect: 'error',
        ...(body === undefined ? {} : { body: JSON.stringify(body) }),
      });
      if (!response.ok) return { ok: false, status: response.status };
      return { ok: true, value: response.status === 204 ? null : ((await response.json()) as unknown) };
    } catch {
      return { ok: false, status: 0 };
    }
  }

  private async thread(method: string, path: string, body?: unknown): Promise<Result<Thread | null>> {
    const r = await this.request(method, path, body);
    if (!r.ok) return r;
    if (r.value === null) return { ok: true, value: null };
    const thread = parseThreadDetail(r.value);
    return thread ? { ok: true, value: thread } : { ok: false, status: 0 };
  }

  async list(): Promise<Result<ThreadList>> {
    const r = await this.request('GET', '/threads');
    if (!r.ok) return r;
    const v = rec(r.value);
    return { ok: true, value: { threads: parseThreads(v.threads), page: parseThreads(v.page), truncated: flag(v.truncated) } };
  }

  get = (id: string) => this.thread('GET', `/threads/${encodeURIComponent(id)}`);
  create = (anchor: CommentAnchor | null, body: string) => this.thread('POST', '/threads', { anchor, body: body.slice(0, MAX_BODY) });
  reply = (id: string, body: string) => this.thread('POST', `/threads/${encodeURIComponent(id)}/comments`, { body: body.slice(0, MAX_BODY) });
  resolve = (id: string, resolved: boolean) => this.thread('PATCH', `/threads/${encodeURIComponent(id)}`, { resolved });
  anchor = (id: string, anchor: CommentAnchor, base: string | null) => this.thread('PATCH', `/threads/${encodeURIComponent(id)}`, { anchor, base });
  edit = (cid: string, body: string) => this.thread('PATCH', `/comments/${encodeURIComponent(cid)}`, { body: body.slice(0, MAX_BODY) });
  remove = (cid: string) => this.thread('DELETE', `/comments/${encodeURIComponent(cid)}`);
  react = (cid: string, value: string, on: boolean) => this.thread(on ? 'PUT' : 'DELETE', `/comments/${encodeURIComponent(cid)}/reactions/${encodeURIComponent(value)}`);
}
