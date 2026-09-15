import { describe, it, expect } from "vitest";
import { dashKindFor, strokeDasharrayFor } from "./stroke-styles";

describe("dashKindFor", () => {
  it("cycles through the fixed kind list by index", () => {
    expect(dashKindFor(0)).toBe("solid");
    expect(dashKindFor(1)).toBe("dashed");
    expect(dashKindFor(5)).toBe("solid"); // wraps after 5 kinds
  });
});

describe("strokeDasharrayFor", () => {
  it("returns undefined (a real solid stroke) for slot 0", () => {
    expect(strokeDasharrayFor(0)).toBeUndefined();
  });

  it("returns a distinct dasharray string for every other slot", () => {
    const values = [1, 2, 3, 4].map((i) => strokeDasharrayFor(i));
    expect(values.every((v) => typeof v === "string" && v.length > 0)).toBe(
      true
    );
    expect(new Set(values).size).toBe(values.length); // all distinct
  });

  it("wraps back to solid once the kind list repeats", () => {
    expect(strokeDasharrayFor(5)).toBeUndefined();
    expect(strokeDasharrayFor(5)).toBe(strokeDasharrayFor(0));
  });
});
