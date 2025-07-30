/* eslint-disable @typescript-eslint/no-empty-object-type */
import {
  type HTMLChakraProps,
  createSlotRecipeContext,
  type RecipeVariantProps,
} from "@chakra-ui/react";
import { toolbarSlotRecipe } from "./toolbar.recipe";

const { withProvider, withContext } = createSlotRecipeContext({
  recipe: toolbarSlotRecipe,
});

/**
 * Toolbar.Root slot
 */

export interface ToolbarRootSlotProps
  extends HTMLChakraProps<"div">,
    RecipeVariantProps<typeof toolbarSlotRecipe> {}

export const ToolbarRoot = withProvider<HTMLDivElement, ToolbarRootSlotProps>(
  "div",
  "root"
);

/**
 * Toolbar.Group slot
 */
export interface ToolbarGroupSlotProps extends HTMLChakraProps<"div"> {}

export const ToolbarGroup = withContext<HTMLDivElement, ToolbarGroupSlotProps>(
  "div",
  "group"
);

/**
 * Toolbar.Separator slot
 */
export interface ToolbarSeparatorSlotProps extends HTMLChakraProps<"div"> {}

export const ToolbarSeparator = withContext<
  HTMLDivElement,
  ToolbarSeparatorSlotProps
>("div", "separator");
