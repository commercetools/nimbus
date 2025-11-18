import { DrawerFooterSlot } from "../drawer.slots";
import type { DrawerFooterProps } from "../drawer.types";

/**
 * Drawer.Footer - The footer section of the drawer
 *
 * @supportsStyleProps
 */
export const DrawerFooter = (props: DrawerFooterProps) => {
  const { ref: forwardedRef, children, ...restProps } = props;

  return (
    <DrawerFooterSlot ref={forwardedRef} {...restProps}>
      {children}
    </DrawerFooterSlot>
  );
};

DrawerFooter.displayName = "Drawer.Footer";
