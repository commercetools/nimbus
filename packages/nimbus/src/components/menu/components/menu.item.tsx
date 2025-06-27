import { forwardRef } from "react";
import { MenuItem } from "react-aria-components";
import { MenuItemSlot } from "../menu.slots";
import type { MenuItemProps } from "../menu.types";
import { extractStyleProps } from "@/utils/extractStyleProps";

export const MenuItemComponent = forwardRef<HTMLDivElement, MenuItemProps>(
  ({ children, ...props }, ref) => {
    const [styleProps, restProps] = extractStyleProps(props);

    return (
      <MenuItemSlot asChild {...styleProps}>
        <MenuItem ref={ref} {...restProps}>
          {children}
        </MenuItem>
      </MenuItemSlot>
    );
  }
);

MenuItemComponent.displayName = "MenuItem";
