import type { OmitUnwantedProps } from "../../type-utils/omit-props";
import { type HTMLChakraProps, type SlotRecipeProps } from "@chakra-ui/react";

// ============================================================
// RECIPE PROPS
// ============================================================

type TabsRecipeProps = {
  /**
   * Layout orientation of the tabs
   * @default "horizontal"
   */
  orientation?: SlotRecipeProps<"tabs">["orientation"];
  /**
   * Placement of the tab list relative to panels
   * @default "start"
   */
  placement?: SlotRecipeProps<"tabs">["placement"];
  /**
   * Size variant of the tabs
   * @default "md"
   */
  size?: SlotRecipeProps<"tabs">["size"];
};

// ============================================================
// SLOT PROPS
// ============================================================

export type TabsRootSlotProps = HTMLChakraProps<"div", TabsRecipeProps> & {
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
};

export type TabsListSlotProps = HTMLChakraProps<"div", TabsRecipeProps> & {
  children?: React.ReactNode;
};

export type TabsTabSlotProps = HTMLChakraProps<"button", TabsRecipeProps> & {
  id?: string;
  isDisabled?: boolean;
};

export type TabsPanelsSlotProps = HTMLChakraProps<
  "div",
  SlotRecipeProps<"tabs">
> & {
  children?: React.ReactNode;
};

export type TabsPanelSlotProps = HTMLChakraProps<
  "div",
  SlotRecipeProps<"tabs">
> & {
  id?: string;
};

// ============================================================
// HELPER TYPES
// ============================================================

type TabsVariantProps = SlotRecipeProps<"tabs"> & {
  [key: `data-${string}`]: unknown;
};

export type TabItemProps = {
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
};

// ============================================================
// MAIN PROPS
// ============================================================

export type TabsProps = OmitUnwantedProps<TabsRootSlotProps> &
  TabsVariantProps & {
    children?: React.ReactNode;
    ref?: React.Ref<HTMLDivElement>;
    tabs?: TabItemProps[];
  };

/**
 * Props for individual tab list component
 */
export type TabListProps = OmitUnwantedProps<TabsListSlotProps> & {
  tabs?: TabItemProps[];
  children?: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
};

/**
 * Props for individual tab component
 */
export type TabProps = OmitUnwantedProps<TabsTabSlotProps> & {
  children?: React.ReactNode;
  ref?: React.Ref<HTMLButtonElement>;
  isDisabled?: boolean;
};

/**
 * Props for tab panels container component
 */
export type TabPanelsProps = OmitUnwantedProps<TabsPanelsSlotProps> & {
  tabs?: TabItemProps[];
  children?: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
};

/**
 * Props for individual tab panel component
 */
export type TabPanelProps = OmitUnwantedProps<TabsPanelSlotProps> & {
  tabs?: TabItemProps[];
  children?: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
};
