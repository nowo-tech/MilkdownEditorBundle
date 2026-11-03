/**
 * Public option types of the Milkdown editor widget.
 *
 * The Symfony form type renders these options as one JSON document in the widget's
 * `data-nowo-milkdown-options` attribute; {@link readOptions} validates it.
 */

/** Optional editor features (`MilkdownEditorType` option `features`). */
export type Feature =
  | 'toolbar'
  | 'top_bar'
  | 'link_tooltip'
  | 'table'
  | 'code_mirror'
  | 'math'
  | 'mermaid'
  | 'placeholder'
  | 'cursor'
  | 'slash_menu'
  | 'context_menu'
  | 'block_actions'
  | 'block_drag'
  | 'colors'
  | 'markdown_clipboard'
  | 'insert_menu';

export const FEATURES: readonly Feature[] = [
  'toolbar',
  'top_bar',
  'link_tooltip',
  'table',
  'code_mirror',
  'math',
  'mermaid',
  'placeholder',
  'cursor',
  'slash_menu',
  'context_menu',
  'block_actions',
  'block_drag',
  'colors',
  'markdown_clipboard',
  'insert_menu',
];

/** Suggestion triggers of the FR-075 dialect: `@` mentions, `[[` page links, `:` icons and emoji. */
export type Trigger = '@' | '[[' | ':';

/** One candidate returned by a suggestion URL (`GET <url>?q=<query>`, JSON array, at most 10 used). */
export type Candidate = {
  /** Page UUID (`[[`), user handle (`@`) or icon name (`:`, `tabler-<name>` or an emoji character). */
  id: string;
  /** Visible label (page title, user name, icon name). */
  label: string;
  /** Secondary text (space, e-mail, category). */
  hint?: string;
  /** Page URL, used for the chip link before the title resolver answers. */
  url?: string;
};

/** Collaboration options (FR-076): Yjs over Mercure; the host checks edit rights before it renders them. */
export type CollaborationOptions = {
  /** Base URL of the host's collaboration endpoints (`/token`, `/state`, `/update`, `/awareness`). */
  url: string;
  /** Mercure hub URL (same origin, subscriber JWT in the `mercureAuthorization` cookie). */
  hubUrl: string;
  /** Private Mercure topic of the document. */
  topic: string;
  /** Name and colour shown with this user's cursor. */
  user: { name: string; color: string };
  /** 1.5.1: coalescing window of document updates (ms, default 200) and presence throttle (ms, default 750). */
  updateDelay?: number;
  awarenessDelay?: number;
  /** 1.5.1 (DS-I1): largest merged update per POST, raw Yjs bytes (default 256 KiB, the host's limit). */
  maxUpdateBytes?: number;
};

export type Theme = 'light' | 'dark' | 'auto';

/** Translated UI strings; every key has an English default in {@link DEFAULT_MESSAGES}. */
export type Messages = Record<string, string>;

export type EditorOptions = {
  features: Feature[];
  theme: Theme;
  placeholder: string;
  /** Accessible name of the editable (the form label). */
  label: string;
  minHeight: string;
  readonly: boolean;
  suggestions: Partial<Record<Trigger, string>>;
  linkTitleUrl: string | null;
  iconSpriteUrl: string | null;
  icons: string[];
  upload: { url: string; csrfToken: string | null; maxSize: number; accept: string[] } | null;
  collaboration: CollaborationOptions | null;
  /** Colours the editor offers (`markdown.mark_colors`, 1.4); empty: the whole palette. */
  colors: string[];
  /** Mention chips show `@handle` (default) or the person's name (1.2.1). */
  mentionDisplay: 'handle' | 'name';
  /** `GET url?handles=a,b` → `[{handle, name}]` for `mentionDisplay: 'name'` (1.2.1). */
  userTitleUrl: string | null;
  nonce: string;
  messages: Messages;
};
