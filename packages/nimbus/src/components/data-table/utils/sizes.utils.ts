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
 * Horizontal cell padding per size, as spacing token and its px value.
 * `sm`, `md` and `lg` match `table.recipe.ts`. The recipe uses the token; the
 * px value drives the internal column widths below.
 */
export const DATA_TABLE_CELL_PADDING_X: Record<
  DataTableSize,
  { token: string; px: number }
> = {
  sm: { token: "200", px: 8 },
  md: { token: "300", px: 12 },
  lg: { token: "400", px: 16 },
  xl: { token: "600", px: 24 },
};

/**
 * Widths in px of the internal columns per size — the single source for both
 * the React Aria column widths (numbers, `data-table.header.tsx`) and the
 * sticky offsets (CSS variables, `data-table.recipe.ts`).
 *
 * - `padded`: selection, pin, and expand without a selection column —
 *   control plus the size's horizontal cell padding on both sides
 * - `bare`: drag, and expand next to a selection column — control only
 */
export const DATA_TABLE_INTERNAL_COLUMN_WIDTHS = Object.fromEntries(
  (Object.keys(DATA_TABLE_CELL_PADDING_X) as DataTableSize[]).map((size) => [
    size,
    {
      padded: DATA_TABLE_CONTROL_SIZE + 2 * DATA_TABLE_CELL_PADDING_X[size].px,
      bare: DATA_TABLE_CONTROL_SIZE,
    },
  ])
) as Record<DataTableSize, { padded: number; bare: number }>;
