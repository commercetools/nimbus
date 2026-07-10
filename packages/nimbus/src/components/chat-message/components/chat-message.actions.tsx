import { ChatMessageActionsSlot } from "../chat-message.slots";
import type { ChatMessageActionsProps } from "../chat-message.types";

/**
 * ChatMessage.Actions - Layout-only row for action buttons inside the bubble.
 *
 * Renders a right-aligned, wrapping flex row. Consumers provide the buttons.
 *
 * @supportsStyleProps
 */
export const ChatMessageActions = ({
  ref,
  children,
  ...props
}: ChatMessageActionsProps) => {
  return (
    <ChatMessageActionsSlot ref={ref} {...props}>
      {children}
    </ChatMessageActionsSlot>
  );
};

ChatMessageActions.displayName = "ChatMessage.Actions";
