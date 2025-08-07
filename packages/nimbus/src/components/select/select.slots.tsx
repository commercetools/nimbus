/* eslint-disable @typescript-eslint/no-empty-object-type */
import {
  createSlotRecipeContext,
  type HTMLChakraProps,
  type RecipeVariantProps,
} from "@chakra-ui/react/styled-system";
import { selectSlotRecipe } from "./select.recipe";
import { type SelectProps as RaSelectProps } from "react-aria-components";

const { withProvider, withContext } = createSlotRecipeContext({
  key: "select",
});

// Select
export interface SelectRootSlotProps
  extends HTMLChakraProps<
    "div",
    RecipeVariantProps<typeof selectSlotRecipe> & RaSelectProps<object>
  > {}
export const SelectRootSlot = withProvider<HTMLDivElement, SelectRootSlotProps>(
  "div",
  "root"
);

// Trigger Button
export interface SelectTriggerSlotProps extends HTMLChakraProps<"button"> {}
export const SelectTriggerSlot = withContext<
  HTMLButtonElement,
  SelectTriggerSlotProps
>("button", "trigger");

// Trigger Button Label
export interface SelectTriggerLabelSlotProps extends HTMLChakraProps<"span"> {}
export const SelectTriggerLabelSlot = withContext<
  HTMLButtonElement,
  SelectTriggerLabelSlotProps
>("span", "triggerLabel");

// ListBox
export interface SelectOptionsSlotProps extends HTMLChakraProps<"div"> {}
export const SelectOptionsSlot = withContext<
  HTMLDivElement,
  SelectOptionsSlotProps
>("div", "options");

// ListBoxItem
export interface SelectOptionSlotProps extends HTMLChakraProps<"div"> {}
export const SelectOptionSlot = withContext<
  HTMLDivElement,
  SelectOptionSlotProps
>("div", "option");

// OptionGroup
export interface SelectOptionGroupSlotProps extends HTMLChakraProps<"div"> {}
export const SelectOptionGroupSlot = withContext<
  HTMLDivElement,
  SelectOptionGroupSlotProps
>("div", "optionGroup");
