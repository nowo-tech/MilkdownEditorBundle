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
  | 'slash_menu';

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
  nonce: string;
  messages: Messages;
};
