import { describe, it, expect } from "vitest";
import {
  computeScrollTopWithStacks,
  computeStickyLayout,
  computeStickyOffsets,
  computeStuckStacks,
  isRowStuck,
  type StickyBodyRow,
  type StickyRowLayout,
} from "./sticky-stacks.utils";

/**
 * A table with a 40px header and 20 body rows, each 50px high. Rows 2 and 15
 * are sticky. Positions are measured from the top of the scrollable content, so
 * row 2 starts at 40 + 2 * 50 = 140 and row 15 at 40 + 15 * 50 = 790.
 */
const HEADER = 40;
const rows = (overrides: Record<number, Partial<StickyBodyRow>> = {}) =>
  Array.from({ length: 20 }, (_, index): StickyBodyRow => {
    return {
      height: 50,
      isSticky: index === 2 || index === 15,
      ...overrides[index],
    };
  });

const layouts = (): StickyRowLayout[] =>
  computeStickyLayout({ tableTop: 0, headerHeight: HEADER, rows: rows() });

describe("computeStickyLayout", () => {
  it("returns the natural top and height of the sticky rows only", () => {
    expect(layouts()).toEqual([
      { rowIndex: 2, naturalTop: 140, height: 50 },
      { rowIndex: 15, naturalTop: 790, height: 50 },
    ]);
  });

  it("counts rows that are not sticky, such as nested panels", () => {
    // header 40, a row (50), its nested panel (30), then a sticky row.
    const result = computeStickyLayout({
      tableTop: 0,
      headerHeight: HEADER,
      rows: [
        { height: 50, isSticky: false },
        { height: 30, isSticky: false },
        { height: 50, isSticky: true },
      ],
    });
    expect(result).toEqual([{ rowIndex: 2, naturalTop: 120, height: 50 }]);
  });

  it("starts at the top of the table, not of the scrollable content", () => {
    const result = computeStickyLayout({
      tableTop: 10,
      headerHeight: HEADER,
      rows: [{ height: 50, isSticky: true }],
    });
    expect(result).toEqual([{ rowIndex: 0, naturalTop: 50, height: 50 }]);
  });

  it("keeps fractional heights", () => {
    const result = computeStickyLayout({
      tableTop: 0,
      headerHeight: 40.5,
      rows: [
        { height: 40.40625, isSticky: false },
        { height: 40.40625, isSticky: true },
      ],
    });
    expect(result[0].naturalTop).toBeCloseTo(80.90625, 5);
    expect(result[0].height).toBe(40.40625);
  });

  it("follows a changed row order with the same heights", () => {
    const moved = computeStickyLayout({
      tableTop: 0,
      headerHeight: HEADER,
      rows: rows({ 2: { isSticky: false }, 3: { isSticky: true } }),
    });
    expect(moved.map((l) => l.rowIndex)).toEqual([3, 15]);
    expect(moved[0].naturalTop).toBe(190);
  });

  it("returns nothing when no row is sticky", () => {
    expect(
      computeStickyLayout({
        tableTop: 0,
        headerHeight: HEADER,
        rows: [{ height: 50, isSticky: false }],
      })
    ).toEqual([]);
  });
});

describe("computeStickyOffsets", () => {
  it("stacks `top` below the header and `bottom` above the end", () => {
    expect(
      computeStickyOffsets({ headerHeight: HEADER, layouts: layouts() })
    ).toEqual([
      { top: 40, bottom: 50 },
      { top: 90, bottom: 0 },
    ]);
  });

  it("gives one sticky row the header height and no bottom offset", () => {
    expect(
      computeStickyOffsets({
        headerHeight: HEADER,
        layouts: [{ rowIndex: 4, naturalTop: 240, height: 50 }],
      })
    ).toEqual([{ top: 40, bottom: 0 }]);
  });

  it("changes when the header height changes", () => {
    expect(
      computeStickyOffsets({ headerHeight: 64, layouts: layouts() })[0].top
    ).toBe(64);
  });

  it("adds fractional heights without rounding", () => {
    const result = computeStickyOffsets({
      headerHeight: 40.5,
      layouts: [
        { rowIndex: 0, naturalTop: 40.5, height: 40.40625 },
        { rowIndex: 1, naturalTop: 80.90625, height: 40.40625 },
      ],
    });
    expect(result[1].top).toBeCloseTo(80.90625, 5);
    expect(result[0].bottom).toBe(40.40625);
  });

  it("returns an empty list for no sticky rows", () => {
    expect(computeStickyOffsets({ headerHeight: HEADER, layouts: [] })).toEqual(
      []
    );
  });
});

