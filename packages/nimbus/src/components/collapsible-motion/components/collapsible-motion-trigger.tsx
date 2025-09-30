import { forwardRef } from "react";
import { mergeProps } from "react-aria";
import { useCollapsibleMotionContext } from "./collapsible-motion-context";
import { CollapsibleMotionTriggerSlot } from "../collapsible-motion.slots";
import type { CollapsibleMotionTriggerProps } from "../collapsible-motion.types";
import { Button as RaButton } from "react-aria-components";
import { chakra } from "@chakra-ui/react/styled-system";
import { extractStyleProps } from "@/utils/extractStyleProps";

/**
 * CollapsibleMotion.Trigger - The trigger button that toggles the collapsible content
 *
 * This component renders a button with proper ARIA attributes for accessibility.
 * It automatically handles the toggle functionality when clicked.
 */
export const CollapsibleMotionTrigger = forwardRef<
  HTMLButtonElement,
  CollapsibleMotionTriggerProps
>(({ children, asChild, ...props }, forwardedRef) => {
  const { buttonProps, isDisabled } = useCollapsibleMotionContext();

  // Use mergeProps to properly compose event handlers like React Aria does
  const componentProps = mergeProps(props, buttonProps, {
    disabled: isDisabled,
  });

  // If asChild is true, wrap children directly in a button with asChild
  if (asChild) {
    return (
      <chakra.button asChild {...componentProps}>
        {children}
      </chakra.button>
    );
  }

  const [styleProps, restProps] = extractStyleProps(componentProps);

  // Otherwise, wrap with both CollapsibleMotionTriggerSlot and RaButton
  // Only pass React Aria compatible props to avoid type conflicts
  return (
    <CollapsibleMotionTriggerSlot ref={forwardedRef} {...styleProps} asChild>
      <RaButton {...restProps}>{children}</RaButton>
    </CollapsibleMotionTriggerSlot>
  );
});

CollapsibleMotionTrigger.displayName = "CollapsibleMotion.Trigger";
