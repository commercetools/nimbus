import { createSlotRecipeContext } from "@chakra-ui/react";
import { buttonGroupRecipe } from "./toggle-button-group.recipe";
import type {
  ToggleButtonGroupButtonProps,
  ToggleButtonGroupProps,
} from "./toggle-button-group.types";
import {
  ToggleButton as RacToggleButton,
  ToggleButtonGroup as RacToggleButtonGroup,
} from "react-aria-components";

const { withContext, withProvider } = createSlotRecipeContext({
  recipe: buttonGroupRecipe,
});

export const ToggleButtonGroupRoot = withProvider<
  typeof RacToggleButtonGroup,
  ToggleButtonGroupProps
>(RacToggleButtonGroup, "root");

export const ToggleButtonGroupButton = withContext<
  typeof RacToggleButton,
  ToggleButtonGroupButtonProps
>(RacToggleButton, "button");
