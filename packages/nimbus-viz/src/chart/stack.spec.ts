import { describe, it, expect } from "vitest";
import { stackKeys } from "./stack";

describe("stackKeys", () => {
  it("returns the keys of a regular dataset in first-seen order", () => {
    const rows = [
      { category: "Q1", segments: [{ key: "New" }, { key: "Returning" }] },
      { category: "Q2", segments: [{ key: "New" }, { key: "Returning" }] },
    ];
    expect(stackKeys(rows)).toEqual(["New", "Returning"]);
  });

  it("includes a key that is missing from the first row", () => {
    // The `rows[0].segments` shortcut this helper replaces would drop
    // "Referral" entirely: no bar segment, no legend entry.
    const rows = [
      { category: "Q1", segments: [{ key: "New" }] },
      { category: "Q2", segments: [{ key: "New" }, { key: "Referral" }] },
    ];
    expect(stackKeys(rows)).toEqual(["New", "Referral"]);
  });

  it("keeps first-seen order across ragged rows", () => {
    const rows = [
      { category: "a", segments: [{ key: "B" }] },
      { category: "b", segments: [{ key: "A" }, { key: "B" }, { key: "C" }] },
    ];
    expect(stackKeys(rows)).toEqual(["B", "A", "C"]);
  });

  it("returns an empty list for no rows", () => {
    expect(stackKeys([])).toEqual([]);
  });

  // C1: a chart generic over a custom row type T has no literal `.segments`
  // field, so it passes its own accessor instead of relying on the default.
  it("accepts a custom row type via an explicit segments accessor", () => {
    interface CustomRow {
      quarter: string;
      bars: { name: string }[];
    }
    const rows: CustomRow[] = [
      { quarter: "Q1", bars: [{ name: "New" }] },
      { quarter: "Q2", bars: [{ name: "New" }, { name: "Referral" }] },
    ];
    expect(
      stackKeys(rows, (r) => r.bars.map((b) => ({ key: b.name })))
    ).toEqual(["New", "Referral"]);
  });
});
