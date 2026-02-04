import { extractStyleProps } from "@/utils";
import type { StepsItemProps, StepsItemContextValue } from "../steps.types";
import { StepsItemSlot } from "../steps.slots";
import { useStepsContext, StepsItemContext } from "./steps.context";

/**
 * # Steps.Item
 *
 * Container for a single step. Automatically derives state from its index
 * relative to the current step.
 *
 * @example
 * ```tsx
 * <Steps.Item index={0}>
 *   <Steps.Indicator type="numeric" />
 *   <Steps.Content>
 *     <Steps.Label>Step Title</Steps.Label>
 *     <Steps.Description>Optional description</Steps.Description>
 *   </Steps.Content>
 * </Steps.Item>
 * ```
 *
 * @supportsStyleProps
 */
export const StepsItem = (props: StepsItemProps) => {
  const { ref: forwardedRef, index, children, ...restProps } = props;

  const { step, count } = useStepsContext();

  // Derive state from index relative to current step
  const state: StepsItemContextValue["state"] =
    index < step ? "complete" : index === step ? "current" : "incomplete";
  const isCurrent = index === step;

  const [styleProps, functionalProps] = extractStyleProps(restProps);

  const itemContextValue: StepsItemContextValue = {
    index,
    state,
  };

  return (
    <StepsItemContext.Provider value={itemContextValue}>
      <StepsItemSlot
        ref={forwardedRef}
        data-slot="item"
        data-state={state}
        role="listitem"
        aria-current={isCurrent ? "step" : undefined}
        aria-label={`Step ${index + 1} of ${count}: ${state}`}
        {...styleProps}
        {...functionalProps}
      >
        {children}
      </StepsItemSlot>
    </StepsItemContext.Provider>
  );
};
StepsItem.displayName = "Steps.Item";
