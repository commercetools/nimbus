import { describe, it, expect } from "vitest";
import {
  formatCompact,
  formatSignedCompact,
  formatInteger,
  formatPercent,
  formatSignedPercent,
} from "./format";

describe("number formatting", () => {
  it("formats large numbers compactly", () => {
    expect(formatCompact(1500)).toBe("1.5k");
    expect(formatCompact(2_000_000)).toBe("2M");
    expect(formatCompact(42)).toBe("42");
  });

  it("keeps the sign on signed compact values", () => {
    // d3-format uses a typographic minus (U+2212), not an ASCII hyphen.
    expect(formatSignedCompact(1200)).toBe("+1.2k");
    expect(formatSignedCompact(-1200)).toBe("−1.2k");
  });

  it("formats integers with grouping", () => {
    expect(formatInteger(12840)).toBe("12,840");
  });

  it("formats fractions as whole-percent", () => {
    expect(formatPercent(0.25)).toBe("25%");
    expect(formatPercent(1)).toBe("100%");
  });

  it("keeps the sign on signed percentages", () => {
    expect(formatSignedPercent(0.1)).toBe("+10%");
    expect(formatSignedPercent(-0.1)).toBe("−10%");
  });
});
