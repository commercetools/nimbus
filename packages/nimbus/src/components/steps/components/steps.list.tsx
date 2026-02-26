import { Steps as ChakraSteps } from "@chakra-ui/react/steps";
import { extractStyleProps } from "@/utils";
import type { StepsListProps } from "../steps.types";
import { StepsListSlot } from "../steps.slots";

/**
 * # Steps.List
 *
 * Container for grouping step items. Wraps Chakra UI's Steps.List
 * with Nimbus styling.
 *
 * @example
 * ```tsx
 * <Steps.List>
 *   <Steps.Item index={0}>...</Steps.Item>
 *   <Steps.Item index={1}>...</Steps.Item>
 * </Steps.List>
 * ```
 *
 * @supportsStyleProps
 */
export const StepsList = (props: StepsListProps) => {
  const { ref: forwardedRef, children, ...restProps } = props;

  const [styleProps, functionalProps] = extractStyleProps(restProps);

  return (
    <StepsListSlot ref={forwardedRef} data-slot="list" {...styleProps} asChild>
      <ChakraSteps.List {...functionalProps}>{children}</ChakraSteps.List>
    </StepsListSlot>
  );
};
StepsList.displayName = "Steps.List";
