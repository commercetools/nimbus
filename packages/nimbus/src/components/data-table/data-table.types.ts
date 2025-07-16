import type { DataTableRootProps } from "./data-table.slots"
import type { RecipeVariantProps } from "@chakra-ui/react"
import { dataTableRecipe } from "./data-table.recipe"
import type { ReactNode } from "react";

export type DataTableColumn<T = any> = {
  id: string;
  header: ReactNode;
  accessor: (row: T) => ReactNode;
  render?: (cell: { value: any; row: T; column: DataTableColumn<T> }) => ReactNode;
  isVisible?: boolean;
  isAdjustable?: boolean;
  width?: number | null;
  defaultWidth?: number | null;
  minWidth?: number | null;
  maxWidth?: number | null;
  sticky?: boolean;
  // ...other column options
};

export type DataTableRow<T = any> = T & {
  id: string;
  children?: DataTableRow<T>[];
};

export type DataTableDensity = "default" | "condensed";

/**
 * Combines the root props with Chakra UI's recipe variant props.
 * This allows the component to accept both structural props from Root
 * and styling variants from the recipe.
 */
type DataTableVariantProps = Omit<DataTableRootProps, 'columns' | 'data'> & RecipeVariantProps<typeof dataTableRecipe>;

/**
 * Main props interface for the DataTable component.
 * Extends DataTableVariantProps to include both root props and variant props,
 * while adding support for React children.
 */
export interface DataTableProps<T = any> extends DataTableVariantProps {
  columns: DataTableColumn<T>[];
  data: DataTableRow<T>[];
  visibleColumns?: string[];
  isAdjustable?: boolean;
  isRowClickable?: boolean;
  allowsSorting?: boolean;
  search?: string;
  onRowClick?: (row: DataTableRow<T>) => void;
  onDetailsClick?: (row: DataTableRow<T>) => void;
  renderDetails?: (row: DataTableRow<T>) => ReactNode;
  children?: React.ReactNode;
  density?: DataTableDensity;
}
