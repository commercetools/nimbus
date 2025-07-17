import type { MenuSubmenuProps } from "../menu.types";
import { MenuContent } from "./menu.content";

export const MenuSubmenu = ({ children, ...props }: MenuSubmenuProps) => {
  return (
    <MenuContent {...props} placement="end">
      {children}
    </MenuContent>
  );
};

MenuSubmenu.displayName = "Menu.Submenu";
