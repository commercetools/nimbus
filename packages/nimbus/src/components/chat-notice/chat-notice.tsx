import { ChatNoticeRoot } from "./chat-notice.slots";
import type { ChatNoticeProps } from "./chat-notice.types";

/**
 * # ChatNotice
 *
 * A non-message interjection in a chat transcript — a system notice ("You left
 * the conversation", "Conversation history was cleared") or a divider. Rendered
 * centered, subdued, and avatar-less.
 *
 * ChatNotice is a **peer** of {@link ChatMessage}, not a part of it: its
 * presentation is the opposite of a message (no sender, no avatar, no actions),
 * so it is a separate component rather than a `ChatMessage` sender variant. Drop
 * it into a transcript (e.g. a `ChatMessageList` item) alongside messages.
 *
 * @see {@link https://nimbus-documentation.vercel.app/components/feedback/chat-notice}
 * @supportsStyleProps
 *
 * @example
 * ```tsx
 * <ChatNotice>Conversation history was cleared.</ChatNotice>
 * ```
 */
export const ChatNotice = ({ ref, children, ...props }: ChatNoticeProps) => {
  return (
    <ChatNoticeRoot ref={ref} {...props}>
      {children}
    </ChatNoticeRoot>
  );
};

ChatNotice.displayName = "ChatNotice";
