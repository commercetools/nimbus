import { Tooltip as RATooltip } from "react-aria-components";
import { TooltipRoot } from "../tooltip.slots";
import type { TooltipProps } from "../tooltip.types";

/**
 * TooltipContent
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
export function TooltipContent({
  children,
  placement = "bottom",
  ref,
  ...props
}: TooltipProps & { ref?: React.Ref<HTMLDivElement> }) {
  return (
    <TooltipRoot ref={ref} asChild {...props}>
      <RATooltip placement={placement} {...props}>
        {children}
      </RATooltip>
    </TooltipRoot>
  );
}

TooltipContent.displayName = "Tooltip.Content";
