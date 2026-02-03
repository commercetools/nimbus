import { extractStyleProps } from "@/utils";
import type { StepsContentProps } from "../steps.types";
import { StepsContentSlot } from "../steps.slots";

/**
 * # Steps.Content
 *
 * Container for step label and optional description.
 *
 * @example
 * ```tsx
 * <Steps.Content>
 *   <Steps.Label>Step Title</Steps.Label>
 *   <Steps.Description>Optional description</Steps.Description>
 * </Steps.Content>
 * ```
 */
export const StepsContent = (props: StepsContentProps) => {
  const { ref: forwardedRef, children, ...restProps } = props;

  const [styleProps, functionalProps] = extractStyleProps(restProps);

  return (
    <StepsContentSlot
      ref={forwardedRef}
      data-slot="content"
      {...styleProps}
      {...functionalProps}
    >
      {children}
    </StepsContentSlot>
  );
};
StepsContent.displayName = "Steps.Content";
