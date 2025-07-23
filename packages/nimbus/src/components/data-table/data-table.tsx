import { forwardRef } from "react";
import { DataTableRoot } from "./components/data-table.root";
import { DataTableTable } from "./components/data-table.table";
import { DataTableHeader } from "./components/data-table.header";
import { DataTableBody } from "./components/data-table.body";
import { DataTableRow } from "./components/data-table.row";
import { DataTableFooter } from "./components/data-table.footer";
import {
  DataTableExpandButton,
  DataTableDetailsButton,
  DataTableNestedIcon,
  DataTableSelectionCell,
} from "./data-table.slots";
import type { DataTableProps } from "./data-table.types";

// Default DataTable component that provides the standard structure
const DataTableBase = forwardRef<HTMLDivElement, DataTableProps & { footer?: React.ReactNode }>(
  function DataTable({ footer, ...props }, ref) {
    return (
      <DataTableRoot ref={ref} {...props}>
        <DataTableTable>
          <DataTableHeader />
          <DataTableBody />
        </DataTableTable>
        {footer && <DataTableFooter>{footer}</DataTableFooter>}
      </DataTableRoot>
    );
  }
);

// Create the DataTable namespace object as an object literal
export const DataTable = Object.assign(DataTableBase, {
  Root: DataTableRoot,
  Table: DataTableTable,
  Header: DataTableHeader,
  Body: DataTableBody,
  Row: DataTableRow,
  Footer: DataTableFooter,
  ExpandButton: DataTableExpandButton,
  DetailsButton: DataTableDetailsButton,
  NestedIcon: DataTableNestedIcon,
  SelectionCell: DataTableSelectionCell,
});

/**
 * todo: get rid of this, this is needed for the react-docgen-typescript script
 * that is parsing the typescript types for our documentation. The _ underscores
 * serve as a reminder that this exports are awkward and should not be used.
 */
export {
  DataTableRoot as _DataTableRoot,
  DataTableTable as _DataTableTable,
  DataTableHeader as _DataTableHeader,
  DataTableBody as _DataTableBody,
  DataTableRow as _DataTableRow,
  DataTableFooter as _DataTableFooter,
  DataTableExpandButton as _DataTableExpandButton,
  DataTableDetailsButton as _DataTableDetailsButton,
  DataTableNestedIcon as _DataTableNestedIcon,
  DataTableSelectionCell as _DataTableSelectionCell,
}; 