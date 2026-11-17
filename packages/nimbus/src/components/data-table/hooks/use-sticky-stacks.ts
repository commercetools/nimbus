import { useEffect, type RefObject } from "react";
import type { DataTableRegistry } from "../utils/registry.types";
import {
  measureStickyLayout,
  STICKY_ROW_ATTRIBUTE,
  type StickyMeasurement,
} from "../utils/sticky-stacks.dom";
import {
  computeScrollTopWithStacks,
  computeStickyOffsets,
  computeStuckStacks,
  isRowStuck,
} from "../utils/sticky-stacks.utils";

const TOP_PROPERTY = "--data-table-sticky-top";
const BOTTOM_PROPERTY = "--data-table-sticky-bottom";
/**
 * Set on the last sticky row while rows are stuck at the bottom edge. The row's
 * bottom border is hidden then, because the border of the scroll area is
 * already the line there.
 */
const BOTTOM_EDGE_ATTRIBUTE = "data-sticky-bottom-edge";
/**
 * Set on the first row of the stack at the bottom edge while it is pushed up
 * from its own place. Its divider on top is the bottom border of the row above
 * it, which is not next to it then, so CSS draws the line on the row itself.
 */
const BOTTOM_START_ATTRIBUTE = "data-sticky-bottom-start";
/** A row closer than this to its own place counts as being in place. */
const IN_PLACE_TOLERANCE = 0.5;

type UseStickyStacksParams = {
  /** The element that scrolls. */
  rootRef: RefObject<HTMLDivElement | null>;
  registry: DataTableRegistry;
  /** Whether any row can stick: `stickyRows` is not empty and `maxHeight` is set. */
  isEnabled: boolean;
  /**
   * The ids of the sticky rows, and the rows on screen in display order. The
   * hook measures again when either changes, besides measuring after every size
   * and row change.
   */
  stickyRows: Set<string> | undefined;
  sortedRows: unknown[];
};

/**
 * Keeps sticky rows where they belong.
 *
 * It writes two things, always through the DOM and never through React state,
 * so nothing re-renders:
 *
 * - `--data-table-sticky-top` and `--data-table-sticky-bottom` on each sticky
 *   row. The row's styles read them for `top` and `bottom`.
 * - `scroll-padding-top` and `scroll-padding-bottom` on the root: the height
 *   the header and the rows that are stuck right now cover. React Aria reads
 *   them when it scrolls a focused row into view.
 *
 * The layout is measured after a size change, after a change of the rows or of
 * the `data-sticky-row` attribute, and when `stickyRows` or `sortedRows` change. While the
 * table scrolls, only the padding is computed again, from the measured layout.
 */
