import type { MenuSubmenuProps } from "../menu.types";
import { MenuContent } from "./menu.content";

/**
 * Menu.Submenu - A nested menu that appears when hovering over or selecting a submenu trigger
 *
 * @supportsStyleProps
 */
export const MenuSubmenu = ({ children, ...props }: MenuSubmenuProps) => {
  return (
    <MenuContent {...props} placement="end">
      {children}
    </MenuContent>
  );
};

MenuSubmenu.displayName = "Menu.Submenu";
