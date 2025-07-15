import { Header } from "react-aria-components";
import { MenuSectionLabelSlot } from "../menu.slots";
import type { MenuSectionLabelProps } from "../menu.types";
import { extractStyleProps } from "@/utils/extractStyleProps";

export const MenuSectionLabel = ({
  children,
  ref,
  ...props
}: MenuSectionLabelProps) => {
  const [styleProps, restProps] = extractStyleProps(props);

  return (
    <MenuSectionLabelSlot asChild {...styleProps}>
      <Header ref={ref} {...restProps}>
        {children}
      </Header>
    </MenuSectionLabelSlot>
  );
};

MenuSectionLabel.displayName = "Menu.SectionLabel";