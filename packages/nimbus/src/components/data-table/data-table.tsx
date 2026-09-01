import { lazy, Suspense, useRef } from "react";
import { useObjectRef } from "react-aria";
import { mergeRefs } from "@/utils";
import {
  DataTableRoot,
  DataTableTable,
  DataTableHeader,
  DataTableBody,
  DataTableRow,
  DataTableCell,
  DataTableColumn,
  DataTableFooter,
  DataTableContext,
  useDataTableContext,
} from "./components";
import type { DataTableProps } from "./data-table.types";
import { useLocalizedStringFormatter } from "@/hooks";
import { dataTableMessagesStrings } from "./data-table.messages";

// Lazy-load the Manager (settings drawer) to keep Drawer, Tabs, DraggableList,
// and SearchInput out of the core DataTable chunk. These heavy dependencies are
// only needed when a consumer explicitly renders <DataTable.Manager />.
const LazyManager = lazy(() =>
  import("./components/data-table.manager").then((m) => ({
    default: m.DataTableManager,
  }))
);

/**
 * DataTable.Manager - Manager component for the data table
 *
 * Provides a settings drawer for column visibility and layout configuration.
 * Lazy-loaded so the heavy dependencies (Drawer, Tabs, DraggableList) are only
 * fetched when this component is rendered.
 *
 * @internal Suspense wrapper so consumers don't need their own boundary.
 * @supportsStyleProps
 */
const DataTableManager: React.FC = () => (
  <Suspense fallback={null}>
    <LazyManager />
  </Suspense>
);
DataTableManager.displayName = "DataTable.Manager";

// Default DataTable component that provides the standard structure
const DataTableBase = function DataTable<
  T extends object = Record<string, unknown>,
>({
  ref: forwardedRef,
  footer,
  dragAndDropHooks,
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
      <DataTableTable
        aria-label={msg.format("dataTable")}
        dragAndDropHooks={dragAndDropHooks}
      >
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
   * # DataTable.Row
   *
   * Individual row component that renders data cells and handles row-level interactions.
   * Use directly for custom row rendering in compound composition patterns.
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
  Row: DataTableRow,
  /**
   * # DataTable.Cell
   *
   * Individual cell component that displays data values with proper accessibility attributes.
   * Use directly for custom cell rendering in compound composition patterns.
   *
   * @example
   * ```tsx
   * <DataTable.Cell>Cell content</DataTable.Cell>
   * ```
   */
  Cell: DataTableCell,
  /**
   * # DataTable.Column
   *
   * Individual column header component that handles sorting interactions.
   * Use directly for custom header rendering in compound composition patterns.
   *
   * @example
   * ```tsx
   * <DataTable.Column allowsSorting>Column Title</DataTable.Column>
   * ```
   */
  Column: DataTableColumn,
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
  DataTableRow as _DataTableRow,
  DataTableCell as _DataTableCell,
  DataTableColumn as _DataTableColumn,
  DataTableFooter as _DataTableFooter,
};
// Docgen uses the source variable name as displayName → filename, so the
// wrapper must be named DataTableManager (not DataTableManagerLazy) to
// produce the expected DataTableManager.json type-data file.
export { DataTableManager as _DataTableManager };
