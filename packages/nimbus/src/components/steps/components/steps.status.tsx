import { Steps as ChakraSteps } from "@chakra-ui/react/steps";
import type { StepsStatusProps } from "../steps.types";

/**
 * # Steps.Status
 *
 * Renders different content based on step state.
 * This is a render prop component from Chakra UI that doesn't need a slot.
 *
 * @example
 * ```tsx
 * <Steps.Indicator>
 *   <Steps.Status
 *     complete={<CheckIcon />}
 *     incomplete={<Steps.Number />}
 *     current={<LoadingIcon />}
 *   />
 * </Steps.Indicator>
 * ```
 */
export const StepsStatus = (props: StepsStatusProps) => {
  return <ChakraSteps.Status {...props} />;
};
StepsStatus.displayName = "Steps.Status";
