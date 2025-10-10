import type { ReactNode, FC, Ref } from "react";
import type {
  SortDirection as RaSortDirection,
  TableHeaderProps as RaTableHeaderProps,
  ColumnProps as RaColumnProps,
  TableBodyProps as RaTableBodyProps,
  RowProps as RaRowProps,
  CellProps as RaCellProps,
  Selection,
} from "react-aria-components";
import type {
  HTMLChakraProps,
  SlotRecipeProps,
  UnstyledProp,
} from "@chakra-ui/react";

/**
 * Base recipe props interface that combines Chakra UI's recipe props
 * with the unstyled prop option for the div element.
 */
type DataTableSlotRecipeProps = SlotRecipeProps<"datatable"> &
  UnstyledProp & {
    truncated?: boolean;
    density?: "default" | "condensed";
  };

/**
 * Root props interface that extends Chakra's HTML props with our recipe props.
 * This creates a complete set of props for the root element, combining
 * HTML attributes, Chakra's styling system, and our custom recipe props.
 */

export type DataTableRootProps = HTMLChakraProps<
  "div",
  DataTableSlotRecipeProps
>;

// Wrapper slot for react aria `Table` component
export type DataTableTableSlotProps = Omit<
  HTMLChakraProps<"table">,
  "translate"
> & {
  translate?: "yes" | "no";
  /**
   * React ref to be forwarded to the table element
   */
  ref?: React.Ref<HTMLTableElement>;
};

export type DataTableHeaderSlotProps = HTMLChakraProps<"tr">;
export type DataTableColumnSlotProps = HTMLChakraProps<"th">;
export type DataTableBodySlotProps = HTMLChakraProps<"tbody">;
export type DataTableRowSlotProps = HTMLChakraProps<"tr">;
export type DataTableCellSlotProps = HTMLChakraProps<"td">;

export type DataTableContextValue<T extends object = Record<string, unknown>> =
  {
    columns: DataTableColumnItem<T>[];
    data: DataTableRowItem<T>[];
    visibleColumns?: string[];
    renderEmptyState?: RaTableBodyProps<T>["renderEmptyState"];
    search?: string;
    sortDescriptor?: SortDescriptor;
    selectedKeys?: Selection;
    defaultSelectedKeys?: Selection;
    expanded: Record<string, boolean>;
    allowsSorting?: boolean;
    selectionMode?: "none" | "single" | "multiple";
    disallowEmptySelection?: boolean;
    isRowClickable?: boolean;
    maxHeight?: string | number;
    isTruncated?: boolean;
    density?: "default" | "condensed";
    nestedKey?: string;
    onSortChange?: (descriptor: SortDescriptor) => void;
    onSelectionChange?: (keys: Selection) => void;
    onRowClick?: (row: DataTableRowItem<T>) => void;
    toggleExpand: (id: string) => void;
    activeColumns: DataTableColumnItem<T>[];
    filteredRows: DataTableRowItem<T>[];
    sortedRows: DataTableRowItem<T>[];
    showExpandColumn: boolean;
    showSelectionColumn: boolean;
    disabledKeys?: Selection;
    onRowAction?: (
      row: DataTableRowItem<T>,
      action: "click" | "select"
    ) => void;
    isResizable?: boolean;
    pinnedRows: Set<string>;
    onPinToggle?: (rowId: string) => void;
    togglePin: (id: string) => void;
  };

export type SortDirection = RaSortDirection;

export type SortDescriptor = {
  column: string;
  direction: SortDirection;
};

export type DataTableColumnItem<T extends object = Record<string, unknown>> = {
  id: string;
  header: ReactNode;
  accessor: (row: T) => ReactNode;
  render?: (cell: {
    value: unknown;
    row: T;
    column: DataTableColumnItem<T>;
  }) => ReactNode;
  isVisible?: boolean;
  isResizable?: boolean;
  width?: number | null;
  defaultWidth?: number | null;
  minWidth?: number | null;
  maxWidth?: number | null;
  sticky?: boolean;
  isSortable?: boolean;
  isRowHeader?: boolean;
  headerIcon?: ReactNode;
  [key: string]: unknown;
};

