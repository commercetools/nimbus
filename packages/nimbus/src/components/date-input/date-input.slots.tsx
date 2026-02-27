import {
  type HTMLChakraProps,
  createSlotRecipeContext,
} from "@chakra-ui/react/styled-system";
import type { DateInputRootSlotProps } from "./date-input.types";

// Correctly destructure from createSlotRecipeContext based on project examples
const { withProvider, withContext } = createSlotRecipeContext({
  key: "nimbusDateInput",
});

/**
 * Root component that provides the styling context for the DateInput component.
 * Uses Chakra UI's recipe context system for consistent styling across instances.
 */
export const DateInputRootSlot = withProvider<
  HTMLDivElement,
  DateInputRootSlotProps
>("div", "root");

export const DateInputLeadingElementSlot = withContext<
  HTMLDivElement,
  HTMLChakraProps<"div">
>("div", "leadingElement");

export const DateInputTrailingElementSlot = withContext<
  HTMLDivElement,
  HTMLChakraProps<"div">
>("div", "trailingElement");

/**
 * Slot component for the DateField part of the DateInput.
 */
export const DateInputSegmentGroupSlot = withContext<
  HTMLDivElement,
  HTMLChakraProps<"div">
>("div", "segmentGroup");

/**
 * Slot component for the DateField part of the DateInput.
 */
export const DateInputSegmentSlot = withContext<
  HTMLDivElement,
  HTMLChakraProps<"div">
>("div", "segment");
