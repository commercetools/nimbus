import {
  createSlotRecipeContext,
  type HTMLChakraProps,
} from "@chakra-ui/react/styled-system";
import type { SlotComponent } from "@/type-utils";
import type { GridListRootSlotProps } from "./grid-list.types";

const { withProvider, withContext } = createSlotRecipeContext({
  key: "nimbusGridList",
});

/**
 * Root slot — provides the recipe context for all descendant slots.
 */
export const GridListRootSlot: SlotComponent<
  HTMLDivElement,
  GridListRootSlotProps
> = withProvider<HTMLDivElement, GridListRootSlotProps>("div", "root");

/**
 * Item slot — the focusable interactive row (`role="row"`).
 */
export const GridListItemSlot = withContext<
  HTMLDivElement,
  HTMLChakraProps<"div">
>("div", "item");
