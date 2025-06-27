import { forwardRef } from "react";
import { Header } from "react-aria-components";
import { MenuGroupLabelSlot } from "../menu.slots";
import type { MenuGroupLabelProps } from "../menu.types";
import { extractStyleProps } from "@/utils/extractStyleProps";

export const MenuGroupLabel = forwardRef<HTMLDivElement, MenuGroupLabelProps>(
  ({ children, ...props }, ref) => {
    const [styleProps, restProps] = extractStyleProps(props);

    return (
      <MenuGroupLabelSlot asChild {...styleProps}>
        <Header ref={ref} {...restProps}>
          {children}
        </Header>
      </MenuGroupLabelSlot>
    );
  }
);

MenuGroupLabel.displayName = "MenuGroupLabel";
