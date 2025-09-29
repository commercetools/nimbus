import { useRef } from "react";
import { useObjectRef } from "react-aria";
import { mergeRefs } from "@chakra-ui/react";
import { DrawerFooterSlot } from "../drawer.slots";
import type { DrawerFooterProps } from "../drawer.types";

/**
 * # Drawer.Footer
 *
 * The footer section of the drawer, typically containing action buttons.
 * Provides consistent spacing and alignment for drawer actions.
 *
 * @example
 * ```tsx
 * <Drawer.Content>
 *   <Drawer.Header>...</Drawer.Header>
 *   <Drawer.Body>...</Drawer.Body>
 *   <Drawer.Footer>
 *     <Button variant="outline">Cancel</Button>
 *     <Button>Confirm</Button>
 *   </Drawer.Footer>
 * </Drawer.Content>
 * ```
 */
export const DrawerFooter = (props: DrawerFooterProps) => {
  const { ref: forwardedRef, children, ...restProps } = props;

  // create a local ref (because the consumer may not provide a forwardedRef)
  const localRef = useRef<HTMLElement>(null);
  // merge the local ref with a potentially forwarded ref
  const ref = useObjectRef(mergeRefs(localRef, forwardedRef));

  return (
    <DrawerFooterSlot ref={ref} {...restProps}>
      {children}
    </DrawerFooterSlot>
  );
};

DrawerFooter.displayName = "Drawer.Footer";
