import {
  cloneElement,
  isValidElement,
  useCallback,
  type ReactElement,
} from "react";
import { Steps as ChakraSteps, useStepsContext } from "@chakra-ui/react/steps";
import { extractStyleProps } from "@/utils";
import type { StepsNextTriggerProps } from "../steps.types";

/**
 * # Steps.NextTrigger
 *
 * Navigation button to go to next step.
 * Wraps Chakra UI's Steps.NextTrigger with Nimbus styling.
 *
 * @example
 * ```tsx
 * <Steps.NextTrigger asChild>
 *   <Button>Next</Button>
 * </Steps.NextTrigger>
 * ```
 *
 * @supportsStyleProps
 */
export const StepsNextTrigger = (props: StepsNextTriggerProps) => {
  const { children, asChild, ...restProps } = props;

  const [, functionalProps] = extractStyleProps(restProps);

  // Get steps context to manually handle navigation.
  // This avoids double-firing when using asChild with React Aria components
  // (like Nimbus Button) where both pointerUp and click events trigger navigation.
  const stepsContext = useStepsContext();

  const handlePress = useCallback(() => {
    stepsContext.goToNextStep();
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
      isDisabled: !stepsContext.hasNextStep,
    });
  }

  // Without asChild, use Chakra's NextTrigger directly
  return (
    <ChakraSteps.NextTrigger asChild={asChild} {...functionalProps}>
      {children}
    </ChakraSteps.NextTrigger>
  );
};
StepsNextTrigger.displayName = "Steps.NextTrigger";
