import { createSlotRecipeContext } from "@chakra-ui/react/styled-system";
import type { SlotComponent } from "@/type-utils";
import type {
  TabsRootSlotProps,
  TabsListSlotProps,
  TabsTabSlotProps,
  TabsPanelsSlotProps,
  TabsPanelSlotProps,
} from "./tabs.types";

const { withProvider, withContext } = createSlotRecipeContext({
  key: "nimbusTabs",
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
