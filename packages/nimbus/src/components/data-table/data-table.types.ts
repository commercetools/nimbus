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
import type { HTMLChakraProps, UnstyledProp } from "@chakra-ui/react";
import type { UPDATE_ACTIONS } from "./constants";
import type { OmitInternalProps } from "../../type-utils";

// ============================================================
// RECIPE PROPS
// ============================================================

type DataTableSlotRecipeProps = {
  /** Whether to truncate cell content with ellipsis */
  truncated?: boolean;
  /** Density variant controlling row height and padding */
  density?: "default" | "condensed";
} & UnstyledProp;

// ============================================================
// SLOT PROPS
// ============================================================

export type DataTableRootSlotProps = HTMLChakraProps<
  "div",
  DataTableSlotRecipeProps
>;

export type DataTableTableSlotProps = Omit<
  HTMLChakraProps<"table">,
  "translate"
> & {
  translate?: "yes" | "no";
  ref?: React.Ref<HTMLTableElement>;
};

export type DataTableHeaderSlotProps = HTMLChakraProps<"tr">;
export type DataTableColumnSlotProps = HTMLChakraProps<"th">;
export type DataTableBodySlotProps = HTMLChakraProps<"tbody">;
export type DataTableRowSlotProps = HTMLChakraProps<"tr">;
export type DataTableCellSlotProps = HTMLChakraProps<"td">;

// ============================================================
// HELPER TYPES
// ============================================================

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
  [key: string]: unknown;
};

export type DataTableDensity = "default" | "condensed";

export type DataTableCustomSettings = {
  icon?: ReactNode;
  label: ReactNode;
  panel: ReactNode;
};

export type DataTableContextValue<T extends object = Record<string, unknown>> =
  {
    columns: DataTableColumnItem<T>[];
    rows: DataTableRowItem<T>[];
    visibleColumns?: string[];
    onSettingsChange?: (
      action:
        | (typeof UPDATE_ACTIONS)[keyof typeof UPDATE_ACTIONS]
        | string
        | undefined
    ) => void;
    renderEmptyState?: RaTableBodyProps<T>["renderEmptyState"];
    search?: string;
    sortDescriptor?: SortDescriptor;
    selectedKeys?: Selection;
    defaultSelectedKeys?: Selection;
    expanded: Set<string>;
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
    onColumnsChange?: (columns: DataTableColumnItem<T>[]) => void;
    onVisibilityChange?: (visibleColumnIds: string[]) => void;
  };

export type CustomSettingsContextValue = {
  customSettings?: DataTableCustomSettings;
};

type DataTableVariantProps = OmitInternalProps<
  DataTableRootSlotProps,
  "columns" | "rows"
>;

// ============================================================
// MAIN PROPS
// ============================================================

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
  rows: DataTableRowItem<T>[];
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
  /** Controlled expansion state - map of row IDs to their expanded state */
  expandedRows?: Set<string>;
  /** Default expansion state for uncontrolled mode */
  defaultExpandedRows?: Set<string>;
  /** Callback fired when expansion state changes */
  onExpandRowsChange?: (expanded: Set<string>) => void;
  pinnedRows?: Set<string>;
  defaultPinnedRows?: Set<string>;
  onPinToggle?: (rowId: string) => void;
  onColumnsChange?: (columns: DataTableColumnItem<T>[]) => void;
  onSettingsChange?: (
    action:
      | (typeof UPDATE_ACTIONS)[keyof typeof UPDATE_ACTIONS]
      | string
      | undefined
  ) => void;
  customSettings?: DataTableCustomSettings;
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

/**
 * Type for column list items used in the DataTable.Manager component
 * with DraggableList for managing column visibility and order.
 */
export type ColumnManagerListItem = {
  id: string;
  label: React.ReactNode;
};
