import { createSlotRecipeContext } from "@chakra-ui/react/styled-system";
import type { SlotComponent } from "../../type-utils/slot-types";
import type {
  ItemGroupRootSlotProps,
  ItemGroupSeparatorSlotProps,
} from "./item-group.types";

const { withProvider, withContext } = createSlotRecipeContext({
  key: "nimbusItemGroup",
});

/**
 * Root slot — provides the `nimbusItemGroup` styling context and lays the
 * grouped rows out as a vertical stack.
 */
export const ItemGroupRootSlot: SlotComponent<
  HTMLDivElement,
  ItemGroupRootSlotProps
> = withProvider<HTMLDivElement, ItemGroupRootSlotProps>("div", "root");

/**
 * Separator slot — a horizontal divider between grouped rows.
 */
export const ItemGroupSeparatorSlot: SlotComponent<
  HTMLDivElement,
  ItemGroupSeparatorSlotProps
> = withContext<HTMLDivElement, ItemGroupSeparatorSlotProps>(
  "div",
  "separator"
);
