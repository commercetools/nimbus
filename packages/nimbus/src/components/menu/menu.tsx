import {
  MenuRoot,
  MenuTrigger,
  MenuContent,
  MenuItem,
  MenuSection,
  MenuSubmenuTrigger,
  MenuSubmenu,
} from "./components";

export const Menu = {
  /**
   * # Menu.Root
   *
   * The root container component that provides configuration and state management
   * for the entire menu. Wraps MenuTrigger and handles open/close state.
   *
   * @example
   * ```tsx
   * <Menu.Root onAction={(key) => console.log(key)}>
   *   <Menu.Trigger>Options</Menu.Trigger>
   *   <Menu.Content>
   *     <Menu.Item id="edit">Edit</Menu.Item>
   *   </Menu.Content>
   * </Menu.Root>
   * ```
   */
  Root: MenuRoot,

  /**
   * # Menu.Trigger
   *
   * The button or element that opens the menu when activated.
   * Supports custom trigger elements via the `asChild` prop.
   *
   * @example
   * ```tsx
   * <Menu.Root>
   *   <Menu.Trigger>Open Menu</Menu.Trigger>
   *   <Menu.Content>...</Menu.Content>
   * </Menu.Root>
   * ```
   */
  Trigger: MenuTrigger,

  /**
   * # Menu.Content
   *
   * The popover container that displays menu items. Automatically positions
   * relative to the trigger and handles focus management.
   *
   * @example
   * ```tsx
   * <Menu.Root>
   *   <Menu.Trigger>Options</Menu.Trigger>
   *   <Menu.Content>
   *     <Menu.Item id="save">Save</Menu.Item>
   *     <Menu.Item id="delete">Delete</Menu.Item>
   *   </Menu.Content>
   * </Menu.Root>
   * ```
   */
  Content: MenuContent,

  /**
   * # Menu.Item
   *
   * An individual menu item that can be selected. Supports icons, labels,
   * descriptions, keyboard shortcuts, and critical styling.
   *
   * @example
   * ```tsx
   * <Menu.Item id="delete" isCritical>
   *   <Icon slot="icon"><Icons.Delete /></Icon>
   *   <Text slot="label">Delete</Text>
   *   <Text slot="description">Remove permanently</Text>
   *   <Kbd slot="keyboard">⌘⌫</Kbd>
   * </Menu.Item>
   * ```
   */
  Item: MenuItem,

  /**
   * # Menu.Section
   *
   * Groups related menu items with an optional label. Supports selection modes
   * for single or multiple selections within the section.
   *
   * @example
   * ```tsx
   * <Menu.Content>
   *   <Menu.Section label="Edit Actions">
   *     <Menu.Item id="copy">Copy</Menu.Item>
   *     <Menu.Item id="paste">Paste</Menu.Item>
   *   </Menu.Section>
   * </Menu.Content>
   * ```
   */
  Section: MenuSection,

  /**
   * # Menu.Submenu
   *
   * A nested menu that appears when hovering over or selecting a submenu trigger.
   * Automatically positioned to the side of the parent menu.
   *
   * @example
   * ```tsx
   * <Menu.Item>
   *   <Menu.SubmenuTrigger>
   *     <Text slot="label">More Options</Text>
   *   </Menu.SubmenuTrigger>
   *   <Menu.Submenu>
   *     <Menu.Item id="option1">Option 1</Menu.Item>
   *   </Menu.Submenu>
   * </Menu.Item>
   * ```
   */
  Submenu: MenuSubmenu,

  /**
   * # Menu.SubmenuTrigger
   *
   * The trigger element for opening a submenu. Must be used within a Menu.Item
   * and paired with Menu.Submenu.
   *
   * @example
   * ```tsx
   * <Menu.Item>
   *   <Menu.SubmenuTrigger>
   *     <Text slot="label">Export</Text>
   *   </Menu.SubmenuTrigger>
   *   <Menu.Submenu>
   *     <Menu.Item id="pdf">PDF</Menu.Item>
   *     <Menu.Item id="csv">CSV</Menu.Item>
   *   </Menu.Submenu>
   * </Menu.Item>
   * ```
   */
  SubmenuTrigger: MenuSubmenuTrigger,
};

// Exports for internal use by react-docgen
export {
  MenuRoot as _MenuRoot,
  MenuTrigger as _MenuTrigger,
  MenuContent as _MenuContent,
  MenuItem as _MenuItem,
  MenuSection as _MenuSection,
  MenuSubmenuTrigger as _MenuSubmenuTrigger,
  MenuSubmenu as _MenuSubmenu,
};
