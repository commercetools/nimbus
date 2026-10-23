import { describe, it, expect } from "vitest";
import {
  getLineMarks,
  groupLineMarks,
  toLineNumberSet,
} from "./line-selection";

describe("toLineNumberSet", () => {
  it("returns an empty set without a selection", () => {
    expect(toLineNumberSet(undefined, 1, 10)).toEqual(new Set());
  });

  it("includes single numbers and inclusive ranges", () => {
    expect(toLineNumberSet([2, [5, 7]], 1, 10)).toEqual(new Set([2, 5, 6, 7]));
  });

  it("accepts a range with equal start and end", () => {
    expect(toLineNumberSet([[3, 3]], 1, 10)).toEqual(new Set([3]));
  });

  it("ignores entries that are not integers", () => {
    expect(toLineNumberSet([1.5, NaN, Infinity, [1, 2.5]], 1, 10)).toEqual(
      new Set()
    );
  });

  it("ignores reversed ranges", () => {
    expect(toLineNumberSet([[6, 4]], 1, 10)).toEqual(new Set());
  });

  it("keeps only lines between the first and last line", () => {
    expect(toLineNumberSet([1, [40, 43], 47], 42, 46)).toEqual(
      new Set([42, 43])
    );
  });

  it("does not expand very large ranges beyond the displayed lines", () => {
    expect(toLineNumberSet([[1, Number.MAX_SAFE_INTEGER]], 1, 3)).toEqual(
      new Set([1, 2, 3])
    );
  });
});

describe("getLineMarks", () => {
  it("marks lines by displayed line number", () => {
    expect(
      getLineMarks({
        lineCount: 3,
        startLineNumber: 42,
        highlightedLines: [43],
      })
    ).toEqual([undefined, "highlighted", undefined]);
  });

  it("uses the order removed, added, highlighted", () => {
    expect(
      getLineMarks({
        lineCount: 4,
        startLineNumber: 1,
        highlightedLines: [[1, 4]],
        addedLines: [[2, 3]],
        removedLines: [3],
      })
    ).toEqual(["highlighted", "added", "removed", "highlighted"]);
  });

  it("returns no marks for empty code", () => {
    expect(
      getLineMarks({ lineCount: 0, startLineNumber: 1, addedLines: [1] })
    ).toEqual([]);
  });
});

describe("groupLineMarks", () => {
  it("groups neighboring lines with the same mark", () => {
    expect(
      groupLineMarks([
        undefined,
        "highlighted",
        "highlighted",
        "highlighted",
        undefined,
        undefined,
        "highlighted",
      ])
    ).toEqual([
      { mark: "highlighted", startIndex: 1, endIndex: 3 },
      { mark: "highlighted", startIndex: 6, endIndex: 6 },
    ]);
  });

  it("starts a new run when the mark changes", () => {
    expect(groupLineMarks(["removed", "added", "added"])).toEqual([
      { mark: "removed", startIndex: 0, endIndex: 0 },
      { mark: "added", startIndex: 1, endIndex: 2 },
    ]);
  });

  it("returns no runs without marks", () => {
    expect(groupLineMarks([undefined, undefined])).toEqual([]);
  });
});
