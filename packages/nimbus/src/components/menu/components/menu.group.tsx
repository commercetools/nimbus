import { MenuSection } from "react-aria-components";
import { MenuGroupSlot } from "../menu.slots";
import type { MenuGroupProps } from "../menu.types";
import { extractStyleProps } from "@/utils/extractStyleProps";

export const MenuGroup = ({ children, ref, ...props }: MenuGroupProps) => {
  const [styleProps, restProps] = extractStyleProps(props);

  return (
    <MenuGroupSlot asChild {...styleProps}>
      <MenuSection ref={ref} {...restProps}>
        {children}
      </MenuSection>
    </MenuGroupSlot>
  );
};

MenuGroup.displayName = "Menu.Group";
