import { MenuSubmenuSlot } from "../menu.slots";
import type { MenuSubmenuSlotProps } from "../menu.slots";
import type { MenuContentProps } from "../menu.types";
import { MenuContent } from "./menu.content";

export const MenuSubmenu = ({ children, ...props }: MenuContentProps) => {
  return (
    <MenuContent {...props} placement="start bottom">
      {children}
    </MenuContent>
  );
};

MenuSubmenu.displayName = "MenuSubmenu";
