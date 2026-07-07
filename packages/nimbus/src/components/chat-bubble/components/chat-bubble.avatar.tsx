import { Avatar } from "@/components/avatar/avatar";
import { ChatBubbleAvatarSlot } from "../chat-bubble.slots";
import type { ChatBubbleAvatarProps } from "../chat-bubble.types";

/**
 * ChatBubble.Avatar - The sender's avatar.
 *
 * Wraps the Nimbus `Avatar` (defaulting to `size="2xs"`). The background and
 * icon color are applied automatically per `sender` by the ChatBubble recipe,
 * so consumers only supply the avatar content (initials via `firstName`/
 * `lastName`, an image `src`, or a custom icon via `children`).
 *
 * @supportsStyleProps
 */
export const ChatBubbleAvatar = ({
  ref,
  size = "2xs",
  ...props
}: ChatBubbleAvatarProps) => {
  return (
    <ChatBubbleAvatarSlot>
      <Avatar ref={ref} size={size} {...props} />
    </ChatBubbleAvatarSlot>
  );
};

ChatBubbleAvatar.displayName = "ChatBubble.Avatar";
