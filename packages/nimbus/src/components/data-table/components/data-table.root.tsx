import { forwardRef, useMemo, useState, useCallback } from "react";
import { ResizableTableContainer } from "react-aria-components";
import { DataTableRoot as DataTableRootSlot } from "../data-table.slots";
import { DataTableContext } from "./data-table.context";
import type {
  DataTableProps,
  DataTableColumnItem,
  DataTableRowItem as DataTableRowType,
  SortDescriptor,
  DataTableContextValue,
} from "../data-table.types";

// Utility functions
function filterRows<T extends object>(
  rows: DataTableRowType<T>[],
  search: string,
  columns: DataTableColumnItem<T>[],
  nestedKey?: string
): DataTableRowType<T>[] {
  if (!search) return rows;
  const lowerCaseSearch = search.toLowerCase();
  return rows
    .map((row) => {
      const match = columns.some((col) => {
        const value = col.accessor(row);
        return (
          typeof value === "string" &&
          value.toLowerCase().includes(lowerCaseSearch)
        );
      });

      if (nestedKey && row[nestedKey]) {
        let nestedContent = row[nestedKey];
        if (Array.isArray(row[nestedKey])) {
          nestedContent = filterRows(
            row[nestedKey],
            search,
            columns,
            nestedKey
          );
          if (
            match ||
            (nestedContent &&
              Array.isArray(nestedContent) &&
              nestedContent.length > 0)
          ) {
            return { ...row, [nestedKey]: nestedContent };
          }
        } else {
          if (match) {
            return { ...row, [nestedKey]: nestedContent };
          }
        }
        return null;
      } else {
        return match ? row : null;
      }
    })
    .filter(Boolean) as DataTableRowType<T>[];
}

function sortRows<T extends object>(
  rows: DataTableRowType<T>[],
  sortDescriptor: SortDescriptor | undefined,
  columns: DataTableColumnItem<T>[],
  nestedKey?: string
): DataTableRowType<T>[] {
  if (!sortDescriptor) return rows;

  const column = columns.find((col) => col.id === sortDescriptor.column);
  if (!column) return rows;

  const sortedRows = [...rows].sort((a, b) => {
    const aValue = column.accessor(a);
    const bValue = column.accessor(b);

    if (aValue == null && bValue == null) return 0;
    if (aValue == null) return 1;
    if (bValue == null) return -1;

    let aSortValue = aValue;
    let bSortValue = bValue;

    if (typeof aValue === "number" && typeof bValue === "number") {
      aSortValue = aValue;
      bSortValue = bValue;
    } else {
      aSortValue = String(aValue).toLowerCase();
      bSortValue = String(bValue).toLowerCase();
    }

    if (aSortValue < bSortValue)
      return sortDescriptor.direction === "ascending" ? -1 : 1;
    if (aSortValue > bSortValue)
      return sortDescriptor.direction === "ascending" ? 1 : -1;
    return 0;
  });

  return sortedRows.map((row) => {
    if (!nestedKey || !row[nestedKey]) {
      return row;
    }
    return {
      ...row,
      [nestedKey]: Array.isArray(row[nestedKey])
        ? sortRows(row[nestedKey], sortDescriptor, columns, nestedKey)
        : row[nestedKey],
    };
  });
}

function hasExpandableRows<T extends object>(
  rows: DataTableRowType<T>[],
  nestedKey?: string
): boolean {
  if (!nestedKey) return false;
  return rows.some(
    (row) =>
      (row[nestedKey] &&
        (Array.isArray(row[nestedKey]) ? row[nestedKey].length > 0 : true)) ||
      (Array.isArray(row[nestedKey]) &&
        hasExpandableRows(row[nestedKey], nestedKey))
  );
}

