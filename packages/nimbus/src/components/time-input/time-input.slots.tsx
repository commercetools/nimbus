import {
  type HTMLChakraProps,
  createSlotRecipeContext,
} from "@chakra-ui/react/styled-system";
import type {
  TimeInputRootSlotProps,
  TimeInputLeadingElementSlotProps,
  TimeInputTrailingElementSlotProps,
} from "./time-input.types";

// Correctly destructure from createSlotRecipeContext based on project examples
const { withProvider, withContext } = createSlotRecipeContext({
  key: "nimbusTimeInput",
});

/**
 * Root component that provides the styling context for the TimeInput component.
 * Uses Chakra UI's recipe context system for consistent styling across instances.
 */
export const TimeInputRootSlot = withProvider<
  HTMLDivElement,
  TimeInputRootSlotProps
>("div", "root");

export const TimeInputLeadingElementSlot = withContext<
  HTMLDivElement,
  TimeInputLeadingElementSlotProps
>("div", "leadingElement");

export const TimeInputTrailingElementSlot = withContext<
  HTMLDivElement,
  TimeInputTrailingElementSlotProps
>("div", "trailingElement");

/**
 * Slot component for the TimeField part of the TimeInput.
 */
export const TimeInputSegmentGroupSlot = withContext<
  HTMLDivElement,
  HTMLChakraProps<"div">
>("div", "segmentGroup");

/**
 * Slot component for the TimeField part of the TimeInput.
 */
export const TimeInputSegmentSlot = withContext<
  HTMLDivElement,
  HTMLChakraProps<"div">
>("div", "segment");
