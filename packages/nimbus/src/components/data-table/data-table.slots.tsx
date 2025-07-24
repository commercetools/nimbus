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

export const DataTableRoot = withProvider<HTMLDivElement, DataTableRootProps>(
  "div",
  "root"
);
export const DataTableFooter = withContext<
  HTMLDivElement,
  HTMLChakraProps<"div">
>("div", "footer");
export const DataTableSelectionCell = withContext<
  HTMLTableCellElement,
  HTMLChakraProps<"td">
>("td", "selectionCell");
export const DataTableDetailsButton = withContext<
  HTMLButtonElement,
  HTMLChakraProps<"button">
>("button", "detailsButton");
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
