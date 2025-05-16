/* eslint-disable @typescript-eslint/no-empty-object-type */
import {
  type HTMLChakraProps,
  createSlotRecipeContext,
} from "@chakra-ui/react";

import type {
  ComboBoxRootProps,
  ComboBoxOptionsProps,
  ComboBoxOptionProps,
  ComboBoxOptionGroupProps,
} from "./combobox.types";

export const { withProvider, withContext } = createSlotRecipeContext({
  key: "combobox",
});

// ComboBox Root
export const ComboBoxRootSlot = withProvider<
  HTMLDivElement,
  ComboBoxRootProps<object>
>("div", "root");

// Value - Input (single) or TagList (multi)
export interface ComboBoxValueSlotProps extends HTMLChakraProps<"div"> {}
export const ComboBoxValueSlot = withContext<
  HTMLDivElement,
  ComboBoxValueSlotProps
>("div", "value");

// ButtonGroup - Dropdown Indicator and Clear Button
export interface ComboBoxButtonGroupSlotProps extends HTMLChakraProps<"div"> {}
export const ComboBoxButtonGroupSlot = withContext<
  HTMLDivElement,
  ComboBoxButtonGroupSlotProps
>("div", "buttonGroup");

// Options - ListBox (single) or GridList (multi)
export const ComboBoxOptionsSlot = withContext<
  HTMLDivElement,
  ComboBoxOptionsProps<object>
>("div", "options");

// Option - ListBoxItem (single) or GridListItem (multi)
export const ComboBoxOptionSlot = withContext<
  HTMLDivElement,
  ComboBoxOptionProps<object>
>("div", "option");

// OptionGroup
export const ComboBoxOptionGroupSlot = withContext<
  HTMLDivElement,
  ComboBoxOptionGroupProps<object>
>("div", "optionGroup");

// TODO: are these necessary?  we'll find out!

// // Trigger Button
// export interface ComboBoxTriggerSlotProps extends HTMLChakraProps<"button"> {}
// export const ComboBoxTriggerSlot = withContext<
//   HTMLButtonElement,
//   ComboBoxTriggerSlotProps
// >("button", "trigger");

// // Input
// export interface ComboBoxInputSlotProps extends HTMLChakraProps<"input"> {}
// export const ComboBoxInputSlot = withContext<
//   HTMLInputElement,
//   ComboBoxInputSlotProps
// >("input", "input");

// // TagGroup
// export interface ComboBoxTagGroupSlotProps extends HTMLChakraProps<"div"> {}
// export const ComboBoxTagGroupSlot = withContext<
//   HTMLUListElement,
//   ComboBoxTagGroupSlotProps
// >("div", "tagGroup");
