import { useMemo, useState, useCallback, useRef, startTransition } from "react";
import { ResizableTableContainer } from "react-aria-components";
import { useObjectRef } from "react-aria";
import { mergeRefs } from "@/utils";
import { DataTableRoot as DataTableRootSlot } from "../data-table.slots";
import {
  DataTableContext,
  RowsDataContext,
  CustomSettingsContext,
  TableSelectionContext,
} from "./data-table.context";
import type {
  DataTableProps,
  SortDescriptor,
  DataTableContextValue,
  CustomSettingsContextValue,
  TableSelectionContextValue,
} from "../data-table.types";
import { filterRows, hasExpandableRows, sortRows } from "../utils/rows.utils";
import { useLocalizedStringFormatter } from "@/hooks";
import { dataTableMessagesStrings } from "../data-table.messages";

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
  const msg = useLocalizedStringFormatter(dataTableMessagesStrings);
  const selectRowLabel = msg.format("selectRow");

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

  const pinnedRowIds = useMemo(
    () => rows.filter((r) => pinnedRows.has(r.id)).map((r) => r.id),
    [rows, pinnedRows]
  );

  const showExpandColumn = useMemo(
    () => hasExpandableRows(filteredRows, nestedKey),
    [filteredRows, nestedKey]
  );
  const showSelectionColumn = selectionMode !== "none";

  const expandedRef = useRef(expanded);
  expandedRef.current = expanded;
  const controlledExpandedRef = useRef(controlledExpandedRows);
  controlledExpandedRef.current = controlledExpandedRows;
  const onExpandRowsChangeRef = useRef(onExpandRowsChange);
  onExpandRowsChangeRef.current = onExpandRowsChange;

  const toggleExpand = useCallback((id: string) => {
    startTransition(() => {
      const current = controlledExpandedRef.current ?? expandedRef.current;
      const newExpanded = new Set(current);
      if (newExpanded.has(id)) {
        newExpanded.delete(id);
      } else {
        newExpanded.add(id);
      }
      onExpandRowsChangeRef.current?.(newExpanded);
      if (controlledExpandedRef.current === undefined) {
        setInternalExpandedRows(newExpanded);
      }
    });
  }, []);

  const onPinToggleRef = useRef(onPinToggle);
  onPinToggleRef.current = onPinToggle;

  const togglePin = useCallback((id: string) => {
    startTransition(() => {
      if (onPinToggleRef.current) {
        onPinToggleRef.current(id);
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
    });
  }, []);

  const onSortChangeRef = useRef(onSortChange);
  onSortChangeRef.current = onSortChange;

  const handleSortChange = useCallback((descriptor: SortDescriptor) => {
    startTransition(() => {
      if (onSortChangeRef.current) {
        onSortChangeRef.current(descriptor);
      } else {
        setInternalSortDescriptor(descriptor);
      }
    });
  }, []);

  const rowsDataValue = useMemo(
    () => ({
      sortedRows,
      filteredRows,
      sortDescriptor,
      expanded,
      pinnedRows,
      pinnedRowIds,
    }),
    [
      sortedRows,
      filteredRows,
      sortDescriptor,
      expanded,
      pinnedRows,
      pinnedRowIds,
    ]
  );

  const contextValue = useMemo(
    () => ({
      columns,
      rows,
      visibleColumns,
      search,
      allowsSorting,
      selectionMode,
      disallowEmptySelection,
      maxHeight,
      isTruncated,
      density,
      nestedKey,
      onSortChange: handleSortChange,
      onRowClick,
      onDetailsClick,
      toggleExpand,
      activeColumns,
      showExpandColumn,
      showSelectionColumn,
      selectRowLabel,
      isResizable,
      disabledKeys,
      onRowAction,
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
      allowsSorting,
      selectionMode,
      disallowEmptySelection,
      maxHeight,
      isTruncated,
      density,
      nestedKey,
      handleSortChange,
      onRowClick,
      onDetailsClick,
      toggleExpand,
      activeColumns,
      showExpandColumn,
      showSelectionColumn,
      selectRowLabel,
      isResizable,
      disabledKeys,
      onRowAction,
      onPinToggle,
      togglePin,
      onColumnsChange,
      onSettingsChange,
    ]
  );

  const selectionContextValue: TableSelectionContextValue = useMemo(
    () => ({
      selectedKeys,
      defaultSelectedKeys,
      onSelectionChange,
    }),
    [selectedKeys, defaultSelectedKeys, onSelectionChange]
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
        <RowsDataContext.Provider value={rowsDataValue}>
          <DataTableContext.Provider
            value={
              contextValue as unknown as DataTableContextValue<
                Record<string, unknown>
              >
            }
          >
            <TableSelectionContext.Provider value={selectionContextValue}>
              <CustomSettingsContext.Provider
                value={customSettingsContextValue}
              >
                {children}
              </CustomSettingsContext.Provider>
            </TableSelectionContext.Provider>
          </DataTableContext.Provider>
        </RowsDataContext.Provider>
      </ResizableTableContainer>
    </DataTableRootSlot>
  );
};

DataTableRoot.displayName = "DataTable.Root";
