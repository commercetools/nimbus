import { ActivityIndicator } from "@/components/activity-indicator/activity-indicator";
import { ChatBubbleTypingSlot } from "../chat-bubble.slots";
import type { ChatBubbleTypingProps } from "../chat-bubble.types";

/**
 * ChatBubble.Typing - Animated "generating…" indicator for a streaming reply.
 *
 * Renders the Nimbus `ActivityIndicator` (three bouncing dots) inside the
 * bubble while a response streams. Place it as the bubble's payload and swap it
 * for the real content once the stream settles.
 *
 * Accessibility: the dots are decorative (`ActivityIndicator` is always
 * `aria-hidden`). Pass a visible label as `children` (e.g. "Assistant is
 * typing…") for a per-message affordance, and/or set `isStreaming` on
 * `ChatBubble.Root` (which sets `aria-busy`) — the coalesced live-region
 * announcement stays with the consumer's feed/turn container.
 *
 * @supportsStyleProps
 */
export const ChatBubbleTyping = ({
  ref,
  children,
  ...props
}: ChatBubbleTypingProps) => {
  return (
    <ChatBubbleTypingSlot ref={ref} {...props}>
      <ActivityIndicator />
      {children}
    </ChatBubbleTypingSlot>
  );
};

ChatBubbleTyping.displayName = "ChatBubble.Typing";
