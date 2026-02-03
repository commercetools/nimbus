import { extractStyleProps } from "@/utils";
import type { StepsSeparatorProps } from "../steps.types";
import { StepsSeparatorSlot } from "../steps.slots";
import { useStepsContext } from "./steps.context";

/**
 * # Steps.Separator
 *
 * Visual line connecting step indicators.
 * Orientation and size are automatically determined from context.
 *
 * @example
 * ```tsx
 * <Steps.Item index={0}>...</Steps.Item>
 * <Steps.Separator />
 * <Steps.Item index={1}>...</Steps.Item>
 * ```
 */
export const StepsSeparator = (props: StepsSeparatorProps) => {
  const { ref: forwardedRef, ...restProps } = props;

  const { orientation } = useStepsContext();

  const [styleProps, functionalProps] = extractStyleProps(restProps);

  return (
    <StepsSeparatorSlot
      ref={forwardedRef}
      data-slot="separator"
      data-orientation={orientation}
      aria-hidden="true"
      {...styleProps}
      {...functionalProps}
    />
  );
};
StepsSeparator.displayName = "Steps.Separator";
