import type {
  CodeLine,
  CodeToken,
} from "../highlighter/code-highlighter.types";

/**
 * A part of a line. `isMatch` is true when the tokens form one match of a
 * highlighted word.
 */
export type CodeLineSegment = {
  isMatch: boolean;
  tokens: CodeToken[];
};

/**
 * Finds every exact, case-sensitive occurrence of `words` in `text` and
 * returns the sorted `[start, end)` ranges. Overlapping occurrences are merged
 * into one range.
 */
const findWordRanges = (
  text: string,
  words: readonly string[]
): Array<[start: number, end: number]> => {
  const ranges: Array<[number, number]> = [];

  for (const word of words) {
    if (word === "") continue;
    let index = text.indexOf(word);
    while (index !== -1) {
      ranges.push([index, index + word.length]);
      index = text.indexOf(word, index + word.length);
    }
  }

  ranges.sort((a, b) => a[0] - b[0]);

  const merged: Array<[number, number]> = [];
  for (const range of ranges) {
    const previous = merged[merged.length - 1];
    if (previous !== undefined && range[0] < previous[1]) {
      previous[1] = Math.max(previous[1], range[1]);
    } else {
      merged.push([...range]);
    }
  }
  return merged;
};

/**
 * Splits a line into segments at every occurrence of `words`. A match can span
 * several tokens; tokens are cut at the match borders and keep their types.
 * Returns no segments for an empty line.
 */
export const splitLineAtWords = (
  line: CodeLine,
  words: readonly string[]
): CodeLineSegment[] => {
  const text = line.map((token) => token.content).join("");
  const ranges = findWordRanges(text, words);
  const segments: CodeLineSegment[] = [];
  let lastMatchIndex: number | undefined;
  let rangeIndex = 0;
  let offset = 0;

  for (const token of line) {
    let start = 0;
    while (start < token.content.length) {
      const position = offset + start;
      while (rangeIndex < ranges.length && ranges[rangeIndex][1] <= position) {
        rangeIndex++;
      }
      const range = ranges[rangeIndex];
      const isMatch = range !== undefined && range[0] <= position;
      const pieceEnd = range === undefined ? Infinity : range[isMatch ? 1 : 0];
      const end = Math.min(token.content.length, pieceEnd - offset);
      const piece =
        start === 0 && end === token.content.length
          ? token
          : { content: token.content.slice(start, end), types: token.types };

      const matchIndex = isMatch ? rangeIndex : -1;
      if (matchIndex === lastMatchIndex) {
        segments[segments.length - 1].tokens.push(piece);
      } else {
        segments.push({ isMatch, tokens: [piece] });
        lastMatchIndex = matchIndex;
      }
      start = end;
    }
    offset += token.content.length;
  }

  return segments;
};
