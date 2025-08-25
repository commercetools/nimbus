import { useMemo, useState, useCallback } from "react";
import { ResizableTableContainer } from "react-aria-components";
import { DataTableRoot as DataTableRootSlot } from "../data-table.slots";
import { filterRows, sortRows, hasExpandableRows } from "../utils/rows.utils";
import { DataTableContext } from "./data-table.context";
import type {
  DataTableProps,
  SortDescriptor,
  DataTableContextValue,
} from "../data-table.types";

export const DataTableRoot = <T extends object = Record<string, unknown>>(
  props: DataTableProps<T>
) => {
  const {
    columns = [],
    data = [],
    visibleColumns,
    renderEmptyState,
    search,
    sortDescriptor: controlledSortDescriptor,
    onSortChange,
    selectedKeys,
    defaultSelectedKeys,
    onSelectionChange,
    selectionMode = "none",
    disallowEmptySelection = false,
    allowsSorting = false,
    isRowClickable = false,
    maxHeight,
    isTruncated = false,
    density = "default",
    nestedKey,
    onRowClick,
    onDetailsClick,
    disabledKeys,
    onRowAction,
    isResizable,
    ref,
    children,
    ...rest
  } = props;

  const [internalSortDescriptor, setInternalSortDescriptor] = useState<
    SortDescriptor | undefined
  >();

  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const sortDescriptor = controlledSortDescriptor ?? internalSortDescriptor;
  // TODO: should we really always show this?
  const showDetailsColumn = true; // Details column is always shown

  const activeColumns = useMemo(() => {
    const activeCols = columns.filter(
      (col) =>
        (visibleColumns ? visibleColumns.includes(col.id) : true) &&
        col.isVisible !== false
    );
    if (showDetailsColumn) {
      // Add the 'details column' to the active columns after the first column
      activeCols.splice(1, 0, {
        id: "nimbus-data-table-details-column",
        header: undefined,
        accessor: () => null,
        width: 70,
        isSortable: false,
      });
    }
    return activeCols;
  }, [columns, visibleColumns, showDetailsColumn]);

  const filteredRows = useMemo(
    () => (search ? filterRows(data, search, activeColumns, nestedKey) : data),
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
      renderEmptyState,
      search,
      sortDescriptor,
      selectedKeys,
      defaultSelectedKeys,
      expanded,
      allowsSorting,
      selectionMode,
      disallowEmptySelection,
      isRowClickable,
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
      showDetailsColumn,
      isResizable,
      disabledKeys,
      onRowAction,
    }),
    [
      columns,
      data,
      visibleColumns,
      renderEmptyState,
      search,
      sortDescriptor,
      selectedKeys,
      defaultSelectedKeys,
      expanded,
      allowsSorting,
      selectionMode,
      disallowEmptySelection,
      isRowClickable,
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
      showDetailsColumn,
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
      maxH={maxHeight}
      {...rest}
      asChild
    >
      <ResizableTableContainer>
        <DataTableContext.Provider
          value={contextValue as DataTableContextValue<Record<string, unknown>>}
        >
          {children}
        </DataTableContext.Provider>
      </ResizableTableContainer>
    </DataTableRootSlot>
  );
};

DataTableRoot.displayName = "DataTableRoot";
