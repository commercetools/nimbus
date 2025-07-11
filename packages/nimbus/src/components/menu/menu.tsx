export { MenuRoot } from "./components/menu.root";
export { MenuTrigger } from "./components/menu.trigger";
export { MenuContent } from "./components/menu.content";
export { MenuItem as MenuItemComponent } from "./components/menu.item";
export { MenuItemLabel } from "./components/menu.item-label";
export { MenuItemDescription } from "./components/menu.item-description";
export { MenuItemKeyboard } from "./components/menu.item-keyboard";
export { MenuItemIcon } from "./components/menu.item-icon";
export { MenuSeparator } from "./components/menu.separator";
export { MenuGroup } from "./components/menu.group";
export { MenuGroupLabel } from "./components/menu.group-label";

// Re-export types
export type * from "./menu.types";

// Create compound component
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

export {
  MenuRoot as _MenuRoot,
  MenuTrigger as _MenuTrigger,
  MenuContent as _MenuContent,
  MenuItem as _MenuItemComponent,
  MenuItemLabel as _MenuItemLabel,
  MenuItemDescription as _MenuItemDescription,
  MenuItemKeyboard as _MenuItemKeyboard,
  MenuItemIcon as _MenuItemIcon,
  MenuSeparator as _MenuSeparator,
  MenuGroup as _MenuGroup,
  MenuGroupLabel as _MenuGroupLabel,
  MenuSubmenuTrigger as _MenuSubmenu,
};
