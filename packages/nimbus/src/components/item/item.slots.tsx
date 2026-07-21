import { createSlotRecipeContext } from "@chakra-ui/react/styled-system";
import type { SlotComponent } from "../../type-utils/slot-types";
import type {
  ItemActionsSlotProps,
  ItemContentSlotProps,
  ItemDescriptionSlotProps,
  ItemFooterSlotProps,
  ItemHeaderSlotProps,
  ItemMediaSlotProps,
  ItemRootSlotProps,
  ItemTitleSlotProps,
} from "./item.types";

const { withProvider, withContext } = createSlotRecipeContext({
  key: "nimbusItem",
});

/**
 * Root slot — provides the `nimbusItem` styling context for all Item parts.
 * Rendered as a `<div>` by default; `Item.Root` swaps it to an `<a>` (via
 * `as="a"`) when the row upgrades to a link.
 */
export const ItemRootSlot: SlotComponent<HTMLDivElement, ItemRootSlotProps> =
  withProvider<HTMLDivElement, ItemRootSlotProps>("div", "root");

export const ItemHeaderSlot: SlotComponent<
  HTMLDivElement,
  ItemHeaderSlotProps
> = withContext<HTMLDivElement, ItemHeaderSlotProps>("div", "header");

export const ItemMediaSlot: SlotComponent<HTMLDivElement, ItemMediaSlotProps> =
  withContext<HTMLDivElement, ItemMediaSlotProps>("div", "media");

export const ItemContentSlot: SlotComponent<
  HTMLDivElement,
  ItemContentSlotProps
> = withContext<HTMLDivElement, ItemContentSlotProps>("div", "content");

export const ItemTitleSlot: SlotComponent<HTMLDivElement, ItemTitleSlotProps> =
  withContext<HTMLDivElement, ItemTitleSlotProps>("div", "title");

export const ItemDescriptionSlot: SlotComponent<
  HTMLDivElement,
  ItemDescriptionSlotProps
> = withContext<HTMLDivElement, ItemDescriptionSlotProps>("div", "description");

export const ItemActionsSlot: SlotComponent<
  HTMLDivElement,
  ItemActionsSlotProps
> = withContext<HTMLDivElement, ItemActionsSlotProps>("div", "actions");

export const ItemFooterSlot: SlotComponent<
  HTMLDivElement,
  ItemFooterSlotProps
> = withContext<HTMLDivElement, ItemFooterSlotProps>("div", "footer");
