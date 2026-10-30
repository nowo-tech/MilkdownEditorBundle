/**
 * Code token colours from `--nowo-milkdown-code-*` tokens (light and dark pass WCAG AA on the code background);
 * CodeMirror's default palette fails contrast in dark mode.
 */
import { HighlightStyle } from '@codemirror/language';
import { tags } from '@lezer/highlight';

const v = (name: string): string => `var(--nowo-milkdown-code-${name})`;

export const highlightStyle = HighlightStyle.define([
  { tag: [tags.keyword, tags.modifier, tags.operatorKeyword, tags.controlKeyword, tags.definitionKeyword, tags.moduleKeyword], color: v('keyword') },
  { tag: [tags.string, tags.special(tags.string), tags.regexp, tags.escape], color: v('string') },
  { tag: [tags.comment, tags.lineComment, tags.blockComment, tags.docComment], color: v('comment'), fontStyle: 'italic' },
  { tag: [tags.number, tags.bool, tags.null, tags.atom, tags.unit], color: v('number') },
  { tag: [tags.function(tags.variableName), tags.function(tags.propertyName), tags.macroName], color: v('function') },
  { tag: [tags.typeName, tags.className, tags.namespace, tags.standard(tags.typeName)], color: v('type') },
  { tag: [tags.propertyName, tags.attributeName, tags.labelName], color: v('property') },
  { tag: [tags.tagName, tags.angleBracket], color: v('tag') },
  { tag: [tags.meta, tags.processingInstruction, tags.annotation], color: v('meta') },
  { tag: [tags.heading, tags.strong], fontWeight: '700' },
  { tag: tags.emphasis, fontStyle: 'italic' },
  { tag: tags.link, textDecoration: 'underline' },
  { tag: tags.invalid, color: v('invalid') },
]);
