import { Button as RaButton } from "react-aria-components";

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
 * React Aria's `DialogTrigger` wraps whatever is rendered here in a
 * `PressResponder`, which publishes the press handlers, `aria-expanded`,
 * `aria-controls` and the trigger ref through context. Nothing has to be
 * forwarded for that to work, so in `asChild` mode this component only applies
 * the `trigger` slot's styling and the child owns its own props.
 *
 * @supportsStyleProps
 */
export const PopoverTrigger = (props: PopoverTriggerProps) => {
  /**
   * The consumer supplied their own pressable element as the trigger.
   */
  if (props.asChild) {
    const {
      children,
      ref,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      asChild: _asChild,
      ...styleOnlyProps
    } = props;
    const [styleProps] = extractStyleProps(styleOnlyProps);

    return (
      <PopoverTriggerSlot ref={ref} asChild {...styleProps}>
        {children}
      </PopoverTriggerSlot>
    );
  }

  /**
   * No pressable element was supplied, so wrap whatever the consumer passed in
   * a button to make it a trigger.
   */
  const {
    children,
    ref,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    asChild: _asChild,
    ...rest
  } = props;
  const [styleProps, restProps] = extractStyleProps(rest);

  return (
    <PopoverTriggerSlot asChild {...styleProps}>
      <RaButton ref={ref} {...restProps}>
        {children}
      </RaButton>
    </PopoverTriggerSlot>
  );
};

PopoverTrigger.displayName = "Popover.Trigger";
