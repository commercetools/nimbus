import { createSlotRecipeContext } from "@chakra-ui/react";
import type {
  SearchInputRootProps,
  SearchInputLeadingElementProps,
  SearchInputInputProps,
} from "./search-input.types";

const { withProvider, withContext } = createSlotRecipeContext({
  key: "searchInput",
});

export const SearchInputRootSlot = withProvider<
  HTMLDivElement,
  SearchInputRootProps
>("div", "root");

export const SearchInputLeadingElementSlot = withContext<
  HTMLDivElement,
  SearchInputLeadingElementProps
>("div", "leadingElement");

export const SearchInputInputSlot = withContext<
  HTMLInputElement,
  SearchInputInputProps
>("input", "input");
