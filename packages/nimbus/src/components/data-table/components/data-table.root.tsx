import { useMemo, useState, useCallback, useRef } from "react";
import { ResizableTableContainer } from "react-aria-components";
import { useObjectRef } from "react-aria";
import { mergeRefs } from "@/utils";
import { DataTableRoot as DataTableRootSlot } from "../data-table.slots";
import { DataTableContext, CustomSettingsContext } from "./data-table.context";
import type {
  DataTableProps,
  SortDescriptor,
  DataTableContextValue,
  CustomSettingsContextValue,
} from "../data-table.types";
import { filterRows, hasExpandableRows, sortRows } from "../utils/rows.utils";

/**
 * DataTable.Root - The root container that provides context and state management for the entire data table
 *
 * @supportsStyleProps
 */
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
    expandedRows: controlledExpandedRows,
    defaultExpandedRows,
    onExpandRowsChange,
    pinnedRows: controlledPinnedRows,
    defaultPinnedRows,
    onPinToggle,
    onColumnsChange,
    onSettingsChange,
    customSettings,
    children,
    ...rest
  } = props;

  const localRef = useRef<HTMLDivElement>(null);
  const ref = useObjectRef(mergeRefs(localRef, forwardedRef));

  const [internalSortDescriptor, setInternalSortDescriptor] = useState<
    SortDescriptor | undefined
  >(defaultSortDescriptor);

  const [internalExpandedRows, setInternalExpandedRows] = useState<Set<string>>(
    () => defaultExpandedRows || new Set()
  );
  const [internalPinnedRows, setInternalPinnedRows] = useState<Set<string>>(
    () => defaultPinnedRows || new Set()
  );

  const sortDescriptor = controlledSortDescriptor ?? internalSortDescriptor;
  const expanded = controlledExpandedRows ?? internalExpandedRows;
  const pinnedRows = controlledPinnedRows ?? internalPinnedRows;

  const activeColumns = useMemo(() => {
    if (!visibleColumns) {
      return columns;
    }

    const columnMap = new Map(columns.map((col) => [col.id, col]));

    // Map visibleColumns IDs to column objects, preserving the order from visibleColumns
    return visibleColumns
      .map((id) => columnMap.get(id))
      .filter((col): col is NonNullable<typeof col> => col !== undefined);
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
    (id: string) => {
      const newExpanded = new Set(expanded);
      if (newExpanded.has(id)) {
        newExpanded.delete(id);
      } else {
        newExpanded.add(id);
      }
      onExpandRowsChange?.(newExpanded);
      if (controlledExpandedRows === undefined) {
        setInternalExpandedRows(newExpanded);
      }
    },
    [expanded, onExpandRowsChange, controlledExpandedRows]
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
      onColumnsChange,
      onSettingsChange,
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
      onColumnsChange,
      onSettingsChange,
    ]
  );

  const customSettingsContextValue: CustomSettingsContextValue = useMemo(
    () => ({
      customSettings,
    }),
    [customSettings]
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
          <CustomSettingsContext.Provider value={customSettingsContextValue}>
            {children}
          </CustomSettingsContext.Provider>
        </DataTableContext.Provider>
      </ResizableTableContainer>
    </DataTableRootSlot>
  );
};

DataTableRoot.displayName = "DataTable.Root";
