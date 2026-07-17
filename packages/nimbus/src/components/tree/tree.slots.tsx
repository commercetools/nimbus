import {
  createSlotRecipeContext,
  type HTMLChakraProps,
} from "@chakra-ui/react/styled-system";
import type { SlotComponent } from "@/type-utils";
import type { TreeRootSlotProps } from "./tree.types";

const { withProvider, withContext } = createSlotRecipeContext({
  key: "nimbusTree",
});

/**
 * Root slot — provides the recipe context for all descendant slots.
 */
export const TreeRootSlot: SlotComponent<HTMLDivElement, TreeRootSlotProps> =
  withProvider<HTMLDivElement, TreeRootSlotProps>("div", "root");

/**
 * Item slot — the focusable tree row (`role="treeitem"`).
 */
export const TreeItemSlot = withContext<HTMLDivElement, HTMLChakraProps<"div">>(
  "div",
  "item"
);

/**
 * Item content slot — the row's content container (indicator, optional
 * selection checkbox, and label). Applies level-based indentation.
 */
export const TreeItemContentSlot = withContext<
  HTMLDivElement,
  HTMLChakraProps<"div">
>("div", "itemContent");

/**
 * Indicator slot — the expand/collapse chevron button.
 */
export const TreeIndicatorSlot = withContext<
  HTMLButtonElement,
  HTMLChakraProps<"button">
>("button", "indicator");
