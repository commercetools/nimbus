import { DrawerHeaderSlot } from "../drawer.slots";
import type { DrawerHeaderProps } from "../drawer.types";

export const DrawerHeader = (props: DrawerHeaderProps) => {
  const { ref: forwardedRef, children, ...restProps } = props;

  return (
    <DrawerHeaderSlot ref={forwardedRef} {...restProps}>
      {children}
    </DrawerHeaderSlot>
  );
};

DrawerHeader.displayName = "Drawer.Header";
