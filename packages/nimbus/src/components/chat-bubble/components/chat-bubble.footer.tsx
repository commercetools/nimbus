import { ChatBubbleFooterSlot } from "../chat-bubble.slots";
import type { ChatBubbleFooterProps } from "../chat-bubble.types";

/**
 * ChatBubble.Footer - Layout-only row rendered below the bubble.
 *
 * Renders a `space-between` flex row aligned with the bubble. Consumers provide
 * the content (timestamp, provenance/trust links, reaction icons). With a
 * single child, `space-between` leaves it at the start of the row — pair it
 * with a spacer or a second element to push content to the end.
 *
 * @supportsStyleProps
 */
export const ChatBubbleFooter = ({
  ref,
  children,
  ...props
}: ChatBubbleFooterProps) => {
  return (
    <ChatBubbleFooterSlot ref={ref} {...props}>
      {children}
    </ChatBubbleFooterSlot>
  );
};

ChatBubbleFooter.displayName = "ChatBubble.Footer";
