import {
  useMemo,
  useState,
  useCallback,
  useRef,
  useEffect,
  startTransition,
  type ContextType,
} from "react";
import { ResizableTableContainer } from "react-aria-components";
import { useObjectRef } from "react-aria";
import { mergeRefs } from "@/utils";
import { DataTableRoot as DataTableRootSlot } from "../data-table.slots";
import {
  DataTableContext,
  DataTableRowContext,
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
  DataTableRowItem,
} from "../data-table.types";
import {
  defaultGetRowKey,
  findRowKeyProblems,
  formatRowKeyProblems,
} from "../utils/row-keys.utils";
import { filterRows, hasExpandableRows, sortRows } from "../utils/rows.utils";
import { useStableArray } from "../hooks";
import { useLocalizedStringFormatter } from "@/hooks";
import { dataTableMessagesStrings } from "../data-table.messages";
import { DATA_TABLE_DEFAULT_SIZE } from "../utils/sizes.utils";

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
    columns: columnsProp = [],
    rows: rowsProp = [],
    visibleColumns: visibleColumnsProp,
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
    size: sizeProp,
    density: densityProp,
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
    renderEmptyState,
    children,
    ...rest
  } = props;

  // `columns={[...]}` or `rows={data.filter(...)}` is a new array on every
  // render. Keeping the previous array while its items are the same stops
  // that from re-sorting the rows and re-rendering every row.
  const columns = useStableArray(columnsProp);
  const rows = useStableArray(rowsProp);
  const visibleColumns = useStableArray(visibleColumnsProp);

  const localRef = useRef<HTMLDivElement>(null);
  const ref = useObjectRef(mergeRefs(localRef, forwardedRef));
  const msg = useLocalizedStringFormatter(dataTableMessagesStrings);
  const selectRowLabel = msg.format("selectRow");

  const size = sizeProp ?? DATA_TABLE_DEFAULT_SIZE;
  const density = densityProp ?? "default";
  // `density` only modifies the deprecated `xl` default. An explicit `size`
  // owns the padding, so `density` is not passed to the recipe then.
  const recipeDensity = sizeProp === undefined ? density : "default";

  // Deprecation warnings, once per mount. Development only.
  const hasWarnedRef = useRef({ xl: false, density: false });
  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    const warned = hasWarnedRef.current;
    if (sizeProp === "xl" && !warned.xl) {
      warned.xl = true;
      console.warn(
        '[Nimbus] DataTable: size="xl" is deprecated. It is the default only to keep the previous appearance. Use size="lg" instead.'
      );
    }
    if (
      sizeProp !== undefined &&
      densityProp !== undefined &&
      !warned.density
    ) {
      warned.density = true;
      console.warn(
        "[Nimbus] DataTable: `density` is deprecated and ignored when `size` is set. Remove `density`."
      );
    }
  }, [sizeProp, densityProp]);

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

  // While a column is being resized, keep its right edge in view. Once the
  // table is wider than its container, the edge would otherwise move under
  // the frozen pin column or out of the visible area, where the mouse can no
  // longer reach its resize handle. A ResizeObserver runs after the browser
  // has laid out the new width and before it paints.
  //
  // The observer exists only during a resize, and it looks up the table when
  // the resize starts. `DataTable.Table` can mount after `DataTable.Root`
  // (rendered conditionally, for example), so the table may not exist yet
  // when the root mounts.
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  const stopKeepingResizedEdgeInView = useCallback(() => {
    resizeObserverRef.current?.disconnect();
    resizeObserverRef.current = null;
  }, []);

  const startKeepingResizedEdgeInView = useCallback(() => {
    const el = localRef.current;
    const table = el?.querySelector("table");
    if (!el || !table) return;

    const keepResizedEdgeInView = () => {
      const column = el.querySelector("[data-resizing='true']")?.closest("th");
      if (!column) return;
      const pinColumn = el.querySelector("th.pin-rows-column-header");
      const visibleRight = pinColumn
        ? pinColumn.getBoundingClientRect().left
        : el.getBoundingClientRect().left + el.clientLeft + el.clientWidth;
      const hiddenWidth = column.getBoundingClientRect().right - visibleRight;
      if (hiddenWidth > 0) el.scrollLeft += hiddenWidth;
    };

    resizeObserverRef.current?.disconnect();
    resizeObserverRef.current = new ResizeObserver(keepResizedEdgeInView);
    resizeObserverRef.current.observe(table);
  }, []);

  // The root can unmount during a resize, before React Aria reports its end.
  useEffect(() => stopKeepingResizedEdgeInView, [stopKeepingResizedEdgeInView]);

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

  // One resolver for row identity, stable for the component's lifetime so it
  // can sit in context without destabilising it. Everything that keys a row —
  // selection, disabledKeys, expansion, pinning, and the key React Aria uses
  // for the collection — goes through this, so those can never disagree.
  const getRowKey = useCallback(
    (row: DataTableRowItem<T>): string => defaultGetRowKey(row),
    []
  );

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
        pinnedRows,
        getRowKey
      ),
    [
      filteredRows,
      sortDescriptor,
      activeColumns,
      nestedKey,
      pinnedRows,
      getRowKey,
    ]
  );

  // Duplicate or empty keys otherwise surface only as React Aria's opaque
  // "Cell count must match column count", which names neither the row nor the
  // cause. Development only.
  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    const message = formatRowKeyProblems(findRowKeyProblems(rows, getRowKey));
    if (message) console.warn(message);
  }, [rows, getRowKey]);

  // The pinned rows on screen, in display order. It comes from `sortedRows`,
  // not from `rows`: a pinned row that the search hides must not count as the
  // first or last pinned row, or the row that is shown loses its outline.
  // Sorting or searching gives a new array with the same ids. Keeping the old
  // array then keeps DataTable.Body from re-rendering every row.
  const pinnedRowIds = useStableArray(
    useMemo(
      () =>
        sortedRows.filter((r) => pinnedRows.has(getRowKey(r))).map(getRowKey),
      [sortedRows, pinnedRows, getRowKey]
    )
  );

  const hasNestedKeyContent = useMemo(
    () => hasExpandableRows(filteredRows, nestedKey),
    [filteredRows, nestedKey]
  );
  const hasExpandableContent = hasNestedKeyContent || !!renderNestedContent;
  const showExpandColumn = hasExpandableContent && allowsExpandColumn;
  // The single rule for whether the selection column exists. Header, cells
  // and the nested row's colSpan all read it, so they cannot disagree.
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
  // `onRowAction={(row) => ...}` create a new context value every
  // consumer render, which bypasses memo() on every Row and forces a
  // full table re-render. The refs are passed into the context; call
  // sites read .current at invocation time.
  const onRowClickRef = useRef(onRowClick);
  onRowClickRef.current = onRowClick;
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

  const isRowClickable = !!(onRowAction || onRowClick);
  const hasRenderNestedContent = !!renderNestedContent;

  const contextValue = useMemo(
    () => ({
      getRowKey,
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
      size,
      nestedKey,
      renderEmptyState,
      onSortChange: handleSortChange,
      isRowClickable,
      hasRenderNestedContent,
      onRowClickRef,
      renderNestedContent,
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
      size,
      nestedKey,
      renderEmptyState,
      handleSortChange,
      isRowClickable,
      hasRenderNestedContent,
      renderNestedContent,
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
      getRowKey,
    ]
  );

  // Same values as in `contextValue`, without `columns` and `rows`, so a new
  // `rows` array re-renders only the rows whose data changed.
  const rowContextValue = useMemo(
    () => ({
      activeColumns,
      search,
      toggleExpand,
      nestedKey,
      disabledKeys,
      showExpandColumn,
      hasExpandableContent,
      showSelectionColumn,
      showPinColumn,
      isTruncated,
      isRowClickable,
      hasRenderNestedContent,
      onRowClickRef,
      onRowActionRef,
      renderNestedContent,
      togglePin,
      selectRowLabel,
      getRowKey,
    }),
    [
      activeColumns,
      search,
      toggleExpand,
      nestedKey,
      disabledKeys,
      showExpandColumn,
      hasExpandableContent,
      showSelectionColumn,
      showPinColumn,
      isTruncated,
      isRowClickable,
      hasRenderNestedContent,
      renderNestedContent,
      togglePin,
      selectRowLabel,
      getRowKey,
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
      size={size}
      density={recipeDensity}
      maxH={maxHeight}
      {...rest}
      asChild
    >
      <ResizableTableContainer
        onResizeStart={startKeepingResizedEdgeInView}
        onResizeEnd={stopKeepingResizedEdgeInView}
      >
        <InteractionContext.Provider value={interactionValue}>
          <DataTableContext.Provider
            value={
              contextValue as unknown as DataTableContextValue<
                Record<string, unknown>
              >
            }
          >
            <DataTableRowContext.Provider
              value={
                rowContextValue as unknown as ContextType<
                  typeof DataTableRowContext
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
            </DataTableRowContext.Provider>
          </DataTableContext.Provider>
        </InteractionContext.Provider>
      </ResizableTableContainer>
    </DataTableRootSlot>
  );
};

DataTableRoot.displayName = "DataTable.Root";
