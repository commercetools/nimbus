import { describe, it, expect } from "vitest";
import { getHeadingLevels, findHeadingLevelSkips } from "./heading-levels";

describe("markdown utils — heading level detection", () => {
  it("collects ATX heading levels, ignoring fenced code", () => {
    const src = "# A\n\n```\n## not a heading\n```\n\n### C";
    expect(getHeadingLevels(src)).toEqual([1, 3]);
  });
  it("flags level skips", () => {
    expect(findHeadingLevelSkips([1, 3])).toEqual([{ from: 1, to: 3 }]);
    expect(findHeadingLevelSkips([1, 2, 3])).toEqual([]);
    expect(findHeadingLevelSkips([2, 2, 4])).toEqual([{ from: 2, to: 4 }]);
  });
});
