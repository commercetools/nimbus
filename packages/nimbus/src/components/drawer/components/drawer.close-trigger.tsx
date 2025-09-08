import { forwardRef } from "react";
import { Button as RaButton } from "react-aria-components";
import { DrawerCloseTriggerSlot } from "../drawer.slots";
import type { DrawerCloseTriggerProps } from "../drawer.types";

/**
 * # Drawer.CloseTrigger
 * 
 * A button that closes the drawer when activated.
 * Uses React Aria's Button with proper accessibility features.
 * 
 * Automatically handles keyboard interaction and provides appropriate
 * ARIA labeling for screen readers.
 * 
 * @example
 * ```tsx
 * <Drawer.Content side="left">
 *   <Drawer.Header>
 *     <Drawer.Title>Navigation</Drawer.Title>
 *     <Drawer.CloseTrigger aria-label="Close navigation">
 *       ×
 *     </Drawer.CloseTrigger>
 *   </Drawer.Header>
 * </Drawer.Content>
 * ```
 */
export const DrawerCloseTrigger = forwardRef<HTMLButtonElement, DrawerCloseTriggerProps>(
  (props, ref) => {
    const { 
      children, 
      "aria-label": ariaLabel = "Close drawer", 
      ...restProps 
    } = props;

    return (
      <RaButton 
        ref={ref} 
        slot="close" 
        aria-label={ariaLabel}
        {...restProps}
      >
        <DrawerCloseTriggerSlot asChild>
          {children}
        </DrawerCloseTriggerSlot>
      </RaButton>
    );
  }
);

DrawerCloseTrigger.displayName = "Drawer.CloseTrigger";