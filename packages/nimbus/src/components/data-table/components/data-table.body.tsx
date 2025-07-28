import { forwardRef } from "react";
import { TableBody as RaTableBody, Row as RaRow, Cell as RaCell } from "react-aria-components";
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
      <RaTableBody ref={ref} {...props}>
        {sortedRows.length === 0 ? (
          <RaRow>
            <RaCell
              colSpan={
                visibleCols.length +
                (showExpandColumn ? 1 : 0) +
                (showSelectionColumn ? 1 : 0)
              }
            >
              No data
            </RaCell>
          </RaRow>
        ) : (
          sortedRows.map((row) => (
            <DataTableRow key={row.id} row={row} />
          ))
        )}
      </RaTableBody>
    );
  }
);

DataTableBody.displayName = "DataTable.Body"; 