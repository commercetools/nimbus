import { Button as RaButton } from "react-aria-components";
import { DrawerTriggerSlot } from "../drawer.slots";
import type { DrawerTriggerProps } from "../drawer.types";
import { extractStyleProps } from "@/utils";
import { chakra } from "@chakra-ui/react/styled-system";

/**
 * Drawer.Trigger - The trigger element that opens the drawer when activated
 *
 * @supportsStyleProps
 */
export const DrawerTrigger = ({
  ref: forwardedRef,
  children,
  asChild,
  ...props
}: DrawerTriggerProps) => {
  // If asChild is true, wrap children directly in RaButton with asChild
  if (asChild) {
    return (
      <chakra.button ref={forwardedRef} asChild {...props}>
        {children}
      </chakra.button>
    );
  }

  const [styleProps, restProps] = extractStyleProps(props);

  // Otherwise, wrap with both DrawerTriggerSlot and RaButton
  // Only pass React Aria compatible props to avoid type conflicts
  return (
    <DrawerTriggerSlot {...styleProps} asChild>
      <RaButton ref={forwardedRef} {...restProps}>
        {children}
      </RaButton>
    </DrawerTriggerSlot>
  );
};

DrawerTrigger.displayName = "Drawer.Trigger";
