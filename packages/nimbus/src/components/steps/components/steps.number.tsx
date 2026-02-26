import { Steps as ChakraSteps } from "@chakra-ui/react/steps";
import { extractStyleProps } from "@/utils";
import type { StepsNumberProps } from "../steps.types";
import { StepsNumberSlot } from "../steps.slots";

/**
 * # Steps.Number
 *
 * Displays the step number (1-indexed).
 * Wraps Chakra UI's Steps.Number with Nimbus styling.
 *
 * @example
 * ```tsx
 * <Steps.Indicator>
 *   <Steps.Number />
 * </Steps.Indicator>
 * ```
 *
 * @supportsStyleProps
 */
export const StepsNumber = (props: StepsNumberProps) => {
  const { ref: forwardedRef, ...restProps } = props;

  const [styleProps, functionalProps] = extractStyleProps(restProps);

  return (
    <StepsNumberSlot
      ref={forwardedRef}
      data-slot="number"
      {...styleProps}
      asChild
    >
      <ChakraSteps.Number {...functionalProps} />
    </StepsNumberSlot>
  );
};
StepsNumber.displayName = "Steps.Number";
