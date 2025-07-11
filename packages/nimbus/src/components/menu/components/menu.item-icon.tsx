import { MenuItemIconSlot } from "../menu.slots";
import type { MenuItemIconProps } from "../menu.types";
import { extractStyleProps } from "@/utils/extractStyleProps";

export const MenuItemIcon = ({
  children,
  ref,
  ...props
}: MenuItemIconProps) => {
  const [styleProps, restProps] = extractStyleProps(props);

  return (
    <MenuItemIconSlot ref={ref} {...styleProps} {...restProps}>
      {children}
    </MenuItemIconSlot>
  );
};

MenuItemIcon.displayName = "Menu.ItemIcon";
