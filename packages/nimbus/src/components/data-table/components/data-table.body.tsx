import { TableBody as RaTableBody } from "react-aria-components";
import { Box } from "@/components";
import { extractStyleProps } from "@/utils";
import { useLocalizedStringFormatter } from "@/hooks";
import type { DataTableBodyProps, DataTableRowItem } from "../data-table.types";
import { DataTableBodySlot } from "../data-table.slots";
import { useDataTableContext } from "./data-table.context";
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
  const { sortedRows, activeColumns, renderEmptyState } =
    useDataTableContext<T>();
  const [styleProps, restProps] = extractStyleProps(props);

  // Use provided aria-label or fall back to default
  const ariaLabel = ariaLabelProp ?? msg.format("dataTableBody");

  return (
    <DataTableBodySlot asChild {...styleProps}>
      <RaTableBody
        ref={ref}
        aria-label={ariaLabel}
        items={sortedRows}
        dependencies={[activeColumns]}
        renderEmptyState={renderEmptyState ?? DefaultEmptyStateMessage}
        {...restProps}
      >
        {(row) => <DataTableRow key={row.id} row={row} />}
      </RaTableBody>
    </DataTableBodySlot>
  );
};

DataTableBody.displayName = "DataTable.Body";
