/**
 * Split a Markdown source string into top-level blocks for streaming
 * memoization. Pure and React-free so it can be unit-tested in isolation.
 */

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
