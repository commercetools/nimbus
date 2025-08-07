/* eslint-disable @typescript-eslint/no-empty-object-type */
import {
  createSlotRecipeContext,
  type HTMLChakraProps,
  type RecipeVariantProps,
} from "@chakra-ui/react";
import { primaryActionDropDownSlotRecipe } from "./primary-action-dropdown.recipe";

const { withProvider, withContext } = createSlotRecipeContext({
  recipe: primaryActionDropDownSlotRecipe,
});

// Root Container
export interface PrimaryActionDropDownRootSlotProps
  extends HTMLChakraProps<
    "div",
    RecipeVariantProps<typeof primaryActionDropDownSlotRecipe>
  > {}
export const PrimaryActionDropDownRootSlot = withProvider<
  HTMLDivElement,
  PrimaryActionDropDownRootSlotProps
>("div", "root");

// Button Group Container
export interface PrimaryActionDropDownButtonGroupSlotProps
  extends HTMLChakraProps<"div"> {}
export const PrimaryActionDropDownButtonGroupSlot = withContext<
  HTMLDivElement,
  PrimaryActionDropDownButtonGroupSlotProps
>("div", "buttonGroup");

// Primary Action Button
export interface PrimaryActionDropDownPrimaryButtonSlotProps
  extends HTMLChakraProps<"button"> {}
export const PrimaryActionDropDownPrimaryButtonSlot = withContext<
  HTMLButtonElement,
  PrimaryActionDropDownPrimaryButtonSlotProps
>("button", "primaryButton");

// Dropdown Trigger Button
export interface PrimaryActionDropDownTriggerSlotProps
  extends HTMLChakraProps<"button"> {}
export const PrimaryActionDropDownTriggerSlot = withContext<
  HTMLButtonElement,
  PrimaryActionDropDownTriggerSlotProps
>("button", "dropdownTrigger");
