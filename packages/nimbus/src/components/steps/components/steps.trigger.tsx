import { Steps as ChakraSteps } from "@chakra-ui/react/steps";
import { extractStyleProps } from "@/utils";
import type { StepsTriggerProps } from "../steps.types";
import { StepsTriggerSlot } from "../steps.slots";

/**
 * # Steps.Trigger
 *
 * Clickable element within each step for direct navigation.
 * Wraps Chakra UI's Steps.Trigger with Nimbus styling.
 *
 * @example
 * ```tsx
 * <Steps.Trigger>
 *   <Steps.Indicator />
 *   Account Setup
 * </Steps.Trigger>
 * ```
 *
 * @supportsStyleProps
 */
export const StepsTrigger = (props: StepsTriggerProps) => {
  const { ref: forwardedRef, children, ...restProps } = props;

  const [styleProps, functionalProps] = extractStyleProps(restProps);

  return (
    <StepsTriggerSlot
      ref={forwardedRef}
      data-slot="trigger"
      {...styleProps}
      asChild
    >
      <ChakraSteps.Trigger {...functionalProps}>{children}</ChakraSteps.Trigger>
    </StepsTriggerSlot>
  );
};
StepsTrigger.displayName = "Steps.Trigger";
