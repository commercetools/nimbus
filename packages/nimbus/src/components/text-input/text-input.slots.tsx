import { createSlotRecipeContext } from "@chakra-ui/react";
import type {
  TextInputRootProps,
  TextInputLeadingElementProps,
  TextInputInputProps,
  TextInputTrailingElementProps,
} from "./text-input.types";

const { withProvider, withContext } = createSlotRecipeContext({
  key: "textInput",
});

export const TextInputRootSlot = withProvider<
  HTMLDivElement,
  TextInputRootProps
>("div", "root");

export const TextInputLeadingElementSlot = withContext<
  HTMLDivElement,
  TextInputLeadingElementProps
>("div", "leadingElement");

export const TextInputInputSlot = withContext<
  HTMLInputElement,
  TextInputInputProps
>("input", "input");

export const TextInputTrailingElementSlot = withContext<
  HTMLDivElement,
  TextInputTrailingElementProps
>("div", "trailingElement");
