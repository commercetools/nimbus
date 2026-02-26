import type { OmitInternalProps } from "../../type-utils/omit-props";
import type { HTMLChakraProps, SlotRecipeProps } from "@chakra-ui/react";

// ============================================================
// RECIPE PROPS
// ============================================================

type TabsRecipeProps = {
  /**
   * Visual style variant of the tabs
   * @default "line"
   */
  variant?: SlotRecipeProps<"nimbusTabs">["variant"];
  /**
   * Layout orientation of the tabs
   * @default "horizontal"
   */
  orientation?: SlotRecipeProps<"nimbusTabs">["orientation"];
  /**
   * Placement of the tab list relative to panels
   * @default "start"
   */
  placement?: SlotRecipeProps<"nimbusTabs">["placement"];
  /**
   * Size variant of the tabs
   * @default "md"
   */
  size?: SlotRecipeProps<"nimbusTabs">["size"];
};

// ============================================================
// SLOT PROPS
// ============================================================

export type TabsRootSlotProps = HTMLChakraProps<"div", TabsRecipeProps>;

export type TabsListSlotProps = HTMLChakraProps<"div", TabsRecipeProps>;

export type TabsTabSlotProps = HTMLChakraProps<"button", TabsRecipeProps>;

export type TabsPanelsSlotProps = HTMLChakraProps<"div", TabsRecipeProps>;

export type TabsPanelSlotProps = HTMLChakraProps<"div", TabsRecipeProps>;

// ============================================================
// HELPER TYPES
// ============================================================

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
  /**
   * A URL to link to when the tab is clicked. When provided, the tab renders
   * as an anchor element instead of a button.
   */
  href?: string;
};

// ============================================================
// MAIN PROPS
// ============================================================

export type TabsProps = OmitInternalProps<TabsRootSlotProps> & {
  children?: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
  /**
   * Simplified tab data for automatic rendering.
   * When provided, the component renders tabs and panels automatically.
   */
  tabs?: TabItemProps[];
  /**
   * Accessible label for the tab list when using the simplified `tabs` prop API.
   * Required for accessibility when not using children-based composition.
   */
  tabListAriaLabel?: string;
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
   * @default "automatic"
   */
  keyboardActivation?: "automatic" | "manual";
  /**
   * Callback invoked when the selected tab changes.
   */
  onSelectionChange?: (key: string | number) => void;
  [key: `data-${string}`]: unknown;
};

/**
 * Props for the tab list container component
 */
export type TabListProps = OmitInternalProps<TabsListSlotProps> & {
  tabs?: TabItemProps[];
  children?: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
};

/**
 * Props for an individual tab component
 */
export type TabProps = OmitInternalProps<TabsTabSlotProps> & {
  children?: React.ReactNode;
  ref?: React.Ref<HTMLButtonElement>;
  id?: string;
  isDisabled?: boolean;
  /**
   * A URL to link to when the tab is clicked. When provided, the tab renders
   * as an anchor element (`<a>`) instead of a button, enabling native browser
   * navigation and router integration.
   */
  href?: string;
};

/**
 * Props for the tab panels container component
 */
export type TabPanelsProps = OmitInternalProps<TabsPanelsSlotProps> & {
  tabs?: TabItemProps[];
  children?: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
};

/**
 * Props for an individual tab panel component
 */
export type TabPanelProps = OmitInternalProps<TabsPanelSlotProps> & {
  id?: string;
  children?: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
};