export const useStickyStacks = ({
  rootRef,
  registry,
  isEnabled,
  stickyRows,
  sortedRows,
}: UseStickyStacksParams) => {
  useEffect(() => {
    const root = rootRef.current;
    if (!root || !isEnabled) return;

    let measurement: StickyMeasurement | null = null;
    // Rows that have the custom properties, to clean up the ones that stop
    // being sticky.
    let styledRows = new Set<HTMLElement>();
    let animationFrame: number | undefined;
    // Development only: warn once per run of this effect, so a change of
    // `stickyRows` can warn again.
    let hasWarnedTall = false;

    const clearRow = (row: HTMLElement) => {
      row.style.removeProperty(TOP_PROPERTY);
      row.style.removeProperty(BOTTOM_PROPERTY);
      row.removeAttribute(BOTTOM_EDGE_ATTRIBUTE);
      row.removeAttribute(BOTTOM_START_ATTRIBUTE);
    };

    // The row that has the bottom edge attribute right now.
    let bottomEdgeRow: HTMLElement | undefined;
    const markBottomEdge = (row: HTMLElement | undefined) => {
      if (row === bottomEdgeRow) return;
      bottomEdgeRow?.removeAttribute(BOTTOM_EDGE_ATTRIBUTE);
      row?.setAttribute(BOTTOM_EDGE_ATTRIBUTE, "");
      bottomEdgeRow = row;
    };

    // The row that has the bottom start attribute right now.
    let bottomStartRow: HTMLElement | undefined;
    const markBottomStart = (row: HTMLElement | undefined) => {
      if (row === bottomStartRow) return;
      bottomStartRow?.removeAttribute(BOTTOM_START_ATTRIBUTE);
      row?.setAttribute(BOTTOM_START_ATTRIBUTE, "");
      bottomStartRow = row;
    };

    const applyPadding = () => {
      if (!measurement || measurement.layouts.length === 0) {
        root.style.removeProperty("scroll-padding-top");
        root.style.removeProperty("scroll-padding-bottom");
        markBottomEdge(undefined);
        markBottomStart(undefined);
        return;
      }
      const stacks = computeStuckStacks({
        headerHeight: measurement.headerInset,
        layouts: measurement.layouts,
        scrollTop: root.scrollTop,
        viewportHeight: root.clientHeight,
      });
      root.style.scrollPaddingTop = `${measurement.headerInset + stacks.top}px`;
      root.style.scrollPaddingBottom = `${stacks.bottom}px`;
      // The last sticky row is at the bottom edge when any row is stuck there.
      markBottomEdge(
        stacks.bottomCount > 0
          ? measurement.elements[measurement.elements.length - 1]
          : undefined
      );
      // The first row of the bottom stack, when it is pushed up from its place.
      const startIndex = measurement.layouts.length - stacks.bottomCount;
      const start = measurement.layouts[startIndex];
      const stackTop = root.scrollTop + root.clientHeight - stacks.bottom;
      markBottomStart(
        stacks.bottomCount > 0 &&
          start.naturalTop - stackTop > IN_PLACE_TOLERANCE
          ? measurement.elements[startIndex]
          : undefined
      );
    };

    // A size change: the header wraps, a row wraps, a column is resized, the
    // table size changes. `ResizeObserver` runs after layout and before paint.
    // `DataTable.Table` can mount after the root, so the targets are added on
    // every measure. Observing a target again does nothing.
    const resizeObserver = new ResizeObserver(() => measure());
    const observeTargets = () => {
      resizeObserver.observe(root);
      const table = root.querySelector("table");
      if (table) resizeObserver.observe(table);
      if (registry.headerElement) {
        resizeObserver.observe(registry.headerElement);
      }
    };

    const measure = () => {
      observeTargets();
      measurement = measureStickyLayout(root, registry.headerElement);
      const nextRows = new Set<HTMLElement>();
      if (measurement) {
        const offsets = computeStickyOffsets({
          headerHeight: measurement.headerInset,
          layouts: measurement.layouts,
        });
        measurement.elements.forEach((row, index) => {
          row.style.setProperty(TOP_PROPERTY, `${offsets[index].top}px`);
          row.style.setProperty(BOTTOM_PROPERTY, `${offsets[index].bottom}px`);
          nextRows.add(row);
        });
      }
      styledRows.forEach((row) => {
        if (!nextRows.has(row)) clearRow(row);
      });
      styledRows = nextRows;
      applyPadding();

      // All sticky rows in one stack would be the tallest stack. A stack above
      // half of the visible height leaves little room for the other rows.
      if (
        !hasWarnedTall &&
        measurement &&
        process.env.NODE_ENV !== "production"
      ) {
        const stackHeight = measurement.layouts.reduce(
          (sum, layout) => sum + layout.height,
          0
        );
        if (stackHeight > root.clientHeight / 2) {
          hasWarnedTall = true;
          console.warn(
            "[Nimbus] DataTable: the sticky rows are taller together than half of the visible height of the table, so they can cover most of the other rows. Make `maxHeight` taller, or use fewer sticky rows."
          );
        }
      }
    };

    const onScroll = () => {
      if (animationFrame !== undefined) return;
      animationFrame = requestAnimationFrame(() => {
        animationFrame = undefined;
        applyPadding();
      });
    };

    /**
     * Scrolls a focused row clear of the header and the stuck rows, if it is
     * covered. React Aria and the browser scroll a focused row into view, but
     * only with the padding of the position before the scroll. A stack that
     * appears because of that scroll is not in it, and the row can end up behind
     * it.
     */
    const keepRowClear = (row: HTMLTableRowElement, focused: HTMLElement) => {
      if (!row.isConnected) return;
      const current = measureStickyLayout(root, registry.headerElement);
      const body = root.querySelector("table")?.tBodies[0];
      if (!current || !body) return;
      const rowIndex = Array.from(body.rows).indexOf(row);
      if (rowIndex === -1) return;

      const stacks = computeStuckStacks({
        headerHeight: current.headerInset,
        layouts: current.layouts,
        scrollTop: root.scrollTop,
        viewportHeight: root.clientHeight,
      });
      // A stuck row is part of a stack. It is in view and is never moved.
      if (isRowStuck(rowIndex, current.layouts, stacks)) return;

      const viewTop = root.getBoundingClientRect().top + root.clientTop;
      const coveredTop = viewTop + current.headerInset + stacks.top;
      const coveredBottom = viewTop + root.clientHeight - stacks.bottom;
      // A row taller than the space between the stacks, such as an expanded
      // panel, can never be fully in view. Keep the focused control clear then:
      // moving to the top of the row would scroll the control out of view.
      const rowRect = row.getBoundingClientRect();
      const oversized = rowRect.height > coveredBottom - coveredTop;
      const rect = oversized ? focused.getBoundingClientRect() : rowRect;
      if (rect.top >= coveredTop - 0.5 && rect.bottom <= coveredBottom + 0.5) {
        return;
      }

      const layout = current.layouts.find((item) => item.rowIndex === rowIndex);
      const target = computeScrollTopWithStacks({
        rowTop:
          !oversized && layout
            ? layout.naturalTop
            : rect.top - viewTop + root.scrollTop,
        rowHeight: rect.height,
        viewportHeight: root.clientHeight,
        scrollTop: root.scrollTop,
        scrollHeight: root.scrollHeight,
        headerInset: current.headerInset,
        layouts: current.layouts,
        align: "nearest",
      });
      if (target !== null) root.scrollTop = target;
    };

    // Only focus that came from the keyboard counts, and only a change of focus:
    // scrolling with the wheel or a click on a visible part of a row is never
    // pulled back. Two frames wait for React Aria's own scroll, which runs in
    // the next animation frame.
    let focusFrame: number | undefined;
    const onFocusIn = (event: FocusEvent) => {
      const target = event.target;
      if (
        !(target instanceof HTMLElement) ||
        !target.matches(":focus-visible")
      ) {
        return;
      }
      const row = target.closest("tr");
      if (!row) return;
      if (focusFrame !== undefined) cancelAnimationFrame(focusFrame);
      focusFrame = requestAnimationFrame(() => {
        focusFrame = requestAnimationFrame(() => {
          focusFrame = undefined;
          keepRowClear(row, target);
        });
      });
    };

    measure();

    root.addEventListener("scroll", onScroll, { passive: true });
    root.addEventListener("focusin", onFocusIn);

    // Rows come and go and move (sort, drag and drop, pinning, expanding), and a
    // row becomes sticky or stops being sticky, without any size changing. Only
    // changes to rows and tables count: cell content changes all the time.
    const isTableStructure = (node: Node) =>
      node instanceof HTMLTableRowElement ||
      node instanceof HTMLTableSectionElement ||
      node instanceof HTMLTableElement;
    const mutationObserver = new MutationObserver((records) => {
      const matters = records.some(
        (record) =>
          record.type === "attributes" ||
          Array.from(record.addedNodes).some(isTableStructure) ||
          Array.from(record.removedNodes).some(isTableStructure)
      );
      if (matters) measure();
    });
    mutationObserver.observe(root, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: [STICKY_ROW_ATTRIBUTE],
    });

    return () => {
      root.removeEventListener("scroll", onScroll);
      root.removeEventListener("focusin", onFocusIn);
      if (focusFrame !== undefined) cancelAnimationFrame(focusFrame);
      resizeObserver.disconnect();
      mutationObserver.disconnect();
      if (animationFrame !== undefined) cancelAnimationFrame(animationFrame);
      styledRows.forEach(clearRow);
      root.style.removeProperty("scroll-padding-top");
      root.style.removeProperty("scroll-padding-bottom");
    };
    // `stickyRows` and `sortedRows` are not read: a change of either only has to
    // measure again.
  }, [rootRef, registry, isEnabled, stickyRows, sortedRows]);
};
