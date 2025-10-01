import { DrawerBodySlot } from "../drawer.slots";
import type { DrawerBodyProps } from "../drawer.types";

export const DrawerBody = (props: DrawerBodyProps) => {
  const { ref: forwardedRef, children, ...restProps } = props;

  const defaultProps = {
    /**
     * Set tabIndex to 0 to allow the body to receive focus,
     * effectively enabling scrolling via keyboard arrow keys.
     */
    tabIndex: 0,
  };

  return (
    <DrawerBodySlot ref={forwardedRef} {...defaultProps} {...restProps}>
      {children}
    </DrawerBodySlot>
  );
};

DrawerBody.displayName = "Drawer.Body";