describe("computeStuckStacks", () => {
  /** A scroll area 300px high. */
  const stacks = (scrollTop: number, header = HEADER) =>
    computeStuckStacks({
      headerHeight: header,
      layouts: layouts(),
      scrollTop,
      viewportHeight: 300,
    });

  it("stacks a row below the viewport at the bottom, and ignores one in place", () => {
    // Row 2 (140..190) is inside 0..300 under the header: in place.
    // Row 15 (790..840) is below the viewport: stuck at the bottom.
    expect(stacks(0)).toEqual({
      top: 0,
      bottom: 50,
      topCount: 0,
      bottomCount: 1,
    });
  });

  it("stacks a row above the viewport at the top", () => {
    // Viewport 200..500: row 2 is above, row 15 is below.
    expect(stacks(200)).toEqual({
      top: 50,
      bottom: 50,
      topCount: 1,
      bottomCount: 1,
    });
  });

  it("counts a row that is in place in the visible area as not stuck", () => {
    // Viewport 600..900 shows row 15 (790..840) in its own place.
    expect(stacks(600)).toEqual({
      top: 50,
      bottom: 0,
      topCount: 1,
      bottomCount: 0,
    });
  });

  it("counts a row that touches the stack above it as stuck", () => {
    // At 699 the natural top of row 15 (790) is below the stack edge (699 + 40
    // + 50 = 789): in place.
    expect(stacks(699).topCount).toBe(1);
    // At 700 it touches the edge. In place and stuck look the same there, and
    // counting it keeps the answer stable.
    expect(stacks(700)).toEqual({
      top: 100,
      bottom: 0,
      topCount: 2,
      bottomCount: 0,
    });
  });

  it("does not count the same row at the top and at the bottom", () => {
    const one: StickyRowLayout[] = [
      { rowIndex: 3, naturalTop: 190, height: 50 },
    ];
    // Scrolled far past it: top only.
    expect(
      computeStuckStacks({
        headerHeight: HEADER,
        layouts: one,
        scrollTop: 600,
        viewportHeight: 300,
      })
    ).toEqual({ top: 50, bottom: 0, topCount: 1, bottomCount: 0 });
  });

  it("uses the header height to decide what is stuck at the top", () => {
    // Row 2 starts at 140. With a 40px header it is stuck when scrollTop > 100.
    expect(stacks(101).topCount).toBe(1);
    // With a 64px header it is stuck from scrollTop > 76.
    expect(stacks(80, 64).topCount).toBe(1);
    expect(stacks(80, 40).topCount).toBe(0);
  });

  it("returns zeros when there are no sticky rows", () => {
    expect(
      computeStuckStacks({
        headerHeight: HEADER,
        layouts: [],
        scrollTop: 500,
        viewportHeight: 300,
      })
    ).toEqual({ top: 0, bottom: 0, topCount: 0, bottomCount: 0 });
  });

  it("works with fractional heights", () => {
    const fractional: StickyRowLayout[] = [
      { rowIndex: 0, naturalTop: 40.5, height: 40.40625 },
      { rowIndex: 1, naturalTop: 80.90625, height: 40.40625 },
    ];
    const result = computeStuckStacks({
      headerHeight: 40.5,
      layouts: fractional,
      scrollTop: 500,
      viewportHeight: 300,
    });
    expect(result.topCount).toBe(2);
    expect(result.top).toBeCloseTo(80.8125, 5);
  });
});

