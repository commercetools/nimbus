import { extractStyleProps } from "@/utils";
import type { StepsListProps } from "../steps.types";
import { StepsListSlot } from "../steps.slots";

/**
 * # Steps.List
 *
 * Flex container that wraps all step items and separators.
 *
 * @example
 * ```tsx
 * <Steps.List>
 *   <Steps.Item index={0}>...</Steps.Item>
 *   <Steps.Separator />
 *   <Steps.Item index={1}>...</Steps.Item>
 * </Steps.List>
 * ```
 *
 * @supportsStyleProps
 */
export const StepsList = (props: StepsListProps) => {
  const { ref: forwardedRef, children, ...restProps } = props;

  const [styleProps, functionalProps] = extractStyleProps(restProps);

  return (
    <StepsListSlot
      ref={forwardedRef}
      data-slot="list"
      role="list"
      aria-label="Progress steps"
      {...styleProps}
      {...functionalProps}
    >
      {children}
    </StepsListSlot>
  );
};
StepsList.displayName = "Steps.List";
