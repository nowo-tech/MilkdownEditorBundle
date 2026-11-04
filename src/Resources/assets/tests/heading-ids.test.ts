import { afterEach, describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { editorViewCtx } from '@milkdown/kit/core';
import { editor } from './helpers';
import type { MilkdownEditorHandle } from '../src/editor';
import { slug, slugs } from '../src/plugins/heading-ids';

const vectors = JSON.parse(readFileSync(resolve(__dirname, '../../../../tests/Fixtures/heading-slugs.json'), 'utf8')) as {
  slug: [string, string][];
  unique: { texts: string[]; slugs: string[] }[];
};

let handle: MilkdownEditorHandle | null = null;
afterEach(async () => {
  await handle?.destroy();
  handle = null;
});

describe('heading ids (1.6, shared vectors with PHP)', () => {
  it.each(vectors.slug)('slugs %j', (text, expected) => {
    expect(slug(text)).toBe(expected);
  });
  it.each(vectors.unique)('dedupes $texts', ({ texts, slugs: expected }) => {
    expect(slugs(texts)).toEqual(expected);
  });

  it('decorates headings with prefixed ids only when enabled, and follows edits', async () => {
    handle = await editor('# Intro\n\nText\n\n## Intro\n\n### Café *au* `lait`\n', { features: ['heading_ids'] });
    const dom = () => handle!.builder.editor.action((ctx) => ctx.get(editorViewCtx)).dom;
    expect([...dom().querySelectorAll('h1, h2, h3')].map((h) => h.id)).toEqual(['nowo-h-intro', 'nowo-h-intro-2', 'nowo-h-café-au-lait']);
    expect(handle.getMarkdown()).not.toContain('nowo-h-');
    handle.setMarkdown('# Other\n');
    expect(dom().querySelector('h1')!.id).toBe('nowo-h-other');
    await handle.destroy();
    handle = await editor('# Intro\n', { features: [] });
    // Off: Milkdown's own (unprefixed) heading id stays as before.
    expect(dom().querySelector('h1')!.id).not.toMatch(/^nowo-h-/);
  });
});
