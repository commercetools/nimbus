import { useRef } from "react";
import { useLocale } from "react-aria-components";
import { useObjectRef } from "react-aria";
import { mergeRefs } from "@chakra-ui/react";
import {
  DataTableRoot,
  DataTableTable,
  DataTableHeader,
  DataTableColumn,
  DataTableBody,
  DataTableRow,
  DataTableCell,
  DataTableFooter,
  DataTableManager,
  DataTableContext,
  useDataTableContext,
} from "./components";
import {
  DataTableExpandButton,
  DataTableNestedIcon,
  DataTableSelectionCell,
} from "./data-table.slots";
import type { DataTableProps } from "./data-table.types";
import { dataTableMessages } from "./data-table.messages";

// Default DataTable component that provides the standard structure
const DataTableBase = function DataTable({
  ref: forwardedRef,
  footer,
  ...props
}: DataTableProps & {
  footer?: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
}) {
  const { locale } = useLocale();
  const localRef = useRef<HTMLDivElement>(null);
  const ref = useObjectRef(mergeRefs(localRef, forwardedRef));

  return (
    <DataTableRoot ref={ref} {...props}>
      <DataTableTable
        aria-label={dataTableMessages.getStringForLocale("dataTable", locale)}
      >
        <DataTableHeader
          aria-label={dataTableMessages.getStringForLocale(
            "dataTableHeader",
            locale
          )}
        />
        <DataTableBody
          aria-label={dataTableMessages.getStringForLocale(
            "dataTableBody",
            locale
          )}
        />
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
   * # DataTable.Column
   *
   * Individual column header component that handles sorting interactions and displays column content.
   * Used internally by Header but can be used for custom header implementations.
   *
   * @example
   * ```tsx
   * <DataTable.Root columns={columns} rows={rows}>
   *   <DataTable.Table>
   *     <DataTable.Header>
   *       <DataTable.Column column={customColumn} />
   *     </DataTable.Header>
   *     <DataTable.Body />
   *   </DataTable.Table>
   * </DataTable.Root>
   * ```
   */
  Column: DataTableColumn,
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
   * Supports selection, expansion, and click handlers for custom row actions.
   *
   * @example
   * ```tsx
   * <DataTable.Root columns={columns} rows={rows}>
   *   <DataTable.Table>
   *     <DataTable.Header />
   *     <DataTable.Body>
   *       <DataTable.Row row={customRow} />
   *     </DataTable.Body>
   *   </DataTable.Table>
   * </DataTable.Root>
   * ```
   */
  Row: DataTableRow,
  /**
   * # DataTable.Cell
   *
   * Individual cell component that displays data values with proper accessibility attributes.
   * Supports custom rendering and truncation based on table configuration.
   *
   * @example
   * ```tsx
   * <DataTable.Root columns={columns} rows={rows}>
   *   <DataTable.Table>
   *     <DataTable.Header />
   *     <DataTable.Body>
   *       <DataTable.Row>
   *         <DataTable.Cell>Custom cell content</DataTable.Cell>
   *       </DataTable.Row>
   *     </DataTable.Body>
   *   </DataTable.Table>
   * </DataTable.Root>
   * ```
   */
  Cell: DataTableCell,
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
   * # DataTable.ExpandButton
   *
   * Button component for expanding/collapsing nested rows in hierarchical data.
   * Automatically shown when data contains nested structures.
   *
   * @example
   * ```tsx
   * <DataTable.ExpandButton
   *   isExpanded={expanded}
   *   onPress={() => toggleExpand(rowId)}
   * />
   * ```
   */
  ExpandButton: DataTableExpandButton,
  /**
   * # DataTable.NestedIcon
   *
   * Icon component that indicates the nesting level and expansion state of hierarchical rows.
   * Provides visual hierarchy cues for nested data structures.
   *
   * @example
   * ```tsx
   * <DataTable.NestedIcon
   *   depth={2}
   *   isExpanded={expanded}
   *   hasChildren={hasChildren}
   * />
   * ```
   */
  NestedIcon: DataTableNestedIcon,
  /**
   * # DataTable.SelectionCell
   *
   * Specialized cell component that contains selection checkboxes or radio buttons.
   * Handles row selection state and provides accessible selection controls.
   *
   * @example
   * ```tsx
   * <DataTable.SelectionCell
   *   isSelected={selected}
   *   onSelectionChange={handleSelection}
   * />
   * ```
   */
  SelectionCell: DataTableSelectionCell,
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
