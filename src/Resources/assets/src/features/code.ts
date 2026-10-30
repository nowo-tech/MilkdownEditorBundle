/**
 * CodeMirror code blocks (chunk): the page nonce for CodeMirror's injected styles (`EditorView.cspNonce`), a named
 * code editor, contrast-safe token colours, languages loaded on demand and the Mermaid preview.
 */
import { codeMirror } from '@milkdown/crepe/feature/code-mirror';
import type { CrepeBuilder } from '@milkdown/crepe/builder';
import { languages } from '@codemirror/language-data';
import { syntaxHighlighting } from '@codemirror/language';
import { EditorView } from '@codemirror/view';
import { highlightStyle } from '../preview/highlight';
import { renderMermaid } from '../preview/mermaid';
import { t, type Runtime } from '../runtime';

export function codeMirrorConfig(runtime: Runtime, mermaid: boolean) {
  return {
    extensions: [
      EditorView.cspNonce.of(runtime.nonce),
      EditorView.contentAttributes.of({ 'aria-label': t(runtime, 'code.content') }),
      syntaxHighlighting(highlightStyle),
    ],
    languages,
    searchPlaceholder: t(runtime, 'code.language'),
    copyText: t(runtime, 'code.copy'),
    noResultText: t(runtime, 'suggest.empty'),
    previewLabel: t(runtime, 'code.preview'),
    renderPreview: (language: string, content: string, apply: (value: null | string | HTMLElement) => void): void | null => {
      if (!mermaid || language.toLowerCase() !== 'mermaid' || content.trim() === '') return null;
      renderMermaid(content, runtime.nonce, runtime.dark(), t(runtime, 'slash.mermaid')).then(
        (svg) => {
          const figure = document.createElement('div');
          figure.className = 'nowo-md-mermaid';
          figure.append(svg);
          apply(figure);
        },
        (error: unknown) => {
        const message = document.createElement('p');
        message.className = 'nowo-milkdown-preview-error';
        message.textContent = error instanceof Error ? error.message : String(error);
        apply(message);
        },
      );
      return undefined;
    },
  };
}

export function addCodeMirror(builder: CrepeBuilder, runtime: Runtime, mermaid: boolean): void {
  builder.addFeature(codeMirror, codeMirrorConfig(runtime, mermaid));
}
