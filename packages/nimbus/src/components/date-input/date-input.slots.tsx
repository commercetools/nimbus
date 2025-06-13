import {
  type HTMLChakraProps,
  type RecipeProps,
  type UnstyledProp,
  createSlotRecipeContext,
} from "@chakra-ui/react";

import { dateInputRecipe } from "./date-input.recipe";

/**
 * Base recipe props interface that combines Chakra UI's recipe props
 * with the unstyled prop option for the div element.
 */
interface DateInputRecipeProps extends RecipeProps<"div">, UnstyledProp {}

/**
 * Root props interface that extends Chakra's HTML props with our recipe props.
 * This creates a complete set of props for the root element, combining
 * HTML attributes, Chakra's styling system, and our custom recipe props.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface DateInputRootProps
  extends HTMLChakraProps<"div", DateInputRecipeProps> {}

// Correctly destructure from createSlotRecipeContext based on project examples
const { withProvider, withContext } = createSlotRecipeContext({
  recipe: dateInputRecipe,
});

/**
 * Root component that provides the styling context for the DateInput component.
 * Uses Chakra UI's recipe context system for consistent styling across instances.
 */
export const DateInputRootSlot = withProvider<
  HTMLDivElement,
  DateInputRootProps
>("div", "root");

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
