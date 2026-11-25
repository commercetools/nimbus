import { describe, it, expect } from "vitest";
import { isRowDragDisabled } from "./drag.utils";

describe("isRowDragDisabled", () => {
  const row = { id: "a" };

  it("is false without draggableKeys", () => {
    expect(isRowDragDisabled({ row, rowKey: "a" })).toBe(false);
  });

  it("is true for a row outside draggableKeys", () => {
    expect(
      isRowDragDisabled({ row, rowKey: "a", draggableKeys: new Set(["b"]) })
    ).toBe(true);
  });

  it("is false for a listed row that is not disabled", () => {
    expect(
      isRowDragDisabled({ row, rowKey: "a", draggableKeys: new Set(["a"]) })
    ).toBe(false);
  });

  it("is true for a listed row in disabledKeys", () => {
    expect(
      isRowDragDisabled({
        row,
        rowKey: "a",
        draggableKeys: new Set(["a"]),
        disabledKeys: new Set(["a"]),
      })
    ).toBe(true);
  });

  it('is true for a listed row when disabledKeys is "all"', () => {
    expect(
      isRowDragDisabled({
        row,
        rowKey: "a",
        draggableKeys: new Set(["a"]),
        disabledKeys: "all",
      })
    ).toBe(true);
  });

  it("is true for a listed row with isDisabled", () => {
    expect(
      isRowDragDisabled({
        row: { id: "a", isDisabled: true },
        rowKey: "a",
        draggableKeys: new Set(["a"]),
      })
    ).toBe(true);
  });
});
