import { forwardRef, useRef } from "react";
import { useObjectRef } from "react-aria";
import { mergeRefs } from "@chakra-ui/react";
import { extractStyleProps } from "@/utils/extractStyleProps";
import { useCollapsibleMotionContext } from "./collapsible-motion-context";
import { CollapsibleMotionContentSlot } from "../collapsible-motion.slots";

/**
 * Props for CollapsibleMotion.Content component
 */
export interface CollapsibleMotionContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The content to be collapsed/expanded
   */
  children: React.ReactNode;
}

/**
 * CollapsibleMotion.Content - The collapsible content with smooth animations
 *
 * This component renders the content that will expand and collapse with smooth height animations.
 * It automatically handles the animation styles and accessibility attributes.
 */
export const CollapsibleMotionContent = forwardRef<
  HTMLDivElement,
  CollapsibleMotionContentProps
>(function CollapsibleMotionContent(
  { children, tabIndex, ...props },
  forwardedRef
) {
  const {
    dynamicStyles,
    dataAttributes,
    contentRef,
    panelProps,
    panelRef,
    isExpanded,
  } = useCollapsibleMotionContext();

  // Separate Chakra UI style props from functional props
  const [styleProps, functionalProps] = extractStyleProps(props);

  // Create a local ref and merge with both panelRef (for React Aria) and forwardedRef (for user)
  const localRef = useRef<HTMLDivElement>(null);
  const ref = useObjectRef(mergeRefs(localRef, panelRef, forwardedRef));

  return (
    <CollapsibleMotionContentSlot
      ref={ref}
      {...panelProps}
      {...dataAttributes}
      {...styleProps}
      {...functionalProps}
      // TODO: use chakra syntax
      style={{
        ...dynamicStyles,
      }}
      // Prevent focus on content when collapsed for accessibility
      // Allow custom tabIndex to override if provided
      tabIndex={tabIndex !== undefined ? tabIndex : isExpanded ? undefined : -1}
      asChild
    >
      <div ref={contentRef}>{children}</div>
    </CollapsibleMotionContentSlot>
  );
});

CollapsibleMotionContent.displayName = "CollapsibleMotion.Content";
