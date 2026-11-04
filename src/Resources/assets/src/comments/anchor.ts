/**
 * Comment anchors (1.6, contract v1): validation, the canonical text of a document, anchors of a range and the
 * quote search. Kept free of editor state so the PHP validator (`CommentAnchor`) can share the test vectors.
 */
import type { Node } from '@milkdown/kit/prose/model';

export const ANCHOR_VERSION = 1;
export const MAX_EXACT = 4096;
export const MAX_CONTEXT = 32;
export const MAX_POSITION = 10_000_000;
export const MAX_BLOCK_INDEX = 100_000;
export const MAX_HEADING = 200;
export const MAX_ANCHOR_BYTES = 16 * 1024;
/** Host thread ids. */
export const ID_PATTERN = /^[A-Za-z0-9_-]{1,64}$/;
const BASE64 = /^[A-Za-z0-9+/]{4,512}={0,2}$/;
/** Stand-in of every inline leaf (mention, page link, icon, image, hard break) in the canonical text. */
export const LEAF = '￼';

export type TextQuote = { exact: string; prefix: string; suffix: string };
export type CommentAnchor = {
  v: 1;
  quote: TextQuote;
  position: { start: number; end: number };
  block: { index: number; heading: string | null };
  yjs: { start: string; end: string } | null;
};

const isInt = (v: unknown, min: number, max: number): v is number => typeof v === 'number' && Number.isInteger(v) && v >= min && v <= max;
const isText = (v: unknown, min: number, max: number): v is string => typeof v === 'string' && v.length >= min && v.length <= max && !v.includes('\0');
const record = (v: unknown): Record<string, unknown> | null => (v && typeof v === 'object' && !Array.isArray(v) ? (v as Record<string, unknown>) : null);

/**
 * Validates an anchor from the host (or from JSON); unknown keys are dropped.
 *
 * @param value - Untrusted value
 * @returns The anchor, or null when any field breaks the contract
 */
export function parseCommentAnchor(value: unknown): CommentAnchor | null {
  const a = record(value);
  if (!a || a.v !== ANCHOR_VERSION) return null;
  const q = record(a.quote);
  const p = record(a.position);
  const b = record(a.block);
  if (!q || !p || !b) return null;
  if (!isText(q.exact, 1, MAX_EXACT) || !isText(q.prefix, 0, MAX_CONTEXT) || !isText(q.suffix, 0, MAX_CONTEXT)) return null;
  if (!isInt(p.start, 0, MAX_POSITION) || !isInt(p.end, 0, MAX_POSITION) || p.start >= p.end || p.end - p.start !== q.exact.length) return null;
  if (!isInt(b.index, 0, MAX_BLOCK_INDEX)) return null;
  if (b.heading !== null && !isText(b.heading, 1, MAX_HEADING)) return null;
  let yjs: CommentAnchor['yjs'] = null;
  if (a.yjs !== undefined && a.yjs !== null) {
    const y = record(a.yjs);
    if (!y || typeof y.start !== 'string' || typeof y.end !== 'string' || !BASE64.test(y.start) || !BASE64.test(y.end)) return null;
    yjs = { start: y.start, end: y.end };
  }
  const anchor: CommentAnchor = {
    v: ANCHOR_VERSION,
    quote: { exact: q.exact, prefix: q.prefix, suffix: q.suffix },
    position: { start: p.start, end: p.end },
    block: { index: b.index, heading: b.heading as string | null },
    yjs,
  };
  return new TextEncoder().encode(JSON.stringify(anchor)).length <= MAX_ANCHOR_BYTES ? anchor : null;
}

type Segment = { offset: number; pos: number; length: number; text: boolean };

/** The canonical text of a document and the mapping between its offsets and ProseMirror positions. */
export class CanonicalText {
  readonly text: string;
  private readonly segments: Segment[];
  /** Start offset and heading text of every top-level block, in order. */
  readonly blocks: { offset: number; heading: string | null }[];

  constructor(doc: Node) {
    let text = '';
    const segments: Segment[] = [];
    const blocks: { offset: number; heading: string | null }[] = [];
    let heading: string | null = null;
    const push = (value: string, pos: number, isText: boolean): void => {
      segments.push({ offset: text.length, pos, length: value.length, text: isText });
      text += value;
    };
    doc.descendants((node, pos, parent) => {
      if (parent === doc) {
        if (text !== '' && !text.endsWith('\n')) push('\n', pos, false);
        if (node.type.name === 'heading') heading = node.textContent.trim().slice(0, MAX_HEADING) || heading;
        blocks.push({ offset: text.length, heading });
      } else if (node.isBlock && text !== '' && !text.endsWith('\n')) {
        push('\n', pos, false);
      }
      if (node.isText) push(node.text ?? '', pos, true);
      else if (node.isLeaf) push(LEAF, pos, false);
      return true;
    });
    this.text = text;
    this.segments = segments;
    this.blocks = blocks;
  }

