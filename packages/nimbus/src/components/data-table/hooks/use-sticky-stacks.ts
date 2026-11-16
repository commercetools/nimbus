import { useEffect, type RefObject } from "react";
import type { DataTableRegistry } from "../utils/registry.types";
import {
  measureStickyLayout,
  STICKY_ROW_ATTRIBUTE,
  type StickyMeasurement,
} from "../utils/sticky-stacks.dom";
import {
  computeStickyOffsets,
  computeStuckStacks,
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

    measure();

    root.addEventListener("scroll", onScroll, { passive: true });

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
