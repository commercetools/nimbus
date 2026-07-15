import { FeedbackCardAction as FeedbackCardActionSlot } from "../feedback-card.slots";
import type { FeedbackCardActionProps } from "../feedback-card.types";

/**
 * FeedbackCard.Action — the layout slot for the action button.
 *
 * Positions a consumer-provided actionable element (e.g. a Nimbus `Button`).
 * Handles layout only and does not alter the element's behavior.
 *
 * @supportsStyleProps
 */
export const FeedbackCardAction = (props: FeedbackCardActionProps) => {
  const { ref: forwardedRef, children, ...restProps } = props;

  return (
    <FeedbackCardActionSlot ref={forwardedRef} {...restProps}>
      {children}
    </FeedbackCardActionSlot>
  );
};

FeedbackCardAction.displayName = "FeedbackCard.Action";
