import { createSlotRecipeContext } from "@chakra-ui/react/styled-system";
import type { SlotComponent } from "@/type-utils";
import type {
  ScopedSearchInputRootSlotProps,
  ScopedSearchInputContainerSlotProps,
  ScopedSearchInputSelectWrapperSlotProps,
  ScopedSearchInputSearchWrapperSlotProps,
} from "./scoped-search-input.types";

const { withProvider, withContext } = createSlotRecipeContext({
  key: "nimbusScopedSearchInput",
});

export const ScopedSearchInputRootSlot: SlotComponent<
  HTMLDivElement,
  ScopedSearchInputRootSlotProps
> = withProvider<HTMLDivElement, ScopedSearchInputRootSlotProps>("div", "root");

export const ScopedSearchInputContainerSlot: SlotComponent<
  HTMLDivElement,
  ScopedSearchInputContainerSlotProps
> = withContext<HTMLDivElement, ScopedSearchInputContainerSlotProps>(
  "div",
  "container"
);

export const ScopedSearchInputSelectWrapperSlot: SlotComponent<
  HTMLDivElement,
  ScopedSearchInputSelectWrapperSlotProps
> = withContext<HTMLDivElement, ScopedSearchInputSelectWrapperSlotProps>(
  "div",
  "selectWrapper"
);

export const ScopedSearchInputSearchWrapperSlot: SlotComponent<
  HTMLDivElement,
  ScopedSearchInputSearchWrapperSlotProps
> = withContext<HTMLDivElement, ScopedSearchInputSearchWrapperSlotProps>(
  "div",
  "searchWrapper"
);
