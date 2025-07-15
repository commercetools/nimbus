import { memo } from "react";
import type { MenuContentProps } from "../menu.types";
import { MenuContent } from "./menu.content";

export const MenuSubmenu = memo(({ children, ...props }: MenuContentProps) => {
  return (
    <MenuContent {...props} placement="end">
      {children}
    </MenuContent>
  );
});

MenuSubmenu.displayName = "Menu.Submenu";
