import type { DataTableSize } from "../data-table.types";

/**
 * Size used when the consumer does not pass `size`. `xl` reproduces the
 * appearance from before the `size` prop existed and is deprecated for
 * explicit use.
 */
export const DATA_TABLE_DEFAULT_SIZE: DataTableSize = "xl";

/**
 * Edge length in px of the interactive controls in the internal columns
 * (drag handle, checkbox, expand button, pin button). Kept at 24px for every
 * size: the WCAG 2.2 SC 2.5.8 minimum target size.
 */
export const DATA_TABLE_CONTROL_SIZE = 24;

/**
 * Horizontal cell padding in px per size: the px value of the size's
 * `--data-table-padding-x` in `data-table.recipe.ts`. Drives the internal
 * column widths below.
 */
export const DATA_TABLE_CELL_PADDING_X: Record<DataTableSize, number> = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
};

/**
 * Widths in px of the internal columns per size, passed to React Aria in
 * `data-table.header.tsx`. The recipe computes the same widths in CSS for
 * the sticky offsets (`--data-table-drag-column-width`,
 * `--data-table-selection-column-width`).
 *
 * - `padded`: selection, pin, and expand without a selection column —
 *   control plus the size's horizontal cell padding on both sides
 * - `bare`: drag, and expand next to a selection column — control only
 */
export const DATA_TABLE_INTERNAL_COLUMN_WIDTHS = Object.fromEntries(
  (Object.keys(DATA_TABLE_CELL_PADDING_X) as DataTableSize[]).map((size) => [
    size,
    {
      padded: DATA_TABLE_CONTROL_SIZE + 2 * DATA_TABLE_CELL_PADDING_X[size],
      bare: DATA_TABLE_CONTROL_SIZE,
    },
  ])
) as Record<DataTableSize, { padded: number; bare: number }>;
