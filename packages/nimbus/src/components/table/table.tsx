import {
  TableRootSlot,
  TableCaptionSlot,
  TableHeaderSlot,
  TableBodySlot,
  TableFooterSlot,
  TableRowSlot,
  TableColumnHeaderSlot,
  TableCellSlot,
} from "./table.slots";
import type {
  TableRootProps,
  TableCaptionProps,
  TableHeaderProps,
  TableBodyProps,
  TableFooterProps,
  TableRowProps,
  TableColumnHeaderProps,
  TableCellProps,
  TableScrollAreaProps,
  TableColumnGroupProps,
  TableColumnProps,
} from "./table.types";
import { Table as ChakraTable } from "@chakra-ui/react";
import { useSlotRecipe } from "@chakra-ui/react/styled-system";
import { extractStyleProps } from "@/utils";

/**
 * # Table
 *
 * Component for displaying tabular data.
 *
 * Built on top of Chakra UI's Table component with Nimbus theming.
 *
 * @supportsStyleProps
 *
 * @see {@link https://nimbus-documentation.vercel.app/components/data-display/table}
 *
 * @example
 * ```tsx
 * <Table.Root>
 *   <Table.Header>
 *     <Table.Row>
 *       <Table.ColumnHeader>Name</Table.ColumnHeader>
 *     </Table.Row>
 *   </Table.Header>
 *   <Table.Body>
 *     <Table.Row>
 *       <Table.Cell>John</Table.Cell>
 *     </Table.Row>
 *   </Table.Body>
 * </Table.Root>
 * ```
 */

/**
 * Table.Root
 *
 * The root table container that provides context for all table slots.
 *
 * @supportsStyleProps
 */
export const TableRoot = (props: TableRootProps) => {
  const { ref, ...restProps } = props;
  const recipe = useSlotRecipe({ key: "nimbusTable" });
  const [recipeProps, restRecipeProps] = recipe.splitVariantProps(restProps);
  const [styleProps, htmlProps] = extractStyleProps(restRecipeProps);

  return (
    <TableRootSlot ref={ref} {...recipeProps} {...styleProps} {...htmlProps} />
  );
};
TableRoot.displayName = "Table.Root";

export const TableCaption = (props: TableCaptionProps) => {
  return <TableCaptionSlot {...props} />;
};
TableCaption.displayName = "Table.Caption";

export const TableHeader = (props: TableHeaderProps) => {
  return <TableHeaderSlot {...props} />;
};
TableHeader.displayName = "Table.Header";

export const TableBody = (props: TableBodyProps) => {
  return <TableBodySlot {...props} />;
};
TableBody.displayName = "Table.Body";

export const TableFooter = (props: TableFooterProps) => {
  return <TableFooterSlot {...props} />;
};
TableFooter.displayName = "Table.Footer";

export const TableRow = (props: TableRowProps) => {
  return <TableRowSlot {...props} />;
};
TableRow.displayName = "Table.Row";

export const TableColumnHeader = (props: TableColumnHeaderProps) => {
  return <TableColumnHeaderSlot {...props} />;
};
TableColumnHeader.displayName = "Table.ColumnHeader";

export const TableCell = (props: TableCellProps) => {
  return <TableCellSlot {...props} />;
};
TableCell.displayName = "Table.Cell";

export const TableScrollArea = (props: TableScrollAreaProps) => {
  const { ref, ...restProps } = props;
  return <ChakraTable.ScrollArea ref={ref} {...restProps} />;
};
TableScrollArea.displayName = "Table.ScrollArea";

export const TableColumnGroup = (props: TableColumnGroupProps) => {
  const { ref, ...restProps } = props;
  return <ChakraTable.ColumnGroup ref={ref} {...restProps} />;
};
TableColumnGroup.displayName = "Table.ColumnGroup";

export const TableColumn = (props: TableColumnProps) => {
  const { ref, ...restProps } = props;
  return <ChakraTable.Column ref={ref} {...restProps} />;
};
TableColumn.displayName = "Table.Column";

/**
 * Export Table with all sub-components as a compound component
 */
export const Table: {
  Root: typeof TableRoot;
  Caption: typeof TableCaption;
  Header: typeof TableHeader;
  Body: typeof TableBody;
  Footer: typeof TableFooter;
  Row: typeof TableRow;
  ColumnHeader: typeof TableColumnHeader;
  Cell: typeof TableCell;
  ScrollArea: typeof TableScrollArea;
  ColumnGroup: typeof TableColumnGroup;
  Column: typeof TableColumn;
} = {
  Root: TableRoot,
  Caption: TableCaption,
  Header: TableHeader,
  Body: TableBody,
  Footer: TableFooter,
  Row: TableRow,
  ColumnHeader: TableColumnHeader,
  Cell: TableCell,
  ScrollArea: TableScrollArea,
  ColumnGroup: TableColumnGroup,
  Column: TableColumn,
};

export type {
  TableRootProps,
  TableCaptionProps,
  TableHeaderProps,
  TableBodyProps,
  TableFooterProps,
  TableRowProps,
  TableColumnHeaderProps,
  TableCellProps,
  TableScrollAreaProps,
  TableColumnGroupProps,
  TableColumnProps,
};
