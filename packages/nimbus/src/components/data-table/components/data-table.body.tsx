import { TableBody as RaTableBody } from "react-aria-components";
import { Box } from "@/components";
import { extractStyleProps } from "@/utils";
import { useLocalizedStringFormatter } from "@/hooks";
import type { DataTableBodyProps, DataTableRowItem } from "../data-table.types";
import { DataTableBodySlot } from "../data-table.slots";
import { useDataTableContext, useRowsDataContext } from "./data-table.context";
import { DataTableRow } from "./data-table.row";
import { dataTableMessagesStrings } from "../data-table.messages";

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
  "aria-label": ariaLabelProp,
  ...props
}: DataTableBodyProps<T>) => {
  const msg = useLocalizedStringFormatter(dataTableMessagesStrings);
  const { activeColumns, renderEmptyState } = useDataTableContext<T>();
  const { sortedRows, expanded, pinnedRows, pinnedRowIds } =
    useRowsDataContext<T>();
  const [styleProps, restProps] = extractStyleProps(props);

  // Use provided aria-label or fall back to default
  const ariaLabel = ariaLabelProp ?? msg.format("dataTableBody");

  return (
    <DataTableBodySlot asChild {...styleProps}>
      <RaTableBody
        ref={ref}
        aria-label={ariaLabel}
        items={sortedRows}
        dependencies={[activeColumns, expanded, pinnedRows, pinnedRowIds]}
        renderEmptyState={renderEmptyState ?? DefaultEmptyStateMessage}
        {...restProps}
      >
        {(row) => {
          const isPinned = pinnedRows.has(row.id);
          const pinnedIdx = isPinned ? pinnedRowIds.indexOf(row.id) : -1;
          return (
            <DataTableRow
              key={row.id}
              row={row}
              isExpanded={expanded.has(row.id)}
              isPinned={isPinned}
              isFirstPinned={pinnedIdx === 0}
              isLastPinned={pinnedIdx === pinnedRowIds.length - 1}
              isSinglePinned={pinnedRowIds.length === 1 && isPinned}
            />
          );
        }}
      </RaTableBody>
    </DataTableBodySlot>
  );
};

DataTableBody.displayName = "DataTable.Body";
