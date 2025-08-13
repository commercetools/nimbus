import { forwardRef, type Ref, useMemo, useState } from "react";
import {
  CheckboxGroup as RaCheckboxGroup,
  ResizableTableContainer as RaResizableTableContainer,
  Table as RaTable,
  type TableProps as RaTableProps,
  TableHeader as RaTableHeader,
  type TableHeaderProps as RaTableHeaderProps,
  Column as RaColumn,
  type ColumnProps as RaColumnProps,
  // ColumnResizer as RaColumnResizer,
  TableBody as RaTableBody,
  type TableBodyProps as RaTableBodyProps,
  Row as RaRow,
  type RowProps as RaRowProps,
  Cell as RaCell,
  type CellProps as RaCellProps,
  Collection as RaCollection,
  useTableOptions,
  type SortDescriptor as RaSortDesctiptor,
  ButtonContext as RaButtonContext,
  type Key as RaKey,
} from "react-aria-components";
import {
  ArrowDownward,
  ArrowUpward,
  DragIndicator,
} from "@commercetools/nimbus-icons";
import { Box, Button, Checkbox, Flex, Stack } from "@/components";

export type DataTableColumnItem = {
  name: string;
  id: string;
  isRowHeader?: boolean;
  allowsSorting?: boolean;
};
export type DataTableColumns = DataTableColumnItem[];
export type DataTableRowItem = {
  [key: string]: string | number | boolean;
};
export type DataTableRows = DataTableRowItem[];

export const DataTableExample = forwardRef<HTMLTableElement, RaTableProps>(
  function DataTableExample() {
    const [showColumns, setShowColumns] = useState(["name", "type", "level"]);
    const [sortDescriptor, setSortDescriptor] = useState<RaSortDesctiptor>({
      column: "name",
      direction: "ascending",
    });

    const columns: DataTableColumns = [
      { name: "Name", id: "name", isRowHeader: true, allowsSorting: true },
      { name: "Type", id: "type", allowsSorting: true },
      { name: "Level", id: "level", allowsSorting: true },
    ].filter((column) => showColumns.includes(column.id));

    const [rows, setRows] = useState<DataTableRows>([
      { id: 1, name: "Charizard", type: "Fire, Flying", level: "67" },
      { id: 2, name: "Blastoise", type: "Water", level: "56" },
      {
        id: 3,
        name: "Venusaur",
        type: "Grass, Poison",
        level: "83",
        isDisabled: true,
      },
      { id: 4, name: "Pikachu", type: "Electric", level: "100" },
    ]);

    // Sort rows based on current sort descriptor
    const sortedRows = useMemo(() => {
      if (!sortDescriptor.column) return rows;
      return sortRows(rows, sortDescriptor).items;
    }, [rows, sortDescriptor]);

    const addRow = () => {
      setRows((rows) => [
        ...rows,
        {
          id: rows.length + 1,
          name: `Venonat ${rows.length + 1}`,
          level: "23",
          type: "Bug, Poison",
        },
      ]);
    };
    const disabledRowIds = new Set(
      rows.filter((row) => row.isDisabled).map((row) => row.id)
    ) as Iterable<RaKey>;
    return (
      <Stack>
        <Flex alignItems="center" gap="200">
          <Flex asChild alignItems="center" gap="400">
            <RaCheckboxGroup
              aria-label="Show columns"
              value={showColumns}
              onChange={setShowColumns}
            >
              <Checkbox value="type">Show Type</Checkbox>
              <Checkbox value="level">Show Level</Checkbox>
            </RaCheckboxGroup>
          </Flex>
          <Button variant="ghost" onPress={addRow} aria-label="add row">
            Add Row
          </Button>
        </Flex>
        <Flex>
          <DataTableRoot
            columns={columns}
            rows={sortedRows}
            sortDescriptor={sortDescriptor}
            onSortChange={setSortDescriptor}
            disabledKeys={disabledRowIds}
            allowsSorting
          />
        </Flex>
      </Stack>
    );
  }
);

export interface DataTableRootProps<C extends object, R extends object>
  extends RaTableProps {
  columns: RaTableHeaderProps<C>["columns"];
  rows: RaTableBodyProps<R>["items"];
  allowsSorting?: boolean;
  sortDescriptor?: RaSortDesctiptor;
  onSortChange?: (sortDescriptor: RaSortDesctiptor) => void;
}

function sortRows<T extends Record<string, string | number | boolean>>(
  items: T[],
  sortDescriptor: RaSortDesctiptor
) {
  return {
    items: items.sort((a: T, b: T) => {
      const first = a[sortDescriptor.column as keyof T];
      const second = b[sortDescriptor.column as keyof T];

      // Convert to numbers if possible, otherwise use string comparison
      const firstVal =
        typeof first === "string" && !isNaN(Number(first))
          ? Number(first)
          : first;
      const secondVal =
        typeof second === "string" && !isNaN(Number(second))
          ? Number(second)
          : second;

      let cmp = firstVal < secondVal ? -1 : firstVal > secondVal ? 1 : 0;

      if (sortDescriptor.direction === "descending") {
        cmp *= -1;
      }
      return cmp;
    }),
  };
}

