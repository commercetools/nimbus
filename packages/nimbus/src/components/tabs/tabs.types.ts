import type {
  TabsRootProps,
  TabsListProps,
  TabsTabProps,
  TabsPanelsProps,
  TabsPanelProps,
} from "./tabs.slots";
import type { RecipeVariantProps } from "@chakra-ui/react/styled-system";
import { tabsSlotRecipe } from "./tabs.recipe";

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
  id: string;
  title: React.ReactNode;
  content: React.ReactNode;
  isDisabled?: boolean;
}

/**
 * Main props interface for the Tabs root component.
 * Combines React Aria tabs props with our styling variants.
 */
export interface TabsProps extends TabsRootProps, TabsVariantProps {
  children?: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
  /**
   * Direction of the tabs layout
   * @default "horizontal"
   */
  direction?: "horizontal" | "vertical";
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
export interface TabListProps extends TabsListProps {
  tabs?: TabItemProps[];
  children?: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
}

/**
 * Props for individual tab component
 */
export interface TabProps extends TabsTabProps {
  children?: React.ReactNode;
  ref?: React.Ref<HTMLButtonElement>;
  isDisabled?: boolean;
}

/**
 * Props for tab panels container component
 */
export interface TabPanelsProps extends TabsPanelsProps {
  tabs?: TabItemProps[];
  children?: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
}

/**
 * Props for individual tab panel component
 */
export interface TabPanelProps extends TabsPanelProps {
  tabs?: TabItemProps[];
  children?: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
}
