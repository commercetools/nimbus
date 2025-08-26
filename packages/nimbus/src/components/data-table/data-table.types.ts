import type { ReactNode, FC } from "react";
import type { RecipeVariantProps } from "@chakra-ui/react/styled-system";
import type {
  SortDirection as RaSortDirection,
  ColumnProps as RaColumnProps,
  Selection,
} from "react-aria-components";
import { dataTableRecipe } from "./data-table.recipe";
import type { DataTableRootProps } from "./data-table.slots";

export interface DataTableContextValue<
  T extends object = Record<string, unknown>,
> {
  columns: DataTableColumnItem<T>[];
  data: DataTableRowItem<T>[];
  visibleColumns?: string[];
  search?: string;
  sortDescriptor?: SortDescriptor;
  selectedKeys?: Selection;
  defaultSelectedKeys?: Selection;
  expanded: Record<string, boolean>;
  allowsSorting?: boolean;
  selectionMode?: "none" | "single" | "multiple";
  disallowEmptySelection?: boolean;
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
  onRowAction?: (row: DataTableRowItem<T>, action: "click" | "select") => void;
  isResizable?: boolean;
  pinnedRows: Set<string>;
  onPinToggle?: (rowId: string) => void;
  togglePin: (id: string) => void;
}

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
};

export type DataTableRowItem<T extends object = Record<string, unknown>> = T & {
  id: string;
  isDisabled?: boolean;
  // Children can now be either nested table rows OR arbitrary React content
  // Note: The actual nested key is flexible and specified via nestedKey prop
  [key: string]: unknown;
};

export type DataTableDensity = "default" | "condensed";

/**
 * Combines the root props with Chakra UI's recipe variant props.
 * This allows the component to accept both structural props from Root
 * and styling variants from the recipe.
 */
type DataTableVariantProps = Omit<DataTableRootProps, "columns" | "data"> &
  RecipeVariantProps<typeof dataTableRecipe>;

/**
 * Main props interface for the DataTable component.
 * Extends DataTableVariantProps to include both root props and variant props,
 * while adding support for React children.
 */
export interface DataTableProps<T extends object = Record<string, unknown>>
  extends DataTableVariantProps {
  columns: DataTableColumnItem<T>[];
  data: DataTableRowItem<T>[];
  visibleColumns?: string[];
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
  onDetailsClick?: (row: DataTableRowItem<T>) => void;
  renderDetails?: (row: DataTableRowItem<T>) => ReactNode;
  children?: React.ReactNode;
  density?: DataTableDensity;
  isTruncated?: boolean;
  footer?: React.ReactNode;
  nestedKey?: string;
  disabledKeys?: Selection;
  onRowAction?: (row: DataTableRowItem<T>, action: "click" | "select") => void;
  pinnedRows?: Set<string>;
  defaultPinnedRows?: Set<string>;
  onPinToggle?: (rowId: string) => void;
}

/** Combined props for the Column element (Chakra styles + Aria behavior). */
export type DataTableColumnProps = RaColumnProps & {
  ref?: React.Ref<HTMLTableCellElement>;
  column?: DataTableColumnItem;
  unstyled?: boolean;
  isInternalColumn?: boolean;
  tabIndex?: number;
};

/** Type signature for the `DataTable.Column` sub-component. */
export type DataTableColumnComponent = FC<DataTableColumnProps>;
