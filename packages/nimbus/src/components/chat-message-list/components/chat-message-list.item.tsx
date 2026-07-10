import { ChatMessageListItemSlot } from "../chat-message-list.slots";
import type { ChatMessageListItemProps } from "../chat-message-list.types";

/**
 * ChatMessageList.Item - One member of the transcript.
 *
 * The list-membership socket: it owns inter-item placement and the entry
 * presentation of a newly appended member, and is content-agnostic — it holds a
 * `ChatMessage`, a `ChatNotice`, or another member without reaching into it.
 * That child-agnosticism is what lets a system notice be a peer of a message
 * rather than a message variant.
 *
 * It deliberately does **not** assert `role="listitem"`, which would conflict
 * with the `log` live-region semantics of `ChatMessageList.Root`; it provides
 * DOM order and a structural styling hook only.
 *
 * @supportsStyleProps
 */
export const ChatMessageListItem = ({
  ref,
  children,
  ...props
}: ChatMessageListItemProps) => {
  return (
    <ChatMessageListItemSlot ref={ref} {...props}>
      {children}
    </ChatMessageListItemSlot>
  );
};

ChatMessageListItem.displayName = "ChatMessageList.Item";
