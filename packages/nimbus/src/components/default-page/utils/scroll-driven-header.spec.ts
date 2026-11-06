import { describe, it, expect } from "vitest";
import {
  getScrollDrivenHeaderState,
  planScrollDrivenHeader,
  type HeaderFormLayout,
} from "./scroll-driven-header";

const box = (left: number, top: number, width: number, height: number) => ({
  left,
  top,
  width,
  height,
  right: left + width,
});

/** Full form of a header with every part (one-line title), as in the stories. */
const full: HeaderFormLayout = {
  height: 178,
  title: { ...box(36, 70, 1360, 32), fontSize: 20, lineHeight: 32 },
  backLink: box(36, 32, 131, 22),
  backIcon: box(36, 36, 14, 14),
  actions: box(1425, 81, 256, 40),
  tabNav: box(36, 140, 1645, 37),
};

/** Collapsed form of the same header. */
const collapsed: HeaderFormLayout = {
  height: 102,
  title: { ...box(64, 21, 1333, 22), fontSize: 16, lineHeight: 22 },
  backLink: box(36, 20, 24, 24),
  backIcon: box(41, 25, 14, 14),
  actions: box(1425, 12, 256, 40),
  tabNav: box(36, 64, 1645, 37),
};

describe("planScrollDrivenHeader", () => {
  it("collapses over the height the header gives back", () => {
    const plan = planScrollDrivenHeader(full, collapsed);
    expect(plan.distance).toBe(76);
    expect(plan.pinnedHeight).toBe(102);
    expect(plan.extraRowHeight).toBe(0);
    expect(plan.titleScale).toBe(0.8);
  });

  it("grows the title row for a title with several lines", () => {
    // Three lines of 32px, scaled by 0.8: 76.8px, taller than the 40px row.
    const plan = planScrollDrivenHeader(
      {
        ...full,
        height: 242,
        title: { ...full.title!, height: 96 },
      },
      collapsed
    );
    expect(plan.extraRowHeight).toBeCloseTo(36.8, 5);
    // 102 + 36.8 = 138.8: the distance is rounded to whole pixels, and the
    // pinned height follows from it.
    expect(plan.distance).toBe(103);
    expect(plan.pinnedHeight).toBe(139);
  });

  it("keeps the icon in place when the back link gets its compact size", () => {
    // The 24px box is centered on the 14px icon: it starts 5px earlier.
    expect(planScrollDrivenHeader(full, collapsed).backIconInset).toBe(-5);
  });

  it("does not collapse when the collapsed form is not shorter", () => {
    const plan = planScrollDrivenHeader(
      { ...full, height: 90 },
      { ...collapsed, height: 102 }
    );
    expect(plan.distance).toBe(0);
  });

  it("works without a title or back link", () => {
    const plan = planScrollDrivenHeader({ height: 120 }, { height: 80 });
    expect(plan).toMatchObject({
      distance: 40,
      pinnedHeight: 80,
      titleScale: 1,
      extraRowHeight: 0,
      backIconInset: 0,
    });
  });
});

describe("getScrollDrivenHeaderState", () => {
  const none = { start: false, collapse: false, end: false };

  it("is full while the top edge of the header is in view", () => {
    expect(
      getScrollDrivenHeaderState(
        { start: true, collapse: true, end: false },
        "pinned"
      )
    ).toBe("full");
  });

  it("is full when the top edge is in view and the rest is cut off", () => {
    expect(getScrollDrivenHeaderState({ ...none, start: true }, "pinned")).toBe(
      "full"
    );
  });

  it("is collapsing while some of the collapse distance is in view", () => {
    expect(
      getScrollDrivenHeaderState(
        { start: false, collapse: true, end: true },
        "full"
      )
    ).toBe("collapsing");
  });

  it("is pinned once the collapse distance has scrolled out at the top", () => {
    expect(
      getScrollDrivenHeaderState({ ...none, end: true }, "collapsing")
    ).toBe("pinned");
  });

  it("keeps the state when no marker is in view", () => {
    expect(getScrollDrivenHeaderState(none, "pinned")).toBe("pinned");
    expect(getScrollDrivenHeaderState(none, "collapsing")).toBe("collapsing");
    expect(getScrollDrivenHeaderState(none, "full")).toBe("full");
  });
});
