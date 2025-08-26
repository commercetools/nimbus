import {
  type HTMLChakraProps,
  type RecipeVariantProps,
  type UnstyledProp,
  createSlotRecipeContext,
} from "@chakra-ui/react";
import { Button as RaButton } from "react-aria-components";
import type { AriaButtonProps } from "react-aria";

import { numberInputRecipe } from "./number-input.recipe";

export interface NumberInputRecipeProps
  extends RecipeVariantProps<typeof numberInputRecipe>,
    UnstyledProp {}

export type NumberInputRootSlotProps = HTMLChakraProps<
  "div",
  NumberInputRecipeProps
>;

export type NumberInputLeadingElementSlotProps = HTMLChakraProps<
  "div",
  NumberInputRecipeProps
>;

export type NumberInputTrailingElementSlotProps = HTMLChakraProps<
  "div",
  NumberInputRecipeProps
>;

export type NumberInputInputSlotProps = HTMLChakraProps<
  "input",
  NumberInputRecipeProps
>;

export type NumberInputIncrementButtonSlotProps = HTMLChakraProps<
  "button",
  NumberInputRecipeProps
> &
  AriaButtonProps;

export type NumberInputDecrementButtonSlotProps = HTMLChakraProps<
  "button",
  NumberInputRecipeProps
> &
  AriaButtonProps;

const { withContext, withProvider } = createSlotRecipeContext({
  key: "numberInput",
});

/**
 * Root component that provides the styling context for the NumberInput component.
 * Uses Chakra UI's recipe context system for consistent styling across instances.
 */
export const NumberInputRootSlot = withProvider<
  HTMLDivElement,
  NumberInputRootSlotProps
>("div", "root");

export const NumberInputLeadingElementSlot = withContext<
  HTMLDivElement,
  NumberInputLeadingElementSlotProps
>("div", "leadingElement");

export const NumberInputTrailingElementSlot = withContext<
  HTMLDivElement,
  NumberInputTrailingElementSlotProps
>("div", "trailingElement");

/**
 * Input slot for NumberInput component.
 * Receives the styled classes for the actual input element.
 */
export const NumberInputInputSlot = withContext<
  HTMLInputElement,
  NumberInputInputSlotProps
>("input", "input");

/**
 * Increment button slot for NumberInput component.
 * Uses react-aria Button for accessibility and interaction handling.
 */
export const NumberInputIncrementButtonSlot = withContext<
  typeof RaButton,
  NumberInputIncrementButtonSlotProps
>(RaButton, "incrementButton");

/**
 * Decrement button slot for NumberInput component.
 * Uses react-aria Button for accessibility and interaction handling.
 */
export const NumberInputDecrementButtonSlot = withContext<
  typeof RaButton,
  NumberInputDecrementButtonSlotProps
>(RaButton, "decrementButton");
