import { createSlotRecipeContext } from "@chakra-ui/react/styled-system";
import type {
  ToggleButtonGroupButtonProps,
  ToggleButtonGroupProps,
  ToggleButtonGroupButtonComponent,
} from "./toggle-button-group.types";
import { ToggleButtonGroup as RacToggleButtonGroup } from "react-aria-components";
import { ToggleButton } from "@/components/toggle-button/toggle-button";

const { withContext, withProvider } = createSlotRecipeContext({
  key: "nimbusToggleButtonGroup",
});

export const ToggleButtonGroupRoot = withProvider<
  typeof RacToggleButtonGroup,
  ToggleButtonGroupProps
>(RacToggleButtonGroup, "root");

export const ToggleButtonGroupButton: ToggleButtonGroupButtonComponent =
  withContext<HTMLButtonElement, ToggleButtonGroupButtonProps>(
    ToggleButton,
    "button"
  );
