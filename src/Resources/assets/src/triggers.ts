/**
 * The suggestion triggers of one editor: `[[` pages, `@` people, `:` icons and emoji (remote candidate URLs
 * from the form options) and `/` blocks (local commands, FR-085).
 */
import type { Ctx } from '@milkdown/kit/ctx';
import { commandsCtx } from '@milkdown/kit/core';
import { insertTableCommand } from '@milkdown/kit/preset/gfm';
import { setBlockType, wrapIn } from '@milkdown/kit/prose/commands';
import { wrapInList } from '@milkdown/kit/prose/schema-list';
import type { Attrs, NodeType } from '@milkdown/kit/prose/model';
import type { EditorView } from '@milkdown/kit/prose/view';
import { EMOJI } from './emoji';
import { encodeAttributes } from './dialect/directives';
import { isHandle, isIconName, isUuid } from './dialect/patterns';
import { safeUrl } from './link-titles';
import { t, type PageInfo, type Runtime } from './runtime';
import type { Range, SuggestItem, SuggestTrigger } from './plugins/suggest';
import type { Candidate, EditorOptions } from './types';

export type FetchJson = (url: string, signal: AbortSignal) => Promise<unknown>;

export const fetchJson: FetchJson = async (url, signal) => {
  const res = await fetch(url, { signal, credentials: 'same-origin', headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error(`${res.status}`);
  return res.json();
};

const withQuery = (url: string, q: string): string => `${url}${url.includes('?') ? '&' : '?'}q=${encodeURIComponent(q)}`;

/** Remote candidates: a JSON array of {@link Candidate}, invalid rows dropped, at most 10 kept. */
export async function candidates(fetcher: FetchJson, url: string, q: string, signal: AbortSignal): Promise<Candidate[]> {
  const data = await fetcher(withQuery(url, q), signal);
  if (!Array.isArray(data)) return [];
  return data
    .filter((c): c is Candidate => !!c && typeof c === 'object' && typeof c.id === 'string' && typeof c.label === 'string')
    .slice(0, 10);
}

function insertNode(view: EditorView, range: Range, type: NodeType | undefined, attrs: Attrs): void {
  if (!type) return;
  view.dispatch(view.state.tr.replaceWith(range.from, range.to, type.create(attrs)).insertText(' ').scrollIntoView());
}

const isEmoji = (value: string): boolean => value !== '' && !/^[\x20-\x7e]*$/.test(value) && [...value].length <= 8;

type Deps = { options: EditorOptions; runtime: Runtime; remember: (info: PageInfo) => void; fetcher?: FetchJson };

export function buildTriggers(ctx: Ctx, deps: Deps): SuggestTrigger[] {
  const { options, runtime, remember } = deps;
  const fetcher = deps.fetcher ?? fetchJson;
  const triggers: SuggestTrigger[] = [];
  const pageUrl = options.suggestions['[['];
  const mentionUrl = options.suggestions['@'];
  const iconUrl = options.suggestions[':'];

  if (pageUrl) {
    triggers.push({
      name: 'page',
      match: /\[\[([^\]\n]{0,60})$/,
      source: async (q, signal) =>
        (await candidates(fetcher, pageUrl, q, signal))
          .filter((c) => isUuid(c.id))
          .map((c) => {
            remember({ id: c.id, title: c.label, url: safeUrl(c.url), visible: true });
            return { id: c.id, label: c.label, hint: c.hint, icon: 'file-text' };
          }),
      apply: (view, range, item) => insertNode(view, range, view.state.schema.nodes.wikiRef, { pageId: item.id, anchor: '' }),
    });
  }

  if (mentionUrl) {
    triggers.push({
      name: 'mention',
      match: /(?:^|[\s(])@([\w.-]{0,30})$/,
      lead: (m) => (m[0].startsWith('@') ? 0 : 1),
      source: async (q, signal) =>
        (await candidates(fetcher, mentionUrl, q, signal))
          .filter((c) => isHandle(c.id))
          .map((c) => ({ id: c.id, label: c.label, hint: c.hint ?? `@${c.id}` })),
      apply: (view, range, item) => insertNode(view, range, view.state.schema.nodes.mention, { handle: item.id }),
    });
  }

  if (iconUrl || options.icons.length > 0) {
    triggers.push({
      name: 'icon',
      match: /(?:^|[\s(]):([a-z0-9_+-]{0,30})$/,
      lead: (m) => (m[0].startsWith(':') ? 0 : 1),
      source: async (q, signal) => {
        const query = q.toLowerCase();
        if (iconUrl) {
          return (await candidates(fetcher, iconUrl, q, signal))
            .map((c): SuggestItem | null => {
              if (c.id.startsWith('tabler-') && runtime.icons.has(c.id.slice(7))) return { id: c.id, label: c.label, hint: c.hint, icon: c.id.slice(7) };
              if (isEmoji(c.id)) return { id: c.id, label: c.label, hint: c.hint, emoji: c.id };
              return null;
            })
            .filter((c): c is SuggestItem => c !== null);
        }
        const emoji = EMOJI.filter(([name]) => name.includes(query))
          .slice(0, 4)
          .map(([name, ch]) => ({ id: ch, label: name, emoji: ch }));
        const icons = options.icons
          .filter((name) => name.includes(query))
          .slice(0, 10 - emoji.length)
          .map((name) => ({ id: `tabler-${name}`, label: name, icon: name }));
        return [...icons, ...emoji];
      },
      apply: (view, range, item) => {
        if (item.id.startsWith('tabler-') && isIconName(item.id.slice(7))) {
          insertNode(view, range, view.state.schema.nodes.tablerIcon, { name: item.id.slice(7) });
        } else {
          view.dispatch(view.state.tr.insertText(item.id, range.from, range.to).scrollIntoView());
        }
      },
    });
  }

  if (options.features.includes('slash_menu')) {
    const blocks = slashItems(ctx, options, runtime);
    triggers.push({
      name: 'slash',
      match: /^\/([\w-]{0,20})$/,
      source: async (q) => {
        const query = q.toLowerCase();
        return blocks.filter((b) => b.item.id.includes(query) || b.item.label.toLowerCase().includes(query)).map((b) => b.item);
      },
      apply: (view, range, item) => {
        view.dispatch(view.state.tr.delete(range.from, range.to));
        blocks.find((b) => b.item.id === item.id)?.run(view);
      },
    });
  }
  return triggers;
}

type Block = { item: SuggestItem; run: (view: EditorView) => void };

/** The `/` menu: block types (headings, lists, table, code, callout, Mermaid, math…) and the other triggers. */
export function slashItems(ctx: Ctx, options: EditorOptions, runtime: Runtime): Block[] {
  const nodes = (view: EditorView) => view.state.schema.nodes;
  const run = (cmd: (view: EditorView) => boolean) => (view: EditorView) => {
    cmd(view);
  };
  const block = (id: string, fn: (view: EditorView) => void): Block => ({ item: { id, label: t(runtime, `slash.${id}`) }, run: fn });
  const type = (name: string, attrs?: Attrs) => run((view) => setBlockType(nodes(view)[name]!, attrs)(view.state, view.dispatch));
  const text = (value: string) => (view: EditorView) => view.dispatch(view.state.tr.insertText(value));
  const container = (name: string, attributes: Record<string, string>) =>
    run((view) => wrapIn(nodes(view).containerDirective!, { name, label: '', attributes: encodeAttributes(attributes) })(view.state, view.dispatch));

  const out: Block[] = [
    block('text', type('paragraph')),
    block('h1', type('heading', { level: 1 })),
    block('h2', type('heading', { level: 2 })),
    block('h3', type('heading', { level: 3 })),
    block('bullet_list', run((view) => wrapInList(nodes(view).bullet_list!)(view.state, view.dispatch))),
    block('ordered_list', run((view) => wrapInList(nodes(view).ordered_list!)(view.state, view.dispatch))),
    block('task_list', (view) => {
      if (!wrapInList(nodes(view).bullet_list!)(view.state, view.dispatch)) return;
      const { $from } = view.state.selection;
      for (let d = $from.depth; d > 0; d--) {
        const node = $from.node(d);
        if (node.type.name === 'list_item') {
          view.dispatch(view.state.tr.setNodeMarkup($from.before(d), undefined, { ...node.attrs, checked: false }));
          return;
        }
      }
    }),
    block('quote', run((view) => wrapIn(nodes(view).blockquote!)(view.state, view.dispatch))),
    block('code', type('code_block', { language: '' })),
    block('table', () => ctx.get(commandsCtx).call(insertTableCommand.key, { row: 3, col: 3 })),
    block('divider', (view) => view.dispatch(view.state.tr.replaceSelectionWith(nodes(view).hr!.create()).scrollIntoView())),
    block('callout', container('callout', { type: 'info' })),
    block('details', container('details', { summary: t(runtime, 'directive.summary') })),
  ];
  if (options.features.includes('mermaid')) out.push(block('mermaid', type('code_block', { language: 'mermaid' })));
  if (options.features.includes('math')) out.push(block('math', type('code_block', { language: 'LaTeX' })));
  if (options.suggestions['[[']) out.push(block('page_link', text('[[')));
  if (options.suggestions['@']) out.push(block('mention', text('@')));
  if (options.suggestions[':'] || options.icons.length > 0) out.push(block('icon', text(':')));
  return out;
}
