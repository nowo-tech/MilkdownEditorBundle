/**
 * Reads and validates the widget options (`data-nowo-milkdown-options`, JSON written by the form type).
 */
import { isIconName } from './dialect/patterns';
import { parseHostSchemes } from './host';
import { FEATURES, type ActionBarInsert, type CollaborationOptions, type CommentsOptions, type EditorOptions, type Feature, type Theme, type Trigger, type UploadOptions } from './types';

export const DEFAULT_FEATURES: Feature[] = ['toolbar', 'link_tooltip', 'table', 'code_mirror', 'placeholder', 'cursor', 'slash_menu'];

const str = (v: unknown, fallback = ''): string => (typeof v === 'string' ? v : fallback);
const strOrNull = (v: unknown): string | null => (typeof v === 'string' && v !== '' ? v : null);
const strings = (v: unknown): string[] => (Array.isArray(v) ? v.filter((a): a is string => typeof a === 'string') : []);
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
  // 1.10: startCollaboration clamps it.
  if (typeof v.connectTimeout === 'number') out.connectTimeout = v.connectTimeout;
  return out;
}

/** Preview frame `sandbox` tokens (1.9): known tokens only, never `allow-scripts` with `allow-same-origin`. */
export function previewSandbox(value: unknown): string {
  const known = ['allow-scripts', 'allow-same-origin', 'allow-popups', 'allow-popups-to-escape-sandbox', 'allow-downloads'];
  let tokens = [...new Set(String(typeof value === 'string' ? value : '').toLowerCase().split(' '))].filter((t) => known.includes(t));
  // Scripts never get the frame's way out: the same origin, or popups without the sandbox (audit GX-I1).
  if (tokens.includes('allow-scripts')) tokens = tokens.filter((t) => t !== 'allow-same-origin' && t !== 'allow-popups-to-escape-sandbox');
  return tokens.join(' ');
}

/** The action-bar buttons (1.8): both by default, an array keeps the known ones in canonical order. */
export function actionBarInsert(value: unknown): ActionBarInsert[] {
  const all: ActionBarInsert[] = ['file', 'icon'];
  return Array.isArray(value) ? all.filter((b) => value.includes(b)) : all;
}

/** The `upload` options, or null without a URL; 1.8: the per-kind lists only when sent. */
export function uploadOptions(value: unknown): UploadOptions | null {
  const upload = obj(value);
  const url = strOrNull(upload.url);
  if (!url) return null;
  const out: UploadOptions = {
    url,
    csrfToken: strOrNull(upload.csrfToken),
    maxSize: typeof upload.maxSize === 'number' && upload.maxSize > 0 ? upload.maxSize : 0,
    accept: strings(upload.accept),
  };
  if (Array.isArray(upload.acceptImages)) out.acceptImages = strings(upload.acceptImages);
  if (Array.isArray(upload.acceptFiles)) out.acceptFiles = strings(upload.acceptFiles);
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
    // 1.7: sent only when not the default.
    iconCatalog: data.iconCatalog === true,
    toolbarIcons: data.toolbarIcons !== false,
    menuIcons: data.menuIcons !== false,
    upload: versionOn ? null : uploadOptions(data.upload),
    actionBarInsert: actionBarInsert(data.actionBarInsert),
    // Never from this JSON (audit GX-L2): see pageHostConfig().
    hostSchemes: {},
    previewSandbox: '',
    maxPreviews: DEFAULT_MAX_PREVIEWS,
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
  const scripts = [...doc.querySelectorAll<HTMLScriptElement>('script[nonce]:not([data-nowo-milkdown-config])')];
  const own = scripts.find((s) => s.src.includes('milkdown-editor')) ?? scripts[0];
  return own ? own.nonce || own.getAttribute('nonce') || '' : '';
}

/** Previews of one editor when the page does not say (the renderer's default `max_references`). */
export const DEFAULT_MAX_PREVIEWS = 500;

/**
 * Host references and the preview sandbox of auto-mounted editors (audit GX-L2): only from the page's
 * `<script type="application/json" data-nowo-milkdown-config>` written by `nowo_milkdown_editor_assets()`, never from the
 * `data-nowo-milkdown-options` of a widget, which an HTML sanitizer may let through. On a page with a CSP nonce the element
 * must carry that nonce. Hosts mounting from their own code pass these options to `createEditor()`.
 *
 * @param doc - The document
 */
export function pageHostConfig(doc: Document = document): Pick<EditorOptions, 'hostSchemes' | 'hostUrlPatterns' | 'previewSandbox' | 'maxPreviews'> {
  const nonce = pageNonce(doc);
  for (const element of doc.querySelectorAll<HTMLScriptElement>('script[type="application/json"][data-nowo-milkdown-config]')) {
    if ((element.nonce || element.getAttribute('nonce') || '') !== nonce) continue;
    try {
      const data = JSON.parse(element.textContent ?? '') as Record<string, unknown>;
      const max = data.maxPreviews;
      return {
        hostSchemes: parseHostSchemes(data.hostSchemes),
        // 1.13: validated against the schemes when the editor is created (withUrlPatterns()).
        hostUrlPatterns: Array.isArray(data.hostUrlPatterns) ? data.hostUrlPatterns : [],
        previewSandbox: previewSandbox(data.previewSandbox),
        maxPreviews: typeof max === 'number' && Number.isInteger(max) && max > 0 ? max : DEFAULT_MAX_PREVIEWS,
      };
    } catch {
      // Not JSON: not ours.
    }
  }
  return { hostSchemes: {}, hostUrlPatterns: [], previewSandbox: '', maxPreviews: DEFAULT_MAX_PREVIEWS };
}
