import { createSlotRecipeContext } from "@chakra-ui/react";
import { buttonGroupRecipe } from "./button-group.recipe";
import type {
  ButtonGroupButtonProps,
  ButtonGroupProps,
} from "./button-group.types";
import {
  ToggleButton as RacToggleButton,
  ToggleButtonGroup as RacToggleButtonGroup,
} from "react-aria-components";

const { withContext, withProvider } = createSlotRecipeContext({
  recipe: buttonGroupRecipe,
});

export const ButtonGroupRoot = withProvider<
  typeof RacToggleButtonGroup,
  ButtonGroupProps
>(RacToggleButtonGroup, "root");

export const ButtonGroupButton = withContext<
  typeof RacToggleButton,
  ButtonGroupButtonProps
>(RacToggleButton, "button");
