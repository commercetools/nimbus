import { extractStyleProps } from "@/utils";
import type { StepsDescriptionProps } from "../steps.types";
import { StepsDescriptionSlot } from "../steps.slots";

/**
 * # Steps.Description
 *
 * Displays optional hint text below the label.
 *
 * @example
 * ```tsx
 * <Steps.Description>Create your account to get started</Steps.Description>
 * ```
 */
export const StepsDescription = (props: StepsDescriptionProps) => {
  const { ref: forwardedRef, children, ...restProps } = props;

  const [styleProps, functionalProps] = extractStyleProps(restProps);

  return (
    <StepsDescriptionSlot
      ref={forwardedRef}
      data-slot="description"
      {...styleProps}
      {...functionalProps}
    >
      {children}
    </StepsDescriptionSlot>
  );
};
StepsDescription.displayName = "Steps.Description";
