import React, { forwardRef } from "react";
import { mergeProps } from "react-aria";
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
>(({ children, onClick, ...props }, forwardedRef) => {
  const { buttonProps, isDisabled } = useCollapsibleMotionContext();

  // Separate Chakra UI style props from functional props
  const [styleProps, functionalProps] = extractStyleProps(props);

  // Use mergeProps to properly compose event handlers like React Aria does
  const componentProps = mergeProps(styleProps, functionalProps, buttonProps, {
    disabled: isDisabled,
    onClick, // Consumer's custom onClick handler
  });

  return (
    <CollapsibleMotionTriggerSlot
      ref={forwardedRef}
      {...componentProps}
      asChild
    >
      {children}
    </CollapsibleMotionTriggerSlot>
  );
});

CollapsibleMotionTrigger.displayName = "CollapsibleMotion.Trigger";
