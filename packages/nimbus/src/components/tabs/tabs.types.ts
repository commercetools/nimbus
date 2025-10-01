import { tabsSlotRecipe } from "./tabs.recipe";

import {
  type HTMLChakraProps,
  type RecipeVariantProps,
} from "@chakra-ui/react/styled-system";

/**
 * Root props interface that extends React Aria's tabs props with our recipe props.
 */
export interface TabsRootSlotProps
  extends HTMLChakraProps<"div", RecipeVariantProps<typeof tabsSlotRecipe>> {
  /**
   * The children of the Tabs component.
   */
  children?: React.ReactNode;
  /**
   * The selected key of the Tabs component.
   */
  selectedKey?: string | number;
  /**
   * The default selected key of the Tabs component.
   */
  defaultSelectedKey?: string | number;
  /**
   * The disabled keys of the Tabs component.
   */
  disabledKeys?: Iterable<string | number>;
  /**
   * The keyboard activation of the Tabs component.
   */
  keyboardActivation?: "automatic" | "manual";
  /**
   * The orientation of the Tabs component.
   */
  orientation?: "horizontal" | "vertical left" | "vertical right";
  /**
   * The placement of the Tabs component.
   */
  placement?: "start" | "end";
  /**
   * The size of the Tabs component.
   */
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

/**
 * Tabs recipe variant props for direction and placement configuration
 */
type TabsVariantProps = RecipeVariantProps<typeof tabsSlotRecipe> & {
  [key: `data-${string}`]: unknown;
};

/**
 * Props for individual tab item component
 */
export interface TabItemProps {
  /**
   * The id of the tab item
   */
  id: string;
  /**
   * The tabLabel of the tab item
   */
  tabLabel: React.ReactNode;
  /**
   * The panelContent of the tab item
   */
  panelContent: React.ReactNode;
  /**
   * Whether the tab item is disabled
   */
  isDisabled?: boolean;
}

/**
 * Main props interface for the Tabs root component.
 * Combines React Aria tabs props with our styling variants.
 */
export interface TabsProps extends TabsRootSlotProps, TabsVariantProps {
  children?: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
  /**
   * Direction of the tabs layout
   * @default "horizontal"
   */
  orientation?: "horizontal" | "vertical left" | "vertical right";
  /**
   * Placement of the tab list relative to panels
   * @default "start"
   */
  placement?: "start" | "end";
  /**
   * Size of the tabs affecting padding and font size
   * @default "md"
   */
  size?: "sm" | "md" | "lg";
  /**
   * Array of tab items for collection rendering
   * When provided, tabs will be rendered automatically from this data
   */
  tabs?: TabItemProps[];
}

/**
 * Props for individual tab list component
 */
export interface TabListProps extends TabsListSlotProps {
  tabs?: TabItemProps[];
  children?: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
}

/**
 * Props for individual tab component
 */
export interface TabProps extends TabsTabSlotProps {
  children?: React.ReactNode;
  ref?: React.Ref<HTMLButtonElement>;
  isDisabled?: boolean;
}

/**
 * Props for tab panels container component
 */
export interface TabPanelsProps extends TabsPanelsSlotProps {
  tabs?: TabItemProps[];
  children?: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
}

/**
 * Props for individual tab panel component
 */
export interface TabPanelProps extends TabsPanelSlotProps {
  tabs?: TabItemProps[];
  children?: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
}
