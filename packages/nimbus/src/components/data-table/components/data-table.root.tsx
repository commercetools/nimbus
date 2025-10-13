import { useMemo, useState, useCallback, useRef } from "react";
import { ResizableTableContainer } from "react-aria-components";
import { useObjectRef } from "react-aria";
import { mergeRefs } from "@chakra-ui/react";
import { DataTableRoot as DataTableRootSlot } from "../data-table.slots";
import { DataTableContext } from "./data-table.context";
import type {
  DataTableProps,
  SortDescriptor,
  DataTableContextValue,
} from "../data-table.types";
import { filterRows, hasExpandableRows, sortRows } from "../utils/rows.utils";

export const DataTableRoot = function DataTableRoot<
  T extends object = Record<string, unknown>,
>(props: DataTableProps<T>) {
  const {
    ref: forwardedRef,
    columns = [],
    rows = [],
    visibleColumns,
    search,
    sortDescriptor: controlledSortDescriptor,
    defaultSortDescriptor,
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
    pinnedRows: controlledPinnedRows,
    defaultPinnedRows,
    onPinToggle,
    children,
    ...rest
  } = props;

  const localRef = useRef<HTMLDivElement>(null);
  const ref = useObjectRef(mergeRefs(localRef, forwardedRef));

  const [internalSortDescriptor, setInternalSortDescriptor] = useState<
    SortDescriptor | undefined
  >(defaultSortDescriptor);

  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [internalPinnedRows, setInternalPinnedRows] = useState<Set<string>>(
    () => defaultPinnedRows || new Set()
  );

  const sortDescriptor = controlledSortDescriptor ?? internalSortDescriptor;
  const pinnedRows = controlledPinnedRows ?? internalPinnedRows;

  const activeColumns = useMemo(() => {
    const activeCols = columns.filter(
      (col) =>
        (visibleColumns ? visibleColumns.includes(col.id) : true) &&
        col.isVisible !== false
    );
    return activeCols;
  }, [columns, visibleColumns]);

  const filteredRows = useMemo(
    () => (search ? filterRows(rows, search, activeColumns, nestedKey) : rows),
    [rows, search, activeColumns, nestedKey]
  );

  const sortedRows = useMemo(
    () =>
      sortRows(
        filteredRows,
        sortDescriptor,
        activeColumns,
        nestedKey,
        pinnedRows
      ),
    [filteredRows, sortDescriptor, activeColumns, nestedKey, pinnedRows]
  );

  const showExpandColumn = hasExpandableRows(sortedRows, nestedKey);
  const showSelectionColumn = selectionMode !== "none";

  const toggleExpand = useCallback(
    (id: string) => setExpanded((e) => ({ ...e, [id]: !e[id] })),
    []
  );

  const togglePin = useCallback(
    (id: string) => {
      if (onPinToggle) {
        onPinToggle(id);
      } else {
        setInternalPinnedRows((prev) => {
          const newPinnedRows = new Set(prev);
          if (newPinnedRows.has(id)) {
            newPinnedRows.delete(id);
          } else {
            newPinnedRows.add(id);
          }
          return newPinnedRows;
        });
      }
    },
    [onPinToggle]
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
      rows,
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
      pinnedRows,
      onPinToggle,
      togglePin,
    }),
    [
      columns,
      rows,
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
      pinnedRows,
      onPinToggle,
      togglePin,
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
