import { forwardRef, useRef } from "react";
import { useObjectRef } from "react-aria";
import { Presence } from "@chakra-ui/react/presence";
import { mergeRefs } from "@/utils";
import { useCollapsibleMotionContext } from "./collapsible-motion-context";
import { CollapsibleMotionContentSlot } from "../collapsible-motion.slots";
import type { CollapsibleMotionContentProps } from "../collapsible-motion.types";

/**
 * CollapsibleMotion.Content - The collapsible content container
 *
 * This component renders the content that will expand and collapse.
 * It handles accessibility attributes through React Aria.
 *
 * @supportsStyleProps
 */
export const CollapsibleMotionContent = forwardRef<
  HTMLDivElement,
  CollapsibleMotionContentProps
>(({ children, ...props }, forwardedRef) => {
  const { panelProps, isExpanded } = useCollapsibleMotionContext();

  // Create a local ref and merge with forwardedRef (for user)
  const localRef = useRef<HTMLDivElement>(null);
  const ref = useObjectRef(mergeRefs(localRef, forwardedRef));

  return (
    <CollapsibleMotionContentSlot ref={ref} {...props} {...panelProps} asChild>
      <Presence
        present={isExpanded}
        animationName={{
          _open: "slide-from-top, fade-in",
          _closed: "slide-to-top, fade-out",
        }}
        animationDuration="fast"
      >
        {children}
      </Presence>
    </CollapsibleMotionContentSlot>
  );
});

CollapsibleMotionContent.displayName = "CollapsibleMotion.Content";
