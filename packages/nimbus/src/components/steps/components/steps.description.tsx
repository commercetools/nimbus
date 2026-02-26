import { Steps as ChakraSteps } from "@chakra-ui/react/steps";
import { extractStyleProps } from "@/utils";
import type { StepsDescriptionProps } from "../steps.types";
import { StepsDescriptionSlot } from "../steps.slots";

/**
 * # Steps.Description
 *
 * Displays optional hint text below the title.
 * Wraps Chakra UI's Steps.Description with Nimbus styling.
 *
 * @example
 * ```tsx
 * <Steps.Trigger>
 *   <Steps.Indicator />
 *   <Box>
 *     <Steps.Title>Account</Steps.Title>
 *     <Steps.Description>Create your account</Steps.Description>
 *   </Box>
 * </Steps.Trigger>
 * ```
 *
 * @supportsStyleProps
 */
export const StepsDescription = (props: StepsDescriptionProps) => {
  const { ref: forwardedRef, children, ...restProps } = props;

  const [styleProps, functionalProps] = extractStyleProps(restProps);

  return (
    <StepsDescriptionSlot
      ref={forwardedRef}
      data-slot="description"
      {...styleProps}
      asChild
    >
      <ChakraSteps.Description {...functionalProps}>
        {children}
      </ChakraSteps.Description>
    </StepsDescriptionSlot>
  );
};
StepsDescription.displayName = "Steps.Description";