describe("computeScrollTopWithStacks", () => {
  // The table of the cases above: header 40, rows 50 high, sticky rows 2 and 15,
  // a 300px scroll area, 40 + 20 * 50 = 1040px of content.
  const input = {
    viewportHeight: 300,
    scrollHeight: 1040,
    headerInset: HEADER,
  };

  it("counts a sticky row that is in place now and stuck at the destination", () => {
    // Row 10 starts at 540. At scrollTop 0 only row 15 is stuck (at the bottom),
    // so a first guess puts row 10 at 500. At 500 row 2 is stuck at the top too,
    // so row 10 has to go to 540 - (40 + 50) = 450 to sit below it.
    expect(
      computeScrollTopWithStacks({
        ...input,
        layouts: layouts(),
        rowTop: 540,
        rowHeight: 50,
        scrollTop: 0,
        align: "start",
      })
    ).toBe(450);
  });

  it("does not count a sticky row that is not stuck at the destination", () => {
    // Row 3 (190..240) is visible at scrollTop 0: above the bottom stack (250).
    expect(
      computeScrollTopWithStacks({
        ...input,
        layouts: layouts(),
        rowTop: 190,
        rowHeight: 50,
        scrollTop: 0,
        align: "nearest",
      })
    ).toBeNull();
  });

  it("settles on one answer for a row right below a sticky row", () => {
    // Row 3 (190..240) lies directly below sticky row 2 (140..190). Aligned at
    // the start it goes to 190 - (40 + 50) = 100, which puts row 2 exactly at its
    // stuck position. In place and stuck look the same there, and the answer
    // must not flip between the two on every pass.
    const result = computeScrollTopWithStacks({
      ...input,
      layouts: layouts(),
      rowTop: 190,
      rowHeight: 50,
      scrollTop: 0,
      align: "start",
    });
    expect(result).toBe(100);
    expect(
      computeStuckStacks({
        headerHeight: HEADER,
        layouts: layouts(),
        scrollTop: result as number,
        viewportHeight: 300,
      }).top
    ).toBe(50);
  });

  it("finds the stable answer for a row between two sticky rows", () => {
    // Sticky rows at 140 and 240, and row 3 (190..240) between them. With no row
    // stuck, row 3 would go to 150, but both sticky rows count as stuck there.
    // With both stuck it would go to 50, where neither is. Only one stuck row
    // is stable: row 3 goes to 190 - (40 + 50) = 100, below the first sticky row.
    const between: StickyRowLayout[] = [
      { rowIndex: 2, naturalTop: 140, height: 50 },
      { rowIndex: 4, naturalTop: 240, height: 50 },
    ];
    const result = computeScrollTopWithStacks({
      ...input,
      layouts: between,
      rowTop: 190,
      rowHeight: 50,
      scrollTop: 0,
      align: "start",
    });
    expect(result).toBe(100);
    const stacks = computeStuckStacks({
      headerHeight: HEADER,
      layouts: between,
      scrollTop: 100,
      viewportHeight: 300,
    });
    expect(stacks.topCount).toBe(1);
  });

  it("matches computeTargetScrollTop when no row is sticky", () => {
    expect(
      computeScrollTopWithStacks({
        ...input,
        layouts: [],
        rowTop: 540,
        rowHeight: 50,
        scrollTop: 0,
        align: "start",
      })
    ).toBe(500);
  });

  it("settles after at most three passes", () => {
    // Whatever the layout, the result is a number inside the scroll range.
    const result = computeScrollTopWithStacks({
      ...input,
      layouts: layouts(),
      rowTop: 940,
      rowHeight: 50,
      scrollTop: 0,
      align: "end",
    });
    expect(result).not.toBeNull();
    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThanOrEqual(740);
  });
});

describe("isRowStuck", () => {
  it("is true for rows in the top or the bottom stack, false for rows in place", () => {
    const all = layouts();
    // scrollTop 200: row 2 is stuck at the top, row 15 at the bottom.
    const stuck = computeStuckStacks({
      headerHeight: HEADER,
      layouts: all,
      scrollTop: 200,
      viewportHeight: 300,
    });
    expect(isRowStuck(2, all, stuck)).toBe(true);
    expect(isRowStuck(15, all, stuck)).toBe(true);
    // A row that is not sticky is never stuck.
    expect(isRowStuck(7, all, stuck)).toBe(false);
    // scrollTop 600: row 15 is in its own place.
    const later = computeStuckStacks({
      headerHeight: HEADER,
      layouts: all,
      scrollTop: 600,
      viewportHeight: 300,
    });
    expect(isRowStuck(15, all, later)).toBe(false);
  });
});
