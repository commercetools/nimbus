import React from "react";
import { TooltipTrigger } from "react-aria-components";
import type { TooltipTriggerComponentProps } from "react-aria-components";

/**
 * # Tooltip
 *
 * A contextual popup that displays a description for an element.
 *
 */
export function TooltipRoot({
  // Match delays to current ui-kit tooltip
  delay = 300,
  closeDelay = 200,
  ...props
}: TooltipTriggerComponentProps) {
  // Note: In React 19, ref forwarding is automatic for function components
  // The ref should be placed on the trigger element directly when needed
  return <TooltipTrigger delay={delay} closeDelay={closeDelay} {...props} />;
}

TooltipRoot.displayName = "Tooltip.Root";
