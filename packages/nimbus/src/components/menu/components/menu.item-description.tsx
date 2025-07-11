import { MenuItemDescriptionSlot } from "../menu.slots";
import type { MenuItemDescriptionProps } from "../menu.types";
import { extractStyleProps } from "@/utils/extractStyleProps";

export const MenuItemDescription = ({
  children,
  ref,
  ...props
}: MenuItemDescriptionProps) => {
  const [styleProps, restProps] = extractStyleProps(props);

  return (
    <MenuItemDescriptionSlot ref={ref} {...styleProps} {...restProps}>
      {children}
    </MenuItemDescriptionSlot>
  );
};

MenuItemDescription.displayName = "Menu.ItemDescription";
