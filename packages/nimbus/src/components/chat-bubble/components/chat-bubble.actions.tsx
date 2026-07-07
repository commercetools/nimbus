import { ChatBubbleActionsSlot } from "../chat-bubble.slots";
import type { ChatBubbleActionsProps } from "../chat-bubble.types";

/**
 * ChatBubble.Actions - Layout-only row for action buttons inside the bubble.
 *
 * Renders a right-aligned, wrapping flex row. Consumers provide the buttons.
 *
 * @supportsStyleProps
 */
export const ChatBubbleActions = ({
  ref,
  children,
  ...props
}: ChatBubbleActionsProps) => {
  return (
    <ChatBubbleActionsSlot ref={ref} {...props}>
      {children}
    </ChatBubbleActionsSlot>
  );
};

ChatBubbleActions.displayName = "ChatBubble.Actions";
