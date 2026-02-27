import { Steps as ChakraSteps } from "@chakra-ui/react/steps";
import { extractStyleProps } from "@/utils";
import type { StepsItemProps } from "../steps.types";
import { StepsItemSlot } from "../steps.slots";

/**
 * # Steps.Item
 *
 * Container for a single step (trigger + separator).
 * Wraps Chakra UI's Steps.Item with Nimbus styling.
 *
 * @example
 * ```tsx
 * <Steps.Item index={0}>
 *   <Steps.Trigger>
 *     <Steps.Indicator />
 *     Account
 *   </Steps.Trigger>
 *   <Steps.Separator />
 * </Steps.Item>
 * ```
 *
 * @supportsStyleProps
 */
export const StepsItem = (props: StepsItemProps) => {
  const { ref: forwardedRef, index, children, ...restProps } = props;

  const [styleProps, functionalProps] = extractStyleProps(restProps);

  return (
    <StepsItemSlot ref={forwardedRef} data-slot="item" {...styleProps} asChild>
      <ChakraSteps.Item index={index} {...functionalProps}>
        {children}
      </ChakraSteps.Item>
    </StepsItemSlot>
  );
};
StepsItem.displayName = "Steps.Item";
