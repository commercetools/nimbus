import { createSlotRecipeContext } from "@chakra-ui/react";
import { buttonGroupRecipe } from "./button-group.recipe";
import type {
  ButtonGroupButtonComponent,
  ButtonGroupButtonProps,
  ButtonGroupProps,
  ButtonGroupRootComponent,
} from "./button-group.types";
import {
  ToggleButton as RacToggleButton,
  ToggleButtonGroup as RacToggleButtonGroup,
} from "react-aria-components";

const { withContext, withProvider } = createSlotRecipeContext({
  recipe: buttonGroupRecipe,
});

export const ButtonGroupRoot: ButtonGroupRootComponent = withProvider<
  typeof RacToggleButtonGroup,
  ButtonGroupProps
>(RacToggleButtonGroup, "root");

export const ButtonGroupButton: ButtonGroupButtonComponent = withContext<
  typeof RacToggleButton,
  ButtonGroupButtonProps
>(RacToggleButton, "button");
