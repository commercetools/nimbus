import { AutoAwesome } from "@commercetools/nimbus-icons";
import { Avatar } from "@/components/avatar/avatar";
import { ChatMessageAvatarSlot } from "../chat-message.slots";
import { useChatMessageContext } from "../chat-message.context";
import type { ChatMessageAvatarProps } from "../chat-message.types";

/**
 * ChatMessage.Avatar - The sender's avatar.
 *
 * Wraps the Nimbus `Avatar` (defaulting to `size="xs"`, a 32px box per the
 * Figma spec). Unless the consumer sets `variant` explicitly, the variant
 * defaults per `sender`: `solid` for the `agent` (a strong branded glyph) and
 * `subtle` for the `user` (a softer surface that matches the user body's tint).
 * The color *palette* comes from the ChatMessage recipe (`primary`), so
 * consumers only supply the avatar content (initials via `firstName`/
 * `lastName`, an image `src`, or a custom icon via `children`).
 *
 * An **unconfigured** avatar (no content supplied) falls back to a
 * sender-appropriate generic glyph: the AI `AutoAwesome` sparkle for the
 * `agent`, and the `Avatar`'s built-in person icon for the `user`.
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
export const ChatMessageAvatar = ({
  ref,
  size = "xs",
  variant,
  children,
  ...props
}: ChatMessageAvatarProps) => {
  const { sender } = useChatMessageContext();
  // Consumer's explicit `variant` wins; otherwise default per sender.
  const resolvedVariant = variant ?? (sender === "user" ? "subtle" : "solid");

  const isNamed =
    props.firstName != null ||
    props.lastName != null ||
    props["aria-label"] != null;

  // When the consumer supplies no content, give the agent an AI glyph instead
  // of the person fallback. The user keeps `Avatar`'s built-in person icon
  // (rendered when `children` is absent).
  const isUnconfigured =
    children == null &&
    props.firstName == null &&
    props.lastName == null &&
    props.src == null;
  const resolvedChildren =
    children ??
    (sender === "agent" && isUnconfigured ? <AutoAwesome /> : undefined);

  return (
    <ChatMessageAvatarSlot>
      <Avatar
        ref={ref}
        size={size}
        variant={resolvedVariant}
        // Decorative unless the consumer named it; `props` is spread last so an
        // explicit `aria-hidden` from the consumer still wins.
        aria-hidden={isNamed ? undefined : true}
        {...props}
      >
        {resolvedChildren}
      </Avatar>
    </ChatMessageAvatarSlot>
  );
};

ChatMessageAvatar.displayName = "ChatMessage.Avatar";
