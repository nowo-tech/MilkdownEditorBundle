/**
 * Reads and validates the widget options (`data-nowo-milkdown-options`, JSON written by the form type).
 */
import { isIconName } from './dialect/patterns';
import { FEATURES, type CollaborationOptions, type CommentsOptions, type EditorOptions, type Feature, type Theme, type Trigger } from './types';

export const DEFAULT_FEATURES: Feature[] = ['toolbar', 'link_tooltip', 'table', 'code_mirror', 'placeholder', 'cursor', 'slash_menu'];

const str = (v: unknown, fallback = ''): string => (typeof v === 'string' ? v : fallback);
const strOrNull = (v: unknown): string | null => (typeof v === 'string' && v !== '' ? v : null);
const obj = (v: unknown): Record<string, unknown> => (v && typeof v === 'object' && !Array.isArray(v) ? (v as Record<string, unknown>) : {});

/**
 * Known features in canonical order; Math and Mermaid are dropped without CodeMirror.
 *
 * @param value - Feature names from the JSON
 * @returns The enabled features
 */
export function normaliseFeatures(value: unknown): Feature[] {
  const list = Array.isArray(value) ? value.filter((f): f is Feature => (FEATURES as readonly unknown[]).includes(f)) : DEFAULT_FEATURES;
  const set = new Set(list);
  // Math and Mermaid render in the code block preview: they need CodeMirror.
  if (!set.has('code_mirror')) {
    set.delete('math');
    set.delete('mermaid');
  }
  // An old version never carries comments (1.6).
  if (set.has('version_view')) set.delete('comments');
  // Dragging uses the block handle (1.4).
  if (!set.has('block_actions')) set.delete('block_drag');
  // The Insert group lives in the context menu (1.5).
  if (!set.has('context_menu')) set.delete('insert_menu');
  return FEATURES.filter((f) => set.has(f));
}

function collaboration(value: unknown): CollaborationOptions | null {
  const v = obj(value);
  const url = strOrNull(v.url);
  const hubUrl = strOrNull(v.hubUrl);
  const topic = strOrNull(v.topic);
  if (!url || !hubUrl || !topic) return null;
  const user = obj(v.user);
  const out: CollaborationOptions = { url, hubUrl, topic, user: { name: str(user.name, 'Anonymous'), color: /^#[0-9a-f]{6}$/i.test(str(user.color)) ? str(user.color) : '#1f6f54' } };
  // 1.5.1: send windows (the provider clamps them).
  if (typeof v.updateDelay === 'number') out.updateDelay = v.updateDelay;
  if (typeof v.awarenessDelay === 'number') out.awarenessDelay = v.awarenessDelay;
  if (typeof v.maxUpdateBytes === 'number') out.maxUpdateBytes = v.maxUpdateBytes;
  return out;
}

/**
 * Whether a URL is relative or on this page's origin (the comment endpoints, contract section 9).
 *
 * @param value - The URL
 * @returns True for same-origin URLs
 */
export function sameOrigin(value: string): boolean {
  if (value.startsWith('//') || value.startsWith('\\')) return false;
  try {
    const url = new URL(value, window.location.href);
    return url.origin === window.location.origin && (url.protocol === 'http:' || url.protocol === 'https:');
  } catch {
    return false;
  }
}

/**
 * The `comments` options (1.6): only with the feature; a foreign or invalid URL means hooks only.
 *
 * @param value - The JSON value
 * @param on - Whether the feature is enabled
 * @returns The options, or null
 */
export function commentsOptions(value: unknown, on: boolean): CommentsOptions | null {
  if (!on) return null;
  const v = obj(value);
  const raw = strOrNull(v.url);
  const url = raw !== null && sameOrigin(raw) ? raw : null;
  const panel = url !== null && (v.panel === 'margin' || v.panel === 'sidebar' || v.panel === 'container') ? v.panel : 'none';
  const topic = strOrNull(v.topic);
  const container = panel === 'container' ? strOrNull(v.container) : null;
  return {
    url,
    csrfToken: strOrNull(v.csrfToken),
    canCreate: v.canCreate !== false,
    panel,
    container: container !== null && container.length <= 200 ? container : null,
    topic: url !== null ? topic : null,
  };
}

/**
 * Parses and validates the widget JSON; invalid values fall back to safe defaults.
 *
 * @param raw - The `data-nowo-milkdown-options` attribute
 * @returns Complete editor options
 */
export function parseOptions(raw: string | undefined | null): EditorOptions {
  let data: Record<string, unknown>;
  try {
    data = obj(JSON.parse(raw ?? '{}'));
  } catch {
    data = {};
  }
  const suggestions: Partial<Record<Trigger, string>> = {};
  for (const [trigger, url] of Object.entries(obj(data.suggestions))) {
    if ((trigger === '@' || trigger === '[[' || trigger === ':') && typeof url === 'string' && url !== '') suggestions[trigger] = url;
  }
  const upload = obj(data.upload);
  const theme = str(data.theme, 'auto');
  const features = normaliseFeatures(data.features);
  const versionOn = features.includes('version_view');
  const version = obj(data.version);
  const messages: Record<string, string> = {};
  for (const [key, value] of Object.entries(obj(data.messages))) if (typeof value === 'string') messages[key] = value;
  return {
    features,
    theme: (['light', 'dark', 'auto'].includes(theme) ? theme : 'auto') as Theme,
    placeholder: str(data.placeholder),
    label: str(data.label),
    minHeight: /^\d+(\.\d+)?(px|rem|em|vh)$/.test(str(data.minHeight)) ? str(data.minHeight) : '12rem',
    readonly: data.readonly === true || versionOn,
    suggestions,
    linkTitleUrl: strOrNull(data.linkTitleUrl),
    iconSpriteUrl: strOrNull(data.iconSpriteUrl),
    icons: Array.isArray(data.icons) ? data.icons.filter((n): n is string => typeof n === 'string' && isIconName(n)) : [],
    upload: !versionOn && strOrNull(upload.url)
      ? {
          url: str(upload.url),
          csrfToken: strOrNull(upload.csrfToken),
          maxSize: typeof upload.maxSize === 'number' && upload.maxSize > 0 ? upload.maxSize : 0,
          accept: Array.isArray(upload.accept) ? upload.accept.filter((a): a is string => typeof a === 'string') : [],
        }
      : null,
    collaboration: versionOn ? null : collaboration(data.collaboration),
    colors: Array.isArray(data.colors) ? data.colors.filter((c): c is string => typeof c === 'string') : [],
    mentionDisplay: data.mentionDisplay === 'name' ? 'name' : 'handle',
    userTitleUrl: strOrNull(data.userTitleUrl),
    comments: commentsOptions(data.comments, features.includes('comments')),
    version: versionOn ? { label: str(version.label).slice(0, 200), restore: version.restore !== false, copy: version.copy !== false } : null,
    nonce: str(data.nonce) || pageNonce(),
    messages,
  };
}

/**
 * The page's CSP nonce, read from the editor module's `<script nonce>` (or any nonce'd script) through the `nonce`
 * property: browsers hide the attribute value, so the nonce is never copied into a readable `data-*` attribute.
 *
 * @param doc - The document holding the scripts
 * @returns The nonce, or '' when no script carries one
 */
export function pageNonce(doc: Document = document): string {
  const scripts = [...doc.querySelectorAll<HTMLScriptElement>('script[nonce]')];
  const own = scripts.find((s) => s.src.includes('milkdown-editor')) ?? scripts[0];
  return own ? own.nonce || own.getAttribute('nonce') || '' : '';
}
