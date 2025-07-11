import { MenuItemLabelSlot } from "../menu.slots";
import type { MenuItemLabelProps } from "../menu.types";
import { extractStyleProps } from "@/utils/extractStyleProps";

export const MenuItemLabel = ({
  children,
  ref,
  ...props
}: MenuItemLabelProps) => {
  const [styleProps, restProps] = extractStyleProps(props);

  return (
    <MenuItemLabelSlot ref={ref} {...styleProps} {...restProps}>
      {children}
    </MenuItemLabelSlot>
  );
};

MenuItemLabel.displayName = "MenuItemLabel";
