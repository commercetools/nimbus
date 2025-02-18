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

import { mergeRefs } from "@chakra-ui/react";

/**
 * FocusableTooltipTrigger
 * ============================================================
 * A helper component that adds props from `react-aria`s `useFocusable` hook
 * to its child so that it can be used as a trigger element for a `Tooltip`
 *
 * Caveats:
 * - Using non-interactive elements as tooltip triggers is against ARIA best-practices,
 *   it is your responsibility to ensure that the underlying trigger element handles
 *   focus and hover interactions correctly for keyboard-only users
 *
 * Features:
 * - allows forwarding refs to the underlying DOM element
 * - accepts all native html 'HTMLElement' attributes (including aria- & data-attributes)
 *
 * Further Context:
 * - [React Aria Components Tooltip Documentation](https://react-spectrum.adobe.com/react-aria/Tooltip.html)
 * - [React Aria Components Issue re:Tooltip with custom trigger](https://github.com/adobe/react-spectrum/issues/5733#issuecomment-1918691983)
 * - [ARIA Tooltip Pattern](https://www.w3.org/TR/wai-aria-1.2/#tooltip)
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
FocusableTooltipTrigger.displayName = "FocusableTooltipTrigger";
