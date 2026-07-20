import { ChatMessageMetaSlot } from "../chat-message.slots";
import type { ChatMessageMetaProps } from "../chat-message.types";

/**
 * ChatMessage.Meta - Layout-only row rendered below the body.
 *
 * Renders a `space-between` flex row aligned with the body. Consumers provide
 * the content (timestamp, provenance/trust links, reaction icons). With a
 * single child, `space-between` leaves it at the start of the row — pair it
 * with a spacer or a second element to push content to the end.
 *
 * @supportsStyleProps
 */
export const ChatMessageMeta = ({
  ref,
  children,
  ...props
}: ChatMessageMetaProps) => {
  return (
    <ChatMessageMetaSlot ref={ref} {...props}>
      {children}
    </ChatMessageMetaSlot>
  );
};

ChatMessageMeta.displayName = "ChatMessage.Meta";
