import { FeedbackCardContent as FeedbackCardContentSlot } from "../feedback-card.slots";
import type { FeedbackCardContentProps } from "../feedback-card.types";

/**
 * FeedbackCard.Content — the text area.
 *
 * A vertical stack for consumer-provided children (typically a title and
 * subtitle composed from Nimbus primitives). Grows to fill the row.
 *
 * @supportsStyleProps
 */
export const FeedbackCardContent = (props: FeedbackCardContentProps) => {
  const { ref: forwardedRef, children, ...restProps } = props;

  return (
    <FeedbackCardContentSlot ref={forwardedRef} {...restProps}>
      {children}
    </FeedbackCardContentSlot>
  );
};

FeedbackCardContent.displayName = "FeedbackCard.Content";
