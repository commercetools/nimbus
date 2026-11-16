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

    const clearRow = (row: HTMLElement) => {
      row.style.removeProperty(TOP_PROPERTY);
      row.style.removeProperty(BOTTOM_PROPERTY);
    };

    const applyPadding = () => {
      if (!measurement || measurement.layouts.length === 0) {
        root.style.removeProperty("scroll-padding-top");
        root.style.removeProperty("scroll-padding-bottom");
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
    const keepRowClear = (row: HTMLTableRowElement) => {
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
      const rect = row.getBoundingClientRect();
      const coveredTop = viewTop + current.headerInset + stacks.top;
      const coveredBottom = viewTop + root.clientHeight - stacks.bottom;
      if (rect.top >= coveredTop - 0.5 && rect.bottom <= coveredBottom + 0.5) {
        return;
      }

      const layout = current.layouts.find((item) => item.rowIndex === rowIndex);
      const target = computeScrollTopWithStacks({
        rowTop: layout?.naturalTop ?? rect.top - viewTop + root.scrollTop,
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
          keepRowClear(row);
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
