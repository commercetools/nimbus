import { Steps as ChakraSteps } from "@chakra-ui/react/steps";
import { extractStyleProps } from "@/utils";
import type { StepsIndicatorProps } from "../steps.types";
import { StepsIndicatorSlot } from "../steps.slots";

/**
 * # Steps.Indicator
 *
 * Visual marker showing step status (number, icon, or custom content).
 * Wraps Chakra UI's Steps.Indicator with Nimbus styling.
 *
 * @example
 * ```tsx
 * // Default indicator (shows number and checkmark when complete)
 * <Steps.Indicator />
 *
 * // Custom content
 * <Steps.Indicator>
 *   <MyCustomIcon />
 * </Steps.Indicator>
 * ```
 *
 * @supportsStyleProps
 */
export const StepsIndicator = (props: StepsIndicatorProps) => {
  const { ref: forwardedRef, children, ...restProps } = props;

  const [styleProps, functionalProps] = extractStyleProps(restProps);

  return (
    <StepsIndicatorSlot
      ref={forwardedRef}
      data-slot="indicator"
      {...styleProps}
      asChild
    >
      <ChakraSteps.Indicator {...functionalProps}>
        {children}
      </ChakraSteps.Indicator>
    </StepsIndicatorSlot>
  );
};
StepsIndicator.displayName = "Steps.Indicator";
