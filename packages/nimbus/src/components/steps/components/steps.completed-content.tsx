import { Steps as ChakraSteps } from "@chakra-ui/react/steps";
import { extractStyleProps } from "@/utils";
import type { StepsCompletedContentProps } from "../steps.types";
import { StepsCompletedContentSlot } from "../steps.slots";

/**
 * # Steps.CompletedContent
 *
 * Content displayed when all steps are complete.
 * Wraps Chakra UI's Steps.CompletedContent with Nimbus styling.
 *
 * @example
 * ```tsx
 * <Steps.Root defaultStep={0} count={3}>
 *   <Steps.List>...</Steps.List>
 *   <Steps.Content index={0}>Step 1</Steps.Content>
 *   <Steps.Content index={1}>Step 2</Steps.Content>
 *   <Steps.Content index={2}>Step 3</Steps.Content>
 *   <Steps.CompletedContent>
 *     All steps complete! Thank you.
 *   </Steps.CompletedContent>
 * </Steps.Root>
 * ```
 *
 * @supportsStyleProps
 */
export const StepsCompletedContent = (props: StepsCompletedContentProps) => {
  const { ref: forwardedRef, children, ...restProps } = props;

  const [styleProps, functionalProps] = extractStyleProps(restProps);

  return (
    <StepsCompletedContentSlot
      ref={forwardedRef}
      data-slot="completedContent"
      {...styleProps}
      asChild
    >
      <ChakraSteps.CompletedContent {...functionalProps}>
        {children}
      </ChakraSteps.CompletedContent>
    </StepsCompletedContentSlot>
  );
};
StepsCompletedContent.displayName = "Steps.CompletedContent";
