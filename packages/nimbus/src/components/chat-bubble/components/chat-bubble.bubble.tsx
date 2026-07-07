import { ChatBubbleBubbleSlot } from "../chat-bubble.slots";
import type { ChatBubbleBubbleProps } from "../chat-bubble.types";

/**
 * ChatBubble.Bubble - The rounded card that holds the message payload.
 *
 * Stacks its children vertically; place `ChatBubble.Actions` as the last child
 * to pin action buttons to the bottom of the bubble. Background, padding,
 * border-radius and max-width are set per `sender` by the recipe.
 *
 * @supportsStyleProps
 */
export const ChatBubbleBubble = ({
  ref,
  children,
  ...props
}: ChatBubbleBubbleProps) => {
  return (
    <ChatBubbleBubbleSlot ref={ref} {...props}>
      {children}
    </ChatBubbleBubbleSlot>
  );
};

ChatBubbleBubble.displayName = "ChatBubble.Bubble";
