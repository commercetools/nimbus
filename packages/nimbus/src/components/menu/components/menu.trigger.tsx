import { forwardRef } from "react";
import { Button } from "react-aria-components";
import { MenuTriggerSlot } from "../menu.slots";
import type { MenuTriggerProps } from "../menu.types";
import { extractStyleProps } from "@/utils/extractStyleProps";

export const MenuTrigger = forwardRef<HTMLButtonElement, MenuTriggerProps>(
  ({ children, isDisabled, isLoading, asChild, ...props }, ref) => {
    const [styleProps, restProps] = extractStyleProps(props);

    if (asChild) {
      // When asChild is true, apply styles to the child element
      return (
        <MenuTriggerSlot
          asChild
          {...styleProps}
          data-loading={isLoading ? "" : undefined}
        >
          {children}
        </MenuTriggerSlot>
      );
    }

    // Default behavior: render a button
    return (
      <MenuTriggerSlot
        asChild
        {...styleProps}
        data-loading={isLoading ? "" : undefined}
      >
        <Button ref={ref} isDisabled={isDisabled || isLoading} {...restProps}>
          {children}
        </Button>
      </MenuTriggerSlot>
    );
  }
);

MenuTrigger.displayName = "MenuTrigger";
