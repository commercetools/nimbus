import { forwardRef } from "react";
import { Separator } from "react-aria-components";
import { MenuSeparatorSlot } from "../menu.slots";
import type { MenuSeparatorProps } from "../menu.types";
import { extractStyleProps } from "@/utils/extractStyleProps";

export const MenuSeparator = forwardRef<HTMLDivElement, MenuSeparatorProps>(
  ({ ...props }, ref) => {
    const [styleProps, restProps] = extractStyleProps(props);

    return (
      <MenuSeparatorSlot asChild {...styleProps}>
        <Separator ref={ref} {...restProps} />
      </MenuSeparatorSlot>
    );
  }
);

MenuSeparator.displayName = "MenuSeparator";
