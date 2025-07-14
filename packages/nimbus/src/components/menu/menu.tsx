import { MenuRoot } from "./components/menu.root";
import { MenuTrigger } from "./components/menu.trigger";
import { MenuContent } from "./components/menu.content";
import { MenuItem } from "./components/menu.item";
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
  MenuSeparator as _MenuSeparator,
  MenuGroup as _MenuGroup,
  MenuGroupLabel as _MenuGroupLabel,
  MenuSubmenuTrigger as _MenuSubmenuTrigger,
  MenuSubmenu as _MenuSubmenu,
};
