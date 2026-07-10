import { ChatMessageBubbleSlot } from "../chat-message.slots";
import type { ChatMessageBubbleProps } from "../chat-message.types";

/**
 * ChatMessage.Bubble - The rounded card that holds the message payload.
 *
 * Stacks its children vertically; place `ChatMessage.Actions` as the last child
 * to pin action buttons to the bottom of the bubble. Background, padding,
 * border-radius and max-width are set per `sender` by the recipe.
 *
 * @supportsStyleProps
 */
export const ChatMessageBubble = ({
  ref,
  children,
  ...props
}: ChatMessageBubbleProps) => {
  return (
    <ChatMessageBubbleSlot ref={ref} {...props}>
      {children}
    </ChatMessageBubbleSlot>
  );
};

ChatMessageBubble.displayName = "ChatMessage.Bubble";
