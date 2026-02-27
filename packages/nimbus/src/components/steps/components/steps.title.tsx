import { Steps as ChakraSteps } from "@chakra-ui/react/steps";
import { extractStyleProps } from "@/utils";
import type { StepsTitleProps } from "../steps.types";
import { StepsTitleSlot } from "../steps.slots";

/**
 * # Steps.Title
 *
 * Displays the step title.
 * Wraps Chakra UI's Steps.Title with Nimbus styling.
 *
 * @example
 * ```tsx
 * <Steps.Trigger>
 *   <Steps.Indicator />
 *   <Steps.Title>Account Setup</Steps.Title>
 * </Steps.Trigger>
 * ```
 *
 * @supportsStyleProps
 */
export const StepsTitle = (props: StepsTitleProps) => {
  const { ref: forwardedRef, children, ...restProps } = props;

  const [styleProps, functionalProps] = extractStyleProps(restProps);

  return (
    <StepsTitleSlot
      ref={forwardedRef}
      data-slot="title"
      {...styleProps}
      asChild
    >
      <ChakraSteps.Title {...functionalProps}>{children}</ChakraSteps.Title>
    </StepsTitleSlot>
  );
};
StepsTitle.displayName = "Steps.Title";
