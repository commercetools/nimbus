import {
  cloneElement,
  forwardRef,
  useRef,
  type PropsWithChildren,
  isValidElement,
} from "react";
import {
  mergeProps,
  useObjectRef,
  useFocusable,
  type FocusableOptions,
} from "react-aria";
import {
  Tooltip as RATooltip,
  TooltipTrigger as RATooltipTrigger,
} from "react-aria-components";
import { mergeRefs } from "@chakra-ui/react";
import { TooltipRoot } from "./tooltip.slots";
import type { TooltipProps } from "./tooltip.types";
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

/**
 * FocusableTooltipTrigger
 * ============================================================
 * A helper component that adds props from `react-aria`s `useFocusable` hook
 * to its child so that it can be used as a trigger element for a `Tooltip`
 * - [React Aria Components Tooltip Documentation](https://react-spectrum.adobe.com/react-aria/Tooltip.html)
 * - [React Aria Components Issue re:Tooltip with custom trigger](https://github.com/adobe/react-spectrum/issues/5733#issuecomment-1918691983)
 * - [ARIA Tooltip Pattern](https://www.w3.org/TR/wai-aria-1.2/#tooltip)
 *
 * Caveats:
 *
 * - Using non-interactive elements as tooltip triggers is against ARIA best-practices,
 *   it is your responsibility to ensure that the underlying trigger element handles
 *   focus and hover interactions correctly for keyboard-only users
 *
 * Features:
 *
 * - allows forwarding refs to the underlying DOM element
 * - accepts all native html 'HTMLElement' attributes (including aria- & data-attributes)
 */
export const FocusableTooltipTrigger = forwardRef<
  HTMLElement,
  PropsWithChildren<FocusableOptions<HTMLElement>>
>(function FocusableTooltipTrigger(props, forwardedRef) {
  const localRef = useRef<HTMLElement>(null);
  const ref = useObjectRef(mergeRefs(localRef, forwardedRef));
  const { focusableProps } = useFocusable(props, ref);
  if (isValidElement(props.children)) {
    return cloneElement(
      props.children,
      mergeProps(
        focusableProps,
        props.children.props as PropsWithChildren<
          FocusableOptions<HTMLElement>
        >,
        { ref: ref }
      )
    );
  }
});

/**
 * Tooltip
 * ============================================================
 * A contextual popup that displays a description for an element, uses `Tooltip` component from `react-aria-components`.
 * - [React Aria Components Tooltip Documentation](https://react-spectrum.adobe.com/react-aria/Tooltip.html)
 * - [ARIA Tooltip Pattern](https://www.w3.org/TR/wai-aria-1.2/#tooltip)
 *
 * Features:
 * - allows forwarding refs to the underlying DOM element
 * - accepts all native html 'HTMLSpanElement' attributes (including aria- & data-attributes)
 * - supports 'variants', 'sizes', etc. configured in the recipe
 * - allows overriding styles by using style-props
 */

export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  function Tooltip({ children, ...props }, ref) {
    return (
      <TooltipRoot asChild {...props}>
        <RATooltip ref={ref} {...props}>
          {children}
        </RATooltip>
      </TooltipRoot>
    );
  }
);
Tooltip.displayName = "Tooltip";
