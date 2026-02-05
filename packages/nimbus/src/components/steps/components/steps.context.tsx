// Re-export Chakra Steps contexts
// These are provided by Chakra UI's Steps component
import { Steps as ChakraSteps } from "@chakra-ui/react";

/**
 * Context for accessing the Steps state.
 * Provided by Chakra UI's Steps.Root component.
 *
 * @example
 * ```tsx
 * <Steps.Context>
 *   {({ step }) => <div>Current step: {step}</div>}
 * </Steps.Context>
 * ```
 */
export const StepsContext: typeof ChakraSteps.Context = ChakraSteps.Context;

/**
 * Context for accessing the current StepsItem state.
 * Provided by Chakra UI's Steps.Item component.
 *
 * @example
 * ```tsx
 * <Steps.ItemContext>
 *   {({ index }) => <div>Step index: {index}</div>}
 * </Steps.ItemContext>
 * ```
 */
export const StepsItemContext: typeof ChakraSteps.ItemContext =
  ChakraSteps.ItemContext;
