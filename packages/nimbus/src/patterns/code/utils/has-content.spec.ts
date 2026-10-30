import { describe, it, expect } from "vitest";
import { hasContent } from "./has-content";

describe("hasContent", () => {
  it.each([undefined, null, false, true, ""])(
    "returns false for %j",
    (node) => {
      expect(hasContent(node)).toBe(false);
    }
  );

  it.each(["title", 0, ["a"]])("returns true for %j", (node) => {
    expect(hasContent(node)).toBe(true);
  });
});
