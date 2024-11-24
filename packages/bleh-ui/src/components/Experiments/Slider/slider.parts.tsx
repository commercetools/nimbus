"use client";

import {
  createSlotRecipeContext,
  type HTMLChakraProps,
  type RecipeVariantProps,
} from "@chakra-ui/react";
import { sliderSlotRecipe } from "./slider.recipe";

const { withProvider, withContext } = createSlotRecipeContext({
  recipe: sliderSlotRecipe,
});

interface StyledSliderRootProps
  extends HTMLChakraProps<"div", RecipeVariantProps<typeof sliderSlotRecipe>> {}

export const StyledSliderRoot = withProvider<
  HTMLDivElement,
  StyledSliderRootProps
>("div", "root");

interface StyledSliderTrackProps extends HTMLChakraProps<"div"> {}
export const StyledSliderTrack = withContext<
  HTMLDivElement,
  StyledSliderTrackProps
>("div", "track");

interface StyledSliderRangeProps extends HTMLChakraProps<"div"> {}
export const StyledSliderRange = withContext<
  HTMLDivElement,
  StyledSliderRangeProps
>("div", "range");

interface StyledSliderThumbProps extends HTMLChakraProps<"div"> {}
export const StyledSliderThumb = withContext<
  HTMLDivElement,
  StyledSliderThumbProps
>("div", "thumb");
