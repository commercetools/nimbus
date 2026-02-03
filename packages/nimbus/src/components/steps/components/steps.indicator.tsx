import { Check } from "@commercetools/nimbus-icons";
import { extractStyleProps } from "@/utils";
import type { StepsIndicatorProps } from "../steps.types";
import { StepsIndicatorSlot } from "../steps.slots";
import { useStepsItemContext } from "./steps.context";

/**
 * # Steps.Indicator
 *
 * Visual indicator showing step number or icon.
 * When type="numeric", displays step number (1, 2, 3...) and shows checkmark when complete.
 * When type="icon", displays the provided icon with state-based styling.
 *
 * @example
 * ```tsx
 * // Numeric indicator
 * <Steps.Indicator type="numeric" />
 *
 * // Custom icon indicator
 * <Steps.Indicator type="icon" icon={<UserIcon />} />
 * ```
 */
export const StepsIndicator = (props: StepsIndicatorProps) => {
  const {
    ref: forwardedRef,
    type = "numeric",
    icon,
    showCompleteIcon = true,
    ...restProps
  } = props;

  const { index, state } = useStepsItemContext();

  const [styleProps, functionalProps] = extractStyleProps(restProps);

  const isComplete = state === "complete";

  // Determine what to render
  let content: React.ReactNode;
  if (type === "numeric") {
    if (isComplete && showCompleteIcon) {
      content = <Check />;
    } else {
      content = index + 1;
    }
  } else {
    // type === "icon"
    content = icon;
  }

  return (
    <StepsIndicatorSlot
      ref={forwardedRef}
      data-slot="indicator"
      data-state={state}
      aria-hidden="true"
      {...styleProps}
      {...functionalProps}
    >
      {content}
    </StepsIndicatorSlot>
  );
};
StepsIndicator.displayName = "Steps.Indicator";
