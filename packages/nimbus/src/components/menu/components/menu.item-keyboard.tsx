import { Kbd } from "@/components/kbd";
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
      <Kbd>{children}</Kbd>
    </MenuItemKeyboardSlot>
  );
};

MenuItemKeyboard.displayName = "MenuItemKeyboard";
