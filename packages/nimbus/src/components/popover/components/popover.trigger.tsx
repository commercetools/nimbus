import { Button as RaButton } from "react-aria-components";
import type { ReactElement } from "react";

import { PopoverTriggerSlot } from "../popover.slots";
import type { PopoverTriggerProps } from "../popover.types";
import { extractStyleProps } from "@/utils";

/**
 * Popover.Trigger - The element that opens the popover when pressed
 *
 * Renders its own button by default. With `asChild`, trigger behavior is
 * applied to the supplied child instead, which avoids nesting one interactive
 * element inside another.
 *
 * @supportsStyleProps
 */
export const PopoverTrigger = ({
  children,
  asChild,
  ref,
  ...props
}: PopoverTriggerProps) => {
  const [styleProps, restProps] = extractStyleProps(props);

  /**
   * The consumer supplied their own pressable element as the trigger. The
   * remaining props are forwarded too, so `id`, `isDisabled` and friends reach
   * the supplied element instead of being dropped.
   */
  if (asChild) {
    return (
      <PopoverTriggerSlot ref={ref} asChild {...styleProps} {...restProps}>
        {children as ReactElement}
      </PopoverTriggerSlot>
    );
  }

  /**
   * No pressable element was supplied, so wrap whatever the consumer passed in
   * a button to make it a trigger.
   */
  return (
    <PopoverTriggerSlot asChild {...styleProps}>
      <RaButton ref={ref} {...restProps}>
        {children}
      </RaButton>
    </PopoverTriggerSlot>
  );
};

PopoverTrigger.displayName = "Popover.Trigger";
