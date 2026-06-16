import { createSlotRecipeContext } from "@chakra-ui/react/styled-system";
import type { SlotComponent } from "@/type-utils";
import type {
  TreeRootSlotProps,
  TreeItemSlotProps,
  TreeItemContentSlotProps,
  TreeIndicatorSlotProps,
} from "./tree.types";

const { withProvider, withContext } = createSlotRecipeContext({
  key: "nimbusTree",
});

/**
 * Root slot — provides the recipe context for all descendant slots.
 */
export const TreeRootSlot: SlotComponent<HTMLDivElement, TreeRootSlotProps> =
  withProvider<HTMLDivElement, TreeRootSlotProps>("div", "root");

/**
 * Item slot — the focusable tree row (`role="row"`).
 */
export const TreeItemSlot: SlotComponent<HTMLDivElement, TreeItemSlotProps> =
  withContext<HTMLDivElement, TreeItemSlotProps>("div", "item");

/**
 * Item content slot — the row's content container (indicator, optional
 * selection checkbox, and label). Applies level-based indentation.
 */
export const TreeItemContentSlot: SlotComponent<
  HTMLDivElement,
  TreeItemContentSlotProps
> = withContext<HTMLDivElement, TreeItemContentSlotProps>("div", "itemContent");

/**
 * Indicator slot — the expand/collapse chevron button.
 */
export const TreeIndicatorSlot: SlotComponent<
  HTMLButtonElement,
  TreeIndicatorSlotProps
> = withContext<HTMLButtonElement, TreeIndicatorSlotProps>(
  "button",
  "indicator"
);
