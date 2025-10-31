import { DrawerHeaderSlot } from "../drawer.slots";
import type { DrawerHeaderProps } from "../drawer.types";

/**
 * Drawer.Header - The header section of the drawer
 *
 * @supportsStyleProps
 */
export const DrawerHeader = (props: DrawerHeaderProps) => {
  const { ref: forwardedRef, children, ...restProps } = props;

  return (
    <DrawerHeaderSlot ref={forwardedRef} {...restProps}>
      {children}
    </DrawerHeaderSlot>
  );
};

DrawerHeader.displayName = "Drawer.Header";
