/* eslint-disable @typescript-eslint/no-empty-object-type */
import {
  type HTMLChakraProps,
  type RecipeVariantProps,
  createSlotRecipeContext,
} from "@chakra-ui/react/styled-system";

import { textInputSlotRecipe } from "./text-input.recipe";

const { withProvider, withContext } = createSlotRecipeContext({
  key: "textInput",
});

export interface TextInputRootProps
  extends HTMLChakraProps<
    "div",
    RecipeVariantProps<typeof textInputSlotRecipe>
  > {}
export const TextInputRootSlot = withProvider<
  HTMLDivElement,
  TextInputRootProps
>("div", "root");

interface TextInputLeadingElementProps extends HTMLChakraProps<"div"> {}
export const TextInputLeadingElementSlot = withContext<
  HTMLDivElement,
  TextInputLeadingElementProps
>("div", "leadingElement");

interface TextInputInputProps extends HTMLChakraProps<"input"> {}
export const TextInputInputSlot = withContext<
  HTMLInputElement,
  TextInputInputProps
>("input", "input");

interface TextInputTrailingElementProps extends HTMLChakraProps<"div"> {}
export const TextInputTrailingElementSlot = withContext<
  HTMLDivElement,
  TextInputTrailingElementProps
>("div", "trailingElement");
