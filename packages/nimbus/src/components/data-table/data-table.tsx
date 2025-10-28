import { useRef } from "react";
import { useIntl } from "react-intl";
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
import { DataTableManager } from "./components/data-table.manager";
import {
  DataTableExpandButton,
  DataTableNestedIcon,
  DataTableSelectionCell,
} from "./data-table.slots";
import type { DataTableProps } from "./data-table.types";
import { messages } from "./data-table.i18n";

// Default DataTable component that provides the standard structure
const DataTableBase = function DataTable({
  ref: forwardedRef,
  footer,
  ...props
}: DataTableProps & {
  footer?: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
}) {
  const intl = useIntl();
  const localRef = useRef<HTMLDivElement>(null);
  const ref = useObjectRef(mergeRefs(localRef, forwardedRef));

  return (
    <DataTableRoot ref={ref} {...props}>
      <DataTableTable aria-label={intl.formatMessage(messages.dataTable)}>
        <DataTableHeader
          aria-label={intl.formatMessage(messages.dataTableHeader)}
        />
        <DataTableBody
          aria-label={intl.formatMessage(messages.dataTableBody)}
        />
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
  /**
   * # DataTable.Manager
   *
   * A settings panel that allows users to manage table columns visibility and layout.
   * Opens in a drawer with tabs for "Visible columns" and "Layout settings".
   * Uses drag-and-drop to reorder columns.
   *
   * @example
   * ```tsx
   * <DataTable.Root columns={columns} rows={rows}>
   *   <DataTable.Manager />
   *   <DataTable.Table>
   *     <DataTable.Header />
   *     <DataTable.Body />
   *   </DataTable.Table>
   * </DataTable.Root>
   * ```
   */
  Manager: DataTableManager,
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
  DataTableManager as _DataTableManager,
  DataTableExpandButton as _DataTableExpandButton,
  DataTableNestedIcon as _DataTableNestedIcon,
  DataTableSelectionCell as _DataTableSelectionCell,
};
