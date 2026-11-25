import { computeTargetScrollTop } from "./scroll-to-row.utils";
import type { DataTableScrollToRowOptions } from "../data-table.types";

/**
 * Pure functions behind sticky rows. They know nothing about the DOM: the
 * measuring code gives them heights and positions, and they say which rows are
 * stuck and where they stick.
 *
 * All positions are measured from the top of the scrollable content, in CSS
 * pixels, and may be fractional. Heights are border-box heights.
 */

/** A row of the table body, in DOM order, as the layout sees it. */
export type StickyBodyRow = {
  /** Border-box height. Nested panel rows and drop indicator rows count too. */
  height: number;
  isSticky: boolean;
};

/** Where a sticky row sits when nothing is stuck. */
export type StickyRowLayout = {
  /** Index of the row among all body rows. */
  rowIndex: number;
  /** Top of the row in its own place. */
  naturalTop: number;
  height: number;
};

/** The `top` and `bottom` a sticky row sticks at, from the scrollport edge. */
export type StickyOffsets = { top: number; bottom: number };

/** The rows that are stuck at each edge for one scroll position. */
export type StuckStacks = {
  /** Height of the stuck rows at the top, without the header. */
  top: number;
  /** Height of the stuck rows at the bottom. */
  bottom: number;
  topCount: number;
  bottomCount: number;
};

/**
 * The natural layout of the sticky rows: where each one sits in its own place.
 * Every body row takes space, so the heights of all rows are added up, not only
 * those of the sticky rows.
 *
 * @param tableTop - Top of the table, from the top of the scrollable content
 * @param headerHeight - Height of the header in the flow of the table
 * @param rows - All body rows, in DOM order
 */
export const computeStickyLayout = ({
  tableTop,
  headerHeight,
  rows,
}: {
  tableTop: number;
  headerHeight: number;
  rows: StickyBodyRow[];
}): StickyRowLayout[] => {
  const layouts: StickyRowLayout[] = [];
  let top = tableTop + headerHeight;
  rows.forEach((row, rowIndex) => {
    if (row.isSticky) {
      layouts.push({ rowIndex, naturalTop: top, height: row.height });
    }
    top += row.height;
  });
  return layouts;
};

/**
 * The offsets every sticky row sticks at. They only depend on the order and the
 * heights, so they are the same at every scroll position: `top` is the header
 * plus the sticky rows before the row, `bottom` is the sticky rows after it.
 * The browser applies whichever offset the row is scrolled past.
 *
 * @param headerHeight - Height the sticky header covers (0 if it is not sticky)
 */
export const computeStickyOffsets = ({
  headerHeight,
  layouts,
}: {
  headerHeight: number;
  layouts: StickyRowLayout[];
}): StickyOffsets[] => {
  const total = layouts.reduce((sum, layout) => sum + layout.height, 0);
  let before = 0;
  return layouts.map((layout) => {
    const offsets = {
      top: headerHeight + before,
      bottom: total - before - layout.height,
    };
    before += layout.height;
    return offsets;
  });
};

/**
 * A row whose natural position touches the edge of the stack above or below it
 * is counted as stuck: in place and stuck look the same there. Counting it makes
 * the answer stable. Without it, a row aligned right next to a sticky row flips
 * between the two answers on every pass of `computeScrollTopWithStacks`.
 */
const EDGE_TOLERANCE = 0.5;

/**
 * Which sticky rows are stuck for one scroll position, and how tall the stacks
 * are. A sticky row in its own place covers nothing and is not counted.
 *
 * A row is stuck at the top when its natural top is at or above the bottom edge
 * of the stack above it (which starts with the header). A row is stuck at the
 * bottom when its natural bottom is at or below the top edge of the stack below
 * it. A row is never counted at both edges.
 *
 * @param headerHeight - Height the sticky header covers (0 if it is not sticky)
 * @param scrollTop - Scroll position of the scroll container
 * @param viewportHeight - Height of the visible part of the scroll container
 */
export const computeStuckStacks = ({
  headerHeight,
  layouts,
  scrollTop,
  viewportHeight,
}: {
  headerHeight: number;
  layouts: StickyRowLayout[];
  scrollTop: number;
  viewportHeight: number;
}): StuckStacks => {
  let top = 0;
  let topCount = 0;
  for (const layout of layouts) {
    if (layout.naturalTop > scrollTop + headerHeight + top + EDGE_TOLERANCE) {
      break;
    }
    top += layout.height;
    topCount += 1;
  }

  let bottom = 0;
  let bottomCount = 0;
  for (let index = layouts.length - 1; index >= topCount; index -= 1) {
    const layout = layouts[index];
    const naturalBottom = layout.naturalTop + layout.height;
    if (naturalBottom < scrollTop + viewportHeight - bottom - EDGE_TOLERANCE) {
      break;
    }
    bottom += layout.height;
    bottomCount += 1;
  }

  return { top, bottom, topCount, bottomCount };
};

