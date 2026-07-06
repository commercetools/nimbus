/**
 * Heading-level detection over a Markdown source, used to warn (in development)
 * when author markdown skips a heading level. Pure and React-free.
 */

const FENCE_RE = /^\s*(```+|~~~+)/;

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
