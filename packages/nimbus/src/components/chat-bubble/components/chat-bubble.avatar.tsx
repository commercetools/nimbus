import { Avatar } from "@/components/avatar/avatar";
import { ChatBubbleAvatarSlot } from "../chat-bubble.slots";
import type { ChatBubbleAvatarProps } from "../chat-bubble.types";

/**
 * ChatBubble.Avatar - The sender's avatar.
 *
 * Wraps the Nimbus `Avatar` (defaulting to `size="xs"`, a 32px box per the
 * Figma spec). The background and
 * icon color are applied automatically per `sender` by the ChatBubble recipe,
 * so consumers only supply the avatar content (initials via `firstName`/
 * `lastName`, an image `src`, or a custom icon via `children`).
 *
 * Props flow to the **inner `Avatar`**, not to the grid-cell wrapper — the
 * wrapper only exists to occupy the avatar column.
 *
 * Accessibility: the avatar is **decorative by default** (`aria-hidden`). A
 * sender glyph duplicates information better conveyed by the message's
 * accessible name and column, and a nameless `Avatar` would otherwise announce
 * a misleading generic label. Passing `firstName`/`lastName` or an explicit
 * `aria-label` opts it back into the accessibility tree with a real name.
 *
 * @supportsStyleProps
 */
export const ChatBubbleAvatar = ({
  ref,
  size = "xs",
  ...props
}: ChatBubbleAvatarProps) => {
  const isNamed =
    props.firstName != null ||
    props.lastName != null ||
    props["aria-label"] != null;

  return (
    <ChatBubbleAvatarSlot>
      <Avatar
        ref={ref}
        size={size}
        // Decorative unless the consumer named it; `props` is spread last so an
        // explicit `aria-hidden` from the consumer still wins.
        aria-hidden={isNamed ? undefined : true}
        {...props}
      />
    </ChatBubbleAvatarSlot>
  );
};

ChatBubbleAvatar.displayName = "ChatBubble.Avatar";
