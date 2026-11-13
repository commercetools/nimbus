import type { DataTableScrollToRowOptions } from "../data-table.types";

export type ComputeTargetScrollTopInput = {
  /** Distance from the top of the scrollable content to the top of the row. */
  rowTop: number;
  rowHeight: number;
  /** Height of the scroll container (`clientHeight`). */
  viewportHeight: number;
  /** Current `scrollTop` of the scroll container. */
  scrollTop: number;
  /** Height of the scrollable content (`scrollHeight`). */
  scrollHeight: number;
  /** Height at the top of the container that covers rows: the header. */
  topInset: number;
  /** Height at the bottom of the container that covers rows. */
  bottomInset: number;
  align?: DataTableScrollToRowOptions["align"];
};

/**
 * The `scrollTop` that puts a row where `align` asks, or `null` when `"nearest"`
 * finds the row already fully visible.
 *
 * The visible area for rows is the container minus `topInset` and
 * `bottomInset`. This is the only place that knows about insets. Today the top
 * inset is the header height and the bottom inset is 0.
 *
 * The result stays inside the scroll range, so the first and last rows stop at
 * the edges.
 */
export const computeTargetScrollTop = ({
  rowTop,
  rowHeight,
  viewportHeight,
  scrollTop,
  scrollHeight,
  topInset,
  bottomInset,
  align = "nearest",
}: ComputeTargetScrollTopInput): number | null => {
  const areaHeight = viewportHeight - topInset - bottomInset;
  const rowBottom = rowTop + rowHeight;

  const toStart = rowTop - topInset;
  const toEnd = rowBottom - (viewportHeight - bottomInset);
  const toCenter = rowTop + rowHeight / 2 - (topInset + areaHeight / 2);

  let target: number;
  switch (align) {
    case "start":
      target = toStart;
      break;
    case "end":
      target = toEnd;
      break;
    case "center":
      target = toCenter;
      break;
    case "nearest": {
      const areaTop = scrollTop + topInset;
      const areaBottom = scrollTop + viewportHeight - bottomInset;
      if (rowTop >= areaTop && rowBottom <= areaBottom) return null;
      // A row taller than the visible area shows its top.
      if (rowHeight > areaHeight || rowTop < areaTop) {
        target = toStart;
      } else {
        target = toEnd;
      }
      break;
    }
  }

  const maxScrollTop = Math.max(0, scrollHeight - viewportHeight);
  return Math.min(Math.max(target, 0), maxScrollTop);
};
