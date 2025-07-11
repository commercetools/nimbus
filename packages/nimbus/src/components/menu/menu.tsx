import { MenuRoot } from "./components/menu.root";
import { MenuTrigger } from "./components/menu.trigger";
import { MenuContent } from "./components/menu.content";
import { MenuItem } from "./components/menu.item";
import { MenuItemLabel } from "./components/menu.item-label";
import { MenuItemDescription } from "./components/menu.item-description";
import { MenuItemKeyboard } from "./components/menu.item-keyboard";
import { MenuItemIcon } from "./components/menu.item-icon";
import { MenuSeparator } from "./components/menu.separator";
import { MenuGroup } from "./components/menu.group";
import { MenuGroupLabel } from "./components/menu.group-label";
import { MenuSubmenuTrigger } from "./components/menu.submenu-trigger";
import { MenuSubmenu } from "./components/menu.submenu";

// Re-export types
export type * from "./menu.types";

export const Menu = {
  Root: MenuRoot,
  Trigger: MenuTrigger,
  Content: MenuContent,
  Item: MenuItem,
  ItemLabel: MenuItemLabel,
  ItemDescription: MenuItemDescription,
  ItemKeyboard: MenuItemKeyboard,
  ItemIcon: MenuItemIcon,
  Separator: MenuSeparator,
  Group: MenuGroup,
  GroupLabel: MenuGroupLabel,
  Submenu: MenuSubmenu,
  SubmenuTrigger: MenuSubmenuTrigger,
};

// Exports for internal use by react-docgen
export {
  MenuRoot as _MenuRoot,
  MenuTrigger as _MenuTrigger,
  MenuContent as _MenuContent,
  MenuItem as _MenuItem,
  MenuItemLabel as _MenuItemLabel,
  MenuItemDescription as _MenuItemDescription,
  MenuItemKeyboard as _MenuItemKeyboard,
  MenuItemIcon as _MenuItemIcon,
  MenuSeparator as _MenuSeparator,
  MenuGroup as _MenuGroup,
  MenuGroupLabel as _MenuGroupLabel,
  MenuSubmenuTrigger as _MenuSubmenuTrigger,
  MenuSubmenu as _MenuSubmenu,
};