/**
 * Whether the row at `rowIndex` is part of a stuck stack for these stacks. A row
 * that is not sticky is never stuck.
 */
export const isRowStuck = (
  rowIndex: number,
  layouts: StickyRowLayout[],
  stacks: StuckStacks
): boolean => {
  const position = layouts.findIndex((layout) => layout.rowIndex === rowIndex);
  if (position === -1) return false;
  return (
    position < stacks.topCount ||
    position >= layouts.length - stacks.bottomCount
  );
};

/** How often the target and the stacks are worked out again. */
const MAX_PASSES = 3;

/**
 * The `scrollTop` that puts a row where `align` asks, or `null` when `"nearest"`
 * finds the row fully visible. Unlike `computeTargetScrollTop` alone, it knows
 * the stuck stacks of the destination.
 *
 * The stacks depend on the scroll position, and the position depends on the
 * stacks: a sticky row that is in place now becomes stuck once the table has
 * scrolled past it. So the target is worked out with the stacks of the current
 * position, the stacks are worked out again for that target, and so on until two
 * passes agree, at most three times.
 *
 * `rowTop` is the row's top in its own place. Pass the natural top for a sticky
 * row, which is not where it is while it is stuck.
 *
 * @param headerInset - Height the sticky header covers (0 if it is not sticky)
 */
export const computeScrollTopWithStacks = ({
  rowTop,
  rowHeight,
  viewportHeight,
  scrollTop,
  scrollHeight,
  headerInset,
  layouts,
  align,
}: {
  rowTop: number;
  rowHeight: number;
  viewportHeight: number;
  scrollTop: number;
  scrollHeight: number;
  headerInset: number;
  layouts: StickyRowLayout[];
  align?: DataTableScrollToRowOptions["align"];
}): number | null => {
  let stacks = computeStuckStacks({
    headerHeight: headerInset,
    layouts,
    scrollTop,
    viewportHeight,
  });
  let target: number | null = null;
  for (let pass = 0; pass < MAX_PASSES; pass += 1) {
    target = computeTargetScrollTop({
      rowTop,
      rowHeight,
      viewportHeight,
      scrollTop,
      scrollHeight,
      topInset: headerInset + stacks.top,
      bottomInset: stacks.bottom,
      align,
    });
    if (target === null) {
      // Visible with the stacks of the current position: nothing to do. In a
      // later pass the stacks are those of a position the table has not
      // reached, and the row can still be covered at the current one.
      if (pass === 0) return null;
      break;
    }
    const next = computeStuckStacks({
      headerHeight: headerInset,
      layouts,
      scrollTop: target,
      viewportHeight,
    });
    if (next.top === stacks.top && next.bottom === stacks.bottom) return target;
    stacks = next;
  }

  // The passes went round in a circle. That happens for a row between two sticky
  // rows: with the stack of one pass the row goes to a position where the stack
  // is taller, and with the taller stack it goes to a position where it is
  // shorter. The stack changes by whole rows and there are few of them, so look
  // for the combination of stuck rows that agrees with the position it gives.
  const heightOf = (from: number, count: number, fromEnd = false) => {
    const rows = fromEnd
      ? layouts.slice(layouts.length - count)
      : layouts.slice(from, from + count);
    return rows.reduce((sum, layout) => sum + layout.height, 0);
  };
  for (let topCount = 0; topCount <= layouts.length; topCount += 1) {
    for (
      let bottomCount = 0;
      topCount + bottomCount <= layouts.length;
      bottomCount += 1
    ) {
      const candidate = computeTargetScrollTop({
        rowTop,
        rowHeight,
        viewportHeight,
        scrollTop,
        scrollHeight,
        topInset: headerInset + heightOf(0, topCount),
        bottomInset: heightOf(0, bottomCount, true),
        align,
      });
      if (candidate === null) continue;
      const there = computeStuckStacks({
        headerHeight: headerInset,
        layouts,
        scrollTop: candidate,
        viewportHeight,
      });
      if (there.topCount === topCount && there.bottomCount === bottomCount) {
        return candidate;
      }
    }
  }
  return target;
};
