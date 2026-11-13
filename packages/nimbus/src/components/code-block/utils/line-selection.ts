import type { CodeLineSelection } from "../highlighter/code-highlighter.types";

/**
 * The kind of a marked line.
 */
export type CodeLineMark = "highlighted" | "added" | "removed";

/**
 * A group of neighboring lines with the same mark. Indexes are 0-based line
 * indexes and inclusive.
 */
export type CodeLineMarkRun = {
  mark: CodeLineMark;
  startIndex: number;
  endIndex: number;
};

/**
 * Returns the line numbers in `selection` that lie between `firstLine` and
 * `lastLine` (inclusive). Entries that are not integers, and ranges whose start
 * is after their end, are ignored.
 */
export const toLineNumberSet = (
  selection: CodeLineSelection | undefined,
  firstLine: number,
  lastLine: number
): Set<number> => {
  const lineNumbers = new Set<number>();

  for (const entry of selection ?? []) {
    const [start, end] = typeof entry === "number" ? [entry, entry] : entry;
    if (!Number.isInteger(start) || !Number.isInteger(end) || start > end) {
      continue;
    }
    for (
      let lineNumber = Math.max(start, firstLine);
      lineNumber <= Math.min(end, lastLine);
      lineNumber++
    ) {
      lineNumbers.add(lineNumber);
    }
  }

  return lineNumbers;
};

/**
 * Input for `getLineMarks`.
 */
export type GetLineMarksOptions = {
  lineCount: number;
  startLineNumber: number;
  highlightedLines?: CodeLineSelection;
  addedLines?: CodeLineSelection;
  removedLines?: CodeLineSelection;
};

/**
 * Returns the mark of every line, by line index. When a line is in more than
 * one selection, the order of precedence is removed, added, highlighted.
 * Selections use displayed line numbers (`index + startLineNumber`).
 */
export const getLineMarks = ({
  lineCount,
  startLineNumber,
  highlightedLines,
  addedLines,
  removedLines,
}: GetLineMarksOptions): Array<CodeLineMark | undefined> => {
  const lastLine = startLineNumber + lineCount - 1;
  const removed = toLineNumberSet(removedLines, startLineNumber, lastLine);
  const added = toLineNumberSet(addedLines, startLineNumber, lastLine);
  const highlighted = toLineNumberSet(
    highlightedLines,
    startLineNumber,
    lastLine
  );

  return Array.from({ length: lineCount }, (_, index) => {
    const lineNumber = index + startLineNumber;
    if (removed.has(lineNumber)) return "removed";
    if (added.has(lineNumber)) return "added";
    if (highlighted.has(lineNumber)) return "highlighted";
    return undefined;
  });
};

/**
 * Groups neighboring lines with the same mark into runs. Unmarked lines are
 * not part of any run.
 */
export const groupLineMarks = (
  marks: ReadonlyArray<CodeLineMark | undefined>
): CodeLineMarkRun[] => {
  const runs: CodeLineMarkRun[] = [];

  marks.forEach((mark, index) => {
    if (mark === undefined) return;
    const previous = runs[runs.length - 1];
    if (previous?.mark === mark && previous.endIndex === index - 1) {
      previous.endIndex = index;
    } else {
      runs.push({ mark, startIndex: index, endIndex: index });
    }
  });

  return runs;
};
