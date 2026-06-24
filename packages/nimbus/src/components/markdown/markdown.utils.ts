/**
 * Pure helpers for the Markdown component. Kept dependency-free and free of
 * React so they can be unit-tested in isolation (see `markdown.spec.ts`).
 */

/** Minimal structural type for the hast nodes react-markdown passes as `node`. */
type HastNodeLike = {
  type?: string;
  value?: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: HastNodeLike[];
};

/**
 * Return a shallow copy of a renderer's props with the hast `node` removed, so
 * it is never spread onto a DOM element (which would leak
 * `node="[object Object]"`). Avoids an unused destructured binding.
 */
export function withoutNode<T extends { node?: unknown }>(
  props: T
): Omit<T, "node"> {
  const rest = { ...props };
  delete (rest as { node?: unknown }).node;
  return rest as Omit<T, "node">;
}

/**
 * Recursively extract the visible text of a hast node — used to derive an
 * accessible name for GFM task-list checkboxes from their item text.
 */
export function getNodeText(node: HastNodeLike | undefined | null): string {
  if (!node) return "";
  if (node.type === "text") return node.value ?? "";
  if (!node.children) return "";
  return node.children.map(getNodeText).join("").trim();
}

/**
 * Whether an href points to an external origin (absolute http/https or a
 * protocol-relative URL). Relative and in-page (`#…`) links are internal.
 */
export function isExternalUrl(href: string | undefined | null): boolean {
  if (!href) return false;
  return /^(https?:)?\/\//i.test(href.trim());
}

const FENCE_RE = /^\s*(```+|~~~+)/;
const ATX_HEADING_RE = /^\s{0,3}#{1,6}(\s|$)/;
const LIST_ITEM_RE = /^\s*([-*+]|\d+[.)])\s+/;
const BLOCKQUOTE_RE = /^\s*>/;
const INDENTED_RE = /^( {4,}|\t)/;

/**
 * Split a Markdown source string into top-level blocks for streaming
 * memoization.
 *
 * Top-level Markdown blocks render identically whether parsed standalone or
 * in-context, so rendering each block through its own (memoized) `react-markdown`
 * instance is equivalent to rendering the whole document — but only the final,
 * still-growing block re-parses as new tokens arrive.
 *
 * The splitter is conservative: it never splits inside a fenced code block, and
 * it keeps contiguous list / blockquote regions (including their internal blank
 * lines) together so a loose list is never torn into separate `<ul>`s.
 */
export function splitMarkdownIntoBlocks(source: string): string[] {
  if (!source) return [];
  const lines = source.split("\n");
  const blocks: string[] = [];
  let current: string[] = [];

  const flush = () => {
    if (current.length > 0) {
      blocks.push(current.join("\n"));
      current = [];
    }
  };

  const isBlank = (line: string) => line.trim() === "";
  const startsListOrQuote = (line: string) =>
    LIST_ITEM_RE.test(line) || BLOCKQUOTE_RE.test(line);

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    if (isBlank(line)) {
      flush();
      i += 1;
      continue;
    }

    // Fenced code block: consume through the closing fence (or EOF).
    const fenceMatch = line.match(FENCE_RE);
    if (fenceMatch) {
      flush();
      const marker = fenceMatch[1][0]; // ` or ~
      current.push(line);
      i += 1;
      while (i < lines.length) {
        current.push(lines[i]);
        const closed = new RegExp(
          `^\\s*${marker === "`" ? "`" : "~"}{3,}\\s*$`
        ).test(lines[i]);
        i += 1;
        if (closed) break;
      }
      flush();
      continue;
    }

    // ATX heading: its own block.
    if (ATX_HEADING_RE.test(line)) {
      flush();
      current.push(line);
      flush();
      i += 1;
      continue;
    }

    // List or blockquote region: keep contiguous lines (and interior blank
    // lines that are followed by more list/quote content) together.
    if (startsListOrQuote(line)) {
      flush();
      current.push(line);
      i += 1;
      while (i < lines.length) {
        const next = lines[i];
        if (
          startsListOrQuote(next) ||
          INDENTED_RE.test(next) ||
          (!isBlank(next) && current.length > 0)
        ) {
          current.push(next);
          i += 1;
          continue;
        }
        if (isBlank(next)) {
          // Peek: does the region continue after the blank line?
          const after = lines[i + 1];
          if (
            after !== undefined &&
            (startsListOrQuote(after) || INDENTED_RE.test(after))
          ) {
            current.push(next);
            i += 1;
            continue;
          }
        }
        break;
      }
      flush();
      continue;
    }

    // Paragraph: accumulate consecutive non-blank lines.
    current.push(line);
    i += 1;
    while (i < lines.length && !isBlank(lines[i])) {
      // A heading, fence, or list start interrupts the paragraph.
      if (
        ATX_HEADING_RE.test(lines[i]) ||
        FENCE_RE.test(lines[i]) ||
        startsListOrQuote(lines[i])
      ) {
        break;
      }
      current.push(lines[i]);
      i += 1;
    }
    flush();
  }

  flush();
  return blocks;
}

/**
 * Return the ATX heading levels, in document order, found in a Markdown source.
 * Lines inside fenced code blocks are ignored. Used to detect author
 * heading-level skips for a development-mode warning.
 */
export function getHeadingLevels(source: string): number[] {
  const levels: number[] = [];
  let inFence = false;
  let marker = "";
  for (const line of source.split("\n")) {
    const fence = line.match(FENCE_RE);
    if (fence) {
      const m = fence[1][0];
      if (!inFence) {
        inFence = true;
        marker = m;
      } else if (m === marker) {
        inFence = false;
      }
      continue;
    }
    if (inFence) continue;
    const m = line.match(/^\s{0,3}(#{1,6})(\s|$)/);
    if (m) levels.push(m[1].length);
  }
  return levels;
}

/**
 * Given the heading levels in document order, return the skips (a heading whose
 * level is more than one greater than the previous heading's level).
 */
export function findHeadingLevelSkips(
  levels: number[]
): { from: number; to: number }[] {
  const skips: { from: number; to: number }[] = [];
  let prev = 0;
  for (const level of levels) {
    if (prev !== 0 && level > prev + 1) {
      skips.push({ from: prev, to: level });
    }
    prev = level;
  }
  return skips;
}
