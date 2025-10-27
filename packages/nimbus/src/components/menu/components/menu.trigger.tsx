import {
  Button,
  type MenuTriggerProps as RaMenuTriggerProps,
} from "react-aria-components";
import { MenuTriggerSlot } from "../menu.slots";
import type { MenuTriggerProps } from "../menu.types";
import { extractStyleProps } from "@/utils";
import type {} from "react";

/**
 * Menu.Trigger - The button or element that opens the menu when activated
 *
 * @supportsStyleProps
 */
export const MenuTrigger = ({
  children,
  asChild,
  ref,
  ...props
}: MenuTriggerProps) => {
  const [styleProps, restProps] = extractStyleProps(props);

  /**
   * The user supplied a Button as the trigger
   */
  if (asChild) {
    // When asChild is true, apply styles to the child element
    return (
      <MenuTriggerSlot ref={ref} asChild {...styleProps}>
        {children as RaMenuTriggerProps["children"]}
      </MenuTriggerSlot>
    );
  }

  /**
   * The user did not supply a Button as trigger, use an unstyled button
   * to wrap which ever element the user supplied and make it a trigger
   */
  return (
    <MenuTriggerSlot asChild {...styleProps}>
      <Button ref={ref} {...restProps}>
        {children}
      </Button>
    </MenuTriggerSlot>
  );
};

MenuTrigger.displayName = "Menu.Trigger";
