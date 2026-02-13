import { describe, it, expect } from "vitest";
import { detectCategory } from "./category-detector";
import { loadTokenData } from "./token-data";

const data = loadTokenData()!;
const { categorySets } = data;

/** Helper: get all token names for a category plus some CSS keywords */
function entriesFor(category: string, extras: string[] = []): string[] {
  return [...categorySets[category], ...extras];
}

describe("detectCategory", () => {
  it("detects spacing tokens", () => {
    const entries = entriesFor("spacing", ["auto", "inherit"]);
    expect(detectCategory(entries, categorySets)).toBe("spacing");
  });

  it("detects fontSize tokens", () => {
    const entries = entriesFor("fontSizes", ["inherit"]);
    expect(detectCategory(entries, categorySets)).toBe("fontSizes");
  });

  it("detects borderRadius tokens", () => {
    const entries = entriesFor("radii", ["none", "inherit"]);
    expect(detectCategory(entries, categorySets)).toBe("radii");
  });

  it("detects blur tokens", () => {
    const entries = entriesFor("blurs", ["none"]);
    expect(detectCategory(entries, categorySets)).toBe("blurs");
  });

  it("detects fontWeight tokens", () => {
    const entries = entriesFor("fontWeights", ["inherit"]);
    expect(detectCategory(entries, categorySets)).toBe("fontWeights");
  });

  it("detects color tokens", () => {
    const entries = entriesFor("colors", [
      "transparent",
      "currentColor",
      "inherit",
    ]);
    expect(detectCategory(entries, categorySets)).toBe("colors");
  });

  it("detects shadow tokens", () => {
    const entries = entriesFor("shadows", ["none"]);
    expect(detectCategory(entries, categorySets)).toBe("shadows");
  });

  it("detects opacity tokens", () => {
    const entries = entriesFor("opacity", ["inherit"]);
    expect(detectCategory(entries, categorySets)).toBe("opacity");
  });

  it("detects zIndex tokens", () => {
    const entries = entriesFor("zIndex", ["auto"]);
    expect(detectCategory(entries, categorySets)).toBe("zIndex");
  });

  it("returns undefined for unrecognized entries", () => {
    const entries = ["foo", "bar", "baz", "qux"];
    expect(detectCategory(entries, categorySets)).toBeUndefined();
  });

  it("returns undefined for empty entries", () => {
    expect(detectCategory([], categorySets)).toBeUndefined();
  });

  it("returns undefined when only excluded entries are present", () => {
    const entries = ["inherit", "initial", "auto", "none", "transparent"];
    expect(detectCategory(entries, categorySets)).toBeUndefined();
  });

  it("prefers spacing over fontWeights when both match (subset handling)", () => {
    // Spacing includes all fontWeight values (100-900) plus many more
    // When all spacing tokens are present, spacing should win
    const entries = entriesFor("spacing");
    expect(detectCategory(entries, categorySets)).toBe("spacing");
  });

  it("correctly identifies fontWeights when only weight values are present", () => {
    // When only 100-900 are present (no other spacing tokens),
    // fontWeights should win since it has higher ratio
    const entries = [
      "100",
      "200",
      "300",
      "400",
      "500",
      "600",
      "700",
      "800",
      "900",
    ];
    expect(detectCategory(entries, categorySets)).toBe("fontWeights");
  });
});
