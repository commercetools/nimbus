import { forwardRef } from "react";
import { Tooltip as RATooltip } from "react-aria-components";
import { TooltipRoot } from "./tooltip.slots";
import type { TooltipProps } from "./tooltip.types";

/**
 * Tooltip
 * ============================================================
 * A contextual popup that displays a description for an element, uses `Tooltip` component from `react-aria-components`.
 *
 * Features:
 * - allows forwarding refs to the underlying DOM element
 * - accepts all native html 'HTMLDivElement' attributes (including aria- & data-attributes)
 * - allows overriding styles by using style-props
 *
 * Further Context:
 * - [React Aria Components Tooltip Documentation](https://react-spectrum.adobe.com/react-aria/Tooltip.html)
 * - [ARIA Tooltip Pattern](https://www.w3.org/TR/wai-aria-1.2/#tooltip)
 */
export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  function Tooltip({ children, placement = "bottom", ...props }, ref) {
    return (
      <TooltipRoot asChild {...props}>
        <RATooltip ref={ref} placement={placement} {...props}>
          {children}
        </RATooltip>
      </TooltipRoot>
    );
  }
);
Tooltip.displayName = "Tooltip";
