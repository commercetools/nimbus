import { Button as RaButton } from "react-aria-components";

import { PopoverTriggerSlot } from "../popover.slots";
import type { PopoverTriggerProps } from "../popover.types";
import { extractStyleProps } from "@/utils";

/**
 * Popover.Trigger - The element that opens the popover when pressed
 *
 * React Aria's `DialogTrigger` wraps whatever is rendered here in a
 * `PressResponder`, which publishes the press handlers, `aria-expanded`,
 * `aria-controls` and the trigger ref through context. Nothing has to be
 * forwarded for that to work, so under `asChild` this component applies only
 * the `trigger` slot's styling and the child owns its own props.
 *
 * @supportsStyleProps
 */
export const PopoverTrigger = (props: PopoverTriggerProps) => {
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

  // No pressable element supplied, so wrap the children in our own button.
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
