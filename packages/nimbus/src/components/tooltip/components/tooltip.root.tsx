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
  isDisabled,
  ...props
}: TooltipTriggerComponentProps) {
  return (
    <TooltipTrigger
      delay={delay}
      closeDelay={closeDelay}
      isDisabled={isDisabled}
      {...props}
    />
  );
}

TooltipRoot.displayName = "Tooltip.Root";
