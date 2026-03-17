import {
  createSlotRecipeContext,
  type HTMLChakraProps,
} from "@chakra-ui/react/styled-system";
import type {
  SelectRootSlotProps,
  SelectTriggerSlotProps,
  SelectTriggerLabelSlotProps,
  SelectOptionsSlotProps,
  SelectOptionSlotProps,
  SelectOptionGroupSlotProps,
} from "./select.types";

const { withProvider, withContext } = createSlotRecipeContext({
  key: "nimbusSelect",
});

// Select
export const SelectRootSlot = withProvider<HTMLDivElement, SelectRootSlotProps>(
  "div",
  "root"
);

export const SelectLeadingElementSlot = withContext<
  HTMLDivElement,
  HTMLChakraProps<"div">
>("div", "leadingElement");

// Trigger Button
export const SelectTriggerSlot = withContext<
  HTMLButtonElement,
  SelectTriggerSlotProps
>("button", "trigger");

// Trigger Button Label
export const SelectTriggerLabelSlot = withContext<
  HTMLButtonElement,
  SelectTriggerLabelSlotProps
>("span", "triggerLabel");

// ListBox
export const SelectOptionsSlot = withContext<
  HTMLDivElement,
  SelectOptionsSlotProps
>("div", "options");

// ListBoxItem
export const SelectOptionSlot = withContext<
  HTMLDivElement,
  SelectOptionSlotProps
>("div", "option");

// OptionGroup
export const SelectOptionGroupSlot = withContext<
  HTMLDivElement,
  SelectOptionGroupSlotProps
>("div", "optionGroup");
