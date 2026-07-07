import { ChatBubbleFeedbackSlot } from "../chat-bubble.slots";
import type { ChatBubbleFeedbackProps } from "../chat-bubble.types";

/**
 * ChatBubble.Feedback - Layout-only row rendered below the bubble.
 *
 * Renders a `space-between` flex row aligned with the bubble. Consumers provide
 * the content (timestamp, trust affordances, reaction icons, links).
 *
 * @supportsStyleProps
 */
export const ChatBubbleFeedback = ({
  ref,
  children,
  ...props
}: ChatBubbleFeedbackProps) => {
  return (
    <ChatBubbleFeedbackSlot ref={ref} {...props}>
      {children}
    </ChatBubbleFeedbackSlot>
  );
};

ChatBubbleFeedback.displayName = "ChatBubble.Feedback";
