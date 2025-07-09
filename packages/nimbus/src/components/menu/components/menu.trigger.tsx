import { Button } from "react-aria-components";
import { MenuTriggerSlot } from "../menu.slots";
import type { MenuTriggerProps } from "../menu.types";
import { extractStyleProps } from "@/utils/extractStyleProps";
import type { ReactNode } from "react";

export const MenuTrigger = ({
  children,
  isDisabled,
  isLoading,
  asChild,
  ref,
  ...props
}: MenuTriggerProps) => {
  const [styleProps, restProps] = extractStyleProps(props);

  if (asChild) {
    // When asChild is true, apply styles to the child element
    return (
      <MenuTriggerSlot
        asChild
        {...styleProps}
        data-loading={isLoading ? "" : undefined}
      >
        {children as ReactNode}
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
};

MenuTrigger.displayName = "MenuTrigger";
