/* eslint-disable @typescript-eslint/no-empty-object-type */
import {
  createSlotRecipeContext,
  type HTMLChakraProps,
  type RecipeVariantProps,
} from "@chakra-ui/react";
import { splitButtonSlotRecipe } from "./split-button.recipe";

const { withProvider, withContext } = createSlotRecipeContext({
  recipe: splitButtonSlotRecipe,
});

// Root Container
export interface SplitButtonRootSlotProps
  extends HTMLChakraProps<
    "div",
    RecipeVariantProps<typeof splitButtonSlotRecipe>
  > {}
export const SplitButtonRootSlot = withProvider<
  HTMLDivElement,
  SplitButtonRootSlotProps
>("div", "root");

// Button Group Container
export interface SplitButtonButtonGroupSlotProps
  extends HTMLChakraProps<"div"> {}
export const SplitButtonButtonGroupSlot = withContext<
  HTMLDivElement,
  SplitButtonButtonGroupSlotProps
>("div", "buttonGroup");

// Primary Action Button
export interface SplitButtonPrimaryButtonSlotProps
  extends HTMLChakraProps<"button"> {}
export const SplitButtonPrimaryButtonSlot = withContext<
  HTMLButtonElement,
  SplitButtonPrimaryButtonSlotProps
>("button", "primaryButton");

// Dropdown Trigger Button
export interface SplitButtonTriggerSlotProps
  extends HTMLChakraProps<"button"> {}
export const SplitButtonTriggerSlot = withContext<
  HTMLButtonElement,
  SplitButtonTriggerSlotProps
>("button", "dropdownTrigger");
