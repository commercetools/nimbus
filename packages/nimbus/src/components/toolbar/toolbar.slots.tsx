/* eslint-disable @typescript-eslint/no-empty-object-type */
import {
  type HTMLChakraProps,
  type SlotRecipeProps,
  type UnstyledProp,
  createSlotRecipeContext,
  type RecipeVariantProps,
} from "@chakra-ui/react";
import { toolbarRecipe } from "./toolbar.recipe";

/**
 * Base recipe props interface that combines Chakra UI's slot recipe variant props
 * with the unstyled prop option for the toolbar element.
 */

export interface ToolbarRootSlotProps
  extends Omit<
    HTMLChakraProps<"div", RecipeVariantProps<typeof toolbarRecipe>>,
    "slot"
  > {
  // insure that the `ToolbarRoot` component doesn't give a type error
  slot?: string | null | undefined;
  ref?: React.Ref<HTMLDivElement>;
}

/**
 * Group props interface for grouping toolbar items.
 */
export interface ToolbarGroupSlotProps {
  ref?: React.Ref<HTMLDivElement>;
}

/**
 * Separator props interface for toolbar separators.
 */
export interface ToolbarSeparatorSlotProps {
  ref?: React.Ref<HTMLDivElement>;
}

const { withProvider, withContext } = createSlotRecipeContext({
  recipe: toolbarRecipe,
});

export const ToolbarRoot = withProvider<HTMLDivElement, ToolbarRootSlotProps>(
  "div",
  "root"
);

export const ToolbarGroup = withContext<HTMLDivElement, ToolbarGroupSlotProps>(
  "div",
  "group"
);

export const ToolbarSeparator = withContext<
  HTMLDivElement,
  ToolbarSeparatorSlotProps
>("div", "separator");
