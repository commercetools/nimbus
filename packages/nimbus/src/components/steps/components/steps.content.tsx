import { Steps as ChakraSteps } from "@chakra-ui/react/steps";
import { extractStyleProps } from "@/utils";
import type { StepsContentProps } from "../steps.types";
import { StepsContentSlot } from "../steps.slots";

/**
 * # Steps.Content
 *
 * Content container that auto-shows/hides based on current step.
 * Wraps Chakra UI's Steps.Content with Nimbus styling.
 *
 * @example
 * ```tsx
 * <Steps.Content index={0}>
 *   <AccountForm />
 * </Steps.Content>
 * <Steps.Content index={1}>
 *   <ProfileForm />
 * </Steps.Content>
 * ```
 *
 * @supportsStyleProps
 */
export const StepsContent = (props: StepsContentProps) => {
  const { ref: forwardedRef, index, children, ...restProps } = props;

  const [styleProps, functionalProps] = extractStyleProps(restProps);

  return (
    <StepsContentSlot
      ref={forwardedRef}
      data-slot="content"
      {...styleProps}
      asChild
    >
      <ChakraSteps.Content index={index} {...functionalProps}>
        {children}
      </ChakraSteps.Content>
    </StepsContentSlot>
  );
};
StepsContent.displayName = "Steps.Content";
