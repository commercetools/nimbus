/* eslint-disable @typescript-eslint/no-empty-object-type */
import {
  type HTMLChakraProps,
  type RecipeVariantProps,
  createSlotRecipeContext,
} from "@chakra-ui/react/styled-system";

import { searchInputSlotRecipe } from "./search-input.recipe";

const { withProvider, withContext } = createSlotRecipeContext({
  key: "searchInput",
});

export interface SearchInputRootProps
  extends HTMLChakraProps<
    "div",
    RecipeVariantProps<typeof searchInputSlotRecipe>
  > {}

export const SearchInputRootSlot = withProvider<
  HTMLDivElement,
  SearchInputRootProps
>("div", "root");

export interface SearchInputLeadingElementProps
  extends HTMLChakraProps<"div"> {}
export const SearchInputLeadingElementSlot = withContext<
  HTMLDivElement,
  SearchInputLeadingElementProps
>("div", "leadingElement");

export interface SearchInputInputProps extends HTMLChakraProps<"input"> {}
export const SearchInputInputSlot = withContext<
  HTMLInputElement,
  SearchInputInputProps
>("input", "input");
