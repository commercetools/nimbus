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

export const ToolbarRootSlot = withProvider<
  HTMLDivElement,
  ToolbarRootSlotProps
>("div", "root");

/**
 * Toolbar.Group slot
 */
export interface ToolbarGroupSlotProps extends HTMLChakraProps<"div"> {}

export const ToolbarGroupSlot = withContext<
  HTMLDivElement,
  ToolbarGroupSlotProps
>("div", "group");

/**
 * Toolbar.ToggleButtonGroup slot
 */
export interface ToolbarToggleButtonGroupSlotProps
  extends HTMLChakraProps<"div"> {}

export const ToolbarToggleButtonGroupSlot = withContext<
  HTMLDivElement,
  ToolbarToggleButtonGroupSlotProps
>("div", "group"); // <-- reuse the same slot, as there are no styling diff's

/**
 * Toolbar.Separator slot
 */
export interface ToolbarSeparatorSlotProps extends HTMLChakraProps<"div"> {}

export const ToolbarSeparatorSlot = withContext<
  HTMLDivElement,
  ToolbarSeparatorSlotProps
>("div", "separator");
