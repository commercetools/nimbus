import {
  createSlotRecipeContext,
  type HTMLChakraProps,
  type RecipeVariantProps,
  type UnstyledProp,
} from "@chakra-ui/react";
import type {
  TableProps,
  TableHeaderProps,
  TableBodyProps,
  ColumnProps,
  RowProps,
  CellProps,
  CheckboxProps,
} from "react-aria-components";
import { fancyTableSlotRecipe } from "./fancy-table.recipe";

/**
 * Base recipe props interface that combines Chakra UI's recipe props
 * with the unstyled prop option.
 */
export interface FancyTableRecipeProps
  extends RecipeVariantProps<typeof fancyTableSlotRecipe>,
    UnstyledProp {}

// Create slot recipe context
const { withProvider, withContext } = createSlotRecipeContext({
  recipe: fancyTableSlotRecipe,
});

// FancyTable Root
export interface FancyTableRootSlotProps
  extends HTMLChakraProps<"table", FancyTableRecipeProps & TableProps> {}

export const FancyTableRootSlot = withProvider<
  HTMLTableElement,
  FancyTableRootSlotProps
>("table", "root");

// FancyTable Container (for resizable tables)
export interface FancyTableContainerSlotProps extends HTMLChakraProps<"div"> {}

// FancyTable Header
export interface FancyTableHeaderSlotProps
  extends HTMLChakraProps<"thead", TableHeaderProps<object>> {}

export const FancyTableHeaderSlot = withContext<
  HTMLTableSectionElement,
  FancyTableHeaderSlotProps
>("thead", "header");

// FancyTable Body
export interface FancyTableBodySlotProps
  extends HTMLChakraProps<"tbody", TableBodyProps<object>> {}

export const FancyTableBodySlot = withContext<
  HTMLTableSectionElement,
  FancyTableBodySlotProps
>("tbody", "body");

// FancyTable Column
export interface FancyTableColumnSlotProps
  extends HTMLChakraProps<"th", ColumnProps> {}

export const FancyTableColumnSlot = withContext<
  HTMLTableCellElement,
  FancyTableColumnSlotProps
>("th", "column");

// FancyTable Column Header (for resizable columns)
export interface FancyTableColumnHeaderSlotProps
  extends HTMLChakraProps<"div"> {}

export const FancyTableColumnHeaderSlot = withContext<
  HTMLDivElement,
  FancyTableColumnHeaderSlotProps
>("div", "columnHeader");

// FancyTable Column Resizer
export interface FancyTableColumnResizerSlotProps
  extends HTMLChakraProps<"div"> {}

export const FancyTableColumnResizerSlot = withContext<
  HTMLDivElement,
  FancyTableColumnResizerSlotProps
>("div", "columnResizer");

// FancyTable Row
export interface FancyTableRowSlotProps
  extends HTMLChakraProps<"tr", RowProps<object>> {}

export const FancyTableRowSlot = withContext<
  HTMLTableRowElement,
  FancyTableRowSlotProps
>("tr", "row");

// FancyTable Cell
export interface FancyTableCellSlotProps
  extends HTMLChakraProps<"td", CellProps> {}

export const FancyTableCellSlot = withContext<
  HTMLTableCellElement,
  FancyTableCellSlotProps
>("td", "cell");

// FancyTable Checkbox
export interface FancyTableCheckboxSlotProps
  extends HTMLChakraProps<"div", CheckboxProps> {}

export const FancyTableCheckboxSlot = withContext<
  HTMLDivElement,
  FancyTableCheckboxSlotProps
>("div", "checkbox");

// FancyTable Drag Button
export interface FancyTableDragButtonSlotProps extends HTMLChakraProps<"div"> {}

export const FancyTableDragButtonSlot = withContext<
  HTMLDivElement,
  FancyTableDragButtonSlotProps
>("div", "dragButton");

// FancyTable Empty State
export interface FancyTableEmptyStateSlotProps extends HTMLChakraProps<"div"> {}

export const FancyTableEmptyStateSlot = withContext<
  HTMLDivElement,
  FancyTableEmptyStateSlotProps
>("div", "emptyState");

// FancyTable Sort Indicator
export interface FancyTableSortIndicatorSlotProps
  extends HTMLChakraProps<"span"> {}

export const FancyTableSortIndicatorSlot = withContext<
  HTMLSpanElement,
  FancyTableSortIndicatorSlotProps
>("span", "sortIndicator");
