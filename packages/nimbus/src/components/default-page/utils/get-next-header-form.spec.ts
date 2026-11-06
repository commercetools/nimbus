import { describe, it, expect } from "vitest";
import { getNextHeaderForm } from "./get-next-header-form";

// Full 120px, collapsed 80px: the header gives back 40px, so it collapses at
// a distance of 48px (40 + 8) and returns to its full form below 1px.
const heights = { fullHeight: 120, collapsedHeight: 80 };

describe("getNextHeaderForm", () => {
  describe("collapse point", () => {
    it("collapses at the space given back plus 8px", () => {
      expect(
        getNextHeaderForm({ current: "full", distance: 48, ...heights })
      ).toBe("collapsed");
    });

    it("collapses beyond the point", () => {
      expect(
        getNextHeaderForm({ current: "full", distance: 500, ...heights })
      ).toBe("collapsed");
    });

    it("keeps the full form just before the point", () => {
      expect(
        getNextHeaderForm({ current: "full", distance: 47.9, ...heights })
      ).toBe("full");
    });
  });

  describe("full point", () => {
    it("returns to the full form below 1px", () => {
      expect(
        getNextHeaderForm({ current: "collapsed", distance: 0.9, ...heights })
      ).toBe("full");
      expect(
        getNextHeaderForm({ current: "collapsed", distance: 0, ...heights })
      ).toBe("full");
    });

    it("keeps the collapsed form at exactly 1px", () => {
      expect(
        getNextHeaderForm({ current: "collapsed", distance: 1, ...heights })
      ).toBe("collapsed");
    });
  });

  describe("between the two points", () => {
    it.each([1, 10, 40, 47])("keeps the full form at %ipx", (distance) => {
      expect(getNextHeaderForm({ current: "full", distance, ...heights })).toBe(
        "full"
      );
    });

    it.each([1, 10, 40, 47])("keeps the collapsed form at %ipx", (distance) => {
      expect(
        getNextHeaderForm({ current: "collapsed", distance, ...heights })
      ).toBe("collapsed");
    });

    it("keeps the collapsed form while scrolling up within the range", () => {
      let form = getNextHeaderForm({
        current: "full",
        distance: 200,
        ...heights,
      });
      expect(form).toBe("collapsed");
      for (const distance of [150, 80, 47, 20, 5, 1]) {
        form = getNextHeaderForm({ current: form, distance, ...heights });
        expect(form).toBe("collapsed");
      }
      form = getNextHeaderForm({ current: form, distance: 0, ...heights });
      expect(form).toBe("full");
    });
  });

  describe("a header that gives back no space", () => {
    it("collapses at 8px when both forms have the same height", () => {
      expect(
        getNextHeaderForm({
          current: "full",
          distance: 8,
          fullHeight: 80,
          collapsedHeight: 80,
        })
      ).toBe("collapsed");
    });

    it("treats a taller collapsed form as giving back no space", () => {
      expect(
        getNextHeaderForm({
          current: "full",
          distance: 8,
          fullHeight: 80,
          collapsedHeight: 90,
        })
      ).toBe("collapsed");
    });
  });

  describe("missing or zero measurements", () => {
    it.each([
      ["distance", { distance: null, ...heights }],
      ["full height", { distance: 500, fullHeight: null, collapsedHeight: 80 }],
      [
        "collapsed height",
        { distance: 500, fullHeight: 120, collapsedHeight: null },
      ],
      ["NaN distance", { distance: Number.NaN, ...heights }],
    ])("returns the full form without a %s", (_, measurement) => {
      expect(getNextHeaderForm({ current: "collapsed", ...measurement })).toBe(
        "full"
      );
    });

    it("returns the full form when the header height is 0", () => {
      expect(
        getNextHeaderForm({
          current: "collapsed",
          distance: 500,
          fullHeight: 0,
          collapsedHeight: 0,
        })
      ).toBe("full");
    });

    it("returns the full form when the collapsed height is 0", () => {
      expect(
        getNextHeaderForm({
          current: "collapsed",
          distance: 500,
          fullHeight: 120,
          collapsedHeight: 0,
        })
      ).toBe("full");
    });
  });
});
