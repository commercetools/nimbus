import { forwardRef } from "react";
import { TableBody as RaTableBody } from "react-aria-components";
import { Box } from "@/components";
import { useDataTableContext } from "./data-table.root";
import { DataTableRow } from "./data-table.row";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface DataTableBodyProps {}

export const DataTableBody = forwardRef<
  HTMLTableSectionElement,
  DataTableBodyProps
>(function DataTableBody(props, ref) {
  const { sortedRows, activeColumns } = useDataTableContext();

  return (
    <RaTableBody
      ref={ref}
      items={sortedRows}
      dependencies={[activeColumns]}
      renderEmptyState={() => (
        <Box w="100%" p="200">
          No Data
        </Box>
      )}
      {...props}
    >
      {(row) => <DataTableRow key={row.id} row={row} />}
    </RaTableBody>
  );
});

DataTableBody.displayName = "DataTable.Body";
