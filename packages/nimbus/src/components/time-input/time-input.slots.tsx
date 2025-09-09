import {
  type HTMLChakraProps,
  type RecipeProps,
  type UnstyledProp,
  createSlotRecipeContext,
} from "@chakra-ui/react/styled-system";

import { timeInputRecipe } from "./time-input.recipe";

/**
 * Base recipe props interface that combines Chakra UI's recipe props
 * with the unstyled prop option for the div element.
 */
interface TimeInputRecipeProps extends RecipeProps<"div">, UnstyledProp {}

/**
 * Root props interface that extends Chakra's HTML props with our recipe props.
 * This creates a complete set of props for the root element, combining
 * HTML attributes, Chakra's styling system, and our custom recipe props.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface TimeInputRootProps
  extends HTMLChakraProps<"div", TimeInputRecipeProps> {}

interface TimeInputLeadingElementProps extends HTMLChakraProps<"div"> {}

interface TimeInputTrailingElementProps extends HTMLChakraProps<"div"> {}

// Correctly destructure from createSlotRecipeContext based on project examples
const { withProvider, withContext } = createSlotRecipeContext({
  recipe: timeInputRecipe,
});

/**
 * Root component that provides the styling context for the TimeInput component.
 * Uses Chakra UI's recipe context system for consistent styling across instances.
 */
export const TimeInputRootSlot = withProvider<
  HTMLDivElement,
  TimeInputRootProps
>("div", "root");

export const TimeInputLeadingElementSlot = withContext<
  HTMLDivElement,
  TimeInputLeadingElementProps
>("div", "leadingElement");

export const TimeInputTrailingElementSlot = withContext<
  HTMLDivElement,
  TimeInputTrailingElementProps
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
