import {
  type HTMLChakraProps,
  createSlotRecipeContext,
  type RecipeVariantProps,
} from "@chakra-ui/react/styled-system";

import { tabsSlotRecipe } from "./tabs.recipe";

/**
 * Root props interface that extends React Aria's tabs props with our recipe props.
 */
export interface TabsRootProps
  extends HTMLChakraProps<"div", RecipeVariantProps<typeof tabsSlotRecipe>> {
  children?: React.ReactNode;
  selectedKey?: string | number;
  defaultSelectedKey?: string | number;
  onSelectionChange?: (key: string | number) => void;
  isDisabled?: boolean;
  disabledKeys?: Iterable<string | number>;
  orientation?: "horizontal" | "vertical";
  keyboardActivation?: "automatic" | "manual";
  direction?: "horizontal" | "vertical";
  placement?: "start" | "end";
  size?: "sm" | "md" | "lg";
}

export interface TabsListProps
  extends HTMLChakraProps<"div", RecipeVariantProps<typeof tabsSlotRecipe>> {
  children?: React.ReactNode;
}

export interface TabsTabProps
  extends HTMLChakraProps<"button", RecipeVariantProps<typeof tabsSlotRecipe>> {
  id?: string;
  isDisabled?: boolean;
}

export interface TabsPanelsProps
  extends HTMLChakraProps<"div", RecipeVariantProps<typeof tabsSlotRecipe>> {
  children?: React.ReactNode;
}

export interface TabsPanelProps
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
export const TabsRoot = withProvider<HTMLDivElement, TabsRootProps>(
  "div",
  "root"
);

export const TabList = withContext<HTMLDivElement, TabsListProps>(
  "div",
  "list"
);

export const TabsTab = withContext<HTMLButtonElement, TabsTabProps>(
  "button",
  "tab"
);

export const TabPanels = withContext<HTMLDivElement, TabsPanelsProps>(
  "div",
  "panels"
);

export const TabPanel = withContext<HTMLDivElement, TabsPanelProps>(
  "div",
  "panel"
);
