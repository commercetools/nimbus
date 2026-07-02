import { createSlotRecipeContext } from "@chakra-ui/react/styled-system";
import type { SlotComponent } from "@/type-utils";
import type {
  TabNavRootSlotProps,
  TabNavItemSlotProps,
  TabNavIndicatorSlotProps,
} from "./tab-nav.types";

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

/**
 * Internal slot for the sliding active-item marker. Rendered automatically by
 * `TabNav.Root` and positioned by `useSlidingIndicator` — not part of the public
 * compound API.
 */
export const TabNavIndicatorSlot: SlotComponent<
  HTMLDivElement,
  TabNavIndicatorSlotProps
> = withContext<HTMLDivElement, TabNavIndicatorSlotProps>("div", "indicator");
