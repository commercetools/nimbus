import { extractStyleProps } from "@/utils";
import type { StepsLabelProps } from "../steps.types";
import { StepsLabelSlot } from "../steps.slots";

/**
 * # Steps.Label
 *
 * Displays the step title.
 *
 * @example
 * ```tsx
 * <Steps.Label>Account Setup</Steps.Label>
 * ```
 *
 * @supportsStyleProps
 */
export const StepsLabel = (props: StepsLabelProps) => {
  const { ref: forwardedRef, children, ...restProps } = props;

  const [styleProps, functionalProps] = extractStyleProps(restProps);

  return (
    <StepsLabelSlot
      ref={forwardedRef}
      data-slot="label"
      {...styleProps}
      {...functionalProps}
    >
      {children}
    </StepsLabelSlot>
  );
};
StepsLabel.displayName = "Steps.Label";
