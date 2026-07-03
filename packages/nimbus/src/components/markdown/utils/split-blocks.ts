/**
 * Split a Markdown source string into top-level blocks for streaming
 * memoization. Pure and React-free so it can be unit-tested in isolation.
 */

const FENCE_RE = /^\s*(```+|~~~+)/;
const ATX_HEADING_RE = /^\s{0,3}#{1,6}(\s|$)/;
const LIST_ITEM_RE = /^\s*([-*+]|\d+[.)])\s+/;
const BLOCKQUOTE_RE = /^\s*>/;
const INDENTED_RE = /^( {4,}|\t)/;

// Custom component tag detection (line-level). Attribute run tolerates `>`
// inside quoted values so `<Card label="a > b">` stays one tag.
const TAG_ATTRS = `(?:\\s+[A-Za-z_][\\w-]*(?:\\s*=\\s*(?:"[^"]*"|'[^']*'|\\{[^}]*\\}|[^\\s>]+))?)*\\s*`;
const SELF_CLOSING_TAG_RE = new RegExp(`^<[A-Za-z][\\w-]*${TAG_ATTRS}/>$`);
const OPEN_TAG_RE = new RegExp(`^<([A-Za-z][\\w-]*)${TAG_ATTRS}>$`);
const CLOSE_TAG_RE = /^<\/([A-Za-z][\w-]*)\s*>$/;

/** If `line` is exactly one registered (non-self-closing) opening tag, its name. */
function openTagNameOf(
  line: string,
  names: ReadonlySet<string>
): string | null {
  const trimmed = line.trim();
  if (SELF_CLOSING_TAG_RE.test(trimmed)) return null;
  const match = OPEN_TAG_RE.exec(trimmed);
  return match && names.has(match[1]) ? match[1] : null;
}

/** If `line` is exactly one closing tag, its name (registration checked by caller). */
function closeTagNameOf(line: string): string | null {
  const match = CLOSE_TAG_RE.exec(line.trim());
  return match ? match[1] : null;
}

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
 *
 * When `customTagNames` is supplied, a block-level paired custom-tag region
 * (`<Name>` … `</Name>`, same-name depth-counted) is also kept in a single
 * block so the custom-tag remark plugin can pair it; an unclosed opening tag at
 * end-of-input (mid-stream) keeps the remaining tail in one growing block so it
 * completes as more tokens arrive. Self-closing tags need no special handling.
 */
export function splitMarkdownIntoBlocks(
  source: string,
  customTagNames?: ReadonlySet<string>
): string[] {
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

    // Fenced code block: consume through the closing fence (or EOF). Per
    // CommonMark, the closing fence must use the same marker and be at least as
    // long as the opening fence, so a longer opening fence (e.g. `````) can
    // embed shorter fence-like lines (```) without closing early.
    const fenceMatch = line.match(FENCE_RE);
    if (fenceMatch) {
      flush();
      const fence = fenceMatch[1]; // the opening run, e.g. ``` or `````
      const closeRe = new RegExp(`^\\s*${fence[0]}{${fence.length},}\\s*$`);
      current.push(line);
      i += 1;
      while (i < lines.length) {
        current.push(lines[i]);
        const closed = closeRe.test(lines[i]);
        i += 1;
        if (closed) break;
      }
      flush();
      continue;
    }

    // Block-level paired custom-tag region: keep <Name> … </Name> in one block
    // (same-name depth counting). Mirrors the fenced-code handling above.
    if (customTagNames && customTagNames.size > 0) {
      const openName = openTagNameOf(line, customTagNames);
      if (openName) {
        flush();
        current.push(line);
        i += 1;
        let depth = 1;
        while (i < lines.length && depth > 0) {
          const cur = lines[i];
          if (openTagNameOf(cur, customTagNames) === openName) depth += 1;
          else if (closeTagNameOf(cur) === openName) depth -= 1;
          current.push(cur);
          i += 1;
        }
        // depth > 0 here means unclosed at EOF (mid-stream): the tail is kept
        // in this single growing block, which is what we want.
        flush();
        continue;
      }
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
          // A non-indented heading or fence starts a distinct top-level block,
          // so it ends the list region rather than being lazily absorbed into
          // it (mirrors the paragraph loop's interrupts below).
          (!isBlank(next) &&
            !ATX_HEADING_RE.test(next) &&
            !FENCE_RE.test(next) &&
            current.length > 0)
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
