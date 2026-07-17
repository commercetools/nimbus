import {
  createSlotRecipeContext,
  type HTMLChakraProps,
} from "@chakra-ui/react/styled-system";
import type { SlotComponent } from "@/type-utils";
import type { ListBoxRootSlotProps } from "./list-box.types";

const { withProvider, withContext } = createSlotRecipeContext({
  key: "nimbusListBox",
});

/**
 * Root slot — provides the recipe context for all descendant slots.
 */
export const ListBoxRootSlot: SlotComponent<
  HTMLDivElement,
  ListBoxRootSlotProps
> = withProvider<HTMLDivElement, ListBoxRootSlotProps>("div", "root");

/**
 * Item slot — the focusable list option (`role="option"`).
 */
export const ListBoxItemSlot = withContext<
  HTMLDivElement,
  HTMLChakraProps<"div">
>("div", "item");

/**
 * Section slot — the grouping container for a set of related items.
 */
export const ListBoxSectionSlot = withContext<
  HTMLDivElement,
  HTMLChakraProps<"div">
>("div", "section");

/**
 * Section header slot — the visible label for a section group.
 */
export const ListBoxSectionHeaderSlot = withContext<
  HTMLElement,
  HTMLChakraProps<"header">
>("header", "sectionHeader");
