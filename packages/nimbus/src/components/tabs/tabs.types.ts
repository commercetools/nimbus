import type { OmitInternalProps } from "../../type-utils/omit-props";
import type { HTMLChakraProps, SlotRecipeProps } from "@chakra-ui/react/styled-system";

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
  /**
   * Callback invoked when the selected tab changes.
   */
  onSelectionChange?: (key: string | number) => void;
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
  SlotRecipeProps<"nimbusTabs">
> & {
  children?: React.ReactNode;
};

export type TabsPanelSlotProps = HTMLChakraProps<
  "div",
  SlotRecipeProps<"nimbusTabs">
> & {
  id?: string;
};

// ============================================================
// HELPER TYPES
// ============================================================

type TabsVariantProps = SlotRecipeProps<"nimbusTabs"> & {
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

export type TabsProps = OmitInternalProps<TabsRootSlotProps> &
  TabsVariantProps & {
    children?: React.ReactNode;
    ref?: React.Ref<HTMLDivElement>;
    tabs?: TabItemProps[];
    /**
     * Accessible label for the tab list when using the simplified `tabs` prop API.
     * Required for accessibility when not using children-based composition.
     */
    tabListAriaLabel?: string;
  };

/**
 * Props for individual tab list component
 */
export type TabListProps = OmitInternalProps<TabsListSlotProps> & {
  tabs?: TabItemProps[];
  children?: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
};

/**
 * Props for individual tab component
 */
export type TabProps = OmitInternalProps<TabsTabSlotProps> & {
  children?: React.ReactNode;
  ref?: React.Ref<HTMLButtonElement>;
  isDisabled?: boolean;
};

/**
 * Props for tab panels container component
 */
export type TabPanelsProps = OmitInternalProps<TabsPanelsSlotProps> & {
  tabs?: TabItemProps[];
  children?: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
};

/**
 * Props for individual tab panel component
 */
export type TabPanelProps = OmitInternalProps<TabsPanelSlotProps> & {
  tabs?: TabItemProps[];
  children?: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
};
