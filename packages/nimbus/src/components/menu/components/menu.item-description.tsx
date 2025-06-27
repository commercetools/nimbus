import { forwardRef } from "react";
import { MenuItemDescriptionSlot } from "../menu.slots";
import type { MenuItemDescriptionProps } from "../menu.types";
import { extractStyleProps } from "@/utils/extractStyleProps";

export const MenuItemDescription = forwardRef<
  HTMLSpanElement,
  MenuItemDescriptionProps
>(({ children, ...props }, ref) => {
  const [styleProps, restProps] = extractStyleProps(props);

  return (
    <MenuItemDescriptionSlot ref={ref} {...styleProps} {...restProps}>
      {children}
    </MenuItemDescriptionSlot>
  );
});

MenuItemDescription.displayName = "MenuItemDescription";
