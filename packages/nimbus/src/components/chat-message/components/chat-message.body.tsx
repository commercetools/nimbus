import { ChatMessageBodySlot } from "../chat-message.slots";
import type { ChatMessageBodyProps } from "../chat-message.types";

/**
 * ChatMessage.Body - The rounded card that holds the message payload.
 *
 * Stacks its children vertically; place `ChatMessage.Actions` as the last child
 * to pin action buttons to the bottom of the body. Background, padding,
 * border-radius and max-width are set per `sender` by the recipe.
 *
 * @supportsStyleProps
 */
export const ChatMessageBody = ({
  ref,
  children,
  ...props
}: ChatMessageBodyProps) => {
  return (
    <ChatMessageBodySlot ref={ref} {...props}>
      {children}
    </ChatMessageBodySlot>
  );
};

ChatMessageBody.displayName = "ChatMessage.Body";
