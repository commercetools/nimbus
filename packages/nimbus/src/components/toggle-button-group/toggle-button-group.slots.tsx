import { createSlotRecipeContext } from "@chakra-ui/react/styled-system";
import type {
  ToggleButtonGroupButtonProps,
  ToggleButtonGroupProps,
  ToggleButtonGroupButtonComponent,
} from "./toggle-button-group.types";
import {
  ToggleButton as RacToggleButton,
  ToggleButtonGroup as RacToggleButtonGroup,
} from "react-aria-components";

const { withContext, withProvider } = createSlotRecipeContext({
  key: "nimbusToggleButtonGroup",
});

export const ToggleButtonGroupRoot = withProvider<
  typeof RacToggleButtonGroup,
  ToggleButtonGroupProps
>(RacToggleButtonGroup, "root");

export const ToggleButtonGroupButton: ToggleButtonGroupButtonComponent =
  withContext<typeof RacToggleButton, ToggleButtonGroupButtonProps>(
    RacToggleButton,
    "button"
  );
