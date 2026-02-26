import { createSlotRecipeContext } from "@chakra-ui/react/styled-system";
import type { SlotComponent } from "../../type-utils/slot-types";
import type {
  SearchInputRootSlotProps,
  SearchInputLeadingElementSlotProps,
  SearchInputInputSlotProps,
} from "./search-input.types";

const { withProvider, withContext } = createSlotRecipeContext({
  key: "nimbusSearchInput",
});

export const SearchInputRootSlot: SlotComponent<
  HTMLDivElement,
  SearchInputRootSlotProps
> = withProvider<HTMLDivElement, SearchInputRootSlotProps>("div", "root");

export const SearchInputLeadingElementSlot: SlotComponent<
  HTMLDivElement,
  SearchInputLeadingElementSlotProps
> = withContext<HTMLDivElement, SearchInputLeadingElementSlotProps>(
  "div",
  "leadingElement"
);

export const SearchInputInputSlot: SlotComponent<
  HTMLInputElement,
  SearchInputInputSlotProps
> = withContext<HTMLInputElement, SearchInputInputSlotProps>("input", "input");