export const DataTableRoot = forwardRef<
  HTMLTableElement,
  DataTableRootProps<DataTableColumnItem, DataTableRowItem>
>(function DataTableRoot(
  {
    columns,
    rows,
    selectionMode = "single",
    sortDescriptor,
    onSortChange,
    allowsSorting,
    ...restProps
  }: DataTableRootProps<DataTableColumnItem, DataTableRowItem>,
  ref: Ref<HTMLTableElement>
) {
  return (
    <RaResizableTableContainer style={{ minWidth: 0 }}>
      <RaTable
        ref={ref}
        selectionMode={selectionMode}
        sortDescriptor={sortDescriptor}
        onSortChange={onSortChange}
        disabledBehavior="all"
        aria-label="nimbus table"
        {...restProps}
      >
        <DataTableHeader columns={columns}>
          {(column) => (
            <DataTableColumn
              isRowHeader={column.isRowHeader}
              allowsSorting={allowsSorting && column.allowsSorting}
            >
              {column.name}
            </DataTableColumn>
          )}
        </DataTableHeader>
        <RaTableBody items={rows} dependencies={[columns]}>
          {(row) => (
            <DataTableRow
              isDisabled={row.isDisabled as boolean}
              columns={columns}
            >
              {(column) => (
                <DataTableCell row={row}>
                  {row[column.id]}
                  <Button
                    aria-label="click me"
                    onPress={() => alert("im clicked")}
                  >
                    click me
                  </Button>
                </DataTableCell>
              )}
            </DataTableRow>
          )}
        </RaTableBody>
      </RaTable>
    </RaResizableTableContainer>
  );
});

const DataTableHeader = forwardRef<
  HTMLTableSectionElement,
  RaTableHeaderProps<DataTableColumnItem>
>(function DataTableHeader({ columns, children, ...otherProps }, ref) {
  const { selectionBehavior, selectionMode, allowsDragging } =
    useTableOptions();
  return (
    <RaTableHeader ref={ref} {...otherProps}>
      {/* Add extra columns for drag and drop and selection. */}
      {allowsDragging && <DataTableColumn />}
      {selectionBehavior === "toggle" && (
        <DataTableColumn style={{ maxWidth: "24px" }}>
          {selectionMode === "multiple" && <Checkbox slot="selection" />}
        </DataTableColumn>
      )}
      <RaCollection items={columns}>{children}</RaCollection>
    </RaTableHeader>
  );
});

const DataTableColumn = forwardRef<
  HTMLTableColElement,
  Omit<RaColumnProps, "children"> & { children?: React.ReactNode }
>(function DataTableColumn(props, ref) {
  return (
    <RaColumn ref={ref} {...props}>
      {({ allowsSorting, sortDirection }) => (
        <Flex gap="200">
          {props.children}
          {allowsSorting && (
            <Box aria-hidden="true" as="span">
              {sortDirection === "ascending" ? (
                <ArrowUpward />
              ) : (
                <ArrowDownward />
              )}
            </Box>
          )}
        </Flex>
      )}
    </RaColumn>
  );
});

const DataTableRow = forwardRef<
  HTMLTableRowElement,
  RaRowProps<DataTableColumnItem>
>(function DataTableRow({ id, columns, children, ...otherProps }, ref) {
  const { selectionBehavior, allowsDragging } = useTableOptions();

  return (
    <RaRow
      style={{ userSelect: "all" }}
      onAction={() => {}}
      id={id}
      ref={ref}
      {...otherProps}
    >
      {allowsDragging && (
        <DataTableCell>
          <Button slot="drag">
            <DragIndicator />
          </Button>
        </DataTableCell>
      )}
      {selectionBehavior === "toggle" && (
        <DataTableCell>
          <Checkbox slot="selection" />
        </DataTableCell>
      )}
      <RaCollection items={columns}>
        {typeof children === "function"
          ? (column) => children(column)
          : children}
      </RaCollection>
    </RaRow>
  );
});

const DataTableCell = forwardRef<
  HTMLTableCellElement,
  RaCellProps & { row?: DataTableRowItem }
>(function DataTableCell({ children, row, ...rest }, ref) {
  return (
    <RaCell ref={ref} {...rest}>
      {(renderProps) => (
        <RaButtonContext.Provider
          value={{ isDisabled: row?.isDisabled as boolean }}
        >
          {typeof children === "function" ? children(renderProps) : children}
        </RaButtonContext.Provider>
      )}
    </RaCell>
  );
});
