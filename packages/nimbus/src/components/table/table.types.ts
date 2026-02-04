import type { HTMLChakraProps, SlotRecipeProps } from "@chakra-ui/react";

// ============================================================
// RECIPE PROPS
// ============================================================

export type TableRecipeProps = SlotRecipeProps<"nimbusTable">;

// ============================================================
// SLOT PROPS
// ============================================================

/**
 * Props for the Table.Root component
 *
 * The root table container that wraps all table parts.
 */
export type TableRootProps = HTMLChakraProps<"table", TableRecipeProps> & {
  ref?: React.Ref<HTMLTableElement>;
};

/**
 * Props for the Table.Caption component
 *
 * Optional caption/title for the table.
 */
export type TableCaptionProps = HTMLChakraProps<"caption">;

/**
 * Props for the Table.Header component
 *
 * The table header section (thead element).
 */
export type TableHeaderProps = HTMLChakraProps<"thead">;

/**
 * Props for the Table.Body component
 *
 * The table body section (tbody element).
 */
export type TableBodyProps = HTMLChakraProps<"tbody">;

/**
 * Props for the Table.Footer component
 *
 * The table footer section (tfoot element).
 */
export type TableFooterProps = HTMLChakraProps<"tfoot">;

/**
 * Props for the Table.Row component
 *
 * Individual table row (tr element).
 */
export type TableRowProps = HTMLChakraProps<"tr">;

/**
 * Props for the Table.ColumnHeader component
 *
 * Header cell (th element) used in header rows.
 */
export type TableColumnHeaderProps = HTMLChakraProps<"th">;

/**
 * Props for the Table.Cell component
 *
 * Data cell (td element) used in body and footer rows.
 */
export type TableCellProps = HTMLChakraProps<"td">;

/**
 * Props for the Table.ScrollArea component
 *
 * Wrapper for tables with scrolling behavior.
 */
export type TableScrollAreaProps = HTMLChakraProps<"div"> & {
  ref?: React.Ref<HTMLDivElement>;
};

/**
 * Props for the Table.ColumnGroup component
 *
 * Column group container (colgroup element) for defining column widths.
 */
export type TableColumnGroupProps = HTMLChakraProps<"colgroup"> & {
  ref?: React.Ref<HTMLTableColElement>;
};

/**
 * Props for the Table.Column component
 *
 * Column definition (col element) for setting individual column properties.
 * The primary prop for this component is `htmlWidth` which sets the width attribute.
 */
export type TableColumnProps = HTMLChakraProps<"col"> & {
  ref?: React.Ref<HTMLTableColElement>;
};
