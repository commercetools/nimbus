import { createSlotRecipeContext } from "@chakra-ui/react";
import type {
  TextInputRootSlotProps,
  TextInputLeadingElementSlotProps,
  TextInputInputSlotProps,
  TextInputTrailingElementSlotProps,
} from "./text-input.types";

const { withProvider, withContext } = createSlotRecipeContext({
  key: "textInput",
});

export const TextInputRootSlot = withProvider<
  HTMLDivElement,
  TextInputRootSlotProps
>("div", "root");

export const TextInputLeadingElementSlot = withContext<
  HTMLDivElement,
  TextInputLeadingElementSlotProps
>("div", "leadingElement");

export const TextInputInputSlot = withContext<
  HTMLInputElement,
  TextInputInputSlotProps
>("input", "input");

export const TextInputTrailingElementSlot = withContext<
  HTMLDivElement,
  TextInputTrailingElementSlotProps
>("div", "trailingElement");
