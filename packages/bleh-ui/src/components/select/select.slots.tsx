/* eslint-disable @typescript-eslint/no-empty-object-type */
import {
  createSlotRecipeContext,
  type HTMLChakraProps,
  type RecipeVariantProps,
} from "@chakra-ui/react";
import { selectSlotRecipe } from "./select.recipe";
import {
  Select,
  //type ListBoxProps as RaListBoxProps,
  //type ListBoxItemProps as RaListBoxItemProps,
  type SelectProps as RaSelectProps,
} from "react-aria-components";

const { withProvider, withContext } = createSlotRecipeContext({
  key: "select",
});

// Select
export interface SelectRootProps
  extends HTMLChakraProps<
    "div",
    RecipeVariantProps<typeof selectSlotRecipe> & RaSelectProps<object>
  > {}
export const SelectRoot = withProvider<HTMLDivElement, SelectRootProps>(
  "div",
  "root"
);

// ListBox
export interface SelectTriggerProps extends HTMLChakraProps<"button"> {}
export const SelectTrigger = withContext<HTMLButtonElement, SelectTriggerProps>(
  "button",
  "trigger"
);

// ListBox
export interface SelectOptionsProps extends HTMLChakraProps<"div"> {}
export const SelectOptions = withContext<HTMLDivElement, SelectOptionsProps>(
  "div",
  "options"
);

// ListBoxItem
export interface SelectOptionProps extends HTMLChakraProps<"div"> {}
export const SelectOption = withContext<HTMLDivElement, SelectOptionProps>(
  "div",
  "option"
);

// OptionGroup
export interface SelectOptionGroupProps extends HTMLChakraProps<"div"> {}
export const SelectOptionGroup = withContext<
  HTMLDivElement,
  SelectOptionGroupProps
>("div", "optionGroup");

/* 
interface ChekcboxIndicatorProps extends HTMLChakraProps<"span"> {}
export const CheckboxIndicator = withContext<
  HTMLSpanElement,
  ChekcboxIndicatorProps
>("span", "indicator");
 */
