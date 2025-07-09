import { MenuItem } from "react-aria-components";
import { MenuItemSlot } from "../menu.slots";
import type { MenuItemProps } from "../menu.types";
import { extractStyleProps } from "@/utils/extractStyleProps";

export const MenuItemComponent = ({
  children,
  isSelected,
  isDanger,
  isLoading,
  ref,
  ...props
}: MenuItemProps) => {
  const [styleProps, restProps] = extractStyleProps(props);

  return (
    <MenuItemSlot
      asChild
      {...styleProps}
      data-selected={isSelected ? "" : undefined}
      data-danger={isDanger ? "" : undefined}
      data-loading={isLoading ? "" : undefined}
    >
      <MenuItem ref={ref} {...restProps}>
        {children}
      </MenuItem>
    </MenuItemSlot>
  );
};

MenuItemComponent.displayName = "MenuItem";
