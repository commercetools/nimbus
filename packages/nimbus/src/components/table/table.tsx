import { Table } from "@chakra-ui/react";

// Extracting props types from subcomponents
export type TableRootProps = React.ComponentProps<typeof Table.Root>;
export type TableColumnGroupProps = React.ComponentProps<
  typeof Table.ColumnGroup
>;
export type TableColumnProps = React.ComponentProps<typeof Table.Column>;
export type TableHeaderProps = React.ComponentProps<typeof Table.Header>;
export type TableFooterProps = React.ComponentProps<typeof Table.Footer>;
export type TableRowProps = React.ComponentProps<typeof Table.Row>;
export type TableCellProps = React.ComponentProps<typeof Table.Cell>;
export type TableBodyProps = React.ComponentProps<typeof Table.Body>;
export type TableColumnHeaderProps = React.ComponentProps<
  typeof Table.ColumnHeader
>;

const TableRoot = (props: TableRootProps) => <Table.Root {...props} />;
const TableColumnGroup = (props: TableColumnGroupProps) => (
  <Table.ColumnGroup {...props} />
);
const TableColumn = (props: TableColumnProps) => <Table.Column {...props} />;
const TableHeader = (props: TableHeaderProps) => <Table.Header {...props} />;
const TableFooter = (props: TableFooterProps) => <Table.Footer {...props} />;
const TableRow = (props: TableRowProps) => <Table.Row {...props} />;
const TableCell = (props: TableCellProps) => <Table.Cell {...props} />;
const TableBody = (props: TableBodyProps) => <Table.Body {...props} />;
const TableColumnHeader = (props: TableColumnHeaderProps) => (
  <Table.ColumnHeader {...props} />
);

export {
  Table,
  TableRoot,
  TableColumnGroup,
  TableColumn,
  TableHeader,
  TableFooter,
  TableRow,
  TableCell,
  TableBody,
  TableColumnHeader,
};
