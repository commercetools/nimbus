import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { ChartPatternDefs, patternFill } from "./patterns";

describe("patternFill", () => {
  it("returns a url(#id) referencing the slot's texture", () => {
    expect(patternFill(0)).toBe("url(#nv-tex-0)");
    expect(patternFill(3, "series")).toBe("url(#series-3)");
  });
});

describe("ChartPatternDefs", () => {
  it("emits one <pattern> per color with unique, matching ids", () => {
    const colors = ["#111111", "#222222", "#333333"];
    const { container } = render(
      <svg>
        <ChartPatternDefs colors={colors} />
      </svg>
    );
    const patterns = container.querySelectorAll("pattern");
    expect(patterns).toHaveLength(colors.length);
    const ids = Array.from(patterns).map((p) => p.getAttribute("id"));
    expect(new Set(ids).size).toBe(colors.length); // unique
    // ids line up with patternFill so marks can reference them.
    colors.forEach((_, i) =>
      expect(ids).toContain(patternFill(i).slice(5, -1))
    );
  });

  it("gives distinct geometry to adjacent slots (texture, not just color)", () => {
    const { container } = render(
      <svg>
        <ChartPatternDefs colors={["#111111", "#222222"]} />
      </svg>
    );
    const patterns = container.querySelectorAll("pattern");
    // Slot 0 is solid (a full-fill rect, no path); slot 1 is a hatch (a path).
    expect(patterns[0]?.querySelector("path")).toBeNull();
    expect(patterns[1]?.querySelector("path")).not.toBeNull();
  });
});