export const DataTableRoot = forwardRef<HTMLDivElement, DataTableProps>(
  function DataTableRoot<T extends object = Record<string, unknown>>(
    props: DataTableProps<T>,
    ref: React.Ref<HTMLDivElement>
  ) {
    const {
      columns = [],
      data = [],
      visibleColumns,
      search,
      sortDescriptor: controlledSortDescriptor,
      onSortChange,
      selectedKeys,
      defaultSelectedKeys,
      onSelectionChange,
      selectionMode = "none",
      disallowEmptySelection = false,
      allowsSorting = false,
      maxHeight,
      isTruncated = false,
      density = "default",
      nestedKey,
      onRowClick,
      onDetailsClick,
      disabledKeys,
      onRowAction,
      isResizable,
      children,
      ...rest
    } = props;

    const [internalSortDescriptor, setInternalSortDescriptor] = useState<
      SortDescriptor | undefined
    >();

    const [expanded, setExpanded] = useState<Record<string, boolean>>({});

    const sortDescriptor = controlledSortDescriptor ?? internalSortDescriptor;

    const activeColumns = useMemo(() => {
      const activeCols = columns.filter(
        (col) =>
          (visibleColumns ? visibleColumns.includes(col.id) : true) &&
          col.isVisible !== false
      );
      return activeCols;
    }, [columns, visibleColumns]);

    const filteredRows = useMemo(
      () =>
        search ? filterRows(data, search, activeColumns, nestedKey) : data,
      [data, search, activeColumns, nestedKey]
    );

    const sortedRows = useMemo(
      () => sortRows(filteredRows, sortDescriptor, activeColumns, nestedKey),
      [filteredRows, sortDescriptor, activeColumns, nestedKey]
    );

    const showExpandColumn = hasExpandableRows(sortedRows, nestedKey);
    const showSelectionColumn = selectionMode !== "none";

    const toggleExpand = useCallback(
      (id: string) => setExpanded((e) => ({ ...e, [id]: !e[id] })),
      []
    );

    const handleSortChange = useCallback(
      (descriptor: SortDescriptor) => {
        if (onSortChange) {
          onSortChange(descriptor);
        } else {
          setInternalSortDescriptor(descriptor);
        }
      },
      [onSortChange]
    );

    const contextValue: DataTableContextValue<T> = useMemo(
      () => ({
        columns,
        data,
        visibleColumns,
        search,
        sortDescriptor,
        selectedKeys,
        defaultSelectedKeys,
        expanded,
        allowsSorting,
        selectionMode,
        disallowEmptySelection,
        maxHeight,
        isTruncated,
        density,
        nestedKey,
        onSortChange: handleSortChange,
        onSelectionChange,
        onRowClick,
        onDetailsClick,
        toggleExpand,
        activeColumns,
        filteredRows,
        sortedRows,
        showExpandColumn,
        showSelectionColumn,
        isResizable,
        disabledKeys,
        onRowAction,
      }),
      [
        columns,
        data,
        visibleColumns,
        search,
        sortDescriptor,
        selectedKeys,
        defaultSelectedKeys,
        expanded,
        allowsSorting,
        selectionMode,
        disallowEmptySelection,
        maxHeight,
        isTruncated,
        density,
        nestedKey,
        handleSortChange,
        onSelectionChange,
        onRowClick,
        onDetailsClick,
        toggleExpand,
        activeColumns,
        filteredRows,
        sortedRows,
        showExpandColumn,
        showSelectionColumn,
        isResizable,
        disabledKeys,
        onRowAction,
      ]
    );

    return (
      <DataTableRootSlot
        ref={ref}
        truncated={isTruncated}
        density={density}
        style={{
          ...(maxHeight && {
            maxHeight,
            overflowY: "auto",
          }),
        }}
        {...rest}
        asChild
      >
        <ResizableTableContainer>
          <DataTableContext.Provider
            value={
              contextValue as DataTableContextValue<Record<string, unknown>>
            }
          >
            {children}
          </DataTableContext.Provider>
        </ResizableTableContainer>
      </DataTableRootSlot>
    );
  }
);

DataTableRoot.displayName = "DataTableRoot";
