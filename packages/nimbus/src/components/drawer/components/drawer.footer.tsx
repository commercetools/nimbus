import { DrawerFooterSlot } from "../drawer.slots";
import type { DrawerFooterProps } from "../drawer.types";

export const DrawerFooter = (props: DrawerFooterProps) => {
  const { ref: forwardedRef, children, ...restProps } = props;

  return (
    <DrawerFooterSlot ref={forwardedRef} {...restProps}>
      {children}
    </DrawerFooterSlot>
  );
};

DrawerFooter.displayName = "Drawer.Footer";
