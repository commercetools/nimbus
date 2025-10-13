import { createSlotRecipeContext } from "@chakra-ui/react";
import type {
  ScopedSearchInputRootSlotProps,
  ScopedSearchInputContainerSlotProps,
  ScopedSearchInputSelectWrapperSlotProps,
  ScopedSearchInputSearchWrapperSlotProps,
} from "./scoped-search-input.types";

const { withProvider, withContext } = createSlotRecipeContext({
  key: "scopedSearchInput",
});

export const ScopedSearchInputRootSlot = withProvider<
  HTMLDivElement,
  ScopedSearchInputRootSlotProps
>("div", "root");

export const ScopedSearchInputContainerSlot = withContext<
  HTMLDivElement,
  ScopedSearchInputContainerSlotProps
>("div", "container");

export const ScopedSearchInputSelectWrapperSlot = withContext<
  HTMLDivElement,
  ScopedSearchInputSelectWrapperSlotProps
>("div", "selectWrapper");

export const ScopedSearchInputSearchWrapperSlot = withContext<
  HTMLDivElement,
  ScopedSearchInputSearchWrapperSlotProps
>("div", "searchWrapper");
