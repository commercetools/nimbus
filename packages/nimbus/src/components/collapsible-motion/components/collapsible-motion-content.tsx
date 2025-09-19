import { forwardRef } from "react";
import { useCollapsibleMotionContext } from "./collapsible-motion-context";

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
 *
 * @example
 * ```tsx
 * <CollapsibleMotion.Root>
 *   <CollapsibleMotion.Trigger>
 *     <Button>Toggle</Button>
 *   </CollapsibleMotion.Trigger>
 *   <CollapsibleMotion.Content>
 *     <Box p={4} bg="gray.50">
 *       <Text>This content will expand and collapse smoothly</Text>
 *     </Box>
 *   </CollapsibleMotion.Content>
 * </CollapsibleMotion.Root>
 * ```
 *
 * @example
 * With custom styling:
 * ```tsx
 * <CollapsibleMotion.Content className="custom-content" style={{ padding: 16 }}>
 *   <p>Custom styled content</p>
 * </CollapsibleMotion.Content>
 * ```
 */
export const CollapsibleMotionContent = forwardRef<
  HTMLDivElement,
  CollapsibleMotionContentProps
>(function CollapsibleMotionContent(
  { children, style, tabIndex, ...props },
  forwardedRef
) {
  const { containerStyle, contentRef, panelProps, panelRef, isExpanded } =
    useCollapsibleMotionContext();

  // Use a callback ref to set both panelRef (for React Aria) and forwardedRef (for user)
  const setRefs = (node: HTMLDivElement | null) => {
    // Set the panelRef for React Aria
    if (panelRef) {
      panelRef.current = node;
    }
    // Set the forwarded ref for user
    if (forwardedRef) {
      if (typeof forwardedRef === "function") {
        forwardedRef(node);
      } else {
        forwardedRef.current = node;
      }
    }
  };

  return (
    <div
      ref={setRefs}
      {...panelProps}
      {...props}
      style={{
        ...containerStyle,
        ...panelProps.style,
        ...style,
      }}
      // Prevent focus on content when collapsed for accessibility
      // Allow custom tabIndex to override if provided
      tabIndex={tabIndex !== undefined ? tabIndex : isExpanded ? undefined : -1}
    >
      <div ref={contentRef}>{children}</div>
    </div>
  );
});

CollapsibleMotionContent.displayName = "CollapsibleMotion.Content";
