import { createSlotRecipeContext } from "@chakra-ui/react";
import { buttonGroupRecipe } from "./button-group.recipe";
import type {
  ButtonGroupButtonSlotProps,
  ButtonGroupRootSlotProps,
} from "./button-group.types";

const { withContext, withProvider } = createSlotRecipeContext({
  recipe: buttonGroupRecipe,
});

/**
 * Root component that provides the styling context for the ButtonGroup component.
 * Uses Chakra UI's recipe context system for consistent styling across instances.
 */
export const ButtonGroupRoot = withProvider<
  HTMLDivElement,
  ButtonGroupRootSlotProps
>("div", "root");

export const ButtonGroupButton = withContext<
  HTMLButtonElement,
  ButtonGroupButtonSlotProps
>("button", "button");
