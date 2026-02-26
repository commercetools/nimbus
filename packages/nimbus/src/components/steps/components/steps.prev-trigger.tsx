import {
  cloneElement,
  isValidElement,
  useCallback,
  type ReactElement,
} from "react";
import { Steps as ChakraSteps, useStepsContext } from "@chakra-ui/react/steps";
import { extractStyleProps } from "@/utils";
import type { StepsPrevTriggerProps } from "../steps.types";

/**
 * # Steps.PrevTrigger
 *
 * Navigation button to go to previous step.
 * Wraps Chakra UI's Steps.PrevTrigger with Nimbus styling.
 *
 * @example
 * ```tsx
 * <Steps.PrevTrigger asChild>
 *   <Button>Back</Button>
 * </Steps.PrevTrigger>
 * ```
 *
 * @supportsStyleProps
 */
export const StepsPrevTrigger = (props: StepsPrevTriggerProps) => {
  const { children, asChild, ...restProps } = props;

  const [, functionalProps] = extractStyleProps(restProps);

  // Get steps context to manually handle navigation.
  // This avoids double-firing when using asChild with React Aria components
  // (like Nimbus Button) where both pointerUp and click events trigger navigation.
  const stepsContext = useStepsContext();

  const handlePress = useCallback(() => {
    stepsContext.goToPrevStep();
  }, [stepsContext]);

  // When using asChild, manually handle navigation via context
  // using onPress (React Aria's event) to avoid double-firing from
  // both pointerUp and click events.
  if (asChild && isValidElement(children)) {
    const child = children as ReactElement<{
      onPress?: () => void;
      isDisabled?: boolean;
    }>;

    return cloneElement(child, {
      onPress: handlePress,
      isDisabled: !stepsContext.hasPrevStep,
    });
  }

  // Without asChild, use Chakra's PrevTrigger directly
  return (
    <ChakraSteps.PrevTrigger asChild={asChild} {...functionalProps}>
      {children}
    </ChakraSteps.PrevTrigger>
  );
};
StepsPrevTrigger.displayName = "Steps.PrevTrigger";
