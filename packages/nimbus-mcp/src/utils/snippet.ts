/**
 * Builds the content excerpt returned for a search_docs result.
 *
 * The window is anchored where the most distinct query tokens co-occur, so a
 * multi-word query lands on the passage that answers it rather than on the
 * first occurrence of its most common word. Edges are snapped to line (or
 * word) boundaries and whitespace is collapsed to keep the excerpt compact.
 */

/** Target excerpt size in characters, before boundary snapping. */
export const SNIPPET_LENGTH = 600;
/** Characters of context shown before the anchor token. */
export const SNIPPET_LEAD = 150;
/** How far past a raw window edge to look for a line or word boundary. */
const BOUNDARY_SLACK = 80;
/** Candidate anchors considered per token (bounds cost on very common words). */
const MAX_ANCHORS_PER_TOKEN = 200;

/** Positions of up to MAX_ANCHORS_PER_TOKEN occurrences of `token`. */
function anchorsFor(lower: string, token: string): number[] {
  const positions: number[] = [];
  let idx = lower.indexOf(token);
  while (idx !== -1 && positions.length < MAX_ANCHORS_PER_TOKEN) {
    positions.push(idx);
    idx = lower.indexOf(token, idx + token.length);
  }
  return positions;
}

/** Whether `token` occurs anywhere in [windowStart, windowEnd). */
function occursWithin(
  lower: string,
  token: string,
  windowStart: number,
  windowEnd: number
): boolean {
  const idx = lower.indexOf(token, Math.max(0, windowStart));
  return idx !== -1 && idx < windowEnd;
}

/**
 * Finds the anchor whose window covers the most distinct tokens. Tokens are
 * tried rarest first and a later candidate must strictly beat the best count,
 * so among equally good windows the excerpt stays centred on the rare token
 * (and, for a single token, on its earliest occurrence). `anchor` is -1 and
 * `count` is 0 when no token occurs at all.
 */
export function findBestAnchor(
  lower: string,
  tokens: string[]
): { anchor: number; count: number } {
  const present = [...new Set(tokens)]
    .filter((t) => lower.includes(t))
    .map((token) => ({ token, anchors: anchorsFor(lower, token) }))
    .sort((a, b) => a.anchors.length - b.anchors.length);
  if (present.length === 0) return { anchor: -1, count: 0 };

  let bestAnchor = -1;
  let bestCount = 0;
  for (const { anchors } of present) {
    for (const anchor of anchors) {
      const windowStart = anchor - SNIPPET_LEAD;
      const windowEnd = windowStart + SNIPPET_LENGTH;
      let count = 0;
      for (const other of present) {
        if (occursWithin(lower, other.token, windowStart, windowEnd)) count++;
      }
      if (count > bestCount) {
        bestCount = count;
        bestAnchor = anchor;
      }
    }
  }
  return { anchor: bestAnchor, count: bestCount };
}

/** Moves `start` back to the previous line start (or word start) within slack. */
function snapStart(content: string, start: number): number {
  if (start === 0) return 0;
  const floor = Math.max(0, start - BOUNDARY_SLACK);
  const nl = content.lastIndexOf("\n", start);
  if (nl >= floor) return nl + 1;
  for (let i = start; i > floor; i--) {
    if (/\s/.test(content[i - 1])) return i;
  }
  return start;
}

/** Moves `end` forward to the next line end, else back to a word end, within slack. */
function snapEnd(content: string, end: number): number {
  if (end >= content.length) return content.length;
  const ceil = Math.min(content.length, end + BOUNDARY_SLACK);
  const nl = content.indexOf("\n", end);
  if (nl !== -1 && nl <= ceil) return nl;
  return snapEndBackward(content, end);
}

/** Moves `end` back to the nearest preceding whitespace within slack. */
function snapEndBackward(content: string, end: number): number {
  if (end >= content.length) return content.length;
  const floor = Math.max(0, end - BOUNDARY_SLACK);
  for (let i = end; i > floor; i--) {
    if (/\s/.test(content[i])) return i;
  }
  return end;
}

/** Collapses indentation runs and excess blank lines. */
function collapseWhitespace(text: string): string {
  return text.replace(/[ \t]{2,}/g, " ").replace(/\n{3,}/g, "\n\n");
}

export function extractSnippet(content: string, tokens: string[]): string {
  const { anchor } = findBestAnchor(content.toLowerCase(), tokens);

  if (anchor === -1) {
    const end = snapEndBackward(
      content,
      Math.min(content.length, SNIPPET_LENGTH)
    );
    const head = collapseWhitespace(content.slice(0, end).trim());
    return end < content.length ? head + "…" : head;
  }

  const start = snapStart(content, Math.max(0, anchor - SNIPPET_LEAD));
  const end = snapEnd(
    content,
    Math.min(content.length, start + SNIPPET_LENGTH)
  );
  let snippet = collapseWhitespace(content.slice(start, end).trim());
  if (start > 0) snippet = "…" + snippet;
  if (end < content.length) snippet = snippet + "…";
  return snippet;
}
