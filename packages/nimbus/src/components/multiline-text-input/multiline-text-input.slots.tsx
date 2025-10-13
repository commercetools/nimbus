import { createSlotRecipeContext } from "@chakra-ui/react/styled-system";
import type {
  MultilineTextInputRootSlotProps,
  MultilineTextInputLeadingElementProps,
  MultilineTextInputTextAreaSlotProps,
} from "./multiline-text-input.types";

const { withContext, withProvider } = createSlotRecipeContext({
  key: "multilineTextInput",
});

/**
 * Root component that provides the styling context for the MultilineTextInput component.
 * Uses Chakra UI's recipe context system for consistent styling across instances.
 */
export const MultilineTextInputRootSlot = withProvider<
  HTMLDivElement,
  MultilineTextInputRootSlotProps
>("div", "root");

export const MultilineTextInputLeadingElementSlot = withContext<
  HTMLDivElement,
  MultilineTextInputLeadingElementProps
>("div", "leadingElement");

export const MultilineTextInputTextAreaSlot = withContext<
  HTMLTextAreaElement,
  MultilineTextInputTextAreaSlotProps
>("textarea", "textarea");
