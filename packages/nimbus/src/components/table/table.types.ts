import type { Table as ChakraTableType } from "@chakra-ui/react/table";

/**
 * Props for the Table.Root component
 *
 * The root table container that wraps all table parts.
 */
export type TableRootProps = React.ComponentPropsWithoutRef<
  typeof ChakraTableType.Root
> & {
  /**
   * Ref forwarding to the table element
   */
  ref?: React.Ref<HTMLTableElement>;
};

/**
 * Props for the Table.Caption component
 *
 * Optional caption/title for the table.
 */
export type TableCaptionProps = React.ComponentPropsWithoutRef<
  typeof ChakraTableType.Caption
> & {
  /**
   * Ref forwarding to the caption element
   */
  ref?: React.Ref<HTMLTableCaptionElement>;
};

/**
 * Props for the Table.Header component
 *
 * The table header section (thead element).
 */
export type TableHeaderProps = React.ComponentPropsWithoutRef<
  typeof ChakraTableType.Header
> & {
  /**
   * Ref forwarding to the thead element
   */
  ref?: React.Ref<HTMLTableSectionElement>;
};

/**
 * Props for the Table.Body component
 *
 * The table body section (tbody element).
 */
export type TableBodyProps = React.ComponentPropsWithoutRef<
  typeof ChakraTableType.Body
> & {
  /**
   * Ref forwarding to the tbody element
   */
  ref?: React.Ref<HTMLTableSectionElement>;
};

/**
 * Props for the Table.Footer component
 *
 * The table footer section (tfoot element).
 */
export type TableFooterProps = React.ComponentPropsWithoutRef<
  typeof ChakraTableType.Footer
> & {
  /**
   * Ref forwarding to the tfoot element
   */
  ref?: React.Ref<HTMLTableSectionElement>;
};

/**
 * Props for the Table.Row component
 *
 * Individual table row (tr element).
 */
export type TableRowProps = React.ComponentPropsWithoutRef<
  typeof ChakraTableType.Row
> & {
  /**
   * Ref forwarding to the tr element
   */
  ref?: React.Ref<HTMLTableRowElement>;
};

/**
 * Props for the Table.ColumnHeader component
 *
 * Header cell (th element) used in header rows.
 */
export type TableColumnHeaderProps = React.ComponentPropsWithoutRef<
  typeof ChakraTableType.ColumnHeader
> & {
  /**
   * Ref forwarding to the th element
   */
  ref?: React.Ref<HTMLTableCellElement>;
};

/**
 * Props for the Table.Cell component
 *
 * Data cell (td element) used in body and footer rows.
 */
export type TableCellProps = React.ComponentPropsWithoutRef<
  typeof ChakraTableType.Cell
> & {
  /**
   * Ref forwarding to the td element
   */
  ref?: React.Ref<HTMLTableCellElement>;
};

/**
 * Props for the Table.ScrollArea component
 *
 * Wrapper for tables with scrolling behavior.
 */
export type TableScrollAreaProps = React.ComponentPropsWithoutRef<
  typeof ChakraTableType.ScrollArea
> & {
  /**
   * Ref forwarding to the div element
   */
  ref?: React.Ref<HTMLDivElement>;
};
