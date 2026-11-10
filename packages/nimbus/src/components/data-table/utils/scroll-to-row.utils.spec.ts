import { describe, it, expect } from "vitest";
import {
  computeTargetScrollTop,
  type ComputeTargetScrollTopInput,
} from "./scroll-to-row.utils";

/**
 * A scroll container 400px high, 2000px of content, scrolled to 500, with a
 * 40px header on top and rows 50px high. Positions are measured from the top
 * of the scrollable content, so with these numbers the visible area for rows
 * runs from 540 to 900.
 */
const base: Omit<ComputeTargetScrollTopInput, "align"> = {
  rowTop: 1000,
  rowHeight: 50,
  viewportHeight: 400,
  scrollTop: 500,
  scrollHeight: 2000,
  topInset: 40,
  bottomInset: 0,
};

describe("computeTargetScrollTop", () => {
  describe("start", () => {
    it("puts the row at the top of the visible area, below the header", () => {
      expect(computeTargetScrollTop({ ...base, align: "start" })).toBe(960);
    });
  });

  describe("end", () => {
    it("puts the row at the bottom of the visible area", () => {
      expect(computeTargetScrollTop({ ...base, align: "end" })).toBe(650);
    });

    it("keeps the row above the bottom inset", () => {
      expect(
        computeTargetScrollTop({ ...base, bottomInset: 60, align: "end" })
      ).toBe(710);
    });
  });

  describe("center", () => {
    it("puts the middle of the row at the middle of the visible area", () => {
      // Visible area is 360px high and starts 40px below the container top.
      expect(computeTargetScrollTop({ ...base, align: "center" })).toBe(805);
    });

    it("centers between the top and bottom insets", () => {
      // Visible area is 300px high: 40px header, 60px bottom inset.
      expect(
        computeTargetScrollTop({ ...base, bottomInset: 60, align: "center" })
      ).toBe(835);
    });
  });

  describe("nearest", () => {
    it("returns null for a row that is fully visible", () => {
      expect(
        computeTargetScrollTop({ ...base, rowTop: 600, align: "nearest" })
      ).toBeNull();
    });

    it("returns null for a row that exactly fills the edges", () => {
      expect(
        computeTargetScrollTop({ ...base, rowTop: 540, align: "nearest" })
      ).toBeNull();
      expect(
        computeTargetScrollTop({ ...base, rowTop: 850, align: "nearest" })
      ).toBeNull();
    });

    it("scrolls up when the row is above the visible area", () => {
      expect(
        computeTargetScrollTop({ ...base, rowTop: 100, align: "nearest" })
      ).toBe(60);
    });

    it("scrolls down when the row is below the visible area", () => {
      expect(
        computeTargetScrollTop({ ...base, rowTop: 1000, align: "nearest" })
      ).toBe(650);
    });

    it("scrolls up when the header covers part of the row", () => {
      expect(
        computeTargetScrollTop({ ...base, rowTop: 520, align: "nearest" })
      ).toBe(480);
    });

    it("scrolls down when the bottom edge cuts the row", () => {
      expect(
        computeTargetScrollTop({ ...base, rowTop: 870, align: "nearest" })
      ).toBe(520);
    });

    it("treats the bottom inset as covered", () => {
      expect(
        computeTargetScrollTop({
          ...base,
          rowTop: 850,
          bottomInset: 60,
          align: "nearest",
        })
      ).toBe(560);
    });

    it("aligns the top of a row that is taller than the visible area", () => {
      expect(
        computeTargetScrollTop({
          ...base,
          rowTop: 600,
          rowHeight: 500,
          align: "nearest",
        })
      ).toBe(560);
    });

    it("defaults to nearest", () => {
      expect(
        computeTargetScrollTop({ ...base, rowTop: 600, align: undefined })
      ).toBeNull();
    });
  });

  describe("clamping", () => {
    it("stops at the top for the first row", () => {
      expect(
        computeTargetScrollTop({
          ...base,
          rowTop: 40,
          align: "start",
        })
      ).toBe(0);
      expect(
        computeTargetScrollTop({
          ...base,
          rowTop: 40,
          align: "center",
        })
      ).toBe(0);
    });

    it("stops at the end of the scroll range for the last row", () => {
      expect(
        computeTargetScrollTop({
          ...base,
          rowTop: 1950,
          align: "start",
        })
      ).toBe(1600);
      expect(
        computeTargetScrollTop({
          ...base,
          rowTop: 1950,
          align: "center",
        })
      ).toBe(1600);
    });

    it("returns 0 when the content is shorter than the container", () => {
      expect(
        computeTargetScrollTop({
          ...base,
          scrollHeight: 300,
          scrollTop: 0,
          rowTop: 200,
          align: "start",
        })
      ).toBe(0);
    });
  });
});
