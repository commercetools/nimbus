import { createSlotRecipeContext } from "@chakra-ui/react/styled-system";
import type {
  ListBoxRootSlotProps,
  ListBoxItemSlotProps,
  ListBoxItemIndicatorSlotProps,
  ListBoxItemLeadingSlotProps,
  ListBoxItemContentSlotProps,
  ListBoxItemTrailingSlotProps,
  ListBoxSectionSlotProps,
  ListBoxSectionHeaderSlotProps,
  ListBoxEmptyStateSlotProps,
  ListBoxLoaderSlotProps,
} from "./list-box.types";

const { withProvider, withContext } = createSlotRecipeContext({
  key: "nimbusListBox",
});

// RA <ListBox>
export const ListBoxRootSlot = withProvider<
  HTMLDivElement,
  ListBoxRootSlotProps
>("div", "root");

// RA <ListBoxItem>
export const ListBoxItemSlot = withContext<
  HTMLDivElement,
  ListBoxItemSlotProps
>("div", "item");

// Multi-select leading checkbox
export const ListBoxItemIndicatorSlot = withContext<
  HTMLDivElement,
  ListBoxItemIndicatorSlotProps
>("div", "itemIndicator");

// Optional leading media
export const ListBoxItemLeadingSlot = withContext<
  HTMLDivElement,
  ListBoxItemLeadingSlotProps
>("div", "itemLeading");

// Label (+ description) column
export const ListBoxItemContentSlot = withContext<
  HTMLDivElement,
  ListBoxItemContentSlotProps
>("div", "itemContent");

// Optional trailing content
export const ListBoxItemTrailingSlot = withContext<
  HTMLDivElement,
  ListBoxItemTrailingSlotProps
>("div", "itemTrailing");

// RA <ListBoxSection>
export const ListBoxSectionSlot = withContext<
  HTMLDivElement,
  ListBoxSectionSlotProps
>("div", "section");

// RA <Header> inside a section
export const ListBoxSectionHeaderSlot = withContext<
  HTMLDivElement,
  ListBoxSectionHeaderSlotProps
>("div", "sectionHeader");

// renderEmptyState content
export const ListBoxEmptyStateSlot = withContext<
  HTMLDivElement,
  ListBoxEmptyStateSlotProps
>("div", "emptyState");

// ListBoxLoadMoreItem content
export const ListBoxLoaderSlot = withContext<
  HTMLDivElement,
  ListBoxLoaderSlotProps
>("div", "loader");
