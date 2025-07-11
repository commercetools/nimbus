import { createSlotRecipeContext } from "@chakra-ui/react";
import type {
  RecipeProps,
  UnstyledProp,
  HTMLChakraProps,
  RecipeVariantProps,
} from "@chakra-ui/react";
import type { AriaProgressBarProps } from "react-aria";
import { progressBarSlotRecipe } from "./progress-bar.recipe.tsx";

/**
 * Base recipe props interface that combines Chakra UI's recipe props
 * with the unstyled prop option for the div element.
 */
export interface ProgressBarRecipeProps
  extends RecipeProps<"div">,
    UnstyledProp {}

/**
 * Root props interface that extends Chakra's HTML props with our recipe props,
 * aria props, and data attributes.
 */
export interface ProgressBarRootProps
  extends HTMLChakraProps<"div", ProgressBarRecipeProps>,
    Omit<RecipeVariantProps<typeof progressBarSlotRecipe>, "isIndeterminate">,
    AriaProgressBarProps {
  [key: `data-${string}`]: string;
}

const { withProvider, withContext } = createSlotRecipeContext({
  key: "progressBar",
});

// ProgressBar Root - Main container
export const ProgressBarRootSlot = withProvider<
  HTMLDivElement,
  ProgressBarRootProps
>("div", "root");

// ProgressBar Track - Background bar
export interface ProgressBarTrackSlotProps extends HTMLChakraProps<"div"> {}
export const ProgressBarTrackSlot = withContext<
  HTMLDivElement,
  ProgressBarTrackSlotProps
>("div", "track");

// ProgressBar Fill - Progress indicator
export interface ProgressBarFillSlotProps extends HTMLChakraProps<"div"> {}
export const ProgressBarFillSlot = withContext<
  HTMLDivElement,
  ProgressBarFillSlotProps
>("div", "fill");
// ProgressBar Label - Label text
export interface ProgressBarLabelSlotProps extends HTMLChakraProps<"span"> {}
export const ProgressBarLabelSlot = withContext<
  HTMLSpanElement,
  ProgressBarLabelSlotProps
>("span", "label");

// ProgressBar Value - Value text
export interface ProgressBarValueSlotProps extends HTMLChakraProps<"span"> {}
export const ProgressBarValueSlot = withContext<
  HTMLSpanElement,
  ProgressBarValueSlotProps
>("span", "value");
