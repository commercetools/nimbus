import { createSlotRecipeContext } from "@chakra-ui/react/styled-system";
import type { SlotComponent } from "@/type-utils";
import type {
  SplitButtonRootSlotProps,
  SplitButtonButtonGroupSlotProps,
  SplitButtonPrimaryButtonSlotProps,
  SplitButtonTriggerSlotProps,
} from "./split-button.types";

const { withProvider, withContext } = createSlotRecipeContext({
  key: "nimbusSplitButton",
});

// Root Container
export const SplitButtonRootSlot: SlotComponent<
  HTMLDivElement,
  SplitButtonRootSlotProps
> = withProvider<HTMLDivElement, SplitButtonRootSlotProps>("div", "root");

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
