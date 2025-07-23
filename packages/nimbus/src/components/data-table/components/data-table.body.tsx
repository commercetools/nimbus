import { forwardRef } from "react";
import { TableBody as AriaTableBody, Row as AriaRow, Cell as AriaCell } from "react-aria-components";
import { useDataTableContext } from "./data-table.root";
import { DataTableRow } from "./data-table.row";

export interface DataTableBodyProps {}

export const DataTableBody = forwardRef<HTMLTableSectionElement, DataTableBodyProps>(
  function DataTableBody(props, ref) {
    const {
      sortedRows,
      visibleCols,
      showExpandColumn,
      showSelectionColumn,
    } = useDataTableContext();

    return (
      <AriaTableBody ref={ref} {...props}>
        {sortedRows.length === 0 ? (
          <AriaRow>
            <AriaCell
              colSpan={
                visibleCols.length +
                (showExpandColumn ? 1 : 0) +
                (showSelectionColumn ? 1 : 0)
              }
            >
              No data
            </AriaCell>
          </AriaRow>
        ) : (
          sortedRows.map((row) => (
            <DataTableRow key={row.id} row={row} />
          ))
        )}
      </AriaTableBody>
    );
  }
);

DataTableBody.displayName = "DataTable.Body"; 