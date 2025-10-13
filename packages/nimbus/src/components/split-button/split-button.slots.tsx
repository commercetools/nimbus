import { createSlotRecipeContext } from "@chakra-ui/react";
import type {
  SplitButtonRootSlotProps,
  SplitButtonButtonGroupSlotProps,
  SplitButtonPrimaryButtonSlotProps,
  SplitButtonTriggerSlotProps,
} from "./split-button.types";

const { withProvider, withContext } = createSlotRecipeContext({
  key: "splitButton",
});

// Root Container
export const SplitButtonRootSlot = withProvider<
  HTMLDivElement,
  SplitButtonRootSlotProps
>("div", "root");

// Button Group Container
export const SplitButtonButtonGroupSlot = withContext<
  HTMLDivElement,
  SplitButtonButtonGroupSlotProps
>("div", "buttonGroup");

// Primary Action Button
export const SplitButtonPrimaryButtonSlot = withContext<
  HTMLButtonElement,
  SplitButtonPrimaryButtonSlotProps
>("button", "primaryButton");

// Dropdown Trigger Button
export const SplitButtonTriggerSlot = withContext<
  HTMLButtonElement,
  SplitButtonTriggerSlotProps
>("button", "dropdownTrigger");
