import { createSlotRecipeContext } from "@chakra-ui/react/styled-system";

import type {
  ComboBoxRootSlotProps,
  ComboBoxTriggerSlotProps,
  ComboBoxLeadingElementSlotProps,
  ComboBoxContentSlotProps,
  ComboBoxTagGroupSlotProps,
  ComboBoxInputSlotProps,
  ComboBoxPopoverSlotProps,
  ComboBoxListBoxSlotProps,
  ComboBoxSectionSlotProps,
  ComboBoxOptionSlotProps,
  ComboBoxOptionIndicatorSlotProps,
  ComboBoxOptionContentSlotProps,
} from "./combobox.types";

const { withProvider, withContext } = createSlotRecipeContext({
  key: "nimbusCombobox",
});

// Root slot - container for entire combobox (provides recipe context)
export const ComboBoxRootSlot = withProvider<
  HTMLDivElement,
  ComboBoxRootSlotProps
>("div", "root");

// Trigger slot - container for input trigger area (input + tags + buttons)
export const ComboBoxTriggerSlot = withContext<
  HTMLDivElement,
  ComboBoxTriggerSlotProps
>("div", "trigger");

// LeadingElement slot - wrapper for leading element (icon, etc.)
export const ComboBoxLeadingElementSlot = withContext<
  HTMLDivElement,
  ComboBoxLeadingElementSlotProps
>("div", "leadingElement");

// Content slot - wrapper for tags and input (flex container within grid)
export const ComboBoxContentSlot = withContext<
  HTMLDivElement,
  ComboBoxContentSlotProps
>("div", "content");

// TagGroup slot - container for selected tags (multi-select)
export const ComboBoxTagGroupSlot = withContext<
  HTMLDivElement,
  ComboBoxTagGroupSlotProps
>("div", "tagGroup");

// Input slot - wrapper for React Aria Input component
export const ComboBoxInputSlot = withContext<
  HTMLDivElement,
  ComboBoxInputSlotProps
>("div", "input");

// Popover slot - wrapper for popover containing listbox
export const ComboBoxPopoverSlot = withContext<
  HTMLDivElement,
  ComboBoxPopoverSlotProps
>("div", "popover");

// ListBox slot - wrapper for React Aria ListBox (used by ComboBox.ListBox component)
export const ComboBoxListBoxSlot = withContext<
  HTMLDivElement,
  ComboBoxListBoxSlotProps
>("div", "listBox");

// Section slot - section grouping wrapper (wraps React Aria Section)
export const ComboBoxSectionSlot = withContext<
  HTMLDivElement,
  ComboBoxSectionSlotProps
>("div", "section");

// Option slot - individual option wrapper (wraps React Aria ListBoxItem)
export const ComboBoxOptionSlot = withContext<
  HTMLDivElement,
  ComboBoxOptionSlotProps
>("div", "option");

// Option indicator slot - checkbox/checkmark indicator for multi-select
export const ComboBoxOptionIndicatorSlot = withContext<
  HTMLDivElement,
  ComboBoxOptionIndicatorSlotProps
>("div", "optionIndicator");

// Option content slot - wrapper for option text content
export const ComboBoxOptionContentSlot = withContext<
  HTMLDivElement,
  ComboBoxOptionContentSlotProps
>("div", "optionContent");
