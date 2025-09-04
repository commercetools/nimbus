import { createSlotRecipeContext, type HTMLChakraProps } from "@chakra-ui/react";
import type {
  ComboBoxRootProps,
  ComboBoxValueSlotProps,
  ComboBoxButtonGroupSlotProps,
  ComboBoxPopoverSlotProps,
  ComboBoxMultiSelectInputSlotProps,
  ComboBoxOptionsProps,
  ComboBoxOptionProps,
  ComboBoxOptionGroupProps,
  ComboBoxOptionIndicatorSlotProps,
  ComboBoxOptionContentSlotProps,
} from "./combobox.types";

const { withProvider, withContext } = createSlotRecipeContext({
  key: "combobox",
});

// ComboBox Root
export const ComboBoxRootSlot = withProvider<
  HTMLDivElement,
  ComboBoxRootProps<object>
>("div", "root");

export const ComboBoxLeadingElementSlot = withContext<
  HTMLDivElement,
  HTMLChakraProps<"div">
  // @ts-ignore TODO: don't understood the error I'm ignoring
>("div", "leadingElement");
  
// Value - Input (single) or TagList (multi)
export const ComboBoxValueSlot = withContext<
  HTMLDivElement,
  ComboBoxValueSlotProps
>("div", "value");

// ButtonGroup - Dropdown Indicator and Clear Button
export const ComboBoxButtonGroupSlot = withContext<
  HTMLDivElement,
  ComboBoxButtonGroupSlotProps
>("div", "buttonGroup");

// Popover container (multi-select)
export const ComboBoxPopoverSlot = withContext<
  HTMLDivElement,
  ComboBoxPopoverSlotProps
>("div", "popover");

// Multi-select input (in popover)
export const ComboBoxMultiSelectInputSlot = withContext<
  HTMLInputElement,
  ComboBoxMultiSelectInputSlotProps
>("input", "multiSelectInput");

// Options - ListBox
export const ComboBoxOptionsSlot = withContext<
  HTMLDivElement,
  ComboBoxOptionsProps<object>
>("div", "options");

// OptionGroup - ListBoxSection
export const ComboBoxOptionGroupSlot = withContext<
  HTMLDivElement,
  ComboBoxOptionGroupProps<object>
>("div", "optionGroup");

// Option - ListBoxItem
export const ComboBoxOptionSlot = withContext<
  HTMLDivElement,
  ComboBoxOptionProps<object>
>("div", "option");

// Option indicator (multi) - selected indicator
export const ComboBoxOptionIndicatorSlot = withContext<
  HTMLSpanElement,
  ComboBoxOptionIndicatorSlotProps
>("span", "optionIndicator");

// Option content (multi)
export const ComboBoxOptionContentSlot = withContext<
  HTMLSpanElement,
  ComboBoxOptionContentSlotProps
>("span", "optionContent");
