import { useRef } from "react";
import { useObjectRef } from "react-aria";
import { mergeRefs } from "@chakra-ui/react";
import { DataTableBody } from "./components/data-table.body";
import { DataTableCell } from "./components/data-table.cell";
import { DataTableColumn } from "./components/data-table.column";
import {
  DataTableContext,
  useDataTableContext,
} from "./components/data-table.context";
import { DataTableFooter } from "./components/data-table.footer";
import { DataTableHeader } from "./components/data-table.header";
import { DataTableRoot } from "./components/data-table.root";
import { DataTableRow } from "./components/data-table.row";
import { DataTableTable } from "./components/data-table.table";
import {
  DataTableExpandButton,
  DataTableNestedIcon,
  DataTableSelectionCell,
} from "./data-table.slots";
import type { DataTableProps } from "./data-table.types";

// Default DataTable component that provides the standard structure
const DataTableBase = function DataTable({
  ref: forwardedRef,
  footer,
  ...props
}: DataTableProps & {
  footer?: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
}) {
  const localRef = useRef<HTMLDivElement>(null);
  const ref = useObjectRef(mergeRefs(localRef, forwardedRef));

  return (
    <DataTableRoot ref={ref} {...props}>
      <DataTableTable aria-label="Data Table">
        <DataTableHeader aria-label="Data Table Header" />
        <DataTableBody aria-label="Data Table Body" />
      </DataTableTable>
      {footer && <DataTableFooter>{footer}</DataTableFooter>}
    </DataTableRoot>
  );
};

// Create the DataTable namespace object as an object literal
export const DataTable = Object.assign(DataTableBase, {
  Root: DataTableRoot,
  Table: DataTableTable,
  Header: DataTableHeader,
  Column: DataTableColumn,
  Body: DataTableBody,
  Row: DataTableRow,
  Cell: DataTableCell,
  Footer: DataTableFooter,
  ExpandButton: DataTableExpandButton,
  NestedIcon: DataTableNestedIcon,
  SelectionCell: DataTableSelectionCell,
  Context: DataTableContext,
  useDataTableContext,
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
  DataTableColumn as _DataTableColumn,
  DataTableBody as _DataTableBody,
  DataTableRow as _DataTableRow,
  DataTableCell as _DataTableCell,
  DataTableFooter as _DataTableFooter,
  DataTableExpandButton as _DataTableExpandButton,
  DataTableNestedIcon as _DataTableNestedIcon,
  DataTableSelectionCell as _DataTableSelectionCell,
};