  /** The segment holding `offset` (the last one starting at or before it). */
  private segmentAt(offset: number): Segment | null {
    let lo = 0;
    let hi = this.segments.length - 1;
    let found: Segment | null = null;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      const s = this.segments[mid]!;
      if (s.offset <= offset) {
        found = s;
        lo = mid + 1;
      } else hi = mid - 1;
    }
    return found;
  }

  /**
   * ProseMirror position of a canonical offset (for an end offset, pass `end: true`).
   *
   * @param offset - Offset in {@link text}
   * @param end - Whether the offset ends a range (a leaf or separator then maps past itself)
   * @returns The position
   */
  posAt(offset: number, end = false): number {
    const s = this.segmentAt(end ? offset - 1 : offset);
    if (!s) return 1;
    if (s.text) return s.pos + Math.min(offset - s.offset, s.length);
    return end ? s.pos + 1 : s.pos;
  }

  /**
   * Canonical offset of a ProseMirror position.
   *
   * @param pos - The position
   * @returns The offset (positions between segments map to the next segment)
   */
  offsetAt(pos: number): number {
    for (const s of this.segments) {
      if (s.text && pos >= s.pos && pos <= s.pos + s.length) return s.offset + (pos - s.pos);
      if (!s.text && pos <= s.pos) return s.offset;
      if (!s.text && pos === s.pos + 1 && this.text[s.offset] === LEAF) return s.offset + 1;
    }
    return this.text.length;
  }

  /** Index of the top-level block holding a canonical offset. */
  blockAt(offset: number): number {
    let index = 0;
    for (let i = 0; i < this.blocks.length; i++) if (this.blocks[i]!.offset <= offset) index = i;
    return index;
  }
}

/**
 * The anchor of a canonical range (no Yjs part; the plugin adds it when collaborating).
 *
 * @param canonical - The document's canonical text
 * @param start - Start offset
 * @param end - End offset (exclusive)
 * @returns The anchor, or null for an empty or oversized range
 */
export function anchorOf(canonical: CanonicalText, start: number, end: number): CommentAnchor | null {
  if (start >= end || end - start > MAX_EXACT) return null;
  const { text } = canonical;
  const block = canonical.blocks[canonical.blockAt(start)];
  return {
    v: ANCHOR_VERSION,
    quote: {
      exact: text.slice(start, end),
      prefix: text.slice(Math.max(0, start - MAX_CONTEXT), start),
      suffix: text.slice(end, end + MAX_CONTEXT),
    },
    position: { start, end },
    block: { index: canonical.blockAt(start), heading: block?.heading ?? null },
    yjs: null,
  };
}

/** Length of the common suffix of `a` and `b`. */
function commonSuffix(a: string, b: string): number {
  let n = 0;
  while (n < a.length && n < b.length && a[a.length - 1 - n] === b[b.length - 1 - n]) n++;
  return n;
}

/** Length of the common prefix of `a` and `b`. */
function commonPrefix(a: string, b: string): number {
  let n = 0;
  while (n < a.length && n < b.length && a[n] === b[n]) n++;
  return n;
}

/** At most this many occurrences of a quote are ranked (a one-letter quote in a long page). */
export const MAX_MATCHES = 1000;

/**
 * Finds the quote of an anchor in the canonical text: the exact text is required, the context only ranks the
 * candidates (then the distance to the stored position, then the stored block).
 *
 * @param canonical - The document's canonical text
 * @param anchor - The anchor
 * @returns The canonical range, or null when the exact text is gone (orphaned)
 */
export function findQuote(canonical: CanonicalText, anchor: CommentAnchor): { start: number; end: number } | null {
  const { text } = canonical;
  const { exact, prefix, suffix } = anchor.quote;
  let best: { start: number; score: number; distance: number; block: boolean } | null = null;
  let at = text.indexOf(exact);
  for (let n = 0; at !== -1 && n < MAX_MATCHES; n++) {
    const score = commonSuffix(text.slice(Math.max(0, at - prefix.length), at), prefix) + commonPrefix(text.slice(at + exact.length, at + exact.length + suffix.length), suffix);
    const distance = Math.abs(at - anchor.position.start);
    const block = canonical.blockAt(at) === anchor.block.index;
    if (!best || score > best.score || (score === best.score && (distance < best.distance || (distance === best.distance && block && !best.block)))) {
      best = { start: at, score, distance, block };
    }
    at = text.indexOf(exact, at + 1);
  }
  return best ? { start: best.start, end: best.start + exact.length } : null;
}
