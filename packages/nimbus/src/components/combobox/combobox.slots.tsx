/* eslint-disable @typescript-eslint/no-empty-object-type */
import {
  type HTMLChakraProps,
  type RecipeVariantProps,
  createSlotRecipeContext,
} from "@chakra-ui/react";
import { type ComboBoxProps as RaComboBoxProps } from "react-aria-components";
import { comboBoxSlotRecipe } from "./combobox.recipe";

const { withProvider, withContext } = createSlotRecipeContext({
  key: "combobox",
});

// ComboBox Root
export interface ComboBoxRootSlotProps
  extends HTMLChakraProps<
    "div",
    RecipeVariantProps<typeof comboBoxSlotRecipe> & RaComboBoxProps<object>
  > {}
export const ComboBoxRootSlot = withProvider<
  HTMLDivElement,
  ComboBoxRootSlotProps
>("div", "root");

// Trigger Button
export interface ComboBoxTriggerSlotProps extends HTMLChakraProps<"button"> {}
export const ComboBoxTriggerSlot = withContext<
  HTMLButtonElement,
  ComboBoxTriggerSlotProps
>("button", "trigger");

// Input
export interface ComboBoxInputSlotProps extends HTMLChakraProps<"input"> {}
export const ComboBoxInputSlot = withContext<
  HTMLInputElement,
  ComboBoxInputSlotProps
>("input", "input");

// Tag
export interface ComboBoxTagSlotProps extends HTMLChakraProps<"li"> {}
export const ComboBoxTagSlot = withContext<HTMLLIElement, ComboBoxTagSlotProps>(
  "li",
  "tag"
);

// TagGroup
export interface ComboBoxTagGroupSlotProps extends HTMLChakraProps<"ul"> {}
export const ComboBoxTagGroupSlot = withContext<
  HTMLUListElement,
  ComboBoxTagGroupSlotProps
>("ul", "tagGroup");

// ListBox
export interface ComboBoxListBoxSlotProps extends HTMLChakraProps<"ul"> {}
export const ComboBoxListBoxSlot = withContext<
  HTMLUListElement,
  ComboBoxListBoxSlotProps
>("ul", "listBox");

// ListBoxItem (option)
export interface ComboBoxOptionSlotProps extends HTMLChakraProps<"li"> {}
export const ComboBoxOptionSlot = withContext<
  HTMLLIElement,
  ComboBoxOptionSlotProps
>("li", "option");

// ListBoxGroup (optionGroup)
export interface ComboBoxOptionGroupSlotProps extends HTMLChakraProps<"ul"> {}
export const ComboBoxOptionGroupSlot = withContext<
  HTMLUListElement,
  ComboBoxOptionGroupSlotProps
>("ul", "optionGroup");
