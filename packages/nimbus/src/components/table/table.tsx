import { Table as ChakraTable } from "@chakra-ui/react/table";
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
} from "./table.types";

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

const TableRoot = (props: TableRootProps) => {
  const { ref, ...restProps } = props;
  return <ChakraTable.Root ref={ref} {...restProps} />;
};
TableRoot.displayName = "Table.Root";

const TableCaption = (props: TableCaptionProps) => {
  const { ref, ...restProps } = props;
  return <ChakraTable.Caption ref={ref} {...restProps} />;
};
TableCaption.displayName = "Table.Caption";

const TableHeader = (props: TableHeaderProps) => {
  const { ref, ...restProps } = props;
  return <ChakraTable.Header ref={ref} {...restProps} />;
};
TableHeader.displayName = "Table.Header";

const TableBody = (props: TableBodyProps) => {
  const { ref, ...restProps } = props;
  return <ChakraTable.Body ref={ref} {...restProps} />;
};
TableBody.displayName = "Table.Body";

const TableFooter = (props: TableFooterProps) => {
  const { ref, ...restProps } = props;
  return <ChakraTable.Footer ref={ref} {...restProps} />;
};
TableFooter.displayName = "Table.Footer";

const TableRow = (props: TableRowProps) => {
  const { ref, ...restProps } = props;
  return <ChakraTable.Row ref={ref} {...restProps} />;
};
TableRow.displayName = "Table.Row";

const TableColumnHeader = (props: TableColumnHeaderProps) => {
  const { ref, ...restProps } = props;
  return <ChakraTable.ColumnHeader ref={ref} {...restProps} />;
};
TableColumnHeader.displayName = "Table.ColumnHeader";

const TableCell = (props: TableCellProps) => {
  const { ref, ...restProps } = props;
  return <ChakraTable.Cell ref={ref} {...restProps} />;
};
TableCell.displayName = "Table.Cell";

const TableScrollArea = (props: TableScrollAreaProps) => {
  const { ref, ...restProps } = props;
  return <ChakraTable.ScrollArea ref={ref} {...restProps} />;
};
TableScrollArea.displayName = "Table.ScrollArea";

/**
 * Export Table with all sub-components as a compound component
 */
export const Table = {
  Root: TableRoot,
  Caption: TableCaption,
  Header: TableHeader,
  Body: TableBody,
  Footer: TableFooter,
  Row: TableRow,
  ColumnHeader: TableColumnHeader,
  Cell: TableCell,
  ScrollArea: TableScrollArea,
};
