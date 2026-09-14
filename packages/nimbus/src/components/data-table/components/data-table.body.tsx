import { useCallback, useMemo, useRef } from "react";
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
  useDataTableContext,
  useInteractionContext,
} from "./data-table.context";
import { DataTableRow } from "./data-table.row";
import { dataTableMessagesStrings } from "../data-table.messages";

type RowCollectionItem<T extends DataTableRowItem> = {
  id: string;
  row: DataTableRowItem<T>;
};

const DefaultEmptyStateMessage = () => (
  <Box w="100%" p="200">
    No Data
  </Box>
);

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
  const { activeColumns, renderEmptyState } = useDataTableContext<T>();
  const { sortedRows, expanded, pinnedRows, pinnedRowIds } =
    useInteractionContext<T>();
  const [styleProps, restProps] = extractStyleProps(props);

  // Use provided aria-label or fall back to default
  const ariaLabel = ariaLabelProp ?? msg.format("dataTableBody");

  const childrenRef = useRef(children);
  childrenRef.current = children;
  const expandedRef = useRef(expanded);
  expandedRef.current = expanded;
  const pinnedRowsRef = useRef(pinnedRows);
  pinnedRowsRef.current = pinnedRows;
  const pinnedRowIdsRef = useRef(pinnedRowIds);
  pinnedRowIdsRef.current = pinnedRowIds;

  // React Aria keys collection items by `item.key ?? item.id`. Domain rows
  // frequently carry a business `key` field (customer groups, categories,
  // product types, ...), which would leak into selection keys and can even
  // collide with column ids ("Cell count must match column count"). Hand
  // React Aria a thin wrapper keyed strictly by the row id instead.
  const rowItems = useMemo<RowCollectionItem<T>[]>(
    () => sortedRows.map((row) => ({ id: row.id, row })),
    [sortedRows]
  );

  const renderRow = useCallback(
    ({ row }: RowCollectionItem<T>) => {
      const currentPinnedRows = pinnedRowsRef.current;
      const currentPinnedRowIds = pinnedRowIdsRef.current;
      const isPinned = currentPinnedRows.has(row.id);
      const pinnedIdx = isPinned ? currentPinnedRowIds.indexOf(row.id) : -1;
      const rowRenderProps: DataTableRowRenderProps = {
        isExpanded: expandedRef.current.has(row.id),
        isPinned,
        isFirstPinned: pinnedIdx === 0,
        isLastPinned: pinnedIdx === currentPinnedRowIds.length - 1,
        isSinglePinned: currentPinnedRowIds.length === 1 && isPinned,
      };
      if (childrenRef.current) {
        return childrenRef.current(row, rowRenderProps);
      }
      return <DataTableRow key={row.id} row={row} {...rowRenderProps} />;
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
        items={rowItems}
        renderEmptyState={renderEmptyState ?? DefaultEmptyStateMessage}
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
