import {
  type HTMLChakraProps,
  createSlotRecipeContext,
  type RecipeVariantProps,
} from "@chakra-ui/react/styled-system";

import { tabsSlotRecipe } from "./tabs.recipe";

/**
 * Root props interface that extends React Aria's tabs props with our recipe props.
 */
export interface TabsRootSlotProps
  extends HTMLChakraProps<"div", RecipeVariantProps<typeof tabsSlotRecipe>> {
  children?: React.ReactNode;
  selectedKey?: string | number;
  defaultSelectedKey?: string | number;
  onSelectionChange?: (key: string | number) => void;
  isDisabled?: boolean;
  disabledKeys?: Iterable<string | number>;
  keyboardActivation?: "automatic" | "manual";
  orientation?: "horizontal" | "vertical left" | "vertical right";
  placement?: "start" | "end";
  size?: "sm" | "md" | "lg";
}

export interface TabsListSlotProps
  extends HTMLChakraProps<"div", RecipeVariantProps<typeof tabsSlotRecipe>> {
  children?: React.ReactNode;
}

export interface TabsTabSlotProps
  extends HTMLChakraProps<"button", RecipeVariantProps<typeof tabsSlotRecipe>> {
  id?: string;
  isDisabled?: boolean;
}

export interface TabsPanelsSlotProps
  extends HTMLChakraProps<"div", RecipeVariantProps<typeof tabsSlotRecipe>> {
  children?: React.ReactNode;
}

export interface TabsPanelSlotProps
  extends HTMLChakraProps<"div", RecipeVariantProps<typeof tabsSlotRecipe>> {
  id?: string;
}

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
