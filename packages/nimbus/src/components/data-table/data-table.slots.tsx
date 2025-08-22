import {
  type HTMLChakraProps,
  type RecipeProps,
  type UnstyledProp,
  createSlotRecipeContext,
} from "@chakra-ui/react";
import { dataTableRecipe } from "./data-table.recipe";

/**
 * Base recipe props interface that combines Chakra UI's recipe props
 * with the unstyled prop option for the div element.
 */
interface DataTableRecipeProps extends RecipeProps<"div">, UnstyledProp {
  truncated?: boolean;
  density?: "default" | "condensed";
}

/**
 * Root props interface that extends Chakra's HTML props with our recipe props.
 * This creates a complete set of props for the root element, combining
 * HTML attributes, Chakra's styling system, and our custom recipe props.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface DataTableRootProps
  extends HTMLChakraProps<"div", DataTableRecipeProps> {}

const { withProvider, withContext } = createSlotRecipeContext({
  key: "data-table",
  recipe: dataTableRecipe,
});

/**
 * Root component that provides the styling context for the DataTable component.
 * Uses Chakra UI's recipe context system for consistent styling across instances.
 */
// Wrapper slot for react aria `ResizableTableContainer` component
export const DataTableRoot = withProvider<HTMLDivElement, DataTableRootProps>(
  "div",
  "root"
);

// Wrapper slot for react aria `Table` component
export type DataTableTableSlotProps = HTMLChakraProps<"table">;
export const DataTableTableSlot = withContext<
  HTMLTableElement,
  DataTableTableSlotProps
>("table", "table");

export type DataTableColumnSlotProps = HTMLChakraProps<"th"> & UnstyledProp;
export const DataTableColumnSlot = withContext<
  HTMLTableCellElement,
  DataTableColumnSlotProps
>("th", "column");

export const DataTableFooter = withContext<
  HTMLDivElement,
  HTMLChakraProps<"div">
>("footer", "footer");
export const DataTableSelectionCell = withContext<
  HTMLTableCellElement,
  HTMLChakraProps<"td">
>("td", "selectionCell");
export const DataTableExpandButton = withContext<
  HTMLButtonElement,
  HTMLChakraProps<"button">
>("button", "expandButton");
export const DataTableNestedIcon = withContext<
  HTMLSpanElement,
  HTMLChakraProps<"span">
>("span", "nestedIcon");
export const DataTableHeaderSortIcon = withContext<
  HTMLSpanElement,
  HTMLChakraProps<"span">
>("span", "headerSortIcon");
export const DataTableColumnResizer = withContext<
  HTMLDivElement,
  HTMLChakraProps<"div">
>("div", "columnResizer");
