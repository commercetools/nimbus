import { forwardRef } from "react";
import { Button as RaButton } from "react-aria-components";
import { DrawerTriggerSlot } from "../drawer.slots";
import type { DrawerTriggerProps } from "../drawer.types";

/**
 * # Drawer.Trigger
 *
 * The trigger element that opens the drawer when activated.
 * Built with React Aria's Button for full accessibility support.
 *
 * @example
 * <Drawer.Root>
 *   <Drawer.Trigger>Open Navigation</Drawer.Trigger>
 *   <Drawer.Content side="left">
 *     drawer content
 *   </Drawer.Content>
 * </Drawer.Root>
 */
export const DrawerTrigger = forwardRef<HTMLButtonElement, DrawerTriggerProps>(
  (props, ref) => {
    const { children, ...restProps } = props;

    return (
      <RaButton ref={ref} {...restProps}>
        <DrawerTriggerSlot asChild>{children}</DrawerTriggerSlot>
      </RaButton>
    );
  }
);

DrawerTrigger.displayName = "Drawer.Trigger";
