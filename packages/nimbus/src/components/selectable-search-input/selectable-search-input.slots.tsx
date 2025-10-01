/* eslint-disable @typescript-eslint/no-empty-object-type */
import {
  type HTMLChakraProps,
  type RecipeVariantProps,
  createSlotRecipeContext,
} from "@chakra-ui/react/styled-system";

import { selectableSearchInputSlotRecipe } from "./selectable-search-input.recipe";

const { withProvider, withContext } = createSlotRecipeContext({
  key: "selectableSearchInput",
});

export interface SelectableSearchInputRootSlotProps
  extends HTMLChakraProps<
    "div",
    RecipeVariantProps<typeof selectableSearchInputSlotRecipe>
  > {}

export const SelectableSearchInputRootSlot = withProvider<
  HTMLDivElement,
  SelectableSearchInputRootSlotProps
>("div", "root");

export interface SelectableSearchInputContainerSlotProps
  extends HTMLChakraProps<"div"> {}
export const SelectableSearchInputContainerSlot = withContext<
  HTMLDivElement,
  SelectableSearchInputContainerSlotProps
>("div", "container");

export interface SelectableSearchInputSelectWrapperSlotProps
  extends HTMLChakraProps<"div"> {}
export const SelectableSearchInputSelectWrapperSlot = withContext<
  HTMLDivElement,
  SelectableSearchInputSelectWrapperSlotProps
>("div", "selectWrapper");

export interface SelectableSearchInputSearchWrapperSlotProps
  extends HTMLChakraProps<"div"> {}
export const SelectableSearchInputSearchWrapperSlot = withContext<
  HTMLDivElement,
  SelectableSearchInputSearchWrapperSlotProps
>("div", "searchWrapper");
