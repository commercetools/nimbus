import type { Selection } from "react-aria-components";
import type { DataTableRowItem } from "../data-table.types";

/**
 * Whether a row cannot start a drag. A row outside `draggableKeys` cannot,
 * and neither can a disabled row (`disabledKeys` or `isDisabled`), even when
 * `draggableKeys` lists it. Without `draggableKeys` this returns `false`, so
 * tables without it keep their behaviour.
 */
export function isRowDragDisabled({
  row,
  rowKey,
  draggableKeys,
  disabledKeys,
}: {
  row: DataTableRowItem;
  rowKey: string;
  draggableKeys?: Set<string>;
  disabledKeys?: Selection;
}): boolean {
  if (draggableKeys === undefined) return false;
  if (!draggableKeys.has(rowKey)) return true;
  if (row.isDisabled) return true;
  if (disabledKeys === "all") return true;
  return disabledKeys?.has(rowKey) ?? false;
}
