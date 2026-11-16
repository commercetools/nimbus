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
 * Which sticky rows are stuck for one scroll position, and how tall the stacks
 * are. A sticky row in its own place covers nothing and is not counted.
 *
 * A row is stuck at the top when its natural top is above the bottom edge of the
 * stack above it (which starts with the header). A row is stuck at the bottom
 * when its natural bottom is below the top edge of the stack below it. A row is
 * never counted at both edges.
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
    if (layout.naturalTop >= scrollTop + headerHeight + top) break;
    top += layout.height;
    topCount += 1;
  }

  let bottom = 0;
  let bottomCount = 0;
  for (let index = layouts.length - 1; index >= topCount; index -= 1) {
    const layout = layouts[index];
    const naturalBottom = layout.naturalTop + layout.height;
    if (naturalBottom <= scrollTop + viewportHeight - bottom) break;
    bottom += layout.height;
    bottomCount += 1;
  }

  return { top, bottom, topCount, bottomCount };
};
