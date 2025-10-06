/* eslint-disable @typescript-eslint/no-empty-object-type */
import {
  type HTMLChakraProps,
  type RecipeVariantProps,
  createSlotRecipeContext,
} from "@chakra-ui/react/styled-system";

import { scopedSearchInputSlotRecipe } from "./scoped-search-input.recipe";

const { withProvider, withContext } = createSlotRecipeContext({
  key: "scopedSearchInput",
});

export interface ScopedSearchInputRootSlotProps
  extends HTMLChakraProps<
    "div",
    RecipeVariantProps<typeof scopedSearchInputSlotRecipe>
  > {}

export const ScopedSearchInputRootSlot = withProvider<
  HTMLDivElement,
  ScopedSearchInputRootSlotProps
>("div", "root");

export interface ScopedSearchInputContainerSlotProps
  extends HTMLChakraProps<"div"> {}
export const ScopedSearchInputContainerSlot = withContext<
  HTMLDivElement,
  ScopedSearchInputContainerSlotProps
>("div", "container");

export interface ScopedSearchInputSelectWrapperSlotProps
  extends HTMLChakraProps<"div"> {}
export const ScopedSearchInputSelectWrapperSlot = withContext<
  HTMLDivElement,
  ScopedSearchInputSelectWrapperSlotProps
>("div", "selectWrapper");

export interface ScopedSearchInputSearchWrapperSlotProps
  extends HTMLChakraProps<"div"> {}
export const ScopedSearchInputSearchWrapperSlot = withContext<
  HTMLDivElement,
  ScopedSearchInputSearchWrapperSlotProps
>("div", "searchWrapper");
