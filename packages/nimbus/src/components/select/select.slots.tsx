import {
  createSlotRecipeContext,
  type HTMLChakraProps,
} from "@chakra-ui/react/styled-system";
import type {
  SelectRootSlotProps,
  SelectTriggerSlotProps,
  SelectTriggerButtonSlotProps,
  SelectTriggerLabelSlotProps,
  SelectTrailingElementSlotProps,
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

// Trigger container - carries the field chrome; not interactive
export const SelectTriggerSlot = withContext<
  HTMLDivElement,
  SelectTriggerSlotProps
>("div", "trigger");

// Trigger Button - the interactive element that opens the listbox
export const SelectTriggerButtonSlot = withContext<
  HTMLButtonElement,
  SelectTriggerButtonSlotProps
>("button", "triggerButton");

// Trigger Button Label
export const SelectTriggerLabelSlot = withContext<
  HTMLButtonElement,
  SelectTriggerLabelSlotProps
>("span", "triggerLabel");

// TrailingElement - consumer content between the value and the clear button
export const SelectTrailingElementSlot = withContext<
  HTMLDivElement,
  SelectTrailingElementSlotProps
>("div", "trailingElement");

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
