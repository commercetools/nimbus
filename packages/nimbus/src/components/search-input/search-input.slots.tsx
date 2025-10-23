import { createSlotRecipeContext } from "@chakra-ui/react";
import type {
  SearchInputRootSlotProps,
  SearchInputLeadingElementSlotProps,
  SearchInputInputSlotProps,
} from "./search-input.types";

const { withProvider, withContext } = createSlotRecipeContext({
  key: "searchInput",
});

export const SearchInputRootSlot = withProvider<
  HTMLDivElement,
  SearchInputRootSlotProps
>("div", "root");

export const SearchInputLeadingElementSlot = withContext<
  HTMLDivElement,
  SearchInputLeadingElementSlotProps
>("div", "leadingElement");

export const SearchInputInputSlot = withContext<
  HTMLInputElement,
  SearchInputInputSlotProps
>("input", "input");
