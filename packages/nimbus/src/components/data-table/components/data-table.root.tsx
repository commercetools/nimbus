import {
  useMemo,
  useState,
  useCallback,
  useRef,
  useEffect,
  startTransition,
} from "react";
import { ResizableTableContainer } from "react-aria-components";
import { useObjectRef } from "react-aria";
import { mergeRefs } from "@/utils";
import { DataTableRoot as DataTableRootSlot } from "../data-table.slots";
import {
  DataTableContext,
  InteractionContext,
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
    renderNestedContent,
    disabledKeys,
    onRowAction,
    isResizable,
    expandedRows: controlledExpandedRows,
    defaultExpandedRows,
    onExpandRowsChange,
    allowsPinning = true,
    allowsExpandColumn = true,
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

  useEffect(() => {
    const el = localRef.current;
    if (!el) return;

    let prevLeft: boolean | undefined;
    let prevRight: boolean | undefined;

    const update = () => {
      const { scrollLeft, scrollWidth, clientWidth } = el;
      const canScrollLeft = scrollLeft > 1;
      const canScrollRight = scrollLeft + clientWidth < scrollWidth - 1;
      if (canScrollLeft !== prevLeft) {
        prevLeft = canScrollLeft;
        el.setAttribute("data-scroll-left", String(canScrollLeft));
      }
      if (canScrollRight !== prevRight) {
        prevRight = canScrollRight;
        el.setAttribute("data-scroll-right", String(canScrollRight));
      }
    };

    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);

    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, []);

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

  const hasNestedKeyContent = useMemo(
    () => hasExpandableRows(filteredRows, nestedKey),
    [filteredRows, nestedKey]
  );
  const hasExpandableContent = hasNestedKeyContent || !!renderNestedContent;
  const showExpandColumn = hasExpandableContent && allowsExpandColumn;
  const showSelectionColumn = selectionMode !== "none";
  const showPinColumn = allowsPinning;

  const expandedRef = useRef(expanded);
  expandedRef.current = expanded;
  const controlledExpandedRef = useRef(controlledExpandedRows);
  controlledExpandedRef.current = controlledExpandedRows;
  const onExpandRowsChangeRef = useRef(onExpandRowsChange);
  onExpandRowsChangeRef.current = onExpandRowsChange;

  const toggleExpand = useCallback((id: string, columnId?: string) => {
    startTransition(() => {
      const current = controlledExpandedRef.current ?? expandedRef.current;
      const newExpanded = new Set(current);
      if (newExpanded.has(id)) {
        newExpanded.delete(id);
      } else {
        newExpanded.add(id);
      }
      onExpandRowsChangeRef.current?.(newExpanded, id, columnId);
      if (controlledExpandedRef.current === undefined) {
        setInternalExpandedRows(newExpanded);
      }
    });
  }, []);

  // Ref-stabilize consumer callback props so their identity doesn't
  // destabilize contextValue. Without this, inline callbacks like
  // `onRowClick={(row) => ...}` create a new context value every
  // consumer render, which bypasses memo() on every Row and forces a
  // full table re-render. The refs are passed into the context; call
  // sites read .current at invocation time.
  const onRowClickRef = useRef(onRowClick);
  onRowClickRef.current = onRowClick;
  const renderNestedContentRef = useRef(renderNestedContent);
  renderNestedContentRef.current = renderNestedContent;
  const onRowActionRef = useRef(onRowAction);
  onRowActionRef.current = onRowAction;
  const onColumnsChangeRef = useRef(onColumnsChange);
  onColumnsChangeRef.current = onColumnsChange;
  const onSettingsChangeRef = useRef(onSettingsChange);
  onSettingsChangeRef.current = onSettingsChange;

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

  const interactionValue = useMemo(
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

  const isRowClickable = !!onRowClick;
  const hasRenderNestedContent = !!renderNestedContent;

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
      isRowClickable,
      hasRenderNestedContent,
      onRowClickRef,
      renderNestedContentRef,
      toggleExpand,
      activeColumns,
      showExpandColumn,
      hasExpandableContent,
      showSelectionColumn,
      showPinColumn,
      selectRowLabel,
      isResizable,
      disabledKeys,
      onRowActionRef,
      togglePin,
      onColumnsChangeRef,
      onSettingsChangeRef,
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
      isRowClickable,
      hasRenderNestedContent,
      toggleExpand,
      activeColumns,
      showExpandColumn,
      hasExpandableContent,
      showSelectionColumn,
      showPinColumn,
      selectRowLabel,
      isResizable,
      disabledKeys,
      togglePin,
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
        <InteractionContext.Provider value={interactionValue}>
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
        </InteractionContext.Provider>
      </ResizableTableContainer>
    </DataTableRootSlot>
  );
};

DataTableRoot.displayName = "DataTable.Root";
