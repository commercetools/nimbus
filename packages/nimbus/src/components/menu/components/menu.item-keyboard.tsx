import { MenuItemKeyboardSlot } from "../menu.slots";
import type { MenuItemKeyboardProps } from "../menu.types";
import { extractStyleProps } from "@/utils/extractStyleProps";

export const MenuItemKeyboard = ({
  children,
  ref,
  ...props
}: MenuItemKeyboardProps) => {
  const [styleProps, restProps] = extractStyleProps(props);

  return (
    <MenuItemKeyboardSlot ref={ref} {...styleProps} {...restProps}>
      {children}
    </MenuItemKeyboardSlot>
  );
};

MenuItemKeyboard.displayName = "MenuItemKeyboard";
