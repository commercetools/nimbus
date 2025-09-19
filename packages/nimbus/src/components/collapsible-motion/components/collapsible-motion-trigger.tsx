import React, { forwardRef } from "react";
import { extractStyleProps } from "@/utils/extractStyleProps";
import { useCollapsibleMotionContext } from "./collapsible-motion-context";
import { CollapsibleMotionTriggerSlot } from "../collapsible-motion.slots";
import type { CollapsibleMotionTriggerProps } from "../collapsible-motion.types";

/**
 * CollapsibleMotion.Trigger - The trigger button that toggles the collapsible content
 *
 * This component renders a button with proper ARIA attributes for accessibility.
 * It automatically handles the toggle functionality when clicked.
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

    // Call React Aria's onClick handler first (if it exists)
    buttonProps.onClick?.(event);
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
