import React from "react";
import { TooltipTrigger } from "react-aria-components";
import type { TooltipTriggerComponentProps } from "react-aria-components";

/**
 * TooltipRoot
 * ============================================================
 * Root component that wraps around a trigger element and Tooltip content.
 * It handles opening and closing the Tooltip when the user hovers over or focuses the trigger,
 * and positioning the Tooltip relative to the trigger.
 *
 * This acts as the context provider for the compound Tooltip component.
 */
export function TooltipRoot(props: TooltipTriggerComponentProps) {
  // Note: In React 19, ref forwarding is automatic for function components
  // The ref should be placed on the trigger element directly when needed
  return <TooltipTrigger {...props} />;
}

TooltipRoot.displayName = "Tooltip.Root";
