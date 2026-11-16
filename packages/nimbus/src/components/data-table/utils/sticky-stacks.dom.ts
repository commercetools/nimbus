import {
  computeStickyLayout,
  type StickyRowLayout,
} from "./sticky-stacks.utils";

/** What the DOM says about the sticky rows right now. */
export type StickyMeasurement = {
  layouts: StickyRowLayout[];
  /** The sticky row elements, in the same order as `layouts`. */
  elements: HTMLElement[];
  /** The height the sticky header covers: 0 when the header is not sticky. */
  headerInset: number;
};

/** The attribute `DataTable.Row` sets on a sticky row. */
export const STICKY_ROW_ATTRIBUTE = "data-sticky-row";

/**
 * Reads the layout of the sticky rows from the DOM, with fractional border-box
 * heights. It is live: nothing is cached, so a call right after the rows or
 * `stickyRows` changed sees the new state.
 *
 * Every row of the body counts for the natural position of a sticky row,
 * including nested panel rows and drop indicator rows, because they take space.
 *
 * @param root - The element that scrolls
 * @param header - The header element, if the table has one
 * @returns `null` when the table has no body to measure
 */
export const measureStickyLayout = (
  root: HTMLElement,
  header: HTMLElement | null
): StickyMeasurement | null => {
  const table = root.querySelector("table");
  const body = table?.tBodies[0];
  if (!table || !body) return null;

  const rootRect = root.getBoundingClientRect();
  const tableTop =
    table.getBoundingClientRect().top -
    rootRect.top -
    root.clientTop +
    root.scrollTop;

  const headerHeight = header ? header.getBoundingClientRect().height : 0;
  const isHeaderSticky =
    !!header && window.getComputedStyle(header).position === "sticky";

  const bodyRows = Array.from(body.rows);
  const layouts = computeStickyLayout({
    tableTop,
    headerHeight,
    rows: bodyRows.map((row) => ({
      height: row.getBoundingClientRect().height,
      isSticky: row.hasAttribute(STICKY_ROW_ATTRIBUTE),
    })),
  });

  return {
    layouts,
    elements: layouts.map((layout) => bodyRows[layout.rowIndex]),
    headerInset: isHeaderSticky ? headerHeight : 0,
  };
};
