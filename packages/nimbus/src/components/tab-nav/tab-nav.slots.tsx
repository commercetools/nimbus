import { createSlotRecipeContext } from "@chakra-ui/react/styled-system";
import type { SlotComponent } from "@/type-utils";
import type { TabNavRootSlotProps, TabNavItemSlotProps } from "./tab-nav.types";

const { withProvider, withContext } = createSlotRecipeContext({
  key: "nimbusTabNav",
});

/**
 * Root slot component providing the styling context for the TabNav component.
 * Uses Chakra UI's recipe context system for consistent styling across instances.
 * Renders as a `<nav>` landmark element.
 */
export const TabNavRootSlot: SlotComponent<HTMLElement, TabNavRootSlotProps> =
  withProvider<HTMLElement, TabNavRootSlotProps>("nav", "root");

/**
 * Item slot component for individual tab navigation links.
 * Consumes the styling context from `TabNavRootSlot`.
 * Renders as an `<a>` element.
 */
export const TabNavItemSlot: SlotComponent<
  HTMLAnchorElement,
  TabNavItemSlotProps
> = withContext<HTMLAnchorElement, TabNavItemSlotProps>("a", "item");
