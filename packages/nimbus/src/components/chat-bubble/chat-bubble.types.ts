import type { OmitInternalProps } from "../../type-utils/omit-props";
import type {
  HTMLChakraProps,
  SlotRecipeProps,
  UnstyledProp,
} from "@chakra-ui/react/styled-system";
import type { AvatarProps } from "../avatar/avatar.types";

// ============================================================
// RECIPE PROPS
// ============================================================

type ChatBubbleRecipeProps = {
  /**
   * Who/what sent the message. Controls layout direction (avatar side) and the
   * sender-specific bubble/avatar styling:
   *
   * - `"agent"` (default) — assistant voice, avatar leading.
   * - `"user"` — the human, avatar trailing, `iris.3` surface.
   * - `"system"` — centered, subdued, avatar-less notice.
   * - `"tool"` — agent-side tool/function output on a subdued neutral surface.
   *
   * @default "agent"
   */
  sender?: SlotRecipeProps<"nimbusChatBubble">["sender"];
  /**
   * Status overlay, orthogonal to `sender`. `"error"` tints the bubble with the
   * critical palette to flag a failed generation — an *agent* message can fail,
   * so error is a tone rather than a sender.
   * @default "neutral"
   */
  tone?: SlotRecipeProps<"nimbusChatBubble">["tone"];
} & UnstyledProp;

// ============================================================
// SLOT PROPS
// ============================================================

export type ChatBubbleRootSlotProps = HTMLChakraProps<
  "div",
  ChatBubbleRecipeProps
>;

export type ChatBubbleAvatarSlotProps = HTMLChakraProps<"div">;

export type ChatBubbleBubbleSlotProps = HTMLChakraProps<"div">;

export type ChatBubbleActionsSlotProps = HTMLChakraProps<"div">;

export type ChatBubbleFooterSlotProps = HTMLChakraProps<"div">;

export type ChatBubbleTypingSlotProps = HTMLChakraProps<"div">;

// ============================================================
// MAIN PROPS
// ============================================================

/** Props for the ChatBubble.Root component. */
export type ChatBubbleProps = OmitInternalProps<ChatBubbleRootSlotProps> & {
  children?: React.ReactNode;
  /**
   * Override the rendered element. Defaults to `"article"` (a feed item, per
   * the ARIA APG); set e.g. `as="li"` when composing the message into a list.
   */
  as?: React.ElementType;
  /**
   * Marks the message as still being generated. Sets `aria-busy` on the root so
   * assistive tech knows the content is in flux. The live-region announcement
   * (e.g. wrapping the feed in `role="log" aria-live="polite"`) stays the
   * consumer's responsibility — see the accessibility docs.
   */
  isStreaming?: boolean;
  ref?: React.Ref<HTMLDivElement>;
  [key: `data-${string}`]: unknown;
};

/**
 * Props for the ChatBubble.Avatar component.
 *
 * Wraps the Nimbus {@link AvatarProps | Avatar} with `variant="solid"`; the
 * color palette is set automatically per `sender` by the recipe (the `solid`
 * variant resolves it to an accessible bg + text), so consumers only provide
 * the avatar content (initials, `src`, or an icon via `children`). Defaults to
 * `size="xs"` (a 32px box per the Figma spec).
 *
 * The avatar is **decorative by default** (`aria-hidden`) — the sender is better
 * conveyed by the message's accessible name and position than by a repeated
 * "avatar" node. Provide `firstName`/`lastName` or an explicit `aria-label` to
 * opt the avatar back into the accessibility tree with a meaningful name.
 */
export type ChatBubbleAvatarProps = AvatarProps;

/** Props for the ChatBubble.Bubble component. */
export type ChatBubbleBubbleProps =
  OmitInternalProps<ChatBubbleBubbleSlotProps> & {
    children?: React.ReactNode;
    ref?: React.Ref<HTMLDivElement>;
    [key: `data-${string}`]: unknown;
  };

/** Props for the ChatBubble.Actions component. */
export type ChatBubbleActionsProps =
  OmitInternalProps<ChatBubbleActionsSlotProps> & {
    children?: React.ReactNode;
    ref?: React.Ref<HTMLDivElement>;
    [key: `data-${string}`]: unknown;
  };

/** Props for the ChatBubble.Footer component. */
export type ChatBubbleFooterProps =
  OmitInternalProps<ChatBubbleFooterSlotProps> & {
    children?: React.ReactNode;
    ref?: React.Ref<HTMLDivElement>;
    [key: `data-${string}`]: unknown;
  };

/** Props for the ChatBubble.Typing component. */
export type ChatBubbleTypingProps =
  OmitInternalProps<ChatBubbleTypingSlotProps> & {
    /**
     * Optional visible label rendered beside the animated dots (e.g.
     * "Assistant is typing…"). The dots themselves are decorative
     * (`aria-hidden`); any text you pass here is the accessible affordance.
     */
    children?: React.ReactNode;
    ref?: React.Ref<HTMLDivElement>;
    [key: `data-${string}`]: unknown;
  };
