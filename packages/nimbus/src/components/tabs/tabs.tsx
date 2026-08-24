import {
  TabsRoot,
  TabsList,
  TabsTab,
  TabsPanels,
  TabsPanel,
} from "./components";

/**
 * Tabs
 * ============================================================
 * An accessible tabs component that allows users to switch between different views.
 * Built with React Aria Components for keyboard navigation and WCAG 2.1 AA compliance.
 *
 * @see {@link https://nimbus-documentation.vercel.app/components/navigation/tabs}
 *
 * @example
 * ```tsx
 * <Tabs.Root>
 *   <Tabs.List>
 *     <Tabs.Tab id="tab1">Tab 1</Tabs.Tab>
 *     <Tabs.Tab id="tab2">Tab 2</Tabs.Tab>
 *   </Tabs.List>
 *   <Tabs.Panels>
 *     <Tabs.Panel id="tab1">Content 1</Tabs.Panel>
 *     <Tabs.Panel id="tab2">Content 2</Tabs.Panel>
 *   </Tabs.Panels>
 * </Tabs.Root>
 * ```
 */
export const Tabs = {
  /**
   * # Tabs.Root
   *
   * The root component that provides context and state management for the tabs.
   * Must wrap all tabs parts (List, Tab, Panels, Panel) to coordinate their behavior.
   *
   * @example
   * ```tsx
   * <Tabs.Root orientation="horizontal" size="md">
   *   <Tabs.List>
   *     <Tabs.Tab id="tab1">Tab 1</Tabs.Tab>
   *   </Tabs.List>
   *   <Tabs.Panels>
   *     <Tabs.Panel id="tab1">Content</Tabs.Panel>
   *   </Tabs.Panels>
   * </Tabs.Root>
   * ```
   */
  Root: TabsRoot,
  /**
   * # Tabs.List
   *
   * The container for tab buttons that allows users to navigate between panels.
   * Handles keyboard navigation and manages the active tab state.
   *
   * @example
   * ```tsx
   * <Tabs.List>
   *   <Tabs.Tab id="tab1">First Tab</Tabs.Tab>
   *   <Tabs.Tab id="tab2">Second Tab</Tabs.Tab>
   * </Tabs.List>
   * ```
   */
  List: TabsList,
  /**
   * # Tabs.Tab
   *
   * An individual tab button that activates its corresponding panel when selected.
   * Supports keyboard navigation, disabled states, and custom content.
   *
   * @example
   * ```tsx
   * <Tabs.Tab id="settings" isDisabled={false}>
   *   <Icon name="settings" />
   *   Settings
   * </Tabs.Tab>
   * ```
   */
  Tab: TabsTab,
  /**
   * # Tabs.Panels
   *
   * The container for all tab panels that displays the content for the active tab.
   * Manages visibility and accessibility of panel content.
   *
   * @example
   * ```tsx
   * <Tabs.Panels>
   *   <Tabs.Panel id="tab1">First panel content</Tabs.Panel>
   *   <Tabs.Panel id="tab2">Second panel content</Tabs.Panel>
   * </Tabs.Panels>
   * ```
   */
  Panels: TabsPanels,
  /**
   * # Tabs.Panel
   *
   * An individual panel that displays content when its corresponding tab is active.
   * Automatically manages focus and accessibility attributes.
   *
   * @example
   * ```tsx
   * <Tabs.Panel id="profile">
   *   <h3>Profile Settings</h3>
   *   <p>Manage your profile information here.</p>
   * </Tabs.Panel>
   * ```
   */
  Panel: TabsPanel,
};

export type {
  TabsProps,
  TabListProps,
  TabProps,
  TabPanelsProps,
  TabPanelProps,
  TabItemProps,
} from "./tabs.types";

/**
 * todo: get rid of this, this is needed for the react-docgen-typescript script
 * that is parsing the typescript types for our documentation. The _ underscores
 * serve as a reminder that this exports are awkward and should not be used.
 */
export {
  TabsRoot as _TabsRoot,
  TabsList as _TabsList,
  TabsTab as _TabsTab,
  TabsPanels as _TabsPanels,
  TabsPanel as _TabsPanel,
};
