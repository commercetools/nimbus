import type { ReactNode, FC, Ref } from "react";
import type {
  SortDirection as RaSortDirection,
  TableHeaderProps as RaTableHeaderProps,
  ColumnProps as RaColumnProps,
  TableBodyProps as RaTableBodyProps,
  RowProps as RaRowProps,
  CellProps as RaCellProps,
  Selection,
  DragAndDropHooks as RaDragAndDropHooks,
} from "react-aria-components";
import type {
  HTMLChakraProps,
  UnstyledProp,
} from "@chakra-ui/react/styled-system";
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
  /**
   * Drag-and-drop hooks returned by `useDragAndDrop`.
   * When provided, enables drag-and-drop on the table.
   */
  dragAndDropHooks?: RaDragAndDropHooks;
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
  align?: "start" | "center" | "end" | "stretch";
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

export type DataTableNestedContentOptions = {
  /** Collapses the nested content for the current row */
  close: () => void;
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
    renderEmptyState?: RaTableBodyProps<T>["renderEmptyState"];
    search?: string;
    sortDescriptor?: SortDescriptor;
    selectedKeys?: Selection;
    defaultSelectedKeys?: Selection;
    expanded: Set<string>;
    allowsSorting?: boolean;
    selectionMode?: "none" | "single" | "multiple";
    disallowEmptySelection?: boolean;
    maxHeight?: string | number;
    isTruncated?: boolean;
    density?: "default" | "condensed";
    nestedKey?: string;
    onSortChange?: (descriptor: SortDescriptor) => void;
    onSelectionChange?: (keys: Selection) => void;
    isRowClickable: boolean;
    hasRenderNestedContent: boolean;
    onRowClickRef: React.RefObject<
      ((row: DataTableRowItem<T>) => void) | undefined
    >;
    renderNestedContentRef: React.RefObject<
      | ((
          row: DataTableRowItem<T>,
          options: DataTableNestedContentOptions
        ) => ReactNode)
      | undefined
    >;
    toggleExpand: (id: string, columnId?: string) => void;
    activeColumns: DataTableColumnItem<T>[];
    filteredRows: DataTableRowItem<T>[];
    sortedRows: DataTableRowItem<T>[];
    showExpandColumn: boolean;
    hasExpandableContent: boolean;
    showSelectionColumn: boolean;
    showPinColumn: boolean;
    pinnedRowIds: string[];
    selectRowLabel: string;
    disabledKeys?: Selection;
    onRowActionRef: React.RefObject<
      | ((row: DataTableRowItem<T>, action: "click" | "select") => void)
      | undefined
    >;
    isResizable?: boolean;
    pinnedRows: Set<string>;
    togglePin: (id: string) => void;
    onColumnsChangeRef: React.RefObject<
      ((columns: DataTableColumnItem<T>[]) => void) | undefined
    >;
    onSettingsChangeRef: React.RefObject<
      | ((
          action:
            | (typeof UPDATE_ACTIONS)[keyof typeof UPDATE_ACTIONS]
            | string
            | undefined
        ) => void)
      | undefined
    >;
    onVisibilityChange?: (visibleColumnIds: string[]) => void;
  };

export type TableSelectionContextValue = {
  selectedKeys?: Selection;
  defaultSelectedKeys?: Selection;
  onSelectionChange?: (keys: Selection) => void;
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
  /**
   * Drag-and-drop hooks returned by `useDragAndDrop`.
   * When provided, enables row drag-and-drop reordering.
   */
  dragAndDropHooks?: RaDragAndDropHooks;
  columns: DataTableColumnItem<T>[];
  unstyled?: boolean;
  rows: DataTableRowItem<T>[];
  visibleColumns?: string[];
  renderEmptyState?: RaTableBodyProps<T>["renderEmptyState"];
  isResizable?: boolean;
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
  /** Renders a full-width nested content panel below a row when expanded. Use this when every row should render the same component template with its own data. For per-row heterogeneous content, use `nestedKey` instead. The options object provides a `close` callback for collapsing the panel from within. */
  renderNestedContent?: (
    row: DataTableRowItem<T>,
    options: DataTableNestedContentOptions
  ) => ReactNode;
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
  /** Callback fired when expansion state changes. Receives the new expanded set, the ID of the toggled row, and the column ID that triggered the expansion (if triggered by a cell click). */
  onExpandRowsChange?: (
    expanded: Set<string>,
    toggledRowId?: string,
    columnId?: string
  ) => void;
  /** Whether to show the pin column. Defaults to `true`. */
  allowsPinning?: boolean;
  /** Whether to show the expand chevron column. When `false`, rows with nested content can be expanded via row click. If `onRowClick` is also provided, both the expand toggle and `onRowClick` fire on click. Defaults to `true`. */
  allowsExpandColumn?: boolean;
  pinnedRows?: Set<string>;
  defaultPinnedRows?: Set<string>;
  onPinToggle?: (rowId: string) => void;
  onColumnsChange?: (columns: DataTableColumnItem<T>[]) => void;
  onSettingsChange?: (
    action:
      (typeof UPDATE_ACTIONS)[keyof typeof UPDATE_ACTIONS] | string | undefined
  ) => void;
  customSettings?: DataTableCustomSettings;
};

/** Render props passed to custom DataTable.Header children. */
export type DataTableColumnRenderProps = {
  columns: DataTableColumnItem[];
  allowsSorting: boolean;
};

/**Combined props for the TableHeader element (Chakra styles + Aria behavior). */
export type DataTableHeaderProps<T extends DataTableColumnItem> = Omit<
  RaTableHeaderProps<T>,
  "children"
> &
  Omit<DataTableHeaderSlotProps, "children"> & {
    ref?: Ref<HTMLTableSectionElement>;
    children?: (renderProps: DataTableColumnRenderProps) => ReactNode;
  };

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

/** Per-row state computed by DataTable.Body and passed to custom render functions. */
export type DataTableRowRenderProps = {
  isExpanded: boolean;
  isPinned: boolean;
  isFirstPinned: boolean;
  isLastPinned: boolean;
  isSinglePinned: boolean;
};

/**
 * Combined props for the TableBody element (Chakra styles + Aria behavior).
 *
 * **Reactivity constraint:** custom `children` render functions are only
 * re-invoked when row data, expansion, or pin state changes. They should
 * derive output purely from the `row` and `renderProps` arguments — closing
 * over external React state will produce stale renders. Route reactive values
 * through the `rows` array or row keys instead.
 */
export type DataTableBodyProps<T extends DataTableRowItem> = Omit<
  RaTableBodyProps<T>,
  "children"
> &
  Omit<DataTableBodySlotProps, "children"> & {
    ref?: Ref<HTMLTableSectionElement>;
    children?: (
      row: DataTableRowItem<T>,
      renderProps: DataTableRowRenderProps
    ) => ReactNode;
  };

/** Render props passed to custom DataTable.Row children for rendering cells. */
export type DataTableCellRenderProps<
  T extends object = Record<string, unknown>,
> = {
  columns: DataTableColumnItem<T>[];
  row: DataTableRowItem<T>;
  isDisabled: boolean;
};

/** Combined props for the Row element (Chakra styles + Aria behavior). */
export type DataTableRowProps<T extends DataTableRowItem> = Omit<
  RaRowProps<T>,
  "children"
> &
  Omit<DataTableRowSlotProps, "children"> & {
    ref?: Ref<HTMLTableRowElement>;
    row: T;
    depth?: number;
    children?: (renderProps: DataTableCellRenderProps<T>) => ReactNode;
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
