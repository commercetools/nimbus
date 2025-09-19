import React, { forwardRef } from "react";
import { extractStyleProps } from "@/utils/extractStyleProps";
import { useCollapsibleMotionContext } from "./collapsible-motion-context";
import { CollapsibleMotionTriggerSlot } from "../collapsible-motion.slots";

/**
 * Props for CollapsibleMotion.Trigger component
 */
export interface CollapsibleMotionTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * The trigger element content (typically a button or clickable element)
   */
  children: React.ReactNode;
}

/**
 * CollapsibleMotion.Trigger - The trigger button that toggles the collapsible content
 *
 * This component renders a button with proper ARIA attributes for accessibility.
 * It automatically handles the toggle functionality when clicked.
 *
 * @example
 * ```tsx
 * <CollapsibleMotion.Root>
 *   <CollapsibleMotion.Trigger>
 *     <Button>Toggle Content</Button>
 *   </CollapsibleMotion.Trigger>
 *   <CollapsibleMotion.Content>
 *     Content here
 *   </CollapsibleMotion.Content>
 * </CollapsibleMotion.Root>
 * ```
 *
 * @example
 * Custom styling:
 * ```tsx
 * <CollapsibleMotion.Trigger className="custom-trigger" onClick={customHandler}>
 *   <span>Custom Trigger</span>
 * </CollapsibleMotion.Trigger>
 * ```
 */
export const CollapsibleMotionTrigger = forwardRef<
  HTMLButtonElement,
  CollapsibleMotionTriggerProps
>(function CollapsibleMotionTrigger(
  { children, onClick, ...props },
  forwardedRef
) {
  const { buttonProps, isDisabled, toggle } = useCollapsibleMotionContext();

  // Separate Chakra UI style props from functional props
  const [styleProps, functionalProps] = extractStyleProps(props);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    // Don't toggle if button is disabled
    if (isDisabled) return;

    // Call the toggle function from context
    toggle();
    // Call custom onClick if provided
    onClick?.(event);
  };

  return (
    <CollapsibleMotionTriggerSlot
      ref={forwardedRef}
      {...styleProps}
      {...functionalProps}
      {...buttonProps}
      disabled={isDisabled}
      onClick={handleClick}
      asChild
    >
      {children}
    </CollapsibleMotionTriggerSlot>
  );
});

CollapsibleMotionTrigger.displayName = "CollapsibleMotion.Trigger";
