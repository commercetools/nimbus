import { Section } from "react-aria-components";
import { MenuGroupSlot } from "../menu.slots";
import type { MenuGroupProps } from "../menu.types";
import { extractStyleProps } from "@/utils/extractStyleProps";

export const MenuGroup = ({ children, ref, ...props }: MenuGroupProps) => {
  const [styleProps, restProps] = extractStyleProps(props);

  return (
    <MenuGroupSlot asChild {...styleProps}>
      <Section ref={ref} {...restProps}>
        {children}
      </Section>
    </MenuGroupSlot>
  );
};

MenuGroup.displayName = "MenuGroup";
