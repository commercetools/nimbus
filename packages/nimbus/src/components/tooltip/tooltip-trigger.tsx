import { TooltipTrigger as RATooltipTrigger } from "react-aria-components";

/**
 * TooltipTrigger
 * ============================================================
 * TooltipTrigger wraps around a trigger element and a Tooltip.
 * It handles opening and closing the Tooltip when the user hovers over or focuses the trigger,
 * and positioning the Tooltip relative to the trigger.
 *
 * Directly exported from `react-aria-components`
 * - [React Aria Components Tooltip Documentation](https://react-spectrum.adobe.com/react-aria/Tooltip.html)
 */
export const TooltipTrigger = RATooltipTrigger;
// @ts-expect-error displaynames can be set on component instances, necessary for pretty react-live output
TooltipTrigger.displayName = "TooltipTrigger";
