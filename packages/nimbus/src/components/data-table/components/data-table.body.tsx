import {
  cloneElement,
  isValidElement,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { TableBody as RaTableBody } from "react-aria-components";
import { Box } from "@/components";
import { extractStyleProps } from "@/utils";
import { useLocalizedStringFormatter } from "@/hooks";
import type {
  DataTableBodyProps,
  DataTableRowItem,
  DataTableRowRenderProps,
} from "../data-table.types";
import { DataTableBodySlot } from "../data-table.slots";
import {
  useStableDataTableContext,
  useInteractionContext,
} from "./data-table.context";
import { DataTableRow } from "./data-table.row";
import { dataTableMessagesStrings } from "../data-table.messages";

/**
 * DataTable.Body - The table body section that renders all data rows with selection and expansion capabilities
 *
 * @supportsStyleProps
 */
export const DataTableBody = <T extends DataTableRowItem = DataTableRowItem>({
  ref,
  children,
  dependencies: dependenciesFromProps,
  "aria-label": ariaLabelProp,
  ...props
}: DataTableBodyProps<T>) => {
  const msg = useLocalizedStringFormatter(dataTableMessagesStrings);
  const { activeColumns, renderEmptyState, getRowKey } =
    useStableDataTableContext<T>();
  const { sortedRows, expanded, pinnedRows, pinnedRowIds } =
    useInteractionContext<T>();
  const [styleProps, restProps] = extractStyleProps(props);

  // Use provided aria-label or fall back to default
  const ariaLabel = ariaLabelProp ?? msg.format("dataTableBody");

  // React Aria calls renderEmptyState as a plain function, not as a
  // component, so the default message must not call hooks itself.
  const noDataMessage = msg.format("noData");
  const renderDefaultEmptyState = useCallback(
    () => (
      <Box w="100%" p="200">
        {noDataMessage}
      </Box>
    ),
    [noDataMessage]
  );

  const getRowKeyRef = useRef(getRowKey);
  getRowKeyRef.current = getRowKey;
  const childrenRef = useRef(children);
  childrenRef.current = children;
  const expandedRef = useRef(expanded);
  expandedRef.current = expanded;
  const pinnedRowsRef = useRef(pinnedRows);
  pinnedRowsRef.current = pinnedRows;
  // Position of each pinned row on screen, looked up once per row instead of
  // searching `pinnedRowIds` for every pinned row.
  const pinnedIndexById = useMemo(
    () => new Map(pinnedRowIds.map((id, index) => [id, index])),
    [pinnedRowIds]
  );
  const pinnedIndexByIdRef = useRef(pinnedIndexById);
  pinnedIndexByIdRef.current = pinnedIndexById;

  const renderRow = useCallback(
    (row: DataTableRowItem<T>) => {
      const rowKey = getRowKeyRef.current(row);
      const isPinned = pinnedRowsRef.current.has(rowKey);
      const pinnedCount = pinnedIndexByIdRef.current.size;
      // Only a pinned row has a position. Every other row gets `false` for
      // all three flags, so pinning one row does not change the props of the
      // rows that stay unpinned, and `memo` skips them.
      const pinnedIdx = isPinned
        ? pinnedIndexByIdRef.current.get(rowKey)
        : undefined;
      const rowRenderProps: DataTableRowRenderProps = {
        isExpanded: expandedRef.current.has(rowKey),
        isPinned,
        isFirstPinned: pinnedIdx === 0,
        isLastPinned: pinnedIdx !== undefined && pinnedIdx === pinnedCount - 1,
        isSinglePinned: pinnedIdx !== undefined && pinnedCount === 1,
      };
      // React Aria derives the collection key from
      // `rendered.props.id ?? item.key ?? item.id` (see `useCachedChildren`),
      // so the rendered element has to carry the id explicitly. Domain rows
      // commonly have a business `key` field (customer groups, categories,
      // product types, ...) which would otherwise win: selection callbacks
      // would report that key instead of the row id, and a row whose `key`
      // equals a column id collides in the collection ("Cell count must match
      // column count"). The row objects themselves stay the collection items
      // so React Aria's per-item render cache keeps working.
      // An element that already carries an `id` is left alone rather than
      // overwritten, but a value other than the row's key is unsupported —
      // DataTable.Row warns about it in development.
      if (childrenRef.current) {
        const rendered = childrenRef.current(row, rowRenderProps);
        return isValidElement<{ id?: string }>(rendered) &&
          rendered.props.id == null
          ? cloneElement(rendered, { id: rowKey })
          : rendered;
      }
      return (
        <DataTableRow key={rowKey} id={rowKey} row={row} {...rowRenderProps} />
      );
    },
    // Stable identity — delegates through refs so RaTableBody never
    // unmounts/remounts rows due to a new render-function reference.
    // Row re-renders are driven by RaTableBody's `dependencies` array.
    []
  );

  return (
    <DataTableBodySlot asChild {...styleProps}>
      <RaTableBody
        ref={ref}
        aria-label={ariaLabel}
        items={sortedRows}
        renderEmptyState={renderEmptyState ?? renderDefaultEmptyState}
        {...restProps}
        dependencies={[
          activeColumns,
          expanded,
          pinnedRows,
          pinnedRowIds,
          ...(dependenciesFromProps ?? []),
        ]}
      >
        {renderRow}
      </RaTableBody>
    </DataTableBodySlot>
  );
};

DataTableBody.displayName = "DataTable.Body";
