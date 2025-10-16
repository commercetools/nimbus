import { createSlotRecipeContext } from "@chakra-ui/react";
import type {
  TabsRootSlotProps,
  TabsListSlotProps,
  TabsTabSlotProps,
  TabsPanelsSlotProps,
  TabsPanelSlotProps,
} from "./tabs.types";
import type { SlotComponent } from "@/utils/slot-types";

const { withProvider, withContext } = createSlotRecipeContext({
  key: "tabs",
});

/**
 * Root component that provides the styling context for the Tabs component.
 * Uses Chakra UI's recipe context system for consistent styling across instances.
 */
export const TabsRootSlot = withProvider<HTMLDivElement, TabsRootSlotProps>(
  "div",
  "root"
);

export const TabsListSlot = withContext<HTMLDivElement, TabsListSlotProps>(
  "div",
  "list"
);

export const TabsTabSlot = withContext<HTMLButtonElement, TabsTabSlotProps>(
  "button",
  "tab"
);

export const TabsPanelsSlot: SlotComponent<
  HTMLDivElement,
  TabsPanelsSlotProps
> = withContext<HTMLDivElement, TabsPanelsSlotProps>("div", "panels");

export const TabsPanelSlot: SlotComponent<HTMLDivElement, TabsPanelSlotProps> =
  withContext<HTMLDivElement, TabsPanelSlotProps>("div", "panel");
