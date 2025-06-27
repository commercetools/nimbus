import { forwardRef } from "react";
import { Button } from "react-aria-components";
import { MenuTriggerSlot } from "../menu.slots";
import type { MenuTriggerProps } from "../menu.types";
import { extractStyleProps } from "@/utils/extractStyleProps";

export const MenuTrigger = forwardRef<HTMLButtonElement, MenuTriggerProps>(
  ({ children, isDisabled, ...props }, ref) => {
    const [styleProps, restProps] = extractStyleProps(props);

    return (
      <MenuTriggerSlot asChild {...styleProps}>
        <Button ref={ref} isDisabled={isDisabled} {...restProps}>
          {children}
        </Button>
      </MenuTriggerSlot>
    );
  }
);

MenuTrigger.displayName = "MenuTrigger";
