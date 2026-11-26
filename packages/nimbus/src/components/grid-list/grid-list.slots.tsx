import { createSlotRecipeContext } from "@chakra-ui/react/styled-system";
import type {
  GridListRootSlotProps,
  GridListItemSlotProps,
  GridListItemContentSlotProps,
  GridListEmptyStateSlotProps,
} from "./grid-list.types";

const { withProvider, withContext } = createSlotRecipeContext({
  key: "nimbusGridList",
});

// RA <GridList>
export const GridListRootSlot = withProvider<
  HTMLDivElement,
  GridListRootSlotProps
>("div", "root");

// RA <GridListItem>
export const GridListItemSlot = withContext<
  HTMLDivElement,
  GridListItemSlotProps
>("div", "item");

// Wraps the consumer's item content next to the built-in controls
export const GridListItemContentSlot = withContext<
  HTMLDivElement,
  GridListItemContentSlotProps
>("div", "itemContent");

// renderEmptyState content
export const GridListEmptyStateSlot = withContext<
  HTMLDivElement,
  GridListEmptyStateSlotProps
>("div", "emptyState");
