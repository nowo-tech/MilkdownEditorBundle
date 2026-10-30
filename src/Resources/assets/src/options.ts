/**
 * Reads and validates the widget options (`data-nowo-milkdown-options`, JSON written by the form type).
 */
import { isIconName } from './dialect/patterns';
import { FEATURES, type CollaborationOptions, type EditorOptions, type Feature, type Theme, type Trigger } from './types';

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
  return FEATURES.filter((f) => set.has(f));
}

function collaboration(value: unknown): CollaborationOptions | null {
  const v = obj(value);
  const url = strOrNull(v.url);
  const hubUrl = strOrNull(v.hubUrl);
  const topic = strOrNull(v.topic);
  if (!url || !hubUrl || !topic) return null;
  const user = obj(v.user);
  return { url, hubUrl, topic, user: { name: str(user.name, 'Anonymous'), color: /^#[0-9a-f]{6}$/i.test(str(user.color)) ? str(user.color) : '#1f6f54' } };
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
  const messages: Record<string, string> = {};
  for (const [key, value] of Object.entries(obj(data.messages))) if (typeof value === 'string') messages[key] = value;
  return {
    features: normaliseFeatures(data.features),
    theme: (['light', 'dark', 'auto'].includes(theme) ? theme : 'auto') as Theme,
    placeholder: str(data.placeholder),
    label: str(data.label),
    minHeight: /^\d+(\.\d+)?(px|rem|em|vh)$/.test(str(data.minHeight)) ? str(data.minHeight) : '12rem',
    readonly: data.readonly === true,
    suggestions,
    linkTitleUrl: strOrNull(data.linkTitleUrl),
    iconSpriteUrl: strOrNull(data.iconSpriteUrl),
    icons: Array.isArray(data.icons) ? data.icons.filter((n): n is string => typeof n === 'string' && isIconName(n)) : [],
    upload: strOrNull(upload.url)
      ? {
          url: str(upload.url),
          csrfToken: strOrNull(upload.csrfToken),
          maxSize: typeof upload.maxSize === 'number' && upload.maxSize > 0 ? upload.maxSize : 0,
          accept: Array.isArray(upload.accept) ? upload.accept.filter((a): a is string => typeof a === 'string') : [],
        }
      : null,
    collaboration: collaboration(data.collaboration),
    nonce: str(data.nonce),
    messages,
  };
}
