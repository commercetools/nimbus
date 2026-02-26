import type { OmitInternalProps } from "../../type-utils/omit-props";
import type { HTMLChakraProps, SlotRecipeProps } from "@chakra-ui/react";
import type { RouterOptions } from "../nimbus-provider/nimbus-provider.types";

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
  /** A unique key that associates this tab with its corresponding panel. */
  id: string;
  /** The label content displayed inside the tab button. */
  tabLabel: React.ReactNode;
  /** The content displayed in the panel when this tab is selected. */
  panelContent: React.ReactNode;
  /** Whether the tab is disabled. */
  isDisabled?: boolean;
  /**
   * A URL to link to when the tab is clicked. When provided, the tab renders
   * as an anchor element instead of a button.
   */
  href?: string;
  /**
   * The target window for the link.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#target
   */
  target?: React.HTMLAttributeAnchorTarget;
  /**
   * The relationship between the current document and the linked URL.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#rel
   */
  rel?: string;
  /**
   * Options for the client-side router when navigating via `href`.
   */
  routerOptions?: RouterOptions;
};

// ============================================================
// MAIN PROPS
// ============================================================

export type TabsProps = OmitInternalProps<TabsRootSlotProps> & {
  /**
   * The content of the tabs component. Use compound components (`Tabs.List`,
   * `Tabs.Tab`, `Tabs.Panels`, `Tabs.Panel`) for full control over rendering.
   * Mutually exclusive with the `tabs` prop.
   */
  children?: React.ReactNode;
  /** A ref to the root tabs element. */
  ref?: React.Ref<HTMLDivElement>;
  /**
   * Simplified tab data for automatic rendering.
   * When provided, the component renders tabs and panels automatically.
   * Mutually exclusive with `children`.
   */
  tabs?: TabItemProps[];
  /**
   * Accessible label for the tab list when using the simplified `tabs` prop API.
   * Required for accessibility when not using children-based composition.
   */
  tabListAriaLabel?: string;
  /**
   * The currently selected tab key (controlled).
   */
  selectedKey?: string | number;
  /**
   * The initially selected tab key (uncontrolled).
   */
  defaultSelectedKey?: string | number;
  /**
   * The keys of tabs that should be disabled.
   */
  disabledKeys?: Iterable<string | number>;
  /**
   * Whether tabs are activated automatically on focus or manually via Enter/Space.
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
  /**
   * Simplified tab data for automatic rendering of tab buttons.
   * Mutually exclusive with `children`.
   */
  tabs?: TabItemProps[];
  /**
   * The tab buttons to render inside the list. Use `Tabs.Tab` components.
   * Mutually exclusive with the `tabs` prop.
   */
  children?: React.ReactNode;
  /** A ref to the tab list element. */
  ref?: React.Ref<HTMLDivElement>;
};

/**
 * Props for an individual tab component
 */
export type TabProps = OmitInternalProps<TabsTabSlotProps> & {
  /** The label content displayed inside the tab. */
  children?: React.ReactNode;
  /** A ref to the underlying tab element. */
  ref?: React.Ref<HTMLButtonElement>;
  /** A unique key that associates this tab with its corresponding panel. */
  id?: string;
  /** Whether the tab is disabled. */
  isDisabled?: boolean;
  /**
   * A URL to link to when the tab is clicked. When provided, the tab renders
   * as an anchor element (`<a>`) instead of a button, enabling native browser
   * navigation and router integration.
   */
  href?: string;
  /**
   * The target window for the link.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#target
   */
  target?: React.HTMLAttributeAnchorTarget;
  /**
   * The relationship between the current document and the linked URL.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#rel
   */
  rel?: string;
  /**
   * Options for the client-side router when navigating via `href`.
   */
  routerOptions?: RouterOptions;
};

/**
 * Props for the tab panels container component
 */
export type TabPanelsProps = OmitInternalProps<TabsPanelsSlotProps> & {
  /**
   * Simplified tab data for automatic rendering of tab panels.
   * Mutually exclusive with `children`.
   */
  tabs?: TabItemProps[];
  /**
   * The tab panels to render. Use `Tabs.Panel` components.
   * Mutually exclusive with the `tabs` prop.
   */
  children?: React.ReactNode;
  /** A ref to the tab panels container element. */
  ref?: React.Ref<HTMLDivElement>;
};

/**
 * Props for an individual tab panel component
 */
export type TabPanelProps = OmitInternalProps<TabsPanelSlotProps> & {
  /** A unique key that associates this panel with its corresponding tab. */
  id?: string;
  /** The content displayed when the corresponding tab is selected. */
  children?: React.ReactNode;
  /** A ref to the tab panel element. */
  ref?: React.Ref<HTMLDivElement>;
  /**
   * Whether to mount the tab panel in the DOM even when it is not currently
   * selected. Inactive tab panels are inert and cannot be interacted with.
   * They must be styled appropriately so this is clear to the user visually.
   * @default false
   */
  shouldForceMount?: boolean;
};
