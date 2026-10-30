import { describe, expect, it } from 'vitest';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkStringify from 'remark-stringify';
import { dropEmptyLineMarkers, nameAlignContainers, remarkNowoDialect, transform, type MdNode } from '../src/dialect/remark-dialect';
import { isAnchor, isHandle, isIconName, isUuid, serialise, splitText } from '../src/dialect/patterns';

const ID = '0b6f4f0e-3c55-4d0a-9a43-1f7a2c9e8d10';
const ALPHA_ID = 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d';

// Same order as Milkdown: parser and compiler first, then the dialect (it wraps both).
const processor = () => unified().use(remarkParse).use(remarkStringify).use(remarkNowoDialect as never);
const tree = (md: string): MdNode => {
  const p = processor();
  return p.runSync(p.parse(md)) as unknown as MdNode;
};
const roundTrip = (md: string): string => {
  const p = processor();
  return p.stringify(p.runSync(p.parse(md)) as never);
};
const inline = (md: string): MdNode[] => tree(md).children![0]!.children!;

describe('splitText', () => {
  it('finds page links by id with and without anchor', () => {
    expect(splitText(`see [[wiki:${ID}#install]] now`)).toEqual([
      { type: 'text', value: 'see ' },
      { type: 'wikiRef', pageId: ID, anchor: 'install' },
      { type: 'text', value: ' now' },
    ]);
    expect(splitText(`[[wiki:${ID}]]`)).toEqual([{ type: 'wikiRef', pageId: ID, anchor: '' }]);
  });

  it('ignores malformed ids, anchors and markup', () => {
    expect(splitText(`[[wiki:not-a-uuid]] [[wiki:${ID}#<x>]] [[wiki:${ID.toUpperCase()}]]`).every((n) => n.type === 'text')).toBe(true);
  });

  it('mentions need a boundary (never inside an e-mail address)', () => {
    expect(splitText('ada@example.com').map((n) => n.type)).toEqual(['text']);
    expect(splitText('hi @ada.l, (@grace)')).toEqual([
      { type: 'text', value: 'hi ' },
      { type: 'mention', handle: 'ada.l' },
      { type: 'text', value: ', (' },
      { type: 'mention', handle: 'grace' },
      { type: 'text', value: ')' },
    ]);
  });

  it('Tabler shortcodes need a safe name', () => {
    expect(splitText(':tabler-bug: x')[0]).toEqual({ type: 'tablerIcon', name: 'bug' });
    expect(splitText(':tabler-"><svg>:').every((n) => n.type === 'text')).toBe(true);
    expect(splitText(':tabler-Bug:').every((n) => n.type === 'text')).toBe(true);
  });

  it('serialises back to the same text', () => {
    const src = `a [[wiki:${ID}]] b @ada c :tabler-bug: d [[wiki:${ID}#x-1]]`;
    const back = splitText(src)
      .map((n) => (n.type === 'text' ? n.value : serialise[n.type](n as never)))
      .join('');
    expect(back).toBe(src);
  });

  it('validators', () => {
    expect(isUuid(ID)).toBe(true);
    expect(isUuid('x')).toBe(false);
    expect(isAnchor('')).toBe(true);
    expect(isAnchor('Install')).toBe(false);
    expect(isHandle('ada.l')).toBe(true);
    expect(isHandle('ada.')).toBe(false);
    expect(isIconName('alert-triangle')).toBe(true);
    expect(isIconName('alert--triangle')).toBe(false);
  });
});

describe('remark plugin', () => {
  it('parses the inline tokens outside code and links', () => {
    expect(inline(`Ask @ada about [[wiki:${ID}]] :tabler-bug:`).map((n) => n.type)).toEqual([
      'text',
      'mention',
      'text',
      'wikiRef',
      'text',
      'tablerIcon',
    ]);
    expect(inline('`@ada` [@ada](https://example.com)').map((n) => n.type)).toEqual(['inlineCode', 'text', 'link']);
  });

  it('a page id starting with a letter is not a directive', () => {
    expect(inline(`[[wiki:${ALPHA_ID}#a]]`)).toEqual([{ type: 'wikiRef', pageId: ALPHA_ID, anchor: 'a' }]);
  });

  it('keeps ordinary colons as text (times, labels, URLs in text)', () => {
    const md = 'Meet at 10:30, note:read this and foo:bar. Ratio 1:2.\n';
    expect(roundTrip(md)).toBe(md);
    expect(inline(md).map((n) => n.type)).toEqual(['text']);
  });

  it('round trips every directive of the dialect', () => {
    const md = [
      ':::callout{type="warning"}',
      'Careful **here**.',
      ':::',
      '',
      ':::details{summary="More info"}',
      'Hidden text.',
      ':::',
      '',
      '::: {align="center"}',
      'Centred.',
      ':::',
      '',
      'Some :mark[highlighted *text*]{color="green"} here.',
      '',
      '::beacon{#42 type="issue"}',
      '',
    ].join('\n');
    expect(roundTrip(md)).toBe(md);
    expect(roundTrip(roundTrip(md))).toBe(md);
  });

  it('reads and writes nameless alignment containers, never inside code', () => {
    const md = '::: {align="right"}\nRight.\n:::\n\n```\n::: {align="x"}\n```\n';
    expect(roundTrip(md)).toBe(md);
    expect(tree(md).children![0]!).toMatchObject({ type: 'containerDirective', name: 'align', attributes: { align: 'right' } });
    expect(nameAlignContainers('~~~\n:::{a}\n~~~~\n:::{b}')).toBe('~~~\n:::{a}\n~~~~\n:::align{b}');
  });

  it('drops the empty-paragraph markers Milkdown writes', () => {
    expect(dropEmptyLineMarkers('a\n\n<br />\n\n* <br />\n* [ ] <br />\n> <br />\n\n```\n<br />\n```\nx <br />')).toBe('a\n\n*\n* [ ]\n>\n\n```\n<br />\n```\nx <br />');
  });

  it('escapes a colon that would open a directive and keeps it text', () => {
    const p = processor();
    const doc = { type: 'root', children: [{ type: 'paragraph', children: [{ type: 'text', value: 'type :mark[x] literally' }] }] };
    const md = p.stringify(doc as never);
    expect(md).toBe('type \\:mark\\[x] literally\n');
    expect(inline(md).map((n) => n.type)).toEqual(['text']);
  });

  it('round trips the inline tokens without escaping', () => {
    const md = `Ask @ada about [[wiki:${ID}#install]] :tabler-bug: now.\n`;
    expect(roundTrip(md)).toBe(md);
  });

  it('transform leaves nodes without children alone', () => {
    const node: MdNode = { type: 'thematicBreak' };
    transform(node);
    expect(node).toEqual({ type: 'thematicBreak' });
    const code: MdNode = { type: 'code', children: [{ type: 'text', value: '@ada' }] };
    transform(code);
    expect(code.children).toEqual([{ type: 'text', value: '@ada' }]);
  });

  it('a bare text directive without name becomes a lone colon', () => {
    const node: MdNode = { type: 'paragraph', children: [{ type: 'textDirective', attributes: null }] };
    transform(node);
    expect(node.children).toEqual([{ type: 'text', value: ':' }]);
  });
});
