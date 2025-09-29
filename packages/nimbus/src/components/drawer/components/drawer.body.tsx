import { useRef } from "react";
import { useObjectRef } from "react-aria";
import { mergeRefs } from "@chakra-ui/react";
import { DrawerBodySlot } from "../drawer.slots";
import type { DrawerBodyProps } from "../drawer.types";

/**
 * # Drawer.Body
 *
 * The main body content section of the drawer.
 * Contains the primary drawer content and handles overflow/scrolling.
 * The drawer body is keyboard focusable to enable scrolling via keyboard navigation.
 *
 * @example
 * ```tsx
 * <Drawer.Content>
 *   <Drawer.Header>...</Drawer.Header>
 *   <Drawer.Body>
 *     <p>This is the main content of the drawer.</p>
 *   </Drawer.Body>
 *   <Drawer.Footer>...</Drawer.Footer>
 * </Drawer.Content>
 * ```
 */
export const DrawerBody = (props: DrawerBodyProps) => {
  const { ref: forwardedRef, children, ...restProps } = props;

  // create a local ref (because the consumer may not provide a forwardedRef)
  const localRef = useRef<HTMLDivElement>(null);
  // merge the local ref with a potentially forwarded ref
  const ref = useObjectRef(mergeRefs(localRef, forwardedRef));

  const defaultProps = {
    /**
     * Set tabIndex to 0 to allow the body to receive focus,
     * effectively enabling scrolling via keyboard arrow keys.
     */
    tabIndex: 0,
  };

  return (
    <DrawerBodySlot ref={ref} {...defaultProps} {...restProps}>
      {children}
    </DrawerBodySlot>
  );
};

DrawerBody.displayName = "Drawer.Body";