export type DataTableRowItem<T extends object = Record<string, unknown>> = T & {
  id: string;
  isDisabled?: boolean;
  // Children can now be either nested table rows OR arbitrary React content
  // Note: The actual nested key is flexible and specified via nestedKey prop
  [key: string]: unknown;
};

export type DataTableDensity = "default" | "condensed";

type DataTableRecipeVariantProps = {
  /**
   * Truncated variant
   * @default false
   */
  truncated?: boolean;
  /**
   * Density variant
   * @default "default"
   */
  density?: "default" | "condensed";
};

/**
 * Combines the root props with Chakra UI's recipe variant props.
 * This allows the component to accept both structural props from Root
 * and styling variants from the recipe.
 */
type DataTableVariantProps = Omit<DataTableRootProps, "columns" | "data"> &
  DataTableRecipeVariantProps;

/**
 * Main props interface for the DataTable component.
 * Extends DataTableVariantProps to include both root props and variant props,
 * while adding support for React children.
 */
export type DataTableProps<T extends object = Record<string, unknown>> = Omit<
  DataTableVariantProps,
  "truncated"
> & {
  /**
   * React ref to be forwarded to the root element
   */
  ref?: React.Ref<HTMLDivElement>;
  columns: DataTableColumnItem<T>[];
  unstyled?: boolean;
  data: DataTableRowItem<T>[];
  visibleColumns?: string[];
  renderEmptyState?: RaTableBodyProps<T>["renderEmptyState"];
  isResizable?: boolean;
  isRowClickable?: boolean;
  allowsSorting?: boolean;
  search?: string;
  maxHeight?: string | number;
  sortDescriptor?: SortDescriptor;
  defaultSortDescriptor?: SortDescriptor;
  onSortChange?: (descriptor: SortDescriptor) => void;
  selectionMode?: "none" | "single" | "multiple";
  selectionBehavior?: "toggle" | "replace";
  disallowEmptySelection?: boolean;
  selectedKeys?: Selection;
  defaultSelectedKeys?: Selection;
  onSelectionChange?: (keys: Selection) => void;
  onRowClick?: (row: DataTableRowItem<T>) => void;
  onDetailsClick?: (row: DataTableRowItem<T>) => void;
  renderDetails?: (row: DataTableRowItem<T>) => ReactNode;
  children?: ReactNode;
  density?: DataTableDensity;
  isTruncated?: boolean;
  footer?: ReactNode;
  nestedKey?: string;
  disabledKeys?: Selection;
  onRowAction?: (row: DataTableRowItem<T>, action: "click" | "select") => void;
  pinnedRows?: Set<string>;
  defaultPinnedRows?: Set<string>;
  onPinToggle?: (rowId: string) => void;
};

/**Combined props for the TableHeader element (Chakra styles + Aria behavior). */
export type DataTableHeaderProps<T extends DataTableColumnItem> =
  RaTableHeaderProps<T> &
    DataTableHeaderSlotProps & { ref?: Ref<HTMLTableSectionElement> };

/** Combined props for the Column element (Chakra styles + Aria behavior). */
export type DataTableColumnProps = RaColumnProps &
  Omit<DataTableColumnSlotProps, "width" | "minWidth" | "maxWidth"> & {
    ref?: Ref<HTMLTableCellElement>;
    column?: DataTableColumnItem;
    unstyled?: boolean;
    isInternalColumn?: boolean;
    tabIndex?: number;
  };
/** Type signature for the `DataTable.Column` sub-component. */
export type DataTableColumnComponent = FC<DataTableColumnProps>;

/** Combined props for the TableBody element (Chakra styles + Aria behavior). */
export type DataTableBodyProps<T extends DataTableRowItem> =
  RaTableBodyProps<T> &
    DataTableBodySlotProps & { ref?: Ref<HTMLTableSectionElement> };

/** Combined props for the Row element (Chakra styles + Aria behavior). */
export type DataTableRowProps<T extends DataTableRowItem> = RaRowProps<T> &
  DataTableRowSlotProps & {
    ref?: Ref<HTMLTableRowElement>;
    row: T;
    depth?: number;
  };

/** Combined props for the Cell element (Chakra styles + Aria behavior). */
export type DataTableCellProps = RaCellProps &
  DataTableCellSlotProps & {
    ref?: Ref<HTMLTableCellElement>;
    isDisabled?: boolean;
  };
