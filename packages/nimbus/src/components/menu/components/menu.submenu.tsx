import type { MenuContentProps } from "../menu.types";
import { MenuContent } from "./menu.content";

export const MenuSubmenu = ({ children, ...props }: MenuContentProps) => {
  return <MenuContent {...props}>{children}</MenuContent>;
};

MenuSubmenu.displayName = "Menu.Submenu";
