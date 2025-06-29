import type {
  TableProps,
  TableHeaderProps,
  TableBodyProps,
  ColumnProps,
  RowProps,
  CellProps,
  CheckboxProps,
  ButtonProps,
  Key,
  Selection,
  SortDescriptor,
} from "react-aria-components";
import type { FancyTableRecipeProps } from "./fancy-table.slots";

// Base interfaces for table data
export interface FancyTableColumn {
  id: string;
  name: string;
  isRowHeader?: boolean;
  allowsSorting?: boolean;
  width?: number;
  minWidth?: number;
  maxWidth?: number;
}

export interface FancyTableItem {
  id: Key;
  [key: string]: any;
}

// Main FancyTable component props
export interface FancyTableProps<T extends FancyTableItem = FancyTableItem>
  extends Omit<TableProps, "children">,
    FancyTableRecipeProps {
  /** Array of items to display in the table */
  items?: T[];
  /** Array of column definitions */
  columns?: FancyTableColumn[];
  /** Custom render function for table cells */
  renderCell?: (item: T, column: FancyTableColumn) => React.ReactNode;
  /** Custom render function for empty state */
  renderEmptyState?: () => React.ReactNode;
  /** Whether to show selection checkboxes */
  selectionMode?: "none" | "single" | "multiple";
  /** Whether to allow drag and drop */
  allowsDragging?: boolean;
  /** Whether to show column resizers */
  allowsResizing?: boolean;
  /** Custom drag preview render function */
  renderDragPreview?: (items: T[]) => React.ReactNode;
  /** Callback when items are reordered */
  onReorder?: (
    keys: Key[],
    target: { key: Key; dropPosition: "before" | "after" }
  ) => void;
  /** Callback when items are moved to another table */
  onItemsMove?: (keys: Key[]) => void;
  /** Children for custom table structure */
  children?: React.ReactNode;
}

// FancyTable Header component props
export interface FancyTableHeaderProps<T extends object = object>
  extends TableHeaderProps<T> {
  /** Array of column definitions */
  columns?: FancyTableColumn[];
  /** Children render function or elements */
  children?:
    | CollectionChildren<T>
    | ((column: FancyTableColumn) => React.ReactNode);
}

// FancyTable Body component props
export interface FancyTableBodyProps<T extends FancyTableItem = FancyTableItem>
  extends TableBodyProps<T> {
  /** Array of column definitions for rendering cells */
  columns?: FancyTableColumn[];
  /** Custom render function for table cells */
  renderCell?: (item: T, column: FancyTableColumn) => React.ReactNode;
}

// FancyTable Row component props
export interface FancyTableRowProps<T extends FancyTableItem = FancyTableItem>
  extends Omit<RowProps<T>, "columns"> {
  /** Array of column definitions */
  columns?: FancyTableColumn[];
  /** Custom render function for table cells */
  renderCell?: (item: T, column: FancyTableColumn) => React.ReactNode;
  /** The item data for this row */
  item?: T;
}

// FancyTable Column component props
export interface FancyTableColumnProps extends ColumnProps {
  /** Whether this column allows resizing */
  allowsResizing?: boolean;
  /** Column width configuration */
  width?: number;
  minWidth?: number;
  maxWidth?: number;
}

// FancyTable Cell component props
export interface FancyTableCellProps extends CellProps {
  /** The column definition */
  column?: FancyTableColumn;
  /** The item data */
  item?: FancyTableItem;
}

// Utility types for drag and drop
export interface DragPreviewProps {
  items: FancyTableItem[];
  count: number;
}

export interface DropOperation {
  type: "insert" | "reorder" | "root";
  target?: {
    key: Key;
    dropPosition: "before" | "after";
  };
  keys: Set<Key>;
}

// Selection and sorting types
export interface FancyTableState<T extends FancyTableItem = FancyTableItem> {
  items: T[];
  selectedKeys: Selection;
  sortDescriptor?: SortDescriptor;
  isLoading?: boolean;
}

// Event handler types
export interface FancyTableEventHandlers<
  T extends FancyTableItem = FancyTableItem,
> {
  onSelectionChange?: (keys: Selection) => void;
  onSortChange?: (descriptor: SortDescriptor) => void;
  onRowAction?: (key: Key) => void;
  onDragStart?: (keys: Set<Key>) => void;
  onDragEnd?: (keys: Set<Key>, operation: DropOperation) => void;
}

// Accessibility and interaction types
export interface FancyTableAccessibilityProps {
  /** Accessible label for the table */
  "aria-label"?: string;
  /** ID of element that labels the table */
  "aria-labelledby"?: string;
  /** Description of the table */
  "aria-describedby"?: string;
}

// Combined props for the main component
export interface FancyTableComponentProps<
  T extends FancyTableItem = FancyTableItem,
> extends FancyTableProps<T>,
    FancyTableEventHandlers<T>,
    FancyTableAccessibilityProps {}
