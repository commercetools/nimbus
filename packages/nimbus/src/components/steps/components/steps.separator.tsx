import { Steps as ChakraSteps } from "@chakra-ui/react/steps";
import { extractStyleProps } from "@/utils";
import type { StepsSeparatorProps } from "../steps.types";
import { StepsSeparatorSlot } from "../steps.slots";

/**
 * # Steps.Separator
 *
 * Visual line connecting step indicators.
 * Wraps Chakra UI's Steps.Separator with Nimbus styling.
 *
 * @example
 * ```tsx
 * <Steps.Item index={0}>
 *   <Steps.Trigger>...</Steps.Trigger>
 *   <Steps.Separator />
 * </Steps.Item>
 * ```
 *
 * @supportsStyleProps
 */
export const StepsSeparator = (props: StepsSeparatorProps) => {
  const { ref: forwardedRef, ...restProps } = props;

  const [styleProps, functionalProps] = extractStyleProps(restProps);

  return (
    <StepsSeparatorSlot
      ref={forwardedRef}
      data-slot="separator"
      {...styleProps}
      asChild
    >
      <ChakraSteps.Separator {...functionalProps} />
    </StepsSeparatorSlot>
  );
};
StepsSeparator.displayName = "Steps.Separator";
