import { useRef } from "react";
import { useObjectRef } from "react-aria";
import { mergeRefs } from "@chakra-ui/react";
import {
  DataTableRoot,
  DataTableTable,
  DataTableHeader,
  DataTableBody,
  DataTableFooter,
  DataTableManager,
  DataTableContext,
  useDataTableContext,
} from "./components";
import type { DataTableProps } from "./data-table.types";
import { useLocalizedStringFormatter } from "@/hooks";
import { dataTableMessagesStrings } from "./data-table.messages";

// Default DataTable component that provides the standard structure
const DataTableBase = function DataTable<
  T extends object = Record<string, unknown>,
>({
  ref: forwardedRef,
  footer,
  ...props
}: DataTableProps<T> & {
  footer?: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
}) {
  const msg = useLocalizedStringFormatter(dataTableMessagesStrings);
  const localRef = useRef<HTMLDivElement>(null);
  const ref = useObjectRef(mergeRefs(localRef, forwardedRef));

  return (
    <DataTableRoot ref={ref} {...props}>
      <DataTableTable aria-label={msg.format("dataTable")}>
        <DataTableHeader aria-label={msg.format("dataTableHeader")} />
        <DataTableBody aria-label={msg.format("dataTableBody")} />
      </DataTableTable>
      {footer && <DataTableFooter>{footer}</DataTableFooter>}
    </DataTableRoot>
  );
};

// Create the DataTable namespace object as an object literal
export const DataTable = Object.assign(DataTableBase, {
  /**
   * # DataTable.Root
   *
   * The root container that provides context and state management for the entire data table.
   * Handles data processing, sorting, filtering, selection, and expansion state.
   *
   * @example
   * ```tsx
   * <DataTable.Root columns={columns} rows={rows} allowsSorting>
   *   <DataTable.Table>
   *     <DataTable.Header />
   *     <DataTable.Body />
   *   </DataTable.Table>
   * </DataTable.Root>
   * ```
   */
  Root: DataTableRoot,
  /**
   * # DataTable.Table
   *
   * The main table element that wraps the header and body components.
   * Provides the semantic HTML table structure with React Aria table behavior.
   *
   * @example
   * ```tsx
   * <DataTable.Root columns={columns} rows={rows}>
   *   <DataTable.Table>
   *     <DataTable.Header />
   *     <DataTable.Body />
   *   </DataTable.Table>
   * </DataTable.Root>
   * ```
   */
  Table: DataTableTable,
  /**
   * # DataTable.Header
   *
   * The table header section that renders column headers with sorting capabilities.
   * Automatically generates columns based on the configuration provided to Root.
   *
   * @example
   * ```tsx
   * <DataTable.Root columns={columns} rows={rows}>
   *   <DataTable.Table>
   *     <DataTable.Header />
   *     <DataTable.Body />
   *   </DataTable.Table>
   * </DataTable.Root>
   * ```
   */
  Header: DataTableHeader,
  /**
   * # DataTable.Body
   *
   * The table body section that renders all data rows with selection and expansion capabilities.
   * Handles empty states and provides accessibility features for row navigation.
   *
   * @example
   * ```tsx
   * <DataTable.Root columns={columns} rows={rows}>
   *   <DataTable.Table>
   *     <DataTable.Header />
   *     <DataTable.Body />
   *   </DataTable.Table>
   * </DataTable.Root>
   * ```
   */
  Body: DataTableBody,
  /**
   * # DataTable.Footer
   *
   * Optional footer section for displaying summary information, pagination, or actions.
   * Positioned below the table with proper styling integration.
   *
   * @example
   * ```tsx
   * <DataTable.Root columns={columns} rows={rows}>
   *   <DataTable.Table>
   *     <DataTable.Header />
   *     <DataTable.Body />
   *   </DataTable.Table>
   *   <DataTable.Footer>
   *     <Pagination />
   *   </DataTable.Footer>
   * </DataTable.Root>
   * ```
   */
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
  /**
   * # DataTable.Context
   *
   * React context that provides shared state and configuration to all table components.
   * Used internally for component coordination - not typically used directly.
   *
   * @example
   * ```tsx
   * const context = useContext(DataTable.Context);
   * ```
   */
  Context: DataTableContext,
  /**
   * # DataTable.useDataTableContext
   *
   * Hook that provides access to the DataTable context with proper error handling.
   * Throws an error if used outside of a DataTable.Root provider.
   *
   * @example
   * ```tsx
   * const { columns, rows, sortDescriptor } = DataTable.useDataTableContext();
   * ```
   */
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
  DataTableBody as _DataTableBody,
  DataTableFooter as _DataTableFooter,
  DataTableManager as _DataTableManager,
};
