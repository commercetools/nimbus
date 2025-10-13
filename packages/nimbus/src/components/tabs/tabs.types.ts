import { type HTMLChakraProps, type SlotRecipeProps } from "@chakra-ui/react";

type TabsRecipeProps = {
  orientation?: SlotRecipeProps<"tabs">["orientation"];
  placement?: SlotRecipeProps<"tabs">["placement"];
  size?: SlotRecipeProps<"tabs">["size"];
};

/**
 * Root props type that extends React Aria's tabs props with our recipe props.
 */
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

/**
 * Tabs recipe variant props for direction and placement configuration
 */
type TabsVariantProps = SlotRecipeProps<"tabs"> & {
  [key: `data-${string}`]: unknown;
};

/**
 * Props for individual tab item component
 */
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

/**
 * Main props type for the Tabs root component.
 * Combines React Aria tabs props with our styling variants.
 */
export type TabsProps = TabsRootSlotProps &
  TabsVariantProps & {
    children?: React.ReactNode;
    ref?: React.Ref<HTMLDivElement>;
    tabs?: TabItemProps[];
  };

/**
 * Props for individual tab list component
 */
export type TabListProps = TabsListSlotProps & {
  tabs?: TabItemProps[];
  children?: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
};

/**
 * Props for individual tab component
 */
export type TabProps = TabsTabSlotProps & {
  children?: React.ReactNode;
  ref?: React.Ref<HTMLButtonElement>;
  isDisabled?: boolean;
};

/**
 * Props for tab panels container component
 */
export type TabPanelsProps = TabsPanelsSlotProps & {
  tabs?: TabItemProps[];
  children?: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
};

/**
 * Props for individual tab panel component
 */
export type TabPanelProps = TabsPanelSlotProps & {
  tabs?: TabItemProps[];
  children?: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
};
