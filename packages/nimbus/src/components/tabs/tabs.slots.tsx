import { createSlotRecipeContext } from "@chakra-ui/react";
import { tabsSlotRecipe } from "./tabs.recipe";
import type {
  TabsRootSlotProps,
  TabsListSlotProps,
  TabsTabSlotProps,
  TabsPanelsSlotProps,
  TabsPanelSlotProps,
} from "./tabs.types";

const { withProvider, withContext } = createSlotRecipeContext({
  recipe: tabsSlotRecipe,
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

export const TabsPanelsSlot = withContext<HTMLDivElement, TabsPanelsSlotProps>(
  "div",
  "panels"
);

export const TabsPanelSlot = withContext<HTMLDivElement, TabsPanelSlotProps>(
  "div",
  "panel"
);
