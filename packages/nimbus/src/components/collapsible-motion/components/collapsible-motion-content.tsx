import { forwardRef, useRef } from "react";
import { useObjectRef } from "react-aria";
import { mergeRefs } from "@chakra-ui/react";
import { extractStyleProps } from "@/utils/extractStyleProps";
import { useCollapsibleMotionContext } from "./collapsible-motion-context";
import { CollapsibleMotionContentSlot } from "../collapsible-motion.slots";
import type { CollapsibleMotionContentProps } from "../collapsible-motion.types";

/**
 * CollapsibleMotion.Content - The collapsible content container
 *
 * This component renders the content that will expand and collapse.
 * It handles accessibility attributes through React Aria.
 */
export const CollapsibleMotionContent = forwardRef<
  HTMLDivElement,
  CollapsibleMotionContentProps
>(({ children, ...props }, forwardedRef) => {
  const { panelProps, panelRef } = useCollapsibleMotionContext();

  // Separate Chakra UI style props from functional props
  const [styleProps, functionalProps] = extractStyleProps(props);

  // Create a local ref and merge with both panelRef (for React Aria) and forwardedRef (for user)
  const localRef = useRef<HTMLDivElement>(null);
  const ref = useObjectRef(mergeRefs(localRef, panelRef, forwardedRef));

  return (
    <CollapsibleMotionContentSlot
      ref={ref}
      {...panelProps}
      {...styleProps}
      {...functionalProps}
      asChild
    >
      <div>{children}</div>
    </CollapsibleMotionContentSlot>
  );
});

CollapsibleMotionContent.displayName = "CollapsibleMotion.Content";
